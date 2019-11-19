function renderElem({ tagName, attrs, children }) {
  const $el = document.createElement(tagName);

  // set attributes
  for (const [k, value] of Object.entries(attrs)) {
    $el.setAttribute(k, value);
  }

  // set children
  for (const child of children) {
    const $child = render(child);
    $el.appendChild($child);
  }

  return $el;
}

function render(vNode) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }

  return renderElem(vNode);
}

export default render;
