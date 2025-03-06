import json
from textwrap import indent
from fastapi import UploadFile, APIRouter, Form, Request
from typing import Annotated
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


@router.post("/api/confirm")
async def confirm(request: Request):

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

    print(json.dumps(body, indent=4))


    # TODO: Schedule deletion of the zip file after 5 minutes

    # Update analytics
    images_processed = 0
    with open('../analytics.json', 'r+') as f:
        data = json.load(f)
        data["sessions"] += 1
        images_processed = data["imagesProcessed"]
        data["imagesProcessed"] += len(finalImages)

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()



    return {"download": f"{str(request.base_url)}downloads/lumina_{sessionId}.zip",
            "analytics": [images_processed, len(finalImages)]
            }
