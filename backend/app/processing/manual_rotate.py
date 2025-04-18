import cv2
import os

def rotate_processed_image(session_id, image_id, angle):
    if angle == 0: return

    image_path = f"../processed_images/{session_id}/{image_id}.jpg"

    image = cv2.imread(image_path)
    
    if angle == 90:
        image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif angle == 180:
        image = cv2.rotate(image, cv2.ROTATE_180)
    elif angle == 270:
        image = cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)

    cv2.imwrite(image_path, image)


    

    
