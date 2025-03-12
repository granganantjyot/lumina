import cv2
import numpy as np
from fastapi import UploadFile

import pillow_heif
import io
from PIL import Image
import numpy as np
import cv2
import os
import shutil


def is_background_dark(grayed_image, border_ratio=0.1, threshold=75): # Threshold can be between 0 - 255 color

    h, w = grayed_image.shape[:2]

    # Get samples from all 4 borders
    top = grayed_image[0:int(border_ratio*h), :]
    bottom = grayed_image[int((1-border_ratio)*h):h, :]
    left = grayed_image[:, 0:int(border_ratio*w)]
    right = grayed_image[:, int((1-border_ratio)*w):w]

    # Combine into one array
    border_pixels = np.concatenate((top.flatten(), bottom.flatten(),
                                    left.flatten(), right.flatten()), axis=0)
    mean_border = np.mean(border_pixels)

    # If the border is darker than the threshold, then assume a dark background
    return mean_border < threshold


async def get_images_corners(image):
    print("getting corners")
    

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


    # Applying different threshold depending on background color
    if (is_background_dark(gray)):
        gray = 255 - gray # invert image
        gray = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX)

        # Apply GaussianBlur to reduce noise and improve edge detection
        blurred = cv2.GaussianBlur(gray, (7, 7), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    else:
        gray = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX)

        # Apply GaussianBlur to reduce noise and improve edge detection
        blurred = cv2.GaussianBlur(gray, (7, 7), 0)
        thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 11, 2)


    # Canny edge detection
    edges = cv2.Canny(blurred, 50, 150)

    # Combine threshold and edges
    combined = cv2.bitwise_or(thresh, edges)

    # Use morphological operations to close gaps between object edges
    kernel = np.ones((7, 7), np.uint8)
    morph = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel)


    # Find contours in the thresholded image
    contours, hierarchy = cv2.findContours(morph, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)


    extracted_images_coordinates = []

    # Extract images
    for i, contour in enumerate(contours):

        if hierarchy[0][i][3] != -1:  # Skip nested contours
            continue


        # Ignore small contours that are unlikely to be a photo
        image_area = image.shape[0] * image.shape[1]
        if cv2.contourArea(contour) < (image_area * 0.02):  # If the area of the contour is less than 2% of the whole photo's area, ignore it
            continue


        # Get the detected contour as a rectangle
        rect = cv2.minAreaRect(contour)

        box = cv2.boxPoints(rect)  
        box = np.intp(box)


        # Get 4 corners/coordinates of each extracted image and display preview with corners
        coords = []
        for point in box:
            x, y = int(point[0]), int( point[1])
            coords.append([x, y])


        coords = sorted(coords, key= lambda point : (point[1], point[0])) # Sort by y-coordinates first (ascending)
        print(coords)

        # In OpenCV, the origin (0,0) is at the top left corner of the source image
        top_left, top_right = sorted(coords[:2], key= lambda point : point[0]) # Get top corners
        bot_left, bot_right = sorted(coords[2:], key= lambda point : point[0]) # Get bottom corners

        formatted = {"tl" : top_left, "tr" : top_right, "br" : bot_right, "bl" : bot_left}
        print(formatted)
        extracted_images_coordinates.append(formatted)

    return extracted_images_coordinates



async def get_image_crops(file: UploadFile, UPLOAD_FOLDER: str, img_code: str):

    # get byte contents of file
    contents = await file.read()


    # handle .heic image files separately
    if (str(file.filename).lower().endswith(".heic")):
            print(f"converting heic {file.filename}")

            # Convert the heic file into a format that is processable by opencv
            heif_image = pillow_heif.open_heif(io.BytesIO(contents))
            pil_image = Image.frombytes(heif_image.mode, heif_image.size, heif_image.data)
            image_as_array = np.array(pil_image, dtype=np.uint8)
            processable_file = cv2.cvtColor(image_as_array, cv2.COLOR_RGB2BGR)

            # Save the heic file as png to Uploads
            file.file.seek(0)
            file_path = os.path.join(UPLOAD_FOLDER, f"{img_code}.png")
            pil_image.save(file_path, "png")

    else:
        # Convert image file into a format that is processable by opencv
        image_as_array = np.frombuffer(contents, np.uint8)
        processable_file = cv2.imdecode(image_as_array, cv2.IMREAD_COLOR)

        # Save the image file as png to Uploads
        file.file.seek(0)
        file_path = os.path.join(UPLOAD_FOLDER, f"{img_code}.png")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)


    # Process the opencv image and get the corner crops
    images_crops = await get_images_corners(processable_file)
    return images_crops
