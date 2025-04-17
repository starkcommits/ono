import requests
import frappe
import json
from frappe import _

def order(doc, method):
    # Only process if this is a new unmatched order or a cancellation
    if doc.status == "UNMATCHED":
        user_id = frappe.session.user
        if doc.user_id:
            user_id = doc.user_id
        
        total_amount = doc.amount * doc.quantity  # Ensure total_amount is always defined

        order_book_data = {
            "market_id": doc.market_id,
            "quantity": doc.quantity
        }

        if doc.order_type == "BUY":
            wallet = frappe.db.sql("""
                SELECT name, balance FROM `tabUser Wallet`
                WHERE user = %s AND is_active = 1
            """, (user_id,), as_dict=True)

            if not wallet:
                frappe.msgprint("No active wallet found")
                frappe.throw(f"No active wallet found for {user_id}")

            if wallet[0]["balance"] < total_amount:
                frappe.msgprint("Insufficient balance")
                frappe.throw(f"Insufficient balance in {user_id}'s wallet")

            order_book_data["price"] = 10 - doc.amount
            order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"
        else:
            order_book_data["price"] = doc.amount
            order_book_data["opinion_type"] = doc.opinion_type

        payload = {
            "user_id": user_id,
            "order_id": doc.name,
            "filled_quantity": doc.filled_quantity,
            "status": doc.status,
            "market_id": doc.market_id,
            "option_type": doc.opinion_type,
            "price": doc.amount,
            "quantity": doc.quantity,
            "order_type": doc.order_type
        }
        
        # Set user_id without triggering save
        if not doc.user_id:
            frappe.db.set_value('Orders', doc.name, 'user_id', user_id, update_modified=False)
        
        # Commit the transaction to ensure user_id is saved
        frappe.db.commit()

        frappe.log_error("Order Payload", payload)
        try:
            url = "http://94.136.187.188:8086/orders/"
            response = requests.post(url, json=payload)
            if response.status_code != 201:
                # Update status without triggering the hook again
                frappe.db.set_value('Orders', doc.name, {
                    'status': "CANCELED",
                    'remark': "System canceled the order."
                }, update_modified=False)
                
                frappe.db.commit()
                
                error_text = response.text
                frappe.log_error("Order API Error: ", f"{response.status_code} - {error_text}")
                frappe.throw(f"Error from API: {error_text}")
            else:
                frappe.publish_realtime("order_book_event", order_book_data,after_commit=True)

                query = """
                    SELECT 
                        COUNT(DISTINCT user_id) AS traders
                    FROM `tabOrders`
                    WHERE status NOT IN ("CANCELED", "SETTLED")
                        AND market_id = %s
                """
                result = frappe.db.sql(query, (doc.market_id,), as_dict=True)
                
                market = frappe.get_doc("Market", doc.market_id)
                
                if market.total_traders != result[0]["traders"]:
                    # Update market traders count directly without triggering hooks
                    frappe.db.set_value('Market', doc.market_id, 'total_traders', result[0]["traders"], update_modified=False)
                    
                frappe.db.commit()

                frappe.msgprint("Order Created Successfully.")
        except requests.exceptions.RequestException as e:
            frappe.throw(f"Error sending order: {str(e)}")

    elif doc.status == "CANCELED": # and not doc.remark) or 
    #       (doc.status == "SETTLED" and doc.remark == "Sell order canceled in midway")) and not getattr(doc, '_cancel_processed', False):
    #     # Mark as processed to prevent recursion
    #     doc._cancel_processed = True
        
        try:
            url = f"http://94.136.187.188:8086/orders/{doc.name}"
            response = requests.delete(url)
            if response.status_code != 200:
                frappe.logger().error(f"Error response: {response.text}")
                frappe.throw(f"Cancel Order API error: {response.status_code} - {response.text}")
            else:
                frappe.msgprint("Order cancelled successfully.")
                
        except Exception as e:
            frappe.log_error("Error in order cancelling", f"{str(e)}")
            frappe.throw(f"Error in order cancelling: {str(e)}")


