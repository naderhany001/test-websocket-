import pyaudio
import time
import websocket
import threading

# Audio parameters
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024


audio = pyaudio.PyAudio()
stream = audio.open(
    format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK
)


def on_message(ws, message):
    print(f"Received: {message}")


def on_error(ws, error):
    print(f"Error: {error}")


def on_close(ws):
    print("Connection closed")


def on_open(ws):
    print("Connection established")
    print("Registering device...")
    ws.send("register dr1234")
    print("Streaming data...")
    threading.Thread(target=stream_data).start()


websocket_url = "ws://localhost:8080"

# Create a WebSocket instance
ws = websocket.WebSocketApp(
    websocket_url, on_message=on_message, on_error=on_error, on_close=on_close
)


def stream_data():
    try:
        input("Press Enter to start streaming...")
        # Connect the device
        print("Connecting device...")
        
        while True:
            data = stream.read(CHUNK)
            bts = str("stream dr1234 ").encode()
            ws.send_bytes(bts + data)
    except KeyboardInterrupt:
        print("Stopping streaming...")
        stream.stop_stream()
        stream.close()
        audio.terminate()


ws.on_open = on_open
ws.run_forever()
