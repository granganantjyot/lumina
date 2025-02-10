import dlib
import cv2
import numpy as np
import os


script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "shape_predictor_5_face_landmarks.dat")


detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(model_path)


def get_landmarks(image):
    faces = detector(image, 1)
    if not faces:
        return None

    res = predictor(image, faces[0])  # Use the first face

    # Return face landmarks
    return np.array([(res.part(i).x, res.part(i).y) for i in range(5)])


# Angle is for clockwise rotation
def rotate_image(image, angle):
    if angle == 90:
        return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif angle == 180:
        return cv2.rotate(image, cv2.ROTATE_180)
    elif angle == 270:
        return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    else:
        return image



def auto_rotate_image(image):



    # Create grey-scale version of image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    landmarks = get_landmarks(gray)

    # If landmarks have been detected in default orientation, we can return the image as-is
    if landmarks is not None:
        return image

    # Else, try all other rotations possible
    else:

        for angle in [90, 180, 270]:
            rotated_image = rotate_image(gray, angle)

            landmarks = get_landmarks(rotated_image)

            # If face landmarks are detected, then this is the rotation we need
            if landmarks is not None:
                return rotate_image(image, angle)
            

    return image


