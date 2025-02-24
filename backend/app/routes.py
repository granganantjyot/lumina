import json
from textwrap import indent
from fastapi import UploadFile, APIRouter, Form, Request
from fastapi.responses import FileResponse
from typing import Annotated, Dict
from processing.corners import get_images_corners
import os
import shutil
from processing.enhance import enhance_parallel
from processing.manual_rotate import rotate_processed_image
from processing.update_metadata import apply_date_metadata
import shutil

router = APIRouter()
UPLOAD_FOLDER = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), "../uploads")


@router.post("/api/upload")
async def upload(files: list[UploadFile], session_id: Annotated[str, Form()],):

    result = []
    count = 0

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    for file in files:

        # Iterate through all files, and get all image frames
        images_corners = await get_images_corners(file)
        # use this image code to store the actual image in session storage
        img_code = session_id + "_" + str(count)
        result.append({"parentImgID": img_code, "imageFrames": images_corners})

        # Save the file to uploads
        file.file.seek(0)
        file_path = os.path.join(UPLOAD_FOLDER, f"{img_code}.png")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        count += 1

    return {"filenames": [file.filename for file in files], "processedResult": result}


@router.post("/api/process")
async def process(request: Request):

    body = await request.json()
    parentImgToFrames = body['parentImgToFrames']  # Contains parent image ids
    sessionId = body['sessionId']

    image_data = []

    for parent_img_id, child_images in parentImgToFrames.items():
        for child_corners in child_images:
            image_data.append((parent_img_id, child_corners, sessionId))

    return {"images": enhance_parallel(image_data)}

