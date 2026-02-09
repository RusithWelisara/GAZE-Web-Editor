# GAZE - Web-Based Godot Control Plane (MVP)

Connect your Godot 4 projects to a web-based control plane.

## Features
- **Project Import**: Clone public GitHub repositories directly.
- **File Explorer**: Browse your project structure.
- **Code Editor**: Edit GDScript files with syntax highlighting.
- **Scene Viewer**: Inspect node hierarchies and properties in `.tscn` files.
- **Preview Runner**: (Stub) Cloud-based preview runner.

## Quick Start (Docker)

To run the entire stack locally using Docker Compose:

1. Ensure you have Docker and Docker Compose installed.
2. Run the following command in this directory:

   ```bash
   docker compose up --build
   ```

3. Open your browser to `http://localhost:5173`.

## Quick Start (Manual / No Docker)

If you cannot use Docker, you can run the services locally using Node.js.

1.  Ensure **Node.js** (v18+) and **Git** are installed.
2.  Double-click `start_dev.bat` in the root directory.
    - This will install dependencies and start both the Backend and Frontend servers in separate windows.
3.  Open your browser to `http://localhost:5173`.


## Architecture

- **Backend** (`/backend`): Node.js + Express. Handles Git operations, file system access, and scene parsing.
- **Frontend** (`/frontend`): React + Vite. Provides the IDE logic with Monaco Editor and custom Scene Tree.

## Development

### Backend
Directory: `/backend`
- `npm install`
- `npm run dev` (Runs on port 3000)

### Frontend
Directory: `/frontend`
- `npm install`
- `npm run dev` (Runs on port 5173)

**Note:** Ensure the backend is running for file operations to work.
# GAZE-Web-Editor
