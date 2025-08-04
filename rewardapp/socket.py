# simple_websocket_test.py
# Add this file to: apps/ono_app/ono_app/simple_websocket_test.py

import asyncio
import websockets
import json
import threading
import frappe
from datetime import datetime

class SimpleWebSocketServer:
    def __init__(self, port=8765):
        self.port = port
        self.clients = set()
        self.running = False
    
    async def handle_client(self, websocket, path):
        """Handle new client connections"""
        print(f"Client connected: {websocket.remote_address}")
        self.clients.add(websocket)
        
        try:
            # Send welcome message
            welcome = {
                "type": "welcome",
                "message": "Connected to Frappe WebSocket Test",
                "timestamp": datetime.now().isoformat()
            }
            await websocket.send(json.dumps(welcome))
            
            # Keep connection alive
            async for message in websocket:
                data = json.loads(message)
                if data.get('type') == 'ping':
                    await websocket.send(json.dumps({
                        "type": "pong",
                        "timestamp": datetime.now().isoformat()
                    }))
                
        except websockets.exceptions.ConnectionClosed:
            print(f"Client disconnected: {websocket.remote_address}")
        finally:
            self.clients.discard(websocket)
    
    async def broadcast_test_message(self):
        """Send test message every 10 seconds"""
        counter = 1
        while self.running:
            if self.clients:
                message = {
                    "type": "test_message",
                    "counter": counter,
                    "message": f"Test message #{counter}",
                    "timestamp": datetime.now().isoformat(),
                    "connected_clients": len(self.clients)
                }
                
                # Broadcast to all clients
                for client in self.clients.copy():
                    try:
                        await client.send(json.dumps(message))
                    except websockets.exceptions.ConnectionClosed:
                        # Client disconnected, remove them
                        self.clients.discard(client)
                    except Exception as e:
                        print(f"Error sending to client: {e}")
                        self.clients.discard(client)
                
                print(f"Sent test message #{counter} to {len(self.clients)} clients")
                counter += 1
            
            await asyncio.sleep(10)  # Send every 10 seconds
    
    async def start_server(self):
        """Start WebSocket server"""
        self.running = True
        print(f"Starting WebSocket server on port {self.port}")
        
        # Start broadcast task
        broadcast_task = asyncio.create_task(self.broadcast_test_message())
        
        try:
            # Start server
            # Corrected line: Pass the bound method handle_client directly
            async with websockets.serve(self.handle_client, "0.0.0.0", self.port):
                print(f"✅ WebSocket server running on ws://localhost:{self.port}")
                print("Waiting for connections...")
                await asyncio.Future()  # Run forever
        except Exception as e:
            print(f"❌ Server error: {e}")
        finally:
            self.running = False
            broadcast_task.cancel()

# Global server instance
websocket_server = None

def start_test_websocket():
    """Start WebSocket server in background thread"""
    global websocket_server
    
    # Only start if not already running
    if websocket_server and websocket_server.running:
        print("WebSocket server is already running.")
        return

    def run_server():
        global websocket_server
        websocket_server = SimpleWebSocketServer(port=8765)
        
        loop = asyncio.new_event_loop()
        websocket_server.loop = loop  # Save the loop in the instance
        asyncio.set_event_loop(loop)
        
        try:
            loop.run_until_complete(websocket_server.start_server())
        except Exception as e:
            print(f"WebSocket server failed: {e}")
        finally:
            loop.close()
    
    # Start in background thread
    thread = threading.Thread(target=run_server, daemon=True)
    thread.start()
    print("🚀 WebSocket test server started in background")

def send_test_event(event_type, data):
    """Send test event to connected clients"""
    global websocket_server
    
    if websocket_server and websocket_server.clients:
        message = {
            "event_type": event_type,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }

        async def _send_to_clients():
            for client in websocket_server.clients.copy():
                try:
                    await client.send(json.dumps(message))
                except websockets.exceptions.ConnectionClosed:
                    websocket_server.clients.discard(client)
                except Exception as e:
                    print(f"Error sending event to client: {e}")
                    websocket_server.clients.discard(client)

        # Submit coroutine to the server's loop
        if hasattr(websocket_server, 'loop') and websocket_server.loop.is_running():
            asyncio.run_coroutine_threadsafe(_send_to_clients(), websocket_server.loop)
        else:
            print("Server loop not running, cannot send event.")

# Test function you can call from Frappe
@frappe.whitelist()
def test_websocket_connection():
    """Test WebSocket connection - call this from Frappe"""
    try:
        global websocket_server
        
        if websocket_server is None or not websocket_server.running:
            start_test_websocket()
            return {
                "status": "started",
                "message": "WebSocket server started. Connect to ws://localhost:8765",
                "port": 8765
            }
        else:
            return {
                "status": "running", 
                "message": f"WebSocket server already running with {len(websocket_server.clients)} clients",
                "port": 8765,
                "clients": len(websocket_server.clients)
            }
            
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Auto-start when imported
try:
    start_test_websocket()
except Exception as e:
    print(f"Failed to auto-start WebSocket: {e}")