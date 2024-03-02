from fastapi import FastAPI, Request
import socketio

fastAPIApp = FastAPI()
sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode="asgi")
app = socketio.ASGIApp(sio, fastAPIApp)

clientsList = []

@sio.event
async def connect(sid, environ, auth):
    print("connect ", sid)

@sio.event
async def disconnect(sid):
    print("disconnect", sid)

@sio.on('*')
async def any_event(event, sid, data):
    print( "HERE")


@fastAPIApp.post("/test")
async def root(request: Request):
    body = (await request.body()).decode()
    await sio.emit(body)
    return "success!!"

