const solutions = {
  "heaps-priority-queue-find-k-pairs-with-smallest-sums": {
    java: `List<List<Integer>> kSmallestPairs(int[] a, int[] b, int k) {
    List<List<Integer>> out = new ArrayList<>();
    PriorityQueue<int[]> q = new PriorityQueue<>(Comparator.comparingInt(x -> a[x[0]] + b[x[1]]));
    for (int i = 0; i < Math.min(a.length, k); i++) q.add(new int[]{i, 0});
    while (k-- > 0 && !q.isEmpty()) {
        int[] p = q.remove();
        out.add(Arrays.asList(a[p[0]], b[p[1]]));
        if (p[1] + 1 < b.length) q.add(new int[]{p[0], p[1] + 1});
    }
    return out;
}`,
    python: `import heapq

def k_smallest_pairs(nums1, nums2, k):
    heap = [(nums1[i] + nums2[0], i, 0) for i in range(min(k, len(nums1)))]
    heapq.heapify(heap)
    result = []
    while heap and len(result) < k:
        _, i, j = heapq.heappop(heap)
        result.append([nums1[i], nums2[j]])
        if j + 1 < len(nums2):
            heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
    return result`,
    cpp: `vector<vector<int>> kSmallestPairs(vector<int>& a, vector<int>& b, int k) {
    using T = tuple<long long, int, int>;
    priority_queue<T, vector<T>, greater<T>> q;
    for (int i = 0; i < min((int)a.size(), k); ++i) q.emplace((long long)a[i] + b[0], i, 0);
    vector<vector<int>> out;
    while (k-- && !q.empty()) {
        auto [sum, i, j] = q.top(); q.pop();
        out.push_back({a[i], b[j]});
        if (j + 1 < b.size()) q.emplace((long long)a[i] + b[j + 1], i, j + 1);
    }
    return out;
}`,
  },
  "heaps-priority-queue-find-median-from-data-stream": {
    java: `class MedianFinder {
    PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> high = new PriorityQueue<>();
    void addNum(int num) {
        low.add(num); high.add(low.remove());
        if (high.size() > low.size()) low.add(high.remove());
    }
    double findMedian() {
        return low.size() > high.size() ? low.peek() : ((long)low.peek() + high.peek()) / 2.0;
    }
}`,
    python: `import heapq

class MedianFinder:
    def __init__(self):
        self.low, self.high = [], []
    def addNum(self, num):
        heapq.heappush(self.low, -num)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))
    def findMedian(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2`,
    cpp: `class MedianFinder {
    priority_queue<int> low;
    priority_queue<int, vector<int>, greater<int>> high;
public:
    void addNum(int num) {
        low.push(num); high.push(low.top()); low.pop();
        if (high.size() > low.size()) { low.push(high.top()); high.pop(); }
    }
    double findMedian() {
        return low.size() > high.size() ? low.top() : ((long long)low.top() + high.top()) / 2.0;
    }
};`,
  },
  "heaps-priority-queue-furthest-building-you-can-reach": {
    java: `int furthestBuilding(int[] heights, int bricks, int ladders) {
    PriorityQueue<Integer> climbs = new PriorityQueue<>();
    for (int i = 0; i + 1 < heights.length; i++) {
        int climb = heights[i + 1] - heights[i];
        if (climb > 0) climbs.add(climb);
        if (climbs.size() > ladders) bricks -= climbs.remove();
        if (bricks < 0) return i;
    }
    return heights.length - 1;
}`,
    python: `import heapq

def furthest_building(heights, bricks, ladders):
    climbs = []
    for i in range(len(heights) - 1):
        climb = heights[i + 1] - heights[i]
        if climb > 0:
            heapq.heappush(climbs, climb)
        if len(climbs) > ladders:
            bricks -= heapq.heappop(climbs)
        if bricks < 0:
            return i
    return len(heights) - 1`,
    cpp: `int furthestBuilding(vector<int>& h, int bricks, int ladders) {
    priority_queue<int, vector<int>, greater<int>> climbs;
    for (int i = 0; i + 1 < h.size(); ++i) {
        int d = h[i + 1] - h[i];
        if (d > 0) climbs.push(d);
        if (climbs.size() > ladders) { bricks -= climbs.top(); climbs.pop(); }
        if (bricks < 0) return i;
    }
    return h.size() - 1;
}`,
  },
  "heaps-priority-queue-ipo": {
    java: `int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n = profits.length;
    int[][] projects = new int[n][2];
    for (int i = 0; i < n; i++) projects[i] = new int[]{capital[i], profits[i]};
    Arrays.sort(projects, Comparator.comparingInt(a -> a[0]));
    PriorityQueue<Integer> available = new PriorityQueue<>(Collections.reverseOrder());
    for (int i = 0, j = 0; i < k; i++) {
        while (j < n && projects[j][0] <= w) available.add(projects[j++][1]);
        if (available.isEmpty()) break;
        w += available.remove();
    }
    return w;
}`,
    python: `import heapq

def find_maximized_capital(k, w, profits, capital):
    projects = sorted(zip(capital, profits))
    available, i = [], 0
    for _ in range(k):
        while i < len(projects) and projects[i][0] <= w:
            heapq.heappush(available, -projects[i][1]); i += 1
        if not available:
            break
        w -= heapq.heappop(available)
    return w`,
    cpp: `int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    vector<pair<int,int>> projects;
    for (int i = 0; i < profits.size(); ++i) projects.emplace_back(capital[i], profits[i]);
    sort(projects.begin(), projects.end());
    priority_queue<int> available;
    for (int i = 0, j = 0; i < k; ++i) {
        while (j < projects.size() && projects[j].first <= w) available.push(projects[j++].second);
        if (available.empty()) break;
        w += available.top(); available.pop();
    }
    return w;
}`,
  },
  "heaps-priority-queue-k-closest-points-to-origin": {
    java: `int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> q = new PriorityQueue<>((a,b) ->
        Integer.compare(b[0]*b[0]+b[1]*b[1], a[0]*a[0]+a[1]*a[1]));
    for (int[] p : points) { q.add(p); if (q.size() > k) q.remove(); }
    return q.toArray(new int[k][]);
}`,
    python: `import heapq

def k_closest(points, k):
    heap = []
    for x, y in points:
        heapq.heappush(heap, (-(x*x + y*y), [x, y]))
        if len(heap) > k:
            heapq.heappop(heap)
    return [point for _, point in heap]`,
    cpp: `vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    priority_queue<pair<int, vector<int>>> q;
    for (auto& p : points) {
        q.push({p[0]*p[0] + p[1]*p[1], p});
        if (q.size() > k) q.pop();
    }
    vector<vector<int>> out;
    while (!q.empty()) { out.push_back(q.top().second); q.pop(); }
    return out;
}`,
  },
  "heaps-priority-queue-kth-largest-element-in-a-stream": {
    java: `class KthLargest {
    int k;
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    KthLargest(int k, int[] nums) { this.k = k; for (int n : nums) add(n); }
    int add(int val) {
        heap.add(val);
        if (heap.size() > k) heap.remove();
        return heap.peek();
    }
}`,
    python: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k, self.heap = k, []
        for value in nums:
            self.add(value)
    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`,
    cpp: `class KthLargest {
    int k;
    priority_queue<int, vector<int>, greater<int>> heap;
public:
    KthLargest(int k, vector<int>& nums) : k(k) { for (int n : nums) add(n); }
    int add(int val) {
        heap.push(val);
        if (heap.size() > k) heap.pop();
        return heap.top();
    }
};`,
  },
  "heaps-priority-queue-kth-largest-element-in-an-array": {
    java: `int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> q = new PriorityQueue<>();
    for (int value : nums) { q.add(value); if (q.size() > k) q.remove(); }
    return q.peek();
}`,
    python: `import heapq

def find_kth_largest(nums, k):
    return heapq.nlargest(k, nums)[-1]`,
    cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> q;
    for (int value : nums) { q.push(value); if (q.size() > k) q.pop(); }
    return q.top();
}`,
  },
  "heaps-priority-queue-kth-smallest-element-in-a-sorted-matrix": {
    java: `int kthSmallest(int[][] matrix, int k) {
    PriorityQueue<int[]> q = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    for (int r = 0; r < matrix.length; r++) q.add(new int[]{matrix[r][0], r, 0});
    while (--k > 0) {
        int[] x = q.remove();
        if (x[2] + 1 < matrix.length) q.add(new int[]{matrix[x[1]][x[2]+1], x[1], x[2]+1});
    }
    return q.remove()[0];
}`,
    python: `import heapq

def kth_smallest(matrix, k):
    heap = [(row[0], r, 0) for r, row in enumerate(matrix)]
    heapq.heapify(heap)
    for _ in range(k):
        value, r, c = heapq.heappop(heap)
        if c + 1 < len(matrix):
            heapq.heappush(heap, (matrix[r][c+1], r, c+1))
    return value`,
    cpp: `int kthSmallest(vector<vector<int>>& matrix, int k) {
    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> q;
    for (int r = 0; r < matrix.size(); ++r) q.emplace(matrix[r][0], r, 0);
    while (k--) {
        auto [value, r, c] = q.top(); q.pop();
        if (c + 1 < matrix.size()) q.emplace(matrix[r][c+1], r, c+1);
        if (k == 0) return value;
    }
    return -1;
}`,
  },
  "heaps-priority-queue-last-stone-weight": {
    java: `int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> q = new PriorityQueue<>(Collections.reverseOrder());
    for (int stone : stones) q.add(stone);
    while (q.size() > 1) {
        int a = q.remove(), b = q.remove();
        if (a != b) q.add(a - b);
    }
    return q.isEmpty() ? 0 : q.peek();
}`,
    python: `import heapq

def last_stone_weight(stones):
    heap = [-stone for stone in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        a, b = -heapq.heappop(heap), -heapq.heappop(heap)
        if a != b:
            heapq.heappush(heap, -(a - b))
    return -heap[0] if heap else 0`,
    cpp: `int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> q(stones.begin(), stones.end());
    while (q.size() > 1) {
        int a = q.top(); q.pop(); int b = q.top(); q.pop();
        if (a != b) q.push(a - b);
    }
    return q.empty() ? 0 : q.top();
}`,
  },
  "heaps-priority-queue-maximum-subsequence-score": {
    java: `long maxScore(int[] nums1, int[] nums2, int k) {
    int[][] pairs = new int[nums1.length][2];
    for (int i = 0; i < nums1.length; i++) pairs[i] = new int[]{nums2[i], nums1[i]};
    Arrays.sort(pairs, (a,b) -> Integer.compare(b[0], a[0]));
    PriorityQueue<Integer> q = new PriorityQueue<>();
    long sum = 0, best = 0;
    for (int[] p : pairs) {
        q.add(p[1]); sum += p[1]; if (q.size() > k) sum -= q.remove();
        if (q.size() == k) best = Math.max(best, sum * p[0]);
    }
    return best;
}`,
    python: `import heapq

def max_score(nums1, nums2, k):
    pairs = sorted(zip(nums2, nums1), reverse=True)
    heap, total, best = [], 0, 0
    for minimum, value in pairs:
        heapq.heappush(heap, value); total += value
        if len(heap) > k:
            total -= heapq.heappop(heap)
        if len(heap) == k:
            best = max(best, total * minimum)
    return best`,
    cpp: `long long maxScore(vector<int>& nums1, vector<int>& nums2, int k) {
    vector<pair<int,int>> pairs;
    for (int i = 0; i < nums1.size(); ++i) pairs.emplace_back(nums2[i], nums1[i]);
    sort(pairs.rbegin(), pairs.rend());
    priority_queue<int, vector<int>, greater<int>> q;
    long long sum = 0, best = 0;
    for (auto [minimum, value] : pairs) {
        q.push(value); sum += value; if (q.size() > k) { sum -= q.top(); q.pop(); }
        if (q.size() == k) best = max(best, sum * minimum);
    }
    return best;
}`,
  },
  "heaps-priority-queue-meeting-rooms-ii": {
    java: `int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    PriorityQueue<Integer> ends = new PriorityQueue<>();
    for (int[] meeting : intervals) {
        if (!ends.isEmpty() && ends.peek() <= meeting[0]) ends.remove();
        ends.add(meeting[1]);
    }
    return ends.size();
}`,
    python: `import heapq

def min_meeting_rooms(intervals):
    rooms = []
    for start, end in sorted(intervals):
        if rooms and rooms[0] <= start:
            heapq.heappop(rooms)
        heapq.heappush(rooms, end)
    return len(rooms)`,
    cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> ends;
    for (auto& meeting : intervals) {
        if (!ends.empty() && ends.top() <= meeting[0]) ends.pop();
        ends.push(meeting[1]);
    }
    return ends.size();
}`,
  },
  "heaps-priority-queue-merge-k-sorted-lists": {
    java: `ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> q = new PriorityQueue<>(Comparator.comparingInt(n -> n.val));
    for (ListNode node : lists) if (node != null) q.add(node);
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!q.isEmpty()) {
        tail.next = q.remove(); tail = tail.next;
        if (tail.next != null) q.add(tail.next);
    }
    return dummy.next;
}`,
    python: `import heapq

