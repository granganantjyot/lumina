import os
import time
from datetime import datetime


def apply_date_metadata(session_id, image_id, date_string):
    print(date_string)
    image_path = f"../processed_images/{session_id}/{image_id}.png"

    date = datetime.strptime(date_string, "%Y-%m-%d")

    date = (date.year, date.month, date.day, 0, 0, 0, 0, 0, -1)

    timestamp = time.mktime(date)
    os.utime(image_path, (timestamp, timestamp)) 

