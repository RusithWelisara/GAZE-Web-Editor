
---

# 🔥 MASTER PROMPT — GAZE Web-Based Godot Control Plane (MVP)

---

## ROLE & GOAL

You are a **senior full-stack engineer** building a **production-ready MVP** for a web-based platform called **GAZE**.

GAZE is **NOT** a full Godot editor in the browser.

GAZE is a **web control plane around Godot projects** that allows users to:

* Import a Godot project from GitHub
* Explore and edit core project files in the browser
* Inspect and modify Godot scenes at a logical (tree/property) level
* Edit GDScript with proper tooling
* Run a playable preview via cloud builds

The MVP must be **bugless, runnable locally via Docker, and architecturally clean**.

---

## STRICT NON-GOALS (DO NOT IMPLEMENT)

Under no circumstances should you attempt to:

* Rebuild the Godot visual editor
* Implement 3D viewport editing
* Implement gizmos, physics previews, or animation editors
* Implement shader editors
* Implement real-time multiplayer editing (no CRDT)
* Implement advanced LSP or full Godot tooling

If something is not explicitly listed as a requirement, **do not build it**.

---

## CORE MVP FEATURES (REQUIRED)

### 1️⃣ Authentication & GitHub Import

* GitHub OAuth login
* Import a public GitHub repository containing a Godot project
* Clone the repository server-side
* Allow branch selection
* Store projects in isolated workspaces

---

### 2️⃣ Godot-Aware File Explorer (Web)

* Display project file tree
* Recognize Godot-specific files:

  * `.tscn`, `.gd`, `.tres`, `.cfg`
* Provide file icons based on type
* Allow file open, edit, save
* No binary editing (assets are preview-only)

---

### 3️⃣ Scene Tree Viewer (CRITICAL FEATURE)

Implement a **custom scene editor** that works as follows:

* Parse `.tscn` files (text format)
* Display:

  * Node hierarchy (tree view)
  * Node type
  * Node name
* Allow editing of:

  * Node names
  * Text-based properties
  * Enum-based properties
* Read & display:

  * Signals
  * Script attachments
* Save edits back to valid `.tscn` format

⚠️ No visual positioning, no transforms UI, no drag-drop in viewport.

---

### 4️⃣ Script Editor (GDScript)

* Monaco editor in browser
* Syntax highlighting for GDScript
* Basic autocomplete (keywords, built-ins)
* Inline error display (best-effort)
* File save writes directly to repo workspace

---

### 5️⃣ AI Assistant Panel (GAZE Core) (*DO NOT do this at MVP.*)

Implement an AI panel that has **context awareness** of:

* Current file
* Current scene
* Selected node

The AI must support:

* “Explain this scene”
* “Explain this script”
* “Refactor this code”
* “Detect bad Godot patterns”

AI calls should be modular and isolated.

*This is phase 2. DO NOT implement this at MVP.*

---

### 6️⃣ Cloud Preview Runner

* Use **headless Godot** in Docker
* Export project to **HTML5**
* Serve build output
* Display preview in iframe
* Stream logs (stdout/stderr) to UI

Each run should be:

* Isolated
* Disposable
* Stateless after completion

---

## SYSTEM ARCHITECTURE (MANDATORY)

### Backend

* Node.js or Go (choose one, justify internally)
* Docker-based services
* Services:

  1. Auth Service
  2. Project Service (Git + FS)
  3. Scene Parser Service
  4. Runner Service (Godot headless)

### Frontend

* React (or equivalent modern framework)
* Monaco editor
* Tree-based UI for scenes
* Clean, minimal UI (developer-first)

---

## FILE & REPO STRUCTURE (REQUIRED)

Provide:

* Root `docker-compose.yml`
* Separate frontend and backend folders
* Clear README with:

  * Setup instructions
  * Environment variables
  * How to run locally
* Sensible defaults so project runs with minimal config

---

## QUALITY BAR (VERY IMPORTANT)

* Code must be readable and modular
* No hardcoded secrets
* Graceful error handling
* No TODOs left in core flows
* All core flows must be demonstrable:

  * Import repo
  * Open scene
  * Edit node
  * Edit script
  * Run preview

If a feature cannot be implemented cleanly, **scale it down**, do not hack it.

---

## DELIVERY EXPECTATION

Deliver:

* A working MVP
* Ready-to-run locally
* Clear documentation
* No mock-only features pretending to work

This is a **real product foundation**, not a prototype.

---

## FINAL REMINDER

You are not building “Godot in the browser”.

You are building:

> **The web brain around Godot projects.**

Focus on leverage, not completeness.

---
