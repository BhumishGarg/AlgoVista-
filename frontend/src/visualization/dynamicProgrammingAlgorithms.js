const solutions = {
  "dynamic-programming-climbing-stairs": {
    java: `class Solution {
    public int climbStairs(int n) {
        int twoBack = 1, oneBack = 1;
        for (int step = 2; step <= n; step++) {
            int current = twoBack + oneBack;
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
}`,
    python: `class Solution:
    def climbStairs(self, n: int) -> int:
        two_back = one_back = 1
        for _ in range(2, n + 1):
            two_back, one_back = one_back, two_back + one_back
        return one_back`,
    cpp: `class Solution {
public:
    int climbStairs(int n) {
        int twoBack = 1, oneBack = 1;
        for (int step = 2; step <= n; ++step) {
            int current = twoBack + oneBack;
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
};`,
  },
  "dynamic-programming-min-cost-climbing-stairs": {
    java: `class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int twoBack = 0, oneBack = 0;
        for (int i = 2; i <= cost.length; i++) {
            int current = Math.min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
}`,
    python: `class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        two_back = one_back = 0
        for i in range(2, len(cost) + 1):
            two_back, one_back = one_back, min(
                one_back + cost[i - 1], two_back + cost[i - 2]
            )
        return one_back`,
    cpp: `class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        int twoBack = 0, oneBack = 0;
        for (int i = 2; i <= static_cast<int>(cost.size()); ++i) {
            int current = min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
};`,
  },
  "dynamic-programming-house-robber": {
    java: `class Solution {
    public int rob(int[] nums) {
        int twoBack = 0, oneBack = 0;
        for (int value : nums) {
            int current = Math.max(oneBack, twoBack + value);
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
}`,
    python: `class Solution:
    def rob(self, nums: list[int]) -> int:
        two_back = one_back = 0
        for value in nums:
            two_back, one_back = one_back, max(one_back, two_back + value)
        return one_back`,
    cpp: `class Solution {
public:
    int rob(vector<int>& nums) {
        int twoBack = 0, oneBack = 0;
        for (int value : nums) {
            int current = max(oneBack, twoBack + value);
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
};`,
  },
  "dynamic-programming-house-robber-ii": {
    java: `class Solution {
    private int robRange(int[] nums, int start, int end) {
        int twoBack = 0, oneBack = 0;
        for (int i = start; i < end; i++) {
            int current = Math.max(oneBack, twoBack + nums[i]);
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }

    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        return Math.max(robRange(nums, 0, nums.length - 1),
                        robRange(nums, 1, nums.length));
    }
}`,
    python: `class Solution:
    def rob(self, nums: list[int]) -> int:
        def rob_range(values: list[int]) -> int:
            two_back = one_back = 0
            for value in values:
                two_back, one_back = one_back, max(one_back, two_back + value)
            return one_back

        if len(nums) == 1:
            return nums[0]
        return max(rob_range(nums[:-1]), rob_range(nums[1:]))`,
    cpp: `class Solution {
    int robRange(vector<int>& nums, int start, int end) {
        int twoBack = 0, oneBack = 0;
        for (int i = start; i < end; ++i) {
            int current = max(oneBack, twoBack + nums[i]);
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
public:
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        return max(robRange(nums, 0, static_cast<int>(nums.size()) - 1),
                   robRange(nums, 1, static_cast<int>(nums.size())));
    }
};`,
  },
  "dynamic-programming-coin-change": {
    java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int value = 1; value <= amount; value++) {
            for (int coin : coins) {
                if (coin <= value) dp[value] = Math.min(dp[value], dp[value - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for value in range(1, amount + 1):
            for coin in coins:
                if coin <= value:
                    dp[value] = min(dp[value], dp[value - coin] + 1)
        return -1 if dp[amount] > amount else dp[amount]`,
    cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int value = 1; value <= amount; ++value) {
            for (int coin : coins) {
                if (coin <= value) dp[value] = min(dp[value], dp[value - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
  },
  "dynamic-programming-coin-change-ii": {
    java: `class Solution {
    public int change(int amount, int[] coins) {
        int[] ways = new int[amount + 1];
        ways[0] = 1;
        for (int coin : coins) {
            for (int value = coin; value <= amount; value++) {
                ways[value] += ways[value - coin];
            }
        }
        return ways[amount];
    }
}`,
    python: `class Solution:
    def change(self, amount: int, coins: list[int]) -> int:
        ways = [0] * (amount + 1)
        ways[0] = 1
        for coin in coins:
            for value in range(coin, amount + 1):
                ways[value] += ways[value - coin]
        return ways[amount]`,
    cpp: `class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<int> ways(amount + 1, 0);
        ways[0] = 1;
        for (int coin : coins) {
            for (int value = coin; value <= amount; ++value) {
                ways[value] += ways[value - coin];
            }
        }
        return ways[amount];
    }
};`,
  },
  "dynamic-programming-longest-increasing-subsequence": {
    java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int value : nums) {
            int left = 0, right = size;
            while (left < right) {
                int middle = left + (right - left) / 2;
                if (tails[middle] < value) left = middle + 1;
                else right = middle;
            }
            tails[left] = value;
            if (left == size) size++;
        }
        return size;
    }
}`,
    python: `class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        tails = []
        for value in nums:
            left, right = 0, len(tails)
            while left < right:
                middle = (left + right) // 2
                if tails[middle] < value:
                    left = middle + 1
                else:
                    right = middle
            if left == len(tails):
                tails.append(value)
            else:
                tails[left] = value
        return len(tails)`,
    cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int value : nums) {
            auto position = lower_bound(tails.begin(), tails.end(), value);
            if (position == tails.end()) tails.push_back(value);
            else *position = value;
        }
        return static_cast<int>(tails.size());
    }
};`,
  },
  "dynamic-programming-longest-common-subsequence": {
    java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int[][] dp = new int[text1.length() + 1][text2.length() + 1];
        for (int i = 1; i <= text1.length(); i++) {
            for (int j = 1; j <= text2.length(); j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[text1.length()][text2.length()];
    }
}`,
    python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]
        for i, first in enumerate(text1, 1):
            for j, second in enumerate(text2, 1):
                if first == second:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[-1][-1]`,
    cpp: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        vector<vector<int>> dp(text1.size() + 1, vector<int>(text2.size() + 1));
        for (int i = 1; i <= static_cast<int>(text1.size()); ++i) {
            for (int j = 1; j <= static_cast<int>(text2.size()); ++j) {
                if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
                else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[text1.size()][text2.size()];
    }
};`,
  },
  "dynamic-programming-word-break": {
    java: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        boolean[] reachable = new boolean[s.length() + 1];
        reachable[0] = true;
        for (int end = 1; end <= s.length(); end++) {
            for (int start = 0; start < end; start++) {
                if (reachable[start] && words.contains(s.substring(start, end))) {
                    reachable[end] = true;
                    break;
                }
            }
        }
        return reachable[s.length()];
    }
}`,
    python: `class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        words = set(wordDict)
        reachable = [False] * (len(s) + 1)
        reachable[0] = True
        for end in range(1, len(s) + 1):
            reachable[end] = any(
                reachable[start] and s[start:end] in words
                for start in range(end)
            )
        return reachable[-1]`,
    cpp: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> words(wordDict.begin(), wordDict.end());
        vector<bool> reachable(s.size() + 1, false);
        reachable[0] = true;
        for (int end = 1; end <= static_cast<int>(s.size()); ++end) {
            for (int start = 0; start < end; ++start) {
                if (reachable[start] && words.count(s.substr(start, end - start))) {
                    reachable[end] = true;
                    break;
                }
            }
        }
        return reachable[s.size()];
    }
};`,
  },
  "dynamic-programming-partition-equal-subset-sum": {
    java: `class Solution {
    public boolean canPartition(int[] nums) {
        int total = Arrays.stream(nums).sum();
        if (total % 2 != 0) return false;
        int target = total / 2;
        boolean[] reachable = new boolean[target + 1];
        reachable[0] = true;
        for (int value : nums) {
            for (int sum = target; sum >= value; sum--) {
                reachable[sum] |= reachable[sum - value];
            }
        }
        return reachable[target];
    }
}`,
    python: `class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        reachable = [False] * (target + 1)
        reachable[0] = True
        for value in nums:
            for current in range(target, value - 1, -1):
                reachable[current] |= reachable[current - value]
        return reachable[target]`,
    cpp: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2) return false;
        int target = total / 2;
        vector<bool> reachable(target + 1, false);
        reachable[0] = true;
        for (int value : nums) {
            for (int sum = target; sum >= value; --sum) {
                reachable[sum] = reachable[sum] || reachable[sum - value];
            }
        }
        return reachable[target];
    }
};`,
  },
  "dynamic-programming-target-sum": {
    java: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        Map<Integer, Integer> counts = new HashMap<>();
        counts.put(0, 1);
        for (int value : nums) {
            Map<Integer, Integer> next = new HashMap<>();
            for (var entry : counts.entrySet()) {
                next.merge(entry.getKey() + value, entry.getValue(), Integer::sum);
                next.merge(entry.getKey() - value, entry.getValue(), Integer::sum);
            }
            counts = next;
        }
        return counts.getOrDefault(target, 0);
    }
}`,
    python: `class Solution:
    def findTargetSumWays(self, nums: list[int], target: int) -> int:
        counts = {0: 1}
        for value in nums:
            next_counts = {}
            for total, ways in counts.items():
                next_counts[total + value] = next_counts.get(total + value, 0) + ways
                next_counts[total - value] = next_counts.get(total - value, 0) + ways
            counts = next_counts
        return counts.get(target, 0)`,
    cpp: `class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        unordered_map<int, int> counts{{0, 1}};
        for (int value : nums) {
            unordered_map<int, int> next;
            for (const auto& [sum, ways] : counts) {
                next[sum + value] += ways;
                next[sum - value] += ways;
            }
            counts = move(next);
        }
        return counts[target];
    }
};`,
  },
  "dynamic-programming-unique-paths": {
    java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] paths = new int[n];
        Arrays.fill(paths, 1);
        for (int row = 1; row < m; row++) {
            for (int col = 1; col < n; col++) paths[col] += paths[col - 1];
        }
        return paths[n - 1];
    }
}`,
    python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        paths = [1] * n
        for _ in range(1, m):
            for col in range(1, n):
                paths[col] += paths[col - 1]
        return paths[-1]`,
    cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> paths(n, 1);
        for (int row = 1; row < m; ++row) {
            for (int col = 1; col < n; ++col) paths[col] += paths[col - 1];
        }
        return paths[n - 1];
    }
};`,
  },
  "dynamic-programming-unique-paths-ii": {
    java: `class Solution {
    public int uniquePathsWithObstacles(int[][] grid) {
        int columns = grid[0].length;
        int[] paths = new int[columns];
        paths[0] = grid[0][0] == 0 ? 1 : 0;
        for (int[] row : grid) {
            for (int col = 0; col < columns; col++) {
                if (row[col] == 1) paths[col] = 0;
                else if (col > 0) paths[col] += paths[col - 1];
            }
        }
        return paths[columns - 1];
    }
}`,
    python: `class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: list[list[int]]) -> int:
        paths = [0] * len(obstacleGrid[0])
        paths[0] = int(obstacleGrid[0][0] == 0)
        for row in obstacleGrid:
            for col, blocked in enumerate(row):
                if blocked:
                    paths[col] = 0
                elif col:
                    paths[col] += paths[col - 1]
        return paths[-1]`,
    cpp: `class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& grid) {
        vector<int> paths(grid[0].size(), 0);
        paths[0] = grid[0][0] == 0;
        for (const auto& row : grid) {
            for (int col = 0; col < static_cast<int>(row.size()); ++col) {
                if (row[col] == 1) paths[col] = 0;
                else if (col > 0) paths[col] += paths[col - 1];
            }
        }
        return paths.back();
    }
};`,
  },
  "dynamic-programming-minimum-path-sum": {
    java: `class Solution {
    public int minPathSum(int[][] grid) {
        int rows = grid.length, columns = grid[0].length;
        int[][] dp = new int[rows][columns];
        dp[0][0] = grid[0][0];
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < columns; col++) {
                if (row == 0 && col == 0) continue;
                int fromTop = row == 0 ? Integer.MAX_VALUE : dp[row - 1][col];
                int fromLeft = col == 0 ? Integer.MAX_VALUE : dp[row][col - 1];
                dp[row][col] = grid[row][col] + Math.min(fromTop, fromLeft);
            }
        }
        return dp[rows - 1][columns - 1];
    }
}`,
    python: `class Solution:
    def minPathSum(self, grid: list[list[int]]) -> int:
        rows, columns = len(grid), len(grid[0])
        dp = [[0] * columns for _ in range(rows)]
        dp[0][0] = grid[0][0]
        for row in range(rows):
            for col in range(columns):
                if row == 0 and col == 0:
                    continue
                top = dp[row - 1][col] if row else float("inf")
                left = dp[row][col - 1] if col else float("inf")
                dp[row][col] = grid[row][col] + min(top, left)
        return dp[-1][-1]`,
    cpp: `class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int rows = grid.size(), columns = grid[0].size();
        vector<vector<int>> dp(rows, vector<int>(columns));
        dp[0][0] = grid[0][0];
        for (int row = 0; row < rows; ++row) {
            for (int col = 0; col < columns; ++col) {
                if (row == 0 && col == 0) continue;
                int top = row == 0 ? INT_MAX : dp[row - 1][col];
                int left = col == 0 ? INT_MAX : dp[row][col - 1];
                dp[row][col] = grid[row][col] + min(top, left);
            }
        }
        return dp[rows - 1][columns - 1];
    }
};`,
  },
  "dynamic-programming-decode-ways": {
    java: `class Solution {
    public int numDecodings(String s) {
        int twoBack = 1, oneBack = s.charAt(0) == '0' ? 0 : 1;
        for (int i = 1; i < s.length(); i++) {
            int current = 0;
            if (s.charAt(i) != '0') current += oneBack;
            int pair = (s.charAt(i - 1) - '0') * 10 + s.charAt(i) - '0';
            if (pair >= 10 && pair <= 26) current += twoBack;
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
}`,
    python: `class Solution:
    def numDecodings(self, s: str) -> int:
        two_back = 1
        one_back = int(s[0] != "0")
        for i in range(1, len(s)):
            current = one_back if s[i] != "0" else 0
            if 10 <= int(s[i - 1:i + 1]) <= 26:
                current += two_back
            two_back, one_back = one_back, current
        return one_back`,
    cpp: `class Solution {
public:
    int numDecodings(string s) {
        int twoBack = 1, oneBack = s[0] == '0' ? 0 : 1;
        for (int i = 1; i < static_cast<int>(s.size()); ++i) {
            int current = s[i] == '0' ? 0 : oneBack;
            int pair = (s[i - 1] - '0') * 10 + s[i] - '0';
            if (pair >= 10 && pair <= 26) current += twoBack;
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
};`,
  },
  "dynamic-programming-maximum-product-subarray": {
    java: `class Solution {
    public int maxProduct(int[] nums) {
        int maximum = nums[0], minimum = nums[0], answer = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int value = nums[i];
            if (value < 0) {
                int swap = maximum;
                maximum = minimum;
                minimum = swap;
            }
            maximum = Math.max(value, maximum * value);
            minimum = Math.min(value, minimum * value);
            answer = Math.max(answer, maximum);
        }
        return answer;
    }
}`,
    python: `class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        maximum = minimum = answer = nums[0]
        for value in nums[1:]:
            if value < 0:
                maximum, minimum = minimum, maximum
            maximum = max(value, maximum * value)
            minimum = min(value, minimum * value)
            answer = max(answer, maximum)
        return answer`,
    cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maximum = nums[0], minimum = nums[0], answer = nums[0];
        for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
            int value = nums[i];
            if (value < 0) swap(maximum, minimum);
            maximum = max(value, maximum * value);
            minimum = min(value, minimum * value);
            answer = max(answer, maximum);
        }
        return answer;
    }
};`,
  },
  "dynamic-programming-best-time-to-buy-and-sell-stock-with-cooldown": {
    java: `class Solution {
    public int maxProfit(int[] prices) {
        int hold = -prices[0], sold = 0, rest = 0;
        for (int i = 1; i < prices.length; i++) {
            int previousSold = sold;
            sold = hold + prices[i];
            hold = Math.max(hold, rest - prices[i]);
            rest = Math.max(rest, previousSold);
        }
        return Math.max(sold, rest);
    }
}`,
    python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        hold, sold, rest = -prices[0], 0, 0
        for price in prices[1:]:
            previous_sold = sold
            sold = hold + price
            hold = max(hold, rest - price)
            rest = max(rest, previous_sold)
        return max(sold, rest)`,
    cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int hold = -prices[0], sold = 0, rest = 0;
        for (int i = 1; i < static_cast<int>(prices.size()); ++i) {
            int previousSold = sold;
            sold = hold + prices[i];
            hold = max(hold, rest - prices[i]);
            rest = max(rest, previousSold);
        }
        return max(sold, rest);
    }
};`,
  },
  "dynamic-programming-edit-distance": {
    java: `class Solution {
    public int minDistance(String word1, String word2) {
        int[][] dp = new int[word1.length() + 1][word2.length() + 1];
        for (int i = 0; i <= word1.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= word2.length(); j++) dp[0][j] = j;
        for (int i = 1; i <= word1.length(); i++) {
            for (int j = 1; j <= word2.length(); j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                        Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
        return dp[word1.length()][word2.length()];
    }
}`,
    python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        dp = [[0] * (len(word2) + 1) for _ in range(len(word1) + 1)]
        for i in range(len(word1) + 1):
            dp[i][0] = i
        for j in range(len(word2) + 1):
            dp[0][j] = j
        for i, first in enumerate(word1, 1):
            for j, second in enumerate(word2, 1):
                if first == second:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
        return dp[-1][-1]`,
    cpp: `class Solution {
public:
    int minDistance(string word1, string word2) {
        vector<vector<int>> dp(word1.size() + 1, vector<int>(word2.size() + 1));
        for (int i = 0; i <= static_cast<int>(word1.size()); ++i) dp[i][0] = i;
        for (int j = 0; j <= static_cast<int>(word2.size()); ++j) dp[0][j] = j;
        for (int i = 1; i <= static_cast<int>(word1.size()); ++i) {
            for (int j = 1; j <= static_cast<int>(word2.size()); ++j) {
                if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});
            }
        }
        return dp[word1.size()][word2.size()];
    }
};`,
  },
  "dynamic-programming-01-knapsack-interview-classic": {
    java: `class Solution {
    public int knapsack(int[] weights, int[] values, int capacity) {
        int[] dp = new int[capacity + 1];
        for (int item = 0; item < weights.length; item++) {
            for (int current = capacity; current >= weights[item]; current--) {
                dp[current] = Math.max(dp[current], dp[current - weights[item]] + values[item]);
            }
        }
        return dp[capacity];
    }
}`,
    python: `def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    for weight, value in zip(weights, values):
        for current in range(capacity, weight - 1, -1):
            dp[current] = max(dp[current], dp[current - weight] + value)
    return dp[capacity]`,
    cpp: `int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    vector<int> dp(capacity + 1, 0);
    for (int item = 0; item < static_cast<int>(weights.size()); ++item) {
        for (int current = capacity; current >= weights[item]; --current) {
            dp[current] = max(dp[current], dp[current - weights[item]] + values[item]);
        }
    }
    return dp[capacity];
}`,
  },
  "dynamic-programming-palindromic-substrings": {
    java: `class Solution {
    public int countSubstrings(String s) {
        int count = 0;
        for (int center = 0; center < 2 * s.length() - 1; center++) {
            int left = center / 2, right = left + center % 2;
            while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
                count++;
                left--;
                right++;
            }
        }
        return count;
    }
}`,
    python: `class Solution:
    def countSubstrings(self, s: str) -> int:
        count = 0
        for center in range(2 * len(s) - 1):
            left, right = center // 2, (center + 1) // 2
            while left >= 0 and right < len(s) and s[left] == s[right]:
                count += 1
                left -= 1
                right += 1
        return count`,
    cpp: `class Solution {
public:
    int countSubstrings(string s) {
        int count = 0;
        for (int center = 0; center < 2 * static_cast<int>(s.size()) - 1; ++center) {
            int left = center / 2, right = left + center % 2;
            while (left >= 0 && right < static_cast<int>(s.size()) && s[left] == s[right]) {
                ++count;
                --left;
                ++right;
            }
        }
        return count;
    }
};`,
  },
};

const DISPLAY_LIMIT = 48;

function integerLine(line, description) {
  const tokens = line.trim().split(/\s+/);
  const values = tokens.map(Number);
  if (!line.trim() || tokens.some((token) => !/^-?\d+$/.test(token)) || values.some((value) => !Number.isSafeInteger(value))) {
    throw new Error(`${description} must contain whole numbers separated by spaces.`);
  }
  return values;
}

function oneIntegerLine(line, description) {
  const values = integerLine(line, description);
  if (values.length !== 1) throw new Error(`${description} must be a single whole number.`);
  return values[0];
}

function countedArray(lines, minimumLength = 1, maximumLength = 100) {
  if (lines.length < 2) throw new Error("Enter the item count, then the values on the next line.");
  const count = oneIntegerLine(lines[0], "The item count");
  const values = lines.slice(1).flatMap((line) => integerLine(line, "The values"));
  if (!Number.isInteger(count) || count < minimumLength || count > maximumLength || values.length !== count) {
    throw new Error(`The item count must match the ${minimumLength} to ${maximumLength} values provided.`);
  }
  return values;
}

function parseGrid(input, binary = false) {
  const rows = input.trim().split(/\r?\n/).filter((line) => line.trim()).map((line) => integerLine(line, "Each grid row"));
  if (!rows.length || rows.length > 20 || rows.some((row) => row.length !== rows[0].length || row.length > 20)) {
    throw new Error("Enter a rectangular grid with 1 to 20 rows and columns for visualization.");
  }
  if (binary && rows.some((row) => row.some((value) => value !== 0 && value !== 1))) {
    throw new Error("Obstacle grids may contain only 0 and 1.");
  }
  if (!binary && rows.some((row) => row.some((value) => value < 0))) {
    throw new Error("Grid values must be non-negative.");
  }
  return rows;
}

function visibleStates(states, activeLabel) {
  const visible = states.length <= DISPLAY_LIMIT
    ? states
    : [...states.slice(0, DISPLAY_LIMIT / 2), ...states.slice(-DISPLAY_LIMIT / 2)];
  const active = states.find((state) => state.label === activeLabel);
  if (active && !visible.some((state) => state.label === activeLabel)) visible.push(active);
  return visible.map((state) => ({
    ...state,
    active: state.label === activeLabel,
    done: Boolean(activeLabel) && state.label !== activeLabel,
  }));
}

function buildFrames(question, input, run) {
  if (!input.trim()) throw new Error("Enter an input to build the DP state walkthrough.");
  const frames = [];
  const record = (title, message, states, result = null, activeLabel = "") => {
    frames.push({ title, message, states: visibleStates(states, activeLabel), result });
  };
  const finish = (title, message, states, result) => record(title, message, states, String(result));
  run(record, finish);
  return frames;
}

export function getDynamicProgrammingCode(slug, language) {
  return solutions[slug]?.[language] || null;
}

export function buildDynamicProgrammingFrames(question, input) {
  const lines = input.trim().split(/\r?\n/).map((line) => line.trim());
  const slug = question.slug;
  const makeStates = (values, prefix = "dp") => values.map((value, index) => ({
    label: `${prefix}[${index}]`,
    value: value === Infinity ? "∞" : value,
    note: index === 0 ? "base state" : "computed subproblem",
  }));

  return buildFrames(question, input, (record, finish) => {
    if (slug === "dynamic-programming-climbing-stairs") {
      const n = oneIntegerLine(lines[0], "Step count");
      if (n < 1 || n > 100) throw new Error("Enter a stair count from 1 to 100.");
      const dp = [1, 1];
      record("Base cases", "There is one way to stand before the stairs and one way to reach stair 1.", makeStates(dp));
      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        record(`Reach stair ${i}`, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}.`, makeStates(dp), null, `dp[${i}]`);
      }
      finish("All stairs reached", "The final state counts every sequence of one-step and two-step moves.", makeStates(dp), dp[n]);
      return;
    }

    if (slug === "dynamic-programming-min-cost-climbing-stairs") {
      const cost = countedArray(lines, 2, 100);
      if (cost.some((value) => value < 0)) throw new Error("Stair costs must be non-negative.");
      const dp = Array(cost.length + 1).fill(0);
      record("Starting positions", "Starting on stair 0 or stair 1 is free; the top is just beyond the last stair.", makeStates(dp, "cost"));
      for (let i = 2; i <= cost.length; i++) {
        dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
        record(`Reach position ${i}`, `Choose the cheaper of reaching stair ${i - 1} or stair ${i - 2}, including that stair's cost.`, makeStates(dp, "cost"), null, `cost[${i}]`);
      }
      finish("Minimum cost to the top", "The last state is the cheapest route to the top.", makeStates(dp, "cost"), dp[cost.length]);
      return;
    }

    if (slug === "dynamic-programming-house-robber" || slug === "dynamic-programming-house-robber-ii") {
      const nums = countedArray(lines, 1, 100);
      if (nums.some((value) => value < 0)) throw new Error("House values must be non-negative.");
      const rangeRun = (start, end, title) => {
        const dp = [0];
        record(title, "Begin with zero money before considering any houses.", makeStates(dp, "best"));
        for (let i = start; i < end; i++) {
          dp.push(Math.max(dp[dp.length - 1], (dp[dp.length - 2] || 0) + nums[i]));
          record(`Consider house ${i}`, `Skip: ${dp[dp.length - 2]}; take: ${(dp[dp.length - 3] || 0) + nums[i]}.`, makeStates(dp, "best"), null, `best[${dp.length - 1}]`);
        }
        return dp[dp.length - 1];
      };
      let answer;
      if (slug.endsWith("house-robber-ii") && nums.length > 1) {
        const excludeLast = rangeRun(0, nums.length - 1, "Case 1 · Exclude the last house");
        const excludeFirst = rangeRun(1, nums.length, "Case 2 · Exclude the first house");
        answer = Math.max(excludeLast, excludeFirst);
      } else {
        answer = rangeRun(0, nums.length, "Linear houses");
      }
      finish("Maximum safe amount", "Take the better valid take-or-skip result.", [], answer);
      return;
    }

    if (slug === "dynamic-programming-coin-change") {
      if (lines.length < 2) throw new Error("Enter coin denominations on line 1 and the amount on line 2.");
      const coins = integerLine(lines[0], "Coin denominations");
      const amount = oneIntegerLine(lines[1], "Amount");
      if (!coins.length || coins.some((coin) => coin <= 0) || amount < 0 || amount > 500) throw new Error("Use positive coin values and an amount from 0 to 500.");
      const dp = Array(amount + 1).fill(Infinity);
      dp[0] = 0;
      record("Amount 0", "Making amount 0 requires no coins; all positive amounts start unreachable.", makeStates(dp));
      for (let value = 1; value <= amount; value++) {
        let chosen = null;
        for (const coin of coins) {
          if (coin <= value && dp[value - coin] + 1 < dp[value]) {
            dp[value] = dp[value - coin] + 1;
            chosen = coin;
          }
        }
        record(`Make amount ${value}`, chosen === null ? "No denomination reaches this amount yet." : `Use coin ${chosen} after the best solution for amount ${value - chosen}.`, makeStates(dp), null, `dp[${value}]`);
      }
      finish("Fewest coins", "Unreachable amounts return -1; otherwise the final state is the minimum coin count.", makeStates(dp), dp[amount] === Infinity ? -1 : dp[amount]);
      return;
    }

    if (slug === "dynamic-programming-coin-change-ii") {
      if (lines.length < 2) throw new Error("Enter the amount on line 1 and coin denominations on line 2.");
      const amount = oneIntegerLine(lines[0], "Amount");
      const coins = lines.slice(1).flatMap((line) => integerLine(line, "Coin denominations"));
      if (amount < 0 || amount > 500 || !coins.length || coins.some((coin) => coin <= 0)) throw new Error("Use an amount from 0 to 500 and positive coin denominations.");
      const ways = Array(amount + 1).fill(0);
      ways[0] = 1;
      record("Empty combination", "There is one way to make amount 0: choose no coins.", makeStates(ways, "ways"));
      for (const coin of coins) {
        if (coin <= amount) {
          for (let value = coin; value <= amount; value++) ways[value] += ways[value - coin];
          record(`Add coin ${coin}`, "Scan amounts upward so this denomination can be reused while combinations are counted only once.", makeStates(ways, "ways"), null, `ways[${amount}]`);
        }
      }
      finish("Combination count", "The destination state counts combinations, not permutations of the same coins.", makeStates(ways, "ways"), ways[amount]);
      return;
    }

    if (slug === "dynamic-programming-longest-increasing-subsequence") {
      const nums = countedArray(lines, 1, 100);
      const tails = [];
      record("Empty tails", "tails[k] is the smallest ending value found for a subsequence of length k + 1.", makeStates(tails, "tails"));
      for (const value of nums) {
        let low = 0, high = tails.length;
        while (low < high) {
          const middle = Math.floor((low + high) / 2);
          if (tails[middle] < value) low = middle + 1;
          else high = middle;
        }
        const action = low === tails.length ? "Extend" : `Replace tail ${tails[low]}`;
        tails[low] = value;
        record(`${action} with ${value}`, `Place ${value} at tails[${low}]; the row length is the longest increasing subsequence length.`, makeStates(tails, "tails"), null, `tails[${low}]`);
      }
      finish("Longest increasing subsequence", "The smallest-tail row has one entry for each achievable length.", makeStates(tails, "tails"), tails.length);
      return;
    }

    if (slug === "dynamic-programming-longest-common-subsequence") {
      if (lines.length < 2) throw new Error("Enter one string on each of the first two lines.");
      const [first, second] = lines;
      if (first.length > 20 || second.length > 20) throw new Error("Strings must be at most 20 characters for the matrix walkthrough.");
      const dp = Array.from({ length: first.length + 1 }, () => Array(second.length + 1).fill(0));
      const states = () => dp.flatMap((row, i) => row.map((value, j) => ({ label: `dp[${i},${j}]`, value, note: `prefixes ${i}, ${j}` })));
      record("Empty prefixes", "A prefix compared with an empty string has a common subsequence of length zero.", states());
      for (let i = 1; i <= first.length; i++) {
        for (let j = 1; j <= second.length; j++) {
          dp[i][j] = first[i - 1] === second[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
          record(`Compare ${first[i - 1]} with ${second[j - 1]}`, first[i - 1] === second[j - 1] ? "Matching characters extend the diagonal prefix." : "Different characters inherit the better top or left prefix.", states(), null, `dp[${i},${j}]`);
        }
      }
      finish("Longest common subsequence", "The bottom-right matrix cell contains the answer for both complete strings.", states(), dp[first.length][second.length]);
      return;
    }

    if (slug === "dynamic-programming-word-break") {
      if (lines.length < 2) throw new Error("Enter the string on line 1 and dictionary words on line 2.");
      const [text, ...wordLines] = lines;
      const words = new Set(wordLines.join(" ").split(/\s+/).filter(Boolean));
      if (!text || text.length > 100 || !words.size) throw new Error("Enter a non-empty string (up to 100 characters) and at least one dictionary word.");
      const reachable = Array(text.length + 1).fill(false);
      reachable[0] = true;
      const states = () => reachable.map((value, index) => ({ label: `prefix ${index}`, value: value ? "reachable" : "no", note: index === 0 ? "empty prefix" : text.slice(0, index) }));
      record("Empty prefix", "The empty prefix is reachable before any word is selected.", states());
      for (let end = 1; end <= text.length; end++) {
        let match = "";
        for (let start = 0; start < end; start++) {
          const candidate = text.slice(start, end);
          if (reachable[start] && words.has(candidate)) {
            reachable[end] = true;
            match = candidate;
            break;
          }
        }
        record(`Check prefix ${end}`, match ? `The reachable prefix jumps forward using "${match}".` : "No dictionary word connects a reachable boundary to this prefix.", states(), null, `prefix ${end}`);
      }
      finish("Word segmentation", "The full string can be segmented exactly when its final boundary is reachable.", states(), reachable[text.length]);
      return;
    }

    if (slug === "dynamic-programming-partition-equal-subset-sum") {
      const nums = countedArray(lines, 1, 100);
      const total = nums.reduce((sum, value) => sum + value, 0);
      if (nums.some((value) => value <= 0) || total > 5000) throw new Error("Use positive integers whose total is at most 5,000.");
      const target = total / 2;
      const reachable = Array(Math.floor(target) + 1).fill(false);
      reachable[0] = true;
      const states = () => reachable.map((value, index) => ({ label: `sum ${index}`, value: value ? "yes" : "no", note: index === target ? "target" : "reachable subset" }));
      record("Initial reachable sums", `Target is ${Number.isInteger(target) ? target : `${total} / 2`}; only sum 0 is initially reachable.`, states());
      if (total % 2 === 0) {
        for (const value of nums) {
          for (let sum = target; sum >= value; sum--) reachable[sum] ||= reachable[sum - value];
          record(`Use value ${value}`, "Scan downward so each number is used at most once.", states(), null, `sum ${target}`);
        }
      }
      finish("Equal partition", "The target is reachable only if the total is even and a subset reaches half the sum.", states(), total % 2 === 0 && reachable[target]);
      return;
    }

    if (slug === "dynamic-programming-target-sum") {
      if (lines.length < 3) throw new Error("Enter the item count, values, and target on separate lines.");
      const nums = countedArray(lines.slice(0, 2), 1, 20);
      const target = oneIntegerLine(lines[2], "Target");
      let counts = new Map([[0, 1]]);
      const states = () => [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([sum, value]) => ({ label: `sum ${sum}`, value, note: "sign assignments" }));
      record("Initial sum", "Before assigning signs, there is one way to make sum 0.", states());
      for (const value of nums) {
        const next = new Map();
        for (const [sum, count] of counts) {
          next.set(sum + value, (next.get(sum + value) || 0) + count);
          next.set(sum - value, (next.get(sum - value) || 0) + count);
        }
        counts = next;
        record(`Assign signs to ${value}`, "Each partial sum branches into +value and -value; equal sums merge their counts.", states());
      }
      finish("Target assignments", `Count the merged paths that finish at target ${target}.`, states(), counts.get(target) || 0);
      return;
    }

    if (slug === "dynamic-programming-unique-paths") {
      const dimensions = integerLine(lines[0], "Grid dimensions");
      if (dimensions.length !== 2) throw new Error("Enter exactly two grid dimensions.");
      const [rows, columns] = dimensions;
      if (rows < 1 || columns < 1 || rows > 20 || columns > 20) throw new Error("Use grid dimensions from 1 to 20 for the walkthrough.");
      const dp = Array.from({ length: rows }, () => Array(columns).fill(0));
      const states = () => dp.flatMap((row, i) => row.map((value, j) => ({ label: `cell ${i},${j}`, value, note: "paths to cell" })));
      dp[0][0] = 1;
      record("Start cell", "There is one way to be at the top-left starting cell.", states(), null, "cell 0,0");
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          if (i === 0 && j === 0) continue;
          dp[i][j] = (i ? dp[i - 1][j] : 0) + (j ? dp[i][j - 1] : 0);
          record(`Fill cell ${i},${j}`, "Add the paths arriving from above and from the left.", states(), null, `cell ${i},${j}`);
        }
      }
      finish("Unique paths", "The destination cell contains the total number of right/down routes.", states(), dp[rows - 1][columns - 1]);
      return;
    }

    if (slug === "dynamic-programming-unique-paths-ii" || slug === "dynamic-programming-minimum-path-sum") {
      const obstacles = slug.endsWith("unique-paths-ii");
      const grid = parseGrid(input, obstacles);
      const rows = grid.length, columns = grid[0].length;
      const dp = Array.from({ length: rows }, () => Array(columns).fill(obstacles ? 0 : Infinity));
      const states = () => dp.flatMap((row, i) => row.map((value, j) => ({
        label: `cell ${i},${j}`,
        value: obstacles && grid[i][j] === 1 ? "blocked" : value === Infinity ? "—" : value,
        note: obstacles && grid[i][j] === 1 ? "obstacle" : "state value",
      })));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          if (obstacles) {
            if (grid[i][j] === 0) {
              if (i === 0 && j === 0) dp[i][j] = 1;
              else dp[i][j] = (i ? dp[i - 1][j] : 0) + (j ? dp[i][j - 1] : 0);
            }
          } else if (i === 0 && j === 0) {
            dp[i][j] = grid[i][j];
          } else {
            dp[i][j] = grid[i][j] + Math.min(i ? dp[i - 1][j] : Infinity, j ? dp[i][j - 1] : Infinity);
          }
          record(`Process cell ${i},${j}`, obstacles
            ? grid[i][j] === 1 ? "The obstacle blocks all incoming paths." : "Add reachable paths from above and left."
            : "Add this cell's value to the cheaper path from above or left.", states(), null, `cell ${i},${j}`);
        }
      }
      finish(obstacles ? "Valid paths" : "Minimum path sum", obstacles
        ? "The destination state counts paths that never enter an obstacle."
        : "The destination state is the cheapest sum along a right/down path.",
      states(), dp[rows - 1][columns - 1]);
      return;
    }

    if (slug === "dynamic-programming-decode-ways") {
      const text = lines[0];
      if (!/^\d{1,100}$/.test(text)) throw new Error("Enter a digit string of at most 100 characters.");
      const dp = Array(text.length + 1).fill(0);
      dp[0] = 1;
      for (let i = 1; i <= text.length; i++) {
        if (text[i - 1] !== "0") dp[i] += dp[i - 1];
        if (i > 1) {
          const pair = Number(text.slice(i - 2, i));
          if (pair >= 10 && pair <= 26) dp[i] += dp[i - 2];
        }
        record(`Decode prefix ${i}`, `Single-digit and valid two-digit endings contribute ${dp[i]} total ways.`, makeStates(dp), null, `dp[${i}]`);
      }
      finish("Decode count", "The final prefix state is the number of valid decodings.", makeStates(dp), dp[text.length]);
      return;
    }

    if (slug === "dynamic-programming-maximum-product-subarray") {
      const nums = countedArray(lines, 1, 100);
      let maximum = nums[0], minimum = nums[0], answer = nums[0];
      const states = (index) => [
        { label: `max ending ${index}`, value: maximum, note: "largest product ending here" },
        { label: `min ending ${index}`, value: minimum, note: "smallest product ending here" },
        { label: "best overall", value: answer, note: "global maximum" },
      ];
      record("Start at first value", "Keep both the largest and smallest products ending at the current position.", states(0));
      for (let i = 1; i < nums.length; i++) {
        const value = nums[i];
        if (value < 0) [maximum, minimum] = [minimum, maximum];
        maximum = Math.max(value, maximum * value);
        minimum = Math.min(value, minimum * value);
        answer = Math.max(answer, maximum);
        record(`Extend with ${value}`, "A negative value can turn the previous minimum into the new maximum.", states(i), null, `max ending ${i}`);
      }
      finish("Maximum product", "The answer is the best product seen at any ending position.", states(nums.length - 1), answer);
      return;
    }

    if (slug === "dynamic-programming-best-time-to-buy-and-sell-stock-with-cooldown") {
      const prices = countedArray(lines, 1, 100);
      let hold = -prices[0], sold = -Infinity, rest = 0;
      const states = (day) => [
        { label: `day ${day} · hold`, value: hold, note: "holding a share" },
        { label: `day ${day} · sold`, value: sold === -Infinity ? "—" : sold, note: "sold today" },
        { label: `day ${day} · rest`, value: rest, note: "not holding; may buy" },
      ];
      record("Buy on day 0", "Initialize the holding state; no sale can have happened yet.", states(0));
      for (let day = 1; day < prices.length; day++) {
        const previousSold = sold;
        sold = hold + prices[day];
        hold = Math.max(hold, rest - prices[day]);
        rest = Math.max(rest, previousSold);
        record(`Day ${day} · price ${prices[day]}`, "A sale comes from yesterday's hold; buying is allowed only from rest after cooldown.", states(day), null, `day ${day} · sold`);
      }
      finish("Maximum profit", "Finish in either the sold or rest state; holding is not a completed transaction.", states(prices.length - 1), Math.max(sold, rest));
      return;
    }

    if (slug === "dynamic-programming-edit-distance") {
      if (lines.length < 2) throw new Error("Enter one word on each of the first two lines.");
      const [first, second] = lines;
      if (first.length > 20 || second.length > 20) throw new Error("Words must be at most 20 characters for the matrix walkthrough.");
      const dp = Array.from({ length: first.length + 1 }, (_, i) =>
        Array.from({ length: second.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
      const states = () => dp.flatMap((row, i) => row.map((value, j) => ({ label: `dp[${i},${j}]`, value, note: "prefix edit cost" })));
      record("Empty prefixes", "The first row and column count insertions or deletions against an empty word.", states());
      for (let i = 1; i <= first.length; i++) {
        for (let j = 1; j <= second.length; j++) {
          dp[i][j] = first[i - 1] === second[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
          record(`Compare ${first[i - 1]} with ${second[j - 1]}`, first[i - 1] === second[j - 1]
            ? "Matching characters reuse the diagonal cost."
            : "Choose the cheapest replace, delete, or insert predecessor, then add one.", states(), null, `dp[${i},${j}]`);
        }
      }
      finish("Minimum edit distance", "The bottom-right cell transforms both complete words.", states(), dp[first.length][second.length]);
      return;
    }

    if (slug === "dynamic-programming-01-knapsack-interview-classic") {
      if (lines.length < 3) throw new Error("Enter n and capacity, then weights and values on separate lines.");
      const dimensions = integerLine(lines[0], "Item count and capacity");
      if (dimensions.length !== 2) throw new Error("Enter exactly the item count and capacity on line 1.");
      const [count, capacity] = dimensions;
      const weights = integerLine(lines[1], "Weights");
      const values = integerLine(lines[2], "Values");
      if (count < 1 || count > 100 || capacity < 0 || capacity > 500 || weights.length !== count || values.length !== count || weights.some((w) => w <= 0) || values.some((v) => v < 0)) {
        throw new Error("Provide matching positive weights and non-negative values; capacity must be from 0 to 500.");
      }
      const dp = Array(capacity + 1).fill(0);
      record("Empty knapsack", "Every capacity has value 0 before any item is considered.", makeStates(dp, "capacity"));
      for (let item = 0; item < count; item++) {
        for (let current = capacity; current >= weights[item]; current--) {
          dp[current] = Math.max(dp[current], dp[current - weights[item]] + values[item]);
        }
        record(`Consider item ${item}`, "Update capacities downward so this item can be selected at most once.", makeStates(dp, "capacity"));
      }
      finish("Maximum value", "The capacity state stores the best value achievable without exceeding the limit.", makeStates(dp, "capacity"), dp[capacity]);
      return;
    }

    if (slug === "dynamic-programming-palindromic-substrings") {
      const text = lines[0];
      if (!text || text.length > 100) throw new Error("Enter a non-empty string of at most 100 characters.");
      let count = 0;
      const centers = Array.from({ length: text.length }, (_, i) => ({ label: `center ${i}`, value: 0, note: `character ${text[i]}` }));
      record("No centers expanded", "Every character and gap is considered as a possible palindrome center.", centers);
      for (let center = 0; center < 2 * text.length - 1; center++) {
        let left = Math.floor(center / 2), right = Math.floor((center + 1) / 2), expanded = 0;
        while (left >= 0 && right < text.length && text[left] === text[right]) {
          count++;
          expanded++;
          centers[Math.floor(center / 2)].value = count;
          record(`Expand around ${left}–${right}`, `Characters match; count palindrome "${text.slice(left, right + 1)}".`, [...centers], null, `center ${Math.floor(center / 2)}`);
          left--;
          right++;
        }
        if (!expanded) {
          record(`Center ${center}`, "The first pair around this center does not match, so expansion stops.", [...centers]);
        }
      }
      finish("Palindrome count", "Each successful center expansion counts a distinct substring position.", centers, count);
      return;
    }

    throw new Error(`No DP walkthrough is registered for ${question.title || slug}.`);
  });
}
