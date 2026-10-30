const solutions = {
  "binary-trees-balanced-binary-tree": {
    java: `boolean isBalanced(TreeNode root) {
    return height(root) >= 0;
}

int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left);
    int right = height(node.right);
    if (left < 0 || right < 0 || Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}`,
    python: `def is_balanced(root):
    def height(node):
        if not node:
            return 0
        left = height(node.left)
        right = height(node.right)
        if left < 0 or right < 0 or abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    return height(root) >= 0`,
    cpp: `int height(TreeNode* node) {
    if (!node) return 0;
    int left = height(node->left), right = height(node->right);
    if (left < 0 || right < 0 || abs(left - right) > 1) return -1;
    return 1 + max(left, right);
}

bool isBalanced(TreeNode* root) {
    return height(root) >= 0;
}`,
  },
  "binary-trees-binary-tree-level-order-traversal": {
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
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
    cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        vector<int> level;
        while (size--) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
  },
  "binary-trees-binary-tree-maximum-path-sum": {
    java: `int best;

int maxPathSum(TreeNode root) {
    best = Integer.MIN_VALUE;
    gain(root);
    return best;
}

int gain(TreeNode node) {
    if (node == null) return 0;
    int left = Math.max(0, gain(node.left));
    int right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right);
    return node.val + Math.max(left, right);
}`,
    python: `def max_path_sum(root):
    best = float("-inf")
    def gain(node):
        nonlocal best
        if not node:
            return 0
        left = max(0, gain(node.left))
        right = max(0, gain(node.right))
        best = max(best, node.val + left + right)
        return node.val + max(left, right)
    gain(root)
    return best`,
    cpp: `int best;

int gain(TreeNode* node) {
    if (!node) return 0;
    int left = max(0, gain(node->left));
    int right = max(0, gain(node->right));
    best = max(best, node->val + left + right);
    return node->val + max(left, right);
}

int maxPathSum(TreeNode* root) {
    best = INT_MIN;
    gain(root);
    return best;
}`,
  },
  "binary-trees-binary-tree-right-side-view": {
    java: `List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.remove();
            if (i == size - 1) result.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
    }
    return result;
}`,
    python: `from collections import deque

def right_side_view(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        size = len(queue)
        for i in range(size):
            node = queue.popleft()
            if i == size - 1:
                result.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return result`,
    cpp: `vector<int> rightSideView(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; ++i) {
            TreeNode* node = q.front(); q.pop();
            if (i == size - 1) result.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return result;
}`,
  },
  "binary-trees-binary-tree-zigzag-level-order-traversal": {
    java: `List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.add(root);
    boolean reverse = false;
    while (!queue.isEmpty()) {
        int size = queue.size();
        LinkedList<Integer> level = new LinkedList<>();
        while (size-- > 0) {
            TreeNode node = queue.remove();
            if (reverse) level.addFirst(node.val); else level.addLast(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        result.add(level);
        reverse = !reverse;
    }
    return result;
}`,
    python: `from collections import deque

def zigzag_level_order(root):
    if not root:
        return []
    result, queue, reverse = [], deque([root]), False
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level[::-1] if reverse else level)
        reverse = not reverse
    return result`,
    cpp: `vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    bool reverse = false;
    while (!q.empty()) {
        int size = q.size();
        vector<int> level(size);
        for (int i = 0; i < size; ++i) {
            TreeNode* node = q.front(); q.pop();
            level[reverse ? size - 1 - i : i] = node->val;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
        reverse = !reverse;
    }
    return result;
}`,
  },
  "binary-trees-construct-binary-tree-from-preorder-and-inorder": {
    java: `Map<Integer, Integer> positions;
int preorderIndex;

TreeNode buildTree(int[] preorder, int[] inorder) {
    positions = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) positions.put(inorder[i], i);
    preorderIndex = 0;
    return build(preorder, 0, inorder.length - 1);
}

TreeNode build(int[] preorder, int left, int right) {
    if (left > right) return null;
    int value = preorder[preorderIndex++];
    TreeNode node = new TreeNode(value);
    int middle = positions.get(value);
    node.left = build(preorder, left, middle - 1);
    node.right = build(preorder, middle + 1, right);
    return node;
}`,
    python: `def build_tree(preorder, inorder):
    positions = {value: i for i, value in enumerate(inorder)}
    preorder_index = 0
    def build(left, right):
        nonlocal preorder_index
        if left > right:
            return None
        value = preorder[preorder_index]
        preorder_index += 1
        node = TreeNode(value)
        middle = positions[value]
        node.left = build(left, middle - 1)
        node.right = build(middle + 1, right)
        return node
    return build(0, len(inorder) - 1)`,
    cpp: `TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int, int> position;
    for (int i = 0; i < inorder.size(); ++i) position[inorder[i]] = i;
    int index = 0;
    function<TreeNode*(int, int)> build = [&](int left, int right) -> TreeNode* {
        if (left > right) return nullptr;
        int value = preorder[index++];
        TreeNode* node = new TreeNode(value);
        int middle = position[value];
        node->left = build(left, middle - 1);
        node->right = build(middle + 1, right);
        return node;
    };
    return build(0, inorder.size() - 1);
}`,
  },
  "binary-trees-delete-node-in-a-bst": {
    java: `TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode successor = root.right;
        while (successor.left != null) successor = successor.left;
        root.val = successor.val;
        root.right = deleteNode(root.right, successor.val);
    }
    return root;
}`,
    python: `def delete_node(root, key):
    if not root:
        return None
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    elif not root.left:
        return root.right
    elif not root.right:
        return root.left
    else:
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val
        root.right = delete_node(root.right, successor.val)
    return root`,
    cpp: `TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        TreeNode* successor = root->right;
        while (successor->left) successor = successor->left;
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
    }
    return root;
}`,
  },
  "binary-trees-diameter-of-binary-tree": {
    java: `int diameter;

int diameterOfBinaryTree(TreeNode root) {
    diameter = 0;
    height(root);
    return diameter;
}

int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left), right = height(node.right);
    diameter = Math.max(diameter, left + right);
    return 1 + Math.max(left, right);
}`,
    python: `def diameter_of_binary_tree(root):
    diameter = 0
    def height(node):
        nonlocal diameter
        if not node:
            return 0
        left, right = height(node.left), height(node.right)
        diameter = max(diameter, left + right)
        return 1 + max(left, right)
    height(root)
    return diameter`,
    cpp: `int diameter;

int height(TreeNode* node) {
    if (!node) return 0;
    int left = height(node->left), right = height(node->right);
    diameter = max(diameter, left + right);
    return 1 + max(left, right);
}

int diameterOfBinaryTree(TreeNode* root) {
    diameter = 0;
    height(root);
    return diameter;
}`,
  },
  "binary-trees-flatten-binary-tree-to-linked-list": {
    java: `void flatten(TreeNode root) {
    TreeNode current = root;
    while (current != null) {
        if (current.left != null) {
            TreeNode predecessor = current.left;
            while (predecessor.right != null) predecessor = predecessor.right;
            predecessor.right = current.right;
            current.right = current.left;
            current.left = null;
        }
        current = current.right;
    }
}`,
    python: `def flatten(root):
    current = root
    while current:
        if current.left:
            predecessor = current.left
            while predecessor.right:
                predecessor = predecessor.right
            predecessor.right = current.right
            current.right = current.left
            current.left = None
        current = current.right`,
    cpp: `void flatten(TreeNode* root) {
    TreeNode* current = root;
    while (current) {
        if (current->left) {
            TreeNode* predecessor = current->left;
            while (predecessor->right) predecessor = predecessor->right;
            predecessor->right = current->right;
            current->right = current->left;
            current->left = nullptr;
        }
        current = current->right;
    }
}`,
  },
  "binary-trees-insert-into-a-binary-search-tree": {
    java: `TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    TreeNode node = root;
    while (true) {
        if (val < node.val) {
            if (node.left == null) { node.left = new TreeNode(val); break; }
            node = node.left;
        } else {
            if (node.right == null) { node.right = new TreeNode(val); break; }
            node = node.right;
        }
    }
    return root;
}`,
    python: `def insert_into_bst(root, val):
    if not root:
        return TreeNode(val)
    node = root
    while True:
        if val < node.val:
            if not node.left:
                node.left = TreeNode(val)
                break
            node = node.left
        else:
            if not node.right:
                node.right = TreeNode(val)
                break
            node = node.right
    return root`,
    cpp: `TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    TreeNode* node = root;
    while (true) {
        if (val < node->val) {
            if (!node->left) { node->left = new TreeNode(val); break; }
            node = node->left;
        } else {
            if (!node->right) { node->right = new TreeNode(val); break; }
            node = node->right;
        }
    }
    return root;
}`,
  },
  "binary-trees-invert-binary-tree": {
    java: `TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(left);
    return root;
}`,
    python: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
    cpp: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left, root->right);
    invertTree(root->left);
    invertTree(root->right);
    return root;
}`,
  },
  "binary-trees-kth-smallest-element-in-a-bst": {
    java: `int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode node = root;
    while (node != null || !stack.isEmpty()) {
        while (node != null) { stack.push(node); node = node.left; }
        node = stack.pop();
        if (--k == 0) return node.val;
        node = node.right;
    }
    throw new IllegalArgumentException("k is out of range");
}`,
    python: `def kth_smallest(root, k):
    stack, node = [], root
    while node or stack:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        node = node.right`,
    cpp: `int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> nodes;
    TreeNode* node = root;
    while (node || !nodes.empty()) {
        while (node) { nodes.push(node); node = node->left; }
        node = nodes.top(); nodes.pop();
        if (--k == 0) return node->val;
        node = node->right;
    }
    return -1;
}`,
  },
  "binary-trees-lowest-common-ancestor-of-a-binary-tree": {
    java: `TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
    python: `def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left or right`,
    cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,
  },
  "binary-trees-maximum-depth-of-binary-tree": {
    java: `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    python: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
    cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
  },
  "binary-trees-path-sum": {
    java: `boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return targetSum == root.val;
    int remaining = targetSum - root.val;
    return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}`,
    python: `def has_path_sum(root, target_sum):
    if not root:
        return False
    if not root.left and not root.right:
        return target_sum == root.val
    remaining = target_sum - root.val
    return (has_path_sum(root.left, remaining) or
            has_path_sum(root.right, remaining))`,
    cpp: `bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    if (!root->left && !root->right) return targetSum == root->val;
    int remaining = targetSum - root->val;
    return hasPathSum(root->left, remaining) ||
           hasPathSum(root->right, remaining);
}`,
  },
  "binary-trees-path-sum-ii": {
    java: `List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> result = new ArrayList<>();
    collect(root, targetSum, new ArrayList<>(), result);
    return result;
}

