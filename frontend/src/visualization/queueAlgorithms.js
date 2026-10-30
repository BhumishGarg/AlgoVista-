const LIMIT = 240;

function frame(message, structures = [], variables = {}, result = null, extras = {}) {
  return {
    message,
    structures: structures.map((item) => ({ ...item, values: [...(item.values || [])] })),
    variables: { ...variables },
    result,
    ...extras,
  };
}

function boundedFrames(frames) {
  return frames.length <= LIMIT ? frames : [...frames.slice(0, LIMIT - 1), frames[frames.length - 1]];
}

function numberTokens(line, name = "a number") {
  const values = line.trim().split(/\s+/).filter(Boolean).map(Number);
  if (values.some((value) => !Number.isFinite(value))) throw new Error(`Enter valid ${name} values.`);
  return values;
}

function integer(value, name, min = -Infinity, max = Infinity) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new Error(`Enter a valid ${name}.`);
  return parsed;
}

function inputLines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function listStructure(label, values, kind = "queue") {
  return { label, values, kind };
}

function parseOperations(lines, allowed, maxOperations = 3000) {
  const count = integer(lines[0], "operation count", 0, maxOperations);
  if (lines.length < count + 1) throw new Error("Provide every operation listed in the input.");
  return lines.slice(1, count + 1).map((line) => {
    const [name, rawValue, ...rest] = line.split(/\s+/);
    if (!allowed.includes(name) || rest.length) throw new Error(`Unsupported operation: ${line}`);
    const needsValue = ["push", "insertFront", "insertLast", "enQueue"].includes(name);
    if (needsValue && rawValue === undefined) throw new Error(`${name} requires a value.`);
    return { name, value: rawValue === undefined ? undefined : integer(rawValue, "operation value", 0, 1000) };
  });
}

function buildTree(tokens) {
  if (!tokens.length || tokens[0] === "null") return null;
  const root = { value: integer(tokens[0], "tree node value"), left: null, right: null };
  const queue = [root];
  let tokenIndex = 1;
  for (let head = 0; head < queue.length && tokenIndex < tokens.length; head += 1) {
    const node = queue[head];
    for (const side of ["left", "right"]) {
      if (tokenIndex >= tokens.length) break;
      const token = tokens[tokenIndex++];
      if (token !== "null") {
        node[side] = { value: integer(token, "tree node value"), left: null, right: null };
        queue.push(node[side]);
      }
    }
  }
  return root;
}

function traceTree(slug, lines) {
  const maxNodes = slug.endsWith("average-of-levels-in-binary-tree") ? 10000 : 2000;
  const count = integer(lines[0], "tree node count", 0, maxNodes);
  const tokens = lines[1]?.split(/\s+/).filter(Boolean) || [];
  if (tokens.length !== count) throw new Error("Tree values must match the declared level-order entry count.");
  const root = buildTree(tokens.slice(0, count));
  const result = [];
  const queue = root ? [{ node: root, depth: 0 }] : [];
  const frames = [frame("Initialize a breadth-first queue with the root.", [listStructure("Queue · next nodes", queue.map(({ node }) => node.value))], { levels: 0 })];
  let zigzag = false;
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    let sum = 0;
    for (let i = 0; i < levelSize; i += 1) {
      const { node, depth } = queue.shift();
      level.push(node.value);
      sum += node.value;
      if (node.left) queue.push({ node: node.left, depth: depth + 1 });
      if (node.right) queue.push({ node: node.right, depth: depth + 1 });
      if (frames.length < LIMIT) frames.push(frame(`Visit ${node.value} at level ${depth + 1}; add its children to the queue.`, [
        listStructure("Queue · next nodes", queue.map(({ node: next }) => next.value)),
        listStructure("Current level", level),
        listStructure("Output", result.flat()),
      ], { level: depth + 1, levelSize }));
    }
    let emitted = [...level];
    if (slug.endsWith("zigzag-level-order-traversal") && zigzag) emitted.reverse();
    if (slug.endsWith("average-of-levels-in-binary-tree")) result.push(Number((sum / levelSize).toFixed(5)));
    else result.push(emitted);
    if (frames.length < LIMIT) frames.push(frame(slug.endsWith("average-of-levels-in-binary-tree")
      ? `Level complete: average ${sum} / ${levelSize} = ${(sum / levelSize).toFixed(5)}.`
      : `Level complete; append ${emitted.join(", ")} to the output.`, [
      listStructure("Queue · next nodes", queue.map(({ node }) => node.value)),
      listStructure("Output", result.flat()),
    ], { level: result.length, direction: zigzag ? "right to left" : "left to right" }));
    zigzag = !zigzag;
  }
  const output = slug.endsWith("average-of-levels-in-binary-tree")
    ? result.map((value) => Number(value).toFixed(5)).join(" ")
    : JSON.stringify(result);
  frames.push(frame("All tree levels have been processed.", [listStructure("Queue · next nodes", []), listStructure("Output", result.flat())], { levels: result.length }, output));
  return boundedFrames(frames);
}

