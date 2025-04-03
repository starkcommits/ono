import frappe
import json
from frappe import _
from frappe.utils.password import check_password
from frappe.utils import validate_email_address, getdate, today, get_formatted_email
import re

@frappe.whitelist(allow_guest=True)
def signup():
    try:
        # Get request data
        data = frappe.request.get_json()
        if not data:
            return {
                "message":"No request data found"
            }
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'phone', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return error_response(f"Missing required field: {field}")
        
        # Extract parameters
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        
        # Validate email format
        if not validate_email_address(email):
            return error_response("Invalid email address format")
        
        # Check if email already exists
        if frappe.db.exists("User", {"email": email}):
            return error_response("Email already registered")
        
        if frappe.db.exists("User", {"mobile_no": phone}):
            return error_response("Mobile No. already registered") 

        # # Validate date of birth format
        # try:
        #     dob = getdate(date_of_birth)
        #     # Perform any age validation if required
        #     # For example, to ensure user is at least 18 years old:
        #     # today_date = getdate(today())
        #     # age = today_date.year - dob.year - ((today_date.month, today_date.day) < (dob.month, dob.day))
        #     # if age < 18:
        #     #    return error_response("You must be at least 18 years old to register")
        # except:
        #     return error_response("Invalid date format for date of birth. Use YYYY-MM-DD")
        
        # Validate password strength
        if len(password) < 8:
            return error_response("Password must be at least 8 characters long")
            
        # Create new user
        user = frappe.new_doc("User")
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.send_welcome_email = 1
        user.enabled = 1
        user.new_password = password
        user.mobile_no = phone
        user.user_type = "System User"
        user.insert(ignore_permissions=True)
        
        # Assign Role Profile
        user.role_profile_name = "Trader"
        
        # Assign Module Profile
        # module_profile = frappe.get_doc("Module Profile", "Trader")
        # for module in module_profile.modules:
        #     user.append("block_modules", {
        #         "module": module.module
        #     })
        
        # Save user with profiles
        user.save(ignore_permissions=True)
        
        # Add role directly to ensure it's applied
        if not frappe.db.exists("Has Role", {"parent": user.name, "role": "Trader"}):
            role = user.append("roles", {})
            role.role = "Trader"
            user.save(ignore_permissions=True)
        
        # Commit transaction
        frappe.db.commit()
        
        return success_response("User registered successfully as Trader")
    
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(frappe.get_traceback(), _("Trader Signup Error"))
        return error_response(f"Registration failed: {str(e)}")

def success_response(message):
    """Return a success response in JSON format"""
    frappe.response["http_status_code"] = 200
    return {
        "status": "success",
        "message": message
    }

def error_response(message):
    """Return an error response in JSON format"""
    frappe.response["http_status_code"] = 400
    return {
        "status": "error",
        "message": message
    }