import threading
import time
from call import VoiceCall

call = VoiceCall("dr1234", "ws://localhost:8080")
print("here say aha")

def handleCalls():
    print("ping ...")
    time.sleep(4)
    call.acceptCall()


threading.Thread(target=handleCalls).start()
call.run()