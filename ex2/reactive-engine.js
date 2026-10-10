const stateStore = [];
let stateCursor = 0;
let currentApp = null;
let currentRoot = null;

export function resetCursor() {
  stateCursor = 0;
}