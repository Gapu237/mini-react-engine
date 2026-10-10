# Project Rules & Development Guidelines

This document governs the engineering standards, architecture rules, version control workflows, and security guardrails for the **Mini React Engine** repository.

---

## 1. Architectural & Code Principles

1. **Zero Div-Soup (Strict Semantic Markup)**:
   - Avoid generic `<div>` wrappers unless strictly required for styling container boundaries.
   - All components must render semantic HTML elements (`<main>`, `<header>`, `<section>`, `<article>`, `<button>`, `<ul>`, `<li>`).
2. **Pure Unidirectional Data Flow**:
   - State mutations must strictly pass through the reactive dispatcher (`setState`).
   - Direct manual manipulation of DOM text or attributes outside the rendering lifecycle is forbidden.
3. **Cursor-Based Hook Integrity**:
   - `useState` calls rely on call-order indexing. Hooks must never be placed inside conditionals, loops, or nested functions.
   - State cursor must reset to `0` prior to every re-render execution.
4. **Root Event Delegation**:
   - Child interactive elements (e.g., `<button>`, `<input>`) must not have individual `addEventListener` bindings attached directly.
   - All events must route through the root delegation listener via `data-event-id` or centralized event registry maps.

---

## 2. Security & Accessibility (a11y) Standards

1. **XSS Prevention**:
   - Never insert untrusted strings using `innerHTML` without explicit HTML sanitization/escaping.
   - Text elements must be instantiated via `document.createTextNode()` or escaped with character entity encoders.
2. **Accessible Loading & Screen Reader Semantics**:
   - Loading states must expose appropriate ARIA markers (e.g., `aria-busy="true"`, `aria-live="polite"`).
   - Filter toggles must reflect their current selection with `aria-pressed="true|false"`.
   - Motion accessibility: CSS shimmer animations must provide `@media (prefers-reduced-motion: reduce)` overrides.

---

## 3. Git Version Control & Commit Protocol

1. **Atomic Commits**:
   - Commits must represent single, logical, and reversible units of work.
   - Do not combine engine infrastructure modifications with application UI styling in a single commit.
2. **Conventional Commits Standard**:
   All commit messages must follow the standard convention: `<type>(<scope>): <subject>`
   - `feat(core)`: Core virtual node factory and rendering mechanics.
   - `feat(state)`: State store, cursor tracking, and hook dispatchers.
   - `feat(events)`: Event delegation hub and listener attachments.
   - `feat(ui)`: Application markup, styling, and skeleton components.
   - `refactor`: Structural reorganization without behavioral modification.
   - `test`: Automated test harness suites.

---

## 4. Directory & Module Organization

```text
mini-react-engine/
├── ex1/                     # Exercise 1: VNode & Mounting Engine
│   ├── index.html
│   ├── mini-react.js
│   └── test-runner.js
├── ex2/                     # Exercise 2: Reactive State & Event Delegation
│   ├── index.html
│   ├── reactive-engine.js
│   └── app.js
├── ex3/                     # Exercise 3: State Machine & Skeleton Loader
│   ├── index.html
│   ├── state-machine.js
│   └── app.js
├── TASK_DECOMPOSITION.md     # Engineering breakdown & sprint scope
└── PROJECT_RULES.md         # Architecture standards & commit guidelines