import requests
import frappe
import json
from frappe import _

def order(doc, method):
    """Send order from Frappe to Matching Engine."""
    user_id = frappe.session.user
    total_amount = doc.amount * doc.quantity  # Ensure total_amount is always defined

    order_book_data={
        "market_id":doc.market_id,
        "quantity":doc.quantity
    }

    if doc.order_type=="BUY":
        wallet = frappe.db.sql("""
            SELECT name, balance FROM `tabUser Wallet`
            WHERE user = %s AND is_active = 1
        """, (user_id,), as_dict=True)

        if not wallet:
            frappe.msgprint("No active wallet found")
            frappe.throw(f"No active wallet found for {user_id}")

        if wallet[0]["balance"]<total_amount:
            frappe.msgprint("Insufficient balance")
            frappe.throw(f"Insufficient balance in {user_id}'s wallet")
        
        order_book_data["price"] = 10-doc.amount
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
    
    # frappe.publish_realtime('order_event',{
    #     "order_id": doc.name,
    #     "status": doc.status,
    #     "market_id": doc.market_id,
    #     "option_type": doc.opinion_type,
    #     "price": doc.amount,
    #     "quantity": doc.quantity,
    #     "order_type": doc.order_type
    # })
    
    doc.save()
    frappe.db.commit()

    frappe.log_error("Order Payload",payload)
    try:
        url = "http://94.136.187.188:8086/orders/"
        response = requests.post(url, json=payload)
        if response.status_code != 201:
            error_text = response.text
            frappe.log_error("Order API Error: ", f"{response.status_code} - {error_text}")
            frappe.throw(f"Error from API: {error_text}")
        else:
            frappe.publish_realtime("order_book_event",order_book_data)
            frappe.msgprint("Order Created Successfully.")
    except requests.exceptions.RequestException as e:
        frappe.throw(f"Error sending order: {str(e)}")
            

@frappe.whitelist(allow_guest=True)  # Allow external requests
def update_order():
    """Accepts order updates from FastAPI and updates the Order Doctype in Frappe."""
    
    try:
        # Parse incoming JSON data
        data = frappe._dict(frappe.request.get_json())

        frappe.log_error("Order matching",data)

        # # Fetch the existing order from Frappe
        try:
            order = frappe.get_doc("Orders", data.order_id)
        except Exception as e:
            if not order:
                order= frappe.get_doc("Orders", data.order_id)

        order_book_data = {
            "market_id":order.market_id
        }

        if order.order_type == "BUY":
            order_book_data["price"] = 10-order.amount
            order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"
        else:
            order_book_data["price"] = order.amount
            order_book_data["opinion_type"] = order.opinion_type

        # # Update fields
        order.status = data.status
        order.filled_quantity = data.filled_quantity

        # # Save the updated order
        order.save(ignore_permissions=True)
        frappe.db.commit()
        if data.status == "CANCELED":
            order_book_data["quantity"] = -(order.quantity - data.filled_quantity)
        else:
            order_book_data["quantity"] = - data.filled_quantity

        frappe.publish_realtime('order_event',{
            "order_id":data.order_id,
            "status":data.status,
            "filled_quantity":data.filled_quantity
        },user=frappe.session.user)

        frappe.publish_realtime("order_book_event",order_book_data)

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
                "yes_order_id": trade["yes_order_id"],
                "no_order_id": trade["no_order_id"],
                "market_id": trade["market_id"],
                "yes_user_id": trade["yes_user_id"],
                "no_user_id": trade["no_user_id"],
                "yes_price": trade["yes_price"],
                "no_price": trade["no_price"],
                "quantity": trade["quantity"]
            })
            trade_doc.insert(ignore_permissions=True)

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
                
                frappe.publish_realtime("market_event",update_data,user=frappe.session.user)
                frappe.msgprint("Market Created Successfully.")
            
        elif doc.status == "CLOSED":
            payload = {
                "winning_side":doc.end_result
            }

            url=f"http://94.136.187.188:8086/markets/{doc.name}/close"
            response = requests.post(url, json=payload)
            
            if response.status_code != 200:
                frappe.logger().error(f"Error response: {response.text}")
                frappe.throw(f"API error: {response.status_code} - {response.text}")
            else:
                """Send real-time update via WebSockets"""
                update_data = {
                    "name": doc.name,
                    "status": doc.status,
                    "category": doc.category
                }
                
                frappe.publish_realtime("market_event",update_data,user=frappe.session.user)
                frappe.msgprint("Market Closed Successfully.")
    
    except Exception as e:
        frappe.log_error(f"Exception market: {str(e)}")
        frappe.throw(f"Error market: {str(e)}")

