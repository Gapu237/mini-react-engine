
/**
 * Mini React Engine
 * Creates VNodes and renders them into real DOM nodes.
 */

// 1. Convert text into a VNode
export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(text),
      children: []
    }
  };
}

// 2. Create a VNode from a tag, props, and children
export function createElement(type, props, ...children) {
  const normalizedChildren = children
    .flat(Infinity)
    .map((child) => {
      if (
        typeof child === "string" ||
        typeof child === "number"
      ) {
        return createTextElement(child);
      }

      if (typeof child === "boolean" || child == null) {
        return null;
      }

      return child;
    })
    .filter((child) => child !== null);

  return {
    type,
    props: {
      ...(props || {}),
      children: normalizedChildren
    }
  };
}

// 3. Apply props to a real DOM element
function setProp(dom, name, value) {
  // Never allow event handlers to be set as HTML attributes
  if (/^on/i.test(name)) {
    const eventName = name.slice(2).toLowerCase();

    if (
      typeof value === "function" &&
      /^[a-z]+$/.test(eventName)
    ) {
      dom.addEventListener(eventName, value);
    }

    return;
  }

  // Internal VNode properties are not HTML attributes
  if (
    name === "children" ||
    name === "key" ||
    name === "ref" ||
    name === "dangerouslySetInnerHTML"
  ) {
    return;
  }

  if (name === "style" && value && typeof value === "object") {
    Object.assign(dom.style, value);
    return;
  }

  if (name === "className") {
    dom.setAttribute("class", value ?? "");
    return;
  }

  // Ignore object values instead of converting them to attributes
  if (
    value !== null &&
    typeof value === "object"
  ) {
    return;
  }

  if (typeof value === "function" || value == null) {
    return;
  }

  // Handle boolean HTML attributes
  if (typeof value === "boolean") {
    if (
      name === "disabled" ||
      name === "checked" ||
      name === "selected" ||
      name === "multiple" ||
      name === "required" ||
      name === "readOnly" ||
      name === "autoFocus"
    ) {
      const attributeName =
        name === "readOnly" ? "readonly" :
        name === "autoFocus" ? "autofocus" : name;

      if (value) {
        dom.setAttribute(attributeName, "");
      } else {
        dom.removeAttribute(attributeName);
      }

      if (name in dom) {
        dom[name] = value;
      }
    }

    return;
  }

  // Set text content and other regular attributes safely
  if (name === "nodeValue") {
    dom.textContent = String(value);
    return;
  }

  dom.setAttribute(name, String(value));
}

// 4. Convert a VNode into a real DOM node
export function renderToDOM(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    typeof vNode !== "object"
  ) {
    throw new TypeError("Invalid VNode");
  }

  // Render text as a text node, never as HTML
  if (vNode.type === "TEXT_ELEMENT") {
    return document.createTextNode(
      vNode.props.nodeValue
    );
  }

  if (
    typeof vNode.type !== "string" ||
    !/^[a-z][a-z0-9-]*$/i.test(vNode.type)
  ) {
    throw new TypeError("Invalid element type");
  }

  // Create semantic HTML elements
  const dom = document.createElement(vNode.type);
  const props = vNode.props || {};

  // Apply properties, excluding children
  for (const [name, value] of Object.entries(props)) {
    if (name !== "children") {
      setProp(dom, name, value);
    }
  }

  // Recursively render child VNodes
  for (const child of props.children || []) {
    dom.appendChild(renderToDOM(child));
  }

  return dom;
}