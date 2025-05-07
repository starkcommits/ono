import frappe
import json
import requests
from frappe import _

def create_transaction_log(doc):
    try:
        total_amount = doc.amount * doc.quantity

        promotional_wallet_data = frappe.db.sql("""
            SELECT name, balance FROM `tabPromotional Wallet`
            WHERE user = %s AND is_active = 1
        """, (user_id,), as_dict=True)

        if promotional_wallet_data and promotional_wallet_data[0]["balance"]>0:
            wallet_balance = promotional_wallet_data[0]["balance"]
            if wallet_balance >= total_amount:
                transaction_log = frappe.new_doc({
                    'doctype':"Transaction Logs",
                    'market_id':doc.market_id,
                    
                    
                })

    except Exception as e:
        return raise_error(f"Error in creating transaction log {str(e)}")

def wallet_operation(doc, method):
    """
    Handle wallet operations for orders with proper transaction management.
    Ensures operations are atomic within database boundaries.
    """
    try:
        user_id = doc.user_id or frappe.session.user
        
        # Only process specific order statuses
        if doc.status == "UNMATCHED":
            frappe.db.begin()  # Start transaction explicitly
            
            try:
                total_amount = doc.amount * doc.quantity
                
                order_book_data = {
                    "market_id": doc.market_id,
                    "quantity": doc.quantity
                }
                
                if doc.order_type == "BUY":
                    # Get wallet data
                    wallet_data = frappe.db.sql("""
                        SELECT name, balance FROM `tabUser Wallet`
                        WHERE user = %s AND is_active = 1
                        FOR UPDATE  # Lock row to prevent concurrent modifications
                    """, (user_id,), as_dict=True)
                    
                    if not wallet_data:
                        frappe.db.rollback()
                        frappe.throw(f"No active wallet found for {user_id}")
                    
                    wallet_name = wallet_data[0]["name"]
                    available_balance = wallet_data[0]["balance"]
                    
                    if available_balance < total_amount:
                        frappe.db.rollback()
                        frappe.throw(f"Insufficient balance in {user_id}'s wallet")
                    
                    # Update wallet balance
                    new_balance = available_balance - total_amount
                    frappe.db.sql("""
                        UPDATE `tabUser Wallet`
                        SET balance = %s
                        WHERE name = %s
                    """, (new_balance, wallet_name))
                    
                    order_book_data["price"] = 10 - doc.amount
                    order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"
                else:  # SELL order
                    if not doc.holding_id:
                        # Update holding status
                        frappe.db.sql("""
                            UPDATE `tabHolding`
                            SET status = 'EXITING', order_id = %s, exit_price = %s
                            WHERE market_id = %s
                            AND user_id = %s
                            AND status = 'ACTIVE'
                            AND opinion_type = %s
                            FOR UPDATE  # Lock rows to prevent concurrent modifications
                        """, (doc.name, doc.amount, doc.market_id, user_id, doc.opinion_type))
                    
                    order_book_data["price"] = doc.amount
                    order_book_data["opinion_type"] = doc.opinion_type
                
                # Set user_id without triggering save
                if not doc.user_id:
                    frappe.db.set_value('Orders', doc.name, 'user_id', user_id, update_modified=False)
                
                # Commit database changes first
                frappe.db.commit()
                
                # Prepare payload for external API
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
                
                frappe.log_error("Order Payload", payload)
                
                # External API call - after database transaction is complete
                try:
                    url = "http://94.136.187.188:8086/orders/"
                    response = requests.post(url, json=payload)
                    
                    if response.status_code != 201:
                        # Compensating transaction if API fails
                        frappe.db.begin()
                        
                        # Reverse the wallet changes
                        if doc.order_type == "BUY":
                            frappe.db.sql("""
                                UPDATE `tabUser Wallet`
                                SET balance = balance + %s
                                WHERE name = %s
                            """, (total_amount, wallet_name))
                        else:
                            if not doc.holding_id:
                                frappe.db.sql("""
                                    UPDATE `tabHolding`
                                    SET status = 'ACTIVE', order_id = '', exit_price = 0
                                    WHERE market_id = %s
                                    AND status = 'EXITING'
                                    AND order_id = %s
                                    AND user_id = %s
                                """, (doc.market_id, doc.name, user_id))
                        
                        # Update order status
                        frappe.db.set_value('Orders', doc.name, {
                            'status': "CANCELED",
                            'remark': f"System canceled the order: API error {response.status_code}"
                        }, update_modified=False)
                        
                        frappe.db.commit()
                        error_text = response.text
                        frappe.log_error("Order API Error: ", f"{response.status_code} - {error_text}")
                        frappe.throw(f"Error from API: {error_text}")
                    else:
                        # Success path
                        frappe.publish_realtime("order_book_event", order_book_data, after_commit=True)
                        
                        # Update market metrics in a separate transaction
                        frappe.db.begin()
                        query = """
                            SELECT COUNT(DISTINCT user_id) AS traders
                            FROM `tabOrders`
                            WHERE status NOT IN ("CANCELED", "SETTLED")
                                AND market_id = %s
                        """
                        result = frappe.db.sql(query, (doc.market_id,), as_dict=True)
                        market = frappe.get_doc("Market", doc.market_id)
                        
                        if market.total_traders != result[0]["traders"]:
                            frappe.db.set_value('Market', doc.market_id, 'total_traders', 
                                              result[0]["traders"], update_modified=False)
                        
                        frappe.db.commit()
                        frappe.msgprint("Order Created Successfully.")
                
                except requests.exceptions.RequestException as e:
                    # Create compensating transaction
                    frappe.db.begin()
                    
                    # Reverse the wallet changes
                    if doc.order_type == "BUY":
                        frappe.db.sql("""
                            UPDATE `tabUser Wallet`
                            SET balance = balance + %s
                            WHERE name = %s
                        """, (total_amount, wallet_name))
                    else:
                        if not doc.holding_id:
                            frappe.db.sql("""
                                UPDATE `tabHolding`
                                SET status = 'ACTIVE', order_id = '', exit_price = 0
                                WHERE market_id = %s
                                AND status = 'EXITING'
                                AND order_id = %s
                                AND user_id = %s
                            """, (doc.market_id, doc.name, user_id))
                    
                    # Update order status
                    frappe.db.set_value('Orders', doc.name, {
                        'status': "CANCELED",
                        'remark': "System canceled the order due to API error."
                    }, update_modified=False)
                    
                    frappe.db.commit()
                    frappe.throw(f"Error sending order: {str(e)}")
            
            except Exception as e:
                frappe.db.rollback()
                frappe.log_error("Database operation failed", str(e))
                frappe.throw(f"Order processing failed: {str(e)}")
                
        elif doc.status == "PARTIAL":
            # PARTIAL status handling doesn't modify database, just publishes realtime event
            order_book_data = {"market_id": doc.market_id}
            
            if doc.order_type == "BUY":
                order_book_data["price"] = 10 - doc.amount
                order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"
            else:
                order_book_data["price"] = doc.amount
                order_book_data["opinion_type"] = doc.opinion_type
                
            order_book_data["quantity"] = -doc.filled_quantity
            frappe.publish_realtime("order_book_event", order_book_data, after_commit=True)
            
        elif doc.status == "CANCELED":
            frappe.db.begin()
            
            try:
                order_book_data = {"market_id": doc.market_id}
                
                if doc.order_type == "BUY":
                    order_book_data["price"] = 10 - doc.amount
                    order_book_data["opinion_type"] = "NO" if doc.opinion_type == "YES" else "YES"
                    
                    # Get wallet data
                    wallet_data = frappe.db.sql("""
                        SELECT name, balance FROM `tabUser Wallet`
                        WHERE user = %s AND is_active = 1
                        FOR UPDATE
                    """, (user_id,), as_dict=True)
                    
                    if not wallet_data:
                        frappe.db.rollback()
                        frappe.throw(f"No active wallet found for {user_id}")
                    
                    wallet_name = wallet_data[0]["name"]
                    available_balance = wallet_data[0]["balance"]
                    
                    # Return funds to wallet
                    total_amount = doc.amount * (doc.quantity - doc.filled_quantity)
                    new_balance = available_balance + total_amount
                    
                    frappe.db.sql("""
                        UPDATE `tabUser Wallet`
                        SET balance = %s
                        WHERE name = %s
                    """, (new_balance, wallet_name))
                    
                else:  # SELL order cancellation
                    if not doc.holding_id:
                        frappe.db.sql("""
                            UPDATE `tabHolding`
                            SET status = 'ACTIVE', order_id = '', exit_price = 0
                            WHERE market_id = %s
                            AND status = 'EXITING'
                            AND order_id = %s
                            AND user_id = %s
                            FOR UPDATE
                        """, (doc.market_id, doc.name, user_id))
                    else:
                        frappe.db.set_value("Holding", doc.holding_id, {
                            'status': 'ACTIVE',
                            'order_id': ''
                        }, update_modified=False)
                    
                    order_book_data["price"] = doc.amount
                    order_book_data["opinion_type"] = doc.opinion_type
                
                order_book_data["quantity"] = -(doc.quantity - doc.filled_quantity)
                
                # Commit database changes
                frappe.db.commit()
                
                # Now make external API call
                if doc.market_status != "CLOSE":
                    try:
                        url = f"http://94.136.187.188:8086/orders/{doc.name}"
                        response = requests.delete(url)
                        
                        if response.status_code != 200:
                            frappe.logger().error(f"Error response: {response.text}")
                            frappe.throw(f"Cancel Order API error: {response.status_code} - {response.text}")
                        else:
                            frappe.publish_realtime("order_book_event", order_book_data, after_commit=True)
                            frappe.msgprint("Order cancelled successfully.")
                    
                    except Exception as e:
                        # For cancellation, we don't need to roll back database changes if API fails
                        # since cancellation is already recorded in our database
                        frappe.log_error("Error in order cancelling API", f"{str(e)}")
                        frappe.throw(f"Order was cancelled in system but API notification failed: {str(e)}")
            
            except Exception as e:
                frappe.db.rollback()
                frappe.log_error("Order cancellation database operation failed", str(e))
                frappe.throw(f"Order cancellation failed: {str(e)}")

    except Exception as e:
        frappe.log_error("Error in wallet operation", f"{str(e)}")
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

