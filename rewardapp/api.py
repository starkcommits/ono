import frappe
import json
from frappe import _
from frappe.utils.password import check_password
from frappe.utils.password_strength import test_password_strength
from frappe.utils import validate_email_address, getdate, today, get_formatted_email, cint, get_datetime, now, now_datetime
import re
from frappe.auth import LoginManager
import random
import datetime
import requests
import logging
from frappe.core.doctype.user.user import User
from frappe.sessions import get_expiry_in_seconds

# If you're implementing SMS functionality
# Import your SMS gateway library, for example:
# from your_sms_provider import send_sms

# @frappe.whitelist(allow_guest=True)
# def signup():
#     try:
#         # Get request data
#         data = frappe.request.get_json()
#         if not data:
#             return {
#                 "message":"No request data found"
#             }
#         # Validate required fields
#         required_fields = ['first_name', 'last_name', 'phone', 'email', 'password']
#         for field in required_fields:
#             if not data.get(field):
#                 return error_response(f"Missing required field: {field}")
        
#         # Extract parameters
#         first_name = data.get('first_name')
#         last_name = data.get('last_name')
#         email = data.get('email')
#         phone = data.get('phone')
#         password = data.get('password')
#         referral_code = data.get('referral_code')

#         # Validate email format
#         if not validate_email_address(email):
#             return error_response("Invalid email address format")
        
#         # Check if email already exists
#         if frappe.db.exists("User", {"email": email}):
#             return error_response("Email already registered")
        
#         if frappe.db.exists("User", {"mobile_no": phone}):
#             return error_response("Mobile No. already registered") 

#         # # Validate date of birth format
#         # try:
#         #     dob = getdate(date_of_birth)
#         #     # Perform any age validation if required
#         #     # For example, to ensure user is at least 18 years old:
#         #     # today_date = getdate(today())
#         #     # age = today_date.year - dob.year - ((today_date.month, today_date.day) < (dob.month, dob.day))
#         #     # if age < 18:
#         #     #    return error_response("You must be at least 18 years old to register")
#         # except:
#         #     return error_response("Invalid date format for date of birth. Use YYYY-MM-DD")
        
#         # Validate password strength
#         if len(password) < 8:
#             return error_response("Password must be at least 8 characters long")
            
#         # Create new user
#         user = frappe.new_doc("User")
#         user.email = email
#         user.first_name = first_name
#         user.last_name = last_name
#         user.send_welcome_email = 1
#         user.enabled = 1
#         user.new_password = password
#         user.mobile_no = phone
#         user.user_type = "System User"
        
#         # Assign Role Profile
#         user.role_profile_name = "Trader"

#         # Save user with profiles
#         user.insert(ignore_permissions=True)
#         # Assign Module Profile
#         # module_profile = frappe.get_doc("Module Profile", "Trader")
#         # for module in module_profile.modules:
#         #     user.append("block_modules", {
#         #         "module": module.module
#         #     })
#         promotional_wallet_amount = 0

#         if referral_code:
#             referral_doc = frappe.get_doc("Referral Code", referral_code)

#             if int(referral_doc.total_referrals) >= int(referral_doc.total_allowed_referrals):
#                 return error_response("This referral code has reached its limit")
            
#             # Increment referral count
#             referral_doc.total_referrals += 1
#             referral_doc.save(ignore_permissions=True)  # Don't forget to save

#             referral_config = frappe.get_doc("Referral Config", referral_doc.referral_name)

#             # Add referee reward to their promotional wallet amount
#             promotional_wallet_amount += referral_config.referee_reward_amount

#             # Get referrer's promotional wallet
#             promotional_wallet_data = frappe.db.sql("""
#                 SELECT name, balance FROM `tabPromotional Wallet`
#                 WHERE user = %s AND is_active = 1
#             """, (referral_doc.user,), as_dict=True)

#             if not promotional_wallet_data:
#                 frappe.throw(f"No active promotional wallet found for {referral_doc.user}")

