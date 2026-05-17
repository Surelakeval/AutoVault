# 🚀 AutoVault Production Deployment Guide

This guide details the step-by-step process of deploying the **AutoVault** full-stack application to production. Since the project uses a decoupled MERN stack architecture (Next.js Frontend + Express Backend), we will host the Frontend on **Vercel** and the Backend on **Render**.

---

## 📋 1. Prerequisites Checklist

Before starting, make sure you have created free accounts on the following platforms and gathered all necessary credentials:

| Platform | Purpose | Required Actions |
| :--- | :--- | :--- |
| **GitHub** | Code Repository | Host your project code in a repository (e.g., `Surelakeval/AutoVault`) |
| **Render** | Backend hosting (Node.js/Express) | Link your GitHub account |
| **Vercel** | Frontend hosting (Next.js) | Link your GitHub account |
| **MongoDB Atlas** | Production Database | Create a cluster and set Network Access to `0.0.0.0/0` (Allow Anywhere) |

---

## 🔐 2. Required Environment Variables

You will need to enter these variables in the respective platforms during deployment. **Do not upload your local `.env` files to GitHub.**

### A. Backend Variables (to configure on Render)
These variables tell the Node/Express server how to connect to your cloud database, generate secure JWTs, and handle images.

| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations. |
| `PORT` | `5000` | Render will assign this automatically, but set `5000` as default. |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster...` | Your MongoDB Atlas connection string. |
| `JWT_SECRET` | `your_long_random_secure_secret_key` | Secret key used to encrypt user sessions. |
| `JWT_EXPIRE` | `30d` | Duration for which a user session remains active. |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | (Optional) Cloudinary account identifier for user uploads. |
| `CLOUDINARY_API_KEY` | `your_api_key` | (Optional) Cloudinary authentication key. |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | (Optional) Cloudinary secure password. |

### B. Frontend Variables (to configure on Vercel)
This variable links your Next.js user interface to your live cloud API.

| Variable Name | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The **live URL** of your deployed Render backend (e.g., `https://autovault-api.onrender.com/api`). |

---

## 💾 3. Step 1: Configure MongoDB Atlas (Database)

Because your database is in the cloud, it must allow connections from your deployed Render server.

1.  Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  In the left sidebar, click **Network Access**.
3.  Click **Add IP Address**.
4.  Select **Allow Access from Anywhere** (adds `0.0.0.0/0`).
    > [!IMPORTANT]
    > Render server IPs are dynamic and change constantly. You **must** use `0.0.0.0/0` so your server can always connect.
5.  Click **Confirm** and wait 1 minute for it to say **Active**.
6.  Go to **Database** → click **Connect** on your Cluster → select **Drivers** → **Copy the connection string**.
    *   *Replace `<password>` with your database user password.*
    *   *Replace `test` with `autovault` (or your preferred database name) before the `?retryWrites` part.*

---

## 🧠 4. Step 2: Deploy the Backend on Render

Render is the perfect free solution for hosting Express APIs.

1.  Log in to [Render.com](https://render.com) using your GitHub account.
2.  On the Dashboard, click **New +** → **Web Service**.
3.  Choose **Connect a repository** and select your `AutoVault` repository.
4.  Configure the following settings:
    *   **Name**: `autovault-api`
    *   **Region**: Select the closest region to your users (e.g., `Singapore` or `Frankfurt`).
    *   **Branch**: `main`
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
    *   **Instance Type**: `Free`
5.  Click **Advanced** → click **Add Environment Variable** and enter all the variables from the **Backend Variables** list in Section 2.
6.  Click **Create Web Service**.
    *   *Render will build your TypeScript code and launch the server.*
    *   *Once successful, copy the **Live URL** at the top left of the page (e.g., `https://autovault-api.onrender.com`).*

---

## 🎨 5. Step 3: Deploy the Frontend on Vercel

Vercel is the creator of Next.js and provides the absolute fastest hosting for the user interface.

1.  Log in to [Vercel.com](https://vercel.com) using your GitHub account.
2.  Click **Add New** → **Project**.
3.  Select your `AutoVault` repository from the list.
4.  Configure the following settings:
    *   **Framework Preset**: `Next.js`
    *   **Root Directory**: Click *Edit* and select **`frontend`**.
    *   **Build & Development Settings**: Keep defaults.
5.  Expand the **Environment Variables** section:
    *   **Key**: `NEXT_PUBLIC_API_URL`
    *   **Value**: Paste your Render URL **plus `/api`** (e.g., `https://autovault-api.onrender.com/api`).
    *   > [!WARNING]
        > Ensure there is no trailing slash `/` at the end of the URL. It must end exactly with `/api`.
6.  Click **Deploy**.
    *   *Vercel will compile your Next.js application, optimize the images, and deploy it to a high-speed global CDN.*
    *   *Once completed, click the preview window to open your live production website!*

---

## 🧪 6. Step 4: Verification and Data Seeding

Once both services are successfully deployed, you can verify everything is working:

1.  **Check Backend API**: Open a browser and visit your Render URL (e.g., `https://autovault-api.onrender.com`). It should display:
    `AutoVault API is running...`
2.  **Seeding Cloud Database**: Since you are connected to a fresh cloud MongoDB database, you can seed your Atlas collection by running the seed command locally on your computer.
    *   Make sure your local `backend/.env` is set to your **Atlas MONGO_URI**.
    *   In your local terminal, navigate to the `backend` folder and run:
        ```bash
        npm run seed
        ```
    *   *This will securely populate your remote MongoDB Atlas cluster with the 16 cars and 3 test accounts instantly!*
3.  **Perform End-to-End Test**:
    *   Go to your live Vercel URL.
    *   Log in using `ramesh@gmail.com` / `sellerpassword123`.
    *   Verify you can view cars, reserve a car, and update profile fields!
