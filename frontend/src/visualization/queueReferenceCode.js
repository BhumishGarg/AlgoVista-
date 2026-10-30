const tree = {
  levels: {
    java: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        while (size-- > 0) {
            TreeNode node = queue.remove();
            level.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        result.add(level);
    }
    return result;
}`,
    python: `from collections import deque

def level_order(root):
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
    cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int size = q.size();
        vector<int> level;
        while (size--) {
            auto node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
  },
  average: {
    java: `List<Double> averageOfLevels(TreeNode root) {
    List<Double> result = new ArrayList<>();
    Queue<TreeNode> q = new ArrayDeque<>(); q.add(root);
    while (!q.isEmpty()) {
        int size = q.size(); double sum = 0;
        for (int i = 0; i < size; i++) {
            TreeNode node = q.remove(); sum += node.val;
            if (node.left != null) q.add(node.left);
            if (node.right != null) q.add(node.right);
        }
        result.add(sum / size);
    }
    return result;
}`,
    python: `from collections import deque

def average_of_levels(root):
    result, q = [], deque([root])
    while q:
        total, size = 0, len(q)
        for _ in range(size):
            node = q.popleft(); total += node.val
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        result.append(total / size)
    return result`,
    cpp: `vector<double> averageOfLevels(TreeNode* root) {
    vector<double> result; queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int size = q.size(); long long sum = 0;
        for (int i = 0; i < size; ++i) {
            auto node = q.front(); q.pop(); sum += node->val;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(double(sum) / size);
    }
    return result;
}`,
  },
  zigzag: {
    java: `List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;
    Queue<TreeNode> q = new ArrayDeque<>(); q.add(root);
    boolean reverse = false;
    while (!q.isEmpty()) {
        int size = q.size(); LinkedList<Integer> level = new LinkedList<>();
        while (size-- > 0) {
            TreeNode n = q.remove();
            if (reverse) level.addFirst(n.val); else level.addLast(n.val);
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
        out.add(level); reverse = !reverse;
    }
    return out;
}`,
    python: `from collections import deque

def zigzag_level_order(root):
    if not root: return []
    out, q, reverse = [], deque([root]), False
    while q:
        level = deque()
        for _ in range(len(q)):
            node = q.popleft()
            (level.appendleft if reverse else level.append)(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        out.append(list(level)); reverse = not reverse
    return out`,
    cpp: `vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> out; if (!root) return out;
    queue<TreeNode*> q; q.push(root); bool reverse = false;
    while (!q.empty()) {
        int size = q.size(); vector<int> level(size);
        for (int i = 0; i < size; ++i) {
            auto n = q.front(); q.pop();
            level[reverse ? size - 1 - i : i] = n->val;
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(level); reverse = !reverse;
    }
    return out;
}`,
  },
};

