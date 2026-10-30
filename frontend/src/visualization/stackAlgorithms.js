const solutions = {
  "stacks-asteroid-collision": {
    java: `int[] asteroidCollision(int[] asteroids) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (int asteroid : asteroids) {
        boolean alive = true;
        while (alive && asteroid < 0 && !stack.isEmpty() && stack.peek() > 0) {
            if (stack.peek() < -asteroid) stack.pop();
            else if (stack.peek() == -asteroid) { stack.pop(); alive = false; }
            else alive = false;
        }
        if (alive) stack.push(asteroid);
    }
    int[] result = new int[stack.size()];
    for (int i = result.length - 1; i >= 0; i--) result[i] = stack.pop();
    return result;
}`,
    python: `def asteroid_collision(asteroids):
    stack = []
    for asteroid in asteroids:
        alive = True
        while alive and asteroid < 0 and stack and stack[-1] > 0:
            if stack[-1] < -asteroid:
                stack.pop()
            elif stack[-1] == -asteroid:
                stack.pop()
                alive = False
            else:
                alive = False
        if alive:
            stack.append(asteroid)
    return stack`,
    cpp: `vector<int> asteroidCollision(vector<int>& asteroids) {
    vector<int> stack;
    for (int x : asteroids) {
        bool alive = true;
        while (alive && x < 0 && !stack.empty() && stack.back() > 0) {
            if (stack.back() < -x) stack.pop_back();
            else if (stack.back() == -x) { stack.pop_back(); alive = false; }
            else alive = false;
        }
        if (alive) stack.push_back(x);
    }
    return stack;
}`,
  },
  "stacks-backspace-string-compare": {
    java: `boolean backspaceCompare(String s, String t) {
    return build(s).equals(build(t));
}
String build(String value) {
    StringBuilder stack = new StringBuilder();
    for (char c : value.toCharArray()) {
        if (c == '#') { if (stack.length() > 0) stack.setLength(stack.length() - 1); }
        else stack.append(c);
    }
    return stack.toString();
}`,
    python: `def backspace_compare(s, t):
    def build(text):
        stack = []
        for char in text:
            if char == "#":
                if stack: stack.pop()
            else:
                stack.append(char)
        return "".join(stack)
    return build(s) == build(t)`,
    cpp: `bool backspaceCompare(string s, string t) {
    auto build = [](string text) {
        string stack;
        for (char c : text) {
            if (c == '#') { if (!stack.empty()) stack.pop_back(); }
            else stack.push_back(c);
        }
        return stack;
    };
    return build(s) == build(t);
}`,
  },
  "stacks-baseball-game": {
    java: `int calPoints(String[] ops) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String op : ops) {
        if (op.equals("+")) { int a = stack.pop(), b = stack.peek(); stack.push(a); stack.push(a + b); }
        else if (op.equals("D")) stack.push(2 * stack.peek());
        else if (op.equals("C")) stack.pop();
        else stack.push(Integer.parseInt(op));
    }
    return stack.stream().mapToInt(Integer::intValue).sum();
}`,
    python: `def cal_points(ops):
    stack = []
    for op in ops:
        if op == "+": stack.append(stack[-1] + stack[-2])
        elif op == "D": stack.append(2 * stack[-1])
        elif op == "C": stack.pop()
        else: stack.append(int(op))
    return sum(stack)`,
    cpp: `int calPoints(vector<string>& ops) {
    vector<int> stack;
    for (string op : ops) {
        if (op == "+") stack.push_back(stack.back() + stack[stack.size()-2]);
        else if (op == "D") stack.push_back(2 * stack.back());
        else if (op == "C") stack.pop_back();
        else stack.push_back(stoi(op));
    }
    return accumulate(stack.begin(), stack.end(), 0);
}`,
  },
  "stacks-basic-calculator": {
    java: `int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int result = 0, number = 0, sign = 1;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) number = number * 10 + c - '0';
        else if (c == '+' || c == '-') {
            result += sign * number; number = 0; sign = c == '+' ? 1 : -1;
        } else if (c == '(') { stack.push(result); stack.push(sign); result = 0; sign = 1; }
        else if (c == ')') { result += sign * number; number = 0; result = stack.pop() * result + stack.pop(); }
    }
    return result + sign * number;
}`,
    python: `def calculate(s):
    stack = []
    result = number = 0
    sign = 1
    for char in s:
        if char.isdigit(): number = number * 10 + int(char)
        elif char in "+-":
            result += sign * number; number = 0
            sign = 1 if char == "+" else -1
        elif char == "(":
            stack.extend((result, sign)); result = 0; sign = 1
        elif char == ")":
            result += sign * number; number = 0
            result = stack.pop() * result + stack.pop()
    return result + sign * number`,
    cpp: `int calculate(string s) {
    stack<int> context;
    int result=0, number=0, sign=1;
    for (char c : s) {
        if (isdigit(c)) number=number*10+c-'0';
        else if (c=='+' || c=='-') { result+=sign*number; number=0; sign=c=='+'?1:-1; }
        else if (c=='(') { context.push(result); context.push(sign); result=0; sign=1; }
        else if (c==')') { result+=sign*number; number=0; result=context.top()*result; context.pop(); result+=context.top(); context.pop(); }
    }
    return result+sign*number;
}`,
  },
  "stacks-basic-calculator-ii": {
    java: `int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int number = 0; char sign = '+';
    for (int i=0; i<s.length(); i++) {
        char c=s.charAt(i);
        if (Character.isDigit(c)) number=number*10+c-'0';
        if ((!Character.isDigit(c) && c!=' ') || i==s.length()-1) {
            if (sign=='+') stack.push(number); else if (sign=='-') stack.push(-number);
            else if (sign=='*') stack.push(stack.pop()*number);
            else if (sign=='/') stack.push(stack.pop()/number);
            sign=c; number=0;
        }
    }
    return stack.stream().mapToInt(Integer::intValue).sum();
}`,
    python: `def calculate(s):
    stack = []
    number = 0
    sign = "+"
    for i, char in enumerate(s):
        if char.isdigit(): number = number * 10 + int(char)
        if (not char.isdigit() and char != " ") or i == len(s) - 1:
            if sign == "+": stack.append(number)
            elif sign == "-": stack.append(-number)
            elif sign == "*": stack.append(stack.pop() * number)
            else: stack.append(int(stack.pop() / number))
            sign, number = char, 0
    return sum(stack)`,
    cpp: `int calculate(string s) {
    vector<int> stack;
    int number=0; char sign='+';
    for (int i=0; i<s.size(); ++i) {
        char c=s[i]; if (isdigit(c)) number=number*10+c-'0';
        if ((!isdigit(c) && c!=' ') || i==s.size()-1) {
            if (sign=='+') stack.push_back(number); else if (sign=='-') stack.push_back(-number);
            else if (sign=='*') { stack.back()*=number; }
            else stack.back()/=number;
            sign=c; number=0;
        }
    }
    return accumulate(stack.begin(),stack.end(),0);
}`,
  },
  "stacks-daily-temperatures": {
    java: `int[] dailyTemperatures(int[] t) {
    int[] answer = new int[t.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i=0; i<t.length; i++) {
        while (!stack.isEmpty() && t[i] > t[stack.peek()]) {
            int day=stack.pop(); answer[day]=i-day;
        }
        stack.push(i);
    }
    return answer;
}`,
    python: `def daily_temperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []
    for day, temperature in enumerate(temperatures):
        while stack and temperature > temperatures[stack[-1]]:
            previous = stack.pop()
            answer[previous] = day - previous
        stack.append(day)
    return answer`,
    cpp: `vector<int> dailyTemperatures(vector<int>& t) {
    vector<int> answer(t.size()), stack;
    for (int i=0; i<t.size(); ++i) {
        while (!stack.empty() && t[i]>t[stack.back()]) {
            int day=stack.back(); stack.pop_back(); answer[day]=i-day;
        }
        stack.push_back(i);
    }
    return answer;
}`,
  },
  "stacks-decode-string": {
    java: `String decodeString(String s) {
    Deque<Integer> counts = new ArrayDeque<>();
    Deque<StringBuilder> strings = new ArrayDeque<>();
    StringBuilder current = new StringBuilder(); int number=0;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) number=number*10+c-'0';
        else if (c=='[') { counts.push(number); strings.push(current); current=new StringBuilder(); number=0; }
        else if (c==']') { String part=current.toString(); current=strings.pop().append(part.repeat(counts.pop())); }
        else current.append(c);
    }
    return current.toString();
}`,
    python: `def decode_string(s):
    counts, strings = [], []
    current, number = "", 0
    for char in s:
        if char.isdigit(): number = number * 10 + int(char)
        elif char == "[":
            counts.append(number); strings.append(current)
            current, number = "", 0
        elif char == "]": current = strings.pop() + current * counts.pop()
        else: current += char
    return current`,
    cpp: `string decodeString(string s) {
    stack<int> counts; stack<string> strings;
    string current; int number=0;
    for (char c : s) {
        if (isdigit(c)) number=number*10+c-'0';
        else if (c=='[') { counts.push(number); strings.push(current); current=""; number=0; }
        else if (c==']') { string part=current; current=strings.top(); strings.pop(); for(int i=0,n=counts.top();i<n;++i) current+=part; counts.pop(); }
        else current+=c;
    }
    return current;
}`,
  },
  "stacks-evaluate-reverse-polish-notation": {
    java: `int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String token : tokens) {
        if ("+-*/".contains(token) && token.length()==1) {
            int b=stack.pop(), a=stack.pop();
            stack.push(switch(token) { case "+" -> a+b; case "-" -> a-b; case "*" -> a*b; default -> a/b; });
        } else stack.push(Integer.parseInt(token));
    }
    return stack.pop();
}`,
    python: `def eval_rpn(tokens):
    stack = []
    for token in tokens:
        if token in "+-*/":
            b, a = stack.pop(), stack.pop()
            if token == "+": stack.append(a + b)
            elif token == "-": stack.append(a - b)
            elif token == "*": stack.append(a * b)
            else: stack.append(int(a / b))
        else: stack.append(int(token))
    return stack[-1]`,
    cpp: `int evalRPN(vector<string>& tokens) {
    vector<int> stack;
    for (string token : tokens) {
        if (token.size()==1 && string("+-*/").find(token[0])!=string::npos) {
            int b=stack.back(); stack.pop_back(); int a=stack.back(); stack.pop_back();
            if(token=="+") stack.push_back(a+b); else if(token=="-") stack.push_back(a-b);
            else if(token=="*") stack.push_back(a*b); else stack.push_back(a/b);
        } else stack.push_back(stoi(token));
    }
    return stack.back();
}`,
  },
  "stacks-largest-rectangle-in-histogram": {
    java: `int largestRectangleArea(int[] h) {
    Deque<Integer> stack = new ArrayDeque<>(); int best=0;
    for (int i=0; i<=h.length; i++) {
        int height=i==h.length?0:h[i];
        while (!stack.isEmpty() && h[stack.peek()] > height) {
            int bar=stack.pop(), left=stack.isEmpty()?-1:stack.peek();
            best=Math.max(best,h[bar]*(i-left-1));
        }
        stack.push(i);
    }
    return best;
}`,
    python: `def largest_rectangle_area(heights):
    stack, best = [], 0
    for i in range(len(heights) + 1):
        height = 0 if i == len(heights) else heights[i]
        while stack and heights[stack[-1]] > height:
            bar = stack.pop()
            left = stack[-1] if stack else -1
            best = max(best, heights[bar] * (i - left - 1))
        stack.append(i)
    return best`,
    cpp: `int largestRectangleArea(vector<int>& h) {
    vector<int> stack; int best=0;
    for(int i=0;i<=h.size();++i) {
        int height=i==h.size()?0:h[i];
        while(!stack.empty() && h[stack.back()]>height) {
            int bar=stack.back(); stack.pop_back();
            int left=stack.empty()?-1:stack.back();
            best=max(best,h[bar]*(i-left-1));
        }
        stack.push_back(i);
    }
    return best;
}`,
  },
  "stacks-make-the-string-great": {
    java: `String makeGood(String s) {
    StringBuilder stack = new StringBuilder();
    for (char c : s.toCharArray()) {
        int n=stack.length();
        if(n>0 && Math.abs(stack.charAt(n-1)-c)==32) stack.setLength(n-1);
        else stack.append(c);
    }
    return stack.toString();
}`,
    python: `def make_good(s):
    stack = []
    for char in s:
        if stack and abs(ord(stack[-1]) - ord(char)) == 32: stack.pop()
        else: stack.append(char)
    return "".join(stack)`,
    cpp: `string makeGood(string s) {
    string stack;
    for(char c:s) {
        if(!stack.empty() && abs(stack.back()-c)==32) stack.pop_back();
        else stack.push_back(c);
    }
    return stack;
}`,
  },
  "stacks-maximum-frequency-stack": {
    java: `class FreqStack {
    Map<Integer,Integer> freq=new HashMap<>();
    Map<Integer,Deque<Integer>> groups=new HashMap<>(); int max=0;
    void push(int val) { int f=freq.merge(val,1,Integer::sum); max=Math.max(max,f); groups.computeIfAbsent(f,k->new ArrayDeque<>()).push(val); }
    int pop() { int val=groups.get(max).pop(); freq.put(val,freq.get(val)-1); if(groups.get(max).isEmpty()) max--; return val; }
}`,
    python: `class FreqStack:
    def __init__(self):
        self.freq, self.groups, self.maximum = {}, {}, 0
    def push(self, value):
        f = self.freq.get(value, 0) + 1
        self.freq[value] = f; self.maximum = max(self.maximum, f)
        self.groups.setdefault(f, []).append(value)
    def pop(self):
        value = self.groups[self.maximum].pop()
        self.freq[value] -= 1
        if not self.groups[self.maximum]: self.maximum -= 1
        return value`,
    cpp: `class FreqStack {
    unordered_map<int,int> freq; unordered_map<int,vector<int>> groups; int maximum=0;
public:
    void push(int value) { int f=++freq[value]; maximum=max(maximum,f); groups[f].push_back(value); }
    int pop() { int value=groups[maximum].back(); groups[maximum].pop_back(); --freq[value]; if(groups[maximum].empty()) --maximum; return value; }
};`,
  },
  "stacks-min-stack": {
    java: `class MinStack {
    Deque<Integer> values=new ArrayDeque<>(), mins=new ArrayDeque<>();
    void push(int x) { values.push(x); if(mins.isEmpty() || x<=mins.peek()) mins.push(x); }
    void pop() { int x=values.pop(); if(x==mins.peek()) mins.pop(); }
    int top() { return values.peek(); }
    int getMin() { return mins.peek(); }
}`,
    python: `class MinStack:
    def __init__(self): self.values, self.mins = [], []
    def push(self, value):
        self.values.append(value)
        if not self.mins or value <= self.mins[-1]: self.mins.append(value)
    def pop(self):
        value = self.values.pop()
        if value == self.mins[-1]: self.mins.pop()
    def top(self): return self.values[-1]
    def getMin(self): return self.mins[-1]`,
    cpp: `class MinStack {
    vector<int> values, mins;
public:
    void push(int x) { values.push_back(x); if(mins.empty() || x<=mins.back()) mins.push_back(x); }
    void pop() { int x=values.back(); values.pop_back(); if(x==mins.back()) mins.pop_back(); }
    int top() { return values.back(); }
    int getMin() { return mins.back(); }
};`,
  },
  "stacks-next-greater-element-i": {
    java: `int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer,Integer> next=new HashMap<>(); Deque<Integer> stack=new ArrayDeque<>();
    for(int x:nums2) { while(!stack.isEmpty() && stack.peek()<x) next.put(stack.pop(),x); stack.push(x); }
    return Arrays.stream(nums1).map(x->next.getOrDefault(x,-1)).toArray();
}`,
    python: `def next_greater_element(nums1, nums2):
    stack, greater = [], {}
    for value in nums2:
        while stack and stack[-1] < value: greater[stack.pop()] = value
        stack.append(value)
    return [greater.get(value, -1) for value in nums1]`,
    cpp: `vector<int> nextGreaterElement(vector<int>& a, vector<int>& b) {
    unordered_map<int,int> greater; vector<int> stack;
    for(int x:b) { while(!stack.empty() && stack.back()<x) { greater[stack.back()]=x; stack.pop_back(); } stack.push_back(x); }
    vector<int> result; for(int x:a) result.push_back(greater.count(x)?greater[x]:-1); return result;
}`,
  },
  "stacks-next-greater-element-ii": {
    java: `int[] nextGreaterElements(int[] nums) {
    int n=nums.length; int[] answer=new int[n]; Arrays.fill(answer,-1);
    Deque<Integer> stack=new ArrayDeque<>();
    for(int i=0;i<2*n;i++) { int j=i%n; while(!stack.isEmpty() && nums[stack.peek()]<nums[j]) answer[stack.pop()]=nums[j]; if(i<n) stack.push(j); }
    return answer;
}`,
    python: `def next_greater_elements(nums):
    answer = [-1] * len(nums); stack = []
    for i in range(2 * len(nums)):
        j = i % len(nums)
        while stack and nums[stack[-1]] < nums[j]: answer[stack.pop()] = nums[j]
        if i < len(nums): stack.append(j)
    return answer`,
    cpp: `vector<int> nextGreaterElements(vector<int>& nums) {
    int n=nums.size(); vector<int> answer(n,-1), stack;
    for(int i=0;i<2*n;++i) { int j=i%n; while(!stack.empty() && nums[stack.back()]<nums[j]) { answer[stack.back()]=nums[j]; stack.pop_back(); } if(i<n) stack.push_back(j); }
    return answer;
}`,
  },
  "stacks-online-stock-span": {
    java: `class StockSpanner {
    Deque<int[]> stack=new ArrayDeque<>();
    int next(int price) { int span=1; while(!stack.isEmpty() && stack.peek()[0]<=price) span+=stack.pop()[1]; stack.push(new int[]{price,span}); return span; }
}`,
    python: `class StockSpanner:
    def __init__(self): self.stack = []
    def next(self, price):
        span = 1
        while self.stack and self.stack[-1][0] <= price: span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`,
    cpp: `class StockSpanner {
    vector<pair<int,int>> stack;
public:
    int next(int price) { int span=1; while(!stack.empty() && stack.back().first<=price) { span+=stack.back().second; stack.pop_back(); } stack.push_back({price,span}); return span; }
};`,
  },
  "stacks-remove-all-adjacent-duplicates-in-string": {
    java: `String removeDuplicates(String s) {
    StringBuilder stack=new StringBuilder();
    for(char c:s.toCharArray()) { int n=stack.length(); if(n>0 && stack.charAt(n-1)==c) stack.setLength(n-1); else stack.append(c); }
    return stack.toString();
}`,
    python: `def remove_duplicates(s):
    stack = []
    for char in s:
        if stack and stack[-1] == char: stack.pop()
        else: stack.append(char)
    return "".join(stack)`,
    cpp: `string removeDuplicates(string s) {
    string stack;
    for(char c:s) { if(!stack.empty() && stack.back()==c) stack.pop_back(); else stack.push_back(c); }
    return stack;
}`,
  },
  "stacks-score-of-parentheses": {
    java: `int scoreOfParentheses(String s) {
    Deque<Integer> stack=new ArrayDeque<>(); stack.push(0);
    for(char c:s.toCharArray()) { if(c=='(') stack.push(0); else { int inner=stack.pop(); int value=Math.max(1,2*inner); stack.push(stack.pop()+value); } }
    return stack.pop();
}`,
    python: `def score_of_parentheses(s):
    stack = [0]
    for char in s:
        if char == "(": stack.append(0)
        else:
            inner = stack.pop()
            stack[-1] += max(1, 2 * inner)
    return stack[-1]`,
    cpp: `int scoreOfParentheses(string s) {
    vector<int> stack{0};
    for(char c:s) { if(c=='(') stack.push_back(0); else { int inner=stack.back(); stack.pop_back(); stack.back()+=max(1,2*inner); } }
    return stack.back();
}`,
  },
  "stacks-simplify-path": {
    java: `String simplifyPath(String path) {
    Deque<String> stack=new ArrayDeque<>();
    for(String part:path.split("/")) { if(part.isEmpty() || part.equals(".")) continue; if(part.equals("..")) { if(!stack.isEmpty()) stack.removeLast(); } else stack.addLast(part); }
    return "/" + String.join("/",stack);
}`,
    python: `def simplify_path(path):
    stack = []
    for part in path.split("/"):
        if part in ("", "."): continue
        if part == "..":
            if stack: stack.pop()
        else: stack.append(part)
    return "/" + "/".join(stack)`,
    cpp: `string simplifyPath(string path) {
    vector<string> stack; string part; stringstream stream(path);
    while(getline(stream,part,'/')) { if(part.empty() || part==".") continue; if(part=="..") { if(!stack.empty()) stack.pop_back(); } else stack.push_back(part); }
    string result="/"; for(int i=0;i<stack.size();++i) { if(i) result+="/"; result+=stack[i]; } return result;
}`,
  },
  "stacks-valid-parentheses": {
    java: `boolean isValid(String s) {
    Deque<Character> stack=new ArrayDeque<>(); Map<Character,Character> pairs=Map.of(')','(','}','{',']','[');
    for(char c:s.toCharArray()) { if(c=='('||c=='{'||c=='[') stack.push(c); else if(stack.isEmpty()||stack.pop()!=pairs.get(c)) return false; }
    return stack.isEmpty();
}`,
    python: `def is_valid(s):
    stack, pairs = [], {")": "(", "]": "[", "}": "{"}
    for char in s:
        if char in "([{": stack.append(char)
        elif not stack or stack.pop() != pairs[char]: return False
    return not stack`,
    cpp: `bool isValid(string s) {
    vector<char> stack;
    for(char c:s) { if(c=='('||c=='['||c=='{') stack.push_back(c); else { if(stack.empty()) return false; char t=stack.back(); stack.pop_back(); if((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{')) return false; } }
    return stack.empty();
}`,
  },
  "stacks-valid-parenthesis-string": {
    java: `boolean checkValidString(String s) {
    int low=0, high=0;
    for(char c:s.toCharArray()) { if(c=='(') { low++; high++; } else if(c==')') { low=Math.max(0,low-1); high--; } else { low=Math.max(0,low-1); high++; } if(high<0) return false; }
    return low==0;
}`,
    python: `def check_valid_string(s):
    low = high = 0
    for char in s:
        if char == "(": low += 1; high += 1
        elif char == ")": low = max(0, low - 1); high -= 1
        else: low = max(0, low - 1); high += 1
        if high < 0: return False
    return low == 0`,
    cpp: `bool checkValidString(string s) {
    int low=0, high=0;
    for(char c:s) { if(c=='(') { ++low; ++high; } else if(c==')') { low=max(0,low-1); --high; } else { low=max(0,low-1); ++high; } if(high<0) return false; }
    return low==0;
}`,
  },
};

