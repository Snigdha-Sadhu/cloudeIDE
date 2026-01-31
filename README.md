# CodeSpace

A browser-based coding workspace for writing, executing, and managing code with persistent files and snapshots.
---

## Features

***Workspace & Project Management System***:
- Designed and implemented multi-workspace and project management with isolated, persistent file-folder hierarchies
- Enabled creating, renaming, moving, and deleting files and folders, supporting nested folder structures
- Developed project-level isolation ensuring no cross-project file access for data security

***File & Folder System***
- Created VS Code-like file tree with active file tracking and nested folder support
- Implemented drag-and-drop folder move with recursive child file handling

***Persistence & Auto-Save***
- Built real-time auto-save on file changes with persistent storage in the database
- Ensured restoration of last active file and state retention across page refreshes

***Code Execution Integration (Piston API)***
- Integrated multi-language code execution with manual run design
- Manual execution with real-time stdout and stderr output
- Input is written directly inside the code, similar to a local IDE

***Snapshots & Restore***
- Developed manual snapshot creation and snapshot-based rollback features
- Enabled safe code restoration without overwriting unrelated files, with snapshots stored persistently

***Export / Import Functionality***
- Enabled file-level import/export and full project ZIP export without corrupting folder structure
- Ensured environment artifacts are excluded during exports

***Authentication & Session Management***
- Secure JWT-based authentication
- Protected routes and session persistence
---

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT  
- **Frontend:** React.js, React Router, Axios, Tailwind CSS  
- **Environment variables management:** dotenv  
- **Code Execution** Piston API

---

## Installation

### Clone the repository

```bash

git clone https://github.com/Snigdha-Sadhu/cloudeIDE.git
cd cloud-IDE

```
### Backend setup

```bash
cd server
npm install

```

### Create a .env file in the server folder and add your environment variables
```env
PORT=7000
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLIENT_URL=http://localhost:5173

```

### Start the backend server:
```bash
npm run dev
```
### Frontend setup
```bash
cd client
npm install
npm run dev

```

Open your browser and go to http://localhost:5173
to use the app.

---

## Usage

1. Create a workspace from the dashboard.
2. Add or import files into the workspace.
3. Select a runtime and run the code.
4. nput directly inside the code
5. Download the entire workspace as a ZIP archive.


----

## Folder Structure

/server - Backend Express API and Socket.IO server
/client - React frontend application

---


## API Endpoints

### Auth & Profile

| **Method** |  **Endpoint**         |  **Description**                                      |
| ---------- | -------------------   | ------------------------------------------------------|
|   POST     |   `/api/auth/signup`  |    Register a new user                                |
|   POST     |   `/api/auth/login`   |    Login and receive JWT token                        |
|   GET      |   `/api/auth/me`      |    Get current authenticated user profile (protected) |

---

### Workspace

| **Method** | **Endpoint**                       | **Description**                          |
| ---------- | -------------------------------    |---------------------------------------   |
|   POST     |   `/api/project/create `           |   Create Workspace                       | 
|   PATCH    |`/api/project/rename/projectId`     |   rename the workspace (protected)       |
|   GET      |   `/api/project/:id`               |   Get workspacebyID (protected)          |
|   GET      |`/api/project/:projectId/download`  |   download workspace (protected)         |
|   DELETE   |   `/api/project/:id`               |   delete workspace (protected)           |
|   PATCH    |`/api/project/:projectId/movefolder`|   move folders  (protected)              |
|   GET      |  `/api/project/`                   |   get all workspaces                     |                 ---

### File 

| **Method** | **Endpoint**                       | **Description**                          |
| ---------- | -------------------------------    |---------------------------------------   |
|   POST     |   `/api/file/create `              |   Create file                            | 
|   PATCH    |`/api/file/rename`                  |   rename the file and folder (protected) |
|   GET      |   `/api/file/:id`                  |   Get filebyID (protected)               |
|   POST     |`/api/file/snapshot/:fileId/`       |   download workspace (protected)         |
|   DELETE   |   `/api/file/delete`               |   delete file and folder (protected)     |
|   PATCH    |`/api/file/:fileId`                 |   update code of a file  (protected)     |
|   PATCH    |  `/api/file/move`                  |   move file                              |
|   GET      | `api/file/`                        |   get all files                          |
---

### Execution


| **Method** | **Endpoint**            | **Description**                              |
| ---------- | ----------------------  | -------------------------------------------- |
|   POST     |   `/api/execute/run`   |   Execute code                                |


## Notes

- Authentication uses JWT stored in local storage and sent in Authorization headers
- Keep your JWT secret safe
- Update .env file with your own MongoDB connection and secrets
- Tailwind CSS is used for styling frontend components

   ---

  