void collect(TreeNode node, int remaining, List<Integer> path,
             List<List<Integer>> result) {
    if (node == null) return;
    path.add(node.val);
    if (node.left == null && node.right == null && remaining == node.val)
        result.add(new ArrayList<>(path));
    collect(node.left, remaining - node.val, path, result);
    collect(node.right, remaining - node.val, path, result);
    path.remove(path.size() - 1);
}`,
    python: `def path_sum(root, target_sum):
    result = []
    def collect(node, remaining, path):
        if not node:
            return
        path.append(node.val)
        if not node.left and not node.right and remaining == node.val:
            result.append(path.copy())
        collect(node.left, remaining - node.val, path)
        collect(node.right, remaining - node.val, path)
        path.pop()
    collect(root, target_sum, [])
    return result`,
    cpp: `vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> result;
    vector<int> path;
    function<void(TreeNode*, int)> collect = [&](TreeNode* node, int remaining) {
        if (!node) return;
        path.push_back(node->val);
        if (!node->left && !node->right && remaining == node->val)
            result.push_back(path);
        collect(node->left, remaining - node->val);
        collect(node->right, remaining - node->val);
        path.pop_back();
    };
    collect(root, targetSum);
    return result;
}`,
  },
  "binary-trees-same-tree": {
    java: `boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null || q == null) return p == q;
    return p.val == q.val &&
           isSameTree(p.left, q.left) &&
           isSameTree(p.right, q.right);
}`,
    python: `def is_same_tree(p, q):
    if not p or not q:
        return p is q
    return (p.val == q.val and
            is_same_tree(p.left, q.left) and
            is_same_tree(p.right, q.right))`,
    cpp: `bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p || !q) return p == q;
    return p->val == q->val &&
           isSameTree(p->left, q->left) &&
           isSameTree(p->right, q->right);
}`,
  },
  "binary-trees-search-in-a-binary-search-tree": {
    java: `TreeNode searchBST(TreeNode root, int val) {
    while (root != null && root.val != val)
        root = val < root.val ? root.left : root.right;
    return root;
}`,
    python: `def search_bst(root, val):
    while root and root.val != val:
        root = root.left if val < root.val else root.right
    return root`,
    cpp: `TreeNode* searchBST(TreeNode* root, int val) {
    while (root && root->val != val)
        root = val < root->val ? root->left : root->right;
    return root;
}`,
  },
  "binary-trees-symmetric-tree": {
    java: `boolean isSymmetric(TreeNode root) {
    return root == null || mirror(root.left, root.right);
}