function traceCircular(slug, lines) {
  const capacity = integer(lines[0], "capacity", 1, 1000);
  const allowed = slug.endsWith("deque")
    ? ["insertFront", "insertLast", "deleteFront", "deleteLast", "getFront", "getRear", "isEmpty", "isFull"]
    : ["enQueue", "deQueue", "Front", "Rear", "isEmpty", "isFull"];
  const operations = parseOperations(lines.slice(1), allowed, slug.endsWith("deque") ? 2000 : 3000);
  const slots = Array(capacity).fill(null);
  let front = 0;
  let size = 0;
  const output = [];
  const frames = [frame("The circular buffer starts empty.", [listStructure("Circular slots", slots, "array")], { front: "-", rear: "-", size, capacity })];
  for (const { name, value } of operations) {
    let answer;
    let message = name;
    const isDeque = slug.endsWith("deque");
    if (name === "insertFront" || name === "enQueue") {
      answer = size < capacity;
      if (answer) {
        front = isDeque ? (front - 1 + capacity) % capacity : size === 0 ? 0 : front;
        slots[isDeque ? front : (front + size) % capacity] = value;
        size += 1;
      } else message += " failed because the buffer is full";
    } else if (name === "insertLast") {
      answer = size < capacity;
      if (answer) {
        slots[(front + size) % capacity] = value;
        if (size === 0) front = (front + capacity) % capacity;
        size += 1;
      } else message += " failed because the deque is full";
    } else if (name === "deleteFront" || name === "deQueue") {
      answer = size > 0;
      if (answer) {
        slots[front] = null;
        front = (front + 1) % capacity;
        size -= 1;
      } else message += " failed because the buffer is empty";
    } else if (name === "deleteLast") {
      answer = size > 0;
      if (answer) {
        slots[(front + size - 1) % capacity] = null;
        size -= 1;
      } else message += " failed because the deque is empty";
    } else if (name === "Front" || name === "getFront") answer = size ? slots[front] : -1;
    else if (name === "Rear" || name === "getRear") answer = size ? slots[(front + size - 1) % capacity] : -1;
    else if (name === "isEmpty") answer = size === 0;
    else if (name === "isFull") answer = size === capacity;
    if (["insertFront", "insertLast", "enQueue", "deQueue", "deleteFront", "deleteLast", "Front", "Rear", "getFront", "getRear", "isEmpty", "isFull"].includes(name)) output.push(answer);
    const rear = size ? (front + size - 1 + capacity) % capacity : "-";
    frames.push(frame(message, [listStructure(isDeque ? "Circular deque" : "Circular queue", slots, "array")],
      { front: size ? front : "-", rear, size, capacity, operation: name }, null,
      { markers: { front: size ? front : null, rear: size ? rear : null } }));
  }
  const finalResult = output.map(String).join("\n");
  frames.push(frame("All operations are complete.", [listStructure("Circular buffer", slots, "array")], { size, capacity }, finalResult));
  return boundedFrames(frames);
}

