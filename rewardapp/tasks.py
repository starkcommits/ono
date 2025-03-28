import frappe
from frappe.utils import now_datetime

def execute():
    now = frappe.utils.now_datetime()
    frappe.logger().info(f"Checking markets at {now}")

    markets = frappe.get_all(
        "Market",
        filters={"status": "OPEN", "closing_time": ["<=", now]},
        fields=["name", "closing_time"]
    )

    frappe.logger().info(f"Markets to close: {markets}")

    for market in markets:
        doc = frappe.get_doc("Market", market.name)
        doc.db_set("status", "CLOSED", commit=True)  # Force update
        frappe.logger().info(f"Closed market: {market.name}")