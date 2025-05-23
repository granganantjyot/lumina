import base64
import cv2
import numpy as np

from processing import auto_rotate

def generate_preview(parent_img_id, corners):
    image = cv2.imread(f"../uploads/{parent_img_id}.jpg")

    # Convert corners to float32
    src_points = np.array([
        corners["tl"], corners["tr"], corners["br"], corners["bl"]
    ], dtype=np.float32)

    # Compute width and height of the new image
    width_top = np.linalg.norm(src_points[1] - src_points[0]) # tr.x - tl.x
    width_bottom = np.linalg.norm(src_points[2] - src_points[3]) # br.x - bl.x
    max_width = max(int(width_top), int(width_bottom))  # take max of both widths

    height_left = np.linalg.norm(src_points[3] - src_points[0]) # bl.y - tl.y
    height_right = np.linalg.norm(src_points[2] - src_points[1])  # br.y - tr.y
    max_height = max(int(height_left), int(height_right)) # take max of both heights

    # Destination points (shape of preview)
    dst_points = np.array([
        [0, 0],            # Top left
        [max_width - 1, 0],  # Top right
        [max_width - 1, max_height - 1],  # Bottom right
        [0, max_height - 1]   # Bottom left
    ], dtype=np.float32)

    # Compute the perspective transform matrix
    matrix = cv2.getPerspectiveTransform(src_points, dst_points)

    # Apply perspective warp
    warped_image = cv2.warpPerspective(image, matrix, (max_width, max_height))

    





    _, buffer = cv2.imencode(".jpg", warped_image, [cv2.IMWRITE_JPEG_QUALITY, 80])

    return base64.b64encode(buffer).decode("utf-8")


