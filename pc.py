import threading
import time
from call import VoiceCall

call = VoiceCall("pc1234", "ws://localhost:8080")

def handleCalls():
    time.sleep(3)
    call.startcall('dr1234')


threading.Thread(target=handleCalls).start()
call.run()