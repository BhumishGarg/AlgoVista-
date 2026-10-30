const FRAME_LIMIT = 240;
const VALUE_LIMIT = 100;

function readArray(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=`, "i"));
  if (!match) return [];
  let start = input.indexOf("[", match.index + match[0].length);
  if (start < 0) throw new Error(`Enter ${name} as an array.`);
  let depth = 0;
  let quoted = false;
  let escaped = false;
  let end = -1;
  for (let index = start; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === "[") depth += 1;
    else if (char === "]" && --depth === 0) { end = index + 1; break; }
  }
  if (end < 0) throw new Error(`Close the ${name} array with ].`);
  let values;
  try { values = JSON.parse(input.slice(start, end)); }
  catch { throw new Error(`${name} must use valid JSON array syntax.`); }
  if (!Array.isArray(values)) throw new Error(`${name} must be an array.`);
  return values;
}

function readNumber(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*(-?\\d+)`, "i"));
  if (!match) return 0;
  const value = Number(match[1]);
  if (!Number.isSafeInteger(value)) throw new Error(`${name} must be a safe integer.`);
  return value;
}

function readString(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*"([^"]*)"`, "i"));
  if (!match) return "";
  return match[1];
}

function maxHeap(a, b) { return a > b; }
function minHeap(a, b) { return a < b; }

class Heap {
  constructor(compare) { this.values = []; this.compare = compare; }
  get size() { return this.values.length; }
  peek() { return this.values[0]; }
  push(value) {
    const values = this.values;
    values.push(value);
    let index = values.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (!this.compare(values[index], values[parent])) break;
      [values[index], values[parent]] = [values[parent], values[index]];
      index = parent;
    }
  }
  pop() {
    if (!this.values.length) return undefined;
    const root = this.values[0];
    const last = this.values.pop();
    if (this.values.length) {
      this.values[0] = last;
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let best = index;
        if (left < this.values.length && this.compare(this.values[left], this.values[best])) best = left;
        if (right < this.values.length && this.compare(this.values[right], this.values[best])) best = right;
        if (best === index) break;
        [this.values[index], this.values[best]] = [this.values[best], this.values[index]];
        index = best;
      }
    }
    return root;
  }
}

function boundedFrames(frames) {
  return frames.length <= FRAME_LIMIT ? frames : [...frames.slice(0, FRAME_LIMIT - 1), frames.at(-1)];
}

function buildFrame(message, heap = [], secondary = [], output = [], variables = {}, result = null) {
  return { message, heap: heap.map((item) => structuredClone(item)), secondary: secondary.map((item) => structuredClone(item)),
    output: structuredClone(output), variables: { ...variables }, result };
}

function parse(input) {
  return {
    nums: readArray(input, "nums"),
    nums1: readArray(input, "nums1"),
    nums2: readArray(input, "nums2"),
    points: readArray(input, "points"),
    matrix: readArray(input, "matrix"),
    stones: readArray(input, "stones"),
    heights: readArray(input, "heights"),
    profits: readArray(input, "profits"),
    capital: readArray(input, "capital"),
    intervals: readArray(input, "intervals"),
    lists: readArray(input, "lists"),
    quality: readArray(input, "quality"),
    wage: readArray(input, "wage"),
    gifts: readArray(input, "gifts"),
    tasks: readArray(input, "tasks"),
    operations: readArray(input, "operations"),
    arguments: readArray(input, "arguments"),
    values: readArray(input, "values"),
    addValues: readArray(input, "addValues"),
    k: readNumber(input, "k"),
    w: readNumber(input, "w"),
    bricks: readNumber(input, "bricks"),
    ladders: readNumber(input, "ladders"),
    n: readNumber(input, "n"),
    s: readString(input, "s"),
  };
}

function validate(values, name, max = VALUE_LIMIT) {
  if (values.length > max) throw new Error(`${name} is limited to ${max} entries in the visualizer.`);
}

