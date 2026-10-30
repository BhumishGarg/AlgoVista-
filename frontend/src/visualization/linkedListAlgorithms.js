const linkedListSolutions = {
  "linked-lists-add-two-numbers": {
    java: `ListNode addTwoNumbers(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    int carry = 0;
    while (a != null || b != null || carry != 0) {
        int sum = carry + (a == null ? 0 : a.val) + (b == null ? 0 : b.val);
        tail.next = new ListNode(sum % 10);
        carry = sum / 10;
        tail = tail.next;
        if (a != null) a = a.next;
        if (b != null) b = b.next;
    }
    return dummy.next;
}`,
    python: `def add_two_numbers(a, b):
    dummy = tail = ListNode(0)
    carry = 0
    while a or b or carry:
        total = carry + (a.val if a else 0) + (b.val if b else 0)
        carry, digit = divmod(total, 10)
        tail.next = ListNode(digit)
        tail = tail.next
        a = a.next if a else None
        b = b.next if b else None
    return dummy.next`,
    cpp: `ListNode* addTwoNumbers(ListNode* a, ListNode* b) {
    ListNode dummy(0), *tail = &dummy;
    int carry = 0;
    while (a || b || carry) {
        int sum = carry + (a ? a->val : 0) + (b ? b->val : 0);
        tail->next = new ListNode(sum % 10);
        carry = sum / 10; tail = tail->next;
        if (a) a = a->next; if (b) b = b->next;
    }
    return dummy.next;
}`,
  },
  "linked-lists-copy-list-with-random-pointer": {
    java: `Node copyRandomList(Node head) {
    Map<Node, Node> copy = new HashMap<>();
    for (Node p = head; p != null; p = p.next) copy.put(p, new Node(p.val));
    for (Node p = head; p != null; p = p.next) {
        copy.get(p).next = copy.get(p.next);
        copy.get(p).random = copy.get(p.random);
    }
    return copy.get(head);
}`,
    python: `def copy_random_list(head):
    copies = {}
    node = head
    while node:
        copies[node] = Node(node.val)
        node = node.next
    node = head
    while node:
        copies[node].next = copies.get(node.next)
        copies[node].random = copies.get(node.random)
        node = node.next
    return copies.get(head)`,
    cpp: `Node* copyRandomList(Node* head) {
    unordered_map<Node*, Node*> copies;
    for (Node* p = head; p; p = p->next) copies[p] = new Node(p->val);
    for (Node* p = head; p; p = p->next) {
        copies[p]->next = copies[p->next];
        copies[p]->random = copies[p->random];
    }
    return copies[head];
}`,
  },
  "linked-lists-delete-the-middle-node": {
    java: `ListNode deleteMiddle(ListNode head) {
    if (head == null || head.next == null) return null;
    ListNode slow = head, fast = head, prev = null;
    while (fast != null && fast.next != null) {
        prev = slow; slow = slow.next; fast = fast.next.next;
    }
    prev.next = slow.next;
    return head;
}`,
    python: `def delete_middle(head):
    if not head or not head.next:
        return None
    slow = fast = head
    previous = None
    while fast and fast.next:
        previous, slow, fast = slow, slow.next, fast.next.next
    previous.next = slow.next
    return head`,
    cpp: `ListNode* deleteMiddle(ListNode* head) {
    if (!head || !head->next) return nullptr;
    ListNode *slow = head, *fast = head, *prev = nullptr;
    while (fast && fast->next) {
        prev = slow; slow = slow->next; fast = fast->next->next;
    }
    prev->next = slow->next;
    return head;
}`,
  },
  "linked-lists-intersection-of-two-linked-lists": {
    java: `ListNode getIntersectionNode(ListNode a, ListNode b) {
    ListNode p = a, q = b;
    while (p != q) {
        p = p == null ? b : p.next;
        q = q == null ? a : q.next;
    }
    return p;
}`,
    python: `def get_intersection_node(a, b):
    p, q = a, b
    while p is not q:
        p = b if p is None else p.next
        q = a if q is None else q.next
    return p`,
    cpp: `ListNode* getIntersectionNode(ListNode* a, ListNode* b) {
    ListNode *p = a, *q = b;
    while (p != q) {
        p = p ? p->next : b;
        q = q ? q->next : a;
    }
    return p;
}`,
  },
  "linked-lists-linked-list-cycle": {
    java: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False`,
    cpp: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
  },
  "linked-lists-linked-list-cycle-ii": {
    java: `ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow.next; fast = fast.next; }
            return slow;
        }
    }
    return null;
}`,
    python: `def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow, fast = slow.next, fast.next
            return slow
    return None`,
    cpp: `ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow->next; fast = fast->next; }
            return slow;
        }
    }
    return nullptr;
}`,
  },
  "linked-lists-merge-k-sorted-lists": {
    java: `ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>(Comparator.comparingInt(n -> n.val));
    for (ListNode node : lists) if (node != null) heap.add(node);
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!heap.isEmpty()) {
        ListNode node = heap.remove(); tail.next = node; tail = node;
        if (node.next != null) heap.add(node.next);
    }
    return dummy.next;
}`,
    python: `def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heappush(heap, (node.val, i, node))
    dummy = tail = ListNode(0)
    while heap:
        _, i, node = heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
    cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);
    for (auto node : lists) if (node) heap.push(node);
    ListNode dummy(0), *tail = &dummy;
    while (!heap.empty()) {
        auto node = heap.top(); heap.pop(); tail->next = node; tail = node;
        if (node->next) heap.push(node->next);
    }
    return dummy.next;
}`,
  },
  "linked-lists-merge-two-sorted-lists": {
    java: `ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = a != null ? a : b;
    return dummy.next;
}`,
    python: `def merge_two_lists(a, b):
    dummy = tail = ListNode(0)
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next`,
    cpp: `ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0), *tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
}`,
  },
  "linked-lists-middle-of-the-linked-list": {
    java: `ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
    }
    return slow;
}`,
    python: `def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow`,
    cpp: `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
    }
    return slow;
}`,
  },
  "linked-lists-odd-even-linked-list": {
    java: `ListNode oddEvenList(ListNode head) {
    if (head == null) return null;
    ListNode odd = head, even = head.next, evenHead = even;
    while (even != null && even.next != null) {
        odd.next = even.next; odd = odd.next;
        even.next = odd.next; even = even.next;
    }
    odd.next = evenHead;
    return head;
}`,
    python: `def odd_even_list(head):
    if not head:
        return None
    odd, even, even_head = head, head.next, head.next
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    odd.next = even_head
    return head`,
    cpp: `ListNode* oddEvenList(ListNode* head) {
    if (!head) return nullptr;
    ListNode *odd = head, *even = head->next, *evenHead = even;
    while (even && even->next) {
        odd->next = even->next; odd = odd->next;
        even->next = odd->next; even = even->next;
    }
    odd->next = evenHead;
    return head;
}`,
  },
  "linked-lists-palindrome-linked-list": {
    java: `boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode right = reverse(slow), left = head;
    while (right != null) {
        if (left.val != right.val) return false;
        left = left.next; right = right.next;
    }
    return true;
}`,
    python: `def is_palindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    right = reverse(slow)
    left = head
    while right:
        if left.val != right.val:
            return False
        left, right = left.next, right.next
    return True`,
    cpp: `bool isPalindrome(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* right = reverse(slow);
    for (auto left = head; right; left = left->next, right = right->next)
        if (left->val != right->val) return false;
    return true;
}`,
  },
  "linked-lists-partition-list": {
    java: `ListNode partition(ListNode head, int x) {
    ListNode less = new ListNode(0), more = new ListNode(0);
    ListNode a = less, b = more;
    while (head != null) {
        if (head.val < x) { a.next = head; a = a.next; }
        else { b.next = head; b = b.next; }
        head = head.next;
    }
    b.next = null; a.next = more.next;
    return less.next;
}`,
    python: `def partition(head, x):
    less = low = ListNode(0)
    more = high = ListNode(0)
    while head:
        if head.val < x:
            low.next = head; low = low.next
        else:
            high.next = head; high = high.next
        head = head.next
    high.next = None
    low.next = more.next
    return less.next`,
    cpp: `ListNode* partition(ListNode* head, int x) {
    ListNode less(0), more(0), *a = &less, *b = &more;
    while (head) {
        if (head->val < x) { a->next = head; a = a->next; }
        else { b->next = head; b = b->next; }
        head = head->next;
    }
    b->next = nullptr; a->next = more.next;
    return less.next;
}`,
  },
  "linked-lists-remove-duplicates-from-sorted-list": {
    java: `ListNode deleteDuplicates(ListNode head) {
    for (ListNode p = head; p != null && p.next != null; ) {
        if (p.val == p.next.val) p.next = p.next.next;
        else p = p.next;
    }
    return head;
}`,
    python: `def delete_duplicates(head):
    node = head
    while node and node.next:
        if node.val == node.next.val:
            node.next = node.next.next
        else:
            node = node.next
    return head`,
    cpp: `ListNode* deleteDuplicates(ListNode* head) {
    for (auto p = head; p && p->next; )
        if (p->val == p->next->val) p->next = p->next->next;
        else p = p->next;
    return head;
}`,
  },
  "linked-lists-remove-duplicates-from-sorted-list-ii": {
    java: `ListNode deleteDuplicates(ListNode head) {
    ListNode dummy = new ListNode(0); dummy.next = head;
    ListNode prev = dummy;
    while (head != null) {
        if (head.next != null && head.val == head.next.val) {
            int value = head.val;
            while (head != null && head.val == value) head = head.next;
            prev.next = head;
        } else { prev = head; head = head.next; }
    }
    return dummy.next;
}`,
    python: `def delete_duplicates_ii(head):
    dummy = ListNode(0, head)
    prev = dummy
    while head:
        if head.next and head.val == head.next.val:
            value = head.val
            while head and head.val == value:
                head = head.next
            prev.next = head
        else:
            prev, head = head, head.next
    return dummy.next`,
    cpp: `ListNode* deleteDuplicatesII(ListNode* head) {
    ListNode dummy(0); dummy.next = head;
    ListNode* prev = &dummy;
    while (head) {
        if (head->next && head->val == head->next->val) {
            int value = head->val;
            while (head && head->val == value) head = head->next;
            prev->next = head;
        } else { prev = head; head = head->next; }
    }
    return dummy.next;
}`,
  },
  "linked-lists-remove-nth-node-from-end": {
    java: `ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0); dummy.next = head;
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i < n; i++) fast = fast.next;
    while (fast.next != null) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}`,
    python: `def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next
    return dummy.next`,
    cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0); dummy.next = head;
    ListNode *fast = &dummy, *slow = &dummy;
    while (n--) fast = fast->next;
    while (fast->next) { fast = fast->next; slow = slow->next; }
    slow->next = slow->next->next;
    return dummy.next;
}`,
  },
  "linked-lists-reorder-list": {
    java: `void reorderList(ListNode head) {
    if (head == null) return;
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode second = reverse(slow.next); slow.next = null;
    while (second != null) {
        ListNode a = head.next, b = second.next;
        head.next = second; second.next = a;
        head = a; second = b;
    }
}`,
    python: `def reorder_list(head):
    if not head:
        return
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    second = reverse(slow.next)
    slow.next = None
    first = head
    while second:
        a, b = first.next, second.next
        first.next = second; second.next = a
        first, second = a, b`,
    cpp: `void reorderList(ListNode* head) {
    if (!head) return;
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* second = reverse(slow->next); slow->next = nullptr;
    while (second) {
        auto a = head->next, b = second->next;
        head->next = second; second->next = a;
        head = a; second = b;
    }
}`,
  },
  "linked-lists-reverse-linked-list": {
    java: `ListNode reverseList(ListNode head) {
    ListNode prev = null, current = head;
    while (current != null) {
        ListNode next = current.next;
        current.next = prev;
        prev = current; current = next;
    }
    return prev;
}`,
    python: `def reverse_list(head):
    previous, current = None, head
    while current:
        following = current.next
        current.next = previous
        previous, current = current, following
    return previous`,
    cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    while (head) {
        ListNode* next = head->next;
        head->next = prev;
        prev = head; head = next;
    }
    return prev;
}`,
  },
  "linked-lists-reverse-nodes-in-k-group": {
    java: `ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0); dummy.next = head;
    ListNode groupPrev = dummy;
    while (true) {
        ListNode kth = groupPrev;
        for (int i = 0; i < k && kth != null; i++) kth = kth.next;
        if (kth == null) break;
        ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
        while (cur != groupNext) { ListNode next = cur.next; cur.next = prev; prev = cur; cur = next; }
        ListNode oldHead = groupPrev.next; groupPrev.next = kth; groupPrev = oldHead;
    }
    return dummy.next;
}`,
    python: `def reverse_k_group(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next
        prev, cur = group_next, group_prev.next
        while cur is not group_next:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        old_head = group_prev.next
        group_prev.next = kth
        group_prev = old_head`,
    cpp: `ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0); dummy.next = head;
    ListNode* groupPrev = &dummy;
    while (true) {
        ListNode* kth = groupPrev;
        for (int i = 0; i < k && kth; ++i) kth = kth->next;
        if (!kth) break;
        ListNode *nextGroup = kth->next, *prev = nextGroup, *cur = groupPrev->next;
        while (cur != nextGroup) { auto next = cur->next; cur->next = prev; prev = cur; cur = next; }
        auto oldHead = groupPrev->next; groupPrev->next = kth; groupPrev = oldHead;
    }
    return dummy.next;
}`,
  },
  "linked-lists-rotate-list": {
    java: `ListNode rotateRight(ListNode head, int k) {
    if (head == null) return null;
    ListNode tail = head; int n = 1;
    while (tail.next != null) { tail = tail.next; n++; }
    k %= n; if (k == 0) return head;
    tail.next = head;
    for (int i = 0; i < n - k; i++) tail = tail.next;
    ListNode newHead = tail.next; tail.next = null;
    return newHead;
}`,
    python: `def rotate_right(head, k):
    if not head:
        return None
    tail, length = head, 1
    while tail.next:
        tail, length = tail.next, length + 1
    k %= length
    if not k:
        return head
    tail.next = head
    for _ in range(length - k):
        tail = tail.next
    new_head = tail.next
    tail.next = None
    return new_head`,
    cpp: `ListNode* rotateRight(ListNode* head, int k) {
    if (!head) return nullptr;
    ListNode* tail = head; int n = 1;
    while (tail->next) { tail = tail->next; ++n; }
    k %= n; if (!k) return head;
    tail->next = head;
    for (int i = 0; i < n - k; ++i) tail = tail->next;
    ListNode* newHead = tail->next; tail->next = nullptr;
    return newHead;
}`,
  },
  "linked-lists-swap-nodes-in-pairs": {
    java: `ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0); dummy.next = head;
    ListNode prev = dummy;
    while (prev.next != null && prev.next.next != null) {
        ListNode a = prev.next, b = a.next;
        a.next = b.next; b.next = a; prev.next = b;
        prev = a;
    }
    return dummy.next;
}`,
    python: `def swap_pairs(head):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next and prev.next.next:
        a, b = prev.next, prev.next.next
        a.next = b.next
        b.next = a
        prev.next = b
        prev = a
    return dummy.next`,
    cpp: `ListNode* swapPairs(ListNode* head) {
    ListNode dummy(0); dummy.next = head;
    ListNode* prev = &dummy;
    while (prev->next && prev->next->next) {
        auto a = prev->next, b = a->next;
        a->next = b->next; b->next = a; prev->next = b;
        prev = a;
    }
    return dummy.next;
}`,
  },
};

const LIMIT = 100;

function lineNumbers(text) {
  const lines = text.trim().split(/\r?\n/).map((line) => line.trim());
  return lines.map((line) => line === "" ? [] : line.split(/\s+/).map((part) => {
    if (part.toLowerCase() === "null") return null;
    const value = Number(part);
    return Number.isSafeInteger(value) ? value : part;
  }));
}

function parseLinkedInput(slug, text) {
  const lines = lineNumbers(text);
  if (!lines.length) throw new Error("Enter input values to build the linked list.");
  const row = (index) => lines[index] || [];
  const countRow = (index, max = LIMIT) => {
    const count = Number(row(index)[0]);
    if (!Number.isInteger(count) || count < 0 || count > max) throw new Error(`Enter a valid node count between 0 and ${max}.`);
    return count;
  };
  const valuesAt = (index, count) => {
    const values = row(index);
    if (values.length !== count || values.some((value) => typeof value !== "number")) throw new Error(`Expected ${count} node values on line ${index + 1}.`);
    return values;
  };
  if (slug === "linked-lists-add-two-numbers") {
    const n = countRow(0), first = valuesAt(1, n), m = countRow(2), second = valuesAt(3, m);
    if (!n || !m || first.some((x) => x < 0 || x > 9) || second.some((x) => x < 0 || x > 9)) throw new Error("Each number must contain at least one digit from 0 to 9.");
    return { lists: [{ label: "Number A (reverse digits)", values: first }, { label: "Number B (reverse digits)", values: second }] };
  }
  if (slug === "linked-lists-copy-list-with-random-pointer") {
    const n = countRow(0, 1000), nodes = [];
    for (let i = 0; i < n; i++) {
      const parts = row(i + 1);
      if (parts.length !== 2 || typeof parts[0] !== "number") throw new Error(`Line ${i + 2} must contain a value and random index (or null).`);
      const random = parts[1];
      if (random !== null && (!Number.isInteger(random) || random < 0 || random >= n)) throw new Error(`Random index on line ${i + 2} must be between 0 and ${n - 1}, or null.`);
      nodes.push({ value: parts[0], random });
    }
    return { nodes };
  }
  if (slug === "linked-lists-intersection-of-two-linked-lists") {
    const a = countRow(0), first = valuesAt(1, a), b = countRow(2), second = valuesAt(3, b), c = countRow(4), shared = valuesAt(5, c);
    if (a + b + c > LIMIT) throw new Error(`Use at most ${LIMIT} total nodes for responsive playback.`);
    return { lists: [{ label: "List A", values: [...first, ...shared] }, { label: "List B", values: [...second, ...shared] }], prefixes: [a, b], shared };
  }
  if (slug === "linked-lists-linked-list-cycle" || slug === "linked-lists-linked-list-cycle-ii") {
    const n = countRow(0), values = valuesAt(1, n), pos = Number(row(2)[0]);
    if (!Number.isInteger(pos) || pos < -1 || pos >= n) throw new Error("Cycle position must be -1 or a valid node index.");
    if (pos !== -1 && n === 0) throw new Error("An empty list cannot have a cycle.");
    return { lists: [{ label: "next links", values }], pos };
  }
  if (slug === "linked-lists-merge-k-sorted-lists") {
    const k = countRow(0, 20), lists = [];
    let lineIndex = 1;
    let total = 0;
    for (let i = 0; i < k; i++) {
      const count = countRow(lineIndex++);
      const values = valuesAt(lineIndex++, count);
      if (values.some((value, index) => index > 0 && value < values[index - 1])) throw new Error(`List ${i + 1} must be sorted.`);
      total += count;
      lists.push({ label: `List ${i + 1}`, values });
    }
    if (total > LIMIT) throw new Error(`Use at most ${LIMIT} total nodes for responsive playback.`);
    return { lists };
  }
  if (slug === "linked-lists-merge-two-sorted-lists") {
    const n = countRow(0), first = valuesAt(1, n), m = countRow(2), second = valuesAt(3, m);
    if ([first, second].some((list) => list.some((value, index) => index > 0 && value < list[index - 1]))) throw new Error("Both lists must be sorted in non-decreasing order.");
    return { lists: [{ label: "List A", values: first }, { label: "List B", values: second }] };
  }
  if (slug === "linked-lists-partition-list") {
    const [n, pivot] = row(0);
    if (!Number.isInteger(n) || n < 0 || n > LIMIT || !Number.isInteger(pivot)) throw new Error(`Enter a node count from 0 to ${LIMIT} and partition value x on the first line.`);
    return { lists: [{ label: "list", values: valuesAt(1, n) }], pivot };
  }
  if (slug === "linked-lists-remove-nth-node-from-end" ||
      slug === "linked-lists-reverse-nodes-in-k-group" ||
      slug === "linked-lists-rotate-list") {
    const [n, parameter] = row(0);
      if (!Number.isInteger(n) || n < 0 || n > LIMIT || !Number.isInteger(parameter)) throw new Error(`Enter a node count from 0 to ${LIMIT} and an integer operation parameter on the first line.`);
    const values = valuesAt(1, n);
    if (slug === "linked-lists-remove-nth-node-from-end" && (parameter < 1 || parameter > n)) throw new Error("n must be between 1 and the list length.");
    if (slug === "linked-lists-reverse-nodes-in-k-group" && (parameter < 1 || parameter > n)) throw new Error("k must be between 1 and the list length.");
    if (slug === "linked-lists-rotate-list" && parameter < 0) throw new Error("Rotation count k cannot be negative.");
    return { lists: [{ label: "list", values }], parameter };
  }
  const n = countRow(0), values = valuesAt(1, n);
  if (slug === "linked-lists-remove-duplicates-from-sorted-list" ||
      slug === "linked-lists-remove-duplicates-from-sorted-list-ii" ||
      slug === "linked-lists-merge-two-sorted-lists") {
    if (values.some((value, index) => index > 0 && value < values[index - 1])) throw new Error("The input list must be sorted in non-decreasing order.");
  }
  return { lists: [{ label: "list", values }] };
}

function stringifyList(values) {
  return values.length ? values.join(" -> ") : "∅";
}

export function getLinkedListReferenceCode(slug, language) {
  return linkedListSolutions[slug]?.[language] || null;
}

export function buildLinkedListTrace(slug, text) {
  const input = parseLinkedInput(slug, text);
  const frames = [];
  const maxFrames = 240;
  let list = input.lists?.[0]?.values ? [...input.lists[0].values] : [];
  const push = (message, lists = [{ label: "list", values: [...list] }], pointers = {}, variables = {}, result = null, options = {}) => {
    const frame = {
      message,
      lists: lists.map((item) => ({ ...item, values: [...item.values] })),
      pointers: { ...pointers },
      variables: { ...variables },
      result,
      links: [...(options.links || [])],
      randomNodes: options.randomNodes ? options.randomNodes.map((node) => ({ ...node })) : null,
      resultLists: options.resultLists || null,
    };
    if (options.final) {
      if (frames.length >= maxFrames) frames.pop();
      frames.push(frame);
    } else if (frames.length < maxFrames - 1) frames.push(frame);
  };
  const finish = (message, result, lists, pointers = {}, variables = {}, options = {}) =>
    push(message, lists, pointers, variables, String(result), { ...options, final: true });
  const standard = () => [{ label: "list", values: [...list] }];
  let result;

  switch (slug) {
    case "linked-lists-add-two-numbers": {
      const a = [...input.lists[0].values], b = [...input.lists[1].values], sum = [];
      let i = 0, carry = 0;
      while (i < a.length || i < b.length || carry) {
        const x = a[i] || 0, y = b[i] || 0, total = x + y + carry;
        const digit = total % 10;
        carry = Math.floor(total / 10);
        sum.push(digit);
        push(`Add digits ${x} + ${y} + carry to get ${total}; write ${digit}, carry ${carry}.`,
          [...input.lists, { label: "sum (reverse digits)", values: [...sum] }],
          { A: Math.min(i, a.length - 1), B: Math.min(i, b.length - 1), result: sum.length - 1 },
          { digitA: x, digitB: y, carry: total - x - y, sum: total, digitOut: digit, carryOut: carry });
        i++;
      }
      result = stringifyList(sum);
      finish(`The digit-by-digit sum is ${result}.`, result, [...input.lists, { label: "sum", values: sum }], {}, { carry: 0 });
      break;
    }
    case "linked-lists-copy-list-with-random-pointer": {
      const originals = input.nodes.map((node) => node.value);
      const copies = [];
      for (let i = 0; i < input.nodes.length; i++) {
        copies.push(input.nodes[i].value);
        push(`Create an independent copy of node ${i} with value ${input.nodes[i].value}.`,
          [{ label: "original nodes", values: originals }, { label: "copied nodes", values: copies }],
          { original: i, copy: i }, { copied: copies.length, randomTarget: input.nodes[i].random ?? "null" },
          null, { randomNodes: input.nodes });
      }
      for (let i = 0; i < input.nodes.length; i++) {
        push(`Connect copied node ${i}'s next link to the following copy and random link to ${input.nodes[i].random ?? "null"}.`,
          [{ label: "original nodes", values: originals }, { label: "copied nodes", values: copies }],
          { original: i, copy: i }, { next: i + 1 < copies.length ? i + 1 : "null", random: input.nodes[i].random ?? "null" },
          null, { randomNodes: input.nodes });
      }
      result = JSON.stringify(input.nodes.map((node) => [node.value, node.random]));
      finish("The copy preserves every value and random link, with new node identities.", result,
        [{ label: "original nodes", values: originals }, { label: "copied nodes", values: copies }],
        {}, { copiedNodes: copies.length }, { randomNodes: input.nodes });
      break;
    }
    case "linked-lists-delete-the-middle-node": {
      let slow = 0, fast = 0, previous = -1;
      while (fast < list.length) {
        previous = slow;
        slow++;
        fast += 2;
        push(`Advance slow to ${slow < list.length ? list[slow] : "null"} and fast two links.`, standard(),
          { ...(slow < list.length ? { slow } : {}), ...(previous >= 0 ? { previous } : {}) }, { slowIndex: slow, fastIndex: fast });
      }
      const middleIndex = Math.floor(list.length / 2);
      const removed = list[middleIndex];
      list.splice(middleIndex, 1);
      result = stringifyList(list);
      finish(`Remove the middle node (value ${removed}) by linking its predecessor to its successor.`, result, standard(),
        { ...(middleIndex > 0 ? { previous: middleIndex - 1 } : {}) }, { removed: removed ?? "none" });
      break;
    }
    case "linked-lists-intersection-of-two-linked-lists": {
      const [a, b] = input.lists;
      let p = 0, q = 0, steps = 0;
      const max = (a.values.length + b.values.length) * 2 + 2;
      while (steps < max) {
        if (p < a.values.length && q < b.values.length && p >= input.prefixes[0] && q >= input.prefixes[1] &&
            p - input.prefixes[0] === q - input.prefixes[1]) break;
        const sameSharedNode = p >= input.prefixes[0] && q >= input.prefixes[1] &&
          p - input.prefixes[0] === q - input.prefixes[1];
        if (sameSharedNode || (p === a.values.length && q === b.values.length)) break;
        push("Advance each pointer; when one list ends, redirect it to the other list's head.",
          [{ label: "List A", values: a.values }, { label: "List B", values: b.values }],
          { ...(p < a.values.length ? { A: p } : {}), ...(q < b.values.length ? { B: q } : {}) },
          { pointerA: p < a.values.length ? a.values[p] : "null", pointerB: q < b.values.length ? b.values[q] : "null" });
        p = p < a.values.length ? p + 1 : 0;
        q = q < b.values.length ? q + 1 : 0;
        steps++;
      }
      const intersects = input.shared.length > 0;
      const value = intersects ? input.shared[0] : null;
      result = intersects ? `Intersection at node with value ${value}` : "null";
      finish(intersects ? `Both pointers reach the same shared node (identity is shared).` : "Both pointers reach null; the lists do not intersect.",
        result, [{ label: "List A", values: a.values }, { label: "List B", values: b.values }],
        intersects ? { A: input.prefixes[0], B: input.prefixes[1] } : {},
        { intersection: value ?? "null" }, { links: intersects ? ["The suffix nodes are the same shared nodes in both lists."] : [] });
      break;
    }
    case "linked-lists-linked-list-cycle":
    case "linked-lists-linked-list-cycle-ii": {
        const pos = input.pos;
      let slow = list.length ? 0 : -1, fast = list.length ? 0 : -1, meeting = false, steps = 0;
      const next = (index) => index < 0 || index >= list.length ? -1 : index === list.length - 1 ? pos : index + 1;
      const advance = (index, count = 1) => {
        for (let i = 0; i < count && index !== -1; i++) index = next(index);
        return index;
      };
      const cyclicLists = () => [{ label: "next links", values: list }];
      while (slow !== -1 && fast !== -1 && advance(fast, 2) !== -1 && steps <= list.length * 2 + 1) {
        slow = advance(slow);
        fast = advance(fast, 2);
        push(`Move slow one link and fast two links.`, cyclicLists(),
          { ...(slow !== -1 ? { slow } : {}), ...(fast !== -1 ? { fast } : {}) },
          { slowValue: list[slow] ?? "null", fastValue: list[fast] ?? "null" },
          null, { links: pos >= 0 ? [`tail at index ${list.length - 1} points back to index ${pos}`] : [] });
        if (slow !== -1 && slow === fast) { meeting = true; break; }
        steps++;
      }
      if (slug === "linked-lists-linked-list-cycle") {
        result = meeting ? "true" : "false";
        finish(meeting ? "Slow and fast pointers meet, so a cycle exists." : "Fast reaches null, so there is no cycle.",
          result, cyclicLists(), meeting ? { slow, fast } : {}, { hasCycle: result },
          { links: pos >= 0 ? [`tail at index ${list.length - 1} points back to index ${pos}`] : [] });
      } else {
        let entry = null;
        if (meeting) {
          slow = 0;
          while (slow !== fast && steps++ < list.length * 3 + 2) {
            push("Reset slow to the head, then advance both pointers one link.", cyclicLists(), { slow, fast }, {});
            slow = advance(slow); fast = advance(fast);
          }
          entry = slow;
        }
        result = entry === null ? "null" : `Cycle begins at index ${entry}, value ${list[entry]}`;
        finish(entry === null ? "There is no cycle, so no entry node exists." : `Both pointers meet at cycle entry index ${entry}.`,
          result, cyclicLists(), entry === null ? {} : { entry }, { entryIndex: entry ?? "null", entryValue: entry === null ? "null" : list[entry] },
          { links: pos >= 0 ? [`tail at index ${list.length - 1} points back to index ${pos}`] : [] });
      }
      break;
    }
    case "linked-lists-merge-k-sorted-lists": {
      const lists = input.lists.map((item) => ({ ...item, values: [...item.values] }));
      const resultValues = [];
      let total = lists.reduce((sum, item) => sum + item.values.length, 0);
      while (resultValues.length < total) {
        let bestList = -1;
        for (let i = 0; i < lists.length; i++) if (lists[i].values.length &&
          (bestList < 0 || lists[i].values[0] < lists[bestList].values[0])) bestList = i;
        const value = lists[bestList].values.shift();
        resultValues.push(value);
        push(`Select the smallest list head (${value}) and append it to the merged list.`,
          [...lists.map((item) => ({ label: item.label, values: [...item.values] })), { label: "merged", values: resultValues }],
          { [`L${bestList + 1}`]: 0, result: resultValues.length - 1 }, { selectedHead: value, remaining: total - resultValues.length });
      }
      result = stringifyList(resultValues);
      finish("All input lists have been merged in sorted order.", result,
        [...lists.map((item) => ({ label: item.label, values: [...item.values] })), { label: "merged", values: resultValues }]);
      break;
    }
    case "linked-lists-merge-two-sorted-lists": {
      const [a, b] = input.lists;
      let i = 0, j = 0;
      const merged = [];
      while (i < a.values.length || j < b.values.length) {
        if (j >= b.values.length || (i < a.values.length && a.values[i] <= b.values[j])) merged.push(a.values[i++]);
        else merged.push(b.values[j++]);
        push(`Compare the current heads and attach the smaller value to the result.`,
          [{ label: "List A", values: a.values }, { label: "List B", values: b.values }, { label: "merged", values: merged }],
          { ...(i < a.values.length ? { A: i } : {}), ...(j < b.values.length ? { B: j } : {}), result: merged.length - 1 },
          { nextA: a.values[i] ?? "null", nextB: b.values[j] ?? "null" });
      }
      list = merged; result = stringifyList(merged);
      finish("Append any remaining nodes; the merged list is sorted.", result,
        [{ label: "List A", values: a.values }, { label: "List B", values: b.values }, { label: "merged", values: merged }]);
      break;
    }
    case "linked-lists-middle-of-the-linked-list": {
      let slow = 0, fast = 0;
      while (fast < list.length && fast + 1 < list.length) {
        slow++; fast += 2;
        push("Move slow one node and fast two nodes.", standard(),
          { ...(slow < list.length ? { slow } : {}), ...(fast < list.length ? { fast } : {}) },
          { slowIndex: slow, fastIndex: fast < list.length ? fast : "null" });
      }
      const index = Math.floor(list.length / 2);
      result = `Middle node: index ${index}, value ${list[index]}`;
      finish("Fast reached the end; slow points to the middle (second middle for even length).", result,
        standard(), { middle: index }, { value: list[index] });
      break;
    }
    case "linked-lists-odd-even-linked-list": {
      const odd = [], even = [];
      for (let i = 0; i < list.length; i++) {
        (i % 2 === 0 ? odd : even).push(list[i]);
        push(`Append node at position ${i + 1} to the ${i % 2 === 0 ? "odd" : "even"} chain.`,
          [{ label: "odd positions", values: [...odd] }, { label: "even positions", values: [...even] }],
          { [i % 2 === 0 ? "odd" : "even"]: (i % 2 === 0 ? odd : even).length - 1 },
          { position: i + 1, value: list[i] });
      }
      list = [...odd, ...even]; result = stringifyList(list);
      finish("Attach the even-position chain after the odd-position chain.", result,
        [{ label: "odd positions", values: odd }, { label: "even positions", values: even }, { label: "result", values: list }]);
      break;
    }
    case "linked-lists-palindrome-linked-list": {
      let left = 0, right = list.length - 1, palindrome = true;
      while (left < right) {
        const match = list[left] === list[right];
        push(`Compare ${list[left]} at the left with ${list[right]} at the right: ${match ? "match" : "different"}.`,
          standard(), { left, right }, { leftValue: list[left], rightValue: list[right], palindrome: match });
        if (!match) { palindrome = false; break; }
        left++; right--;
      }
      result = String(palindrome);
      finish(palindrome ? "All mirrored values match; the list is a palindrome." : "A mirrored pair differs; the list is not a palindrome.",
        result, standard(), {}, { palindrome: result });
      break;
    }
    case "linked-lists-partition-list": {
      const less = [], greater = [];
      for (let i = 0; i < list.length; i++) {
        (list[i] < input.pivot ? less : greater).push(list[i]);
        push(`Place ${list[i]} in the ${list[i] < input.pivot ? "less-than" : "greater-or-equal"} chain.`,
          [{ label: `< ${input.pivot}`, values: [...less] }, { label: `>= ${input.pivot}`, values: [...greater] }],
          { current: i }, { pivot: input.pivot, value: list[i] });
      }
      list = [...less, ...greater]; result = stringifyList(list);
      finish("Join the less-than chain before the greater-or-equal chain, preserving order.", result,
        [{ label: `< ${input.pivot}`, values: less }, { label: `>= ${input.pivot}`, values: greater }, { label: "result", values: list }]);
      break;
    }
    case "linked-lists-remove-duplicates-from-sorted-list": {
      const resultValues = [];
      for (let i = 0; i < list.length; i++) {
        const keep = i === 0 || list[i] !== list[i - 1];
        if (keep) resultValues.push(list[i]);
        push(keep ? `Keep ${list[i]}.` : `Bypass duplicate node ${list[i]} by changing the next link.`,
          [{ label: "input", values: list }, { label: "result", values: resultValues }],
          { current: i, ...(keep ? { result: resultValues.length - 1 } : {}) },
          { value: list[i], action: keep ? "keep" : "skip" });
      }
      list = resultValues; result = stringifyList(list);
      finish("Each value now appears once.", result, [{ label: "result", values: list }]);
      break;
    }
    case "linked-lists-remove-duplicates-from-sorted-list-ii": {
      const kept = [];
      for (let i = 0; i < list.length;) {
        let j = i + 1;
        while (j < list.length && list[j] === list[i]) j++;
        const unique = j === i + 1;
        if (unique) kept.push(list[i]);
        push(unique ? `Value ${list[i]} occurs once; keep it.` : `Value ${list[i]} repeats; skip the entire group.`,
          [{ label: "input", values: list }, { label: "unique result", values: kept }],
          { start: i, ...(unique ? { result: kept.length - 1 } : {}), ...(j - 1 > i ? { end: j - 1 } : {}) },
          { value: list[i], occurrences: j - i, action: unique ? "keep" : "remove group" });
        i = j;
      }
      list = kept; result = stringifyList(list);
      finish("Only values that occurred once remain.", result, [{ label: "result", values: list }]);
      break;
    }
    case "linked-lists-remove-nth-node-from-end": {
      const n = input.parameter;
      let fast = 0, slow = 0;
      for (let i = 0; i < n; i++) {
        fast++;
        push(`Move fast pointer ${i + 1} of ${n} steps ahead.`, standard(),
          { ...(fast < list.length ? { fast } : {}), slow }, { gap: i + 1 });
      }
      while (fast < list.length) {
        fast++; slow++;
        push("Move fast and slow together, preserving their gap.", standard(),
          { ...(fast < list.length ? { fast } : {}), ...(slow < list.length ? { slow } : {}) }, { fastIndex: fast, slowIndex: slow });
      }
      const removed = list[slow];
      list.splice(slow, 1); result = stringifyList(list);
      finish(`Remove node ${removed} at index ${slow}, the ${n}th node from the end.`,
        result, standard(), {}, { removed, index: slow });
      break;
    }
    case "linked-lists-reorder-list": {
      const first = list.filter((_, index) => index < Math.ceil(list.length / 2));
      const second = list.slice(first.length).reverse();
      const reordered = [];
      for (let i = 0; i < first.length; i++) {
        reordered.push(first[i]);
        if (second[i] !== undefined) reordered.push(second[i]);
        push("Take one node from the front half, then one from the reversed back half.",
          [{ label: "first half", values: first }, { label: "reversed second half", values: second }, { label: "reordered", values: reordered }],
          { first: i, ...(second[i] !== undefined ? { second: i } : {}) }, { mergedNodes: reordered.length });
      }
      list = reordered; result = stringifyList(list);
      finish("The two halves are merged alternately.", result, [{ label: "reordered", values: list }]);
      break;
    }
    case "linked-lists-reverse-linked-list": {
      let previous = [];
      const original = [...list];
      for (let i = 0; i < original.length; i++) {
        const node = original[i];
        previous = [node, ...previous];
        push(`Save the next node, then point ${node} back toward the reversed chain.`,
          [{ label: "unprocessed", values: original.slice(i + 1) }, { label: "reversed", values: previous }],
          { current: 0 }, { previousHead: previous[0], nextNode: original[i + 1] ?? "null" });
      }
      list = previous; result = stringifyList(list);
      finish("The previous pointer is the new head.", result, [{ label: "reversed list", values: list }]);
      break;
    }
    case "linked-lists-reverse-nodes-in-k-group": {
      const k = input.parameter, groups = [];
      for (let start = 0; start < list.length; start += k) {
        const chunk = list.slice(start, start + k);
        const complete = chunk.length === k;
        const transformed = complete ? [...chunk].reverse() : chunk;
        groups.push(...transformed);
        push(complete ? `Reverse complete group ${chunk.join(" -> ")}.` : `Keep incomplete final group ${chunk.join(" -> ")} unchanged.`,
          [{ label: "input", values: list }, { label: "processed", values: groups }, { label: "remaining", values: list.slice(start + k) }],
          { groupStart: start, groupEnd: Math.max(start, start + chunk.length - 1) },
          { k, group: stringifyList(chunk), action: complete ? "reverse" : "keep" });
      }
      list = groups; result = stringifyList(list);
      finish(`Complete groups of ${k} are reversed; an incomplete final group remains unchanged.`,
        result, [{ label: "result", values: list }], {}, { k });
      break;
    }
    case "linked-lists-rotate-list": {
      const k = list.length ? input.parameter % list.length : 0;
      if (list.length && k) {
        push("Connect the tail to the head temporarily to form a circular list.", standard(), { tail: list.length - 1, head: 0 }, { length: list.length, rotations: k }, null, { links: [`tail → head (temporary cycle)`] });
        const split = list.length - k;
        for (let i = 0; i < split; i++) push("Move to find the new tail position.", standard(), { tail: i }, { newTailIndex: split - 1, rotations: k }, null, { links: ["temporary circular link is active"] });
        list = [...list.slice(split), ...list.slice(0, split)];
      }
      result = stringifyList(list);
      finish(k === 0 ? "The effective rotation count is zero; list order is unchanged." : `Break the temporary cycle after ${list.length - k - 1}; the suffix becomes the new head.`,
        result, standard(), { newHead: 0 }, { effectiveRotations: k });
      break;
    }
    case "linked-lists-swap-nodes-in-pairs": {
      const swapped = [];
      for (let i = 0; i < list.length; i += 2) {
        const pair = list.slice(i, i + 2);
        if (pair.length === 2) swapped.push(pair[1], pair[0]);
        else swapped.push(pair[0]);
        push(pair.length === 2 ? `Redirect links to swap adjacent nodes ${pair[0]} and ${pair[1]}.` : `No partner remains for ${pair[0]}; leave it unchanged.`,
          [{ label: "input", values: list }, { label: "result", values: swapped }],
          { first: i, ...(pair.length === 2 ? { second: i + 1 } : {}) },
          { pair: stringifyList(pair), action: pair.length === 2 ? "swap links" : "keep" });
      }
      list = swapped; result = stringifyList(list);
      finish("All adjacent pairs are swapped; any final unpaired node stays in place.", result, [{ label: "result", values: list }]);
      break;
    }
    default:
      throw new Error("No linked-list visualizer is available for this question.");
  }
  return frames;
}
