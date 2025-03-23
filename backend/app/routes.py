import json
from fastapi import UploadFile, APIRouter, Form, Request, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Annotated
from processing.corners import get_image_frames
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


    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    for index, file in enumerate(files):

        # use image code as name of file in uploads
        img_code = session_id + "_" + str(index)
        
        # Iterate through all files, and get all image frames
        images_corners = await get_image_frames(file, UPLOAD_FOLDER, img_code)
        result.append({"parentImgID": img_code, "imageFrames": images_corners})


    return {"processedResult": result}


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


@router.post("/api/confirm")
async def confirm(request: Request, background_tasks: BackgroundTasks):

    body = await request.json()
    finalImages = body["finalImages"]
    sessionId = body['sessionId']

    for image in finalImages:

        # Apply final rotation
        rotate_processed_image(sessionId, image["imageID"], image["angle"])

        # Apply metadata updates
        apply_date_metadata(sessionId, image["imageID"], image["date"])

        # Delete all uploaded parent images
        parent_image_path = f"{UPLOAD_FOLDER}/{image["parentImageID"]}.png"
        if os.path.exists(parent_image_path):
            os.remove(parent_image_path)

    # Create zip folder for download
    processed_images_folder = f"../processed_images/{sessionId}"
    zip_folder = f"../downloads/lumina_{sessionId}"
    shutil.make_archive(zip_folder, 'zip', processed_images_folder)

    # Delete old processed images
    processed_images_path = f"../processed_images/{sessionId}"

    if os.path.exists(processed_images_path):
        shutil.rmtree(processed_images_path)



    # Update analytics
    with open('../analytics.json', 'r+') as f:
        data = json.load(f)
        data["sessions"] += 1
        data["imagesProcessed"] += len(finalImages)

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()


    # Return file response
    file_path = f"../downloads/lumina_{sessionId}.zip"
    background_tasks.add_task(lambda: os.remove(file_path) if os.path.exists(file_path) else None) # Add download file removal in background task (executes after file response is sent)
    
    return FileResponse(
        file_path,
        filename=f"lumina_{sessionId}.zip",
        media_type="application/zip",
    )