@frappe.whitelist(allow_guest=True)
def recharge_wallet(user, amount):
    gst_config = frappe.db.sql(
        """
        SELECT
            sgst_rate,
            cgst_rate,
            igst_rate
        FROM `tabGST Config`
        WHERE is_active = 1
        LIMIT 1
        """, as_dict=True
    )
    sgst_amount = 0
    cgst_amount = 0
    igst_amount = 0
    if gst_config:
        sgst_amount = amount * (gst_config[0]['sgst_rate']/100)
        cgst_amount = amount * (gst_config[0]['cgst_rate']/100)

    total_gst = sgst_amount + cgst_amount + igst_amount
    
    # Get referrer's promotional wallet
    promotional_wallet_data = frappe.db.sql("""
        SELECT name, balance FROM `tabPromotional Wallet`
        WHERE user = %s AND is_active = 1
    """, (user,), as_dict=True)

    if not promotional_wallet_data:
        frappe.throw(f"No active promotional wallet found for {ruser}")

    # Add referrer reward to wallet
    new_balance = promotional_wallet_data[0]["balance"] + total_gst

    frappe.db.set_value("Promotional Wallet", promotional_wallet_data[0]["name"], "balance", new_balance)

    # Get referrer's promotional wallet
    wallet_data = frappe.db.sql("""
        SELECT name, balance FROM `tabUser Wallet`
        WHERE user = %s AND is_active = 1
    """, (user,), as_dict=True)

    if not wallet_data:
        frappe.throw(f"No active user wallet found for {ruser}")

    wallet_name = promotional_wallet_data[0]["name"]
    available_balance = promotional_wallet_data[0]["balance"]

    # Add referrer reward to wallet
    new_wallet_balance = available_balance - total_gst

    frappe.db.set_value("User Wallet", wallet_name, "balance", new_wallet_balance)

        