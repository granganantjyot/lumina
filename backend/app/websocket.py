import asyncio
import json
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
from processing.preview import generate_preview
from dotenv import load_dotenv
import os


load_dotenv()

# Store preview requests in a queue (FIFO) to prevent overload
global_queue = asyncio.Queue()


async def process_messages():
    while True:
        websocket, body = await global_queue.get()

        try:
            print(f"executing {body["index"]} of {body["parentImageID"]}")

            # Generate preview 
            res = generate_preview(body["parentImageID"], body["frame"])

            response = {
                "image": f"data:image/jpg;base64,{res}",
                "parentImageID": body["parentImageID"],
                "index": body["index"]
            }


            await websocket.send(json.dumps(response))
            print("Sent response")
        except Exception as e:
            print(f"Error processing message: {e}")
        finally:
            global_queue.task_done()  # Mark task as complete


async def socket(websocket):

    # Do not allow connections from unauthorized origin
    connection_origin = websocket.request.headers.get("Origin", "")

    if connection_origin not in os.getenv("ALLOWED_WS_ORIGINS").split(","):
        print(f"Blocked WebSocket connection from unauthorized origin: {connection_origin}")
        await websocket.close()
        return

    # Process message
    try:
        while True:
            body = await websocket.recv()
            body = json.loads(body)

            await global_queue.put((websocket, body))

            print("sent")

    except (ConnectionClosedOK, ConnectionClosedError) as e:
        print(f"Client disconnected: {e}")

    except Exception as e:
        print(f"Websocket error: {e}")

    finally:
        await websocket.close()


async def main():
    asyncio.create_task(process_messages())
    async with serve(socket, "127.0.0.1", os.getenv("WS_PORT")):
        print("Starting socket...")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
