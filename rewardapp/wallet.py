import frappe
import json
from frappe import _

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
def update_wallet():
    """Update the wallet balance based on a transaction."""
    try:
        # Safely parse JSON request with error handling
        try:
            data = frappe._dict(frappe.request.get_json())
        except Exception as e:
            frappe.log_error(f"JSON parsing error: {str(e)}", "update_wallet")
            return {"status": "error", "message": "Invalid request format."}

        # # Validate required fields
        # required_fields = ["user_id", "amount", "reference_id", "transaction_type", "description"]
        # for field in required_fields:
        #     if field not in data or data[field] is None:
        #         return {"status": "error", "message": f"Missing required field: {field}"}

        # # Begin transaction explicitly
        # frappe.db.begin()

        try:
            # Get wallet with lock
            wallet_data = frappe.db.sql("""
                SELECT name, balance FROM `tabUser Wallet`
                WHERE user = %s AND is_active = 1
            """, (data.user_id,), as_dict=True)
            
            if not wallet_data:
                frappe.db.rollback()
                return {"status": "error", "message": "No active wallet found."}

            wallet_name = wallet_data[0]["name"]
            available_balance = wallet_data[0]["balance"]

            # Calculate new balance
            new_balance = available_balance + data.amount
            
            # Update wallet balance
            frappe.db.sql("""
                UPDATE `tabUser Wallet`
                SET balance = %s
                WHERE name = %s
            """, (new_balance, wallet_name))

            # Insert Transaction Log
            txn_log = frappe.get_doc({
                "doctype": "Transaction Logs",
                "user": data.user_id,
                "order_id": data.reference_id,
                "transaction_amount": data.amount,
                "transaction_type": data.transaction_type,
                "remark": data.description,
                "status": "Completed"
            })

            txn_log.insert(ignore_permissions=True)
            
            # Commit only once at the end
            frappe.db.commit()
            
            # Log successful update
            frappe.logger().info(f"Wallet updated successfully: {data.user_id}, Amount: {data.amount}")
            
            return {"status": "success", "message": "Wallet updated successfully", "new_balance": new_balance}
            
        except Exception as inner_e:
            # Rollback the transaction if any error occurs
            frappe.db.rollback()
            raise inner_e

    except Exception as e:
        frappe.log_error(f"Wallet update failed:", f"{str(e)}")
        return {"status": "error", "message": str(e)}