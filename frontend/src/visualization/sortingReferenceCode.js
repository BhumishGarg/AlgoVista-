const solutions = {
  "sorting-hand-of-straights": {
    java: `boolean isNStraightHand(int[] hand, int groupSize) {
    if (hand.length % groupSize != 0) return false;
    TreeMap<Integer, Integer> count = new TreeMap<>();
    for (int card : hand) count.merge(card, 1, Integer::sum);
    for (int start : count.keySet()) {
        int copies = count.get(start);
        if (copies == 0) continue;
        for (int value = start; value < start + groupSize; value++) {
            if (count.getOrDefault(value, 0) < copies) return false;
            count.put(value, count.get(value) - copies);
        }
    }
    return true;
}`,
    python: `from collections import Counter

def is_n_straight_hand(hand, group_size):
    if len(hand) % group_size:
        return False
    count = Counter(hand)
    for start in sorted(count):
        copies = count[start]
        if copies:
            for value in range(start, start + group_size):
                if count[value] < copies:
                    return False
                count[value] -= copies
    return True`,
    cpp: `bool isNStraightHand(vector<int>& hand, int groupSize) {
    if (hand.size() % groupSize) return false;
    map<int, int> count;
    for (int card : hand) ++count[card];
    for (auto [start, copies] : count) {
        if (!copies) continue;
        for (int value = start; value < start + groupSize; ++value) {
            if (count[value] < copies) return false;
            count[value] -= copies;
        }
    }
    return true;
}`,
  },
  "sorting-height-checker": {
    java: `int heightChecker(int[] heights) {
    int[] expected = heights.clone();
    Arrays.sort(expected);
    int mismatch = 0;
    for (int i = 0; i < heights.length; i++)
        if (heights[i] != expected[i]) mismatch++;
    return mismatch;
}`,
    python: `def height_checker(heights):
    expected = sorted(heights)
    return sum(a != b for a, b in zip(heights, expected))`,
    cpp: `int heightChecker(vector<int>& heights) {
    vector<int> expected = heights;
    sort(expected.begin(), expected.end());
    int mismatch = 0;
    for (int i = 0; i < heights.size(); ++i)
        mismatch += heights[i] != expected[i];
    return mismatch;
}`,
  },
  "sorting-insert-interval": {
    java: `int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0;
    while (i < intervals.length && intervals[i][1] < newInterval[0])
        result.add(intervals[i++]);
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i++][1]);
    }
    result.add(newInterval);
    while (i < intervals.length) result.add(intervals[i++]);
    return result.toArray(new int[result.size()][]);
}`,
    python: `def insert(intervals, new_interval):
    result, i = [], 0
    while i < len(intervals) and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1
    while i < len(intervals) and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    result.append(new_interval)
    return result + intervals[i:]`,
    cpp: `vector<vector<int>> insert(vector<vector<int>>& a, vector<int>& x) {
    vector<vector<int>> out;
    int i = 0;
    while (i < a.size() && a[i][1] < x[0]) out.push_back(a[i++]);
    while (i < a.size() && a[i][0] <= x[1]) {
        x[0] = min(x[0], a[i][0]);
        x[1] = max(x[1], a[i++][1]);
    }
    out.push_back(x);
    while (i < a.size()) out.push_back(a[i++]);
    return out;
}`,
  },
  "sorting-largest-number": {
    java: `String largestNumber(int[] nums) {
    String[] values = new String[nums.length];
    for (int i = 0; i < nums.length; i++) values[i] = String.valueOf(nums[i]);
    Arrays.sort(values, (a, b) -> (b + a).compareTo(a + b));
    if (values[0].equals("0")) return "0";
    return String.join("", values);
}`,
    python: `from functools import cmp_to_key

def largest_number(nums):
    values = list(map(str, nums))
    values.sort(key=cmp_to_key(lambda a, b: -1 if a + b > b + a else (1 if a + b < b + a else 0)))
    result = "".join(values)
    return "0" if result[0] == "0" else result`,
    cpp: `string largestNumber(vector<int>& nums) {
    vector<string> values;
    for (int n : nums) values.push_back(to_string(n));
    sort(values.begin(), values.end(), [](const string& a, const string& b) {
        return a + b > b + a;
    });
    if (values[0] == "0") return "0";
    string result;
    for (const string& value : values) result += value;
    return result;
}`,
  },
  "sorting-maximum-gap": {
    java: `int maximumGap(int[] nums) {
    if (nums.length < 2) return 0;
    int min = Arrays.stream(nums).min().getAsInt();
    int max = Arrays.stream(nums).max().getAsInt();
    if (min == max) return 0;
    int size = Math.max(1, (max - min) / (nums.length - 1));
    int count = (max - min) / size + 1;
    int[] lo = new int[count], hi = new int[count];
    Arrays.fill(lo, Integer.MAX_VALUE); Arrays.fill(hi, Integer.MIN_VALUE);
    for (int x : nums) {
        int b = (x - min) / size;
        lo[b] = Math.min(lo[b], x); hi[b] = Math.max(hi[b], x);
    }
    int answer = 0, previous = min;
    for (int i = 0; i < count; i++) if (lo[i] != Integer.MAX_VALUE) {
        answer = Math.max(answer, lo[i] - previous);
        previous = hi[i];
    }
    return answer;
}`,
    python: `def maximum_gap(nums):
    if len(nums) < 2 or min(nums) == max(nums):
        return 0
    low, high = min(nums), max(nums)
    size = max(1, (high - low) // (len(nums) - 1))
    buckets = [[float("inf"), float("-inf")] for _ in range((high - low) // size + 1)]
    for value in nums:
        bucket = buckets[(value - low) // size]
        bucket[0] = min(bucket[0], value)
        bucket[1] = max(bucket[1], value)
    answer, previous = 0, low
    for first, last in buckets:
        if first != float("inf"):
            answer = max(answer, first - previous)
            previous = last
    return answer`,
    cpp: `int maximumGap(vector<int>& nums) {
    if (nums.size() < 2) return 0;
    int low = *min_element(nums.begin(), nums.end());
    int high = *max_element(nums.begin(), nums.end());
    if (low == high) return 0;
    int width = max(1, (high - low) / (int)(nums.size() - 1));
    int count = (high - low) / width + 1;
    vector<pair<int,int>> buckets(count, {INT_MAX, INT_MIN});
    for (int x : nums) {
        auto& b = buckets[(x - low) / width];
        b.first = min(b.first, x); b.second = max(b.second, x);
    }
    int answer = 0, previous = low;
    for (auto [first, last] : buckets) if (first != INT_MAX) {
        answer = max(answer, first - previous); previous = last;
    }
    return answer;
}`,
  },
  "sorting-meeting-rooms": {
    java: `boolean canAttendMeetings(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    for (int i = 1; i < intervals.length; i++)
        if (intervals[i][0] < intervals[i - 1][1]) return false;
    return true;
}`,
    python: `def can_attend_meetings(intervals):
    intervals.sort()
    return all(intervals[i][0] >= intervals[i - 1][1]
               for i in range(1, len(intervals)))`,
    cpp: `bool canAttendMeetings(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    for (int i = 1; i < intervals.size(); ++i)
        if (intervals[i][0] < intervals[i - 1][1]) return false;
    return true;
}`,
  },
  "sorting-meeting-rooms-ii": {
    java: `int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    PriorityQueue<Integer> ends = new PriorityQueue<>();
    int rooms = 0;
    for (int[] meeting : intervals) {
        while (!ends.isEmpty() && ends.peek() <= meeting[0]) ends.poll();
        ends.offer(meeting[1]);
        rooms = Math.max(rooms, ends.size());
    }
    return rooms;
}`,
    python: `import heapq

def min_meeting_rooms(intervals):
    ends = []
    rooms = 0
    for start, end in sorted(intervals):
        if ends and ends[0] <= start:
            heapq.heappop(ends)
        heapq.heappush(ends, end)
        rooms = max(rooms, len(ends))
    return rooms`,
    cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> ends;
    int rooms = 0;
    for (auto& meeting : intervals) {
        while (!ends.empty() && ends.top() <= meeting[0]) ends.pop();
        ends.push(meeting[1]);
        rooms = max(rooms, (int)ends.size());
    }
    return rooms;
}`,
  },
  "sorting-merge-intervals": {
    java: `int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] current : intervals) {
        if (out.isEmpty() || out.get(out.size() - 1)[1] < current[0]) out.add(current.clone());
        else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], current[1]);
    }
    return out.toArray(new int[out.size()][]);
}`,
    python: `def merge(intervals):
    out = []
    for start, end in sorted(intervals):
        if not out or out[-1][1] < start:
            out.append([start, end])
        else:
            out[-1][1] = max(out[-1][1], end)
    return out`,
    cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> out;
    for (auto& current : intervals) {
        if (out.empty() || out.back()[1] < current[0]) out.push_back(current);
        else out.back()[1] = max(out.back()[1], current[1]);
    }
    return out;
}`,
  },
  "sorting-merge-sorted-array": {
    java: `void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, write = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[write--] = nums1[i--];
        else nums1[write--] = nums2[j--];
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
  "sorting-minimum-number-of-arrows-to-burst-balloons": {
    java: `int findMinArrowShots(int[][] points) {
    Arrays.sort(points, Comparator.comparingInt(a -> a[1]));
    long arrow = Long.MIN_VALUE;
    int count = 0;
    for (int[] balloon : points) {
        if (balloon[0] > arrow) {
            arrow = balloon[1];
            count++;
        }
    }
    return count;
}`,
    python: `def find_min_arrow_shots(points):
    points.sort(key=lambda p: p[1])
    arrows, position = 0, None
    for start, end in points:
        if position is None or start > position:
            arrows += 1
            position = end
    return arrows`,
    cpp: `int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(), [](auto& a, auto& b) {
        return a[1] < b[1];
    });
    long long arrow = LLONG_MIN;
    int count = 0;
    for (auto& p : points) if (p[0] > arrow) {
        arrow = p[1];
        ++count;
    }
    return count;
}`,
  },
  "sorting-non-overlapping-intervals": {
    java: `int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
    int kept = 0, end = Integer.MIN_VALUE;
    for (int[] interval : intervals) if (interval[0] >= end) {
        kept++;
        end = interval[1];
    }
    return intervals.length - kept;
}`,
    python: `def erase_overlap_intervals(intervals):
    end, kept = float("-inf"), 0
    for start, finish in sorted(intervals, key=lambda x: x[1]):
        if start >= end:
            kept += 1
            end = finish
    return len(intervals) - kept`,
    cpp: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) {
        return a[1] < b[1];
    });
    int kept = 0, end = INT_MIN;
    for (auto& interval : intervals) if (interval[0] >= end) {
        ++kept; end = interval[1];
    }
    return intervals.size() - kept;
}`,
  },
  "sorting-pancake-sorting": {
    java: `List<Integer> pancakeSort(int[] arr) {
    List<Integer> flips = new ArrayList<>();
    for (int size = arr.length; size > 1; size--) {
        int max = 0;
        for (int i = 1; i < size; i++) if (arr[i] > arr[max]) max = i;
        if (max == size - 1) continue;
        reverse(arr, max + 1); flips.add(max + 1);
        reverse(arr, size); flips.add(size);
    }
    return flips;
}
void reverse(int[] a, int length) {
    for (int l = 0, r = length - 1; l < r; l++, r--) {
        int t = a[l]; a[l] = a[r]; a[r] = t;
    }
}`,
    python: `def pancake_sort(arr):
    flips = []
    for size in range(len(arr), 1, -1):
        maximum = arr.index(max(arr[:size]))
        if maximum == size - 1:
            continue
        arr[:maximum + 1] = reversed(arr[:maximum + 1])
        flips.append(maximum + 1)
        arr[:size] = reversed(arr[:size])
        flips.append(size)
    return flips`,
    cpp: `vector<int> pancakeSort(vector<int>& arr) {
    vector<int> flips;
    for (int size = arr.size(); size > 1; --size) {
        int maximum = max_element(arr.begin(), arr.begin() + size) - arr.begin();
        if (maximum == size - 1) continue;
        reverse(arr.begin(), arr.begin() + maximum + 1);
        flips.push_back(maximum + 1);
        reverse(arr.begin(), arr.begin() + size);
        flips.push_back(size);
    }
    return flips;
}`,
  },
  "sorting-relative-sort-array": {
    java: `int[] relativeSortArray(int[] arr1, int[] arr2) {
    int[] count = new int[1001];
    for (int value : arr1) count[value]++;
    int index = 0;
    for (int value : arr2) while (count[value]-- > 0) arr1[index++] = value;
    for (int value = 0; value < count.length; value++)
        while (count[value]-- > 0) arr1[index++] = value;
    return arr1;
}`,
    python: `def relative_sort_array(arr1, arr2):
    count = {}
    for value in arr1:
        count[value] = count.get(value, 0) + 1
    result = []
    for value in arr2:
        result.extend([value] * count.pop(value, 0))
    for value in sorted(count):
        result.extend([value] * count[value])
    return result`,
    cpp: `vector<int> relativeSortArray(vector<int>& a, vector<int>& order) {
    int count[1001] = {};
    for (int x : a) ++count[x];
    vector<int> out;
    for (int x : order) while (count[x]--) out.push_back(x);
    for (int x = 0; x <= 1000; ++x) while (count[x]--) out.push_back(x);
    return out;
}`,
  },
  "sorting-sort-colors": {
    java: `void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(nums, low++, mid++);
        else if (nums[mid] == 2) swap(nums, mid, high--);
        else mid++;
    }
}
void swap(int[] a, int i, int j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
}`,
    python: `def sort_colors(nums):
    low = mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 2:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
        else:
            mid += 1`,
    cpp: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);
        else if (nums[mid] == 2) swap(nums[mid], nums[high--]);
        else ++mid;
    }
}`,
  },
  "sorting-sort-even-and-odd-indices-independently": {
    java: `int[] sortEvenOdd(int[] nums) {
    List<Integer> even = new ArrayList<>(), odd = new ArrayList<>();
    for (int i = 0; i < nums.length; i++)
        (i % 2 == 0 ? even : odd).add(nums[i]);
    Collections.sort(even);
    odd.sort(Collections.reverseOrder());
    for (int i = 0, e = 0, o = 0; i < nums.length; i++)
        nums[i] = i % 2 == 0 ? even.get(e++) : odd.get(o++);
    return nums;
}`,
    python: `def sort_even_odd(nums):
    even = sorted(nums[::2])
    odd = sorted(nums[1::2], reverse=True)
    nums[::2] = even
    nums[1::2] = odd
    return nums`,
    cpp: `vector<int> sortEvenOdd(vector<int>& nums) {
    vector<int> even, odd;
    for (int i = 0; i < nums.size(); ++i)
        (i % 2 ? odd : even).push_back(nums[i]);
    sort(even.begin(), even.end());
    sort(odd.rbegin(), odd.rend());
    for (int i = 0, e = 0, o = 0; i < nums.size(); ++i)
        nums[i] = i % 2 ? odd[o++] : even[e++];
    return nums;
}`,
  },
  "sorting-sort-integers-by-the-number-of-1-bits": {
    java: `int[] sortByBits(int[] arr) {
    Integer[] values = Arrays.stream(arr).boxed().toArray(Integer[]::new);
    Arrays.sort(values, (a, b) -> {
        int bits = Integer.bitCount(a) - Integer.bitCount(b);
        return bits != 0 ? bits : a - b;
    });
    return Arrays.stream(values).mapToInt(Integer::intValue).toArray();
}`,
    python: `def sort_by_bits(arr):
    return sorted(arr, key=lambda value: (value.bit_count(), value))`,
    cpp: `vector<int> sortByBits(vector<int>& arr) {
    sort(arr.begin(), arr.end(), [](int a, int b) {
        int x = __builtin_popcount((unsigned)a);
        int y = __builtin_popcount((unsigned)b);
        return x == y ? a < b : x < y;
    });
    return arr;
}`,
  },
  "sorting-sort-vowels-in-a-string": {
    java: `String sortVowels(String s) {
    List<Character> vowels = new ArrayList<>();
    for (char c : s.toCharArray()) if ("aeiouAEIOU".indexOf(c) >= 0) vowels.add(c);
    Collections.sort(vowels);
    StringBuilder out = new StringBuilder(s);
    for (int i = 0, j = 0; i < s.length(); i++)
        if ("aeiouAEIOU".indexOf(s.charAt(i)) >= 0) out.setCharAt(i, vowels.get(j++));
    return out.toString();
}`,
    python: `def sort_vowels(s):
    vowels = iter(sorted(c for c in s if c in "aeiouAEIOU"))
    return "".join(next(vowels) if c in "aeiouAEIOU" else c for c in s)`,
    cpp: `string sortVowels(string s) {
    string vowels;
    for (char c : s) if (string("aeiouAEIOU").find(c) != string::npos) vowels += c;
    sort(vowels.begin(), vowels.end());
    int j = 0;
    for (char& c : s) if (string("aeiouAEIOU").find(c) != string::npos) c = vowels[j++];
    return s;
}`,
  },
  "sorting-sort-an-array": {
    java: `int[] sortArray(int[] nums) {
    int[] temp = new int[nums.length];
    mergeSort(nums, temp, 0, nums.length - 1);
    return nums;
}
void mergeSort(int[] a, int[] temp, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(a, temp, left, mid);
    mergeSort(a, temp, mid + 1, right);
    int i = left, j = mid + 1, k = left;
    while (i <= mid && j <= right) temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i <= mid) temp[k++] = a[i++];
    while (j <= right) temp[k++] = a[j++];
    for (i = left; i <= right; i++) a[i] = temp[i];
}`,
    python: `def sort_array(nums):
    if len(nums) < 2:
        return nums
    mid = len(nums) // 2
    left = sort_array(nums[:mid])
    right = sort_array(nums[mid:])
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
    cpp: `vector<int> sortArray(vector<int>& nums) {
    vector<int> temp(nums.size());
    function<void(int,int)> sortRange = [&](int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        sortRange(left, mid); sortRange(mid + 1, right);
        int i = left, j = mid + 1, k = left;
        while (i <= mid && j <= right) temp[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
        while (i <= mid) temp[k++] = nums[i++];
        while (j <= right) temp[k++] = nums[j++];
        for (int p = left; p <= right; ++p) nums[p] = temp[p];
    };
    sortRange(0, (int)nums.size() - 1);
    return nums;
}`,
  },
  "sorting-sort-the-people": {
    java: `String[] sortPeople(String[] names, int[] heights) {
    Integer[] order = new Integer[names.length];
    for (int i = 0; i < order.length; i++) order[i] = i;
    Arrays.sort(order, (a, b) -> heights[b] - heights[a]);
    String[] result = new String[names.length];
    for (int i = 0; i < order.length; i++) result[i] = names[order[i]];
    return result;
}`,
    python: `def sort_people(names, heights):
    return [name for _, name in sorted(zip(heights, names), reverse=True)]`,
    cpp: `vector<string> sortPeople(vector<string>& names, vector<int>& heights) {
    vector<int> order(names.size());
    iota(order.begin(), order.end(), 0);
    sort(order.begin(), order.end(), [&](int a, int b) { return heights[a] > heights[b]; });
    vector<string> result;
    for (int i : order) result.push_back(names[i]);
    return result;
}`,
  },
  "sorting-wiggle-sort-ii": {
    java: `void wiggleSort(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int n = nums.length, mid = (n + 1) / 2;
    int left = mid - 1, right = n - 1;
    for (int i = 0; i < n; i++)
        nums[i] = i % 2 == 0 ? sorted[left--] : sorted[right--];
}`,
    python: `def wiggle_sort(nums):
    values = sorted(nums)
    n = len(nums)
    left, right = (n - 1) // 2, n - 1
    for i in range(n):
        if i % 2 == 0:
            nums[i] = values[left]
            left -= 1
        else:
            nums[i] = values[right]
            right -= 1`,
    cpp: `void wiggleSort(vector<int>& nums) {
    vector<int> sorted = nums;
    sort(sorted.begin(), sorted.end());
    int left = (nums.size() - 1) / 2, right = nums.size() - 1;
    for (int i = 0; i < nums.size(); ++i)
        nums[i] = i % 2 == 0 ? sorted[left--] : sorted[right--];
}`,
  },
};

export function getSortingReferenceCode(slug, language) {
  return solutions[slug]?.[language] || "";
}
