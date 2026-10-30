const solutions = {
  "arrays-two-sum": {
    java: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[0];
}`,
    python: `def two_sum(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        need = target - value
        if need in seen:
            return [seen[need], i]
        seen[value] = i
    return []`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
  },
  "arrays-best-time-to-buy-and-sell-stock": {
    java: `int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE, best = 0;
    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        best = Math.max(best, price - minPrice);
    }
    return best;
}`,
    python: `def max_profit(prices):
    minimum, best = float("inf"), 0
    for price in prices:
        minimum = min(minimum, price)
        best = max(best, price - minimum)
    return best`,
    cpp: `int maxProfit(vector<int>& prices) {
    int minimum = INT_MAX, best = 0;
    for (int price : prices) {
        minimum = min(minimum, price);
        best = max(best, price - minimum);
    }
    return best;
}`,
  },
  "arrays-container-with-most-water": {
    java: `int maxArea(int[] height) {
    int left = 0, right = height.length - 1, best = 0;
    while (left < right) {
        best = Math.max(best, Math.min(height[left], height[right]) * (right - left));
        if (height[left] < height[right]) left++; else right--;
    }
    return best;
}`,
    python: `def max_area(height):
    left, right, best = 0, len(height) - 1, 0
    while left < right:
        best = max(best, min(height[left], height[right]) * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best`,
    cpp: `int maxArea(vector<int>& height) {
    int left = 0, right = (int)height.size() - 1, best = 0;
    while (left < right) {
        best = max(best, min(height[left], height[right]) * (right - left));
        if (height[left] < height[right]) ++left; else --right;
    }
    return best;
}`,
  },
  "arrays-find-all-numbers-disappeared-in-an-array": {
    java: `List<Integer> findDisappearedNumbers(int[] nums) {
    List<Integer> missing = new ArrayList<>();
    for (int value : nums) nums[Math.abs(value) - 1] = -Math.abs(nums[Math.abs(value) - 1]);
    for (int i = 0; i < nums.length; i++) if (nums[i] > 0) missing.add(i + 1);
    return missing;
}`,
    python: `def find_disappeared_numbers(nums):
    for value in nums:
        nums[abs(value) - 1] = -abs(nums[abs(value) - 1])
    return [i + 1 for i, value in enumerate(nums) if value > 0]`,
    cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    for (int value : nums) nums[abs(value) - 1] = -abs(nums[abs(value) - 1]);
    vector<int> missing;
    for (int i = 0; i < nums.size(); ++i) if (nums[i] > 0) missing.push_back(i + 1);
    return missing;
}`,
  },
  "arrays-find-the-duplicate-number": {
    java: `int findDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
    slow = nums[0];
    while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
    return slow;
}`,
    python: `def find_duplicate(nums):
    slow = fast = nums[0]
    while True:
        slow, fast = nums[slow], nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow, fast = nums[slow], nums[fast]
    return slow`,
    cpp: `int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
    slow = nums[0];
    while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
    return slow;
}`,
  },
  "arrays-longest-consecutive-sequence": {
    java: `int longestConsecutive(int[] nums) {
    Set<Integer> values = new HashSet<>();
    for (int x : nums) values.add(x);
    int best = 0;
    for (int x : values) if (!values.contains(x - 1)) {
        int end = x;
        while (values.contains(end + 1)) end++;
        best = Math.max(best, end - x + 1);
    }
    return best;
}`,
    python: `def longest_consecutive(nums):
    values, best = set(nums), 0
    for value in values:
        if value - 1 not in values:
            end = value
            while end + 1 in values:
                end += 1
            best = max(best, end - value + 1)
    return best`,
    cpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> values(nums.begin(), nums.end());
    int best = 0;
    for (int x : values) if (!values.count(x - 1)) {
        int end = x;
        while (values.count(end + 1)) ++end;
        best = max(best, end - x + 1);
    }
    return best;
}`,
  },
  "arrays-majority-element": {
    java: `int majorityElement(int[] nums) {
    int candidate = 0, count = 0;
    for (int value : nums) {
        if (count == 0) candidate = value;
        count += value == candidate ? 1 : -1;
    }
    return candidate;
}`,
    python: `def majority_element(nums):
    candidate, count = 0, 0
    for value in nums:
        if count == 0:
            candidate = value
        count += 1 if value == candidate else -1
    return candidate`,
    cpp: `int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    for (int value : nums) {
        if (count == 0) candidate = value;
        count += value == candidate ? 1 : -1;
    }
    return candidate;
}`,
  },
  "arrays-maximum-product-subarray": {
    java: `int maxProduct(int[] nums) {
    int high = nums[0], low = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] < 0) { int t = high; high = low; low = t; }
        high = Math.max(nums[i], high * nums[i]);
        low = Math.min(nums[i], low * nums[i]);
        best = Math.max(best, high);
    }
    return best;
}`,
    python: `def max_product(nums):
    high = low = best = nums[0]
    for value in nums[1:]:
        if value < 0:
            high, low = low, high
        high = max(value, high * value)
        low = min(value, low * value)
        best = max(best, high)
    return best`,
    cpp: `int maxProduct(vector<int>& nums) {
    int high = nums[0], low = nums[0], best = nums[0];
    for (int i = 1; i < nums.size(); ++i) {
        if (nums[i] < 0) swap(high, low);
        high = max(nums[i], high * nums[i]);
        low = min(nums[i], low * nums[i]);
        best = max(best, high);
    }
    return best;
}`,
  },
  "arrays-maximum-subarray": {
    java: `int maxSubArray(int[] nums) {
    int current = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        current = Math.max(nums[i], current + nums[i]);
        best = Math.max(best, current);
    }
    return best;
}`,
    python: `def max_sub_array(nums):
    current = best = nums[0]
    for value in nums[1:]:
        current = max(value, current + value)
        best = max(best, current)
    return best`,
    cpp: `int maxSubArray(vector<int>& nums) {
    int current = nums[0], best = nums[0];
    for (int i = 1; i < nums.size(); ++i) {
        current = max(nums[i], current + nums[i]);
        best = max(best, current);
    }
    return best;
}`,
  },
  "arrays-merge-sorted-array": {
    java: `void merge(int[] a, int m, int[] b, int n) {
    int i = m - 1, j = n - 1, write = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[write--] = a[i--];
        else a[write--] = b[j--];
    }
}`,
    python: `def merge(nums1, m, nums2, n):
    i, j, write = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[write] = nums1[i]
            i -= 1
        else:
            nums1[write] = nums2[j]
            j -= 1
        write -= 1`,
    cpp: `void merge(vector<int>& a, int m, vector<int>& b, int n) {
    int i = m - 1, j = n - 1, write = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[write--] = a[i--];
        else a[write--] = b[j--];
    }
}`,
  },
  "arrays-missing-number": {
    java: `int missingNumber(int[] nums) {
    int missing = nums.length;
    for (int i = 0; i < nums.length; i++) missing ^= i ^ nums[i];
    return missing;
}`,
    python: `def missing_number(nums):
    missing = len(nums)
    for i, value in enumerate(nums):
        missing ^= i ^ value
    return missing`,
    cpp: `int missingNumber(vector<int>& nums) {
    int missing = nums.size();
    for (int i = 0; i < nums.size(); ++i) missing ^= i ^ nums[i];
    return missing;
}`,
  },
  "arrays-move-zeroes": {
    java: `void moveZeroes(int[] nums) {
    int write = 0;
    for (int value : nums) if (value != 0) nums[write++] = value;
    while (write < nums.length) nums[write++] = 0;
}`,
    python: `def move_zeroes(nums):
    write = 0
    for value in nums:
        if value != 0:
            nums[write] = value
            write += 1
    nums[write:] = [0] * (len(nums) - write)`,
    cpp: `void moveZeroes(vector<int>& nums) {
    int write = 0;
    for (int value : nums) if (value != 0) nums[write++] = value;
    while (write < nums.size()) nums[write++] = 0;
}`,
  },
  "arrays-product-of-array-except-self": {
    java: `int[] productExceptSelf(int[] nums) {
    int[] answer = new int[nums.length];
    int prefix = 1;
    for (int i = 0; i < nums.length; i++) { answer[i] = prefix; prefix *= nums[i]; }
    int suffix = 1;
    for (int i = nums.length - 1; i >= 0; i--) { answer[i] *= suffix; suffix *= nums[i]; }
    return answer;
}`,
    python: `def product_except_self(nums):
    answer, prefix = [1] * len(nums), 1
    for i, value in enumerate(nums):
        answer[i], prefix = prefix, prefix * value
    suffix = 1
    for i in range(len(nums) - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer`,
    cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    vector<int> answer(nums.size(), 1);
    int prefix = 1;
    for (int i = 0; i < nums.size(); ++i) { answer[i] = prefix; prefix *= nums[i]; }
    int suffix = 1;
    for (int i = (int)nums.size() - 1; i >= 0; --i) { answer[i] *= suffix; suffix *= nums[i]; }
    return answer;
}`,
  },
  "arrays-remove-duplicates-from-sorted-array": {
    java: `int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;
    for (int read = 1; read < nums.length; read++)
        if (nums[read] != nums[write - 1]) nums[write++] = nums[read];
    return write;
}`,
    python: `def remove_duplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return write`,
    cpp: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int write = 1;
    for (int read = 1; read < nums.size(); ++read)
        if (nums[read] != nums[write - 1]) nums[write++] = nums[read];
    return write;
}`,
  },
  "arrays-remove-element": {
    java: `int removeElement(int[] nums, int val) {
    int write = 0;
    for (int value : nums) if (value != val) nums[write++] = value;
    return write;
}`,
    python: `def remove_element(nums, val):
    write = 0
    for value in nums:
        if value != val:
            nums[write] = value
            write += 1
    return write`,
    cpp: `int removeElement(vector<int>& nums, int val) {
    int write = 0;
    for (int value : nums) if (value != val) nums[write++] = value;
    return write;
}`,
  },
  "arrays-rotate-array": {
    java: `void rotate(int[] nums, int k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
}
void reverse(int[] a, int left, int right) {
    while (left < right) { int t = a[left]; a[left++] = a[right]; a[right--] = t; }
}`,
    python: `def rotate(nums, k):
    k %= len(nums)
    nums.reverse()
    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])`,
    cpp: `void rotate(vector<int>& nums, int k) {
    k %= nums.size();
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}`,
  },
  "arrays-sort-colors": {
    java: `void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) { int t = nums[low]; nums[low++] = nums[mid]; nums[mid++] = t; }
        else if (nums[mid] == 1) mid++;
        else { int t = nums[mid]; nums[mid] = nums[high]; nums[high--] = t; }
    }
}`,
    python: `def sort_colors(nums):
    low = mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low, mid = low + 1, mid + 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
    cpp: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = (int)nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);
        else if (nums[mid] == 1) ++mid;
        else swap(nums[mid], nums[high--]);
    }
}`,
  },
  "arrays-subarray-sum-equals-k": {
    java: `int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> counts = new HashMap<>();
    counts.put(0, 1);
    int prefix = 0, answer = 0;
    for (int value : nums) {
        prefix += value;
        answer += counts.getOrDefault(prefix - k, 0);
        counts.merge(prefix, 1, Integer::sum);
    }
    return answer;
}`,
    python: `def subarray_sum(nums, k):
    counts, prefix, answer = {0: 1}, 0, 0
    for value in nums:
        prefix += value
        answer += counts.get(prefix - k, 0)
        counts[prefix] = counts.get(prefix, 0) + 1
    return answer`,
    cpp: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> counts{{0, 1}};
    int prefix = 0, answer = 0;
    for (int value : nums) {
        prefix += value;
        answer += counts[prefix - k];
        ++counts[prefix];
    }
    return answer;
}`,
  },
  "arrays-trapping-rain-water": {
    java: `int trap(int[] height) {
    int left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = Math.max(leftMax, height[left]);
            water += leftMax - height[left++];
        } else {
            rightMax = Math.max(rightMax, height[right]);
            water += rightMax - height[right--];
        }
    }
    return water;
}`,
    python: `def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water`,
    cpp: `int trap(vector<int>& height) {
    int left = 0, right = (int)height.size() - 1, leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = max(leftMax, height[left]); water += leftMax - height[left++];
        } else {
            rightMax = max(rightMax, height[right]); water += rightMax - height[right--];
        }
    }
    return water;
}`,
  },
  "arrays-3sum": {
    java: `List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> answer = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) { answer.add(List.of(nums[i], nums[left++], nums[right--])); }
            else if (sum < 0) left++; else right--;
            while (left < right && nums[left] == nums[left - 1]) left++;
            while (left < right && nums[right] == nums[right + 1]) right--;
        }
    }
    return answer;
}`,
    python: `def three_sum(nums):
    nums.sort()
    answer = []
    for i in range(len(nums) - 2):
        if i and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                answer.append([nums[i], nums[left], nums[right]])
                left, right = left + 1, right - 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return answer`,
    cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> answer;
    for (int i = 0; i + 2 < nums.size(); ++i) {
        if (i && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = (int)nums.size() - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) { answer.push_back({nums[i], nums[left++], nums[right--]}); }
            else if (sum < 0) ++left; else --right;
            while (left < right && nums[left] == nums[left - 1]) ++left;
            while (left < right && nums[right] == nums[right + 1]) --right;
        }
    }
    return answer;
}`,
  },
};

const FRAME_LIMIT = 240;
const MAX_INPUT_ITEMS = 100;

function parseInput(slug, text) {
  if (!text.trim()) throw new Error("Enter input values before starting the visualization.");
  const values = text.trim().split(/\s+/).map(Number);
  if (!values.length || values.some((value) => !Number.isSafeInteger(value))) {
    throw new Error("Enter whole numbers separated by spaces or new lines.");
  }
  let n;
  let array;
  let params = {};
  if (slug === "arrays-merge-sorted-array") {
    const [m, count] = values;
    n = m + count;
    if (!Number.isInteger(m) || !Number.isInteger(count) || m < 0 || count < 0) throw new Error("Enter valid non-negative m and n values first.");
    if (values.length !== 2 + n + count) throw new Error(`Expected ${n} nums1 values followed by ${count} nums2 values.`);
    array = values.slice(2, 2 + n);
    params = { m, count, second: values.slice(2 + n) };
  } else if (slug === "arrays-subarray-sum-equals-k") {
    [n, params.k] = values;
    array = values.slice(2);
  } else if (slug === "arrays-remove-element") {
    [n, params.value] = values;
    array = values.slice(2);
  } else if (slug === "arrays-rotate-array") {
    [n, params.k] = values;
    array = values.slice(2);
  } else if (slug === "arrays-two-sum") {
    n = values[0];
    array = values.slice(1, n + 1);
    params.target = values[n + 1];
  } else {
    n = values[0];
    array = values.slice(1);
  }
  if (!Number.isInteger(n) || n < 0 || n > MAX_INPUT_ITEMS) throw new Error(`For a responsive visualization, n must be between 0 and ${MAX_INPUT_ITEMS}.`);
  if (array.length !== n) throw new Error(`The input says n = ${n}, but contains ${array.length} array values.`);
  if (["arrays-container-with-most-water", "arrays-trapping-rain-water"].includes(slug) && n < 2) throw new Error("Enter at least two heights.");
  if (slug === "arrays-3sum" && n < 3) throw new Error("Enter at least three numbers.");
  if (slug === "arrays-find-the-duplicate-number" && n < 2) throw new Error("Enter at least two values.");
  if (slug === "arrays-product-of-array-except-self" && n < 2) throw new Error("Enter at least two values.");
  if (slug === "arrays-maximum-subarray" && n === 0) throw new Error("Enter at least one value.");
  if (slug === "arrays-maximum-product-subarray" && n === 0) throw new Error("Enter at least one value.");
  if (slug === "arrays-rotate-array" && n === 0) throw new Error("Enter at least one value.");
  if (slug === "arrays-two-sum" && values.length !== n + 2) throw new Error("Expected n array values followed by a target.");
  if (slug === "arrays-two-sum" && !array.some((value, index) => array.slice(index + 1).includes(params.target - value))) throw new Error("The input must contain a pair that sums to the target.");
  if (slug === "arrays-find-all-numbers-disappeared-in-an-array" && array.some((value) => value < 1 || value > n)) throw new Error("Every value must be between 1 and n.");
  if (slug === "arrays-find-the-duplicate-number" && (array.some((value) => value < 1 || value >= n) || new Set(array).size !== n - 1)) throw new Error("Values must be in the range 1 to n with exactly one duplicated value.");
  if (slug === "arrays-missing-number" && (array.some((value) => value < 0 || value > n) || new Set(array).size !== n)) throw new Error("Values must be distinct and between 0 and n.");
  if (slug === "arrays-sort-colors" && array.some((value) => ![0, 1, 2].includes(value))) throw new Error("Sort Colors input can contain only 0, 1, and 2.");
  if (slug === "arrays-remove-duplicates-from-sorted-array" && array.some((value, index) => index > 0 && value < array[index - 1])) throw new Error("The input array must be sorted in non-decreasing order.");
  if (slug === "arrays-merge-sorted-array") {
    const firstPart = array.slice(0, params.m);
    if (firstPart.some((value, index) => index > 0 && value < firstPart[index - 1]) ||
        params.second.some((value, index) => index > 0 && value < params.second[index - 1])) {
      throw new Error("Both valid input portions must be sorted in non-decreasing order.");
    }
  }
  return { array, ...params };
}

export function getArrayReferenceCode(slug, language) {
  return solutions[slug]?.[language] || null;
}

export function buildArrayTrace(slug, input) {
  const { array: original, ...params } = parseInput(slug, input);
  let values = [...original];
  const frames = [];
  let truncated = false;
  const add = (message, marks = {}, variables = {}, result = null, extra = {}) => {
    if (frames.length >= FRAME_LIMIT) {
      truncated = true;
      return;
    }
    frames.push({
      message,
      arrays: extra.arrays || [{ label: "nums", values: [...values] }],
      marks,
      variables,
      result,
      kind: extra.kind || "array",
      extras: extra.extras || [],
    });
  };
  const finalResult = (message, result, marks = {}, variables = {}, extra = {}) => {
    const frame = {
      message,
      arrays: extra.arrays || [{ label: "nums", values: [...values] }],
      marks,
      variables,
      result: String(result),
      kind: extra.kind || "array",
      extras: extra.extras || [],
    };
    if (frames.length >= FRAME_LIMIT) frames[FRAME_LIMIT - 1] = frame;
    else frames.push(frame);
  };
  const mark = (index, label, role = "active") => ({ [index]: [{ label, role }] });
  let result = null;

  switch (slug) {
    case "arrays-two-sum": {
      const seen = new Map();
      for (let i = 0; i < values.length; i++) {
        const need = params.target - values[i];
        const tags = { [i]: [{ label: `i = ${i}`, role: "active" }] };
        add(`Read ${values[i]} at index ${i}; look for its complement ${need}.`, tags, { target: params.target, complement: need, seen: [...seen.entries()].map(([value, index]) => `${value} → ${index}`).join(", ") || "empty" });
        if (seen.has(need)) {
          result = [seen.get(need), i];
          finalResult(`Found ${need} + ${values[i]} = ${params.target}.`, JSON.stringify(result), { ...tags, [seen.get(need)]: [{ label: `match = ${seen.get(need)}`, role: "success" }] }, { target: params.target });
          break;
        }
        seen.set(values[i], i);
      }
      if (result === null) finalResult("No matching pair was found.", "[]");
      break;
    }
    case "arrays-best-time-to-buy-and-sell-stock": {
      let min = Infinity, best = 0;
      for (let i = 0; i < values.length; i++) {
        best = Math.max(best, values[i] - min);
        min = Math.min(min, values[i]);
        add(`Check day ${i}: price ${values[i]}; update the lowest price and best profit.`, mark(i, `day ${i}`), { minPrice: min, maxProfit: best });
      }
      result = best;
      finalResult(`Maximum possible profit is ${best}.`, best, {}, { minPrice: min, maxProfit: best });
      break;
    }
    case "arrays-container-with-most-water": {
      let left = 0, right = values.length - 1, best = 0, bestPair = [];
      while (left < right) {
        const area = Math.min(values[left], values[right]) * (right - left);
        if (area > best) { best = area; bestPair = [left, right]; }
        add(`Area = min(${values[left]}, ${values[right]}) × (${right} − ${left}) = ${area}. Move the shorter side.`, { [left]: [{ label: "left", role: "active" }], [right]: [{ label: "right", role: "active" }] }, { currentArea: area, maxArea: best }, null, { kind: "bars" });
        if (values[left] < values[right]) left++; else right--;
      }
      result = best;
      finalResult(`Maximum area is ${best}, between indices ${bestPair.join(" and ")}.`, best, { [bestPair[0]]: [{ label: "best left", role: "success" }], [bestPair[1]]: [{ label: "best right", role: "success" }] }, { maxArea: best }, { kind: "bars" });
      break;
    }
    case "arrays-find-all-numbers-disappeared-in-an-array": {
      const marked = values.map((value) => Math.abs(value));
      for (const value of values) {
        const index = Math.abs(value) - 1;
        marked[index] = -Math.abs(marked[index]);
        values = [...marked];
        add(`Value ${Math.abs(value)} marks index ${index} as present.`, mark(index, `${index + 1} present`, "write"), { presentValue: Math.abs(value) });
      }
      result = values.flatMap((value, index) => value > 0 ? [index + 1] : []);
      finalResult(`Missing values: ${JSON.stringify(result)}.`, JSON.stringify(result), {}, { returned: result.join(", ") || "none" });
      break;
    }
    case "arrays-find-the-duplicate-number": {
      let slow = values[0], fast = values[0], meeting = false;
      while (!meeting) {
        slow = values[slow]; fast = values[values[fast]];
        add(`Move slow one link and fast two links: slow = ${slow}, fast = ${fast}.`, { [slow]: [{ label: "slow", role: "active" }], [fast]: [{ label: "fast", role: "write" }] }, { slow, fast });
        meeting = slow === fast;
      }
      slow = values[0];
      while (slow !== fast) {
        slow = values[slow]; fast = values[fast];
        add(`Move both pointers one link to locate the cycle entrance.`, { [slow]: [{ label: "slow", role: "active" }], [fast]: [{ label: "fast", role: "write" }] }, { slow, fast });
      }
      result = slow;
      finalResult(`The cycle entrance identifies duplicate value ${result}.`, result, mark(slow, "duplicate", "success"), { duplicate: result });
      break;
    }
    case "arrays-longest-consecutive-sequence": {
      const set = new Set(values);
      let best = 0, bestStart = null, bestEnd = null;
      for (const value of set) {
        if (!set.has(value - 1)) {
          let end = value;
          while (set.has(end + 1)) end++;
          const length = end - value + 1;
          if (length > best) { best = length; bestStart = value; bestEnd = end; }
          add(`Start at ${value}; consecutive sequence ends at ${end}, length ${length}.`, {}, { start: value, end, longest: best });
        }
      }
      result = best;
      finalResult(`Longest consecutive sequence has length ${best}${bestStart === null ? "" : ` (${bestStart} through ${bestEnd})`}.`, best, {}, { longest: best });
      break;
    }
    case "arrays-majority-element": {
      let candidate = null, count = 0;
      for (let i = 0; i < values.length; i++) {
        if (count === 0) candidate = values[i];
        count += values[i] === candidate ? 1 : -1;
        add(`Read ${values[i]}: ${values[i] === candidate ? "support" : "cancel against"} candidate ${candidate}.`, mark(i, `candidate ${candidate}`, values[i] === candidate ? "active" : "write"), { candidate, voteCount: count });
      }
      result = candidate;
      finalResult(`The guaranteed majority candidate is ${candidate}.`, candidate, {}, { candidate, voteCount: count });
      break;
    }
    case "arrays-maximum-product-subarray": {
      let high = values[0], low = values[0], best = values[0];
      add(`Initialize max-ending, min-ending, and best product to ${values[0]}.`, mark(0, "start", "active"), { maxEnding: high, minEnding: low, best });
      for (let i = 1; i < values.length; i++) {
        if (values[i] < 0) [high, low] = [low, high];
        high = Math.max(values[i], high * values[i]);
        low = Math.min(values[i], low * values[i]);
        best = Math.max(best, high);
        add(`Process ${values[i]}; keep both max and min products because a negative can flip their signs.`, mark(i, "current", "active"), { maxEnding: high, minEnding: low, best });
      }
      result = best;
      finalResult(`Maximum product is ${best}.`, best, {}, { maxEnding: high, minEnding: low, best });
      break;
    }
    case "arrays-maximum-subarray": {
      let current = values[0], best = values[0];
      add(`Start the running and best sums at ${values[0]}.`, mark(0, "start", "active"), { currentSum: current, bestSum: best });
      for (let i = 1; i < values.length; i++) {
        current = Math.max(values[i], current + values[i]);
        best = Math.max(best, current);
        add(`At ${values[i]}, choose whether to start a new subarray or extend the current one.`, mark(i, "current", "active"), { currentSum: current, bestSum: best });
      }
      result = best;
      finalResult(`Maximum subarray sum is ${best}.`, best, {}, { currentSum: current, bestSum: best });
      break;
    }
    case "arrays-merge-sorted-array": {
      const { m, count, second } = params;
      let i = m - 1, j = count - 1, write = m + count - 1;
      const merged = [...values];
      const initialArrays = [{ label: "nums1", values: [...merged] }, { label: "nums2", values: [...second] }];
      add("Compare the last valid values and fill nums1 from the end.", {}, { i, j, write }, null, { arrays: initialArrays });
      while (j >= 0) {
        if (i >= 0 && merged[i] > second[j]) merged[write--] = merged[i--];
        else merged[write--] = second[j--];
        values = [...merged];
        add("Place the larger remaining value at the output pointer.", { [Math.max(0, write + 1)]: [{ label: "write", role: "write" }] }, { i, j, write }, null, { arrays: [{ label: "nums1", values: [...merged] }, { label: "nums2", values: [...second] }] });
      }
      result = merged;
      finalResult(`Merged array: ${JSON.stringify(merged)}.`, JSON.stringify(merged), {}, { result: JSON.stringify(merged) });
      break;
    }
    case "arrays-missing-number": {
      let missing = values.length;
      add(`Initialize XOR with n = ${values.length}.`, {}, { xor: missing });
      for (let i = 0; i < values.length; i++) {
        missing ^= i ^ values[i];
        add(`XOR expected index ${i} and value ${values[i]}; matching values cancel.`, mark(i, `index ${i}`, "active"), { xor: missing });
      }
      result = missing;
      finalResult(`The remaining XOR value is the missing number ${missing}.`, missing, {}, { xor: missing });
      break;
    }
    case "arrays-move-zeroes": {
      let write = 0;
      for (let read = 0; read < values.length; read++) {
        if (values[read] !== 0) {
          [values[write], values[read]] = [values[read], values[write]];
          add(`Move non-zero value ${values[write]} to the next write position.`, { [read]: [{ label: "read", role: "active" }], [write]: [{ label: "write", role: "write" }] }, { write });
          write++;
        } else add(`Skip zero at index ${read}; keep scanning.`, mark(read, "zero", "muted"), { write });
      }
      result = values;
      finalResult(`Zeroes moved to the end: ${JSON.stringify(values)}.`, JSON.stringify(values));
      break;
    }
    case "arrays-product-of-array-except-self": {
      const answer = Array(values.length).fill(1);
      let prefix = 1;
      for (let i = 0; i < values.length; i++) {
        answer[i] = prefix;
        prefix *= values[i];
        add(`Prefix pass: store product to the left of index ${i}.`, mark(i, "prefix", "active"), { prefixProduct: prefix }, null, { arrays: [{ label: "nums", values: [...values] }, { label: "answer", values: [...answer] }] });
      }
      let suffix = 1;
      for (let i = values.length - 1; i >= 0; i--) {
        answer[i] *= suffix;
        suffix *= values[i];
        add(`Suffix pass: multiply by product to the right of index ${i}.`, mark(i, "suffix", "write"), { suffixProduct: suffix }, null, { arrays: [{ label: "nums", values: [...values] }, { label: "answer", values: [...answer] }] });
      }
      result = answer;
      finalResult(`Products except self: ${JSON.stringify(answer)}.`, JSON.stringify(answer), {}, {}, { arrays: [{ label: "nums", values: [...values] }, { label: "answer", values: [...answer] }] });
      break;
    }
    case "arrays-remove-duplicates-from-sorted-array": {
      let write = values.length ? 1 : 0;
      for (let read = 1; read < values.length; read++) {
        const isNew = values[read] !== values[write - 1];
        if (isNew) values[write++] = values[read];
        add(isNew ? `Keep new distinct value ${values[read]}.` : `Skip duplicate value ${values[read]}.`, { [read]: [{ label: "read", role: "active" }], [Math.max(0, write - 1)]: [{ label: "write", role: "write" }] }, { uniqueCount: write });
      }
      result = { k: write, values: values.slice(0, write) };
      finalResult(`Keep the first ${write} unique values.`, JSON.stringify(result), {}, { k: write, uniqueValues: JSON.stringify(result.values) });
      break;
    }
    case "arrays-remove-element": {
      let write = 0;
      for (let read = 0; read < values.length; read++) {
        if (values[read] !== params.value) values[write++] = values[read];
        add(values[read] === params.value ? `Remove ${params.value} at index ${read}.` : `Keep ${values[read]} in the next output position.`, { [read]: [{ label: "read", role: "active" }], [Math.max(0, write - 1)]: [{ label: "write", role: "write" }] }, { valueToRemove: params.value, keptCount: write });
      }
      result = { k: write, values: values.slice(0, write) };
      finalResult(`Keep ${write} values that are not ${params.value}.`, JSON.stringify(result), {}, { k: write, keptValues: JSON.stringify(result.values) });
      break;
    }
    case "arrays-rotate-array": {
      const k = ((params.k % values.length) + values.length) % values.length;
      const reverse = (left, right, label) => {
        while (left < right) {
          [values[left], values[right]] = [values[right], values[left]];
          add(`${label}: swap indices ${left} and ${right}.`, { [left]: [{ label: "swap", role: "active" }], [right]: [{ label: "swap", role: "write" }] }, { k });
          left++; right--;
        }
      };
      reverse(0, values.length - 1, "Reverse the whole array");
      reverse(0, k - 1, "Reverse the first k values");
      reverse(k, values.length - 1, "Reverse the remaining values");
      result = values;
      finalResult(`Rotated right by ${k}: ${JSON.stringify(values)}.`, JSON.stringify(values), {}, { k });
      break;
    }
    case "arrays-sort-colors": {
      let low = 0, mid = 0, high = values.length - 1;
      while (mid <= high) {
        if (values[mid] === 0) {
          [values[low], values[mid]] = [values[mid], values[low]];
          low++; mid++;
        }
        else if (values[mid] === 1) mid++;
        else {
          [values[mid], values[high]] = [values[high], values[mid]];
          high--;
        }
        add("Keep the 0s, 1s, and 2s regions separated with three pointers.", { [Math.max(0, low - 1)]: [{ label: "low", role: "write" }], [mid]: [{ label: "mid", role: "active" }], [Math.max(0, high)]: [{ label: "high", role: "success" }] }, { low, mid, high });
      }
      result = values;
      finalResult(`Sorted colors: ${JSON.stringify(values)}.`, JSON.stringify(values), {}, { low, mid, high });
      break;
    }
    case "arrays-subarray-sum-equals-k": {
      const counts = new Map([[0, 1]]);
      let prefix = 0, answer = 0;
      for (let i = 0; i < values.length; i++) {
        prefix += values[i];
        answer += counts.get(prefix - params.k) || 0;
        counts.set(prefix, (counts.get(prefix) || 0) + 1);
        add(`Prefix ${prefix}; look for earlier prefix ${prefix - params.k}.`, mark(i, `index ${i}`, "active"), { prefix, required: prefix - params.k, matches: answer, prefixCounts: [...counts.entries()].map(([sum, count]) => `${sum}: ${count}`).join(", ") });
      }
      result = answer;
      finalResult(`Found ${answer} subarray(s) with sum ${params.k}.`, answer, {}, { prefix, count: answer });
      break;
    }
    case "arrays-trapping-rain-water": {
      let left = 0, right = values.length - 1, leftMax = 0, rightMax = 0, water = 0;
      while (left < right) {
        if (values[left] < values[right]) {
          leftMax = Math.max(leftMax, values[left]);
          water += leftMax - values[left];
          add(`Process left bar ${left}: left max ${leftMax}; trapped so far ${water}.`, mark(left, `+${leftMax - values[left]} water`, "active"), { leftMax, rightMax, totalWater: water }, null, { kind: "bars" });
          left++;
        } else {
          rightMax = Math.max(rightMax, values[right]);
          water += rightMax - values[right];
          add(`Process right bar ${right}: right max ${rightMax}; trapped so far ${water}.`, mark(right, `+${rightMax - values[right]} water`, "write"), { leftMax, rightMax, totalWater: water }, null, { kind: "bars" });
          right--;
        }
      }
      result = water;
      finalResult(`Total trapped rainwater is ${water} unit(s).`, water, {}, { leftMax, rightMax, totalWater: water }, { kind: "bars" });
      break;
    }
    case "arrays-3sum": {
      values.sort((a, b) => a - b);
      const found = [];
      add("Sort the array, fix one value, then scan with two pointers.", {}, {}, null);
      for (let i = 0; i < values.length - 2; i++) {
        if (i > 0 && values[i] === values[i - 1]) continue;
        let left = i + 1, right = values.length - 1;
        while (left < right) {
          const sum = values[i] + values[left] + values[right];
          add(`Check ${values[i]} + ${values[left]} + ${values[right]} = ${sum}.`, { [i]: [{ label: "fixed", role: "success" }], [left]: [{ label: "left", role: "active" }], [right]: [{ label: "right", role: "write" }] }, { sum, tripletsFound: JSON.stringify(found) });
          if (sum === 0) {
            found.push([values[i], values[left], values[right]]);
            left++; right--;
            while (left < right && values[left] === values[left - 1]) left++;
            while (left < right && values[right] === values[right + 1]) right--;
          } else if (sum < 0) left++;
          else right--;
        }
      }
      result = found;
      finalResult(`Found ${found.length} unique zero-sum triplet(s).`, JSON.stringify(found), {}, { triplets: JSON.stringify(found) });
      break;
    }
    default:
      throw new Error("This Array problem does not have a visualizer yet.");
  }
  if (truncated) frames.push({
    message: "Intermediate frames were shortened to keep playback responsive. The final frame still shows the completed result.",
    arrays: [{ label: "nums", values: [...values] }],
    marks: {},
    variables: {},
    result: String(result),
    kind: "array",
    extras: [],
  });
  return frames;
}
