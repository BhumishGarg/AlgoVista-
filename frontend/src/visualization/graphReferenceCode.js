const solutions = {
  "graphs-accounts-merge": {
    java: `List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, String> owner = new HashMap<>();
    Map<String, List<String>> graph = new HashMap<>();
    for (List<String> account : accounts) {
        String first = account.get(1);
        for (int i = 1; i < account.size(); i++) {
            owner.put(account.get(i), account.get(0));
            graph.computeIfAbsent(first, k -> new ArrayList<>()).add(account.get(i));
            graph.computeIfAbsent(account.get(i), k -> new ArrayList<>()).add(first);
        }
    }
    Set<String> seen = new HashSet<>();
    List<List<String>> result = new ArrayList<>();
    for (String email : graph.keySet()) if (seen.add(email)) {
        List<String> group = new ArrayList<>();
        Deque<String> stack = new ArrayDeque<>(); stack.push(email);
        while (!stack.isEmpty()) {
            String current = stack.pop(); group.add(current);
            for (String next : graph.get(current)) if (seen.add(next)) stack.push(next);
        }
        Collections.sort(group); group.add(0, owner.get(email)); result.add(group);
    }
    return result;
}`,
    python: `from collections import defaultdict

def accounts_merge(accounts):
    graph, owner = defaultdict(list), {}
    for account in accounts:
        name, *emails = account
        for email in emails:
            owner[email] = name
            graph[emails[0]].append(email)
            graph[email].append(emails[0])
    seen, result = set(), []
    for email in graph:
        if email in seen:
            continue
        stack, group = [email], []
        seen.add(email)
        while stack:
            current = stack.pop()
            group.append(current)
            for neighbor in graph[current]:
                if neighbor not in seen:
                    seen.add(neighbor)
                    stack.append(neighbor)
        result.append([owner[email], *sorted(group)])
    return result`,
    cpp: `vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string, vector<string>> graph;
    unordered_map<string, string> owner;
    for (auto& account : accounts) {
        string first = account[1];
        for (int i = 1; i < account.size(); ++i) {
            owner[account[i]] = account[0];
            graph[first].push_back(account[i]);
            graph[account[i]].push_back(first);
        }
    }
    unordered_set<string> seen;
    vector<vector<string>> result;
    for (auto& [email, neighbors] : graph) if (seen.insert(email).second) {
        vector<string> group; stack<string> pending; pending.push(email);
        while (!pending.empty()) {
            string current = pending.top(); pending.pop(); group.push_back(current);
            for (auto& next : graph[current]) if (seen.insert(next).second) pending.push(next);
        }
        sort(group.begin(), group.end()); group.insert(group.begin(), owner[email]); result.push_back(group);
    }
    return result;
}`,
  },
  "graphs-cheapest-flights-within-k-stops": {
    java: `int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int[] cost = new int[n]; Arrays.fill(cost, Integer.MAX_VALUE); cost[src] = 0;
    for (int i = 0; i <= k; i++) {
        int[] next = cost.clone();
        for (int[] flight : flights) if (cost[flight[0]] != Integer.MAX_VALUE)
            next[flight[1]] = Math.min(next[flight[1]], cost[flight[0]] + flight[2]);
        cost = next;
    }
    return cost[dst] == Integer.MAX_VALUE ? -1 : cost[dst];
}`,
    python: `def find_cheapest_price(n, flights, src, dst, k):
    cost = [float("inf")] * n
    cost[src] = 0
    for _ in range(k + 1):
        next_cost = cost[:]
        for start, end, price in flights:
            if cost[start] != float("inf"):
                next_cost[end] = min(next_cost[end], cost[start] + price)
        cost = next_cost
    return -1 if cost[dst] == float("inf") else cost[dst]`,
    cpp: `int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> cost(n, INT_MAX); cost[src] = 0;
    for (int i = 0; i <= k; ++i) {
        auto next = cost;
        for (auto& f : flights) if (cost[f[0]] != INT_MAX)
            next[f[1]] = min(next[f[1]], cost[f[0]] + f[2]);
        cost = move(next);
    }
    return cost[dst] == INT_MAX ? -1 : cost[dst];
}`,
  },
  "graphs-clone-graph": {
    java: `Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> copies = new HashMap<>();
    Queue<Node> queue = new ArrayDeque<>();
    copies.put(node, new Node(node.val)); queue.add(node);
    while (!queue.isEmpty()) {
        Node current = queue.remove();
        for (Node neighbor : current.neighbors) {
            if (!copies.containsKey(neighbor)) {
                copies.put(neighbor, new Node(neighbor.val)); queue.add(neighbor);
            }
            copies.get(current).neighbors.add(copies.get(neighbor));
        }
    }
    return copies.get(node);
}`,
    python: `def clone_graph(node):
    if not node:
        return None
    copies = {node: Node(node.val)}
    queue = [node]
    for current in queue:
        for neighbor in current.neighbors:
            if neighbor not in copies:
                copies[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            copies[current].neighbors.append(copies[neighbor])
    return copies[node]`,
    cpp: `Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    unordered_map<Node*, Node*> copies;
    queue<Node*> q; q.push(node); copies[node] = new Node(node->val);
    while (!q.empty()) {
        Node* current = q.front(); q.pop();
        for (Node* neighbor : current->neighbors) {
            if (!copies.count(neighbor)) {
                copies[neighbor] = new Node(neighbor->val); q.push(neighbor);
            }
            copies[current]->neighbors.push_back(copies[neighbor]);
        }
    }
    return copies[node];
}`,
  },
  "graphs-course-schedule": {
    java: `boolean canFinish(int n, int[][] prerequisites) {
    List<Integer>[] graph = new List[n]; Arrays.setAll(graph, i -> new ArrayList<>());
    int[] indegree = new int[n];
    for (int[] p : prerequisites) { graph[p[1]].add(p[0]); indegree[p[0]]++; }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indegree[i] == 0) q.add(i);
    int done = 0;
    while (!q.isEmpty()) {
        int course = q.remove(); done++;
        for (int next : graph[course]) if (--indegree[next] == 0) q.add(next);
    }
    return done == n;
}`,
    python: `from collections import deque

def can_finish(n, prerequisites):
    graph = [[] for _ in range(n)]
    indegree = [0] * n
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1
    queue = deque(i for i, degree in enumerate(indegree) if degree == 0)
    completed = 0
    while queue:
        course = queue.popleft()
        completed += 1
        for next_course in graph[course]:
            indegree[next_course] -= 1
            if indegree[next_course] == 0:
                queue.append(next_course)
    return completed == n`,
    cpp: `bool canFinish(int n, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(n); vector<int> indegree(n);
    for (auto& p : prerequisites) { graph[p[1]].push_back(p[0]); indegree[p[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; ++i) if (!indegree[i]) q.push(i);
    int done = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); ++done;
        for (int v : graph[u]) if (--indegree[v] == 0) q.push(v);
    }
    return done == n;
}`,
  },
  "graphs-course-schedule-ii": {
    java: `int[] findOrder(int n, int[][] prerequisites) {
    List<Integer>[] graph = new List[n]; Arrays.setAll(graph, i -> new ArrayList<>());
    int[] indegree = new int[n], order = new int[n];
    for (int[] p : prerequisites) { graph[p[1]].add(p[0]); indegree[p[0]]++; }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indegree[i] == 0) q.add(i);
    int size = 0;
    while (!q.isEmpty()) {
        int u = q.remove(); order[size++] = u;
        for (int v : graph[u]) if (--indegree[v] == 0) q.add(v);
    }
    return size == n ? order : new int[0];
}`,
    python: `from collections import deque

def find_order(n, prerequisites):
    graph = [[] for _ in range(n)]
    indegree = [0] * n
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1
    queue = deque(i for i, degree in enumerate(indegree) if degree == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    return order if len(order) == n else []`,
    cpp: `vector<int> findOrder(int n, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(n); vector<int> indegree(n);
    for (auto& p : prerequisites) { graph[p[1]].push_back(p[0]); indegree[p[0]]++; }
    queue<int> q; vector<int> order;
    for (int i = 0; i < n; ++i) if (!indegree[i]) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : graph[u]) if (--indegree[v] == 0) q.push(v);
    }
    return order.size() == n ? order : vector<int>{};
}`,
  },
  "graphs-evaluate-division": {
    java: `double[] calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
    Map<String, Map<String, Double>> graph = new HashMap<>();
    for (int i = 0; i < values.length; i++) {
        String a = equations.get(i).get(0), b = equations.get(i).get(1);
        double value = values[i];
        graph.computeIfAbsent(a, x -> new HashMap<>()).put(b, value);
        graph.computeIfAbsent(b, x -> new HashMap<>()).put(a, 1.0 / value);
    }
    double[] answer = new double[queries.size()];
    for (int i = 0; i < answer.length; i++) {
        String a = queries.get(i).get(0), b = queries.get(i).get(1);
        answer[i] = !graph.containsKey(a) || !graph.containsKey(b) ? -1 : dfs(a, b, 1, graph, new HashSet<>());
    }
    return answer;
}
double dfs(String a, String b, double value, Map<String, Map<String, Double>> g, Set<String> seen) {
    if (a.equals(b)) return value;
    seen.add(a);
    for (var edge : g.get(a).entrySet()) if (seen.add(edge.getKey())) {
        double result = dfs(edge.getKey(), b, value * edge.getValue(), g, seen);
        if (result != -1) return result;
    }
    return -1;
}`,
    python: `from collections import defaultdict

def calc_equation(equations, values, queries):
    graph = defaultdict(dict)
    for (a, b), value in zip(equations, values):
        graph[a][b] = value
        graph[b][a] = 1 / value
    def search(start, end, seen):
        if start == end:
            return 1.0
        seen.add(start)
        for neighbor, weight in graph[start].items():
            if neighbor not in seen:
                result = search(neighbor, end, seen)
                if result != -1:
                    return weight * result
        return -1.0
    return [search(a, b, set()) if a in graph and b in graph else -1.0 for a, b in queries]`,
    cpp: `vector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values, vector<vector<string>>& queries) {
    unordered_map<string, vector<pair<string,double>>> graph;
    for (int i = 0; i < values.size(); ++i) {
        auto a = equations[i][0], b = equations[i][1];
        graph[a].push_back({b, values[i]}); graph[b].push_back({a, 1.0 / values[i]});
    }
    function<double(string,string,unordered_set<string>&)> dfs = [&](string a, string b, auto& seen) -> double {
        if (a == b) return 1;
        seen.insert(a);
        for (auto& [next, weight] : graph[a]) if (!seen.count(next)) {
            seen.insert(next); double result = dfs(next, b, seen);
            if (result != -1) return weight * result;
        }
        return -1;
    };
    vector<double> out;
    for (auto& q : queries) {
        unordered_set<string> seen;
        out.push_back(graph.count(q[0]) && graph.count(q[1]) ? dfs(q[0], q[1], seen) : -1);
    }
    return out;
}`,
  },
  "graphs-graph-valid-tree": {
    java: `boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;
    List<Integer>[] graph = new List[n]; Arrays.setAll(graph, i -> new ArrayList<>());
    for (int[] e : edges) { graph[e[0]].add(e[1]); graph[e[1]].add(e[0]); }
    boolean[] seen = new boolean[n]; Queue<Integer> q = new ArrayDeque<>();
    q.add(0); seen[0] = true; int count = 0;
    while (!q.isEmpty()) { int u = q.remove(); count++;
        for (int v : graph[u]) if (!seen[v]) { seen[v] = true; q.add(v); }
    }
    return count == n;
}`,
    python: `from collections import deque

def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False
    graph = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b); graph[b].append(a)
    seen, queue = {0}, deque([0])
    while queue:
        for neighbor in graph[queue.popleft()]:
            if neighbor not in seen:
                seen.add(neighbor); queue.append(neighbor)
    return len(seen) == n`,
    cpp: `bool validTree(int n, vector<vector<int>>& edges) {
    if (edges.size() != n - 1) return false;
    vector<vector<int>> graph(n);
    for (auto& e : edges) { graph[e[0]].push_back(e[1]); graph[e[1]].push_back(e[0]); }
    vector<bool> seen(n); queue<int> q; q.push(0); seen[0] = true; int count = 0;
    while (!q.empty()) { int u = q.front(); q.pop(); ++count;
        for (int v : graph[u]) if (!seen[v]) { seen[v] = true; q.push(v); }
    }
    return count == n;
}`,
  },
  "graphs-is-graph-bipartite": {
    java: `boolean isBipartite(int[][] graph) {
    int[] color = new int[graph.length];
    for (int start = 0; start < graph.length; start++) if (color[start] == 0) {
        Queue<Integer> q = new ArrayDeque<>(); q.add(start); color[start] = 1;
        while (!q.isEmpty()) {
            int u = q.remove();
            for (int v : graph[u]) {
                if (color[v] == color[u]) return false;
                if (color[v] == 0) { color[v] = -color[u]; q.add(v); }
            }
        }
    }
    return true;
}`,
    python: `from collections import deque

def is_bipartite(graph):
    color = [0] * len(graph)
    for start in range(len(graph)):
        if color[start]:
            continue
        color[start] = 1
        queue = deque([start])
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if color[neighbor] == color[node]:
                    return False
                if not color[neighbor]:
                    color[neighbor] = -color[node]
                    queue.append(neighbor)
    return True`,
    cpp: `bool isBipartite(vector<vector<int>>& graph) {
    vector<int> color(graph.size());
    for (int start = 0; start < graph.size(); ++start) if (!color[start]) {
        queue<int> q; q.push(start); color[start] = 1;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : graph[u]) {
                if (color[v] == color[u]) return false;
                if (!color[v]) { color[v] = -color[u]; q.push(v); }
            }
        }
    }
    return true;
}`,
  },
  "graphs-min-cost-to-connect-all-points": {
    java: `int minCostConnectPoints(int[][] points) {
    int n = points.length, answer = 0;
    int[] best = new int[n]; Arrays.fill(best, Integer.MAX_VALUE); best[0] = 0;
    boolean[] used = new boolean[n];
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int i = 0; i < n; i++) if (!used[i] && (u < 0 || best[i] < best[u])) u = i;
        used[u] = true; answer += best[u];
        for (int v = 0; v < n; v++) if (!used[v])
            best[v] = Math.min(best[v], Math.abs(points[u][0]-points[v][0]) + Math.abs(points[u][1]-points[v][1]));
    }
    return answer;
}`,
    python: `def min_cost_connect_points(points):
    n = len(points)
    best = [float("inf")] * n
    best[0] = total = 0
    used = [False] * n
    for _ in range(n):
        u = min((i for i in range(n) if not used[i]), key=lambda i: best[i])
        used[u] = True
        total += best[u]
        for v in range(n):
            if not used[v]:
                cost = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                best[v] = min(best[v], cost)
    return total`,
    cpp: `int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size(), total = 0;
    vector<int> best(n, INT_MAX); vector<bool> used(n); best[0] = 0;
    for (int step = 0; step < n; ++step) {
        int u = -1;
        for (int i = 0; i < n; ++i) if (!used[i] && (u < 0 || best[i] < best[u])) u = i;
        used[u] = true; total += best[u];
        for (int v = 0; v < n; ++v) if (!used[v])
            best[v] = min(best[v], abs(points[u][0]-points[v][0]) + abs(points[u][1]-points[v][1]));
    }
    return total;
}`,
  },
  "graphs-network-delay-time": {
    java: `int networkDelayTime(int[][] times, int n, int k) {
    List<int[]>[] graph = new List[n + 1]; Arrays.setAll(graph, i -> new ArrayList<>());
    for (int[] e : times) graph[e[0]].add(new int[]{e[1], e[2]});
    int[] dist = new int[n + 1]; Arrays.fill(dist, Integer.MAX_VALUE); dist[k] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    pq.add(new int[]{k, 0});
    while (!pq.isEmpty()) {
        int[] cur = pq.remove(); int u = cur[0], d = cur[1];
        if (d != dist[u]) continue;
        for (int[] e : graph[u]) if (d + e[1] < dist[e[0]]) {
            dist[e[0]] = d + e[1]; pq.add(new int[]{e[0], dist[e[0]]});
        }
    }
    int max = 0; for (int i = 1; i <= n; i++) max = Math.max(max, dist[i]);
    return max == Integer.MAX_VALUE ? -1 : max;
}`,
    python: `import heapq

def network_delay_time(times, n, k):
    graph = [[] for _ in range(n + 1)]
    for u, v, w in times:
        graph[u].append((v, w))
    dist = [float("inf")] * (n + 1)
    dist[k] = 0
    heap = [(0, k)]
    while heap:
        d, u = heapq.heappop(heap)
        if d != dist[u]:
            continue
        for v, weight in graph[u]:
            if d + weight < dist[v]:
                dist[v] = d + weight
                heapq.heappush(heap, (dist[v], v))
    answer = max(dist[1:])
    return -1 if answer == float("inf") else answer`,
    cpp: `int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> graph(n + 1);
    for (auto& e : times) graph[e[0]].push_back({e[1], e[2]});
    vector<int> dist(n + 1, INT_MAX); dist[k] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, k});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : graph[u]) if (d + w < dist[v]) {
            dist[v] = d + w; pq.push({dist[v], v});
        }
    }
    int answer = *max_element(dist.begin() + 1, dist.end());
    return answer == INT_MAX ? -1 : answer;
}`,
  },
  "graphs-number-of-islands": {
    java: `int numIslands(char[][] grid) {
    int m = grid.length, n = grid[0].length, count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) if (grid[r][c] == '1') {
        count++; Queue<int[]> q = new ArrayDeque<>(); q.add(new int[]{r,c}); grid[r][c] = '0';
        while (!q.isEmpty()) { int[] p = q.remove();
            for (int[] d : dirs) { int x=p[0]+d[0], y=p[1]+d[1];
                if (x>=0&&x<m&&y>=0&&y<n&&grid[x][y]=='1') { grid[x][y]='0'; q.add(new int[]{x,y}); }
            }
        }
    }
    return count;
}`,
    python: `from collections import deque

def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != "1":
                continue
            count += 1
            grid[r][c] = "0"
            queue = deque([(r, c)])
            while queue:
                x, y = queue.popleft()
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == "1":
                        grid[nx][ny] = "0"
                        queue.append((nx, ny))
    return count`,
    cpp: `int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), count = 0;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r=0;r<m;r++) for (int c=0;c<n;c++) if (grid[r][c]=='1') {
        ++count; queue<pair<int,int>> q; q.push({r,c}); grid[r][c]='0';
        while (!q.empty()) { auto [x,y]=q.front();q.pop();
            for (auto& d:dirs) { int a=x+d[0],b=y+d[1];
                if(a>=0&&a<m&&b>=0&&b<n&&grid[a][b]=='1'){grid[a][b]='0';q.push({a,b});}
            }
        }
    }
    return count;
}`,
  },
  "graphs-number-of-provinces": {
    java: `int findCircleNum(int[][] isConnected) {
    int n = isConnected.length, count = 0;
    boolean[] seen = new boolean[n];
    for (int i = 0; i < n; i++) if (!seen[i]) {
        count++; Queue<Integer> q = new ArrayDeque<>(); q.add(i); seen[i] = true;
        while (!q.isEmpty()) { int u = q.remove();
            for (int v = 0; v < n; v++) if (isConnected[u][v] == 1 && !seen[v]) { seen[v] = true; q.add(v); }
        }
    }
    return count;
}`,
    python: `from collections import deque

def find_circle_num(is_connected):
    n, seen, provinces = len(is_connected), set(), 0
    for city in range(n):
        if city in seen:
            continue
        provinces += 1
        seen.add(city)
        queue = deque([city])
        while queue:
            current = queue.popleft()
            for neighbor, connected in enumerate(is_connected[current]):
                if connected and neighbor not in seen:
                    seen.add(neighbor)
                    queue.append(neighbor)
    return provinces`,
    cpp: `int findCircleNum(vector<vector<int>>& isConnected) {
    int n = isConnected.size(), provinces = 0;
    vector<bool> seen(n);
    for (int i = 0; i < n; ++i) if (!seen[i]) {
        ++provinces; queue<int> q; q.push(i); seen[i] = true;
        while (!q.empty()) { int u=q.front();q.pop();
            for(int v=0;v<n;v++) if(isConnected[u][v]&&!seen[v]){seen[v]=true;q.push(v);}
        }
    }
    return provinces;
}`,
  },
  "graphs-open-the-lock": {
    java: `int openLock(String[] deadends, String target) {
    Set<String> dead = new HashSet<>(Arrays.asList(deadends));
    if (dead.contains("0000")) return -1;
    Queue<String> q = new ArrayDeque<>(); q.add("0000");
    Set<String> seen = new HashSet<>(); seen.add("0000");
    for (int steps = 0; !q.isEmpty(); steps++) {
        for (int size = q.size(); size > 0; size--) {
            String s = q.remove(); if (s.equals(target)) return steps;
            for (int i = 0; i < 4; i++) for (int d : new int[]{-1,1}) {
                char[] a = s.toCharArray(); a[i] = (char)('0' + (a[i]-'0'+d+10)%10);
                String next = new String(a);
                if (!dead.contains(next) && seen.add(next)) q.add(next);
            }
        }
    }
    return -1;
}`,
    python: `from collections import deque

def open_lock(deadends, target):
    dead = set(deadends)
    if "0000" in dead:
        return -1
    queue = deque([("0000", 0)])
    seen = {"0000"}
    while queue:
        state, moves = queue.popleft()
        if state == target:
            return moves
        for i in range(4):
            digit = int(state[i])
            for step in (-1, 1):
                next_state = state[:i] + str((digit + step) % 10) + state[i+1:]
                if next_state not in dead and next_state not in seen:
                    seen.add(next_state)
                    queue.append((next_state, moves + 1))
    return -1`,
    cpp: `int openLock(vector<string>& deadends, string target) {
    unordered_set<string> dead(deadends.begin(), deadends.end()), seen{"0000"};
    if (dead.count("0000")) return -1;
    queue<pair<string,int>> q; q.push({"0000",0});
    while (!q.empty()) {
        auto [s, moves] = q.front(); q.pop();
        if (s == target) return moves;
        for (int i=0;i<4;i++) for (int d : {-1,1}) {
            string next=s; next[i]=char('0'+(s[i]-'0'+d+10)%10);
            if(!dead.count(next)&&seen.insert(next).second)q.push({next,moves+1});
        }
    }
    return -1;
}`,
  },
  "graphs-pacific-atlantic-water-flow": {
    java: `List<List<Integer>> pacificAtlantic(int[][] h) {
    int m=h.length,n=h[0].length;
    boolean[][] p=new boolean[m][n],a=new boolean[m][n];
    for(int r=0;r<m;r++){dfs(h,p,r,0);dfs(h,a,r,n-1);}
    for(int c=0;c<n;c++){dfs(h,p,0,c);dfs(h,a,m-1,c);}
    List<List<Integer>> out=new ArrayList<>();
    for(int r=0;r<m;r++)for(int c=0;c<n;c++)if(p[r][c]&&a[r][c])out.add(List.of(r,c));
    return out;
}
void dfs(int[][] h, boolean[][] seen, int r, int c) {
    if(r<0||r==h.length||c<0||c==h[0].length||seen[r][c])return;
    seen[r][c]=true;
    for(int[] d:new int[][]{{1,0},{-1,0},{0,1},{0,-1}}){
        int x=r+d[0],y=c+d[1];if(x>=0&&x<h.length&&y>=0&&y<h[0].length&&h[x][y]>=h[r][c])dfs(h,seen,x,y);
    }
}`,
    python: `def pacific_atlantic(heights):
    rows, cols = len(heights), len(heights[0])
    def flood(starts):
        seen = set(starts)
        stack = list(starts)
        while stack:
            r, c = stack.pop()
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and (nr,nc) not in seen and heights[nr][nc] >= heights[r][c]:
                    seen.add((nr,nc)); stack.append((nr,nc))
        return seen
    pacific = flood([(r,0) for r in range(rows)] + [(0,c) for c in range(cols)])
    atlantic = flood([(r,cols-1) for r in range(rows)] + [(rows-1,c) for c in range(cols)])
    return [list(cell) for cell in sorted(pacific & atlantic)]`,
    cpp: `vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {
    int m=h.size(),n=h[0].size();
    vector<vector<bool>> p(m,vector<bool>(n)),a=p;
    function<void(int,int,vector<vector<bool>>&)> dfs=[&](int r,int c,auto& seen){
        if(r<0||r>=m||c<0||c>=n||seen[r][c])return;
        seen[r][c]=true;
        for(auto [dr,dc]:vector<pair<int,int>>{{1,0},{-1,0},{0,1},{0,-1}})
            if(r+dr>=0&&r+dr<m&&c+dc>=0&&c+dc<n&&h[r+dr][c+dc]>=h[r][c])dfs(r+dr,c+dc,seen);
    };
    for(int r=0;r<m;r++){dfs(r,0,p);dfs(r,n-1,a);}
    for(int c=0;c<n;c++){dfs(0,c,p);dfs(m-1,c,a);}
    vector<vector<int>> out;
    for(int r=0;r<m;r++)for(int c=0;c<n;c++)if(p[r][c]&&a[r][c])out.push_back({r,c});
    return out;
}`,
  },
  "graphs-reconstruct-itinerary": {
    java: `List<String> findItinerary(List<List<String>> tickets) {
    Map<String, PriorityQueue<String>> graph = new HashMap<>();
    for (List<String> t : tickets) graph.computeIfAbsent(t.get(0), x -> new PriorityQueue<>()).add(t.get(1));
    LinkedList<String> route = new LinkedList<>();
    visit("JFK", graph, route);
    return route;
}
void visit(String airport, Map<String, PriorityQueue<String>> graph, LinkedList<String> route) {
    while (graph.containsKey(airport) && !graph.get(airport).isEmpty())
        visit(graph.get(airport).remove(), graph, route);
    route.addFirst(airport);
}`,
    python: `from collections import defaultdict
import heapq

def find_itinerary(tickets):
    graph = defaultdict(list)
    for start, end in tickets:
        heapq.heappush(graph[start], end)
    route = []
    def visit(airport):
        while graph[airport]:
            visit(heapq.heappop(graph[airport]))
        route.append(airport)
    visit("JFK")
    return route[::-1]`,
    cpp: `vector<string> findItinerary(vector<vector<string>>& tickets) {
    unordered_map<string, priority_queue<string, vector<string>, greater<>>> graph;
    for (auto& t : tickets) graph[t[0]].push(t[1]);
    vector<string> route;
    function<void(string)> visit = [&](string u) {
        while (!graph[u].empty()) { string v=graph[u].top();graph[u].pop();visit(v); }
        route.push_back(u);
    };
    visit("JFK"); reverse(route.begin(),route.end()); return route;
}`,
  },
  "graphs-redundant-connection": {
    java: `int[] findRedundantConnection(int[][] edges) {
    int[] parent = new int[edges.length + 1];
    for (int i = 1; i < parent.length; i++) parent[i] = i;
    for (int[] e : edges) {
        int a = find(parent, e[0]), b = find(parent, e[1]);
        if (a == b) return e;
        parent[a] = b;
    }
    return new int[0];
}
int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }`,
    python: `def find_redundant_connection(edges):
    parent = list(range(len(edges) + 1))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra == rb:
            return [a, b]
        parent[ra] = rb
    return []`,
    cpp: `vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    vector<int> parent(edges.size()+1); iota(parent.begin(),parent.end(),0);
    function<int(int)> find=[&](int x){return parent[x]==x?x:parent[x]=find(parent[x]);};
    for(auto& e:edges){int a=find(e[0]),b=find(e[1]);if(a==b)return e;parent[a]=b;}
    return {};
}`,
  },
  "graphs-rotting-oranges": {
    java: `int orangesRotting(int[][] grid) {
    int m=grid.length,n=grid[0].length,fresh=0,minutes=0;
    Queue<int[]> q=new ArrayDeque<>();
    for(int r=0;r<m;r++)for(int c=0;c<n;c++){if(grid[r][c]==2)q.add(new int[]{r,c});if(grid[r][c]==1)fresh++;}
    int[][] d={{1,0},{-1,0},{0,1},{0,-1}};
    while(!q.isEmpty()&&fresh>0){for(int size=q.size();size>0;size--){int[] p=q.remove();
        for(int[] x:d){int r=p[0]+x[0],c=p[1]+x[1];if(r>=0&&r<m&&c>=0&&c<n&&grid[r][c]==1){grid[r][c]=2;fresh--;q.add(new int[]{r,c});}}
    }minutes++;}
    return fresh==0?minutes:-1;
}`,
    python: `from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque((r,c) for r in range(rows) for c in range(cols) if grid[r][c] == 2)
    fresh = sum(cell == 1 for row in grid for cell in row)
    minutes = 0
    while queue and fresh:
        for _ in range(len(queue)):
            r,c = queue.popleft()
            for dr,dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr,nc=r+dr,c+dc
                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==1:
                    grid[nr][nc]=2;fresh-=1;queue.append((nr,nc))
        minutes += 1
    return minutes if fresh == 0 else -1`,
    cpp: `int orangesRotting(vector<vector<int>>& grid) {
    int m=grid.size(),n=grid[0].size(),fresh=0,minutes=0;
    queue<pair<int,int>> q;
    for(int r=0;r<m;r++)for(int c=0;c<n;c++){if(grid[r][c]==2)q.push({r,c});if(grid[r][c]==1)fresh++;}
    int d[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    while(!q.empty()&&fresh){int size=q.size();while(size--){auto [r,c]=q.front();q.pop();
        for(auto& x:d){int a=r+x[0],b=c+x[1];if(a>=0&&a<m&&b>=0&&b<n&&grid[a][b]==1){grid[a][b]=2;fresh--;q.push({a,b});}}
    }minutes++;}
    return fresh?-1:minutes;
}`,
  },
  "graphs-shortest-path-in-binary-matrix": {
    java: `int shortestPathBinaryMatrix(int[][] grid) {
    int n=grid.length;if(grid[0][0]!=0||grid[n-1][n-1]!=0)return -1;
    int[][] d={{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};
    Queue<int[]> q=new ArrayDeque<>();q.add(new int[]{0,0,1});grid[0][0]=1;
    while(!q.isEmpty()){int[] p=q.remove();if(p[0]==n-1&&p[1]==n-1)return p[2];
        for(int[] x:d){int r=p[0]+x[0],c=p[1]+x[1];if(r>=0&&r<n&&c>=0&&c<n&&grid[r][c]==0){grid[r][c]=1;q.add(new int[]{r,c,p[2]+1});}}
    }return -1;
}`,
    python: `from collections import deque

def shortest_path_binary_matrix(grid):
    n = len(grid)
    if grid[0][0] or grid[-1][-1]:
        return -1
    queue = deque([(0,0,1)])
    grid[0][0] = 1
    directions = [(r,c) for r in (-1,0,1) for c in (-1,0,1) if r or c]
    while queue:
        r,c,distance = queue.popleft()
        if (r,c) == (n-1,n-1):
            return distance
        for dr,dc in directions:
            nr,nc=r+dr,c+dc
            if 0<=nr<n and 0<=nc<n and grid[nr][nc]==0:
                grid[nr][nc]=1
                queue.append((nr,nc,distance+1))
    return -1`,
    cpp: `int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    int n=grid.size();if(grid[0][0]||grid[n-1][n-1])return -1;
    int d[8][2]={{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};
    queue<array<int,3>> q;q.push({0,0,1});grid[0][0]=1;
    while(!q.empty()){auto [r,c,len]=q.front();q.pop();if(r==n-1&&c==n-1)return len;
        for(auto& x:d){int a=r+x[0],b=c+x[1];if(a>=0&&a<n&&b>=0&&b<n&&!grid[a][b]){grid[a][b]=1;q.push({a,b,len+1});}}
    }return -1;
}`,
  },
  "graphs-surrounded-regions": {
    java: `void solve(char[][] board) {
    int m=board.length,n=board[0].length;
    for(int r=0;r<m;r++){mark(board,r,0);mark(board,r,n-1);}
    for(int c=0;c<n;c++){mark(board,0,c);mark(board,m-1,c);}
    for(int r=0;r<m;r++)for(int c=0;c<n;c++)board[r][c]=board[r][c]=='S'?'O':'X';
}
void mark(char[][] b,int r,int c){
    if(r<0||r==b.length||c<0||c==b[0].length||b[r][c]!='O')return;
    b[r][c]='S';mark(b,r+1,c);mark(b,r-1,c);mark(b,r,c+1);mark(b,r,c-1);
}`,
    python: `def solve(board):
    rows, cols = len(board), len(board[0])
    stack = [(r,c) for r in range(rows) for c in range(cols)
             if r in (0,rows-1) or c in (0,cols-1) if board[r][c] == "O"]
    while stack:
        r,c=stack.pop()
        if 0<=r<rows and 0<=c<cols and board[r][c]=="O":
            board[r][c]="S"
            stack.extend((r+dr,c+dc) for dr,dc in ((1,0),(-1,0),(0,1),(0,-1)))
    for r in range(rows):
        for c in range(cols):
            board[r][c] = "O" if board[r][c]=="S" else "X"`,
    cpp: `void solve(vector<vector<char>>& board) {
    int m=board.size(),n=board[0].size();
    queue<pair<int,int>> q;
    for(int r=0;r<m;r++){if(board[r][0]=='O')q.push({r,0});if(board[r][n-1]=='O')q.push({r,n-1});}
    for(int c=0;c<n;c++){if(board[0][c]=='O')q.push({0,c});if(board[m-1][c]=='O')q.push({m-1,c});}
    int d[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    while(!q.empty()){auto [r,c]=q.front();q.pop();if(r<0||r>=m||c<0||c>=n||board[r][c]!='O')continue;
        board[r][c]='S';for(auto& x:d)q.push({r+x[0],c+x[1]});
    }
    for(auto& row:board)for(char& x:row)x=x=='S'?'O':'X';
}`,
  },
  "graphs-word-ladder": {
    java: `int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<>(wordList);
    if (!words.contains(endWord)) return 0;
    Queue<String> q = new ArrayDeque<>(); q.add(beginWord);
    int length = 1;
    while (!q.isEmpty()) for (int size=q.size();size>0;size--) {
        char[] current=q.remove().toCharArray();
        if (new String(current).equals(endWord)) return length;
        for (int i=0;i<current.length;i++) {
            char old=current[i];
            for(char c='a';c<='z';c++)if(c!=old){current[i]=c;String next=new String(current);if(words.remove(next))q.add(next);}
            current[i]=old;
        }
    length++;
    }
    return 0;
}`,
    python: `from collections import deque

def ladder_length(begin_word, end_word, word_list):
    words = set(word_list)
    if end_word not in words:
        return 0
    queue = deque([(begin_word, 1)])
    while queue:
        word, length = queue.popleft()
        if word == end_word:
            return length
        for i in range(len(word)):
            for char in "abcdefghijklmnopqrstuvwxyz":
                candidate = word[:i] + char + word[i+1:]
                if candidate in words:
                    words.remove(candidate)
                    queue.append((candidate, length + 1))
    return 0`,
    cpp: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(),wordList.end());
    if(!words.count(endWord))return 0;
    queue<pair<string,int>> q;q.push({beginWord,1});
    while(!q.empty()){auto [word,len]=q.front();q.pop();if(word==endWord)return len;
        for(int i=0;i<word.size();i++){char old=word[i];for(char c='a';c<='z';c++)if(c!=old){
            word[i]=c;if(words.erase(word))q.push({word,len+1});
        }word[i]=old;}
    }return 0;
}`,
  },
};

export function getGraphReferenceCode(slug, language) {
  return solutions[slug]?.[language] || "";
}
