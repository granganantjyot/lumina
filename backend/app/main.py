from fastapi import FastAPI, File, UploadFile, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import router
from dotenv import load_dotenv
import os


load_dotenv()
print(os.getenv("ALLOWED_API_ORIGINS").split(","))
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_API_ORIGINS").split(","), 
    allow_credentials=True,  
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(router)


# Mount downloads folder
DOWNLOADS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../downloads")
os.makedirs(DOWNLOADS_FOLDER, exist_ok=True)
app.mount("/downloads", StaticFiles(directory=DOWNLOADS_FOLDER), name="downloads")


@app.get("/")
async def root():
    return {"message": "Working as expected :)"}


