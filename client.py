import websocket

def on_message(ws, message):
    print(f"Received: {message}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws):
    print("Connection closed")

def on_open(ws):
    print("Connection established")
    # Send a message to the server after connection is established
    ws.send("Hello, NaderHany server!")

if __name__ == "__main__":
    # WebSocket server URL
    websocket_url = "wss://test-websocket-po6o.onrender.com"

    # Create a WebSocket instance
    ws = websocket.WebSocketApp(websocket_url,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)

    # Bind the on_open function to the WebSocket instance
    ws.on_open = on_open

    # Run the WebSocketApp
    ws.run_forever()
