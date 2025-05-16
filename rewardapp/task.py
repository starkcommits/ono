import frappe
from frappe.utils import now

def execute():
    frappe.db.sql("""
        UPDATE `tabOrders`
        SET status = 'CANCELED'
        WHERE status = 'UNMATCHED'
        AND auto_cancel = '1'
        AND cancel_time <= %s
    """, (now(),))