const snippets = {
  deque: {
    java: `class MyCircularDeque {
    int[] data; int front = 0, size = 0;
    MyCircularDeque(int k) { data = new int[k]; }
boolean insertFront(int x) {
    if (size == data.length) return false;
    front = (front - 1 + data.length) % data.length; data[front] = x; size++;
    return true;
}
boolean insertLast(int x) {
    if (size == data.length) return false;
    data[(front + size++) % data.length] = x; return true;
}
boolean deleteFront() { if (size == 0) return false; front = (front + 1) % data.length; size--; return true; }
boolean deleteLast() { if (size == 0) return false; size--; return true; }
int getFront() { return size == 0 ? -1 : data[front]; }
int getRear() { return size == 0 ? -1 : data[(front + size - 1) % data.length]; }
boolean isEmpty() { return size == 0; }
boolean isFull() { return size == data.length; }
}`,
    python: `class MyCircularDeque:
    def __init__(self, k):
        self.data, self.front, self.size = [0] * k, 0, 0
    def insertFront(self, value):
        if self.size == len(self.data): return False
        self.front = (self.front - 1) % len(self.data)
        self.data[self.front] = value; self.size += 1
        return True
    def insertLast(self, value):
        if self.size == len(self.data): return False
        self.data[(self.front + self.size) % len(self.data)] = value
        self.size += 1; return True
    def deleteFront(self):
        if not self.size: return False
        self.front = (self.front + 1) % len(self.data); self.size -= 1
        return True
    def deleteLast(self):
        if not self.size: return False
        self.size -= 1; return True
    def getFront(self): return self.data[self.front] if self.size else -1
    def getRear(self): return self.data[(self.front + self.size - 1) % len(self.data)] if self.size else -1
    def isEmpty(self): return self.size == 0
    def isFull(self): return self.size == len(self.data)`,
    cpp: `class MyCircularDeque {
    vector<int> a; int front = 0, size = 0;
public:
    MyCircularDeque(int k) : a(k) {}
    bool insertFront(int x) {
        if (size == a.size()) return false;
        front = (front - 1 + a.size()) % a.size(); a[front] = x; ++size;
        return true;
    }
    bool insertLast(int x) {
        if (size == a.size()) return false;
        a[(front + size++) % a.size()] = x; return true;
    }
    bool deleteFront() {
        if (!size) return false;
        front = (front + 1) % a.size(); --size; return true;
    }
    bool deleteLast() { if (!size) return false; --size; return true; }
    int getFront() { return size ? a[front] : -1; }
    int getRear() { return size ? a[(front + size - 1) % a.size()] : -1; }
    bool isEmpty() { return size == 0; }
    bool isFull() { return size == a.size(); }
};`,
  },
  circular: {
    java: `// Circular queue: keep front and size; rear is (front + size - 1) % k.
boolean enQueue(int value) {
    if (size == data.length) return false;
    data[(front + size) % data.length] = value; size++;
    return true;
}
boolean deQueue() {
    if (size == 0) return false;
    front = (front + 1) % data.length; size--;
    return true;
}
int Front() { return size == 0 ? -1 : data[front]; }
int Rear() { return size == 0 ? -1 : data[(front + size - 1) % data.length]; }`,
    python: `class MyCircularQueue:
    def __init__(self, k):
        self.data, self.front, self.size = [None] * k, 0, 0
    def enQueue(self, value):
        if self.size == len(self.data): return False
        self.data[(self.front + self.size) % len(self.data)] = value
        self.size += 1; return True
    def deQueue(self):
        if not self.size: return False
        self.front = (self.front + 1) % len(self.data)
        self.size -= 1; return True
    def Front(self): return self.data[self.front] if self.size else -1
    def Rear(self): return self.data[(self.front + self.size - 1) % len(self.data)] if self.size else -1
    def isEmpty(self): return self.size == 0
    def isFull(self): return self.size == len(self.data)`,
    cpp: `class MyCircularQueue {
    vector<int> a; int front = 0, size = 0;
public:
    MyCircularQueue(int k) : a(k) {}
    bool enQueue(int x) {
        if (size == a.size()) return false;
        a[(front + size++) % a.size()] = x; return true;
    }
    bool deQueue() {
        if (!size) return false;
        front = (front + 1) % a.size(); --size; return true;
    }
    int Front() { return size ? a[front] : -1; }
    int Rear() { return size ? a[(front + size - 1) % a.size()] : -1; }
    bool isEmpty() { return size == 0; }
    bool isFull() { return size == a.size(); }
};`,
  },
  senate: {
    java: `String predictPartyVictory(String senate) {
    Queue<Integer> r = new ArrayDeque<>(), d = new ArrayDeque<>();
    for (int i = 0; i < senate.length(); i++)
        (senate.charAt(i) == 'R' ? r : d).add(i);
    while (!r.isEmpty() && !d.isEmpty()) {
        int ri = r.remove(), di = d.remove();
        if (ri < di) r.add(ri + senate.length()); else d.add(di + senate.length());
    }
    return r.isEmpty() ? "Dire" : "Radiant";
}`,
    python: `from collections import deque

def predict_party_victory(senate):
    r = deque(i for i, c in enumerate(senate) if c == "R")
    d = deque(i for i, c in enumerate(senate) if c == "D")
    while r and d:
        ri, di = r.popleft(), d.popleft()
        (r if ri < di else d).append((ri if ri < di else di) + len(senate))
    return "Radiant" if r else "Dire"`,
    cpp: `string predictPartyVictory(string senate) {
    queue<int> r, d;
    for (int i = 0; i < senate.size(); ++i)
        (senate[i] == 'R' ? r : d).push(i);
    while (!r.empty() && !d.empty()) {
        int ri = r.front(); r.pop(); int di = d.front(); d.pop();
        (ri < di ? r : d).push((ri < di ? ri : di) + senate.size());
    }
    return r.empty() ? "Dire" : "Radiant";
}`,
  },
  josephus: {
    java: `int findTheWinner(int n, int k) {
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 1; i <= n; i++) q.add(i);
    while (q.size() > 1) {
        for (int i = 1; i < k; i++) q.add(q.remove());
        q.remove();
    }
    return q.remove();
}`,
    python: `from collections import deque

def find_the_winner(n, k):
    q = deque(range(1, n + 1))
    while len(q) > 1:
        q.rotate(-(k - 1)); q.popleft()
    return q[0]`,
    cpp: `int findTheWinner(int n, int k) {
    queue<int> q;
    for (int i = 1; i <= n; ++i) q.push(i);
    while (q.size() > 1) {
        for (int i = 1; i < k; ++i) { q.push(q.front()); q.pop(); }
        q.pop();
    }
    return q.front();
}`,
  },
  queueStacks: {
    java: `class MyQueue {
    Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();
    void push(int x) { in.push(x); }
    private void transfer() {
        if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());
    }
    int pop() { transfer(); return out.pop(); }
    int peek() { transfer(); return out.peek(); }
    boolean empty() { return in.isEmpty() && out.isEmpty(); }
}`,
    python: `class MyQueue:
    def __init__(self): self.in_stack, self.out_stack = [], []
    def push(self, x): self.in_stack.append(x)
    def _transfer(self):
        if not self.out_stack:
            while self.in_stack: self.out_stack.append(self.in_stack.pop())
    def pop(self):
        self._transfer(); return self.out_stack.pop()
    def peek(self):
        self._transfer(); return self.out_stack[-1]
    def empty(self): return not self.in_stack and not self.out_stack`,
    cpp: `class MyQueue {
    stack<int> in, out;
    void transfer() {
        if (out.empty()) while (!in.empty()) { out.push(in.top()); in.pop(); }
    }
public:
    void push(int x) { in.push(x); }
    int pop() { transfer(); int x = out.top(); out.pop(); return x; }
    int peek() { transfer(); return out.top(); }
    bool empty() { return in.empty() && out.empty(); }
};`,
  },
  stackQueues: {
    java: `class MyStack {
    Queue<Integer> q = new ArrayDeque<>();
    void push(int x) {
        q.add(x);
        for (int i = 1; i < q.size(); i++) q.add(q.remove());
    }
    int pop() { return q.remove(); }
    int top() { return q.element(); }
    boolean empty() { return q.isEmpty(); }
}`,
    python: `from collections import deque

class MyStack:
    def __init__(self): self.q = deque()
    def push(self, x):
        self.q.append(x)
        for _ in range(len(self.q) - 1): self.q.append(self.q.popleft())
    def pop(self): return self.q.popleft()
    def top(self): return self.q[0]
    def empty(self): return not self.q`,
    cpp: `class MyStack {
    queue<int> q;
public:
    void push(int x) {
        q.push(x);
        for (int i = 1, n = q.size(); i < n; ++i) {
            q.push(q.front()); q.pop();
        }
    }
    int pop() { int x = q.front(); q.pop(); return x; }
    int top() { return q.front(); }
    bool empty() { return q.empty(); }
};`,
  },
  movingAverage: {
    java: `class MovingAverage {
    Queue<Integer> q = new ArrayDeque<>();
    int limit; double sum = 0;
    MovingAverage(int size) { limit = size; }
    double next(int value) {
        q.add(value); sum += value;
        if (q.size() > limit) sum -= q.remove();
        return sum / q.size();
    }
}`,
    python: `from collections import deque

class MovingAverage:
    def __init__(self, size):
        self.size, self.window, self.total = size, deque(), 0
    def next(self, value):
        self.window.append(value); self.total += value
        if len(self.window) > self.size: self.total -= self.window.popleft()
        return self.total / len(self.window)`,
    cpp: `class MovingAverage {
    queue<int> q; int limit; double sum = 0;
public:
    MovingAverage(int size) : limit(size) {}
    double next(int value) {
        q.push(value); sum += value;
        if (q.size() > limit) { sum -= q.front(); q.pop(); }
        return sum / q.size();
    }
};`,
  },
  recent: {
    java: `class RecentCounter {
    Queue<Integer> requests = new ArrayDeque<>();
    int ping(int t) {
        requests.add(t);
        while (requests.peek() < t - 3000) requests.remove();
        return requests.size();
    }
}`,
    python: `from collections import deque

class RecentCounter:
    def __init__(self): self.requests = deque()
    def ping(self, t):
        self.requests.append(t)
        while self.requests[0] < t - 3000: self.requests.popleft()
        return len(self.requests)`,
    cpp: `class RecentCounter {
    queue<int> requests;
public:
    int ping(int t) {
        requests.push(t);
        while (requests.front() < t - 3000) requests.pop();
        return requests.size();
    }
};`,
  },
  students: {
    java: `int countStudents(int[] students, int[] sandwiches) {
    Queue<Integer> q = new ArrayDeque<>();
    for (int s : students) q.add(s);
    int top = 0, skips = 0;
    while (!q.isEmpty() && skips < q.size()) {
        if (q.peek() == sandwiches[top]) {
            q.remove(); top++; skips = 0;
        } else { q.add(q.remove()); skips++; }
    }
    return q.size();
}`,
    python: `from collections import deque

def count_students(students, sandwiches):
    q = deque(students); top = skips = 0
    while q and skips < len(q):
        if q[0] == sandwiches[top]:
            q.popleft(); top += 1; skips = 0
        else:
            q.append(q.popleft()); skips += 1
    return len(q)`,
    cpp: `int countStudents(vector<int>& students, vector<int>& sandwiches) {
    queue<int> q; for (int s : students) q.push(s);
    int top = 0, skips = 0;
    while (!q.empty() && skips < q.size()) {
        if (q.front() == sandwiches[top]) { q.pop(); ++top; skips = 0; }
        else { q.push(q.front()); q.pop(); ++skips; }
    }
    return q.size();
}`,
  },
  lock: {
    java: `int openLock(String[] deadends, String target) {
    Set<String> dead = Set.of(deadends), seen = new HashSet<>(dead);
    Queue<String> q = new ArrayDeque<>(); q.add("0000");
    if (seen.contains("0000")) return -1;
    seen.add("0000");
    for (int turns = 0; !q.isEmpty(); turns++) {
        for (int n = q.size(); n > 0; n--) {
            String s = q.remove(); if (s.equals(target)) return turns;
            for (String next : neighbors(s)) if (seen.add(next) && !dead.contains(next)) q.add(next);
        }
    }
    return -1;
}`,
    python: `from collections import deque

def open_lock(deadends, target):
    dead, seen = set(deadends), {"0000"}
    if "0000" in dead: return -1
    q = deque([("0000", 0)])
    while q:
        state, turns = q.popleft()
        if state == target: return turns
        for i in range(4):
            for step in (-1, 1):
                d = (int(state[i]) + step) % 10
                nxt = state[:i] + str(d) + state[i + 1:]
                if nxt not in dead and nxt not in seen:
                    seen.add(nxt); q.append((nxt, turns + 1))
    return -1`,
    cpp: `int openLock(vector<string>& deadends, string target) {
    unordered_set<string> dead(deadends.begin(), deadends.end()), seen{"0000"};
    if (dead.count("0000")) return -1;
    queue<pair<string,int>> q; q.push({"0000", 0});
    while (!q.empty()) {
        auto [s, d] = q.front(); q.pop();
        if (s == target) return d;
        for (int i = 0; i < 4; ++i) for (int step : {-1, 1}) {
            string t = s; t[i] = char('0' + (t[i] - '0' + step + 10) % 10);
            if (!dead.count(t) && seen.insert(t).second) q.push({t, d + 1});
        }
    }
    return -1;
}`,
  },
  squares: {
    java: `int numSquares(int n) {
    Queue<Integer> q = new ArrayDeque<>(); q.add(n);
    boolean[] seen = new boolean[n + 1]; seen[n] = true;
    for (int depth = 1; !q.isEmpty(); depth++) {
        for (int size = q.size(); size > 0; size--) {
            int x = q.remove();
            for (int s = 1; s * s <= x; s++) {
                int next = x - s * s;
                if (next == 0) return depth;
                if (!seen[next]) { seen[next] = true; q.add(next); }
            }
        }
    }
    return 0;
}`,
    python: `from collections import deque

def num_squares(n):
    q, seen = deque([n]), {n}
    depth = 0
    while q:
        depth += 1
        for _ in range(len(q)):
            x = q.popleft()
            for s in range(1, int(x ** .5) + 1):
                nxt = x - s * s
                if nxt == 0: return depth
                if nxt not in seen: seen.add(nxt); q.append(nxt)
    return 0`,
    cpp: `int numSquares(int n) {
    queue<int> q; q.push(n);
    vector<bool> seen(n + 1); seen[n] = true;
    for (int depth = 1; !q.empty(); ++depth) {
        for (int size = q.size(); size > 0; --size) {
            int x = q.front(); q.pop();
            for (int s = 1; s * s <= x; ++s) {
                int next = x - s * s;
                if (!next) return depth;
                if (!seen[next]) { seen[next] = true; q.push(next); }
            }
        }
    }
    return 0;
}`,
  },
  reveal: {
    java: `int[] deckRevealedIncreasing(int[] deck) {
    Arrays.sort(deck);
    Queue<Integer> indices = new ArrayDeque<>();
    for (int i = 0; i < deck.length; i++) indices.add(i);
    int[] answer = new int[deck.length];
    for (int card : deck) {
        answer[indices.remove()] = card;
        if (!indices.isEmpty()) indices.add(indices.remove());
    }
    return answer;
}`,
    python: `from collections import deque

def deck_revealed_increasing(deck):
    q = deque(range(len(deck))); answer = [0] * len(deck)
    for card in sorted(deck):
        index = q.popleft()
        answer[index] = card
        if q: q.rotate(-1)
    return answer`,
    cpp: `vector<int> deckRevealedIncreasing(vector<int>& deck) {
    sort(deck.begin(), deck.end());
    queue<int> q; for (int i = 0; i < deck.size(); ++i) q.push(i);
    vector<int> answer(deck.size());
    for (int card : deck) {
        answer[q.front()] = card; q.pop();
        if (!q.empty()) { q.push(q.front()); q.pop(); }
    }
    return answer;
}`,
  },
  oranges: {
    java: `int orangesRotting(int[][] grid) {
    Queue<int[]> q = new ArrayDeque<>(); int fresh = 0, minutes = 0;
    for (int r = 0; r < grid.length; r++) for (int c = 0; c < grid[0].length; c++)
        if (grid[r][c] == 2) q.add(new int[]{r,c}); else if (grid[r][c] == 1) fresh++;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.isEmpty() && fresh > 0) {
        for (int n = q.size(); n > 0; n--) {
            int[] p = q.remove();
            for (int[] d : dirs) { int r=p[0]+d[0], c=p[1]+d[1];
                if (r>=0 && c>=0 && r<grid.length && c<grid[0].length && grid[r][c]==1) {
                    grid[r][c]=2; fresh--; q.add(new int[]{r,c});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}`,
    python: `from collections import deque

def oranges_rotting(grid):
    q, fresh = deque(), 0
    for r, row in enumerate(grid):
        for c, cell in enumerate(row):
            if cell == 2: q.append((r, c))
            elif cell == 1: fresh += 1
    minutes = 0
    while q and fresh:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == 1:
                    grid[nr][nc] = 2; fresh -= 1; q.append((nr, nc))
        minutes += 1
    return minutes if fresh == 0 else -1`,
    cpp: `int orangesRotting(vector<vector<int>>& grid) {
    queue<pair<int,int>> q; int fresh = 0, minutes = 0;
    for (int r=0;r<grid.size();r++) for(int c=0;c<grid[0].size();c++)
        if(grid[r][c]==2) q.push({r,c}); else if(grid[r][c]==1) fresh++;
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    while(!q.empty() && fresh) {
        for(int n=q.size();n>0;--n) { auto [r,c]=q.front(); q.pop();
            for(auto& d:dirs) { int nr=r+d[0], nc=c+d[1];
                if(nr>=0&&nc>=0&&nr<grid.size()&&nc<grid[0].size()&&grid[nr][nc]==1)
                    grid[nr][nc]=2, --fresh, q.push({nr,nc});
            }
        } ++minutes;
    }
    return fresh ? -1 : minutes;
}`,
  },
  matrix: {
    java: `int shortestPathBinaryMatrix(int[][] grid) {
    int n = grid.length;
    if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;
    Queue<int[]> q = new ArrayDeque<>(); q.add(new int[]{0,0,1}); grid[0][0] = 1;
    int[] dirs = {-1,0,1};
    while (!q.isEmpty()) {
        int[] p = q.remove();
        if (p[0] == n-1 && p[1] == n-1) return p[2];
        for (int dr : dirs) for (int dc : dirs) {
            int r=p[0]+dr,c=p[1]+dc;
            if ((dr!=0||dc!=0)&&r>=0&&c>=0&&r<n&&c<n&&grid[r][c]==0) {
                grid[r][c]=1; q.add(new int[]{r,c,p[2]+1});
            }
        }
    }
    return -1;
}`,
    python: `from collections import deque

def shortest_path_binary_matrix(grid):
    n = len(grid)
    if grid[0][0] or grid[-1][-1]: return -1
    q = deque([(0, 0, 1)]); grid[0][0] = 1
    while q:
        r, c, dist = q.popleft()
        if (r, c) == (n - 1, n - 1): return dist
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                    grid[nr][nc] = 1; q.append((nr, nc, dist + 1))
    return -1`,
    cpp: `int shortestPathBinaryMatrix(vector<vector<int>>& g) {
    int n=g.size(); if(g[0][0] || g[n-1][n-1]) return -1;
    queue<array<int,3>> q; q.push({0,0,1}); g[0][0]=1;
    while(!q.empty()) { auto [r,c,d]=q.front(); q.pop();
        if(r==n-1&&c==n-1) return d;
        for(int dr=-1;dr<=1;dr++) for(int dc=-1;dc<=1;dc++) {
            int nr=r+dr,nc=c+dc;
            if((dr||dc)&&nr>=0&&nc>=0&&nr<n&&nc<n&&g[nr][nc]==0)
                g[nr][nc]=1,q.push({nr,nc,d+1});
        }
    }
    return -1;
}`,
  },
  sliding: {
    java: `int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> q = new ArrayDeque<>();
    int[] answer = new int[nums.length - k + 1];
    for (int i = 0; i < nums.length; i++) {
        while (!q.isEmpty() && q.peekFirst() <= i - k) q.removeFirst();
        while (!q.isEmpty() && nums[q.peekLast()] <= nums[i]) q.removeLast();
        q.addLast(i);
        if (i >= k - 1) answer[i - k + 1] = nums[q.peekFirst()];
    }
    return answer;
}`,
    python: `from collections import deque

def max_sliding_window(nums, k):
    q, answer = deque(), []
    for i, value in enumerate(nums):
        while q and q[0] <= i - k: q.popleft()
        while q and nums[q[-1]] <= value: q.pop()
        q.append(i)
        if i >= k - 1: answer.append(nums[q[0]])
    return answer`,
    cpp: `vector<int> maxSlidingWindow(vector<int>& a, int k) {
    deque<int> q; vector<int> out;
    for (int i=0;i<a.size();++i) {
        while (!q.empty() && q.front() <= i-k) q.pop_front();
        while (!q.empty() && a[q.back()] <= a[i]) q.pop_back();
        q.push_back(i);
        if (i >= k-1) out.push_back(a[q.front()]);
    }
    return out;
}`,
  },
  tickets: {
    java: `int timeRequiredToBuy(int[] tickets, int k) {
    int time = 0;
    for (int i = 0; i < tickets.length; i++)
        time += Math.min(tickets[i], tickets[k] - (i > k ? 1 : 0));
    return time;
}`,
    python: `def time_required_to_buy(tickets, k):
    return sum(min(t, tickets[k] - (i > k))
               for i, t in enumerate(tickets))`,
    cpp: `int timeRequiredToBuy(vector<int>& tickets, int k) {
    int time = 0;
    for (int i = 0; i < tickets.size(); ++i)
        time += min(tickets[i], tickets[k] - (i > k));
    return time;
}`,
  },
  wordLadder: {
    java: `int ladderLength(String begin, String end, List<String> words) {
        if (begin.equals(end)) return 1;
        Set<String> dict = new HashSet<>(words);
    if (!dict.contains(end)) return 0;
    Queue<String> q = new ArrayDeque<>(); q.add(begin);
    int length = 1;
    while (!q.isEmpty()) {
        for (int n=q.size(); n>0; n--) {
            char[] word = q.remove().toCharArray();
            for (int i=0;i<word.length;i++) {
                char old=word[i];
                for (char c='a';c<='z';c++) {
                    word[i]=c; String next=new String(word);
                    if (next.equals(end)) return length+1;
                    if (dict.remove(next)) q.add(next);
                }
                word[i]=old;
            }
        }
        length++;
    }
    return 0;
}`,
    python: `from collections import deque

def ladder_length(begin, end, words):
    if begin == end: return 1
    remaining = set(words)
    if end not in remaining: return 0
    q, length = deque([begin]), 1
    while q:
        for _ in range(len(q)):
            word = q.popleft()
            for i, old in enumerate(word):
                for char in "abcdefghijklmnopqrstuvwxyz":
                    nxt = word[:i] + char + word[i+1:]
                    if nxt == end: return length + 1
                    if nxt in remaining:
                        remaining.remove(nxt); q.append(nxt)
        length += 1
    return 0`,
    cpp: `int ladderLength(string begin, string end, vector<string>& words) {
        if (begin == end) return 1;
        unordered_set<string> dict(words.begin(), words.end());
    if (!dict.count(end)) return 0;
    queue<string> q; q.push(begin); int length=1;
    while (!q.empty()) {
        for (int n=q.size();n>0;--n) {
            string word=q.front(); q.pop();
            for (int i=0;i<word.size();++i) {
                char old=word[i];
                for(char c='a';c<='z';++c) { word[i]=c;
                    if(word==end) return length+1;
                    if(dict.erase(word)) q.push(word);
                }
                word[i]=old;
            }
        }
        ++length;
    }
    return 0;
}`,
  },
};

