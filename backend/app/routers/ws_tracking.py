from fastapi import APIRouter, WebSocket
import json

router = APIRouter(prefix="/ws", tags=["WebSocket"])
connections = {}

@router.websocket("/track/{order_id}")
async def order_tracking(websocket: WebSocket, order_id: int):
    await websocket.accept()
    connections[order_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Received: {data}")
    except:
        connections.pop(order_id, None)
        await websocket.close()
