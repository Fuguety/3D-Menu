
# 3D Menu (A-Frame + Vite) + Gemini Chat API

An interactive 3D/VR menu built with **A-Frame** and **Vite**, with an **Express** backend that securely proxies requests to the **Google Gemini API**.

---

## Tech Stack

- Frontend: Vite + TypeScript + A-Frame
- Backend: Node.js + Express + Axios
- AI: Google Gemini API

---

## Prerequisites

- Node.js 18+
- npm

---

## Clone the Repository
```
git clone https://github.com/Fuguety/3D-Menu.git
```
```
cd 3D-Menu
```

---

## Install Dependencies
```
npm install
```

---

## Environment Variables (Gemini API Key)

Create a .env file in the project root:

GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE

Do NOT commit this file. Rotate the key if it was ever exposed.

---

## Run the Project (Development)

### Terminal 1 — Start Backend (Express)
```
npm run server
```
Backend runs on:
http://localhost:3000

---

### Terminal 2 — Start Frontend (Vite)

```
npm run dev
```

Frontend runs on:
http://localhost:5173

Open the Vite URL in your browser.

---

## AI API Flow

- Frontend sends POST requests to:
  http://localhost:3000/api/gemini
- Backend reads GEMINI_API_KEY from .env
- Backend forwards the request to Google Gemini
- API key never reaches the frontend

---

## Available npm Scripts

```
npm run dev       # start frontend (Vite)
```
```
npm run server    # start backend (Express)
```
```
npm run build     # production build
```
```
npm run preview   # preview production build
```

## Troubleshooting

- Missing API key:
  - Ensure .env exists
  - Restart npm run server

- Backend not reachable:
  - Confirm port 3000 is running
  - Check network/CORS errors

- Port already in use:
  - Stop the conflicting process
  - Or change the port in server config

---

## License

See LICENSE file.
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