def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = tail = ListNode()
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node; tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
    cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> q(cmp);
    for (auto node : lists) if (node) q.push(node);
    ListNode dummy, *tail = &dummy;
    while (!q.empty()) {
        tail->next = q.top(); q.pop(); tail = tail->next;
        if (tail->next) q.push(tail->next);
    }
    return dummy.next;
}`,
  },
  "heaps-priority-queue-minimum-cost-to-hire-k-workers": {
    java: `double mincostToHireWorkers(int[] quality, int[] wage, int k) {
    int n = quality.length;
    double[][] workers = new double[n][2];
    for (int i = 0; i < n; i++) workers[i] = new double[]{(double)wage[i]/quality[i], quality[i]};
    Arrays.sort(workers, Comparator.comparingDouble(a -> a[0]));
    PriorityQueue<Integer> q = new PriorityQueue<>(Collections.reverseOrder());
    int sum = 0; double best = Double.MAX_VALUE;
    for (double[] worker : workers) {
        int qualityValue = (int)worker[1]; q.add(qualityValue); sum += qualityValue;
        if (q.size() > k) sum -= q.remove();
        if (q.size() == k) best = Math.min(best, sum * worker[0]);
    }
    return best;
}`,
    python: `import heapq

def mincost_to_hire_workers(quality, wage, k):
    workers = sorted((w / q, q) for q, w in zip(quality, wage))
    qualities, total, best = [], 0, float("inf")
    for rate, q in workers:
        heapq.heappush(qualities, -q); total += q
        if len(qualities) > k:
            total += heapq.heappop(qualities)
        if len(qualities) == k:
            best = min(best, total * rate)
    return best`,
    cpp: `double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {
    vector<pair<double,int>> workers;
    for (int i = 0; i < quality.size(); ++i)
        workers.emplace_back((double)wage[i] / quality[i], quality[i]);
    sort(workers.begin(), workers.end());
    priority_queue<int> q;
    int sum = 0; double best = 1e100;
    for (auto [rate, value] : workers) {
        q.push(value); sum += value;
        if (q.size() > k) { sum -= q.top(); q.pop(); }
        if (q.size() == k) best = min(best, sum * rate);
    }
    return best;
}`,
  },
  "heaps-priority-queue-reorganize-string": {
    java: `String reorganizeString(String s) {
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c-'a']++;
    PriorityQueue<int[]> q = new PriorityQueue<>((a,b) -> b[1]-a[1]);
    for (int i=0;i<26;i++) if (count[i]>0) q.add(new int[]{i,count[i]});
    StringBuilder out = new StringBuilder();
    int[] previous = null;
    while (!q.isEmpty()) {
        int[] current = q.remove(); out.append((char)('a'+current[0])); current[1]--;
        if (previous != null && previous[1] > 0) q.add(previous);
        previous = current[1] > 0 ? current : null;
    }
    return previous == null ? out.toString() : "";
}`,
    python: `import heapq