@frappe.whitelist(allow_guest=True)  # Allow external requests
def update_order():
    """Accepts order updates from FastAPI and updates the Order Doctype in Frappe."""
    
    try:
        # Parse incoming JSON data
        data = frappe._dict(frappe.request.get_json())
        
        frappe.log_error("Order matching", data)
        
        # Get order data for realtime updates, but don't modify it
        order = frappe.get_doc("Orders", data.order_id)

        order_status = data.status
        if order.order_type == "SELL" and data.status == "MATCHED":
            order_status = "SETTLED"

        # Update fields directly using db_set to avoid modification conflicts
        # This bypasses the document modified check
        frappe.db.set_value('Orders', data.order_id, {
            'status': order_status,
            'quantity': data.quantity,
            'filled_quantity': data.filled_quantity
        }, update_modified=True)  # Update modified timestamp

        
        order_book_data = {
            "market_id": order.market_id
        }
        
        if order.order_type == "BUY":
            order_book_data["price"] = 10 - order.amount
            order_book_data["opinion_type"] = "NO" if order.opinion_type == "YES" else "YES"
        else:
            order_book_data["price"] = order.amount
            order_book_data["opinion_type"] = order.opinion_type
        
        if data.status == "CANCELED":
            order_book_data["quantity"] = -(order.quantity - data.filled_quantity)
        else:
            order_book_data["quantity"] = -data.filled_quantity
        
        # Commit the transaction to ensure changes are saved
        frappe.db.commit()
        
        # Send realtime updates
        frappe.publish_realtime('order_event', {
            "order_id": data.order_id,
            "status": data.status,
            "filled_quantity": data.filled_quantity
        }, user=order.user_id,after_commit=True)  # Use order.user_id instead of frappe.session.user
        
        frappe.publish_realtime("order_book_event", order_book_data,after_commit=True)
        
        return {"status": "success", "message": "Order updated successfully", "order_id": order.name}
    
    except Exception as e:
        frappe.log_error(f"Order update failed:", f"{str(e)}")
        return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True)
def trades():
    """Handles trades updates."""
    try:
        data = frappe._dict(frappe.request.get_json())
        frappe.log_error("Trade Data", data)

        if "trades" not in data:
            return {"status": "error", "message": "Missing 'trades' key in request data"}

        for trade in data.trades:
            trade_doc = frappe.get_doc({
                "doctype": "Trades",
                "first_user_order_id": trade["first_user_order_id"],
                "second_user_order_id": trade["second_user_order_id"],
                "market_id": trade["market_id"],
                "first_user_id": trade["first_user_id"],
                "second_user_id": trade["second_user_id"],
                "first_user_price": trade["first_user_price"],
                "second_user_price": trade["second_user_price"],
                "quantity": trade["quantity"]
            })
            trade_doc.insert(ignore_permissions=True)

            if not "opinion_type" in trade:
                holding_doc1 = frappe.get_doc({
                    "doctype": "Holding",
                    "market_id": trade["market_id"],
                    "quantity": trade["quantity"],
                    "user_id": trade["first_user_id"],
                    "opinion_type": trade["first_user_opinion"],
                    "price": trade["first_user_price"],
                    "status": "Hold"
                })
                holding_doc1.insert(ignore_permissions=True)

                holding_doc2 = frappe.get_doc({
                    "doctype": "Holding",
                    "market_id": trade["market_id"],
                    "quantity": trade["quantity"],
                    "user_id": trade["second_user_id"],
                    "opinion_type": trade["second_user_opinion"],
                    "price": trade["second_user_price"],
                    "status": "Hold"
                })
                holding_doc2.insert(ignore_permissions=True)

            else:
                holding_doc = frappe.get_doc({
                    "doctype": "Holding",
                    "market_id": trade["market_id"],
                    "quantity": trade["quantity"],
                    "order_id": trade["first_user_order_id"],
                    "user_id": trade["first_user_id"],
                    "opinion_type": trade["first_user_opinion"],
                    "price": trade["first_user_price"]
                })
                holding_doc.filled_quantity +=  trade["quantity"]
                holding_doc.save(ignore_permissions= True)
                
                holding_doc2 = frappe.get_doc({
                    "doctype": "Holding",
                    "market_id": trade["market_id"],
                    "quantity": trade["quantity"],
                    "user_id": trade["second_user_id"],
                    "opinion_type": trade["second_user_opinion"],
                    "price": trade["second_user_price"]
                })
                holding_doc2.insert(ignore_permissions=True)

        frappe.db.commit()
        return {"status": "success", "message": f"{len(data.trades)} trades inserted successfully"}
    except Exception as e:
        frappe.log_error(f"Trade update failed: {str(e)}", "Trade_order")
        return {"status": "error", "message": str(e)}

