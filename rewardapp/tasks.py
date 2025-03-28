import frappe
from frappe.utils import now_datetime

def execute():
    now = frappe.utils.now_datetime()
    
    markets = frappe.get_all(
        "Market",
        filters={"status": "OPEN", "closing_time": ["<=", now]},
        fields=["name", "closing_time"]
    )

    frappe.logger().info(f"Markets to close: {markets}")

    for market in markets:
        doc = frappe.get_doc("Market", market.name)
        doc.status="CLOSED"
        doc.end_result="YES"
        doc.save(ignore_permissions=True)
    frappe.db.commit()
    