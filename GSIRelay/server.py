from fastapi import FastAPI, Request
import socketio

fastAPIApp = FastAPI()
sio = socketio.AsyncServer()
app = socketio.ASGIApp(sio,fastAPIApp)

clientsList = []




@fastAPIApp.post("/test")
async def root(request: Request):
    await sio.emit(request.body)
    return "success!!"

