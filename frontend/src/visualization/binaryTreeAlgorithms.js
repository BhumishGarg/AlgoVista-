const FRAME_LIMIT = 240;
const NODE_LIMIT = 100;

function parseValues(input, name, required = true) {
  const expression = new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*\\[([^\\]]*)\\]`, "i");
  const match = input.match(expression);
  if (!match) {
    if (required) throw new Error(`Enter ${name} = [values].`);
    return null;
  }
  if (!match[1].trim()) return [];
  return match[1].split(",").map((part) => {
    const value = part.trim();
    if (value.toLowerCase() === "null") return null;
    if (!/^-?\d+$/.test(value)) throw new Error(`Enter integer values or null in ${name}.`);
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed)) throw new Error(`Values in ${name} must be safe integers.`);
    return parsed;
  });
}

function parseInteger(input, name, { required = true, fallback = null } = {}) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*(-?\\d+)`, "i"));
  if (!match) {
    if (!required) return fallback;
    throw new Error(`Enter ${name} = integer.`);
  }
  const value = Number(match[1]);
  if (!Number.isSafeInteger(value)) throw new Error(`${name} must be a safe integer.`);
  return value;
}

function makeTree(values, label = "root") {
  if (values.length > NODE_LIMIT * 2 + 1 || values.filter((value) => value !== null).length > NODE_LIMIT) {
    throw new Error(`The visualizer accepts at most ${NODE_LIMIT} nodes in each tree.`);
  }
  if (values.length === 0 || values[0] === null) {
    if (values.some((value) => value !== null)) throw new Error(`${label} cannot have values below an empty root.`);
    return null;
  }
  let nextId = 0;
  const root = { id: `${label}${nextId++}`, value: values[0], left: null, right: null };
  const queue = [root];
  let index = 1;
  for (let head = 0; head < queue.length && index < values.length; head += 1) {
    const node = queue[head];
    for (const side of ["left", "right"]) {
      if (index >= values.length) break;
      const value = values[index++];
      if (value !== null) {
        node[side] = { id: `${label}${nextId++}`, value, left: null, right: null };
        queue.push(node[side]);
      }
    }
  }
  if (values.slice(index).some((value) => value !== null)) {
    throw new Error(`${label} contains values without a parent in the level-order input.`);
  }
  return root;
}

