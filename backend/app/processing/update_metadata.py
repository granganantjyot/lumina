import os
import time
from datetime import datetime
from exif import Image


def apply_date_metadata(session_id, image_id, date_string):

    image_path = f"../processed_images/{session_id}/{image_id}.jpg"
    date = datetime.strptime(date_string, "%Y-%m-%d")

    # Apply EXIF metadata
    apply_exif_metadata(image_path, date)
    
    # Make date tuple for os.utime
    date_tuple = (date.year, date.month, date.day, 0, 0, 0, 0, 0, -1)
    timestamp = time.mktime(date_tuple)
    os.utime(image_path, (timestamp, timestamp)) 

    
def apply_exif_metadata(image_path, date):
    formatted = datetime(date.year, date.month, date.day, 0, 0, 0)
    formatted = formatted.strftime("%Y:%m:%d %H:%M:%S")

    with open(image_path, 'rb') as file:
        img_bytes = file.read()

    img = Image(img_bytes)

    # Update EXIF fields
    img.set("datetime", formatted)
    img.set("datetime_original", formatted)
    img.set("datetime_digitized", formatted)

    # Save image
    with open(image_path, 'wb') as new_file:
        new_file.write(img.get_file())