function trace(slug, input) {
  const kind = slug.replace(/^heaps-priority-queue-/, "");
  const data = parse(input);
  const frames = [];
  let output = [];
  let result;
  let heap = new Heap(minHeap);
  let secondary = new Heap(maxHeap);
  const record = (message, variables = {}) => {
    frames.push(buildFrame(message, heap.values, secondary.values, output, variables));
  };
  const finish = (message, value, variables = {}) => {
    result = typeof value === "string" ? value : JSON.stringify(value);
    frames.push(buildFrame(message, heap.values, secondary.values, output, variables, result));
    return { frames: boundedFrames(frames), result };
  };

  if (kind === "kth-largest-element-in-an-array") {
    validate(data.nums, "nums");
    if (data.k < 1 || data.k > data.nums.length) throw new Error("k must be between 1 and nums.length.");
    for (const value of data.nums) {
      heap.push(value);
      if (heap.size > data.k) heap.pop();
      record(`Insert ${value}; keep only the largest ${data.k} values.`, { k: data.k, boundary: heap.peek() });
    }
    return finish(`The heap root is the ${data.k}th-largest value.`, heap.peek());
  }

  if (kind === "kth-smallest-element-in-a-sorted-matrix") {
    validate(data.matrix, "matrix", 20);
    if (!data.matrix.length || data.matrix.some((row) => !Array.isArray(row) || row.length !== data.matrix.length)) throw new Error("matrix must be a non-empty square matrix.");
    if (data.matrix.length > 20 || data.k < 1 || data.k > data.matrix.length ** 2) throw new Error("k or matrix size is outside the visualizer limit.");
    for (const row of data.matrix) for (const value of row) heap.push(value);
    let value;
    for (let i = 0; i < data.k; i += 1) {
      value = heap.pop();
      record(`Remove ${value}, the next smallest matrix value.`, { rank: i + 1, k: data.k });
    }
    return finish(`${value} is the kth-smallest value.`, value);
  }

  if (kind === "top-k-frequent-elements") {
    validate(data.nums, "nums");
    const counts = new Map();
    for (const value of data.nums) counts.set(value, (counts.get(value) || 0) + 1);
    if (data.k < 1 || data.k > counts.size) throw new Error("k must be between 1 and the number of distinct values.");
    heap = new Heap((a, b) => a.count < b.count);
    for (const [value, count] of counts) {
      heap.push({ value, count });
      if (heap.size > data.k) heap.pop();
      record(`Count ${value} ${count} time${count === 1 ? "" : "s"}; retain the top ${data.k}.`, { frequency: count });
    }
    output = heap.values.map((item) => item.value);
    return finish("The heap contains the k most frequent values.", output);
  }

  if (kind === "k-closest-points-to-origin") {
    validate(data.points, "points");
    if (data.k < 1 || data.k > data.points.length || data.points.some((point) => !Array.isArray(point) || point.length !== 2)) throw new Error("Provide valid points and a k within their count.");
    heap = new Heap((a, b) => a.distance > b.distance);
    for (let index = 0; index < data.points.length; index += 1) {
      const [x, y] = data.points[index];
      const distance = x * x + y * y;
      heap.push({ point: [x, y], distance, index });
      if (heap.size > data.k) heap.pop();
      record(`Consider [${x}, ${y}] at squared distance ${distance}.`, { distance, limit: data.k });
    }
    output = heap.values.sort((a, b) => a.index - b.index).map((item) => item.point);
    return finish("The retained points are the k closest to the origin.", output);
  }

  if (kind === "find-median-from-data-stream") {
    const operations = data.operations;
    const stream = operations.length
      ? operations.flatMap((operation, index) => operation === "addNum" ? data.values[index]?.slice(0, 1) || [] : [])
      : readArray(input, "nums");
    validate(stream, "stream");
    if (!stream.length) throw new Error("Provide at least one addNum operation.");
    heap = new Heap(maxHeap);
    secondary = new Heap(minHeap);
    const medians = [];
    for (const value of stream) {
      if (!heap.size || value <= heap.peek()) heap.push(value); else secondary.push(value);
      if (heap.size > secondary.size + 1) secondary.push(heap.pop());
      if (secondary.size > heap.size) heap.push(secondary.pop());
      const median = heap.size === secondary.size ? (heap.peek() + secondary.peek()) / 2 : heap.peek();
      medians.push(median);
      record(`Insert ${value}; rebalance the lower and upper halves.`, { lowerMedian: heap.peek(), upperMedian: secondary.peek() ?? "-", median });
    }
    if (!operations.length) return finish("The stream medians are complete.", medians);
    const results = [];
    let inserted = 0;
    for (const operation of operations) {
      if (operation === "MedianFinder") results.push(null);
      else if (operation === "addNum") results.push(null);
      else if (operation === "findMedian") results.push(medians[inserted - 1]);
      else throw new Error(`Unsupported median operation: ${operation}`);
      if (operation === "addNum") inserted += 1;
    }
    const formatted = `[${results.map((value) => value === null ? "null" : Number.isInteger(value) ? value.toFixed(1) : value).join(",")}]`;
    return finish("The stream medians are complete.", formatted);
  }

  if (kind === "merge-k-sorted-lists") {
    validate(data.lists.flat(), "list values");
    heap = new Heap((a, b) => a.value < b.value);
    heap = new Heap((a, b) => a.value < b.value);
    data.lists.forEach((list, listIndex) => {
      if (list.length) heap.push({ value: list[0], listIndex, index: 0 });
    });
    while (heap.size) {
      const item = heap.pop();
      output.push(item.value);
      record(`Append ${item.value} from list ${item.listIndex + 1}.`, { sourceList: item.listIndex + 1 });
      const nextIndex = item.index + 1;
      if (nextIndex < data.lists[item.listIndex].length) {
        heap.push({ value: data.lists[item.listIndex][nextIndex], listIndex: item.listIndex, index: nextIndex });
      }
    }
    return finish("All list heads have been merged in sorted order.", output);
  }

  if (kind === "last-stone-weight") {
    heap = new Heap(maxHeap);
    for (const stone of data.stones) heap.push(stone);
    validate(data.stones, "stones");
    while (heap.size > 1) {
      const first = heap.pop();
      const second = heap.pop();
      if (first !== second) heap.push(first - second);
      record(`Smash ${first} and ${second}${first !== second ? `; add ${first - second}` : "; both are destroyed"}.`);
    }
    return finish("The last stone weight is ready.", heap.peek() || 0);
  }

  if (kind === "kth-largest-element-in-a-stream") {
    validate(data.nums.concat(data.addValues), "stream");
    if (data.k < 1 || data.k > 100) throw new Error("k must be between 1 and 100.");
    for (const value of data.nums) {
      heap.push(value);
      if (heap.size > data.k) heap.pop();
      record(`Load initial value ${value} into the bounded heap.`, { kthLargest: heap.peek() ?? "-" });
    }
    const answers = [];
    for (const value of data.addValues) {
      heap.push(value);
      if (heap.size > data.k) heap.pop();
      answers.push(heap.peek());
      record(`Add ${value}; maintain the largest ${data.k} values.`, { kthLargest: heap.peek() ?? "-" });
    }
    return finish("The kth-largest result after each stream insertion is ready.", answers);
  }

  if (kind === "task-scheduler") {
    validate(data.tasks, "tasks");
    const counts = new Map();
    data.tasks.forEach((task) => counts.set(task, (counts.get(task) || 0) + 1));
    heap = new Heap((a, b) => a.count > b.count);
    for (const [task, count] of counts) heap.push({ task, count });
    const cooldown = [];
    let time = 0;
    while (heap.size || cooldown.length) {
      time += 1;
      const readyIndex = cooldown.findIndex((item) => item.availableAt <= time);
      if (readyIndex >= 0) heap.push(cooldown.splice(readyIndex, 1)[0]);
      if (heap.size) {
        const item = heap.pop();
        output.push(item.task);
        item.count -= 1;
        if (item.count) cooldown.push({ ...item, availableAt: time + data.n + 1 });
        record(`At time ${time}, run ${item.task}.`, { time, cooldown: cooldown.map((entry) => entry.task) });
      } else {
        output.push("idle");
        record(`At time ${time}, no task is ready; CPU idles.`, { time, cooldown: cooldown.map((entry) => entry.task) });
      }
    }
    return finish(`All tasks finish in ${time} time units.`, time);
  }

  if (kind === "reorganize-string") {
    const text = data.s;
    if (text.length > 100) throw new Error("The visualizer supports strings up to 100 characters.");
    const counts = new Map();
    for (const char of text) counts.set(char, (counts.get(char) || 0) + 1);
    heap = new Heap((a, b) => a.count > b.count);
    for (const [char, count] of counts) heap.push({ char, count });
    let previous = null;
    let answer = "";
    while (heap.size) {
      const current = heap.pop();
      answer += current.char;
      current.count -= 1;
      if (previous && previous.count > 0) heap.push(previous);
      previous = current.count > 0 ? current : null;
      record(`Place ${current.char}; hold it out of the heap for the next turn.`, { output: answer });
    }
    if (previous?.count > 0) answer = "";
    return finish(answer ? "The characters are separated successfully." : "No valid rearrangement exists.", JSON.stringify(answer));
  }

  if (kind === "sort-characters-by-frequency") {
    const text = data.s;
    if (text.length > 100) throw new Error("The visualizer supports strings up to 100 characters.");
    const counts = new Map();
    for (const char of text) counts.set(char, (counts.get(char) || 0) + 1);
    heap = new Heap((a, b) => a.count > b.count);
    for (const [char, count] of counts) heap.push({ char, count });
    let answer = "";
    while (heap.size) {
      const item = heap.pop();
      answer += item.char.repeat(item.count);
      record(`Append ${item.char} ${item.count} time${item.count === 1 ? "" : "s"}.`, { frequency: item.count, output: answer });
    }
    return finish("Characters are ordered by frequency.", JSON.stringify(answer));
  }

  if (kind === "meeting-rooms-ii") {
    validate(data.intervals, "intervals");
    data.intervals.sort((a, b) => a[0] - b[0]);
    for (const [start, end] of data.intervals) {
      if (heap.size && heap.peek() <= start) heap.pop();
      heap.push(end);
      record(`Schedule meeting [${start}, ${end}].`, { activeRooms: heap.size });
    }
    return finish("The largest number of simultaneous rooms is the answer.", heap.size);
  }

  if (kind === "smallest-range-covering-elements-from-k-lists") {
    const lists = data.nums;
    validate(lists, "lists", 20);
    if (!lists.length || lists.some((list) => !list.length || list.length > 50)) throw new Error("Provide up to 20 non-empty lists of at most 50 values.");
    heap = new Heap((a, b) => a.value < b.value);
    let maximum = -Infinity;
    lists.forEach((list, listIndex) => {
      heap.push({ value: list[0], listIndex, index: 0 });
      maximum = Math.max(maximum, list[0]);
    });
    let best = [-Infinity, Infinity];
    while (heap.size === lists.length) {
      const item = heap.pop();
      if (maximum - item.value < best[1] - best[0] ||
        (maximum - item.value === best[1] - best[0] && item.value < best[0])) best = [item.value, maximum];
      record(`Candidate range [${item.value}, ${maximum}].`, { bestRange: best.join("–") });
      const index = item.index + 1;
      if (index >= lists[item.listIndex].length) break;
      const value = lists[item.listIndex][index];
      maximum = Math.max(maximum, value);
      heap.push({ value, listIndex: item.listIndex, index });
    }
    return finish(`The smallest covering range is [${best[0]}, ${best[1]}].`, best);
  }

  if (kind === "find-k-pairs-with-smallest-sums") {
    validate(data.nums1, "nums1");
    validate(data.nums2, "nums2");
    const count = Math.min(data.k, 100);
    if (!data.nums1.length || !data.nums2.length || data.k < 1 || data.k > data.nums1.length * data.nums2.length) throw new Error("Provide non-empty arrays and a valid k.");
    heap = new Heap((a, b) => a.sum < b.sum);
    for (let index = 0; index < Math.min(data.nums1.length, count); index += 1) {
      heap.push({ i: index, j: 0, sum: data.nums1[index] + data.nums2[0] });
    }
    while (output.length < count && heap.size) {
      const item = heap.pop();
      output.push([data.nums1[item.i], data.nums2[item.j]]);
      if (item.j + 1 < data.nums2.length) {
        const j = item.j + 1;
        heap.push({ i: item.i, j, sum: data.nums1[item.i] + data.nums2[j] });
      }
      record(`Select pair [${data.nums1[item.i]}, ${data.nums2[item.j]}] with sum ${item.sum}.`, { sum: item.sum });
    }
    return finish("The smallest-sum pairs have been selected.", output);
  }

  if (kind === "seat-reservation-manager") {
    const seatCount = readNumber(input, "n");
    const operations = data.operations;
    if (seatCount < 1 || seatCount > 100 || operations.length > 200) throw new Error("The visualizer supports up to 100 seats and 200 operations.");
    for (let seat = 1; seat <= seatCount; seat += 1) heap.push(seat);
    for (let index = 0; index < operations.length; index += 1) {
      const operation = operations[index];
      if (operation === "SeatManager") {
        output.push(null);
        record(`Initialize the available-seat heap with seats 1 through ${seatCount}.`);
        continue;
      }
      const match = String(operation).match(/^(reserve|unreserve)(?:\s+(\d+))?$/);
      if (!match) throw new Error(`Unsupported seat operation: ${operation}`);
      if (match[1] === "reserve") {
        const seat = heap.pop();
        output.push(seat);
        record(`Reserve the smallest available seat, ${seat}.`);
      } else {
        const seat = Number(match[2] ?? data.arguments[index]?.[0]);
        if (!Number.isInteger(seat) || seat < 1 || seat > seatCount) throw new Error("unreserve requires a valid seat number.");
        heap.push(seat);
        output.push(null);
        record(`Return seat ${seat} to the available-seat heap.`);
      }
    }
    return finish("All seat operations are complete.", output);
  }

  if (kind === "take-gifts-from-the-richest-pile") {
    validate(data.gifts, "gifts");
    heap = new Heap(maxHeap);
    for (const pile of data.gifts) heap.push(pile);
    if (data.k < 1 || data.k > 1000) throw new Error("k must be between 1 and 1000.");
    for (let index = 0; index < data.k; index += 1) {
      const pile = heap.pop();
      const remaining = Math.floor(Math.sqrt(pile));
      heap.push(remaining);
      record(`Replace largest pile ${pile} with floor(sqrt(${pile})) = ${remaining}.`, { operation: index + 1 });
    }
    return finish("Sum the remaining gift piles.", heap.values.reduce((sum, pile) => sum + pile, 0));
  }

  if (kind === "furthest-building-you-can-reach") {
    validate(data.heights, "heights");
    let bricks = data.bricks;
    for (let index = 0; index < data.heights.length - 1; index += 1) {
      const climb = data.heights[index + 1] - data.heights[index];
      if (climb > 0) {
        heap.push(climb);
        if (heap.size > data.ladders) bricks -= heap.pop();
      }
      record(`Move from building ${index} to ${index + 1}.`, { climb: Math.max(0, climb), bricks, ladders: data.ladders });
      if (bricks < 0) return finish(`Cannot reach building ${index + 1}; stop at ${index}.`, index);
    }
    return finish("Every building is reachable.", data.heights.length - 1);
  }

  if (kind === "maximum-subsequence-score") {
    validate(data.nums1, "nums1");
    if (data.nums1.length !== data.nums2.length || data.k < 1 || data.k > data.nums1.length) throw new Error("The arrays must have equal length and k must be valid.");
    const pairs = data.nums1.map((value, index) => ({ value, factor: data.nums2[index] })).sort((a, b) => b.factor - a.factor);
    heap = new Heap(minHeap);
    let sum = 0;
    let best = -Infinity;
    for (const pair of pairs) {
      heap.push(pair.value);
      sum += pair.value;
      if (heap.size > data.k) sum -= heap.pop();
      if (heap.size === data.k) best = Math.max(best, sum * pair.factor);
      record(`Use ${pair.factor} as the minimum multiplier.`, { selectedSum: sum, score: heap.size === data.k ? sum * pair.factor : "-" });
    }
    return finish("The maximum subsequence score is found.", best);
  }

  if (kind === "minimum-cost-to-hire-k-workers") {
    validate(data.quality, "quality");
    if (data.quality.length !== data.wage.length || data.k < 1 || data.k > data.quality.length) throw new Error("quality and wage must have equal lengths and k must be valid.");
    const workers = data.quality.map((quality, index) => ({ quality, ratio: data.wage[index] / quality })).sort((a, b) => a.ratio - b.ratio);
    heap = new Heap(maxHeap);
    let qualitySum = 0;
    let best = Infinity;
    for (const worker of workers) {
      heap.push(worker.quality);
      qualitySum += worker.quality;
      if (heap.size > data.k) qualitySum -= heap.pop();
      if (heap.size === data.k) best = Math.min(best, qualitySum * worker.ratio);
      record(`Consider pay rate ${worker.ratio.toFixed(2)} per quality unit.`, { qualitySum, cost: heap.size === data.k ? (qualitySum * worker.ratio).toFixed(5) : "-" });
    }
    return finish("The minimum hiring cost is found.", best.toFixed(5));
  }

  if (kind === "ipo") {
    if (data.profits.length !== data.capital.length || data.profits.length > VALUE_LIMIT) throw new Error("profits and capital must have equal lengths within the visualizer limit.");
    const projects = data.profits.map((profit, index) => ({ profit, required: data.capital[index] })).sort((a, b) => a.required - b.required);
    heap = new Heap((a, b) => a.profit > b.profit);
    let capital = data.w;
    let index = 0;
    for (let chosen = 0; chosen < data.k; chosen += 1) {
      while (index < projects.length && projects[index].required <= capital) heap.push(projects[index++]);
      if (!heap.size) break;
      const project = heap.pop();
      capital += project.profit;
      record(`Complete an affordable project for profit ${project.profit}.`, { capital, projectsCompleted: chosen + 1 });
    }
    return finish("Project selection is complete.", capital);
  }

  throw new Error("No heap visualization is registered for this question.");
}

export function buildHeapTrace(slug, input) {
  return trace(slug, input);
}
