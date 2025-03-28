#!/usr/bin/env python3
# This is a standalone script to test Frappe's Socket.IO implementation
# Save it as test_socketio.py and run it with: bench execute test_socketio.py

import frappe
import time
import json

def test_socketio():
    """Test function to verify Socket.IO is working properly"""
    
    print("Starting Socket.IO test...")
    
    # 1. Check if socketio is enabled in site_config.json
    try:
        socketio_port = frappe.conf.get('socketio_port')
        redis_socketio = frappe.conf.get('redis_socketio')
        print(f"Socket.IO Configuration:")
        print(f"- socketio_port: {socketio_port}")
        print(f"- redis_socketio: {redis_socketio}")
        
        if not socketio_port:
            print("ERROR: socketio_port not configured in site_config.json")
            return
    except Exception as e:
        print(f"ERROR checking Socket.IO configuration: {str(e)}")
        return
    
    # 2. Send test events
    try:
        # Send a simple test event
        print("\nSending test_event...")
        frappe.publish_realtime(
            event="test_event",
            message={"message": "Test message from Frappe"},
            after_commit=True
        )
        
        # Send a progress update
        print("Sending progress update...")
        frappe.publish_progress(
            percent=50,
            title="Socket.IO Test",
            description="Testing Socket.IO functionality",
            user=frappe.session.user
        )
        
        # Send to a specific room
        print("Sending to 'all' room...")
        frappe.publish_realtime(
            event="custom_event",
            message={"message": "Message to all users"},
            room="all",
            after_commit=True
        )
        
        print("\nTest events sent! Check your client to see if they were received.")
        print("If not received, verify:")
        print("1. Redis is running and accessible")
        print("2. Socket.IO server is running (check with 'bench doctor')")
        print("3. Client is connecting to the correct endpoint")
        
    except Exception as e:
        print(f"ERROR sending test events: {str(e)}")
        
    # 3. Let's check the Redis socketio messages
    try:
        import redis
        from urllib.parse import urlparse
        
        print("\nChecking Redis for Socket.IO messages...")
        
        # Parse Redis URL
        if redis_socketio:
            parsed = urlparse(redis_socketio)
            redis_host = parsed.hostname or 'localhost'
            redis_port = parsed.port or 6379
            redis_db = int(parsed.path.replace('/', '') or 1)
            redis_password = parsed.password
            
            # Connect to Redis
            r = redis.Redis(
                host=redis_host,
                port=redis_port,
                db=redis_db,
                password=redis_password
            )
            
            # Check Redis connection
            if r.ping():
                print("Redis connection successful!")
                
                # Check for socketio keys
                socketio_keys = r.keys('socketio:*')
                if socketio_keys:
                    print(f"Found {len(socketio_keys)} Socket.IO related keys in Redis")
                    for key in socketio_keys[:5]:  # Show at most 5 keys
                        print(f"- {key.decode()}")
                else:
                    print("No Socket.IO keys found in Redis")
            else:
                print("Redis connection failed")
                
    except ImportError:
        print("Redis library not installed - skipping Redis check")
    except Exception as e:
        print(f"ERROR checking Redis: {str(e)}")
        
    print("\nTest completed!")

# Run the test
test_socketio()

# Use this to manually test publishing events from the bench console
# bench --site your_site_name console
# 
# Then run:
# frappe.publish_realtime(event="test_event", message={"message": "Hello from console"})