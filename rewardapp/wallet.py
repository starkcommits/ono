import frappe
import json
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_balance(user_id: str):
    """Fetch wallet balance for a given user."""
    wallet_data = frappe.db.sql("""
        SELECT name, balance FROM `tabUser Wallet`
        WHERE user = %s AND is_active = 1
        FOR UPDATE
    """, (user_id,), as_dict=True)
    
    frappe.log_error("Wallet data",user_id)
    if not wallet_data:
        return {"status": "error", "message": "No active wallet found."}

    return {"status": "success", "wallet": wallet_data[0]}


@frappe.whitelist(allow_guest=True)
def update_wallet():
    """Update the wallet balance based on a transaction."""
    try:
        data = frappe._dict(frappe.request.get_json())

        if not data:
            frappe.throw("No data received.")

        wallet_data = frappe.db.sql("""
            SELECT name, balance FROM `tabUser Wallet`
            WHERE user = %s AND is_active = 1
            FOR UPDATE
        """, (data.user_id,), as_dict=True)

        if not wallet_data:
            return {"status": "error", "message": "No active wallet found."}

        wallet_name = wallet_data[0]["name"]
        available_balance = wallet_data[0]["balance"]

        new_balance = available_balance + data.amount
        
        # Update wallet balance
        frappe.db.sql("""
            UPDATE `tabUser Wallet`
            SET balance = %s
            WHERE name = %s
        """, (new_balance, wallet_name))

        frappe.db.commit()  # Ensure transaction is committed

        # Insert Transaction Log
        txn_log = frappe.get_doc({
            "doctype": "Transaction Logs",
            "user": data.user_id,
            "order_id": data.reference_id,
            "transaction_amount": data.amount,
            "transaction_type": data.transaction_type,
            "remark":data.description,
            "status": "Completed"
        })

        txn_log.insert(ignore_permissions=True)

        frappe.db.commit()  # ✅ Commit all changes atomically

        return {"status": "success", "message": "Wallet updated successfully"}

    except Exception as e:
        frappe.log_error(f"Wallet update failed: {str(e)}", "update_wallet")
        return {"status": "error", "message": str(e)}