import frappe
import json
import requests
from frappe import _

def wallet_operation(doc, method):
    try:

        user_id = frappe.session.user
        if doc.user_id:
            user_id = doc.user_id
        # Only process if this is a new unmatched order or a cancellation
        if doc.status == "UNMATCHED":
            total_amount = doc.amount * doc.quantity  # Ensure total_amount is always defined

            order_book_data = {
                "market_id": doc.market_id,
                "quantity": doc.quantity
            }

            if doc.order_type == "BUY":
                wallet_data = frappe.db.sql("""
                    SELECT name, balance FROM `tabUser Wallet`
                    WHERE user = %s AND is_active = 1
                """, (user_id,), as_dict=True)

                if not wallet_data:
                    frappe.msgprint("No active wallet found")
                    frappe.throw(f"No active wallet found for {user_id}")

                wallet_name = wallet_data[0]["name"]
                available_balance = wallet_data[0]["balance"]

                if available_balance < total_amount:
                    frappe.msgprint("Insufficient balance")
                    frappe.throw(f"Insufficient balance in {user_id}'s wallet")

                # Calculate new balance
                new_balance = available_balance - total_amount
                
                # Update wallet balance
                frappe.db.sql("""
                    UPDATE `tabUser Wallet`
                    SET balance = %s
                    WHERE name = %s
                """, (new_balance, wallet_name))

                order_book_data["price"] = 10 - doc.amount
                order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"
            else:
                if not doc.holding_id:
                    frappe.db.sql("""
                        UPDATE `tabHolding`
                        SET status = 'EXITING', order_id = %s, exit_price = %s
                        WHERE market_id = %s
                        AND user_id = %s
                        AND status = 'ACTIVE'
                        AND opinion_type = %s
                    """, (doc.name, doc.amount, doc.market_id, doc.user_id, doc.opinion_type))

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
        elif doc.status == "PARTIAL":

            order_book_data = {
                "market_id": doc.market_id
            }
            if doc.order_type == "BUY":
                order_book_data["price"] = 10 - doc.amount
                order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"
            else:
                order_book_data["price"] = doc.amount
                order_book_data["opinion_type"] = doc.opinion_type

            order_book_data["quantity"] = -doc.filled_quantity

            frappe.publish_realtime("order_book_event", order_book_data,after_commit=True)

        elif doc.status == "CANCELED": 

            order_book_data = {
                "market_id": doc.market_id
            }

            if doc.order_type == "BUY":

                order_book_data["price"] = 10 - doc.amount
                order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"

                wallet_data = frappe.db.sql("""
                    SELECT name, balance FROM `tabUser Wallet`
                    WHERE user = %s AND is_active = 1
                """, (user_id,), as_dict=True)

                if not wallet_data:
                    frappe.msgprint("No active wallet found")
                    frappe.throw(f"No active wallet found for {user_id}")

                wallet_name = wallet_data[0]["name"]
                available_balance = wallet_data[0]["balance"]

                total_amount = doc.amount * (doc.quantity - doc.filled_quantity)
                # Calculate new balance
                new_balance = available_balance + total_amount
                
                # Update wallet balance
                frappe.db.sql("""
                    UPDATE `tabUser Wallet`
                    SET balance = %s
                    WHERE name = %s
                """, (new_balance, wallet_name))
            else:
                if not doc.holding_id:
                    frappe.db.sql("""
                        UPDATE `tabHolding`
                        SET status = 'ACTIVE', order_id = '', exit_price = 0
                        WHERE market_id = %s
                        AND status = 'EXITING'
                        AND order_id = %s
                        AND user_id = %s
                    """, (doc.market_id, doc.name, doc.user_id,))
                    
                else:
                    frappe.db.set_value("Holding",doc.holding_id,'status','ACTIVE','order_id','',update_modified=False)
                
                order_book_data["price"] = doc.amount
                order_book_data["opinion_type"] = doc.opinion_type

            order_book_data["quantity"] = -(doc.quantity - doc.filled_quantity)
            frappe.db.commit()

            if doc.market_status != "CLOSE":
                try:
                    url = f"http://94.136.187.188:8086/orders/{doc.name}"
                    response = requests.delete(url)
                    if response.status_code != 200:
                        frappe.logger().error(f"Error response: {response.text}")
                        frappe.throw(f"Cancel Order API error: {response.status_code} - {response.text}")
                    else:
                        frappe.publish_realtime("order_book_event", order_book_data,after_commit=True)
                        frappe.msgprint("Order cancelled successfully.")
                        
                except Exception as e:
                    frappe.log_error("Error in order cancelling", f"{str(e)}")
                    frappe.throw(f"Error in order cancelling: {str(e)}")

    except Exception as e:
        frappe.log_error("Error in wallet operation",f"{str(e)}")
        frappe.throw(f"Error in wallet operation: {str(e)}")


