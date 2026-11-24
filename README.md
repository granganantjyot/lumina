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

## Run locally

You’ll need Git, Node.js 22 or newer with npm, and Python 3.13. On Windows, run these commands in WSL2 with Ubuntu. The image-processing models are included in the repository.

### Install system dependencies

`dlib` needs a C++ compiler and CMake. The frontend’s `canvas` package also needs native libraries when a prebuilt binary is unavailable.

On macOS, install the Xcode Command Line Tools with `xcode-select --install` if needed. Then install the system libraries with Homebrew.

```bash
brew install cmake pkgconf cairo pango libpng jpeg-turbo giflib librsvg pixman
```

On Debian or Ubuntu, install the system libraries with `apt`.

```bash
sudo apt-get update
sudo apt-get install build-essential cmake pkg-config libgl1 libcairo2-dev \
  libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### Clone and configure

```bash
git clone https://github.com/granganantjyot/lumina.git
cd lumina
```

Create `backend/.env` with these values.

```dotenv
API_PORT=8000
WS_PORT=8765
ALLOWED_API_ORIGINS=http://127.0.0.1:3000
```

Create `frontend/lumina/.env.local` with these values.

```dotenv
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8765
```

### Start the backend and frontend

Run each block in a separate terminal, starting from the repository root. Keep all three running.

**Terminal 1 · FastAPI**

```bash
cd backend
python3.13 -m venv venv
./venv/bin/python -m pip install -r app/requirements.txt
cd app
../venv/bin/python main.py
```

**Terminal 2 · WebSocket previews**

Wait for the backend dependency install in Terminal 1 to finish before starting the preview server. The first install can take several minutes if `dlib` builds from source.

```bash
cd backend/app
../venv/bin/python websocket.py
```

**Terminal 3 · Next.js**

For local development, add `reactStrictMode: false,` to the `nextConfig` object in `frontend/lumina/next.config.ts`. Strict Mode repeats the demo’s requests in development and can produce an invalid ZIP.

```bash
cd frontend/lumina
npm ci --legacy-peer-deps
npm run dev -- --hostname 127.0.0.1
```

The date picker’s peer dependency range stops at React 18, so use `--legacy-peer-deps` to install the locked dependencies with React 19. Next.js also fetches the Geist fonts on first compile.

### Check your setup

Once all three services are ready, open [Lumina at 127.0.0.1:3000](http://127.0.0.1:3000) and select **Try Demo**. Drag a crop corner to check the live preview, then select **Looks Good** on the crop and review screens to download the ZIP.

The [FastAPI docs](http://127.0.0.1:8000/docs) provide a quick check that the API is running. If a port is already in use, change `API_PORT` or `WS_PORT` in `backend/.env` and the matching URL in `frontend/lumina/.env.local`. To change the frontend port, pass `--port` to `next dev` and update `ALLOWED_API_ORIGINS` in `backend/.env`. Restart the affected servers after editing their settings.

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
- Auto glare removal