function traceSenate(text) {
  const senate = text.trim();
  if (!/^[RD]+$/.test(senate) || senate.length > 10000) throw new Error("Enter a senate string containing only R and D.");
  const radiant = [];
  const dire = [];
  [...senate].forEach((party, index) => (party === "R" ? radiant : dire).push(index));
  const frames = [frame("Place each senator's index in its party queue.", [
    listStructure("Radiant indices", radiant), listStructure("Dire indices", dire),
  ], { roundLength: senate.length })];
  while (radiant.length && dire.length) {
    const r = radiant.shift();
    const d = dire.shift();
    if (r < d) {
      radiant.push(r + senate.length);
      frames.push(frame(`Radiant senator ${r} acts first and bans Dire senator ${d}; Radiant returns next round.`, [
        listStructure("Radiant indices", radiant), listStructure("Dire indices", dire),
      ], { nextRadiantTurn: r + senate.length }));
    } else {
      dire.push(d + senate.length);
      frames.push(frame(`Dire senator ${d} acts first and bans Radiant senator ${r}; Dire returns next round.`, [
        listStructure("Radiant indices", radiant), listStructure("Dire indices", dire),
      ], { nextDireTurn: d + senate.length }));
    }
  }
  const result = radiant.length ? "Radiant" : "Dire";
  frames.push(frame(`${result} is the only party remaining.`, [listStructure("Radiant indices", radiant), listStructure("Dire indices", dire)], {}, result));
  return boundedFrames(frames);
}

function traceJosephus(lines) {
  const [n, k] = numberTokens(lines[0] || "", "n and k");
  integer(n, "n", 1, 500);
  integer(k, "k", 1, n);
  const friends = Array.from({ length: n }, (_, i) => i + 1);
  const frames = [frame("Arrange friends in the circle, starting at friend 1.", [listStructure("Circle / queue", friends)], { n, k, countingStartsAt: 1 })];
  let index = 0;
  while (friends.length > 1) {
    index = (index + k - 1) % friends.length;
    const [removed] = friends.splice(index, 1);
    frames.push(frame(`Count ${k}; eliminate friend ${removed}. Resume counting at the next friend.`, [listStructure("Remaining friends", friends)], { eliminated: removed, nextCountIndex: friends.length ? index % friends.length : "-" }));
  }
  frames.push(frame(`Friend ${friends[0]} is the final survivor.`, [listStructure("Remaining friends", friends)], {}, String(friends[0])));
  return boundedFrames(frames);
}

function traceStackQueue(lines) {
  const isQueueUsingStacks = lines.slug === "queues-implement-queue-using-stacks";
  const operations = parseOperations(lines, ["push", "pop", "peek", "top", "empty"], 100);
  if (operations.some(({ name, value }) => name === "push" && (value < 1 || value > 9))) {
    throw new Error("Push values must be between 1 and 9.");
  }
  const input = [];
  const output = [];
  const queue = [];
  const answers = [];
  const frames = [frame("Start with empty helper structures.", isQueueUsingStacks
    ? [listStructure("Input stack", input, "stack"), listStructure("Output stack", output, "stack")]
    : [listStructure("Queue (front at left)", queue)])];
  for (const { name, value } of operations) {
    let answer;
    if (isQueueUsingStacks) {
      if (name === "push") {
        input.push(value);
        frames.push(frame(`Push ${value} onto the input stack.`, [listStructure("Input stack", input, "stack"), listStructure("Output stack", output, "stack")]));
        continue;
      }
      if (name === "pop" || name === "peek") {
        if (!output.length) {
          while (input.length) output.push(input.pop());
          frames.push(frame("Transfer input to output; this reversal puts the oldest item on top.", [listStructure("Input stack", input, "stack"), listStructure("Output stack", output, "stack")]));
        }
        answer = name === "pop" ? output.pop() : output[output.length - 1];
      } else answer = !input.length && !output.length;
      answers.push(answer);
      frames.push(frame(`${name} returns ${answer}.`, [listStructure("Input stack", input, "stack"), listStructure("Output stack", output, "stack")], {}, null));
    } else {
      if (name === "push") {
        queue.push(value);
        for (let i = 1, size = queue.length; i < size; i += 1) queue.push(queue.shift());
        frames.push(frame(`Enqueue ${value}, then rotate older values behind it so the newest value is at the front.`, [listStructure("Queue · top at front", queue)]));
        continue;
      }
      answer = name === "pop" ? queue.shift() : name === "top" ? queue[0] : queue.length === 0;
      answers.push(answer);
      frames.push(frame(`${name} returns ${answer}.`, [listStructure("Queue · top at front", queue)]));
    }
  }
  const result = answers.map(String).join("\n");
  frames.push(frame("All operations are complete.", isQueueUsingStacks
    ? [listStructure("Input stack", input, "stack"), listStructure("Output stack", output, "stack")]
    : [listStructure("Queue · top at front", queue)], {}, result));
  return boundedFrames(frames);
}