from collections import Counter

def reorganize_string(s):
    heap = [(-count, char) for char, count in Counter(s).items()]
    heapq.heapify(heap)
    result, previous = [], (0, "")
    while heap:
        count, char = heapq.heappop(heap)
        result.append(char)
        if previous[0] < 0:
            heapq.heappush(heap, previous)
        previous = (count + 1, char)
    return "".join(result) if len(result) == len(s) else ""`,
    cpp: `string reorganizeString(string s) {
    int count[26] = {};
    for (char c : s) count[c-'a']++;
    priority_queue<pair<int,char>> q;
    for (int i=0;i<26;i++) if (count[i]) q.push({count[i], 'a'+i});
    string out; pair<int,char> previous = {0, '#'};
    while (!q.empty()) {
        auto current = q.top(); q.pop(); out += current.second; --current.first;
        if (previous.first > 0) q.push(previous);
        previous = current;
    }
    return out.size() == s.size() ? out : "";
}`,
  },
  "heaps-priority-queue-seat-reservation-manager": {
    java: `class SeatManager {
    PriorityQueue<Integer> available = new PriorityQueue<>();
    SeatManager(int n) { for (int i=1;i<=n;i++) available.add(i); }
    int reserve() { return available.remove(); }
    void unreserve(int seatNumber) { available.add(seatNumber); }
}`,
    python: `import heapq