def market(doc, method):
    try:

        if doc.status == "OPEN":
            # Convert closing_time to ISO format if needed
            if isinstance(doc.closing_time, str):
                # If it's already a string, ensure it's in ISO format
                closing_time = doc.closing_time
            else:
                # If it's a datetime object, convert to ISO
                closing_time = doc.closing_time.isoformat()
        
            payload = {
                "market_id": doc.name,
                "question": doc.question,
                "closing_time": closing_time,
                "status": doc.status
            }
        
            # For debugging
            frappe.logger().info(f"Sending payload to market engine: {payload}")
            
            url = "http://94.136.187.188:8086/markets/"
            response = requests.post(url, json=payload)
            
            if response.status_code != 201:
                frappe.logger().error(f"Error response: {response.text}")
                frappe.throw(f"API error: {response.status_code} - {response.text}")
            else:
                """Send real-time update via WebSockets"""
                update_data = {
                    "name": doc.name,
                    "status": doc.status,
                    "category": doc.category,
                    "question": doc.question,
                    "yes_price": doc.yes_price,
                    "no_price": doc.no_price,
                    "closing_time": doc.closing_time
                }
                
                frappe.publish_realtime("market_event",update_data,after_commit=True)
                frappe.msgprint("Market Created Successfully.")
    
    except Exception as e:
        frappe.log_error(f"Exception market: {str(e)}")

@frappe.whitelist(allow_guest=True)
def close_market():
    try:
        data = frappe._dict(frappe.request.get_json())

        frappe.log_error("Market Closed",data)
        if not data:
            return {"status": "error", "message": "Missing 'close market' key in request data"}

        url=f"http://94.136.187.188:8086/markets/{data.market_id}/close"
        response = requests.post(url)
            
        if response.status_code != 200:
            frappe.logger().error(f"Error response: {response.text}")
            frappe.throw(f"API error: {response.status_code} - {response.text}")
        else:
            market = frappe.get_doc("Market",data.market_id)

            market.status="CLOSED"
            market.save(ignore_permissions=True)
            frappe.db.commit()

            frappe.msgprint("Market Closed Successfully.")

            update_data = {
                "name": market.name,
                "status": market.status,
                "category": market.category
            }
            
            frappe.publish_realtime("market_event",update_data,after_commit=True)
            
            return {
                "status":"success","message":"Market closed"
            }
    except Exception as e:
        frappe.log_error("Error Closing market", f"{str(e)}")
        return {"status": "error", "message": "Error in closing market"}


@frappe.whitelist(allow_guest=True)
def resolve_market():
    try:
        data = frappe._dict(frappe.request.get_json())

        frappe.log_error("Market Resolve",data)
        if not data:
            return {"status": "error", "message": "Missing 'close market' key in request data"}
        payload = {
            "winning_side":data.winning_side
        }
        url=f"http://94.136.187.188:8086/markets/{data.market_id}/resolve"
        response = requests.post(url, json=payload)
            
        if response.status_code != 200:
            frappe.logger().error(f"Error response: {response.text}")
            frappe.throw(f"API error: {response.status_code} - {response.text}")
        else:
            market = frappe.get_doc("Market",data.market_id)

            """Send real-time update via WebSockets"""
            update_data = {
                "name": market.name,
                "status": market.status,
                "category": market.category
            }
            
            frappe.publish_realtime("market_event",update_data,after_commit=True)
            
            market.status="RESOLVED"
            market.end_result=data.winning_side
            market.save(ignore_permissions=True)
            frappe.db.commit()

            frappe.msgprint("Market resolved Successfully.")
        
            return {
                "status":"success","message":"Market resolved"
            }
        
    except Exception as e:
        frappe.log_error("Error Closing market", f"{str(e)}")
        return {"status": "error", "message": "Error in resolving market"}

