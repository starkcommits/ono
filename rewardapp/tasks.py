import frappe
from frappe.utils import now_datetime

def execute():
    try:
        now = now_datetime()
        frappe.logger().info(f"Current datetime: {now}")
        
        # Get markets that should be closed
        markets = frappe.get_all(
            "Market",
            filters={"status": "OPEN", "closing_time": ["<=", now]},
            fields=["name", "closing_time"]
        )

        frappe.logger().info(f"Markets to close: {markets}")
        
        if not markets:
            frappe.logger().info("No markets found to close")
            return
        
        # Close markets
        for market in markets:
            try:
                frappe.logger().info(f"Attempting to close market: {market.name}")
                doc = frappe.get_doc("Market", market.name)
                frappe.logger().info(f"Current market status: {doc.status}, closing_time: {doc.closing_time}")
                doc.status = "CLOSED"
                doc.end_result = "YES"
                doc.save(ignore_permissions=True)
                frappe.logger().info(f"Market {market.name} closed successfully")
            except Exception as e:
                frappe.logger().error(f"Error closing market {market.name}: {str(e)}")
        
        # Explicitly commit the transaction
        frappe.db.commit()
        frappe.logger().info("Database committed successfully")
    except Exception as e:
        frappe.logger().error(f"Error in execute function: {str(e)}")
        frappe.db.rollback()  # Rollback on error