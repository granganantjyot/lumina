import base64
from xmlrpc.client import DateTime
import cv2
import numpy as np
from processing import auto_rotate
from concurrent.futures import ProcessPoolExecutor
from datetime import date, datetime
import os
import uuid
from PIL import Image, ImageEnhance


GLOBAL_EXECUTOR = ProcessPoolExecutor(max_workers=2)


def apply_filter_enhancements(image_path, sharpness=3, contrast=1.3, blur=3):

    # Load the image
    img = cv2.imread(image_path)

    # Convert the image to PIL Image
    pil_img = Image.fromarray(img)

    # Enhance the sharpness
    enhancer = ImageEnhance.Sharpness(pil_img)
    img_enhanced = enhancer.enhance(sharpness)

    # Enhance the contrast
    enhancer = ImageEnhance.Contrast(img_enhanced)
    img_enhanced = enhancer.enhance(contrast)

    # Convert back to OpenCV image (numpy array)
    img_enhanced = np.array(img_enhanced)

    # Apply a small amount of Gaussian blur
    img_enhanced = cv2.GaussianBlur(img_enhanced, (blur, blur), 0)

    return img_enhanced

    # # Convert back to PIL Image and save
    # img_enhanced = Image.fromarray(img_enhanced)
    # img_enhanced.save(output_path)


def upscale(image):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "FSRCNN-small_x2.pb")

    sr = cv2.dnn_superres.DnnSuperResImpl_create()
    sr.readModel(model_path)
    sr.setModel('fsrcnn', 2)

    upscaled = sr.upsample(image)

    return upscaled


def enhance(args):

    parent_img_id, corners, sessionId = args

    print(f"Processing: {parent_img_id}")

    image = cv2.imread(f"../uploads/{parent_img_id}.png")

    # Convert corners to float32
    src_points = np.array([
        corners["tl"], corners["tr"], corners["br"], corners["bl"]
    ], dtype=np.float32)

    # Compute width and height of the new image
    width_top = np.linalg.norm(src_points[1] - src_points[0])  # tr.x - tl.x
    width_bottom = np.linalg.norm(src_points[2] - src_points[3])  # br.x - bl.x
    # take max of both widths
    max_width = max(int(width_top), int(width_bottom))

    height_left = np.linalg.norm(src_points[3] - src_points[0])  # bl.y - tl.y
    height_right = np.linalg.norm(src_points[2] - src_points[1])  # br.y - tr.y
    max_height = max(int(height_left), int(height_right)
                     )  # take max of both heights

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

    rotated_image, angle = auto_rotate.auto_rotate_image(warped_image)

    # Save processed image in temporary directory, with original icc profile
    output_dir = f"../processed_images/{sessionId}"
    os.makedirs(output_dir, exist_ok=True)
    image_id = str(uuid.uuid4())
    warped_image = cv2.cvtColor(warped_image, cv2.COLOR_BGR2RGB)
    child_img = Image.fromarray(warped_image)
    parent_img = Image.open(f"../uploads/{parent_img_id}.png")
    # Save with icc profile of original parent image
    child_img.save(f"{output_dir}/{image_id}.png",
                   icc_profile=parent_img.info.get('icc_profile'))

    # Apply enhancements, generate preview
    enhanced_img = apply_filter_enhancements(f"{output_dir}/{image_id}.png")
    _, buffer = cv2.imencode(".jpg", enhanced_img, [
                             cv2.IMWRITE_JPEG_QUALITY, 80])

    # Upscale image and save it
    upscaled_img = upscale(enhanced_img)
    cv2.imwrite(f"{output_dir}/{image_id}.png", upscaled_img)

    return {
        "angle": angle,
        "image": f"data:image/jpg;base64,{base64.b64encode(buffer).decode("utf-8")}",
        "dimensions": upscaled_img.shape[0:2],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "parentImageID": parent_img_id,
        "imageID": image_id
    }


def enhance_parallel(image_data):
    results = list(GLOBAL_EXECUTOR.map(enhance, image_data))
    return results
