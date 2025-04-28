# 📸 Lumina

**[Lumina](https://lumina.anantjyotgrang.com)** is an application designed to help you digitize your physical photos and memories quickly — all without needing an expensive scanner.

---

## ✨ Features

- 📷 **Batch Photo Detection**: Upload a photo containing several printed photographs — Lumina uses computer vision techniques to detect each one automatically. Manual adjustments can be made if needed.
- 🔁 **Perspective Correction**: Warps non-rectangular selections into perfectly cropped images.
- 🧠 **Smart Enhancement**: Improves individual image quality by:
  - Automatically adjusting brightness, contrast, and sharpness
  - Using **FSRCNN** deep learning model to upscale image resolution by 2x, boosting clarity and details
- 📐 **Auto-Rotation**: Uses a lightweight **DLIB face landmark model** to intelligently rotate photos upright if faces are detected sideways or upside down.
- 🕒 **Custom Timestamp Editing**: Manually set or adjust EXIF date metadata for each detected photo.
- 📦 **Clean Final Output**: Download enhanced, high-quality images with updated metadata, ready to add in local or cloud libraries like iCloud Photos, Google Photos, etc.

---

## 🧱 Tech Stack

### 🎨 Frontend
- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS + ShadCN UI**
- **Konva.js**

### 🔧 Backend
- **Python (FastAPI)** – Handles:
  - OpenCV image processing
  - Perspective warping
  - **FSRCNN image upscaling**
  - **DLIB-based face landmark detection** for auto-rotation
  - Smart enhancement
- **Python (Standalone _websockets_ Server)** – Handles:
  - Real-time image previews during frame adjustments
 


### 🚀 Deployment
- **Frontend**: Vercel  
- **Backend**: DigitalOcean (Dockerized)

---

## 🖼 How It Works

1. **Upload** a batch image with multiple printed photographs.
2. **Automatic Detection**: Individual photo boundaries are detected.
3. **Manual Adjustment**: Refine corners and adjust frames as needed.
4. **Processing**:
   - Crops and warps each selection
   - Applies auto-rotation using face orientation
   - Upscales with FSRCNN
   - Auto enhances brightness/contrast/sharpness
   - Allows manual timestamp editing
5. **Download** your digitized, enhanced images.

---

## 🛣 Future Plans

- 🔍 Timestamp detection via OCR
- ☁️ Optional cloud backup & photo library organization
- 🤖 AI-based clustering by event, face, or theme