@frappe.whitelist(allow_guest=True)
def unmatched_orders():
    try:
        data = frappe._dict(frappe.request.get_json())
        frappe.log_error("Unmatched Order Data", str(data))  # Log for debugging

        # Correcting key name
        for order_detail in data.unmatched_orders:
            # Fetch the order
            order = frappe.get_doc("Orders", order_detail["order_id"])

            # Update status and remarks
            order.status = order_detail["status"]
            order.quantity = order_detail["quantity"]
            order.filled_quantity = order_detail["filled_quantity"]
            order.remark = "Market Closed."
            order.save(ignore_permissions=True)

            # frappe.publish_realtime('order_event',{
            #     "order_id":order.name,
            #     "status":order.status,
            #     "filled_quantity":order.filled_quantity
            # },user=frappe.session.user,after_commit=True)

            # wallet_data = frappe.db.sql("""
            #     SELECT name, balance FROM `tabUser Wallet`
            #     WHERE user = %s AND is_active = 1
            #     FOR UPDATE
            # """, (order_detail["user_id"],), as_dict=True)

            # if not wallet_data:
            #     return {"status": "error", "message": "No active wallet found."}

            # wallet_name = wallet_data[0]["name"]
            # available_balance = wallet_data[0]["balance"]

            # new_balance = available_balance + (order_detail["quantity"] - order_detail["filled_quantity"]) * order_detail["price"]
            
            # # Update wallet balance
            # frappe.db.sql("""
            #     UPDATE `tabUser Wallet`
            #     SET balance = %s
            #     WHERE name = %s
            # """, (new_balance, wallet_name))

            # frappe.db.commit()  # Ensure transaction is committed

        frappe.db.commit()  # Commit once after the loop for better performance

        return {"status": "success", "message": "Unmatched orders updated"}

    except Exception as e:
        frappe.log_error("Error updating unmatched orders", frappe.get_traceback())  # Better logging
        return {"status": "error", "message": f"Error: {str(e)}"}

@frappe.whitelist(allow_guest=True)
def market_settlements():
    try:
        data = frappe._dict(frappe.request.get_json())
        frappe.log_error("Settled Orders", data)
        
        frappe.db.sql("""
            UPDATE `tabOrders`
            SET status = 'SETTLED'
            WHERE market_id = %s AND status = 'MATCHED'
        """, (data.market_id,))
        
        # # Correcting key name
        # for order_detail in data.settlements:
        #     # Fetch the order
        #     order = frappe.get_doc("Orders", order_detail["order_id"])

        #     # Update status and remarks
        #     order.status = "SETTLED"
        #     order.remark = "Market Closed. Bid was matched"
        #     order.save(ignore_permissions=True)

        #     # frappe.publish_realtime('order_event',{
        #     #     "order_id":order.name,
        #     #     "status":order.status,
        #     #     "filled_quantity":order.filled_quantity
        #     # },user=frappe.session.user,after_commit=True)

        #     # wallet_data = frappe.db.sql("""
        #     #     SELECT name, balance FROM `tabUser Wallet`
        #     #     WHERE user = %s AND is_active = 1
        #     #     FOR UPDATE
        #     # """, (order_detail["user_id"],), as_dict=True)

        #     # if not wallet_data:
        #     #     return {"status": "error", "message": "No active wallet found."}

        #     # wallet_name = wallet_data[0]["name"]
        #     # available_balance = wallet_data[0]["balance"]

        #     # new_balance = available_balance + (order_detail["quantity"] - order_detail["filled_quantity"]) * order_detail["price"]
            
        #     # # Update wallet balance
        #     # frappe.db.sql("""
        #     #     UPDATE `tabUser Wallet`
        #     #     SET balance = %s
        #     #     WHERE name = %s
        #     # """, (new_balance, wallet_name))

        #     # frappe.db.commit()  # Ensure transaction is committed

        frappe.db.commit()  # Commit once after the loop for better performance

        return {"status": "success", "message": "Orders settled"}

    except Exception as e:
        frappe.log_error("Error updating unmatched orders", frappe.get_traceback())  # Better logging
        return {"status": "error", "message": f"Error: {str(e)}"}


@frappe.whitelist(allow_guest=True)
def update_market_price():
    try:
        data = frappe._dict(frappe.request.get_json())

        doc = frappe.get_doc("Market",data.market_id)
        doc.yes_price = data.yes_price
        doc.no_price = data.no_price
        
        doc.save(ignore_permissions=True)
        
        frappe.db.commit()
        """Send real-time update via WebSockets"""
        update_data = {
            "name": doc.name,
            "status": doc.status,
            "category": doc.category,
            "question": doc.question,
            "yes_price": doc.yes_price,
            "no_price": doc.no_price,
            "closing_time": doc.closing_time
        }
        
        frappe.publish_realtime("market_event",update_data,after_commit=True)
        
        return True
    except Exception as e:
        frappe.log_error("Error in market price update", f"{str(e)}")
        return False


