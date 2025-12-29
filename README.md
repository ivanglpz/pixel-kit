# PixelKit Design Editor

## Overview
PixelKit is a Figma-inspired, web-based design editor built with **Next.js**, **React**, **TypeScript**, and **Konva**.  
The project demonstrates advanced frontend architecture, complex state management, undo/redo systems, and a production-ready backend using Next.js API routes.

The goal of the project is **technical demonstration**: showing the ability to design and ship complex interactive systems, not to solve a specific end-user business problem.

---

## High-Level Architecture

This project follows a **modular, layered architecture**:

```
src/
 ├─ editor/          # Core editor runtime (canvas, shapes, tools, state)
 ├─ components/      # Shared UI components
 ├─ pages/
 │   ├─ index.tsx
 │   ├─ api/         # Backend API routes
 ├─ db/              # Database schemas and middleware
 ├─ services/        # API/domain service layer
 ├─ utils/           # Pure utility functions
 └─ styles/          # Styling system
```

### Architectural Style
- **Unidirectional data flow**
- **Functional state modeling**
- **Event-driven editor actions**
- **Separation of concerns**
- **Domain-oriented folders**

---

## Design Patterns Used

### 1. Atom-Based State Model (Jotai)
- Each domain (canvas, shapes, selection, pages, undo/redo) is represented as a set of atoms.
- Derived atoms compute state instead of mutating it.
- Side effects are isolated in write-only atoms.

### 2. Command Pattern (Undo / Redo)
- Each editor action produces a reversible command.
- Commands are stored as immutable snapshots.
- Undo/redo replays state transitions rather than mutating state directly.

### 3. Composite Pattern (Shapes Tree)
- Shapes are hierarchical (parent → children).
- Recursive traversal is used for transforms, deletion, export, and cloning.

### 4. Service Layer Pattern
- Backend logic is abstracted into services (`services/projects`, `services/organizations`, etc.).
- API routes act as thin controllers.

---

## Core Editor Concepts

### Canvas
- Implemented using **Konva**
- Supports zoom, pan, selection, multi-select, and export
- Pages contain shape trees instead of flat lists

### Shapes
- Shapes are immutable domain objects
- Each shape owns its own atom-based state
- Shape types include:
  - Frames
  - Rectangles
  - Text
  - Images
  - SVG paths

### Selection
- Selection is ID-based, not reference-based
- Multi-selection uses Sets for O(1) lookup
- Dragging and transformations are applied declaratively

### Undo / Redo
- Stores snapshots of affected atoms
- No global state mutation
- Deterministic replay

---

## Backend Architecture

### API Routes
Located in `src/pages/api/*`

Examples:
- `/api/projects`
- `/api/projects/[id]`
- `/api/uploads`
- `/api/auth/*`

### Database
- **MongoDB** via **Mongoose**
- Schemas:
  - User
  - Organization
  - Project
  - Photo

### Authentication
- JWT-based session cookies
- Middleware validates session token
- API routes enforce authorization

---

## External Services

### Cloudinary
Used for:
- Image uploads
- Project previews
- Asset hosting

### OpenAI
Used for:
- AI-assisted features (prompt-based generation / analysis)

---

## Environment Variables

Create a `.env.local` file:

```env
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://...

# Auth
AUTH_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# OpenAI
OPENAI_API_KEY=xxx
```

---

## Running the Project

### Requirements
- Node.js >= 18
- npm or pnpm
- MongoDB instance

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## Coding Principles

- Functional programming preference
- No shared mutable state
- Explicit domain boundaries
- Strong typing with TypeScript
- No implicit side effects
- Declarative UI and editor logic

---

## What This Project Demonstrates

- Advanced frontend architecture
- Real-world editor complexity (similar to Figma)
- Scalable state modeling
- Undo/redo correctness
- Production-ready backend integration
- Ability to take an idea to a full working system

---

## License

This project is intended as a **portfolio and technical showcase**.
