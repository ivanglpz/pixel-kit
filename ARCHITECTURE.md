# Architecture Documentation

## Purpose

This document describes the internal architecture of the PixelKit project.  
It is intended for engineers reviewing the system to understand how complexity is managed, how responsibilities are separated, and how editor behavior remains deterministic and scalable.

---

## Architectural Goals

- Support a Figma-like editor with high interaction complexity
- Maintain deterministic behavior (especially undo/redo)
- Avoid global mutable state
- Allow incremental feature growth without architectural rewrites
- Keep frontend and backend loosely coupled

---

## High-Level Architecture

PixelKit follows a **modular layered architecture** with clear domain boundaries.

```
Application
│
├─ UI Layer
│  └─ React components (stateless where possible)
│
├─ Editor Domain Layer
│  ├─ Canvas
│  ├─ Shapes
│  ├─ Pages
│  ├─ Selection
│  ├─ Undo / Redo
│
├─ State Layer
│  └─ Jotai atoms (source of truth)
│
├─ Service Layer
│  └─ Domain services (projects, uploads, organizations)
│
├─ API Layer
│  └─ Next.js API routes
│
└─ Infrastructure Layer
   ├─ MongoDB
   ├─ Cloudinary
   └─ OpenAI
```

---

## State Management Strategy

### Atom-Based State Model

The editor is modeled as a **graph of atoms**, not a single global store.

Characteristics:
- Each domain owns its atoms
- Atoms are immutable snapshots
- Derived atoms compute state instead of mutating it
- Write atoms encapsulate side effects

Benefits:
- Predictable state transitions
- Easy undo/redo
- Clear ownership of state

---

## Editor Domain Design

### Pages
- Each page owns its own shape tree
- Pages isolate undo/redo history
- Switching pages does not leak state

### Shapes
- Shapes form a recursive tree (composite structure)
- Each shape has:
  - Identity
  - Parent reference
  - Atom-backed state
- Operations are applied recursively when required

### Selection
- Selection is ID-based
- Supports multi-select and group transforms
- No direct object mutation

---

## Undo / Redo Architecture

### Pattern Used
Command + Snapshot hybrid

### How It Works
1. An editor action produces a command
2. The command captures affected atom states
3. The snapshot is pushed to history
4. Undo replays the previous snapshot
5. Redo reapplies the next snapshot

### Key Properties
- Deterministic
- No partial rollback
- No mutation during replay

---

## Rendering Architecture

### Canvas
- Built on Konva
- Rendering is derived from atom state
- No imperative canvas mutations

### Export
- Export builds a temporary stage from state
- No reliance on UI state
- Enables deterministic PNG generation

---

## Backend Architecture

### API Design
- Thin controllers
- Logic delegated to services
- Explicit authorization per route

### Database Layer
- Mongoose schemas define persistence contracts
- No business logic in schemas

---

## Error Handling

- Frontend: defensive guards + user alerts
- Backend: structured error responses
- No silent failures

---

## Scalability Considerations

- Editor domains can be extended independently
- New shape types do not affect existing logic
- State graph remains predictable as features grow

---

## Non-Goals

- Real-time collaboration (not implemented)
- CRDT or OT complexity
- Monolithic global state

---

## Summary

PixelKit is architected to handle **editor-level complexity** with:
- Functional principles
- Deterministic state transitions
- Clear separation of concerns

This architecture is intentionally over-engineered for demonstration purposes and reflects production-grade design thinking.
