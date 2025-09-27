Here’s a complete **README.md** you can paste into your repo (`URL_shortener`). It includes clear setup steps for Windows/macOS/Linux, **MongoDB Atlas** connection (getting the connection string), and **MongoDB Compass** usage.

---

# MERN URL Shortener

A minimal URL shortener built with the **MERN** stack. Create short links, list them, track click counts, and redirect via `/r/:slug`.

* **Client:** React (Vite)
* **Server:** Node.js + Express + Mongoose
* **DB:** MongoDB (Atlas or local)
* **Status:** Local development ready

---

## Features

* Generate short URLs (e.g., `http://localhost:4000/r/abc123`)
* List links with target URL and click count
* Delete links
* Simple UI you can extend (Tailwind/MUI optional)

---

## Tech Stack

* React 18, Vite 5
* Node.js 18+ (works great with Node 20/22)
* Express 4
* Mongoose 8
* nanoid for slugs

---

## Prerequisites

* **Node.js** (≥ 18). Check with:

  ```bash
  node -v
  npm -v
  ```
* **Git**
* **MongoDB**: either

  * **MongoDB Atlas** (recommended for beginners), or
  * **MongoDB Community Server** locally (optional)

---

## Project Structure

```
URL_shortener/
  client/
    src/
      App.jsx
      main.jsx
      components/
        LinkList.jsx
    index.html
    package.json
    vite.config.js
  server/
    src/
      index.js
      models/
        Link.js
      routes/
        links.js
    package.json
    .env              # you create this (NEVER commit to Git)
  README.md
```

---

## Environment Variables (server/.env)

Create a file at **`server/.env`** (no quotes, one variable per line):

```
PORT=4000
MONGO_URL=replace_this_with_your_connection_string
CLIENT_ORIGIN=http://localhost:5173
BASE_URL=http://localhost:4000
```

> **Important:** Do **not** wrap values in quotes and do **not** end lines with semicolons.

---

## Getting a MongoDB Atlas Connection String (recommended)

1. Sign in to **MongoDB Atlas** → **Build a Database** → Free tier is fine.
2. Create a **Database User** (username + password). Keep them handy.
3. **Network Access** → Allow your IP (or `0.0.0.0/0` for quick testing).
4. **Connect** → choose **Drivers** and copy the SRV URI. It looks like:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Add a database name after `.net/`, e.g. `urlshort`:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/urlshort?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Paste that into `server/.env` as `MONGO_URL=...`.

> If you get **“Invalid scheme”** errors, it usually means the `.env` value has quotes, extra spaces, or isn’t being loaded. Ensure `import "dotenv/config";` is the **first** line in `server/src/index.js` and your file is named exactly `.env`.

---

## Using MongoDB Compass (optional, GUI for your DB)

* Install **MongoDB Compass**.
* Open Compass → **New Connection** → paste your Atlas SRV string (the same one from `.env`).
* Click **Connect**.
* You’ll see your **`urlshort`** database appear after the app writes data.
* Inside it, you’ll see a `links` collection with documents like:

  ```json
  {
    "_id": "65f...",
    "slug": "abc123",
    "target": "https://example.com/page",
    "clicks": 5,
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

---

## Install & Run (Local Development)

Open **two terminals** (or tabs) from the project root.

### 1) Backend (server)

```bash
cd server
npm install
npm run dev
```

Expected logs:

```
MongoDB connected
Server listening on http://localhost:4000
```

### 2) Frontend (client)

```bash
cd client
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

---

## How to Use

1. Go to `http://localhost:5173`.
2. Paste a full URL like `https://google.com`.
3. Click **Shorten**.
4. Use **Open** to test redirect.
   Redirect route is `http://localhost:4000/r/<slug>`.
5. Clicks counter increments on visits.

---

## API Overview (server)

* `GET /api/health` → `{ ok: true }`
* `POST /api/links` → body `{ "target": "https://..." }`
  Returns the created link document with `slug`.
* `GET /api/links` → returns latest links (max 100)
* `DELETE /api/links/:id` → removes a link by Mongo `_id`
* `GET /r/:slug` → redirects to original URL and increments `clicks`

---

## Common Issues & Fixes

* **Invalid scheme**:
  Your `MONGO_URL` must **start with** `mongodb://` or `mongodb+srv://`, have **no quotes**, and typically include a **DB name** (`/urlshort`) before the query string.
* **`.env` not loading**:
  Ensure `server/.env` exists and `index.js` begins with:

  ```js
  import "dotenv/config";
  ```

  You can log it:

  ```js
  console.log("MONGO_URL:", process.env.MONGO_URL);
  ```
* **CORS**:
  The Vite dev server proxies `/api` to `http://localhost:4000`. Ensure `CLIENT_ORIGIN=http://localhost:5173` in `.env` and that both servers are running.
* **Atlas “bad auth”**:
  Double-check your Atlas username/password; re-create the DB user if needed.
* **Atlas IP blocked**:
  Add your current IP in **Network Access** or use `0.0.0.0/0` during development (remember to restrict later).

---

## Scripts

**Server**

```bash
npm run dev   # dev mode (node --watch)
npm start     # production start (ensure env set)
```

**Client**

```bash
npm run dev      # start Vite dev server
npm run build    # build production assets
npm run preview  # preview built app
```

---

## Security

* Never commit `.env` or secrets (add `.env` to `.gitignore`).
* If you accidentally pushed `.env`, rotate your Atlas user password and purge it from Git history.

---

## Extend This App

* Custom slugs (user input + uniqueness check)
* Authentication (own your links)
* Pagination and search
* File-based QR codes for short links
* Admin stats dashboard

---

## License

MIT (or your choice)

---

### Quick Windows PowerShell Cheats

* Remove `node_modules` in PowerShell:

  ```powershell
  Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
  Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
  npm cache clean --force
  ```

* Move project out of OneDrive if file-lock issues occur:

  ```powershell
  mkdir C:\Projects
  # Move the whole repo to C:\Projects\URL_shortener
  ```

---

If you want, I can open a PR to your repo with this README and a ready-to-use `.gitignore`.