@frappe.whitelist(allow_guest=True)
def get_marketwise_transaction_summary():
    """
    Fetch total debited and credited amounts per user in each market,
    restricted to the logged-in user's trades.
    """
    current_user = frappe.session.user  # Get the logged-in user

    query = """
        SELECT 
            market_id,
            user,
            question,
            winning_side,
            transaction_type,
            SUM(CAST(transaction_amount AS DECIMAL(18,2))) AS total_amount
        FROM `tabTransaction Logs`
        WHERE transaction_type IN ('Debit', 'Credit')
        AND user = %s
        AND market_id IN (
            SELECT name FROM `tabMarket` WHERE status = 'CLOSED'
        )
        GROUP BY market_id, user, question, transaction_type
    """

    results = frappe.db.sql(query, (current_user,), as_dict=True)

    # return results
    # # Process results into a structured dictionary
    summary = {}

    for row in results:
        market = row["market_id"]
        user = row["user"]
        winning_side = row["winning_side"]
        question = row["question"]
        txn_type = row["transaction_type"]
        amount = row["total_amount"]

        # Initialize market & user data
        if market not in summary:
            summary[market] = {}
            summary[market]["question"] = question
            summary[market]["winning_side"] = winning_side

        if txn_type not in summary[market]:
            if txn_type == "Debit":
                summary[market]["debited_amount"]=amount
            else:
                summary[market]["credited_amount"]=amount

    return summary

@frappe.whitelist(allow_guest=True)
def get_available_quantity(market_id):
    query = """
        SELECT 
            amount,
            opinion_type,
            order_type,
            SUM(
                CASE 
                    WHEN status = 'UNMATCHED' THEN quantity
                    WHEN status = 'PARTIAL' THEN quantity - filled_quantity
                    ELSE 0 
                END
            ) AS total_available_quantity
        FROM `tabOrders`
        WHERE market_id = %s
        GROUP BY amount, opinion_type, order_type
    """

    result = frappe.db.sql(query, (market_id,), as_dict=True)
    res = {}
    BASE_PRICE = 10.0
    frappe.log_error("Quantity",result)
    
    for temp in result:
        order_type = temp.order_type.upper()
        amount_key = f"{BASE_PRICE - temp.amount}" if order_type == "BUY" else f"{temp.amount}"

        if amount_key not in res:
            res[amount_key] = {"price": float(amount_key), "yesQty": 0, "noQty": 0}

        if order_type == "BUY":
            if temp.opinion_type == "YES":
                res[amount_key]["noQty"] += temp.total_available_quantity
            else:
                res[amount_key]["yesQty"] += temp.total_available_quantity
        else:
            if temp.opinion_type == "YES":
                res[amount_key]["yesQty"] += temp.total_available_quantity
            else:
                res[amount_key]["noQty"] += temp.total_available_quantity

    return res if res else {}

@frappe.whitelist(allow_guest=True)
def get_open_buy_orders_without_active_sell():
    orders = frappe.db.sql("""
        SELECT
            COALESCE(s.name, b.name) AS name,
            COALESCE(s.order_type, b.order_type) AS order_type,
            COALESCE(s.status, b.status) AS status,
            COALESCE(s.price, b.price) AS price,
            COALESCE(s.quantity, b.quantity) AS quantity,
            COALESCE(s.creation, b.creation) AS creation,
            COALESCE(s.modified, b.modified) AS modified,
            COALESCE(s.owner, b.owner) AS owner,
            COALESCE(s.sell_order_id, b.sell_order_id) AS sell_order_id,
            COALESCE(s.buy_order_id, b.buy_order_id) AS buy_order_id
        FROM `tabOrders` b
        LEFT JOIN `tabOrders` s
            ON b.sell_order_id = s.name AND s.status != 'CANCELED'
        WHERE b.order_type = 'BUY' AND s.name IS NULL
    """, as_dict=True)
    return result


@frappe.whitelist(allow_guest=True)
def cancel_order(order_id):
    if not order_id:
        return {
            "error":"Order ID is required."
        }
    


@frappe.whitelist()
def total_traders(market_id):
    query = """
        SELECT 
            COUNT(DISTINCT user_id) AS traders
        FROM `tabOrders`
        WHERE status NOT IN ("CANCELED", "SETTLED")
            AND market_id = %s
    """
    return frappe.db.sql(query, (market_id,), as_dict=True)


def holding(doc,method):

    if doc.status == "Exit" and not doc.order_id:
        order = frappe.new_doc("Orders")
        order.order_type = "SELL",
        order.opinion_type = doc.opinion_type
        order.amount = doc.exit_price
        order.quantity = doc.quantity
        order.market_id = doc.market_id

        order.insert(ignore_permissions = True)
        
        doc.order_id = order.name
        frappe.db.commit()

    elif doc.status == "Cancel":
        order = frappe.get_doc("Orders",doc.order_id)
        order.status == "CANCELED" 
        order.remark == "Sell order canceled in midway"
        
        order.save(ignore_permissions = True)
        frappe.db.commit()