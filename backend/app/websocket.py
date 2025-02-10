import asyncio
import json
from websockets.asyncio.server import serve
from processing.preview import generate_preview


async def socket(websocket):
    while True:
        body = await websocket.recv()
        body = json.loads(body)
        print(f'****Received: index {body['index']}')

        res = generate_preview(body["parentImageID"], body["frame"])

        response = {"image" : f"data:image/jpg;base64,{res}", "parentImageID" : body["parentImageID"], "index" : body["index"]}



        await websocket.send(json.dumps(response))
        print("sent")



async def main():
    async with serve(socket, "localhost", 8765):
        print("Starting socket...")
        await asyncio.get_running_loop().create_future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())