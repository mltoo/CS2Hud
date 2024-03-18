from fastapi import FastAPI, Request
import socketio
import json

fastAPIApp = FastAPI()
sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode="asgi")
app = socketio.ASGIApp(sio, fastAPIApp)

clientsList = []

extraData = {
        'mapDamage': {
        }
}

@sio.event
async def connect(sid, environ, auth):
    print("connect ", sid)

@sio.event
async def disconnect(sid):
    print("disconnect", sid)


@fastAPIApp.post("/test")
async def root(request: Request):
    bodyJSON: dict = await request.json();
    if 'map' in bodyJSON:
        if bodyJSON['map']['name'] not in extraData['mapDamage']:
            extraData['mapDamage'][bodyJSON['map']['name']] = {}
        if 'allplayers' in bodyJSON:
            for player in bodyJSON['allplayers']:
                if player not in extraData['mapDamage'][bodyJSON['map']['name']]:
                    extraData['mapDamage'][bodyJSON['map']['name']][player] = {}
                if (bodyJSON['map']['round'] not in extraData['mapDamage'][bodyJSON['map']['name']][player] or extraData['mapDamage'][bodyJSON['map']['name']][player][bodyJSON['map']['round']] < bodyJSON['allplayers'][player]['state']['round_totaldmg']) and bodyJSON["round"]["phase"] == "live":
                    extraData['mapDamage'][bodyJSON['map']['name']][player][bodyJSON['map']['round']] = bodyJSON['allplayers'][player]['state']['round_totaldmg']
    bodyJSON['extradata'] = extraData;
    await sio.emit(json.dumps(bodyJSON))
    return "success!!"

