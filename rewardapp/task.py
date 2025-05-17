import frappe
from frappe.utils import now

@frappe.whitelist(allow_guest=True)
def execute():
    try:
        # Fetch matching Orders
        orders = frappe.get_all("Orders", 
            filters={
                "status": "UNMATCHED",
                "order_type": "BUY",
                "auto_cancel": 1,
                "cancel_time": ("<=", now())
            }, 
            pluck="name"
        )

        for order_name in orders:
            doc = frappe.get_doc("Orders", order_name)
            doc.status = "CANCELED"
            doc.save()  # This triggers hooks like on_update, etc.

        frappe.db.commit()  # Commit changes
    except Exception as e:
        frappe.log_error("Error in auto cancelling", f"{str(e)}")
        frappe.throw(f"Error in auto cancelling: {str(e)}")