boolean mirror(TreeNode left, TreeNode right) {
    if (left == null || right == null) return left == right;
    return left.val == right.val &&
           mirror(left.left, right.right) &&
           mirror(left.right, right.left);
}`,
    python: `def is_symmetric(root):
    def mirror(left, right):
        if not left or not right:
            return left is right
        return (left.val == right.val and
                mirror(left.left, right.right) and
                mirror(left.right, right.left))
    return mirror(root.left, root.right) if root else True`,
    cpp: `bool mirror(TreeNode* left, TreeNode* right) {
    if (!left || !right) return left == right;
    return left->val == right->val &&
           mirror(left->left, right->right) &&
           mirror(left->right, right->left);
}

bool isSymmetric(TreeNode* root) {
    return !root || mirror(root->left, root->right);
}`,
  },
  "binary-trees-validate-binary-search-tree": {
    java: `boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

boolean valid(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return valid(node.left, low, node.val) &&
           valid(node.right, node.val, high);
}`,
    python: `def is_valid_bst(root):
    def valid(node, low, high):
        if not node:
            return True
        if not low < node.val < high:
            return False
        return (valid(node.left, low, node.val) and
                valid(node.right, node.val, high))
    return valid(root, float("-inf"), float("inf"))`,
    cpp: `bool valid(TreeNode* node, long long low, long long high) {
    if (!node) return true;
    if (node->val <= low || node->val >= high) return false;
    return valid(node->left, low, node->val) &&
           valid(node->right, node->val, high);
}

bool isValidBST(TreeNode* root) {
    return valid(root, LLONG_MIN, LLONG_MAX);
}`,
  },
};

export function getBinaryTreeReferenceCode(slug, language) {
  return solutions[slug]?.[language] || "";
}