function cloneTree(node) {
  if (!node) return null;
  return { id: node.id, value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function serializeTree(root) {
  if (!root) return [];
  const values = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    values.push(node ? node.value : null);
    if (node) {
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (values.at(-1) === null) values.pop();
  return values;
}

function buildFrame(message, root, active = [], visited = [], variables = {}, result = null, otherRoot = null, compareTrees = false) {
  return { message, tree: cloneTree(root), otherTree: cloneTree(otherRoot), compareTrees, active, visited, variables, result };
}

function boundedFrames(frames) {
  return frames.length <= FRAME_LIMIT
    ? frames
    : [...frames.slice(0, FRAME_LIMIT - 1), frames[frames.length - 1]];
}

function buildInput(slug, input) {
  const kind = slug.replace(/^binary-trees-/, "");
  let values;
  let root;
  let otherRoot = null;
  if (kind === "same-tree") {
    root = makeTree(parseValues(input, "p"), "p");
    otherRoot = makeTree(parseValues(input, "q"), "q");
    return { kind, root, otherRoot, values: null };
  }
  if (kind === "construct-binary-tree-from-preorder-and-inorder") {
    const preorder = parseValues(input, "preorder");
    const inorder = parseValues(input, "inorder");
    if (preorder.length !== inorder.length || preorder.length === 0) {
      throw new Error("Preorder and inorder must contain the same non-zero number of values.");
    }
    if (preorder.length > NODE_LIMIT) throw new Error(`The visualizer accepts at most ${NODE_LIMIT} nodes.`);
    if (preorder.some((value) => value === null) || inorder.some((value) => value === null)) {
      throw new Error("Traversal sequences cannot contain null values.");
    }
    if (new Set(preorder).size !== preorder.length || new Set(inorder).size !== inorder.length ||
      preorder.some((value) => !inorder.includes(value))) {
      throw new Error("Preorder and inorder must contain the same unique values.");
    }
    return { kind, root: null, otherRoot: null, values: { preorder, inorder } };
  }
  values = parseValues(input, "root");
  root = makeTree(values);
  return { kind, root, otherRoot, values: null };
}

function createTreeFromTraversals(preorder, inorder, frames) {
  let preorderIndex = 0;
  let nextId = 0;
  const inorderPositions = new Map(inorder.map((value, index) => [value, index]));
  function build(start, end) {
    if (start >= end) return null;
    const value = preorder[preorderIndex++];
    const split = inorderPositions.get(value);
    if (split < start || split >= end) throw new Error("The traversals do not describe the same valid tree.");
    const node = { id: `built${nextId++}`, value, left: null, right: null };
    frames.push(buildFrame(`Choose ${value} as the root of this traversal range.`, node, [node.id], [], { inorderRange: `${start}–${end - 1}` }));
    node.left = build(start, split);
    node.right = build(split + 1, end);
    frames.push(buildFrame(`Attach the left and right subtrees beneath ${value}.`, node, [node.id], [], { root: value }));
    return node;
  }
  return build(0, inorder.length);
}

function trace(kind, root, otherRoot, extraValues) {
  const compareTrees = kind === "same-tree";
  const frames = [buildFrame("Read the input and build the tree.", root, [], [], {}, null, otherRoot, compareTrees)];
  if (kind === "construct-binary-tree-from-preorder-and-inorder") {
    root = createTreeFromTraversals(extraValues.preorder, extraValues.inorder, frames);
    const result = JSON.stringify(serializeTree(root));
    frames.push(buildFrame("The reconstructed tree is complete.", root, [], [], {}, result));
    return { frames: boundedFrames(frames), result };
  }
  const frame = (message, active = [], visited = [], variables = {}, result = null) => {
    frames.push(buildFrame(message, root, active, visited, variables, result, otherRoot, compareTrees));
  };
  let result;
  const kindEnds = (suffix) => kind.endsWith(suffix);

  if (kindEnds("maximum-depth-of-binary-tree")) {
    function depth(node) {
      if (!node) return 0;
      const left = depth(node.left);
      const right = depth(node.right);
      const height = 1 + Math.max(left, right);
      frame(`At ${node.value}, combine child depths ${left} and ${right}.`, [node.id], [], { leftDepth: left, rightDepth: right, height });
      return height;
    }
    result = depth(root);
  } else if (kindEnds("balanced-binary-tree")) {
    function height(node) {
      if (!node) return 0;
      const left = height(node.left);
      const right = height(node.right);
      if (left < 0 || right < 0 || Math.abs(left - right) > 1) {
        frame(`Node ${node.value} is unbalanced: child heights ${left} and ${right}.`, [node.id], [], { leftHeight: left, rightHeight: right, balanced: false });
        return -1;
      }
      const value = 1 + Math.max(left, right);
      frame(`Node ${node.value} is balanced; return height ${value}.`, [node.id], [], { leftHeight: left, rightHeight: right, height: value });
      return value;
    }
    result = height(root) >= 0;
  } else if (kindEnds("diameter-of-binary-tree")) {
    let diameter = 0;
    function height(node) {
      if (!node) return 0;
      const left = height(node.left);
      const right = height(node.right);
      diameter = Math.max(diameter, left + right);
      frame(`At ${node.value}, path through this node has ${left + right} edges.`, [node.id], [], { leftHeight: left, rightHeight: right, diameter });
      return 1 + Math.max(left, right);
    }
    height(root);
    result = diameter;
  } else if (kindEnds("maximum-path-sum")) {
    let best = -Infinity;
    function gain(node) {
      if (!node) return 0;
      const left = Math.max(0, gain(node.left));
      const right = Math.max(0, gain(node.right));
      const through = node.value + left + right;
      best = Math.max(best, through);
      frame(`Evaluate the path through ${node.value}; update the best sum to ${best}.`, [node.id], [], { leftGain: left, rightGain: right, through, best });
      return node.value + Math.max(left, right);
    }
    gain(root);
    result = root ? best : 0;
  } else if (kindEnds("binary-tree-level-order-traversal") ||
      kindEnds("binary-tree-zigzag-level-order-traversal") ||
      kindEnds("binary-tree-right-side-view")) {
    const levels = [];
    const queue = root ? [root] : [];
    const rightView = [];
    let reverse = false;
    while (queue.length) {
      const count = queue.length;
      const level = [];
      for (let index = 0; index < count; index += 1) {
        const node = queue.shift();
        level.push(node.value);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        frame(`Visit ${node.value} on level ${levels.length + 1}.`, [node.id], [], { level: levels.length + 1, queued: queue.map((item) => item.value) });
      }
      if (kindEnds("binary-tree-right-side-view")) rightView.push(level.at(-1));
      else {
        if (kindEnds("binary-tree-zigzag-level-order-traversal") && reverse) level.reverse();
        levels.push(level);
      }
      reverse = !reverse;
      frame(`Complete level ${levels.length || rightView.length}.`, [], [], { levelValues: level, direction: reverse ? "right to left next" : "left to right next" });
    }
    result = kindEnds("binary-tree-right-side-view") ? rightView : levels;
  } else if (kindEnds("path-sum") || kindEnds("path-sum-ii")) {
    const target = parseInteger(extraValues.input, "targetSum");
    const paths = [];
    let found = false;
    function search(node, sum, path) {
      if (!node) return;
      const nextPath = [...path, node.value];
      const nextSum = sum + node.value;
      frame(`Add ${node.value} to the active root-to-node path.`, [node.id], [], { path: nextPath.join(" → "), sum: nextSum, targetSum: target });
      if (!node.left && !node.right) {
        if (nextSum === target) {
          found = true;
          paths.push(nextPath);
          frame(`Leaf ${node.value} completes a path matching ${target}.`, [node.id], [], { path: nextPath.join(" → "), sum: nextSum, targetSum: target }, JSON.stringify(nextPath));
        } else frame(`Leaf ${node.value} ends with sum ${nextSum}, not ${target}.`, [node.id], [], { path: nextPath.join(" → "), sum: nextSum, targetSum: target });
        return;
      }
      search(node.left, nextSum, nextPath);
      search(node.right, nextSum, nextPath);
    }
    search(root, 0, []);
    result = kindEnds("path-sum-ii") ? paths : found;
  } else if (kindEnds("same-tree")) {
    function same(first, second) {
      if (!first || !second) {
        const equal = first === second;
        frame(equal ? "Both corresponding positions are empty." : "One tree has a node where the other is empty.", [], [], { same: equal });
        return equal;
      }
      const equalValue = first.value === second.value;
      frame(`Compare ${first.value} with ${second.value}.`, [`p-${first.id}`, `q-${second.id}`], [], { valuesMatch: equalValue });
      return equalValue && same(first.left, second.left) && same(first.right, second.right);
    }
    result = same(root, otherRoot);
  } else if (kindEnds("symmetric-tree")) {
    function mirror(left, right) {
      if (!left || !right) return left === right;
      frame(`Compare mirror pair ${left.value} and ${right.value}.`, [left.id, right.id], [], { valuesMatch: left.value === right.value });
      return left.value === right.value && mirror(left.left, right.right) && mirror(left.right, right.left);
    }
    result = root === null || mirror(root.left, root.right);
  } else if (kindEnds("validate-binary-search-tree")) {
    function validate(node, lower, upper) {
      if (!node) return true;
      const valid = (lower === null || node.value > lower) && (upper === null || node.value < upper);
      frame(valid ? `Node ${node.value} is within its allowed bounds.` : `Node ${node.value} violates its BST bounds.`, [node.id], [], { lower: lower ?? "-∞", upper: upper ?? "∞", valid });
      return valid && validate(node.left, lower, node.value) && validate(node.right, node.value, upper);
    }
    result = validate(root, null, null);
  } else if (kindEnds("search-in-a-binary-search-tree")) {
    const target = parseInteger(extraValues.input, "val");
    let current = root;
    while (current) {
      frame(`Compare ${target} with ${current.value}.`, [current.id], [], { target, current: current.value });
      if (current.value === target) break;
      current = target < current.value ? current.left : current.right;
    }
    result = JSON.stringify(serializeTree(current));
  } else if (kindEnds("insert-into-a-binary-search-tree")) {
    const value = parseInteger(extraValues.input, "val");
    if (!root) root = { id: "inserted", value, left: null, right: null };
    else {
      let current = root;
      while (true) {
        const side = value < current.value ? "left" : "right";
        frame(`Compare ${value} with ${current.value}; continue ${side}.`, [current.id], [], { value, current: current.value, side });
        if (!current[side]) {
          current[side] = { id: "inserted", value, left: null, right: null };
          frame(`Insert ${value} as the ${side} child of ${current.value}.`, [current[side].id], [], { inserted: value });
          break;
        }
        current = current[side];
      }
    }
    result = JSON.stringify(serializeTree(root));
  } else if (kindEnds("delete-node-in-a-bst")) {
    const key = parseInteger(extraValues.input, "key");
    function remove(node) {
      if (!node) return null;
      frame(`Search for ${key} from node ${node.value}.`, [node.id], [], { key, current: node.value });
      if (key < node.value) node.left = remove(node.left);
      else if (key > node.value) node.right = remove(node.right);
      else if (!node.left) return node.right;
      else if (!node.right) return node.left;
      else {
        let successor = node.right;
        while (successor.left) successor = successor.left;
        frame(`Replace ${node.value} with its inorder successor ${successor.value}.`, [node.id, successor.id], [], { key, successor: successor.value });
        node.value = successor.value;
        node.right = removeMin(node.right);
      }
      return node;
    }
    function removeMin(node) {
      if (!node.left) return node.right;
      node.left = removeMin(node.left);
      return node;
    }
    root = remove(root);
    result = JSON.stringify(serializeTree(root));
  } else if (kindEnds("kth-smallest-element-in-a-bst")) {
    const k = parseInteger(extraValues.input, "k");
    const stack = [];
    let current = root;
    let count = 0;
    let smallest = null;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop();
      count += 1;
      frame(`Visit ${current.value} as inorder value ${count}.`, [current.id], [], { count, k });
      if (count === k) {
        smallest = current.value;
        break;
      }
      current = current.right;
    }
    if (smallest === null) throw new Error("k must be between 1 and the number of nodes.");
    result = smallest;
  } else if (kindEnds("lowest-common-ancestor-of-a-binary-tree")) {
    const p = parseInteger(extraValues.input, "p");
    const q = parseInteger(extraValues.input, "q");
    function find(node) {
      if (!node) return null;
      frame(`Search the subtree rooted at ${node.value} for p=${p} and q=${q}.`, [node.id], [], { p, q, current: node.value });
      if (node.value === p || node.value === q) return node;
      const left = find(node.left);
      const right = find(node.right);
      if (left && right) {
        frame(`${node.value} is the first node whose subtrees contain p and q.`, [node.id], [], { p, q, ancestor: node.value });
        return node;
      }
      return left || right;
    }
    function contains(node, value) {
      return Boolean(node && (node.value === value || contains(node.left, value) || contains(node.right, value)));
    }
    if (!contains(root, p) || !contains(root, q)) throw new Error("Both p and q must exist in the input tree.");
    const ancestor = find(root);
    if (!ancestor) throw new Error("Both p and q must exist in the input tree.");
    result = ancestor.value;
  } else if (kindEnds("flatten-binary-tree-to-linked-list")) {
    const preorder = [];
    function collect(node) {
      if (!node) return;
      preorder.push(node);
      collect(node.left);
      collect(node.right);
    }
    collect(root);
    for (let index = 0; index < preorder.length; index += 1) {
      const node = preorder[index];
      node.left = null;
      node.right = preorder[index + 1] || null;
      frame(`Rewire ${node.value} to the next preorder node.`, [node.id, ...(node.right ? [node.right.id] : [])], [], { next: node.right?.value ?? "null" });
    }
    result = JSON.stringify(serializeTree(root));
  } else if (kindEnds("invert-binary-tree")) {
    function invert(node) {
      if (!node) return;
      [node.left, node.right] = [node.right, node.left];
      frame(`Swap the children of ${node.value}.`, [node.id], [], { left: node.left?.value ?? "null", right: node.right?.value ?? "null" });
      invert(node.left);
      invert(node.right);
    }
    invert(root);
    result = JSON.stringify(serializeTree(root));
  } else {
    throw new Error("No tree visualization is registered for this question.");
  }

  const output = typeof result === "string" ? result : JSON.stringify(result);
  frames.push(buildFrame("The algorithm is complete.", root, [], [], {}, output, otherRoot, compareTrees));
  return { frames: boundedFrames(frames), result: output };
}

export function buildBinaryTreeTrace(slug, input) {
  const { kind, root, otherRoot, values } = buildInput(slug, input);
  return trace(kind, root, otherRoot, values || { input });
}
