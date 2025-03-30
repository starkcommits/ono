import requests
import frappe
import json
from frappe import _

def order(doc, method):
    """Send order from Frappe to Matching Engine."""
    user_id = frappe.session.user
    total_amount = doc.amount * doc.quantity  # Ensure total_amount is always defined
    
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
    # },user=frappe.session.user)
    
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
        # # Update fields
        order.status = data.status
        order.filled_quantity = data.filled_quantity

        frappe.publish_realtime('order_event',{
            "order_id":data.order_id,
            "status":data.status,
            "filled_quantity":data.filled_quantity
        },user=frappe.session.user)
        # # Save the updated order
        order.save(ignore_permissions=True)
        frappe.db.commit()

        return {"status": "success", "message": "Order updated successfully", "order_id": order.name}
    except Exception as e:
        frappe.log_error(f"Order update failed: {str(e)}", "update_order")
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
            transaction_type,
            SUM(CAST(transaction_amount AS DECIMAL(18,2))) AS total_amount
        FROM `tabTransaction Logs`
        WHERE transaction_type IN ('Debit', 'Credit')
        AND user = %s
        GROUP BY market_id, user, transaction_type
    """

    results = frappe.db.sql(query, (current_user,), as_dict=True)

    return results
    # # Process results into a structured dictionary
    # summary = {}

    # for row in results:
    #     market = row["market_id"]
    #     user = row["user"]
    #     txn_type = row["transaction_type"].lower()
    #     amount = row["total_amount"]

    #     # Initialize market & user data
    #     if market not in summary:
    #         summary[market] = {}
    #     if user not in summary[market]:
    #         summary[market][user] = {"total_debit": 0, "total_credit": 0}

    #     # Assign amounts to debit/credit
    #     if txn_type == "debit":
    #         summary[market][user]["total_debit"] = amount
    #     elif txn_type == "credit":
    #         summary[market][user]["total_credit"] = amount

    # return summary