#             wallet_name = promotional_wallet_data[0]["name"]
#             available_balance = promotional_wallet_data[0]["balance"]

#             # Add referrer reward to wallet
#             new_balance = available_balance + referral_config.referrer_reward_amount

#             frappe.db.set_value("Promotional Wallet", wallet_name, "balance", new_balance)

#             # Create Referral Tracking entry
#             referral_tracking = frappe.get_doc({
#                 'doctype': 'Referral Tracking',
#                 'referrer_user': referral_doc.user,
#                 'referee_user': user.name,
#                 'referral_code': referral_code,
#                 'referrer_reward': referral_config.referrer_reward_amount,
#                 'referee_reward': referral_config.referee_reward_amount,
#                 'status': 'Rewarded'
#             })
#             referral_tracking.insert(ignore_permissions=True)
        
#         # Add role directly to ensure it's applied
#         if not frappe.db.exists("Has Role", {"parent": user.name, "role": "Trader"}):
#             role = user.append("roles", {})
#             role.role = "Trader"
#             user.save(ignore_permissions=True)
        
#         # Commit transaction
#         frappe.db.commit()

#         # Fetch active referral configs
#         referrals = frappe.db.sql(
#             """
#             SELECT
#                 referral_name
#             FROM `tabReferral Config`
#             WHERE is_active = 1
#             """,
#             as_dict=True
#         )
#         user_referral = ""
#         if referrals:
#             user_referral = frappe.get_doc({
#                 'doctype': 'Referral Code',
#                 'user': user.name,
#                 'referral_name': referrals[0]['referral_name']
#             })
#             user_referral.insert(ignore_permissions=True)
#         else:
#             frappe.throw("No active Referral Config found.")

#         wallet = frappe.new_doc("User Wallet")
#         wallet.user = user.name
#         wallet.balance = 5000
#         wallet.is_active = 1
#         wallet.save(ignore_permissions=True)

#         promotional_wallet = frappe.new_doc("Promotional Wallet")
#         promotional_wallet.user = user.name
#         promotional_wallet.balance = promotional_wallet_amount
#         promotional_wallet.is_active = 1
#         promotional_wallet.referral_code = user_referral.name
#         promotional_wallet.save(ignore_permissions=True)

#         # Optional: Only needed if inside a custom function, not a DocType method
#         frappe.db.commit()

#         return success_response(f"User registered successfully as Trader. Here is referral code: {user_referral.name}")
    
#     except Exception as e:
#         frappe.db.rollback()
#         frappe.log_error(frappe.get_traceback(), _("Trader Signup Error"))
#         return error_response(f"Registration failed: {str(e)}")
# def send_sms(mobile_number,otp):
#     try:
#         url = "http://65.2.148.196:8081/message/sendText/test1"

#         payload = {
#             "number": f"91{mobile_number}",
#             "text": f"Hi *ONO User*,\nYour login OTP is *{otp}*",
#             "delay": 1
#         }
#         headers = {
#             "apikey": "modimc",
#             "Content-Type": "application/json"
#         }

#         response = requests.post(url, json=payload, headers=headers)
#         return True
#     except Exception as e:
#         frappe.log_error("Error in sending OTP",f"{str(e)}")
#         return False

@frappe.whitelist(allow_guest=True)
def update_profile(user, token):
    try:
        user_doc = frappe.get_doc("User",user)
        user_doc.fcm_token = token
        user_doc.save(ignore_permissions=True)
        frappe.db.commit()
        success_response("Token updated successfully")
    except Exception as e:
        frappe.throw(f"Error in profile updation {str(e)}")