class SeatManager:
    def __init__(self, n):
        self.available = list(range(1, n + 1))
        heapq.heapify(self.available)
    def reserve(self):
        return heapq.heappop(self.available)
    def unreserve(self, seatNumber):
        heapq.heappush(self.available, seatNumber)`,
    cpp: `class SeatManager {
    priority_queue<int, vector<int>, greater<int>> available;
public:
    SeatManager(int n) { for (int i=1;i<=n;i++) available.push(i); }
    int reserve() { int seat=available.top(); available.pop(); return seat; }
    void unreserve(int seatNumber) { available.push(seatNumber); }
};`,
  },
  "heaps-priority-queue-smallest-range-covering-elements-from-k-lists": {
    java: `int[] smallestRange(List<List<Integer>> nums) {
    PriorityQueue<int[]> q = new PriorityQueue<>(Comparator.comparingInt(a -> nums.get(a[0]).get(a[1])));
    int max = Integer.MIN_VALUE, start = 0, end = Integer.MAX_VALUE;
    for (int i=0;i<nums.size();i++) { q.add(new int[]{i,0}); max=Math.max(max,nums.get(i).get(0)); }
    while (q.size()==nums.size()) {
        int[] x=q.remove(); int value=nums.get(x[0]).get(x[1]);
        if (max-value < end-start) { start=value; end=max; }
        if (++x[1] == nums.get(x[0]).size()) break;
        q.add(x); max=Math.max(max,nums.get(x[0]).get(x[1]));
    }
    return new int[]{start,end};
}`,
    python: `import heapq