const MAX_ITEMS = 100;
const MAX_FRAMES = 240;

function parseLines(text) {
  return text.trim().split(/\r?\n/).map((line) => line.trim());
}

function tokens(line) {
  return line ? line.split(/\s+/) : [];
}

function integer(value, label) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) throw new Error(`Enter a valid integer for ${label}.`);
  return parsed;
}

function readArray(lines, countIndex, valuesIndex, max = MAX_ITEMS) {
  const count = integer(lines[countIndex], "the item count");
  if (count < 0 || count > max) throw new Error(`Enter an item count between 0 and ${max}.`);
  const values = tokens(lines[valuesIndex]);
  if (values.length !== count) throw new Error(`Expected ${count} values on line ${valuesIndex + 1}.`);
  return values;
}

function parseInput(slug, text) {
  const lines = parseLines(text);
  if (!text.trim()) throw new Error("Enter input using the format described above.");
  const first = lines[0] || "";
  if (slug === "stacks-backspace-string-compare") {
    if (lines.length !== 2) throw new Error("Enter one string on each of two lines.");
    return { strings: [lines[0], lines[1]] };
  }
  if (slug === "stacks-baseball-game" || slug === "stacks-evaluate-reverse-polish-notation") {
    const values = readArray(lines, 0, 1);
    return { values: slug.endsWith("baseball-game") ? values : values.map((v) => /^[-+]?\d+$/.test(v) ? integer(v, "an RPN token") : v) };
  }
  if (slug === "stacks-maximum-frequency-stack" || slug === "stacks-min-stack") {
    const count = integer(first, "the operation count");
    if (count < 1 || count > MAX_ITEMS) throw new Error(`Enter between 1 and ${MAX_ITEMS} operations for responsive playback.`);
    if (lines.length !== count + 1) throw new Error(`Expected ${count} operation lines.`);
    const operations = lines.slice(1).map((line) => {
      const parts = tokens(line);
      if (parts[0] === "push" && parts.length === 2) {
        return { op: "push", value: integer(parts[1], "a pushed value") };
      }
      const allowed = slug.endsWith("maximum-frequency-stack") ? ["pop"] : ["pop", "top", "getMin"];
      if (parts.length === 1 && allowed.includes(parts[0])) return { op: parts[0] };
      throw new Error(`Invalid operation: ${line}`);
    });
    return { operations };
  }
  if (slug === "stacks-next-greater-element-i") {
    const firstValues = readArray(lines, 0, 1);
    const secondValues = readArray(lines, 2, 3);
    return { first: firstValues.map(Number), values: secondValues.map(Number) };
  }
  if (["stacks-asteroid-collision", "stacks-daily-temperatures", "stacks-largest-rectangle-in-histogram", "stacks-next-greater-element-ii", "stacks-online-stock-span"].includes(slug)) {
    const values = readArray(lines, 0, 1).map((v) => integer(v, "an array value"));
    return { values };
  }
  if (["stacks-basic-calculator", "stacks-basic-calculator-ii", "stacks-decode-string", "stacks-make-the-string-great", "stacks-remove-all-adjacent-duplicates-in-string", "stacks-score-of-parentheses", "stacks-simplify-path", "stacks-valid-parentheses", "stacks-valid-parenthesis-string"].includes(slug)) {
    if (lines.length !== 1) throw new Error("Enter this problem's input on one line.");
    return { text: first };
  }
  throw new Error("No Stack visualizer is available for this question.");
}

