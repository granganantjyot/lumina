import asyncio
import json
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
from processing.preview import generate_preview


async def socket(websocket):
    try:
        while True:
            body = await websocket.recv()
            body = json.loads(body)
            print(f'****Received: index {body['index']}')

            res = generate_preview(body["parentImageID"], body["frame"])

            response = {"image": f"data:image/jpg;base64,{res}",
                        "parentImageID": body["parentImageID"],
                        "index": body["index"]}

            await websocket.send(json.dumps(response))
            print("sent")

    except (ConnectionClosedOK, ConnectionClosedError) as e:
        print(f"Client disconnected: {e}")

    except Exception as e:
        print(f"Websocket error: {e}")

    finally:
        await websocket.close()


async def main():
    async with serve(socket, "localhost", 8765):
        print("Starting socket...")
        await asyncio.get_running_loop().create_future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
