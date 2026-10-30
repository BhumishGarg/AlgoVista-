const FRAME_LIMIT = 240;
const NODE_LIMIT = 40;
const GRID_LIMIT = 20;

function readArray(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=`, "i"));
  if (!match) throw new Error(`Enter ${name} = [values].`);
  const start = input.indexOf("[", match.index + match[0].length);
  if (start < 0) throw new Error(`Enter ${name} as an array.`);
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let index = start; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === "[") depth += 1;
    else if (char === "]" && --depth === 0) {
      try { return JSON.parse(input.slice(start, index + 1)); }
      catch { throw new Error(`${name} must use valid JSON array syntax.`); }
    }
  }
  throw new Error(`Close the ${name} array with ].`);
}

function readScalar(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*(-?\\d+)`, "i"));
  if (!match) throw new Error(`Enter ${name} = integer.`);
  const value = Number(match[1]);
  if (!Number.isSafeInteger(value)) throw new Error(`${name} must be a safe integer.`);
  return value;
}

function readString(input, name) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*("(?:[^"\\\\]|\\\\.)*")`, "i"));
  if (!match) throw new Error(`Enter ${name} = "string".`);
  try { return JSON.parse(match[1]); }
  catch { throw new Error(`${name} must be a valid quoted string.`); }
}

function validateArray(value, name, limit = NODE_LIMIT, allowEmpty = false) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || value.length > limit) {
    throw new Error(`${name} must contain ${allowEmpty ? "up to" : "1 to"} ${limit} entries.`);
  }
}

function validatePairs(value, name, width, limit = 300) {
  validateArray(value, name, limit, true);
  if (value.some((row) => !Array.isArray(row) || row.length !== width || row.some((item) => !Number.isFinite(item)))) {
    throw new Error(`${name} must contain numeric rows of ${width} values.`);
  }
}

function validateRows(value, name, width, limit = 300) {
  validateArray(value, name, limit, true);
  if (value.some((row) => !Array.isArray(row) || row.length !== width)) {
    throw new Error(`${name} must contain rows of ${width} values.`);
  }
}

function copy(value) {
  return value == null ? null : JSON.parse(JSON.stringify(value));
}

function createFrame(message, graph, variables = {}, result = null, extra = {}) {
  return {
    message,
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
    grid: copy(graph.grid),
    structures: copy(graph.structures),
    variables: { ...variables },
    result,
    ...extra,
  };
}

function bound(frames) {
  return frames.length <= FRAME_LIMIT ? frames : [...frames.slice(0, FRAME_LIMIT - 1), frames.at(-1)];
}

