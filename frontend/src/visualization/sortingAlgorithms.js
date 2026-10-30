const FRAME_LIMIT = 240;
const INPUT_LIMIT = 100;

function readArray(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=`, "i"));
  if (!match) throw new Error(`Enter ${name} = [values].`);
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

function readNumber(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*(-?\\d+)`, "i"));
  if (!match) throw new Error(`Enter ${name} = integer.`);
  const value = Number(match[1]);
  if (!Number.isSafeInteger(value)) throw new Error(`${name} must be a safe integer.`);
  return value;
}

function readString(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*("(?:[^"\\\\]|\\\\.)*")`, "i"));
  if (!match) throw new Error(`Enter ${name} = "string".`);
  try {
    const value = JSON.parse(match[1]);
    if (typeof value !== "string") throw new Error();
    return value;
  } catch {
    throw new Error(`${name} must be a valid quoted string.`);
  }
}

function validateValues(values, name, max = INPUT_LIMIT, allowEmpty = false) {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0) || values.length > max ||
    values.some((value) => !Number.isSafeInteger(value))) {
    throw new Error(`${name} must contain ${allowEmpty ? "up to" : "1 to"} ${max} integer values.`);
  }
}

function validateIntervals(values, name, allowEmpty = false) {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0) || values.length > INPUT_LIMIT ||
    values.some((value) => !Array.isArray(value) || value.length !== 2 ||
      !value.every(Number.isSafeInteger) || value[0] > value[1])) {
    throw new Error(`${name} must contain up to ${INPUT_LIMIT} [start,end] pairs with start <= end.`);
  }
}

function copy(values) {
  return values.map((value) => Array.isArray(value) ? [...value] : value);
}

function makeFrame(message, array, fields = {}) {
  return {
    message,
    array: copy(array),
    auxiliary: copy(fields.auxiliary || []),
    active: fields.active || [],
    variables: fields.variables || {},
    result: null,
  };
}

function finish(frames, array, message, result, fields = {}) {
  const resultText = JSON.stringify(result);
  const last = makeFrame(message, array, fields);
  last.result = resultText;
  frames.push(last);
  return {
    frames: frames.length <= FRAME_LIMIT ? frames : [...frames.slice(0, FRAME_LIMIT - 1), frames.at(-1)],
    result: resultText,
  };
}

