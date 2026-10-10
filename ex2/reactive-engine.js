const stateStore = [];
let stateCursor = 0;
let currentApp = null;
let currentRoot = null;

export function resetCursor() {
  stateCursor = 0;
}
const stateStore = [];
let stateCursor = 0;
let currentApp = null;
let currentRoot = null;

export function resetCursor() {
  stateCursor = 0;
}

// Custom useState using closure
export function useState(initialValue) {
  const index = stateCursor;

  if (!(index in stateStore)) {
    stateStore[index] = initialValue;
  }

  function setState(nextValue) {
    const previousValue = stateStore[index];

    stateStore[index] =
      typeof nextValue === "function"
        ? nextValue(previousValue)
        : nextValue;

    render();
  }

  stateCursor++;

  return [stateStore[index], setState];
}

// Create a virtual element
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...(props || {}),
      children: children.flat(Infinity).filter(
        (child) => child !== null && child !== undefined &&
          child !== false && child !== true
      )
    }
  };
}

function render() {
  if (!currentApp || !currentRoot) return;
  resetCursor();
}