def send_sms(mobile_number, otp):
    try:
        url = "http://65.2.148.196:8081/message/sendText/ONO"
        
        payload = {
            "number": f"91{mobile_number}",
            "text": f"Hi *ONO User,*\nYour login OTP is *{otp}*",
            "delay": 1
        }
        
        headers = {
            "apikey": "modimc",
            "Content-Type": "application/json"
        }
        
        # Add timeout to prevent hanging connections
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        
        if response.status_code == 201:
            frappe.logger().info(f"SMS sent successfully to {mobile_number}")
            return True
        else:
            frappe.logger().error(f"SMS API returned non-200 response: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.ConnectionError as e:
        frappe.log_error("SMS Connection Error", f"Failed to connect to SMS service: {str(e)}")
        # You might want to continue with the login process even if SMS fails in production
        return False
    except requests.exceptions.Timeout as e:
        frappe.log_error("SMS Timeout Error", f"SMS service timed out: {str(e)}")
        return False
    except Exception as e:
        frappe.log_error("SMS General Error", f"Unexpected error sending SMS: {str(e)}")
        return False

@frappe.whitelist(allow_guest=True)
def generate_mobile_otp(mobile_number):
    # Validate mobile number format
    if not re.match(r'^\d{10}$', mobile_number):
        # frappe.throw("Please enter a valid 10-digit mobile number")
        return error_response("Please enter a valid 10-digit mobile number")

    # Generate 6-digit OTP
    otp = ''.join(random.choice('0123456789') for _ in range(6))
    
    # Set expiry (e.g., 10 minutes from now)
    expiry = frappe.utils.now_datetime() + datetime.timedelta(minutes=10)

     # Here you would integrate with an SMS gateway to send the OTP
    if not send_sms(mobile_number, otp):
        return error_response("Error in sending otp")

    # Store OTP
    existing = frappe.db.get_value("Mobile OTP", {"mobile_number": mobile_number})
    if existing:
        otp_doc = frappe.get_doc("Mobile OTP", existing)
        otp_doc.otp = otp
        otp_doc.expires_at = expiry
        otp_doc.verified = 0
        otp_doc.save(ignore_permissions=True)
    else:
        otp_doc = frappe.get_doc({
            "doctype": "Mobile OTP",
            "mobile_number": mobile_number,
            "otp": otp,
            "expires_at": expiry,
            "verified": 0
        }).insert(ignore_permissions=True)
    
    return {"success": True, "message": "OTP sent successfully"}


@frappe.whitelist(allow_guest=True)
def verify_otp(mobile, otp):
    otp_record = frappe.get_list("Mobile OTP", 
        filters={"mobile_number": mobile},
        fields=["name", "otp", "expires_at", "verified"])
    
    if not otp_record:
        return error_response("No OTP found for this mobile number")
    
    otp_doc = frappe.get_doc("Mobile OTP", otp_record[0].name)
    
    # Check if OTP is expired
    if frappe.utils.now_datetime() > otp_doc.expires_at:
        return error_response("OTP has expired. Please request a new one")
    
    if otp_doc.verified == 1:
        return error_response("OTP is already verified. Please request a new one")

    # Verify OTP
    if otp_doc.otp != otp:
        return error_response("Invalid OTP")

    # Mark as verified
    otp_doc.verified = 1
    otp_doc.save(ignore_permissions=True)

    user = frappe.db.get_value("User", {"phone": mobile})
    if not user:
        username = f"user_{frappe.utils.now_datetime().strftime('%Y%m%d%H%M%S')}"
        user_doc = frappe.get_doc({
            "doctype": "User",
            "user_name": username,
            "email": f"{username}@ono.com",
            "first_name": "ONO User",
            "phone": mobile,
            "enabled": 1,
            "role_profile_name": "Trader",  # set role profile
            "roles": [{"role": "Trader"}],  # assign specific role as well
        })
        user_doc.insert(ignore_permissions=True)
        user = user_doc.name  # get the name (string)

        wallet = frappe.new_doc("User Wallet")
        wallet.user = user
        wallet.balance = 2000
        wallet.is_active = 1
        wallet.insert(ignore_permissions=True)

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

        referral_name = "Default Referral"
        if not referrals:
            referral_name = frappe.get_doc({
                'doctype': 'Referral Config',
                'referral_name': 'Default Referral',
                'referrer_reward_point':50.0,
                'referee_reward_point':50.0,
                'total_allowed_referrals':5,
                'description':'This is default referral config for each user',
                'is_active':'1'
            }).insert(ignore_permissions=True)
        else:
            referral_name = referrals[0]['referral_name']

        user_referral = frappe.get_doc({
            'doctype': 'Referral Code',
            'user': user,
            'referral_name': referral_name
        })
        user_referral.insert(ignore_permissions=True)

        promo_wallet = frappe.new_doc("Promotional Wallet")
        promo_wallet.user = user
        promo_wallet.balance = 0
        promo_wallet.referral_code = user_referral.name
        promo_wallet.is_active = 1
        promo_wallet.insert(ignore_permissions=True)
        
    # Log the user in
    frappe.local.login_manager = LoginManager()
    frappe.local.login_manager.login_as(user)

    # # Mark OTP as used
    # frappe.db.set_value("Mobile OTP", otp_doc.name, "is_used", 1)

    # Initialize cookies
    frappe.local.cookie_manager.init_cookies()
    
    # Get user information for setting additional cookies
    user_info = frappe.db.get_value("User", user, ["first_name", "last_name", "user_image"], as_dict=1)
    
    # Set additional cookies
    full_name = " ".join(filter(None, [user_info.first_name, user_info.last_name]))
    frappe.local.cookie_manager.set_cookie("user_id", user)
    frappe.local.cookie_manager.set_cookie("full_name", full_name)
    frappe.local.cookie_manager.set_cookie("user_image", user_info.user_image or "")
    
    # Set system_user cookie
    if frappe.db.get_value("User", user, "user_type") == "Website User":
        frappe.local.cookie_manager.set_cookie("system_user", "no")
    else:
        frappe.local.cookie_manager.set_cookie("system_user", "yes")

    frappe.db.commit()

    return {"message": "Logged in", "sid": frappe.session.sid}

@frappe.whitelist(allow_guest=True)
def execute():
    try:
        now = now_datetime()

        frappe.logger().info(f"[Market Close API] Now: {now}, Adjusted:")
        
        markets = frappe.get_all(
            "Market",
            filters={"status": "OPEN", "closing_time": ["<=", now]},
            fields=["name", "closing_time"]
        )

        if not markets:
            frappe.logger().info("[Market Close API] No markets to close")
            return {"status": "no_markets"}

        for market in markets:
            try:
                frappe.logger().info(f"[Market Close API] Closing market: {market.name}")
                doc = frappe.get_doc("Market", market.name)
                doc.status = "CLOSED"
                doc.flags.ignore_version = True   # <- CRUCIAL
                doc.save(ignore_permissions=True)  # <- CRUCIAL
                frappe.logger().info(f"[Market Close API] Market {market.name} closed.")
            except Exception as e:
                frappe.log_error(f"Error closing market {market.name}: {str(e)}")

        frappe.db.commit()
        return {"status": "success", "closed": [m.name for m in markets]}
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(f"Market closing script error: {str(e)}")
        return {"status": "error", "message": str(e)}


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
def check_referral(user_id,referral_code):
    
    try:
        referral_doc = frappe.get_doc("Referral Code", referral_code)

        if int(referral_doc.total_referrals) >= int(referral_doc.total_allowed_referrals):
            frappe.throw("This referral code has reached its limit")

        promotional_wallet_amount = 0
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
            'referee_user': user_id,
            'referral_code': referral_code,
            'referrer_reward': referral_config.referrer_reward_amount,
            'referee_reward': referral_config.referee_reward_amount,
            'status': 'Rewarded'
        })
        referral_tracking.insert(ignore_permissions=True)
        return success_response("Referral point awarded")
    except Exception as e:
        frappe.throw(f"Registration failed: {str(e)}")