def smallest_range(nums):
    heap = [(row[0], i, 0) for i, row in enumerate(nums)]
    heapq.heapify(heap)
    current_max = max(row[0] for row in nums)
    best = [heap[0][0], current_max]
    while True:
        value, row, col = heapq.heappop(heap)
        if current_max - value < best[1] - best[0]:
            best = [value, current_max]
        col += 1
        if col == len(nums[row]):
            return best
        next_value = nums[row][col]
        current_max = max(current_max, next_value)
        heapq.heappush(heap, (next_value, row, col))`,
    cpp: `vector<int> smallestRange(vector<vector<int>>& nums) {
    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> q;
    int currentMax = INT_MIN;
    for (int i=0;i<nums.size();i++) { q.emplace(nums[i][0],i,0); currentMax=max(currentMax,nums[i][0]); }
    int left=0, right=INT_MAX;
    while (q.size()==nums.size()) {
        auto [value,row,col]=q.top(); q.pop();
        if (currentMax-value < right-left) left=value, right=currentMax;
        if (++col == nums[row].size()) break;
        q.emplace(nums[row][col],row,col); currentMax=max(currentMax,nums[row][col]);
    }
    return {left,right};
}`,
  },
  "heaps-priority-queue-sort-characters-by-frequency": {
    java: `String frequencySort(String s) {
    Map<Character,Integer> count = new HashMap<>();
    for (char c:s.toCharArray()) count.merge(c,1,Integer::sum);
    PriorityQueue<Character> q = new PriorityQueue<>((a,b) -> count.get(b)-count.get(a));
    q.addAll(count.keySet());
    StringBuilder out = new StringBuilder();
    while (!q.isEmpty()) { char c=q.remove(); out.append(String.valueOf(c).repeat(count.get(c))); }
    return out.toString();
}`,
    python: `from collections import Counter

