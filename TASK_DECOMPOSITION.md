# Task Decomposition & Architectural Breakdown

This document provides a systematic decomposition of the milestones, core engineering deliverables, and verification constraints across all sprints in the **Mini React Engine** project.

---

## 1. Exercise 1: Mini-React VNode & Mounting Engine

### 1.1 Scope & Engineering Objectives
- Construct an in-memory Virtual Node representation (`createElement`, `createTextElement`).
- Develop a recursive DOM reconciliation mounting function (`renderToDOM`).
- Guarantee cross-site scripting (XSS) resilience against malicious child injections.
- Strictly enforce semantic HTML structures and eliminate `<div>` soup.

### 1.2 Subtasks & Component Hierarchy
- **[E1-T1] VNode Factory & Normalization**:
  - Accept `(type, props, ...children)` and normalize primitive children (strings, numbers) into `TEXT_ELEMENT` nodes.
  - Recursively flatten multi-dimensional child arrays and discard nullish/boolean values.
- **[E1-T2] Property & Attribute Engine**:
  - Support event binding (`onClick` mapped to DOM event listeners).
  - Map `className` to HTML `class`.
  - Handle boolean attributes (`disabled`, `checked`, `selected`, `required`, etc.).
- **[E1-T3] Recursive Mounting Engine**:
  - Convert `TEXT_ELEMENT` to native `document.createTextNode` (preventing raw string HTML evaluation).
  - Recursively instantiate DOM elements and append children.
- **[E1-T4] Test Harness Verification**:
  - Execute automated assertion tests for node generation, XSS mitigation, and semantic tree validity.

### 1.3 Acceptance Criteria & Constraints
- Output tree must utilize semantic root containers (`<main>`, `<section>`, `<button>`).
- String literals such as `<img onerror=alert(1)>` must be rendered safely as inert text nodes.
- Inspecting DevTools Elements panel confirms zero orphan detached nodes.

---

## 2. Exercise 2: Reactive State Machine & Delegation Hub

### 2.1 Scope & Engineering Objectives
- Implement an index-based cursor closure engine (`useState`) to mimic React-like unidirectional data flow.
- Construct a root event delegation architecture to eliminate per-node event listeners and prevent memory leaks.
- Build a real-time reactive Task Manager with dynamic task filtering and UI re-renders.

### 2.2 Subtasks & Component Hierarchy
- **[E2-T1] State Store & Cursor Management**:
  - Establish sequential state storage array (`stateStore`) and a cursor reset function (`resetCursor`).
  - Provide a reactive dispatcher `useState` supporting both raw values and updater callback signatures `(prev => next)`.
- **[E2-T2] Event Delegation Hub**:
  - Implement a centralized `eventRegistry` (Map) generating unique `data-event-id` attributes on interactive elements.
  - Attach a single delegated listener at the root mounting container (`#app`) to bubble and dispatch events.
- **[E2-T3] Reactive Task Application**:
  - Assemble stateful `TaskApp` supporting Task creation, completion toggles, and deletion.
  - Implement dynamic visibility filters (`ALL`, `ACTIVE`, `COMPLETED`).

### 2.3 Acceptance Criteria & Constraints
- Triggering state mutations dispatches synchronized DOM replacements (`replaceChildren`).
- DevTools Audit verifies **zero event listeners attached directly to button child elements**.

---

## 3. Exercise 3: Resilient State Machine & Skeleton Loader

### 3.1 Scope & Engineering Objectives
- Design a strict 4-state Finite State Machine (FSM): `IDLE` -> `LOADING` -> `SUCCESS` / `ERROR`.
- Eliminate asynchronous race conditions and stale network responses.
- Implement an accessible Skeleton screen with shimmer placeholder animations during network latency.
- Provide a resilient Error Boundary with connection retry capability.

### 3.2 Subtasks & Component Hierarchy
- **[E3-T1] FSM Definitions & Async Data Layer**:
  - Define immutable `STATUS` enumeration (`IDLE`, `LOADING`, `SUCCESS`, `ERROR`).
  - Implement asynchronous fetch pipeline with response schema validation.
- **[E3-T2] Concurrency & Race Condition Guard**:
  - Introduce an incrementing `requestId` sequence guard to ignore outdated asynchronous responses.
- **[E3-T3] Skeleton UI & Shimmer Animation**:
  - Build layout-preserving animated placeholder skeleton elements (`aria-busy="true"`).
  - Configure CSS keyframes shimmer with `@media (prefers-reduced-motion: reduce)` accessibility fallback.
- **[E3-T4] Error Boundary & Recovery**:
  - Handle offline/HTTP failure states gracefully with sanitized error messaging and a `Retry Connection` action.

### 3.3 Acceptance Criteria & Constraints
- UI transitions strictly through valid lifecycle states without UI flashing or intermediate state glitches.
- Network disconnection displays descriptive feedback with immediate recovery upon reconnection.