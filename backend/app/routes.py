from fastapi import FastAPI, File, UploadFile, APIRouter, Form
from typing import Annotated
from processing.corners import get_images_corners

router = APIRouter()

@router.post("/api/upload")
async def upload(files: list[UploadFile], session_id: Annotated[str, Form()],):

    result = []
    count = 0

    for file in files:
        images_corners = await get_images_corners(file)

        img_code = session_id + "_" + str(count) # use this image code to store the actual image in session storage

        result.append({"parentImg" : img_code, "imageFrames" : images_corners})

        count += 1
    
    return {"filenames": [file.filename for file in files], "processedResult" : result}

