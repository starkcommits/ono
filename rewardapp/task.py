import frappe
from frappe.utils import now

@frappe.whitelist(allow_guest=True)
def execute():
    try:
        frappe.db.sql("""
            UPDATE `tabOrders`
            SET status = 'CANCELED'
            WHERE status = 'UNMATCHED'
            AND order_type = 'BUY'
            AND auto_cancel = '1'
            AND cancel_time <= %s
        """, (now(),))
    except Exception as e:
        frappe.log_error("Error in auto cancelling",f"{str(e)}")
        frappe.throw(f"Error in auto cancelling {str(e)}")