function traceMovingAverage(lines) {
  const size = integer(lines[0], "window size", 1, 1000);
  const count = integer(lines[1], "value count", 0, 10000);
  const values = numberTokens(lines[2] || "", "stream");
  if (values.length !== count || values.some((value) => !Number.isInteger(value) || value < -100000 || value > 100000)) throw new Error("Value count or stream values do not match the input format.");
  const queue = [];
  let sum = 0;
  const answers = [];
  const frames = [frame("Start with an empty moving window.", [listStructure("Window", queue)], { windowSize: size, runningSum: sum })];
  values.forEach((value) => {
    queue.push(value);
    sum += value;
    let removed = "-";
    if (queue.length > size) {
      removed = queue.shift();
      sum -= removed;
    }
    const average = sum / queue.length;
    answers.push(average.toFixed(5));
    frames.push(frame(removed === "-" ? `Add ${value} to the window.` : `Add ${value}; remove the expired value ${removed}.`, [listStructure("Moving window", queue)], { incoming: value, outgoing: removed, runningSum: sum, average: average.toFixed(5) }));
  });
  const result = answers.join(" ");
  frames.push(frame("The stream is complete.", [listStructure("Final window", queue)], { runningSum: sum }, result));
  return boundedFrames(frames);
}

function traceRecentCalls(lines) {
  const count = integer(lines[0], "request count", 0, 10000);
  const times = numberTokens(lines[1] || "", "timestamps");
  if (times.length !== count || times.some((v, i) => !Number.isInteger(v) || v < 1 || v > 1e9 || (i && v <= times[i - 1]))) throw new Error("Provide the declared number of strictly increasing timestamps.");
  const queue = [];
  const answers = [];
  const frames = [frame("Keep only timestamps that fall within the inclusive 3000 ms window.", [listStructure("Recent requests", queue)])];
  times.forEach((time) => {
    queue.push(time);
    const cutoff = time - 3000;
    const expired = [];
    while (queue.length && queue[0] < cutoff) expired.push(queue.shift());
    answers.push(queue.length);
    frames.push(frame(expired.length ? `At t=${time}, remove ${expired.join(", ")}; the lower bound ${cutoff} is inclusive.` : `Add t=${time}; no request has expired.`, [listStructure("Requests in window", queue)], { cutoff, count: queue.length }));
  });
  const result = answers.join(" ");
  frames.push(frame("All request timestamps are processed.", [listStructure("Requests in final window", queue)], {}, result));
  return boundedFrames(frames);
}

function traceStudents(lines) {
  const count = integer(lines[0], "student count", 1, 100);
  const students = numberTokens(lines[1] || "", "student preferences");
  const sandwiches = numberTokens(lines[2] || "", "sandwich types");
  if (students.length !== count || sandwiches.length !== count || [...students, ...sandwiches].some((value) => value !== 0 && value !== 1)) throw new Error("Enter matching student and sandwich lists containing only 0 or 1.");
  const queue = [...students];
  let top = 0;
  let rotation = 0;
  const frames = [frame("Students wait in order; compare the front student with the top sandwich.", [listStructure("Student queue", queue), listStructure("Sandwich stack", sandwiches.slice(top), "stack")], { served: 0 })];
  while (queue.length && rotation < queue.length) {
    if (queue[0] === sandwiches[top]) {
      const student = queue.shift();
      top += 1;
      rotation = 0;
      frames.push(frame(`Preference ${student} matches; serve the student and remove the sandwich.`, [listStructure("Student queue", queue), listStructure("Sandwich stack", sandwiches.slice(top), "stack")], { served: top }));
    } else {
      queue.push(queue.shift());
      rotation += 1;
      frames.push(frame(`Preference does not match sandwich ${sandwiches[top]}; move this student to the back.`, [listStructure("Student queue", queue), listStructure("Sandwich stack", sandwiches.slice(top), "stack")], { consecutiveSkips: rotation }));
    }
  }
  const result = String(queue.length);
  frames.push(frame(queue.length ? `A full pass found no student who wants sandwich ${sandwiches[top]}.` : "Every student has been served.", [listStructure("Students unable to eat", queue), listStructure("Sandwich stack", sandwiches.slice(top), "stack")], { remainingStudents: queue.length }, result));
  return boundedFrames(frames);
}

