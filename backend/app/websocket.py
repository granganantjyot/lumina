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
            print(f"executing {body["index"]} of {body["parentImageID"]}", flush=True)

            # Generate preview 
            res = generate_preview(body["parentImageID"], body["frame"])

            response = {
                "image": f"data:image/jpg;base64,{res}",
                "parentImageID": body["parentImageID"],
                "index": body["index"]
            }


            await websocket.send(json.dumps(response))
            print("Sent response", flush=True)
        except Exception as e:
            print(f"Error processing message: {e}", flush=True)
        finally:
            global_queue.task_done()  # Mark task as complete


async def socket(websocket):

    # Process message
    try:
        while True:
            body = await websocket.recv()
            body = json.loads(body)

            await global_queue.put((websocket, body))

            print("sent", flush=True)

    except (ConnectionClosedOK, ConnectionClosedError) as e:
        print(f"Client disconnected: {e}", flush=True)

    except Exception as e:
        print(f"Websocket error: {e}", flush=True)

    finally:
        await websocket.close()


async def main():
    asyncio.create_task(process_messages())
    async with serve(socket, "0.0.0.0", os.getenv("WS_PORT")):
        print("Starting socket...", flush=True)
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
