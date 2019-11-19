import render from './render';

const zip = (xs, ys) => {
  const zipped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

function diffAttrs(oldAttrs, newAttrs) {
  const patches = [];

  // set new attribute
  for (const [key, value] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(key, value);
      return $node;
    });
  }

  // remove old attrs
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(key);
        return $node;
      });
    }
  }

  return $node => {
    for (const patch of patches) {
      patch($node);
    }
  };
}

function diffChildren(oldVChildren, newVChildren) {
  const childPatches = [];
  for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
    childPatches.push(diff(oldVChild, newVChild));
  }

  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return $parent => {
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      patch(child);
    }
    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
}

function diff(vOldNode, vNewNode) {
  if (vNewNode === undefined) {
    return $node => {
      $node.remove();
      return undefined;
    };
  }

  if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
    if (vOldNode !== vNewNode) {
      return $node => {
        const $newNode = render(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return $node => undefined;
    }
  }

  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const pathAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const pathChildren = diffChildren(vOldNode.children, vNewNode.children);

  return $node => {
    pathAttrs($node);
    pathChildren($node);
    return $node;
  };
}

export default diff;
