import threading
import time
from call import VoiceCall

call = VoiceCall("dr1234", "wss://test-websocket-po6o.onrender.com")


def handleCalls():
    print("ping ...")
    time.sleep(4)
    call.acceptCall()


threading.Thread(target=handleCalls).start()
call.run()
