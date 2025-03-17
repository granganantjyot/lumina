from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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


@app.get("/")
async def root():
    return {"message": "Working as expected :)"}