function run(slug, input) {
  const kind = slug.replace(/^sorting-/, "");
  const frames = [];
  let array = [];
  const record = (message, fields = {}) => frames.push(makeFrame(message, array, fields));

  if (kind === "hand-of-straights") {
    array = readArray(input, "hand");
    validateValues(array, "hand");
    const groupSize = readNumber(input, "groupSize");
    if (groupSize < 1 || groupSize > array.length) throw new Error("groupSize must be between 1 and hand.length.");
    if (array.length % groupSize !== 0) return finish(frames, array, "The hand size is not divisible by groupSize.", false);
    const counts = new Map();
    for (const value of array) counts.set(value, (counts.get(value) || 0) + 1);
    const sorted = [...array].sort((a, b) => a - b);
    for (const start of sorted) {
      if (!counts.get(start)) continue;
      const frequency = counts.get(start);
      for (let offset = 0; offset < groupSize; offset += 1) {
        const value = start + offset;
        const available = counts.get(value) || 0;
        if (available < frequency) return finish(frames, sorted, `Cannot form enough copies of consecutive card ${value}.`, false, { variables: { start, groupSize, missing: value } });
        counts.set(value, available - frequency);
        record(`Use ${frequency} card(s) with value ${value} in groups starting at ${start}.`, {
          active: [sorted.indexOf(value)], variables: { start, groupSize, remaining: available - frequency },
        });
      }
    }
    return finish(frames, sorted, "All cards form consecutive groups.", true);
  }

  if (kind === "height-checker") {
    array = readArray(input, "heights");
    validateValues(array, "heights");
    const sorted = [...array].sort((a, b) => a - b);
    let mismatches = 0;
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] !== sorted[i]) mismatches += 1;
      record(`Compare height at index ${i} with its sorted position.`, { auxiliary: sorted, active: [i], variables: { mismatches } });
    }
    return finish(frames, array, `${mismatches} position(s) differ from sorted order.`, mismatches, { auxiliary: sorted });
  }

  if (kind === "insert-interval") {
    array = readArray(input, "intervals");
    const newInterval = readArray(input, "newInterval");
    validateIntervals(array, "intervals", true);
    if (!Array.isArray(newInterval) || newInterval.length !== 2 || !newInterval.every(Number.isSafeInteger) || newInterval[0] > newInterval[1]) throw new Error("newInterval must be a valid [start,end] pair.");
    let start = newInterval[0]; let end = newInterval[1];
    const output = [];
    for (const interval of array) {
      if (interval[1] < start) output.push([...interval]);
      else if (interval[0] > end) {
        const index = array.indexOf(interval);
        output.push([start, end], ...array.slice(index).map((item) => [...item]));
        return finish(frames, array, "Insert the merged interval before the remaining intervals.", output);
      } else {
        start = Math.min(start, interval[0]); end = Math.max(end, interval[1]);
        record(`Merge [${interval}] into the pending interval [${start},${end}].`, { active: [array.indexOf(interval)], variables: { start, end } });
      }
    }
    output.push([start, end]);
    return finish(frames, array, "Insert the merged interval after all earlier intervals.", output);
  }

  if (kind === "largest-number") {
    array = readArray(input, "nums");
    validateValues(array, "nums");
    if (array.some((value) => value < 0)) throw new Error("nums values must be non-negative.");
    const strings = array.map(String);
    const ordered = [...strings].sort((a, b) => {
      const left = a + b; const right = b + a;
      const comparison = left === right ? 0 : left > right ? -1 : 1;
      record(`Compare ${a}+${b} with ${b}+${a}.`, { auxiliary: strings, variables: { left, right } });
      return comparison;
    });
    const result = ordered.every((value) => value === "0") ? "0" : ordered.join("");
    return finish(frames, array, `Concatenate in custom order: ${result}.`, result, { auxiliary: ordered });
  }

  if (kind === "maximum-gap") {
    array = readArray(input, "nums");
    validateValues(array, "nums");
    if (array.length < 2) return finish(frames, array, "Fewer than two values have no adjacent gap.", 0);
    const minimum = Math.min(...array); const maximum = Math.max(...array);
    if (minimum === maximum) return finish(frames, array, "All values are equal, so the maximum gap is zero.", 0);
    const bucketSize = Math.max(1, Math.ceil((maximum - minimum) / (array.length - 1)));
    const buckets = Array.from({ length: Math.floor((maximum - minimum) / bucketSize) + 1 }, () => null);
    for (let index = 0; index < array.length; index += 1) {
      const value = array[index];
      const bucketIndex = Math.floor((value - minimum) / bucketSize);
      const bucket = buckets[bucketIndex] || [value, value];
      bucket[0] = Math.min(bucket[0], value);
      bucket[1] = Math.max(bucket[1], value);
      buckets[bucketIndex] = bucket;
      record(`Place ${value} in bucket ${bucketIndex}.`, { auxiliary: buckets, active: [index], variables: { bucketIndex, bucketSize } });
    }
    let gap = 0; let previousMaximum = minimum;
    for (const bucket of buckets) {
      if (!bucket) continue;
      gap = Math.max(gap, bucket[0] - previousMaximum);
      previousMaximum = bucket[1];
      record(`Compare this bucket's minimum against the previous non-empty bucket maximum.`, { auxiliary: buckets, variables: { previousMaximum, largestGap: gap } });
    }
    return finish(frames, array, `The largest adjacent gap is ${gap}.`, gap, { auxiliary: buckets });
  }

  if (["meeting-rooms", "meeting-rooms-ii", "merge-intervals", "minimum-number-of-arrows-to-burst-balloons", "non-overlapping-intervals"].includes(kind)) {
    const field = kind === "minimum-number-of-arrows-to-burst-balloons" ? "points" : "intervals";
    array = readArray(input, field);
    validateIntervals(array, field, kind === "meeting-rooms");
    const byStart = (a, b) => a[0] - b[0] || a[1] - b[1];
    if (kind === "meeting-rooms") {
      const sorted = [...array].sort(byStart);
      for (let i = 1; i < sorted.length; i += 1) {
        record(`Check whether meeting ${sorted[i]} overlaps its predecessor ${sorted[i - 1]}.`, { auxiliary: sorted, active: [i - 1, i] });
        if (sorted[i][0] < sorted[i - 1][1]) return finish(frames, array, "These meetings overlap.", false, { auxiliary: sorted, active: [i - 1, i] });
      }
      return finish(frames, array, "All meetings can be attended.", true, { auxiliary: sorted });
    }
    if (kind === "meeting-rooms-ii") {
      const sorted = [...array].sort(byStart);
      const roomEnds = [];
      let maximumRooms = 0;
      for (const meeting of sorted) {
        while (roomEnds.length && roomEnds[0] <= meeting[0]) roomEnds.shift();
        roomEnds.push(meeting[1]);
        roomEnds.sort((a, b) => a - b);
        maximumRooms = Math.max(maximumRooms, roomEnds.length);
        record(`Assign meeting [${meeting}] to a room.`, { auxiliary: roomEnds, active: [sorted.indexOf(meeting)], variables: { activeRooms: roomEnds.length, maximumRooms } });
      }
      return finish(frames, array, `${maximumRooms} room(s) are required.`, maximumRooms, { auxiliary: sorted });
    }
    if (kind === "merge-intervals") {
      const sorted = [...array].sort(byStart);
      const merged = [];
      for (const interval of sorted) {
        const last = merged.at(-1);
        if (!last || interval[0] > last[1]) merged.push([...interval]);
        else last[1] = Math.max(last[1], interval[1]);
        record(`Process interval [${interval}].`, { auxiliary: merged, active: [sorted.indexOf(interval)] });
      }
      return finish(frames, array, "All overlapping intervals are merged.", merged, { auxiliary: merged });
    }
    if (kind === "minimum-number-of-arrows-to-burst-balloons") {
      const sorted = [...array].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
      let arrows = 0; let arrow = -Infinity;
      for (const balloon of sorted) {
        const needsArrow = balloon[0] > arrow;
        if (needsArrow) { arrow = balloon[1]; arrows += 1; }
        record(`Inspect balloon [${balloon}]; ${needsArrow ? `shoot at ${arrow}` : `arrow at ${arrow} covers it`}.`, { auxiliary: sorted, active: [sorted.indexOf(balloon)], variables: { arrow, arrows } });
      }
      return finish(frames, array, `${arrows} arrow(s) burst all balloons.`, arrows, { auxiliary: sorted });
    }
    const sorted = [...array].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    let kept = 0; let end = -Infinity;
    for (const interval of sorted) {
      if (interval[0] >= end) { kept += 1; end = interval[1]; }
      record(`Inspect interval [${interval}].`, { auxiliary: sorted, active: [sorted.indexOf(interval)], variables: { kept, removed: sorted.indexOf(interval) + 1 - kept, lastEnd: end } });
    }
    return finish(frames, array, `${array.length - kept} interval(s) must be removed.`, array.length - kept, { auxiliary: sorted });
  }

  if (kind === "merge-sorted-array") {
    array = readArray(input, "nums1");
    const second = readArray(input, "nums2");
    const m = readNumber(input, "m"); const n = readNumber(input, "n");
    validateValues(array, "nums1", INPUT_LIMIT, true); validateValues(second, "nums2", INPUT_LIMIT, true);
    if (m < 0 || n < 0 || m + n < 1 || m + n !== array.length || n !== second.length || m > array.length) throw new Error("Array lengths must match m and n, with at least one total value.");
    if (array.slice(0, m).some((value, i, valid) => i > 0 && value < valid[i - 1]) || second.some((value, i) => i > 0 && value < second[i - 1])) throw new Error("The valid parts of nums1 and nums2 must be sorted.");
    array = [...array];
    let i = m - 1; let j = n - 1; let write = m + n - 1;
    while (j >= 0) {
      if (i >= 0 && array[i] > second[j]) array[write] = array[i--];
      else array[write] = second[j--];
      record(`Write ${array[write]} at index ${write}.`, { active: [write], variables: { i, j, write } });
      write -= 1;
    }
    return finish(frames, array, "The arrays have been merged into nums1.", array);
  }

  if (kind === "pancake-sorting") {
    array = readArray(input, "arr");
    validateValues(array, "arr");
    if (new Set(array).size !== array.length || array.some((value) => value < 1 || value > array.length)) throw new Error("arr must be a permutation of 1 through arr.length.");
    const flips = [];
    for (let size = array.length; size > 1; size -= 1) {
      let maxIndex = 0;
      for (let i = 1; i < size; i += 1) if (array[i] > array[maxIndex]) maxIndex = i;
      if (maxIndex === size - 1) continue;
      if (maxIndex > 0) {
        array = [...array.slice(0, maxIndex + 1).reverse(), ...array.slice(maxIndex + 1)];
        flips.push(maxIndex + 1);
        record(`Flip the first ${maxIndex + 1} values to move ${array[0]} to the front.`, { active: [0, maxIndex], variables: { flips: [...flips] } });
      }
      array = [...array.slice(0, size).reverse(), ...array.slice(size)];
      flips.push(size);
      record(`Flip the first ${size} values to place ${size} in its final position.`, { active: [size - 1], variables: { flips: [...flips] } });
    }
    return finish(frames, array, "The array is sorted by prefix reversals.", flips, { variables: { flips } });
  }

  if (kind === "relative-sort-array") {
    array = readArray(input, "arr1");
    const order = readArray(input, "arr2");
    validateValues(array, "arr1"); validateValues(order, "arr2");
    if (new Set(order).size !== order.length || order.some((value) => !array.includes(value))) throw new Error("arr2 values must be distinct and occur in arr1.");
    const counts = new Map();
    for (const value of array) counts.set(value, (counts.get(value) || 0) + 1);
    const result = [];
    for (const value of order) {
      const count = counts.get(value) || 0;
      for (let i = 0; i < count; i += 1) result.push(value);
      counts.delete(value);
      record(`Emit ${count} occurrence(s) of ${value} in arr2 order.`, { auxiliary: result, variables: { value, count } });
    }
    for (const value of [...counts.keys()].sort((a, b) => a - b)) {
      for (let i = 0; i < counts.get(value); i += 1) result.push(value);
    }
    return finish(frames, array, "Append remaining values in ascending order.", result, { auxiliary: result });
  }

  if (kind === "sort-colors") {
    array = readArray(input, "nums");
    validateValues(array, "nums");
    if (array.some((value) => value < 0 || value > 2)) throw new Error("nums may contain only 0, 1, and 2.");
    let low = 0; let mid = 0; let high = array.length - 1;
    while (mid <= high) {
      if (array[mid] === 0) {
        [array[low], array[mid]] = [array[mid], array[low]];
        record("Move 0 into the left region.", { active: [low, mid], variables: { low, mid, high } });
        low += 1; mid += 1;
      } else if (array[mid] === 2) {
        [array[mid], array[high]] = [array[high], array[mid]];
        record("Move 2 into the right region.", { active: [mid, high], variables: { low, mid, high } });
        high -= 1;
      } else {
        record("Keep 1 in the middle region.", { active: [mid], variables: { low, mid, high } });
        mid += 1;
      }
    }
    return finish(frames, array, "All colors are ordered.", array);
  }

  if (kind === "sort-even-and-odd-indices-independently") {
    array = readArray(input, "nums");
    validateValues(array, "nums");
    const even = array.filter((_, index) => index % 2 === 0).sort((a, b) => a - b);
    const odd = array.filter((_, index) => index % 2 === 1).sort((a, b) => b - a);
    let evenIndex = 0; let oddIndex = 0;
    array = array.map((_, index) => index % 2 === 0 ? even[evenIndex++] : odd[oddIndex++]);
    record("Sort the values separately within even and odd indices.", { auxiliary: [...even, ...odd] });
    return finish(frames, array, "Both index groups are sorted independently.", array);
  }

  if (kind === "sort-integers-by-the-number-of-1-bits") {
    array = readArray(input, "arr");
    validateValues(array, "arr");
    if (array.some((value) => value < 0)) throw new Error("arr values must be non-negative.");
    const bits = (value) => { let count = 0; while (value) { count += value & 1; value >>>= 1; } return count; };
    const ordered = [...array].sort((a, b) => bits(a) - bits(b) || a - b);
    ordered.forEach((value, index) => record(`Place ${value} with ${bits(value)} set bit(s) in sorted order.`, { auxiliary: ordered, active: [index], variables: { value, setBits: bits(value) } }));
    return finish(frames, array, "Values are ordered by set-bit count, then numeric value.", ordered, { auxiliary: ordered });
  }

  if (kind === "sort-vowels-in-a-string") {
    const value = readString(input, "s");
    if (!value.length || value.length > INPUT_LIMIT || !/^[A-Za-z]+$/.test(value)) throw new Error(`s must contain 1 to ${INPUT_LIMIT} English letters.`);
    array = [...value];
    const isVowel = (char) => "aeiouAEIOU".includes(char);
    const vowels = array.filter(isVowel).sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
    let vowelIndex = 0;
    const result = array.map((char, index) => {
      if (!isVowel(char)) return char;
      const next = vowels[vowelIndex++];
      record(`Replace vowel at index ${index} with ${next}.`, { auxiliary: vowels, active: [index], variables: { nextVowel: next } });
      return next;
    }).join("");
    return finish(frames, [...value], "Vowels are sorted by ASCII order.", result, { auxiliary: vowels });
  }

  if (kind === "sort-an-array") {
    array = readArray(input, "nums");
    validateValues(array, "nums");
    const initial = [...array];
    const mergeSort = (values) => {
      if (values.length < 2) return values;
      const middle = Math.floor(values.length / 2);
      const left = mergeSort(values.slice(0, middle));
      const right = mergeSort(values.slice(middle));
      const merged = [];
      let i = 0; let j = 0;
      while (i < left.length && j < right.length) {
        merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
        record("Merge the smaller front value into the sorted run.", { auxiliary: merged, variables: { leftRemaining: left.length - i, rightRemaining: right.length - j } });
      }
      merged.push(...left.slice(i), ...right.slice(j));
      return merged;
    };
    const sorted = mergeSort(initial);
    return finish(frames, initial, "Merge sort produced the ascending order.", sorted, { auxiliary: sorted });
  }

  if (kind === "sort-the-people") {
    const names = readArray(input, "names");
    const heights = readArray(input, "heights");
    if (!Array.isArray(names) || !names.length || names.length > INPUT_LIMIT || names.some((name) => typeof name !== "string" || !name.length) ||
      !Array.isArray(heights) || heights.length !== names.length || heights.some((height) => !Number.isSafeInteger(height))) throw new Error("names and heights must be valid arrays of equal length.");
    array = names.map((name, index) => [name, heights[index]]);
    const ordered = [...array].sort((a, b) => b[1] - a[1]);
    ordered.forEach((person, index) => record(`Place ${person[0]} with height ${person[1]} at rank ${index + 1}.`, { auxiliary: ordered, active: [index], variables: { name: person[0], height: person[1] } }));
    return finish(frames, array, "People are ordered from tallest to shortest.", ordered.map(([name]) => name), { auxiliary: ordered });
  }

  if (kind === "wiggle-sort-ii") {
    array = readArray(input, "nums");
    validateValues(array, "nums");
    const sorted = [...array].sort((a, b) => a - b);
    const middle = Math.ceil(array.length / 2);
    const smaller = sorted.slice(0, middle).reverse();
    const larger = sorted.slice(middle).reverse();
    const result = Array(array.length);
    for (let i = 0; i < array.length; i += 1) result[i] = i % 2 === 0 ? smaller[Math.floor(i / 2)] : larger[Math.floor(i / 2)];
    for (let i = 0; i < result.length; i += 1) {
      if ((i % 2 === 0 && i + 1 < result.length && result[i] >= result[i + 1]) ||
        (i % 2 === 1 && i + 1 < result.length && result[i] <= result[i + 1])) {
        throw new Error("These values do not admit a strict wiggle arrangement.");
      }
      record(`Place ${result[i]} at wiggle index ${i}.`, { auxiliary: sorted, active: [i], variables: { index: i, value: result[i] } });
    }
    return finish(frames, array, "The strict wiggle pattern is formed.", result, { auxiliary: sorted });
  }

  throw new Error("No sorting visualization is registered for this question.");
}

export function buildSortingTrace(slug, input) {
  return run(slug, input);
}