function truncDiv(a, b) {
  return Math.trunc(a / b);
}

export function getStackReferenceCode(slug, language) {
  return solutions[slug]?.[language] || null;
}

export function buildStackTrace(slug, text) {
  const input = parseInput(slug, text);
  const frames = [];
  const add = (message, stacks, variables = {}, result = null, final = false) => {
    if (!final && frames.length >= MAX_FRAMES - 1) return;
    const frame = { message, stacks: stacks.map((stack) => ({ label: stack.label, values: [...stack.values] })), variables: { ...variables }, result };
    if (final) {
      if (frames.length >= MAX_FRAMES) frames.pop();
      frames.push(frame);
    } else if (frames.length < MAX_FRAMES - 1) frames.push(frame);
  };
  const finish = (message, stacks, variables, result) => add(message, stacks, variables, String(result), true);
  const one = (values, label = "Stack") => [{ label, values }];
  let result;

  switch (slug) {
    case "stacks-asteroid-collision": {
      const stack = [];
      for (const asteroid of input.values) {
        let alive = true;
        while (alive && asteroid < 0 && stack.length && stack.at(-1) > 0) {
          const top = stack.at(-1);
          if (top < -asteroid) { stack.pop(); add(`${top} is smaller, so it is destroyed by ${asteroid}.`, one(stack), { asteroid, top }); }
          else if (top === -asteroid) { stack.pop(); alive = false; add(`Both asteroids of size ${-asteroid} are destroyed.`, one(stack), { asteroid, top }); }
          else { alive = false; add(`${asteroid} is destroyed by the larger ${top}.`, one(stack), { asteroid, top }); }
        }
        if (alive) { stack.push(asteroid); add(`Push asteroid ${asteroid}; no opposing asteroid can destroy it now.`, one(stack), { asteroid }); }
      }
      result = stack.join(" ") || "∅"; finish("All collisions are resolved.", one(stack), { remaining: stack.length }, result); break;
    }
    case "stacks-backspace-string-compare": {
      const results = [];
      for (let s = 0; s < input.strings.length; s++) {
        const stack = [];
        for (const char of input.strings[s]) {
          if (char === "#") { const removed = stack.pop(); add(removed ? `Backspace removes ${removed} from string ${s + 1}.` : `Backspace on empty string ${s + 1} has no effect.`, [{ label: `String ${s + 1}`, values: stack }], { character: "#", removed: removed || "none" }); }
          else { stack.push(char); add(`Add ${char} to string ${s + 1}.`, [{ label: `String ${s + 1}`, values: stack }], { character: char }); }
        }
        results.push(stack.join(""));
      }
      result = String(results[0] === results[1]); finish(`Compare ${JSON.stringify(results[0])} with ${JSON.stringify(results[1])}.`, results.map((v, i) => ({ label: `Result ${i + 1}`, values: [...v] })), {}, result); break;
    }
    case "stacks-baseball-game": {
      const stack = [];
      for (const operation of input.values) {
        if (operation === "C") stack.pop();
        else if (operation === "D") stack.push(stack.at(-1) * 2);
        else if (operation === "+") stack.push(stack.at(-1) + stack.at(-2));
        else stack.push(integer(operation, "a score"));
        add(`Apply operation ${operation}.`, one(stack), { operation, total: stack.reduce((a, b) => a + b, 0) });
      }
      result = stack.reduce((a, b) => a + b, 0); finish("Sum the valid scores.", one(stack), { scores: stack.length }, result); break;
    }
    case "stacks-basic-calculator": {
      const stack = []; let total = 0, number = 0, sign = 1;
      for (let i = 0; i < input.text.length; i++) {
        const c = input.text[i];
        if (/\d/.test(c)) number = number * 10 + Number(c);
        else if (c === "+" || c === "-") { total += sign * number; number = 0; sign = c === "+" ? 1 : -1; }
        else if (c === "(") { stack.push(total, sign); total = 0; sign = 1; }
        else if (c === ")") { total += sign * number; number = 0; total = stack.pop() * total + stack.pop(); }
        add(`Read ${JSON.stringify(c)}; update the running expression context.`, one(stack, "Saved context"), { character: c, result: total, number, sign });
      }
      result = total + sign * number; finish("Complete the final signed number.", one(stack, "Saved context"), { value: result }, result); break;
    }
    case "stacks-basic-calculator-ii": {
      const stack = []; let number = 0, sign = "+";
      for (let i = 0; i < input.text.length; i++) {
        const c = input.text[i];
        if (/\d/.test(c)) number = number * 10 + Number(c);
        if ((!/\d/.test(c) && c !== " ") || i === input.text.length - 1) {
          if (sign === "+") stack.push(number);
          else if (sign === "-") stack.push(-number);
          else if (sign === "*") stack.push(stack.pop() * number);
          else stack.push(truncDiv(stack.pop(), number));
          add(`Apply operator ${sign} to ${number} (multiplication/division are applied immediately).`, one(stack), { nextOperator: c, result: stack.reduce((a, b) => a + b, 0) });
          sign = c; number = 0;
        }
      }
      result = stack.reduce((a, b) => a + b, 0); finish("Sum the signed terms.", one(stack), {}, result); break;
    }
    case "stacks-daily-temperatures": {
      const stack = [], answers = Array(input.values.length).fill(0);
      input.values.forEach((temperature, day) => {
        while (stack.length && temperature > input.values[stack.at(-1)]) {
          const index = stack.pop(); answers[index] = day - index;
          add(`${temperature}° is warmer than day ${index}; resolve its wait as ${day - index}.`, one(stack, "Unresolved day indices"), { day, temperature, resolvedDay: index }, null);
        }
        stack.push(day); add(`Keep day ${day} unresolved until a warmer day appears.`, one(stack, "Unresolved day indices"), { day, temperature });
      });
      result = answers.join(" "); finish("No warmer days remain for the indices in the stack.", one(stack, "Unresolved day indices"), { answers: result }, result); break;
    }
    case "stacks-decode-string": {
      const counts = [], strings = []; let current = "", number = 0;
      for (const c of input.text) {
        if (/\d/.test(c)) number = number * 10 + Number(c);
        else if (c === "[") { counts.push(number); strings.push(current); current = ""; number = 0; }
        else if (c === "]") { const count = counts.pop(), prefix = strings.pop(); current = prefix + current.repeat(count); }
        else current += c;
        if (current.length > 10000) throw new Error("Decoded output is too large to visualize (limit: 10,000 characters).");
        add(`Process ${c}; build the current decoded segment.`, [{ label: "Counts", values: counts }, { label: "Saved strings", values: strings.map((s) => s || "∅") }], { current });
      }
      result = current; finish("All nested repetitions are expanded.", [{ label: "Counts", values: counts }, { label: "Saved strings", values: strings }], {}, result); break;
    }
    case "stacks-evaluate-reverse-polish-notation": {
      const stack = [];
      for (const token of input.values) {
        if (["+", "-", "*", "/"].includes(token)) {
          const b = stack.pop(), a = stack.pop();
          const value = token === "+" ? a + b : token === "-" ? a - b : token === "*" ? a * b : truncDiv(a, b);
          stack.push(value); add(`Evaluate ${a} ${token} ${b} = ${value}.`, one(stack), { operator: token, left: a, right: b });
        } else { stack.push(token); add(`Push operand ${token}.`, one(stack), { token }); }
      }
      result = stack.at(-1); finish("The final stack value is the expression result.", one(stack), {}, result); break;
    }
    case "stacks-largest-rectangle-in-histogram": {
      const stack = []; let best = 0; const heights = input.values;
      for (let i = 0; i <= heights.length; i++) {
        const height = i === heights.length ? 0 : heights[i];
        while (stack.length && heightValue(heights[stack.at(-1)]) > height) {
          const bar = stack.pop(), left = stack.length ? stack.at(-1) : -1;
          const area = heightValue(heights[bar]) * (i - left - 1); best = Math.max(best, area);
          add(`Bar ${bar} is bounded by ${left} and ${i}; area = ${area}.`, one(stack, "Increasing bar indices"), { bar: heights[bar], left, right: i, area, best });
        }
        stack.push(i); add(i === heights.length ? "Process the final zero-height boundary." : `Push bar ${i} with height ${heights[i]}.`, one(stack, "Increasing bar indices"), { current: i, best });
      }
      result = best; finish("The largest rectangle area is found.", one(stack, "Increasing bar indices"), { best }, result); break;
    }
    case "stacks-make-the-string-great":
    case "stacks-remove-all-adjacent-duplicates-in-string": {
      const stack = [];
      for (const char of input.text) {
        const top = stack.at(-1);
        const matches = slug.endsWith("make-the-string-great") ? top && Math.abs(top.charCodeAt(0) - char.charCodeAt(0)) === 32 : top === char;
        if (matches) { stack.pop(); add(`Remove adjacent pair ${top}${char}.`, one(stack), { removed: `${top}${char}` }); }
        else { stack.push(char); add(`Push ${char}.`, one(stack), { character: char }); }
      }
      result = stack.join(""); finish("No removable adjacent pair remains.", one(stack), { length: stack.length }, result || "∅"); break;
    }
    case "stacks-maximum-frequency-stack": {
      const frequencies = new Map(), groups = new Map(); let max = 0; const output = [];
      for (const operation of input.operations) {
        if (operation.op === "push") {
          const frequency = (frequencies.get(operation.value) || 0) + 1; frequencies.set(operation.value, frequency);
          max = Math.max(max, frequency); if (!groups.has(frequency)) groups.set(frequency, []); groups.get(frequency).push(operation.value);
          add(`Push ${operation.value}; its frequency becomes ${frequency}.`, [...groups].sort(([a], [b]) => a - b).map(([f, values]) => ({ label: `Frequency ${f}`, values })), { maxFrequency: max });
        } else {
          const values = groups.get(max), value = values.pop(); frequencies.set(value, frequencies.get(value) - 1); output.push(value);
          if (!values.length) max--;
          add(`Pop ${value} from the highest-frequency group.`, [...groups].filter(([, values]) => values.length).sort(([a], [b]) => a - b).map(([f, values]) => ({ label: `Frequency ${f}`, values })), { popped: value, maxFrequency: max });
        }
      }
      result = output.join("\n"); finish("Pop operations produced these values in order.", [...groups].filter(([, values]) => values.length).sort(([a], [b]) => a - b).map(([f, values]) => ({ label: `Frequency ${f}`, values })), { pops: output.length }, result); break;
    }
    case "stacks-min-stack": {
      const values = [], mins = [], output = [];
      for (const operation of input.operations) {
        let message;
        if (operation.op === "push") { values.push(operation.value); if (!mins.length || operation.value <= mins.at(-1)) mins.push(operation.value); message = `Push ${operation.value}; update the minimum stack if needed.`; }
        else if (operation.op === "pop") { const value = values.pop(); if (value === mins.at(-1)) mins.pop(); message = `Pop ${value}.`; }
        else if (operation.op === "top") { output.push(values.at(-1)); message = `Read top value ${values.at(-1)}.`; }
        else { output.push(mins.at(-1)); message = `Read current minimum ${mins.at(-1)}.`; }
        add(message, [{ label: "Values", values }, { label: "Minimums", values: mins }], { operation: operation.op, top: values.at(-1) ?? "empty", minimum: mins.at(-1) ?? "empty" });
      }
      result = output.join("\n"); finish("Return the values requested by top and getMin.", [{ label: "Values", values }, { label: "Minimums", values: mins }], {}, result); break;
    }
    case "stacks-next-greater-element-i": {
      const stack = [], greater = new Map();
      for (const value of input.values) {
        while (stack.length && stack.at(-1) < value) { const resolved = stack.pop(); greater.set(resolved, value); add(`${value} resolves the next-greater value for ${resolved}.`, one(stack, "Unresolved values"), { resolved, nextGreater: value }); }
        stack.push(value); add(`Push ${value} as unresolved.`, one(stack, "Unresolved values"), { current: value });
      }
      result = input.first.map((value) => greater.get(value) ?? -1).join(" ");
      finish("Look up next-greater values in nums1 order.", one(stack, "Unresolved values"), { answer: result }, result); break;
    }
    case "stacks-next-greater-element-ii": {
      const values = input.values, stack = [], answer = Array(values.length).fill(-1);
      for (let i = 0; i < values.length * 2; i++) {
        const index = i % values.length;
        while (stack.length && values[stack.at(-1)] < values[index]) { const resolved = stack.pop(); answer[resolved] = values[index]; add(`Circular value ${values[index]} resolves index ${resolved}.`, one(stack, "Unresolved indices"), { index, resolved }); }
        if (i < values.length) { stack.push(index); add(`Push index ${index}; circular pass ${i < values.length ? "one" : "two"}.`, one(stack, "Unresolved indices"), { index, value: values[index] }); }
      }
      result = answer.join(" "); finish("All next-greater values are resolved.", one(stack, "Unresolved indices"), { answer: result }, result); break;
    }
    case "stacks-online-stock-span": {
      const stack = [], spans = [];
      input.values.forEach((price, day) => {
        let span = 1;
        while (stack.length && stack.at(-1).price <= price) { const removed = stack.pop(); span += removed.span; add(`Price ${price} absorbs ${removed.price}'s span ${removed.span}.`, one(stack.map((x) => `${x.price} (${x.span})`), "Price (span)"), { day, span }); }
        stack.push({ price, span }); spans.push(span);
        add(`Day ${day} at ${price} has span ${span}.`, one(stack.map((x) => `${x.price} (${x.span})`), "Price (span)"), { day, span });
      });
      result = spans.join(" "); finish("Stock spans for every day are ready.", one(stack.map((x) => `${x.price} (${x.span})`), "Price (span)"), { days: spans.length }, result); break;
    }
    case "stacks-score-of-parentheses": {
      const stack = [0];
      for (const char of input.text) {
        if (char === "(") stack.push(0);
        else { const inside = stack.pop(); stack[stack.length - 1] += Math.max(1, 2 * inside); }
        add(char === "(" ? "Open a new score context." : "Close the pair and add its score to the surrounding context.", one(stack, "Nested scores"), { character: char, currentScore: stack.at(-1) });
      }
      result = stack[0]; finish("The outer score is the result.", one(stack, "Nested scores"), {}, result); break;
    }
    case "stacks-simplify-path": {
      const stack = [];
      for (const part of input.text.split("/")) {
        if (!part || part === ".") add(`Ignore path component ${JSON.stringify(part || "/")}.`, one(stack, "Directories"), { component: part || "/" });
        else if (part === "..") { const removed = stack.pop(); add(removed ? `Move to parent; remove ${removed}.` : "At root already; parent traversal has no effect.", one(stack, "Directories"), { component: ".." }); }
        else { stack.push(part); add(`Enter directory ${part}.`, one(stack, "Directories"), { component: part }); }
      }
      result = `/${stack.join("/")}`; finish("Join the remaining path components.", one(stack, "Directories"), { directories: stack.length }, result); break;
    }
    case "stacks-valid-parentheses": {
      const stack = [], expected = { ")": "(", "]": "[", "}": "{" }; let valid = true;
      for (const char of input.text) {
        if ("([{".includes(char)) stack.push(char);
        else if (stack.at(-1) === expected[char]) stack.pop();
        else valid = false;
        add(valid ? `Process ${char}; bracket order is still valid.` : `Bracket ${char} has no matching opener at the top.`, one(stack), { character: char, valid });
        if (!valid) break;
      }
      result = String(valid && stack.length === 0); finish("The brackets are valid only if no mismatch occurred and the stack is empty.", one(stack), { remainingOpeners: stack.length }, result); break;
    }
    case "stacks-valid-parenthesis-string": {
      let low = 0, high = 0;
      for (const char of input.text) {
        if (char === "(") { low++; high++; }
        else if (char === ")") { low = Math.max(0, low - 1); high--; }
        else { low = Math.max(0, low - 1); high++; }
        add(`Process ${char}; track the range of possible open parentheses.`, [{ label: "Possible open-count range", values: Array.from({ length: Math.max(0, high - low + 1) }, (_, i) => low + i) }], { low, high });
        if (high < 0) break;
      }
      result = String(high >= 0 && low === 0); finish("A valid interpretation exists if the minimum open count can be zero.", [{ label: "Possible open-count range", values: Array.from({ length: Math.max(0, high - low + 1) }, (_, i) => low + i) }], { low, high }, result); break;
    }
    default: throw new Error("No Stack visualizer is available for this question.");
  }
  return frames;
}

function heightValue(value) { return Number(value); }
