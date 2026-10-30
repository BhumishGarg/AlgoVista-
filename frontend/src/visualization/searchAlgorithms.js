const FRAME_LIMIT = 240;
const INPUT_LIMIT = 100;

function readArray(input, name, fallback = null) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=`, "i"));
  if (!match) {
    if (fallback !== null) return fallback;
    throw new Error(`Enter ${name} = [values].`);
  }
  const start = input.indexOf("[", match.index + match[0].length);
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
    } else if (char === '"') quoted = true;
    else if (char === "[") depth += 1;
    else if (char === "]" && --depth === 0) { end = index + 1; break; }
  }
  if (end < 0) throw new Error(`Close the ${name} array with ].`);
  try { return JSON.parse(input.slice(start, end)); }
  catch { throw new Error(`${name} must use valid JSON array syntax.`); }
}

function readNumber(input, name, fallback = null) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*(-?\\d+)`, "i"));
  if (!match) {
    if (fallback !== null) return fallback;
    throw new Error(`Enter ${name} = integer.`);
  }
  const value = Number(match[1]);
  if (!Number.isSafeInteger(value)) throw new Error(`${name} must be a safe integer.`);
  return value;
}

function checkArray(values, name, limit = INPUT_LIMIT, allowEmpty = false) {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0) || values.length > limit ||
    values.some((value) => !Number.isSafeInteger(value))) {
    throw new Error(`${name} must contain ${allowEmpty ? "up to" : "1 to"} ${limit} integer values.`);
  }
}

function checkSorted(values, name) {
  if (values.some((value, index) => index > 0 && value < values[index - 1])) {
    throw new Error(`${name} must be sorted in ascending order.`);
  }
}

function frame(state, message, fields = {}) {
  return {
    message,
    array: [...(state.array || [])],
    secondArray: [...(state.secondArray || [])],
    matrix: state.matrix?.map((row) => [...row]) || null,
    active: fields.active || [],
    left: fields.left ?? null,
    right: fields.right ?? null,
    mid: fields.mid ?? null,
    variables: fields.variables || {},
    result: null,
  };
}

function finish(frames, state, message, result, fields = {}) {
  const resultText = typeof result === "string" ? result : JSON.stringify(result);
  const last = frame(state, message, { ...fields, variables: fields.variables || {}, });
  last.result = resultText;
  frames.push(last);
  return {
    frames: frames.length <= FRAME_LIMIT ? frames : [...frames.slice(0, FRAME_LIMIT - 1), frames.at(-1)],
    result: resultText,
  };
}

function lowerBound(array, target, frames, state, upper = false) {
  let left = 0;
  let right = array.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    const condition = upper ? array[mid] <= target : array[mid] < target;
    frames.push(frame(state, `Compare nums[${mid}] = ${array[mid]} with ${target}.`, {
      left, right: right - 1, mid, active: [mid], variables: { left, right, mid, boundary: upper ? "upper" : "lower" },
    }));
    if (condition) left = mid + 1;
    else right = mid;
  }
  return left;
}