function lockNeighbors(state) {
  const result = [];
  for (let i = 0; i < 4; i += 1) {
    const digits = state.split("");
    digits[i] = String((Number(digits[i]) + 1) % 10);
    result.push(digits.join(""));
    digits[i] = String((Number(digits[i]) + 8) % 10);
    result.push(digits.join(""));
  }
  return result;
}

function traceOpenLock(lines) {
  const count = integer(lines[0], "dead-end count", 0, 500);
  if (lines.length < count + 2) throw new Error("Provide every dead end and the target lock combination.");
  const dead = new Set(lines.slice(1, count + 1));
  const target = lines[count + 1];
  if ([...dead, target].some((value) => !/^\d{4}$/.test(value))) throw new Error("Lock combinations must contain exactly four digits.");
  const frames = [frame("Begin breadth-first search at 0000.", [listStructure("BFS frontier", ["0000"])], { turns: 0 })];
  if (dead.has("0000")) return [...frames, frame("The starting combination is a dead end.", [], {}, "-1")];
  const queue = ["0000"];
  const distance = new Map([["0000", 0]]);
  let answer = target === "0000" ? 0 : -1;
  while (queue.length && answer === -1) {
    const state = queue.shift();
    const steps = distance.get(state);
    for (const next of lockNeighbors(state)) {
      if (dead.has(next) || distance.has(next)) continue;
      distance.set(next, steps + 1);
      queue.push(next);
      if (next === target) {
        answer = steps + 1;
        break;
      }
    }
    if (frames.length < LIMIT - 1) frames.push(frame(`Explore ${state}; add unseen one-wheel neighbors to the BFS frontier.`, [
      listStructure("BFS frontier", queue.slice(0, 32)),
      listStructure("Visited states", [...distance.keys()].slice(-16)),
    ], { current: state, distance: steps, visitedCount: distance.size }));
  }
  frames.push(frame(answer >= 0 ? `Target ${target} is reached in ${answer} turns.` : `No valid route reaches ${target}.`,
    [listStructure("BFS frontier", queue.slice(0, 32))], { exploredStates: distance.size }, String(answer)));
  return boundedFrames(frames);
}

function tracePerfectSquares(lines) {
  const n = integer(lines[0], "n", 1, 10000);
  const squares = [];
  for (let value = 1; value * value <= n; value += 1) squares.push(value * value);
  const queue = [n];
  const distance = new Map([[n, 0]]);
  let head = 0;
  let answer = 0;
  const frames = [frame(`Start BFS from remainder ${n}; each edge subtracts one square.`, [listStructure("BFS frontier", [n])], { squares: squares.join(", ") })];
  while (head < queue.length) {
    const current = queue[head++];
    const depth = distance.get(current);
    if (current === 0) {
      answer = depth;
      break;
    }
    for (const square of squares) {
      if (square > current) break;
      const next = current - square;
      if (!distance.has(next)) {
        distance.set(next, depth + 1);
        queue.push(next);
      }
    }
    if (frames.length < LIMIT - 1) frames.push(frame(`Expand remainder ${current} by subtracting available perfect squares.`, [
      listStructure("Next BFS states", queue.slice(head, head + 24)),
      listStructure("Visited remainders", [...distance.keys()].slice(-20)),
    ], { current, squaresUsed: depth, visitedCount: distance.size }));
  }
  frames.push(frame(`The minimum number of perfect squares is ${answer}.`, [listStructure("BFS frontier", queue.slice(head, head + 24))], {}, String(answer)));
  return boundedFrames(frames);
}

function traceRevealCards(lines) {
  const count = integer(lines[0], "deck size", 1, 1000);
  const deck = numberTokens(lines[1] || "", "deck");
  if (deck.length !== count || new Set(deck).size !== count) throw new Error("Enter the declared number of unique card values.");
  const indices = Array.from({ length: count }, (_, i) => i);
  const result = Array(count);
  const frames = [frame("Sort cards ascending and queue the deck positions.", [listStructure("Sorted cards", [...deck].sort((a, b) => a - b)), listStructure("Position queue", indices)])];
  for (const card of [...deck].sort((a, b) => a - b)) {
    const index = indices.shift();
    result[index] = card;
    if (indices.length) indices.push(indices.shift());
    frames.push(frame(`Place card ${card} at position ${index}; rotate the next position to the back.`, [
      listStructure("Position queue", indices), listStructure("Deck arrangement", result.map((value) => value ?? "·"), "array"),
    ], { assignedCard: card, assignedIndex: index }));
  }
  const answer = result.join(" ");
  frames.push(frame("The deck now reveals cards in increasing order.", [listStructure("Deck arrangement", result, "array")], {}, answer));
  return boundedFrames(frames);
}

