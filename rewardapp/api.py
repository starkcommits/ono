import frappe
import json
from frappe import _
from frappe.utils.password import check_password
from frappe.utils.password_strength import test_password_strength
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
        referral_code = data.get('referral_code')

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
        
        # Assign Role Profile
        user.role_profile_name = "Trader"

        # Save user with profiles
        user.insert(ignore_permissions=True)
        # Assign Module Profile
        # module_profile = frappe.get_doc("Module Profile", "Trader")
        # for module in module_profile.modules:
        #     user.append("block_modules", {
        #         "module": module.module
        #     })
        promotional_wallet_amount = 0

        if referral_code:
            referral_doc = frappe.get_doc("Referral Code", referral_code)

            if int(referral_doc.total_referrals) >= int(referral_doc.total_allowed_referrals):
                return error_response("This referral code has reached its limit")
            
            # Increment referral count
            referral_doc.total_referrals += 1
            referral_doc.save(ignore_permissions=True)  # Don't forget to save

            referral_config = frappe.get_doc("Referral Config", referral_doc.referral_name)

            # Add referee reward to their promotional wallet amount
            promotional_wallet_amount += referral_config.referee_reward_amount

            # Get referrer's promotional wallet
            promotional_wallet_data = frappe.db.sql("""
                SELECT name, balance FROM `tabPromotional Wallet`
                WHERE user = %s AND is_active = 1
            """, (referral_doc.user,), as_dict=True)

            if not promotional_wallet_data:
                frappe.throw(f"No active promotional wallet found for {referral_doc.user}")

            wallet_name = promotional_wallet_data[0]["name"]
            available_balance = promotional_wallet_data[0]["balance"]

            # Add referrer reward to wallet
            new_balance = available_balance + referral_config.referrer_reward_amount

            frappe.db.set_value("Promotional Wallet", wallet_name, "balance", new_balance)

            # Create Referral Tracking entry
            referral_tracking = frappe.get_doc({
                'doctype': 'Referral Tracking',
                'referrer_user': referral_doc.user,
                'referee_user': user.name,
                'referral_code': referral_code,
                'referrer_reward': referral_config.referrer_reward_amount,
                'referee_reward': referral_config.referee_reward_amount,
                'status': 'Rewarded'
            })
            referral_tracking.insert(ignore_permissions=True)
        
        # Add role directly to ensure it's applied
        if not frappe.db.exists("Has Role", {"parent": user.name, "role": "Trader"}):
            role = user.append("roles", {})
            role.role = "Trader"
            user.save(ignore_permissions=True)
        
        # Commit transaction
        frappe.db.commit()

        # Fetch active referral configs
        referrals = frappe.db.sql(
            """
            SELECT
                referral_name
            FROM `tabReferral Config`
            WHERE is_active = 1
            """,
            as_dict=True
        )
        user_referral = ""
        if referrals:
            user_referral = frappe.get_doc({
                'doctype': 'Referral Code',
                'user': user.name,
                'referral_name': referrals[0]['referral_name']
            })
            user_referral.insert(ignore_permissions=True)
        else:
            frappe.throw("No active Referral Config found.")

        wallet = frappe.new_doc("User Wallet")
        wallet.user = user.name
        wallet.balance = 5000
        wallet.is_active = 1
        wallet.save(ignore_permissions=True)

        promotional_wallet = frappe.new_doc("Promotional Wallet")
        promotional_wallet.user = user.name
        promotional_wallet.balance = promotional_wallet_amount
        promotional_wallet.is_active = 1
        promotional_wallet.referral_code = user_referral.name
        promotional_wallet.save(ignore_permissions=True)

        # Optional: Only needed if inside a custom function, not a DocType method
        frappe.db.commit()

        return success_response(f"User registered successfully as Trader. Here is referral code: {user_referral.name}")
    
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(frappe.get_traceback(), _("Trader Signup Error"))
        return error_response(f"Registration failed: {str(e)}")

@frappe.whitelist(allow_guest=True)
def check_password_strength():
    # Get request data
    data = frappe.request.get_json()
    if not data:
        return {
            "message":"No request data found"
        }
    return test_password_strength(data.get('new_password'))

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

@frappe.whitelist(allow_guest=True)
def check_referral(referral_code):
    
    try:
        referral_doc = frappe.get_doc("Referral Code", referral_code)

        if int(referral_doc.total_referrals) >= int(referral_doc.total_allowed_referrals):
            return error_response("This referral code has reached its limit")

    except Exception as e:
        return error_response(f"Registration failed: {str(e)}")