@frappe.whitelist(allow_guest=True)
def get_balance(user_id: str):
    """Fetch wallet balance for a given user."""
    wallet_data = frappe.db.sql("""
        SELECT name, balance FROM `tabUser Wallet`
        WHERE user = %s AND is_active = 1
    """, (user_id,), as_dict=True)
    
    # Log for debugging
    frappe.log_error("Get balance for user", user_id)
    
    if not wallet_data:
        return {"status": "error", "message": "No active wallet found."}

    return {"status": "success", "wallet": wallet_data[0]}


# @frappe.whitelist(allow_guest=True)
# def update_wallet():
#     """Update the wallet balance based on a transaction."""
#     try:
#         if 
#         # Get wallet with lock
#         wallet_data = frappe.db.sql("""
#             SELECT name, balance FROM `tabUser Wallet`
#             WHERE user = %s AND is_active = 1
#         """, (data.user_id,), as_dict=True)
        
#         if not wallet_data:
#             frappe.db.rollback()
#             return {"status": "error", "message": "No active wallet found."}

#         wallet_name = wallet_data[0]["name"]
#         available_balance = wallet_data[0]["balance"]

#         # Calculate new balance
#         new_balance = available_balance + data.amount
        
#         # Update wallet balance
#         frappe.db.sql("""
#             UPDATE `tabUser Wallet`
#             SET balance = %s
#             WHERE name = %s
#         """, (new_balance, wallet_name))

#         # Insert Transaction Log
#         txn_log = frappe.get_doc({
#             "doctype": "Transaction Logs",
#             "user": data.user_id,
#             "market_id": data.market_id,
#             "transaction_amount": data.amount,
#             "transaction_type": data.transaction_type,
#             "remark": data.description,
#             "status": "Completed"
#         })

#         txn_log.insert(ignore_permissions=True)
        
#         # Commit only once at the end
#         frappe.db.commit()
        
#         # Log successful update
#         frappe.logger().info(f"Wallet updated successfully: {data.user_id}, Amount: {data.amount}")
        
#         return {"status": "success", "message": "Wallet updated successfully", "new_balance": new_balance}

#     except Exception as e:
#         frappe.log_error(f"Wallet update failed:", f"{str(e)}")
#         return {"status": "error", "message": str(e)}

@frappe.whitelist(allow_guest=True)
def get_deposit_and_withdrawal():
    try:
        current_user = frappe.session.user
        query = """
            SELECT 
                user,
                transaction_type,
                SUM(CAST(transaction_amount AS DECIMAL(18,2))) AS total_amount
            FROM `tabTransaction Logs`
            WHERE transaction_type IN ('Recharge', 'Withdrawal')
            AND user = %s
            GROUP BY transaction_type
        """
        results = frappe.db.sql(query, (current_user,), as_dict=True)
        return results
    except Exception as e:
        return {
            "error":"Error in total deposit and withdrawal calculation",
            "message":f"{str(e)}"
        }