const FOUR_DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const EIGHT_DIRECTIONS = [...FOUR_DIRECTIONS, [1, 1], [1, -1], [-1, 1], [-1, -1]];

function parseGrid(lines, size, expectedRows = size) {
  const grid = lines.slice(1, expectedRows + 1).map((line) => numberTokens(line, "grid"));
  if (grid.length !== expectedRows || grid.some((row) => row.length !== size)) throw new Error("Grid dimensions do not match the declared input.");
  return grid;
}

function traceRottingOranges(lines) {
  const [rows, cols] = numberTokens(lines[0] || "", "grid dimensions");
  integer(rows, "row count", 1, 10);
  integer(cols, "column count", 1, 10);
  const grid = parseGrid(lines, cols, rows);
  if (grid.flat().some((cell) => ![0, 1, 2].includes(cell))) throw new Error("Grid cells must be 0, 1, or 2.");
  const queue = [];
  let fresh = 0;
  grid.forEach((row, r) => row.forEach((cell, c) => {
    if (cell === 2) queue.push([r, c]);
    if (cell === 1) fresh += 1;
  }));
  const frames = [frame("Queue all initially rotten oranges; propagate one minute per BFS level.", [listStructure("Rotten frontier", queue.map(([r, c]) => `(${r},${c})`))], { fresh, minute: 0 }, null, { grid: grid.map((row) => [...row]), gridMode: "oranges" })];
  let minute = 0;
  let head = 0;
  while (head < queue.length && fresh > 0) {
    const levelEnd = queue.length;
    let changed = false;
    while (head < levelEnd) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of FOUR_DIRECTIONS) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh -= 1;
          changed = true;
          queue.push([nr, nc]);
        }
      }
    }
    if (changed) minute += 1;
    frames.push(frame(`Minute ${minute}: newly reachable adjacent oranges rot.`, [listStructure("Next rotten frontier", queue.slice(head).map(([r, c]) => `(${r},${c})`))], { fresh, minute }, null, { grid: grid.map((row) => [...row]), gridMode: "oranges" }));
  }
  const result = fresh === 0 ? minute : -1;
  frames.push(frame(fresh === 0 ? `All reachable oranges are rotten after ${minute} minute(s).` : `${fresh} fresh orange(s) remain unreachable.`,
    [listStructure("Remaining frontier", queue.slice(head).map(([r, c]) => `(${r},${c})`))], { fresh, minute }, String(result), { grid: grid.map((row) => [...row]), gridMode: "oranges" }));
  return boundedFrames(frames);
}

function traceShortestPath(lines) {
  const n = integer(lines[0], "matrix size", 1, 100);
  const grid = parseGrid(lines, n);
  if (grid.flat().some((cell) => cell !== 0 && cell !== 1)) throw new Error("Matrix cells must be 0 or 1.");
  const frames = [frame("Begin BFS from the top-left cell; every move may use one of eight directions.", [], { distance: 1 }, null, { grid: grid.map((row) => [...row]), gridMode: "path" })];
  if (grid[0][0] || grid[n - 1][n - 1]) {
    frames.push(frame("The start or destination is blocked.", [], {}, "-1", { grid: grid.map((row) => [...row]), gridMode: "path" }));
    return frames;
  }
  const queue = [[0, 0, 1]];
  const visited = new Set(["0,0"]);
  let head = 0;
  let answer = -1;
  const visitedGrid = Array.from({ length: n }, () => Array(n).fill(false));
  visitedGrid[0][0] = true;
  while (head < queue.length) {
    const [r, c, distance] = queue[head++];
    if (r === n - 1 && c === n - 1) {
      answer = distance;
      break;
    }
    for (const [dr, dc] of EIGHT_DIRECTIONS) {
      const nr = r + dr, nc = c + dc, key = `${nr},${nc}`;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0 && !visited.has(key)) {
        visited.add(key);
        visitedGrid[nr][nc] = true;
        queue.push([nr, nc, distance + 1]);
      }
    }
    if (frames.length < LIMIT - 1) frames.push(frame(`Explore (${r},${c}) at path length ${distance}.`, [
      listStructure("BFS frontier", queue.slice(head, head + 24).map(([row, col]) => `(${row},${col})`)),
    ], { current: `(${r},${c})`, distance, visitedCells: visited.size }, null, { grid: grid.map((row, ri) => row.map((cell, ci) => cell === 1 ? 1 : visitedGrid[ri][ci] ? 2 : 0)), gridMode: "path" }));
  }
  frames.push(frame(answer < 0 ? "The destination is unreachable." : `The shortest clear path uses ${answer} cells.`,
    [listStructure("Remaining frontier", queue.slice(head).map(([r, c]) => `(${r},${c})`))], { visitedCells: visited.size }, String(answer),
    { grid: grid.map((row, ri) => row.map((cell, ci) => cell === 1 ? 1 : visitedGrid[ri][ci] ? 2 : 0)), gridMode: "path" }));
  return boundedFrames(frames);
}

