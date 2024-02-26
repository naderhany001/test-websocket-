import pyaudio
import time
import websocket
import threading

# Audio parameters
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024


class VoiceCall:
    def __init__(self, id, url) -> None:
        self.id = id
        self.call = False

        print("setting microphone stream")
        # setting microphone stream
        self.micStream = pyaudio.PyAudio().open(
            format=FORMAT,
            channels=CHANNELS,
            rate=RATE,
            input=True,
            frames_per_buffer=CHUNK,
        )

        print("setting speaker stream")
        # setting speaker stream
        self.speakerStream = pyaudio.PyAudio().open(
            format=FORMAT,
            channels=CHANNELS,
            rate=RATE,
            output=True,
            frames_per_buffer=CHUNK,
        )

        print("setting up the websocket client")
        # setting up the websocket client
        self.ws = websocket.WebSocketApp(
            url,
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close,
        )

        print("Bind the on_open function ")
        # Bind the on_open function to the WebSocket instance
        self.ws.on_open = self.on_open

    def on_message(self, ws, message):
        # print('inside',self.call)
        if self.call == True:
            self.speakerStream.write(message)

    def on_error(self, ws, error):
        print(f"Error: {error}")

    def on_close(self, ws):
        print("disconnected the websocket server")

    def on_open(self, ws):
        print("Connected to websocket server")
        self.register()
        threading.Thread(target=self.mic_stream).start()

    def startcall(self, id):
        self.call = True
        self.ws.send("connect " + self.id + " " + id)

    def acceptCall(self):
        self.call = True

    def endCall(self):
        self.call = False

    def stopCall(self):
        self.call = False
        self.ws.send("disconnect " + self.id)

    def register(self):
        print(" registering device " + self.id)
        self.ws.send("register " + self.id)

    def run(self):
        print("Run the WebSocketApp")
        # Run the WebSocketApp
        self.ws.run_forever()

    def mic_stream(self):
        print("Starting Microphone Stream task ")
        try:
            while True:
                if self.call == True:
                    data = self.micStream.read(CHUNK)
                    bts = str("stream " + self.id + " ").encode()
                    self.ws.send_bytes(bts + data)
                else:
                    time.sleep(1)
        except KeyboardInterrupt:
            print("Stopping call ...")
            self.micStream.stop_stream()
            self.micStream.close()

    def terminate(self):
        try:
            self.micStream.stop_stream()
            self.micStream.close()
            self.speakerStream.stop_stream()
            self.speakerStream.close()
            pyaudio.PyAudio().close()
            pyaudio.PyAudio().close()
        except :
            print("terminate unknown error ...")

