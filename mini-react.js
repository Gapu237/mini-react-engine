
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