@frappe.whitelist()
def close_market():
    try:
        data = frappe._dict(frappe.request.get_json())

        frappe.log_error("Market Closed",data)
        if not data:
            return {"status": "error", "message": "Missing 'close market' key in request data"}

        market = frappe.get_doc("Market",data["market_id"])
        market.status="CLOSED"
        market.save(ignore_permissions=True)
        frappe.db.commit()
        
        update_data = {
            "name": market.name,
            "status": market.status,
            "category": market.category,
            "question": doc.question,
            "yes_price": doc.yes_price,
            "no_price": doc.no_price,
            "closing_time": doc.closing_time
        }
        
        frappe.publish_realtime("market_event",update_data,user=frappe.session.user)
        
        return {
            "status":"success","message":"Market closed"
        }
        
    except Exception as e:
        frappe.log_error("Error Closing market", f"{str(e)}")
        return {"status": "error", "message": "Error in closing market"}

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
            order.status = "CANCELED"
            order.remark = "Market Closed. Bid was unmatched"
            order.save(ignore_permissions=True)

            frappe.publish_realtime('order_event',{
                "order_id":order.name,
                "status":order.status,
                "filled_quantity":order.filled_quantity
            },user=frappe.session.user)

            wallet_data = frappe.db.sql("""
                SELECT name, balance FROM `tabUser Wallet`
                WHERE user = %s AND is_active = 1
                FOR UPDATE
            """, (order_detail["user_id"],), as_dict=True)

            if not wallet_data:
                return {"status": "error", "message": "No active wallet found."}

            wallet_name = wallet_data[0]["name"]
            available_balance = wallet_data[0]["balance"]

            new_balance = available_balance + (order_detail["quantity"] - order_detail["filled_quantity"]) * order_detail["price"]
            
            # Update wallet balance
            frappe.db.sql("""
                UPDATE `tabUser Wallet`
                SET balance = %s
                WHERE name = %s
            """, (new_balance, wallet_name))

            frappe.db.commit()  # Ensure transaction is committed

        frappe.db.commit()  # Commit once after the loop for better performance

        return {"status": "success", "message": "Unmatched orders updated"}

    except Exception as e:
        frappe.log_error("Error updating unmatched orders", frappe.get_traceback())  # Better logging
        return {"status": "error", "message": f"Error: {str(e)}"}

@frappe.whitelist()
def market_settlements():
    try:
        data = frappe._dict(frappe.request.get_json())
        frappe.log_error("Settled Orders", data)
        return {
            "status":"success",
            "message":"Order settled"
        }
    except Exception as e:
        frappe.log_error("Error in settling", f"{str(e)}")
        return {
            "status":"error",
            "message":"Error in settling order"
        }

@frappe.whitelist()
def update_market_price():
    try:
        data = frappe._dict(frappe.request.get_json())

        market = frappe.get_doc("Market",data.market_id)
        market.yes_price = data.yes_price
        market.no_price = data.no_price
        
        market.save(ignore_permissions=True)
        
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
        
        frappe.publish_realtime("market_event",update_data,user=frappe.session.user)
        
        return True
    except Exception as e:
        frappe.log_error("Error in market price update", f"{str(e)}")
        return False


@frappe.whitelist()
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

@frappe.whitelist()
def get_available_quantity(market_id):
    query = """
        SELECT 
            amount,
            opinion_type,
            SUM(
                CASE 
                    WHEN status = 'UNMATCHED' THEN quantity
                    WHEN status = 'PARTIAL' THEN quantity - filled_quantity
                    ELSE 0 
                END
            ) AS total_available_quantity
        FROM `tabOrders`
        WHERE market_id = %s
        GROUP BY amount, opinion_type
    """

    result = frappe.db.sql(query, (market_id,), as_dict=True)
    res = {}

    for temp in result:
        amount_key = f"{temp.amount}"

        if amount_key not in res:
            res[amount_key] = {"price": temp.amount, "yesQty": 0, "noQty": 0}

        if temp.opinion_type == "YES":
            res[amount_key]["yesQty"] = temp.total_available_quantity
        else:
            res[amount_key]["noQty"] = temp.total_available_quantity

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
        WHERE b.order_type = 'BUY' AND (
            s.name IS NULL OR s.status != 'CANCELED'
        )
        """, as_dict=True)
    return orders