def frequency_sort(s):
    return "".join(char * count for char, count in Counter(s).most_common())`,
    cpp: `string frequencySort(string s) {
    unordered_map<char,int> count;
    for (char c:s) count[c]++;
    priority_queue<pair<int,char>> q;
    for (auto [c,n]:count) q.push({n,c});
    string out;
    while (!q.empty()) { auto [n,c]=q.top(); q.pop(); out += string(n,c); }
    return out;
}`,
  },
  "heaps-priority-queue-take-gifts-from-the-richest-pile": {
    java: `long pickGifts(int[] gifts, int k) {
    PriorityQueue<Integer> q = new PriorityQueue<>(Collections.reverseOrder());
    for (int gift:gifts) q.add(gift);
    while (k-- > 0) { int x=q.remove(); q.add((int)Math.sqrt(x)); }
    long sum=0; while (!q.isEmpty()) sum+=q.remove();
    return sum;
}`,
    python: `import heapq
import math

def pick_gifts(gifts, k):
    heap = [-gift for gift in gifts]
    heapq.heapify(heap)
    for _ in range(k):
        largest = -heapq.heappop(heap)
        heapq.heappush(heap, -math.isqrt(largest))
    return -sum(heap)`,
    cpp: `long long pickGifts(vector<int>& gifts, int k) {
    priority_queue<int> q(gifts.begin(),gifts.end());
    while (k--) { int x=q.top(); q.pop(); q.push(sqrt(x)); }
    long long sum=0; while (!q.empty()) { sum+=q.top(); q.pop(); }
    return sum;
}`,
  },
  "heaps-priority-queue-task-scheduler": {
    java: `int leastInterval(char[] tasks, int n) {
    int[] count = new int[26];
    for (char task:tasks) count[task-'A']++;
    PriorityQueue<Integer> q = new PriorityQueue<>(Collections.reverseOrder());
    for (int c:count) if (c>0) q.add(c);
    int time=0;
    while (!q.isEmpty()) {
        List<Integer> used=new ArrayList<>();
        for (int i=0;i<=n;i++) {
            if (!q.isEmpty()) { int c=q.remove()-1; if (c>0) used.add(c); }
            time++;
            if (q.isEmpty() && used.isEmpty()) break;
        }
        q.addAll(used);
    }
    return time;
}`,
    python: `from collections import Counter
import heapq

def least_interval(tasks, n):
    heap = [-count for count in Counter(tasks).values()]
    heapq.heapify(heap)
    time = 0
    while heap:
        waiting = []
        for _ in range(n + 1):
            if heap:
                count = heapq.heappop(heap) + 1
                if count:
                    waiting.append(count)
            time += 1
            if not heap and not waiting:
                break
        for count in waiting:
            heapq.heappush(heap, count)
    return time`,
    cpp: `int leastInterval(vector<char>& tasks, int n) {
    int count[26]={}; for(char c:tasks) count[c-'A']++;
    priority_queue<int> q; for(int c:count) if(c) q.push(c);
    int time=0;
    while(!q.empty()) {
        vector<int> used;
        for(int i=0;i<=n;i++) {
            if(!q.empty()){int c=q.top()-1;q.pop();if(c)used.push_back(c);}
            time++;
            if(q.empty()&&used.empty()) break;
        }
        for(int c:used) q.push(c);
    }
    return time;
}`,
  },
  "heaps-priority-queue-top-k-frequent-elements": {
    java: `int[] topKFrequent(int[] nums, int k) {
    Map<Integer,Integer> count = new HashMap<>();
    for (int n:nums) count.merge(n,1,Integer::sum);
    PriorityQueue<Integer> q = new PriorityQueue<>(Comparator.comparingInt(count::get));
    for (int n:count.keySet()) { q.add(n); if(q.size()>k) q.remove(); }
    return q.stream().mapToInt(Integer::intValue).toArray();
}`,
    python: `import heapq
from collections import Counter

def top_k_frequent(nums, k):
    return [value for value, _ in heapq.nlargest(k, Counter(nums).items(), key=lambda x: x[1])]`,
    cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> count; for(int n:nums) count[n]++;
    using P=pair<int,int>;
    priority_queue<P,vector<P>,greater<P>> q;
    for(auto [value,freq]:count) { q.push({freq,value}); if(q.size()>k) q.pop(); }
    vector<int> out; while(!q.empty()){out.push_back(q.top().second);q.pop();}
    return out;
}`,
  },
};

export function getHeapReferenceCode(slug, language) {
  return solutions[slug]?.[language] || "";
}
