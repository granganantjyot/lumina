from fastapi import FastAPI, File, UploadFile, APIRouter, Form
from typing import Annotated
from processing.corners import get_images_corners
import os
import shutil

router = APIRouter()

@router.post("/api/upload")
async def upload(files: list[UploadFile], session_id: Annotated[str, Form()],):

    result = []
    count = 0


    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../uploads")
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)


    for file in files:

        # Iterate through all files, and get all image frames
        images_corners = await get_images_corners(file)
        img_code = session_id + "_" + str(count) # use this image code to store the actual image in session storage
        result.append({"parentImgID" : img_code, "imageFrames" : images_corners})


        # Save the file to uploads
        file.file.seek(0)  
        file_path = os.path.join(UPLOAD_FOLDER, f"{img_code}.png")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)


        count += 1
    
    return {"filenames": [file.filename for file in files], "processedResult" : result}