function trace(slug, input) {
  const kind = slug.replace(/^graphs-/, "");
  const graph = { nodes: [], edges: [], grid: null, structures: [] };
  const frames = [];
  const record = (message, variables = {}, extra = {}) => {
    if (frames.length < FRAME_LIMIT - 1) frames.push(createFrame(message, graph, variables, null, extra));
  };
  const finish = (message, result, variables = {}, extra = {}) => {
    const resultText = JSON.stringify(result);
    frames.push(createFrame(message, graph, variables, resultText, extra));
    return { frames: bound(frames), result: resultText };
  };
  const setNodes = (count, labels = null) => {
    if (count > NODE_LIMIT) throw new Error(`The graph visualizer is limited to ${NODE_LIMIT} nodes.`);
    graph.nodes = Array.from({ length: count }, (_, index) => ({
      id: index,
      label: labels?.[index] ?? String(index),
      state: "default",
    }));
  };
  const setEdges = (edges, directed = false) => {
    graph.edges = edges.map((edge) => ({ from: edge[0], to: edge[1], weight: edge[2] ?? null, directed }));
  };
  const mark = (id, state) => {
    if (graph.nodes[id]) graph.nodes[id].state = state;
  };
  const checkRows = (rows, name, count, minWidth, maxWidth = minWidth) => {
    validateArray(rows, name, 5000, true);
    if (rows.some((row) => !Array.isArray(row) || row.length < minWidth || row.length > maxWidth ||
      row.some((value) => !Number.isSafeInteger(value)))) throw new Error(`${name} contains an invalid row.`);
    if (rows.some((row) => row.some((value) => value < 0 || value >= count))) throw new Error(`${name} contains an out-of-range node.`);
  };
  const makeAdjacency = (count, edges, directed = false) => {
    const adjacency = Array.from({ length: count }, () => []);
    edges.forEach(([from, to, weight = 1]) => {
      adjacency[from].push([to, weight]);
      if (!directed) adjacency[to].push([from, weight]);
    });
    return adjacency;
  };

  if (kind === "accounts-merge") {
    const accounts = readArray(input, "accounts");
    validateArray(accounts, "accounts", 100);
    if (accounts.some((row) => !Array.isArray(row) || row.length < 2 || row.some((entry) => typeof entry !== "string"))) throw new Error("Each account must contain a name and at least one email.");
    const emails = [...new Set(accounts.flatMap((account) => account.slice(1)))];
    if (emails.length > NODE_LIMIT) throw new Error(`The visualizer is limited to ${NODE_LIMIT} unique emails.`);
    const ids = new Map(emails.map((email, index) => [email, index]));
    setNodes(emails.length, emails);
    const parent = emails.map((_, i) => i);
    const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    const union = (a, b) => { const ra = find(a); const rb = find(b); if (ra === rb) return false; parent[rb] = ra; return true; };
    for (const account of accounts) {
      for (let i = 2; i < account.length; i += 1) {
        const a = ids.get(account[1]); const b = ids.get(account[i]);
        if (union(a, b)) graph.edges.push({ from: a, to: b, directed: false });
        record(`Connect shared account email ${account[1]} with ${account[i]}.`, { components: new Set(parent.map((_, id) => find(id))).size });
      }
    }
    const groups = new Map();
    accounts.forEach((account) => {
      const root = find(ids.get(account[1]));
      if (!groups.has(root)) groups.set(root, { name: account[0], emails: new Set() });
      account.slice(1).forEach((email) => groups.get(root).emails.add(email));
    });
    const result = [...groups.values()].map(({ name, emails: groupEmails }) => [name, ...[...groupEmails].sort()]);
    return finish("Emails are grouped by connected component.", result);
  }

  if (kind === "cheapest-flights-within-k-stops") {
    const n = readScalar(input, "n"); const flights = readArray(input, "flights");
    const src = readScalar(input, "src"); const dst = readScalar(input, "dst"); const k = readScalar(input, "k");
    if (n < 1 || n > NODE_LIMIT || src < 0 || src >= n || dst < 0 || dst >= n || k < 0) throw new Error(`Use 1 to ${NODE_LIMIT} cities and valid src, dst, and k.`);
    validatePairs(flights, "flights", 3, 5000);
    if (flights.some(([u, v, w]) => u < 0 || u >= n || v < 0 || v >= n || u === v || w < 0)) throw new Error("Flights must have valid city indices and non-negative prices.");
    setNodes(n); setEdges(flights, true);
    let costs = Array(n).fill(Infinity); costs[src] = 0;
    for (let step = 1; step <= Math.min(k + 1, n - 1); step += 1) {
      const next = [...costs];
      for (const [from, to, price] of flights) {
        if (costs[from] + price < next[to]) next[to] = costs[from] + price;
        record(`Relax flight ${from} → ${to} at price ${price}.`, { flightsUsed: step, bestDestinationPrice: next[dst] === Infinity ? "unreachable" : next[dst] });
      }
      costs = next;
    }
    return finish("The cheapest fare within the stop limit is determined.", costs[dst] === Infinity ? -1 : costs[dst], { costs: costs.map((cost) => cost === Infinity ? "∞" : cost) });
  }

  if (kind === "clone-graph") {
    const adjacency = readArray(input, "adjList");
    validateArray(adjacency, "adjList", NODE_LIMIT, true);
    if (adjacency.some((row) => !Array.isArray(row) || row.some((v) => !Number.isInteger(v) || v < 1 || v > adjacency.length))) throw new Error("adjList contains an invalid neighbor label.");
    setNodes(adjacency.length, adjacency.map((_, index) => `Original ${index + 1}`));
    const originalEdges = adjacency.flatMap((neighbors, index) => neighbors.map((neighbor) => [index, neighbor - 1]));
    setEdges(originalEdges);
    const cloneMap = new Map();
    adjacency.forEach((_, index) => {
      cloneMap.set(index, index);
      mark(index, "visited");
      record(`Create a separate clone for node ${index + 1}.`, { clonedNodes: cloneMap.size });
    });
    graph.nodes = adjacency.map((_, index) => ({ id: index, label: `Clone ${index + 1}`, state: "safe" }));
    const result = adjacency.map((neighbors) => [...neighbors]);
    return finish("Every node and neighbor relationship has a clone.", result);
  }

  if (kind === "course-schedule" || kind === "course-schedule-ii") {
    const count = readScalar(input, "numCourses"); const prerequisites = readArray(input, "prerequisites");
    if (count < 1 || count > NODE_LIMIT) throw new Error(`numCourses must be between 1 and ${NODE_LIMIT} for visualization.`);
    checkRows(prerequisites, "prerequisites", count, 2);
    if (prerequisites.some(([course, pre]) => course === pre)) throw new Error("A course cannot be its own prerequisite.");
    const edges = prerequisites.map(([course, pre]) => [pre, course]);
    setNodes(count); setEdges(edges, true);
    const indegree = Array(count).fill(0); const adjacency = Array.from({ length: count }, () => []);
    edges.forEach(([from, to]) => { adjacency[from].push(to); indegree[to] += 1; });
    const queue = indegree.flatMap((degree, node) => degree === 0 ? [node] : []);
    const order = [];
    while (queue.length) {
      const current = queue.shift(); order.push(current); mark(current, "visited");
      record(`Complete course ${current} and release its dependents.`, { course: current, queue: [...queue], order: [...order] });
      for (const next of adjacency[current]) {
        indegree[next] -= 1;
        if (indegree[next] === 0) queue.push(next);
      }
    }
    const acyclic = order.length === count;
    if (!acyclic) graph.nodes.forEach((node, id) => { if (!order.includes(id)) mark(id, "active"); });
    return kind === "course-schedule"
      ? finish(acyclic ? "Every course can be completed." : "Unprocessed courses form a prerequisite cycle.", acyclic, { order })
      : finish(acyclic ? "A valid course order was found." : "A prerequisite cycle prevents a complete order.", acyclic ? order : [], { order });
  }

  if (kind === "evaluate-division") {
    const equations = readArray(input, "equations"); const values = readArray(input, "values"); const queries = readArray(input, "queries");
    validateRows(equations, "equations", 2, 100); validateRows(queries, "queries", 2, 100);
    if (equations.some((pair) => pair.some((v) => typeof v !== "string")) || queries.some((pair) => pair.some((v) => typeof v !== "string")) ||
      values.length !== equations.length || values.some((v) => !Number.isFinite(v) || v <= 0)) throw new Error("Equations, values, and queries must be valid and aligned.");
    const names = [...new Set(equations.flat())];
    if (names.length > NODE_LIMIT) throw new Error(`The visualizer is limited to ${NODE_LIMIT} variables.`);
    const ids = new Map(names.map((name, index) => [name, index]));
    setNodes(names.length, names);
    const adjacency = new Map(names.map((name) => [name, []]));
    equations.forEach(([a, b], index) => {
      adjacency.get(a).push([b, values[index]]);
      adjacency.get(b).push([a, 1 / values[index]]);
      graph.edges.push({ from: ids.get(a), to: ids.get(b), label: String(values[index]), directed: true });
      graph.edges.push({ from: ids.get(b), to: ids.get(a), label: String(1 / values[index]), directed: true });
    });
    const answers = queries.map(([start, target]) => {
      if (!adjacency.has(start) || !adjacency.has(target)) return -1;
      if (start === target) return 1;
      const queue = [[start, 1]]; const seen = new Set([start]);
      for (let head = 0; head < queue.length; head += 1) {
        const [node, product] = queue[head];
        mark(ids.get(node), "visited");
        for (const [next, weight] of adjacency.get(node)) {
          if (seen.has(next)) continue;
          const nextProduct = product * weight;
          record(`Follow ${node} → ${next} and multiply by ${weight}.`, { query: `${start}/${target}`, product: nextProduct });
          if (next === target) return nextProduct;
          seen.add(next); queue.push([next, nextProduct]);
        }
      }
      return -1;
    });
    return finish("Evaluate each division query along its weighted path.", answers);
  }

  if (kind === "graph-valid-tree" || kind === "redundant-connection") {
    const isTree = kind === "graph-valid-tree";
    const n = isTree ? readScalar(input, "n") : null;
    const edges = readArray(input, "edges");
    const count = isTree ? n : edges.length;
    if (count < 1 || count > NODE_LIMIT) throw new Error(`The graph visualizer is limited to ${NODE_LIMIT} nodes.`);
    checkRows(edges, "edges", isTree ? count : count + 1, 2);
    if (edges.some(([a, b]) => a === b || (!isTree && (a < 1 || b > count)))) throw new Error("Edges must connect distinct valid nodes.");
    setNodes(count); setEdges(edges);
    const parent = Array.from({ length: count }, (_, i) => i);
    const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    if (isTree && edges.length !== count - 1) return finish("A tree must have exactly n - 1 edges.", false);
    let redundant = null;
    for (const [rawA, rawB] of edges) {
      const a = isTree ? rawA : rawA - 1; const b = isTree ? rawB : rawB - 1;
      const ra = find(a); const rb = find(b);
      if (ra === rb) { redundant = [rawA, rawB]; record(`Edge ${rawA}–${rawB} connects nodes already in one component.`, { cycle: true }); }
      else { parent[ra] = rb; record(`Union components containing ${rawA} and ${rawB}.`, { components: new Set(parent.map((_, i) => find(i))).size }); }
    }
    if (!isTree) return finish("The edge closes a cycle.", redundant || []);
    const connected = new Set(parent.map((_, i) => find(i))).size === 1;
    return finish(connected ? "All nodes are connected without a cycle." : "The graph is disconnected.", connected && !redundant);
  }

  if (kind === "is-graph-bipartite") {
    const adjacency = readArray(input, "graph");
    validateArray(adjacency, "graph", NODE_LIMIT, true);
    if (adjacency.some((row) => !Array.isArray(row) || row.some((node) => !Number.isInteger(node) || node < 0 || node >= adjacency.length))) throw new Error("graph contains an invalid neighbor.");
    setNodes(adjacency.length);
    graph.edges = adjacency.flatMap((neighbors, from) => neighbors.filter((to) => from < to).map((to) => ({ from, to, directed: false })));
    const colors = Array(adjacency.length).fill(0);
    for (let start = 0; start < adjacency.length; start += 1) {
      if (colors[start]) continue;
      colors[start] = 1; mark(start, "safe");
      const queue = [start];
      for (let head = 0; head < queue.length; head += 1) {
        const node = queue[head];
        for (const next of adjacency[node]) {
          if (!colors[next]) {
            colors[next] = -colors[node]; mark(next, colors[next] === 1 ? "safe" : "visited"); queue.push(next);
          } else if (colors[next] === colors[node]) {
            mark(node, "active"); mark(next, "active");
            record(`Edge ${node}–${next} joins nodes of the same color.`, { colors: [...colors] });
            return finish("The graph is not bipartite.", false, { colors });
          }
          record(`Color neighbor ${next} opposite to ${node}.`, { colors: [...colors] });
        }
      }
    }
    return finish("Every edge joins opposite colors.", true, { colors });
  }

  if (kind === "min-cost-to-connect-all-points") {
    const points = readArray(input, "points");
    validateArray(points, "points", NODE_LIMIT);
    if (points.some((point) => !Array.isArray(point) || point.length !== 2 || point.some((v) => !Number.isSafeInteger(v)))) throw new Error("points must be [x,y] coordinate pairs.");
    setNodes(points.length, points.map((point, i) => `${i}:(${point.join(",")})`));
    const used = Array(points.length).fill(false); const distance = Array(points.length).fill(Infinity); distance[0] = 0;
    let total = 0;
    for (let step = 0; step < points.length; step += 1) {
      let next = -1;
      for (let i = 0; i < points.length; i += 1) if (!used[i] && (next < 0 || distance[i] < distance[next])) next = i;
      used[next] = true; total += distance[next]; mark(next, "visited");
      record(`Add point ${next} to the minimum spanning tree at cost ${distance[next]}.`, { totalCost: total, included: step + 1 });
      for (let i = 0; i < points.length; i += 1) {
        if (used[i]) continue;
        const cost = Math.abs(points[next][0] - points[i][0]) + Math.abs(points[next][1] - points[i][1]);
        if (cost < distance[i]) {
          distance[i] = cost;
          graph.edges.push({ from: next, to: i, weight: cost, directed: false, candidate: true });
        }
      }
    }
    return finish("All points are connected with minimum total Manhattan cost.", total);
  }

  if (kind === "network-delay-time") {
    const times = readArray(input, "times"); const n = readScalar(input, "n"); const source = readScalar(input, "k");
    if (n < 1 || n > NODE_LIMIT || source < 1 || source > n) throw new Error(`Use 1 to ${NODE_LIMIT} nodes and a valid start node.`);
    validatePairs(times, "times", 3, 5000);
    if (times.some(([u, v, w]) => u < 1 || u > n || v < 1 || v > n || u === v || w < 0)) throw new Error("times contains an invalid directed edge.");
    setNodes(n, Array.from({ length: n }, (_, i) => String(i + 1))); setEdges(times.map(([u, v, w]) => [u - 1, v - 1, w]), true);
    const adjacency = makeAdjacency(n, times.map(([u, v, w]) => [u - 1, v - 1, w]), true);
    const dist = Array(n).fill(Infinity); const done = Array(n).fill(false); dist[source - 1] = 0;
    for (let step = 0; step < n; step += 1) {
      let current = -1;
      for (let i = 0; i < n; i += 1) if (!done[i] && (current < 0 || dist[i] < dist[current])) current = i;
      if (current < 0 || dist[current] === Infinity) break;
      done[current] = true; mark(current, "visited");
      for (const [next, weight] of adjacency[current]) {
        if (dist[current] + weight < dist[next]) dist[next] = dist[current] + weight;
        record(`Relax edge ${current + 1} → ${next + 1}.`, { current: current + 1, distances: dist.map((v) => v === Infinity ? "∞" : v) });
      }
    }
    const result = dist.some((value) => value === Infinity) ? -1 : Math.max(...dist);
    return finish("The longest shortest-path distance gives the network delay.", result, { distances: dist.map((v) => v === Infinity ? "∞" : v) });
  }

  if (kind === "number-of-islands" || kind === "rotting-oranges" || kind === "shortest-path-in-binary-matrix" ||
    kind === "surrounded-regions" || kind === "pacific-atlantic-water-flow") {
    const field = kind === "pacific-atlantic-water-flow" ? "heights" : kind === "surrounded-regions" ? "board" : "grid";
    const grid = readArray(input, field);
    validateArray(grid, field, GRID_LIMIT);
    if (!Array.isArray(grid[0]) || !grid[0].length || grid[0].length > GRID_LIMIT ||
      grid.some((row) => !Array.isArray(row) || row.length !== grid[0].length)) throw new Error(`${field} must be a rectangular grid no larger than ${GRID_LIMIT} by ${GRID_LIMIT}.`);
    const rows = grid.length; const cols = grid[0].length;
    graph.grid = copy(grid);
    const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
    const dirs8 = [...dirs4,[1,1],[1,-1],[-1,1],[-1,-1]];
    const key = (r,c) => `${r},${c}`;
    const neighbors = (r,c,dirs) => dirs.map(([dr,dc]) => [r+dr,c+dc]).filter(([nr,nc]) => nr>=0&&nr<rows&&nc>=0&&nc<cols);
    if (kind === "number-of-islands") {
      if (grid.flat().some((cell) => cell !== "0" && cell !== "1" && cell !== 0 && cell !== 1)) throw new Error("grid cells must be 0 or 1.");
      const seen = new Set(); let islands = 0;
      for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
        if (String(grid[r][c]) !== "1" || seen.has(key(r,c))) continue;
        islands += 1; const queue = [[r,c]]; seen.add(key(r,c));
        for (let head = 0; head < queue.length; head += 1) {
          const [x,y] = queue[head]; graph.grid[x][y] = "✓";
          record(`Explore land at (${x},${y}) in island ${islands}.`, { islands, visitedCells: seen.size });
          for (const [nx,ny] of neighbors(x,y,dirs4)) if (String(grid[nx][ny]) === "1" && !seen.has(key(nx,ny))) { seen.add(key(nx,ny)); queue.push([nx,ny]); }
        }
      }
      return finish(`Found ${islands} island(s).`, islands, { islands });
    }
    if (kind === "rotting-oranges") {
      if (grid.flat().some((cell) => ![0,1,2].includes(cell))) throw new Error("grid cells must be 0, 1, or 2.");
      const queue = []; let fresh = 0;
      grid.forEach((row,r)=>row.forEach((cell,c)=>{if(cell===2)queue.push([r,c]);if(cell===1)fresh++;}));
      let minutes = 0;
      while (queue.length && fresh) {
        const level = queue.length;
        for (let i=0;i<level;i++) {
          const [r,c]=queue.shift();
          for (const [nr,nc] of neighbors(r,c,dirs4)) if (graph.grid[nr][nc]===1) { graph.grid[nr][nc]=2;fresh--;queue.push([nr,nc]); }
        }
        minutes++; record(`Minute ${minutes}: infection spreads to adjacent oranges.`, { fresh, minutes });
      }
      return finish(fresh ? "Some fresh oranges cannot be reached." : `All oranges rot after ${minutes} minute(s).`, fresh ? -1 : minutes, { fresh, minutes });
    }
    if (kind === "shortest-path-in-binary-matrix") {
      if (rows !== cols || grid.flat().some((cell)=>cell!==0&&cell!==1)) throw new Error("grid must be a square binary matrix.");
      if (grid[0][0] || grid[rows-1][cols-1]) return finish("The start or destination is blocked.",-1);
      const queue=[[0,0,1]]; const seen=new Set([key(0,0)]);
      while(queue.length) {
        const [r,c,distance]=queue.shift();
        if(r===rows-1&&c===cols-1)return finish(`Reached the destination in ${distance} cell(s).`,distance,{distance});
        for(const [nr,nc] of neighbors(r,c,dirs8))if(grid[nr][nc]===0&&!seen.has(key(nr,nc))){seen.add(key(nr,nc));graph.grid[nr][nc]=2;queue.push([nr,nc,distance+1]);}
        record(`Expand (${r},${c}) at path length ${distance}.`,{frontier:queue.length,visited:seen.size});
      }
      return finish("The destination is unreachable.",-1,{visited:seen.size});
    }
    if (kind === "surrounded-regions") {
      if (grid.flat().some((cell)=>cell!=="X"&&cell!=="O")) throw new Error("board cells must be X or O.");
      const safe=new Set(); const queue=[];
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if((r===0||c===0||r===rows-1||c===cols-1)&&grid[r][c]==="O"&&!safe.has(key(r,c))){safe.add(key(r,c));queue.push([r,c]);}
      for(let head=0;head<queue.length;head++){const [r,c]=queue[head];for(const [nr,nc] of neighbors(r,c,dirs4))if(grid[nr][nc]==="O"&&!safe.has(key(nr,nc))){safe.add(key(nr,nc));queue.push([nr,nc]);}}
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(graph.grid[r][c]==="O"&&!safe.has(key(r,c)))graph.grid[r][c]="X";record(`Check cell (${r},${c}) for border connectivity.`,{safeCells:safe.size});}
      return finish("Captured enclosed regions and preserved border-connected cells.",graph.grid);
    }
    if (grid.flat().some((cell)=>!Number.isFinite(cell))) throw new Error("heights must contain numbers.");
    const pacific=new Set();const atlantic=new Set();
    const flood=(starts,seen,label)=>{const queue=[];for(const [r,c] of starts)if(!seen.has(key(r,c))){seen.add(key(r,c));queue.push([r,c]);}
      for(let head=0;head<queue.length;head++){const [r,c]=queue[head];for(const [nr,nc] of neighbors(r,c,dirs4))if(grid[nr][nc]>=grid[r][c]&&!seen.has(key(nr,nc))){seen.add(key(nr,nc));queue.push([nr,nc]);}
        record(`Flow backwards from ${label} through (${r},${c}).`,{ocean:label,reachable:seen.size});}};
    flood([...Array.from({length:rows},(_,r)=>[r,0]),...Array.from({length:cols},(_,c)=>[0,c])],pacific,"Pacific");
    flood([...Array.from({length:rows},(_,r)=>[r,cols-1]),...Array.from({length:cols},(_,c)=>[rows-1,c])],atlantic,"Atlantic");
    const result=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(pacific.has(key(r,c))&&atlantic.has(key(r,c)))result.push([r,c]);
    result.forEach(([r,c])=>{graph.grid[r][c]=`${graph.grid[r][c]}✓`;});
    return finish("Cells reachable from both oceans are highlighted.",result,{pacific:pacific.size,atlantic:atlantic.size});
  }

  if (kind === "number-of-provinces") {
    const matrix=readArray(input,"isConnected");validateArray(matrix,"isConnected",NODE_LIMIT);
    const n=matrix.length;if(matrix.some(row=>!Array.isArray(row)||row.length!==n||row.some(v=>v!==0&&v!==1)))throw new Error("isConnected must be a square matrix of 0s and 1s.");
    setNodes(n);const seen=new Set();let provinces=0;
    for(let start=0;start<n;start++)if(!seen.has(start)){provinces++;const queue=[start];seen.add(start);
      for(let head=0;head<queue.length;head++){const city=queue[head];mark(city,"visited");for(let next=0;next<n;next++)if(matrix[city][next]&&!seen.has(next)){seen.add(next);queue.push(next);}
        record(`Explore city ${city} in province ${provinces}.`,{provinces,visited:[...seen]});}}
    return finish(`Found ${provinces} province(s).`,provinces,{provinces});
  }

  if (kind === "open-the-lock") {
    const deadends=readArray(input,"deadends");const target=readString(input,"target");
    validateArray(deadends,"deadends",500);
    if(typeof target!=="string"||!/^\d{4}$/.test(target)||deadends.some(s=>typeof s!=="string"||!/^\d{4}$/.test(s)))throw new Error("deadends and target must be four-digit strings.");
    const blocked=new Set(deadends);const start="0000";
    if(blocked.has(start))return finish("The starting combination is blocked.",-1);
    setNodes(1,[start]);const queue=[[start,0]];const seen=new Set([start]);
    while(queue.length){const [state,distance]=queue.shift();graph.nodes[0].label=state;graph.nodes[0].state="active";record(`Inspect lock ${state} at move ${distance}.`,{state,distance,frontier:queue.length});
      if(state===target)return finish(`Reached ${target} in ${distance} move(s).`,distance,{distance});
      for(let i=0;i<4;i++)for(const delta of [-1,1]){const digits=state.split("");digits[i]=String((Number(digits[i])+delta+10)%10);const next=digits.join("");if(!blocked.has(next)&&!seen.has(next)){seen.add(next);queue.push([next,distance+1]);}}
    }
    return finish("The target combination cannot be reached.",-1);
  }

  if (kind === "reconstruct-itinerary") {
    const tickets=readArray(input,"tickets");validateRows(tickets,"tickets",2,300);
    if(tickets.some(row=>row.some(code=>typeof code!=="string"||!/^[A-Z]{3}$/.test(code))))throw new Error("Airport codes must be three uppercase letters.");
    const airports=[...new Set([...tickets.flat(),"JFK"])];if(airports.length>NODE_LIMIT)throw new Error(`The visualizer is limited to ${NODE_LIMIT} airports.`);
    const ids=new Map(airports.map((a,i)=>[a,i]));setNodes(airports.length,airports);setEdges(tickets.map(([a,b])=>[ids.get(a),ids.get(b)]),true);
    const adj=new Map(airports.map(a=>[a,[]]));tickets.forEach(([a,b])=>adj.get(a).push(b));adj.forEach(list=>list.sort().reverse());
    const stack=["JFK"];const route=[];
    while(stack.length){const airport=stack.at(-1);if(adj.get(airport).length)stack.push(adj.get(airport).pop());else route.push(stack.pop());record(`Follow the next lexical ticket from ${airport}.`,{current:airport,route:[...route].reverse(),remainingTickets:tickets.length-route.length+1});}
    route.reverse();return finish("Reverse postorder forms the itinerary.",route);
  }

  if (kind === "word-ladder") {
    const begin=readString(input,"beginWord");const end=readString(input,"endWord");const words=readArray(input,"wordList");
    validateArray(words,"wordList",200);
    if(!/^[a-z]+$/.test(begin)||!/^[a-z]+$/.test(end)||begin.length!==end.length||words.some(w=>typeof w!=="string"||w.length!==begin.length||!/^[a-z]+$/.test(w)))throw new Error("Words must be lowercase and have matching lengths.");
    const dictionary=new Set(words);if(!dictionary.has(end))return finish("The end word is not in the dictionary.",0);
    const all=[...new Set([begin,...words])];if(all.length>NODE_LIMIT)throw new Error(`The visualizer is limited to ${NODE_LIMIT} words.`);
    const ids=new Map(all.map((word,i)=>[word,i]));setNodes(all.length,all);
    const distance=new Map([[begin,1]]);const queue=[begin];dictionary.delete(begin);
    while(queue.length){const word=queue.shift();const d=distance.get(word);mark(ids.get(word),"visited");
      record(`Explore ${word} at sequence length ${d}.`,{word,distance:d,frontier:queue.length});
      if(word===end)return finish(`Reached ${end} in ${d} words.`,d,{distance:d});
      for(let i=0;i<word.length;i++)for(let code=97;code<=122;code++){const candidate=word.slice(0,i)+String.fromCharCode(code)+word.slice(i+1);if(dictionary.has(candidate)){dictionary.delete(candidate);distance.set(candidate,d+1);queue.push(candidate);graph.edges.push({from:ids.get(word),to:ids.get(candidate),directed:false});}}
    }
    return finish("No valid transformation sequence exists.",0);
  }

  throw new Error("No graph visualization is registered for this question.");
}

export function buildGraphTrace(slug, input) {
  return trace(slug, input);
}
