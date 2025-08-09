Deployment Guide

# Deployment Guide

This document explains how to deploy the project in both **local** and **production** environments.

- - -

## 1\. Local Deployment

Local deployment is used for development and testing. It involves starting both the backend and frontend services directly using `npm`.

### Prerequisites

*   **Node.js** (matching the version in `.nvmrc` or `package.json` engines)
*   **npm** (comes with Node.js)
*   Access to the `.env` files (`./backend/.env` for the backend, `.env.local` for the frontend)

### Steps

#### 1\. Start the Backend

*   Navigate to the backend directory:
    
    ```
    cd backend
    ```
    
*   Install dependencies:
    
    ```
    npm install
    ```
    
*   Run the server:
    
    ```
    npm start
    ```
    

This will start the backend API on port 8080. Make sure this port is free.

#### 2\. Start the Frontend

*   Open a new terminal and navigate to the frontend directory:
    
    ```
    cd frontend
    ```
    
*   Install dependencies:
    
    ```
    npm install
    ```
    
*   Run the application in development mode:
    
    ```
    npm run dev
    ```
    

The frontend will be available at `http://localhost:3000`. Ensure that the `NEXT_PUBLIC_API_URL` variable in your `.env.local` file points to the local backend: `NEXT_PUBLIC_API_URL=http://localhost:8080`.

- - -

## 2\. Production Deployment

Production deployment uses a pre-built Docker image for the backend and Vercel for the frontend.

### Backend (Docker Image)

The backend is deployed by running a pre-built Docker image.

#### 1\. Pull the Docker Image

```
docker pull solaris595/socs-app
```

#### 2\. Run the Container

```
docker run -d -p 8080:8080 --env-file ./backend/.env solaris595/socs-app
```

This command runs the backend in a container detached from your terminal (`-d`) and makes it accessible on port `8080` of the host machine.

### Frontend (Vercel)

The frontend is deployed automatically via Vercel’s GitHub Integration.

#### Steps to Deploy

1.  Push changes to the `main` branch. Vercel will detect the changes, build the application, and deploy it.
    
    ```
    git push origin main
    ```
    
2.  **Configure Environment Variables**
    
    In your Vercel project settings, set the `NEXT_PUBLIC_API_URL` environment variable to the URL where your Dockerized backend is hosted. This can be a local URL if you are running Vercel's development environment, or a production URL.
    

- - -

## 3\. Verification

After deployment:

*   **Backend:** Check its health endpoint, for example, `https://your-backend-url/socs/api/v1`.
*   **Frontend:** Visit the production domain on Vercel and confirm that the UI and API connectivity are working correctly.