function run(slug, input) {
  const kind = slug.replace(/^searching-/, "");
  const frames = [];
  let array = [];
  let secondArray = [];
  let matrix = null;
  const state = { get array() { return array; }, get secondArray() { return secondArray; }, get matrix() { return matrix; } };
  const record = (message, fields = {}) => frames.push(frame(state, message, fields));

  if (kind === "median-of-two-sorted-arrays") {
    array = readArray(input, "nums1"); secondArray = readArray(input, "nums2");
    checkArray(array, "nums1", INPUT_LIMIT, true); checkArray(secondArray, "nums2", INPUT_LIMIT, true);
    checkSorted(array, "nums1"); checkSorted(secondArray, "nums2");
    if (!array.length && !secondArray.length) throw new Error("At least one input array must contain a value.");
    let a = array; let b = secondArray;
    if (a.length > b.length) { [a, b] = [b, a]; }
    const half = Math.floor((a.length + b.length + 1) / 2);
    let left = 0; let right = a.length;
    while (left <= right) {
      const i = left + Math.floor((right - left) / 2);
      const j = half - i;
      const leftA = i === 0 ? -Infinity : a[i - 1];
      const rightA = i === a.length ? Infinity : a[i];
      const leftB = j === 0 ? -Infinity : b[j - 1];
      const rightB = j === b.length ? Infinity : b[j];
      record(`Partition nums1 after ${i} values and nums2 after ${j} values.`, {
        left, right, mid: i, active: [i - 1, i].filter((x) => x >= 0 && x < a.length),
        variables: { partitionA: i, partitionB: j, leftA, rightA, leftB, rightB },
      });
      if (leftA <= rightB && leftB <= rightA) {
        const median = (a.length + b.length) % 2
          ? Math.max(leftA, leftB)
          : (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2;
        return finish(frames, state, "The sorted-array partition gives the median.", median);
      }
      if (leftA > rightB) right = i - 1;
      else left = i + 1;
    }
    throw new Error("The input arrays must be sorted.");
  }

  if (kind === "search-a-2d-matrix" || kind === "search-a-2d-matrix-ii") {
    matrix = readArray(input, "matrix");
    const target = readNumber(input, "target");
    const maxDimension = 20;
    if (!Array.isArray(matrix) || !matrix.length || matrix.length > maxDimension ||
      !Array.isArray(matrix[0]) || !matrix[0].length || matrix[0].length > maxDimension ||
      matrix.some((row) => !Array.isArray(row) || row.length !== matrix[0].length ||
        row.some((value) => !Number.isSafeInteger(value)))) {
      throw new Error(`matrix must be rectangular with dimensions from 1 to ${maxDimension}.`);
    }
    const rows = matrix.length; const cols = matrix[0].length;
    if (kind === "search-a-2d-matrix") {
      let left = 0; let right = rows * cols - 1;
      while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const row = Math.floor(mid / cols); const col = mid % cols; const value = matrix[row][col];
        record(`Compare matrix[${row}][${col}] = ${value} with ${target}.`, {
          left, right, mid, active: [row * cols + col], variables: { row, col, target, left, right },
        });
        if (value === target) return finish(frames, state, "Target found in the matrix.", true, { active: [row * cols + col] });
        if (value < target) left = mid + 1; else right = mid - 1;
      }
      return finish(frames, state, "Target is not in the matrix.", false);
    }
    let row = 0; let col = cols - 1;
    while (row < rows && col >= 0) {
      const value = matrix[row][col];
      record(`Compare matrix[${row}][${col}] = ${value} with ${target}.`, {
        left: col, right: row, mid: col, active: [row * cols + col], variables: { row, col, target },
      });
      if (value === target) return finish(frames, state, "Target found in the matrix.", true, { active: [row * cols + col] });
      if (value > target) col -= 1; else row += 1;
    }
    return finish(frames, state, "Target is not in the matrix.", false);
  }

  if (kind === "capacity-to-ship-packages-within-d-days" ||
      kind === "koko-eating-bananas" ||
      kind === "minimum-number-of-days-to-make-m-bouquets" ||
      kind === "split-array-largest-sum") {
    const fieldName = kind === "capacity-to-ship-packages-within-d-days" ? "weights"
      : kind === "koko-eating-bananas" ? "piles"
        : kind === "minimum-number-of-days-to-make-m-bouquets" ? "bloomDay" : "nums";
    array = readArray(input, fieldName);
    checkArray(array, fieldName);
    const k = kind === "split-array-largest-sum" ? readNumber(input, "k") : null;
    const days = kind === "capacity-to-ship-packages-within-d-days" ? readNumber(input, "days")
      : kind === "koko-eating-bananas" ? readNumber(input, "h")
        : kind === "minimum-number-of-days-to-make-m-bouquets" ? null : null;
    const m = kind === "minimum-number-of-days-to-make-m-bouquets" ? readNumber(input, "m") : null;
    const bouquetSize = kind === "minimum-number-of-days-to-make-m-bouquets" ? readNumber(input, "k") : null;
    if (kind === "capacity-to-ship-packages-within-d-days" && (days < 1 || days > array.length)) throw new Error("days must be between 1 and the number of packages.");
    if (kind === "koko-eating-bananas" && days < array.length) throw new Error("h must be at least the number of piles.");
    if (kind === "minimum-number-of-days-to-make-m-bouquets" && m * bouquetSize > array.length) return finish(frames, state, "There are not enough flowers to make the requested bouquets.", -1);
    if (kind === "split-array-largest-sum" && (k < 1 || k > array.length)) throw new Error("k must be between 1 and nums.length.");
    let left;
    let right;
    if (kind === "capacity-to-ship-packages-within-d-days" || kind === "split-array-largest-sum") {
      if (array.some((value) => value < 0)) throw new Error("Weights and array values must be non-negative.");
      left = Math.max(...array); right = array.reduce((sum, value) => sum + value, 0);
    } else if (kind === "koko-eating-bananas") {
      if (array.some((value) => value <= 0)) throw new Error("Every pile must contain a positive number of bananas.");
      left = 1; right = Math.max(...array);
    } else {
      if (array.some((value) => value <= 0) || m < 1 || bouquetSize < 1) throw new Error("Bloom days, m, and k must be positive integers.");
      left = Math.min(...array); right = Math.max(...array);
    }
    const feasible = (candidate) => {
      if (kind === "capacity-to-ship-packages-within-d-days") {
        let usedDays = 1; let load = 0;
        for (const weight of array) { if (load + weight > candidate) { usedDays += 1; load = 0; } load += weight; }
        return usedDays <= days;
      }
      if (kind === "koko-eating-bananas") return array.reduce((hours, pile) => hours + Math.ceil(pile / candidate), 0) <= days;
      if (kind === "split-array-largest-sum") {
        let parts = 1; let sum = 0;
        for (const value of array) { if (sum + value > candidate) { parts += 1; sum = 0; } sum += value; }
        return parts <= k;
      }
      let bouquets = 0; let consecutive = 0;
      for (const bloom of array) {
        if (bloom <= candidate) { consecutive += 1; if (consecutive === bouquetSize) { bouquets += 1; consecutive = 0; } }
        else consecutive = 0;
      }
      return bouquets >= m;
    };
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      const possible = feasible(mid);
      record(`Test candidate ${mid}: ${possible ? "feasible" : "not feasible"}.`, { left, right, mid, variables: { candidate: mid, feasible: possible } });
      if (possible) right = mid; else left = mid + 1;
    }
    if (kind === "minimum-number-of-days-to-make-m-bouquets" && !feasible(left)) return finish(frames, state, "No day can make the requested bouquets.", -1);
    return finish(frames, state, `The minimum feasible value is ${left}.`, left, { variables: { answer: left } });
  }

  const arrayName = kind === "peak-index-in-a-mountain-array" || kind === "find-k-closest-elements" ? "arr" : "nums";
  const scalarOnly = kind === "guess-number-higher-or-lower" || kind === "sqrt-x" || kind === "valid-perfect-square";
  array = scalarOnly ? [] : readArray(input, arrayName);
  if (!scalarOnly) checkArray(array, arrayName, INPUT_LIMIT, kind === "find-first-and-last-position" || kind === "search-insert-position");
  if (["binary-search", "find-first-and-last-position", "find-k-closest-elements", "search-insert-position"].includes(kind)) checkSorted(array, arrayName);
  const target = ["binary-search", "find-first-and-last-position", "search-insert-position",
    "search-in-rotated-sorted-array", "search-in-rotated-sorted-array-ii"].includes(kind)
    ? readNumber(input, "target") : 0;

  if (kind === "search-insert-position") {
    let left = 0; let right = array.length;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      record(`Compare nums[${mid}] = ${array[mid]} with ${target}.`, { left, right: right - 1, mid, active: [mid], variables: { left, right, mid } });
      if (array[mid] < target) left = mid + 1;
      else right = mid;
    }
    if (array[left] === target) return finish(frames, state, "Target found.", left, { active: [left] });
    return finish(frames, state, `Insert target at index ${left}.`, left, { left, right: left - 1 });
  }

  if (kind === "binary-search") {
    let left = 0; let right = array.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      record(`Compare nums[${mid}] = ${array[mid]} with ${target}.`, { left, right, mid, active: [mid], variables: { left, right, mid } });
      if (array[mid] === target) return finish(frames, state, "Target found.", mid, { active: [mid] });
      if (array[mid] < target) left = mid + 1; else right = mid - 1;
    }
    return finish(frames, state, "Target is absent.", -1, { left, right });
  }

  if (kind === "find-first-and-last-position") {
    const first = lowerBound(array, target, frames, state);
    if (first === array.length || array[first] !== target) return finish(frames, state, "Target is absent.", [-1, -1]);
    const last = lowerBound(array, target, frames, state, true) - 1;
    return finish(frames, state, `Target occupies indices ${first} through ${last}.`, [first, last], { active: [first, last] });
  }

  if (kind === "find-k-closest-elements") {
    const k = readNumber(input, "k"); const x = readNumber(input, "x");
    if (k < 1 || k > array.length) throw new Error("k must be between 1 and arr.length.");
    let left = 0; let right = array.length - k;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      const leftDistance = x - array[mid]; const rightDistance = array[mid + k] - x;
      record(`Compare outside values ${array[mid]} and ${array[mid + k]} to x=${x}.`, {
        left, right, mid, active: [mid, mid + k], variables: { leftDistance, rightDistance, windowSize: k },
      });
      if (leftDistance > rightDistance) left = mid + 1; else right = mid;
    }
    return finish(frames, state, "The closest-element window is selected.", array.slice(left, left + k), { left, right: left + k - 1 });
  }

  if (kind === "find-minimum-in-rotated-sorted-array" || kind === "find-minimum-in-rotated-sorted-array-ii") {
    if (!array.length) throw new Error("nums cannot be empty.");
    let left = 0; let right = array.length - 1;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      record(`Compare nums[${mid}] = ${array[mid]} with nums[${right}] = ${array[right]}.`, { left, right, mid, active: [mid, right] });
      if (array[mid] < array[right]) right = mid;
      else if (array[mid] > array[right]) left = mid + 1;
      else right -= 1;
    }
    return finish(frames, state, `The minimum is nums[${left}] = ${array[left]}.`, array[left], { left, right, active: [left] });
  }

  if (kind === "find-peak-element" || kind === "peak-index-in-a-mountain-array") {
    if (!array.length) throw new Error("The array cannot be empty.");
    let left = 0; let right = array.length - 1;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      record(`Compare nums[${mid}] = ${array[mid]} with nums[${mid + 1}] = ${array[mid + 1]}.`, { left, right, mid, active: [mid, mid + 1] });
      if (array[mid] < array[mid + 1]) left = mid + 1; else right = mid;
    }
    return finish(frames, state, `A peak is at index ${left}.`, left, { left, right, active: [left] });
  }

  if (kind === "guess-number-higher-or-lower") {
    const n = readNumber(input, "n"); const pick = readNumber(input, "pick");
    if (n < 1 || pick < 1 || pick > n) throw new Error("pick must be between 1 and n.");
    let left = 1; let right = n;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const feedback = mid === pick ? "correct" : mid > pick ? "too high" : "too low";
      record(`Guess ${mid}: ${feedback}.`, { left, right, mid, active: [], variables: { guess: mid, feedback } });
      if (mid === pick) return finish(frames, state, "The hidden number is found.", mid, { active: [] });
      if (mid > pick) right = mid - 1; else left = mid + 1;
    }
  }

  if (kind === "sqrt-x" || kind === "valid-perfect-square") {
    const value = readNumber(input, kind === "sqrt-x" ? "x" : "num");
    if (value < 0 || (kind === "valid-perfect-square" && value < 1)) throw new Error("Provide a non-negative integer (positive for perfect-square checks).");
    let left = 0; let right = value;
    if (kind === "valid-perfect-square") left = 1;
    let floor = 0;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const quotient = mid === 0 ? 0 : Math.floor(value / mid);
      const isExact = mid > 0 && mid === quotient && value % mid === 0;
      const comparison = mid === 0 ? (value === 0 ? 0 : -1) : isExact ? 0 : mid <= quotient ? -1 : 1;
      record(`Test candidate root ${mid}.`, { left, right, mid, active: [mid], variables: { candidate: mid, comparison } });
      if (comparison === 0) {
        if (kind === "valid-perfect-square") return finish(frames, state, `${value} is a perfect square.`, true, { active: [mid] });
        floor = mid; break;
      }
      if (comparison < 0) { floor = mid; left = mid + 1; } else right = mid - 1;
    }
    return kind === "valid-perfect-square"
      ? finish(frames, state, `${value} is not a perfect square.`, false)
      : finish(frames, state, `The integer square root of ${value} is ${floor}.`, floor);
  }

  if (kind === "search-in-rotated-sorted-array" || kind === "search-in-rotated-sorted-array-ii") {
    const allowDuplicates = kind.endsWith("-ii");
    let left = 0; let right = array.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      record(`Inspect nums[${mid}] = ${array[mid]}.`, { left, right, mid, active: [mid], variables: { target, left, right } });
      if (array[mid] === target) return finish(frames, state, "Target found.", allowDuplicates ? true : mid, { active: [mid] });
      if (allowDuplicates && array[left] === array[mid] && array[mid] === array[right]) { left += 1; right -= 1; continue; }
      if (array[left] <= array[mid]) {
        if (array[left] <= target && target < array[mid]) right = mid - 1; else left = mid + 1;
      } else if (array[mid] < target && target <= array[right]) left = mid + 1;
      else right = mid - 1;
    }
    return finish(frames, state, "Target is absent.", allowDuplicates ? false : -1);
  }

  throw new Error("No search visualization is registered for this question.");
}

export function buildSearchTrace(slug, input) {
  return run(slug, input);
}