function traceSlidingWindow(lines) {
  const [n, k] = numberTokens(lines[0] || "", "array size and window size");
  integer(n, "array size", 1, 100000);
  integer(k, "window size", 1, n);
  const values = numberTokens(lines[1] || "", "array");
  if (values.length !== n || values.some((value) => !Number.isInteger(value) || value < -10000 || value > 10000)) {
    throw new Error("Array values must be integers between -10000 and 10000, matching the declared size.");
  }
  const deque = [];
  const result = [];
  const frames = [frame("Maintain indices in decreasing value order; the front is the current maximum.", [listStructure("Monotonic deque (indices)", deque)])];
  values.forEach((value, index) => {
    while (deque.length && deque[0] <= index - k) deque.shift();
    const removed = [];
    while (deque.length && values[deque[deque.length - 1]] <= value) removed.push(deque.pop());
    deque.push(index);
    if (index >= k - 1) result.push(values[deque[0]]);
    frames.push(frame(`Read ${value} at index ${index}${removed.length ? `; discard smaller/equal candidates ${removed.join(", ")} from the rear` : ""}.`, [
      listStructure("Current window", values.slice(Math.max(0, index - k + 1), index + 1), "array"),
      listStructure("Deque indices", deque),
      listStructure("Deque values", deque.map((candidate) => values[candidate])),
      listStructure("Window maxima", result, "array"),
    ], { index, maximum: index >= k - 1 ? values[deque[0]] : "window not full", expiredBefore: index - k + 1 }));
  });
  const answer = result.join(" ");
  frames.push(frame("Every window maximum has been recorded.", [listStructure("Window maxima", result, "array"), listStructure("Final candidate deque", deque)], {}, answer));
  return boundedFrames(frames);
}

function traceTickets(lines) {
  const [n, target] = numberTokens(lines[0] || "", "queue size and target index");
  integer(n, "queue size", 1, 100);
  integer(target, "target index", 0, n - 1);
  const remaining = numberTokens(lines[1] || "", "ticket counts");
  if (remaining.length !== n || remaining.some((value) => !Number.isInteger(value) || value < 1 || value > 100)) throw new Error("Ticket counts must match n and be between 1 and 100.");
  const queue = Array.from({ length: n }, (_, id) => id);
  const frames = [frame(`Person ${target} is the target; simulate turns until their tickets reach zero.`, [listStructure("People (front to back)", queue.map((id) => `${id}:${remaining[id]}`))], { target, elapsed: 0 })];
  let elapsed = 0;
  while (remaining[target] > 0) {
    const person = queue.shift();
    remaining[person] -= 1;
    elapsed += 1;
    if (remaining[person] > 0) queue.push(person);
    frames.push(frame(`Person ${person} buys one ticket${person === target && remaining[person] === 0 ? " and finishes" : remaining[person] ? " and returns to the back" : " and leaves the queue"}.`, [
      listStructure("Queue · id:remaining", queue.map((id) => `${id}:${remaining[id]}`)),
      listStructure("Tickets left", remaining.map((count, id) => `${id}:${count}`), "array"),
    ], { lastBuyer: person, targetTicketsLeft: remaining[target], elapsed }));
  }
  frames.push(frame(`Person ${target} finishes after ${elapsed} turns.`, [listStructure("Queue · id:remaining", queue.map((id) => `${id}:${remaining[id]}`))], {}, String(elapsed)));
  return boundedFrames(frames);
}

