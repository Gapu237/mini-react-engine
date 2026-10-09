
import {
  createElement,
  createTextElement,
  renderToDOM
} from "./mini-react.js";

function test(name, callback) {
  try {
    callback();
    console.log("PASS:", name);
  } catch (error) {
    console.error("FAIL:", name, error);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test 1: createTextElement
test("createTextElement creates a text VNode", () => {
  const node = createTextElement("Hello");

  assert(node.type === "TEXT_ELEMENT", "Wrong node type");
  assert(node.props.nodeValue === "Hello", "Wrong text");
});

// Test 2: createElement
test("createElement creates a semantic VNode", () => {
  const node = createElement("main", { id: "test" }, "Hello");

  assert(node.type === "main", "Expected main element");
  assert(node.props.id === "test", "Expected id=test");
  assert(node.props.children.length === 1, "Expected one child");
});

// Test 3: renderToDOM
test("renderToDOM creates real DOM elements", () => {
  const node = createElement(
    "main",
    null,
    createElement("section", null, "Hello"),
    createElement("button", null, "Click")
  );

  const dom = renderToDOM(node);

  assert(dom.tagName === "MAIN", "Expected MAIN");
  assert(dom.querySelector("section") !== null, "Missing SECTION");
  assert(dom.querySelector("button") !== null, "Missing BUTTON");
});

// Test 4: semantic HTML without div soup
test("rendered DOM uses semantic elements", () => {
  const node = createElement(
    "main",
    null,
    createElement("section", null, "Content"),
    createElement("button", null, "Click")
  );

  const dom = renderToDOM(node);

  assert(dom.querySelector("section") !== null, "Missing section");
  assert(dom.querySelector("button") !== null, "Missing button");
  assert(dom.querySelectorAll("div").length === 0, "Unexpected div");
});

// Test 5: XSS safety
test("HTML-looking child text is not executed as HTML", () => {
  const dangerousText = "<img onerror=alert(1)> Safe Text";
  const dom = renderToDOM(
    createElement("p", null, dangerousText)
  );

  assert(dom.querySelector("img") === null, "HTML was interpreted");
  assert(
    dom.textContent === dangerousText,
    "Text content was changed"
  );
});

// Test 6: event handler
test("button click handler is registered", () => {
  let clicked = false;

  const button = renderToDOM(
    createElement(
      "button",
      { onClick: () => { clicked = true; } },
      "Click"
    )
  );

  button.click();

  assert(clicked, "Click handler did not run");
});

// Test 7: reject invalid element type
test("invalid element types are rejected", () => {
  let rejected = false;

  try {
    renderToDOM({
      type: "bad tag!",
      props: { children: [] }
    });
  } catch {
    rejected = true;
  }

  assert(rejected, "Invalid element type was accepted");
});

console.log("Mini React test suite completed.");