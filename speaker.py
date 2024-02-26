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
    format=FORMAT, channels=CHANNELS, rate=RATE, output=True, frames_per_buffer=CHUNK
)

def on_message(ws, message):
    stream.write(message)

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws):
    print("Connection closed")

def on_open(ws):
    print("Connection established")
    unreachable_code(ws)


websocket_url = "ws://localhost:8080"
ws = websocket.WebSocketApp(
        websocket_url, on_message=on_message, on_error=on_error, on_close=on_close
)
def start_websocket():
    # websocket_url = "wss://test-websocket-po6o.onrender.com"
    ws.on_open = on_open
    ws.run_forever()

def unreachable_code(ws):
    print("*************************************")
    print("************* registering *************")
    ws.send("register pc1234")
    print("*************************************")
    # print("**************** connecting *************")
    # ws.send("connect pc1234 dr1234")
    print("*************************************")
    print("***************** done ***********")

start_websocket()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    stream.stop_stream()
    stream.close()
    audio.terminate()




# import pyaudio
# import time
# import websocket


# # Audio parameters
# FORMAT = pyaudio.paInt16
# CHANNELS = 1
# RATE = 44100
# CHUNK = 1024


# audio = pyaudio.PyAudio()
# stream = audio.open(
#     format=FORMAT, channels=CHANNELS, rate=RATE, output=True, frames_per_buffer=CHUNK
# )


# def on_message(ws, message):
#     # print(f"Received: {message}")
#     stream.write(message)


# def on_error(ws, error):
#     print(f"Error: {error}")


# def on_close(ws):
#     print("Connection closed")


# def on_open(ws):
#     print("Connection established")
#     # Send a message to the server after connection is established
#     # ws.send("Hello, NaderHany server!")

# # websocket_url = "wss://test-websocket-po6o.onrender.com"
# websocket_url = "ws://localhost:8080"
# # Create a WebSocket instance
# ws = websocket.WebSocketApp(
#     websocket_url, on_message=on_message, on_error=on_error, on_close=on_close
# )

# ws.on_open = on_open
# ws.run_forever()

# print("*************************************")
# print("************* registering *************")
# ws.send("register pc1234")
# print("*************************************")
# # print("**************** connecting *************")
# # ws.send("connect pc1234 dr1234")
# print("*************************************")
# print("***************** done ***********")


# try:
#     while True:

#         time.sleep(1)
# except:
#     stream.stop_stream()
#     stream.close()
#     audio.terminate()