const slugGroups = {
  "queues-average-of-levels-in-binary-tree": tree.average,
  "queues-binary-tree-level-order-traversal": tree.levels,
  "queues-binary-tree-zigzag-level-order-traversal": tree.zigzag,
  "queues-design-circular-deque": snippets.deque,
  "queues-design-circular-queue": snippets.circular,
  "queues-dota2-senate": snippets.senate,
  "queues-find-the-winner-of-the-circular-game": snippets.josephus,
  "queues-implement-queue-using-stacks": snippets.queueStacks,
  "queues-implement-stack-using-queues": snippets.stackQueues,
  "queues-moving-average-from-data-stream": snippets.movingAverage,
  "queues-number-of-recent-calls": snippets.recent,
  "queues-number-of-students-unable-to-eat-lunch": snippets.students,
  "queues-open-the-lock": snippets.lock,
  "queues-perfect-squares": snippets.squares,
  "queues-reveal-cards-in-increasing-order": snippets.reveal,
  "queues-rotting-oranges": snippets.oranges,
  "queues-shortest-path-in-binary-matrix": snippets.matrix,
  "queues-sliding-window-maximum": snippets.sliding,
  "queues-time-needed-to-buy-tickets": snippets.tickets,
  "queues-word-ladder": snippets.wordLadder,
};

export function getQueueReferenceCode(slug, language) {
  return slugGroups[slug]?.[language] || null;
}