function traceWordLadder(lines) {
  const begin = lines[0] || "";
  const end = lines[1] || "";
  const count = integer(lines[2], "word count", 0, 5000);
  const words = (lines[3] || "").split(/\s+/).filter(Boolean);
  if (!begin || begin.length > 10 || begin.length !== end.length || words.length !== count || words.some((word) => word.length !== begin.length)) throw new Error("Enter begin/end words and a matching dictionary in the specified format.");
  const remaining = new Set(words);
  const frames = [frame(`Start BFS from ${begin}; each edge changes exactly one letter.`, [listStructure("Word queue", [begin])], { sequenceLength: 1 })];
  if (begin === end) {
    frames.push(frame("The beginning already matches the target.", [listStructure("Word queue", [begin])], {}, "1"));
    return frames;
  }
  if (!remaining.has(end)) {
    frames.push(frame(`${end} is not in the dictionary.`, [], {}, "0"));
    return frames;
  }
  const queue = [[begin, 1]];
  remaining.delete(begin);
  let head = 0;
  let answer = 0;
  while (head < queue.length) {
    const [word, length] = queue[head++];
    if (word === end) {
      answer = length;
      break;
    }
    const neighbors = [];
    const chars = [...word];
    for (let i = 0; i < chars.length; i += 1) {
      const original = chars[i];
      for (let code = 97; code <= 122; code += 1) {
        const char = String.fromCharCode(code);
        if (char === original) continue;
        chars[i] = char;
        const next = chars.join("");
        if (remaining.delete(next)) {
          queue.push([next, length + 1]);
          neighbors.push(next);
        }
      }
      chars[i] = original;
    }
    if (frames.length < LIMIT - 1) frames.push(frame(`Explore ${word}; enqueue ${neighbors.length ? neighbors.join(", ") : "no"} unseen one-letter neighbor(s).`, [
      listStructure("Word BFS frontier", queue.slice(head, head + 24).map(([next]) => next)),
      listStructure("New neighbors", neighbors),
    ], { current: word, sequenceLength: length, wordsRemaining: remaining.size }));
  }
  frames.push(frame(answer ? `A shortest transformation uses ${answer} words.` : `No transformation reaches ${end}.`, [listStructure("Remaining word frontier", queue.slice(head).map(([word]) => word))], {}, String(answer)));
  return boundedFrames(frames);
}

export function buildQueueTrace(slug, text) {
  const lines = inputLines(text);
  if (!lines.length) throw new Error("Enter input before starting the visualization.");
  if (slug.endsWith("average-of-levels-in-binary-tree") || slug.endsWith("level-order-traversal")) return traceTree(slug, lines);
  if (slug.endsWith("circular-queue") || slug.endsWith("circular-deque")) return traceCircular(slug, lines);
  if (slug.endsWith("dota2-senate")) return traceSenate(text);
  if (slug.endsWith("circular-game")) return traceJosephus(lines);
  if (slug.endsWith("using-stacks") || slug.endsWith("using-queues")) {
    lines.slug = slug;
    return traceStackQueue(lines);
  }
  if (slug.endsWith("moving-average-from-data-stream")) return traceMovingAverage(lines);
  if (slug.endsWith("number-of-recent-calls")) return traceRecentCalls(lines);
  if (slug.endsWith("unable-to-eat-lunch")) return traceStudents(lines);
  if (slug.endsWith("open-the-lock")) return traceOpenLock(lines);
  if (slug.endsWith("perfect-squares")) return tracePerfectSquares(lines);
  if (slug.endsWith("increasing-order")) return traceRevealCards(lines);
  if (slug.endsWith("rotting-oranges")) return traceRottingOranges(lines);
  if (slug.endsWith("binary-matrix")) return traceShortestPath(lines);
  if (slug.endsWith("sliding-window-maximum")) return traceSlidingWindow(lines);
  if (slug.endsWith("buy-tickets")) return traceTickets(lines);
  if (slug.endsWith("word-ladder")) return traceWordLadder(lines);
  throw new Error("An interactive Queue visualization is not available for this question yet.");
}
