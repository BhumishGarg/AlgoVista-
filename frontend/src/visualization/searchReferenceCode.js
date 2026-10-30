const solutions = {
  "searching-binary-search": {
    java: `int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    python: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    cpp: `int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  "searching-capacity-to-ship-packages-within-d-days": {
    java: `int shipWithinDays(int[] weights, int days) {
    int left = Arrays.stream(weights).max().getAsInt();
    int right = Arrays.stream(weights).sum();
    while (left < right) {
        int capacity = left + (right - left) / 2, used = 1, load = 0;
        for (int weight : weights) {
            if (load + weight > capacity) { used++; load = 0; }
            load += weight;
        }
        if (used <= days) right = capacity;
        else left = capacity + 1;
    }
    return left;
}`,
    python: `def ship_within_days(weights, days):
    left, right = max(weights), sum(weights)
    while left < right:
        capacity = (left + right) // 2
        used, load = 1, 0
        for weight in weights:
            if load + weight > capacity:
                used += 1
                load = 0
            load += weight
        if used <= days:
            right = capacity
        else:
            left = capacity + 1
    return left`,
    cpp: `int shipWithinDays(vector<int>& weights, int days) {
    int left = *max_element(weights.begin(), weights.end());
    int right = accumulate(weights.begin(), weights.end(), 0);
    while (left < right) {
        int cap = left + (right - left) / 2, used = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { ++used; load = 0; }
            load += w;
        }
        if (used <= days) right = cap;
        else left = cap + 1;
    }
    return left;
}`,
  },
  "searching-find-first-and-last-position": {
    java: `int[] searchRange(int[] nums, int target) {
    int first = lowerBound(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1,-1};
    return new int[]{first, lowerBound(nums, target + 1) - 1};
}
int lowerBound(int[] a, int x) {
    int l=0, r=a.length;
    while (l<r) { int m=l+(r-l)/2; if (a[m]<x) l=m+1; else r=m; }
    return l;
}`,
    python: `def search_range(nums, target):
    def lower_bound(value):
        left, right = 0, len(nums)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < value:
                left = mid + 1
            else:
                right = mid
        return left
    first = lower_bound(target)
    if first == len(nums) or nums[first] != target:
        return [-1, -1]
    return [first, lower_bound(target + 1) - 1]`,
    cpp: `vector<int> searchRange(vector<int>& nums, int target) {
    auto first = lower_bound(nums.begin(), nums.end(), target);
    if (first == nums.end() || *first != target) return {-1,-1};
    auto after = upper_bound(nums.begin(), nums.end(), target);
    return {int(first-nums.begin()), int(after-nums.begin())-1};
}`,
  },
  "searching-find-k-closest-elements": {
    java: `List<Integer> findClosestElements(int[] arr, int k, int x) {
    int left=0, right=arr.length-k;
    while (left<right) {
        int mid=left+(right-left)/2;
        if (x-arr[mid] > arr[mid+k]-x) left=mid+1;
        else right=mid;
    }
    List<Integer> out=new ArrayList<>();
    for(int i=left;i<left+k;i++) out.add(arr[i]);
    return out;
}`,
    python: `def find_closest_elements(arr, k, x):
    left, right = 0, len(arr) - k
    while left < right:
        mid = (left + right) // 2
        if x - arr[mid] > arr[mid + k] - x:
            left = mid + 1
        else:
            right = mid
    return arr[left:left + k]`,
    cpp: `vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    int left=0, right=arr.size()-k;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(x-arr[mid] > arr[mid+k]-x) left=mid+1;
        else right=mid;
    }
    return vector<int>(arr.begin()+left, arr.begin()+left+k);
}`,
  },
  "searching-find-minimum-in-rotated-sorted-array": {
    java: `int findMin(int[] nums) {
    int left=0, right=nums.length-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(nums[mid]>nums[right]) left=mid+1;
        else right=mid;
    }
    return nums[left];
}`,
    python: `def find_min(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]`,
    cpp: `int findMin(vector<int>& nums) {
    int left=0, right=nums.size()-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(nums[mid]>nums[right]) left=mid+1;
        else right=mid;
    }
    return nums[left];
}`,
  },
  "searching-find-minimum-in-rotated-sorted-array-ii": {
    java: `int findMin(int[] nums) {
    int left=0, right=nums.length-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(nums[mid]<nums[right]) right=mid;
        else if(nums[mid]>nums[right]) left=mid+1;
        else right--;
    }
    return nums[left];
}`,
    python: `def find_min(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[right]:
            right = mid
        elif nums[mid] > nums[right]:
            left = mid + 1
        else:
            right -= 1
    return nums[left]`,
    cpp: `int findMin(vector<int>& nums) {
    int left=0, right=nums.size()-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(nums[mid]<nums[right]) right=mid;
        else if(nums[mid]>nums[right]) left=mid+1;
        else --right;
    }
    return nums[left];
}`,
  },
  "searching-find-peak-element": {
    java: `int findPeakElement(int[] nums) {
    int left=0, right=nums.length-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(nums[mid]<nums[mid+1]) left=mid+1;
        else right=mid;
    }
    return left;
}`,
    python: `def find_peak_element(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left`,
    cpp: `int findPeakElement(vector<int>& nums) {
    int left=0, right=nums.size()-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(nums[mid]<nums[mid+1]) left=mid+1;
        else right=mid;
    }
    return left;
}`,
  },
  "searching-guess-number-higher-or-lower": {
    java: `int guessNumber(int n) {
    int left=1, right=n;
    while(left<=right) {
        int mid=left+(right-left)/2;
        int response=guess(mid);
        if(response==0) return mid;
        if(response<0) right=mid-1;
        else left=mid+1;
    }
    return -1;
}`,
    python: `def guess_number(n, pick):
    left, right = 1, n
    while left <= right:
        mid = left + (right - left) // 2
        if mid == pick:
            return mid
        if mid > pick:
            right = mid - 1
        else:
            left = mid + 1
    return -1`,
    cpp: `int guessNumber(int n) {
    int left=1, right=n;
    while(left<=right) {
        int mid=left+(right-left)/2, response=guess(mid);
        if(response==0) return mid;
        if(response<0) right=mid-1;
        else left=mid+1;
    }
    return -1;
}`,
  },
  "searching-koko-eating-bananas": {
    java: `int minEatingSpeed(int[] piles, int h) {
    int left=1, right=Arrays.stream(piles).max().getAsInt();
    while(left<right) {
        int speed=left+(right-left)/2;
        long hours=0;
        for(int pile:piles) hours+=(pile+speed-1L)/speed;
        if(hours<=h) right=speed; else left=speed+1;
    }
    return left;
}`,
    python: `def min_eating_speed(piles, h):
    left, right = 1, max(piles)
    while left < right:
        speed = (left + right) // 2
        hours = sum((pile + speed - 1) // speed for pile in piles)
        if hours <= h:
            right = speed
        else:
            left = speed + 1
    return left`,
    cpp: `int minEatingSpeed(vector<int>& piles, int h) {
    int left=1, right=*max_element(piles.begin(),piles.end());
    while(left<right) {
        int speed=left+(right-left)/2;
        long long hours=0;
        for(int p:piles) hours+=(p+speed-1LL)/speed;
        if(hours<=h) right=speed; else left=speed+1;
    }
    return left;
}`,
  },
  "searching-median-of-two-sorted-arrays": {
    java: `double findMedianSortedArrays(int[] a, int[] b) {
    if(a.length>b.length) return findMedianSortedArrays(b,a);
    int m=a.length,n=b.length, left=0,right=m;
    while(left<=right) {
        int i=left+(right-left)/2, j=(m+n+1)/2-i;
        int la=i==0?Integer.MIN_VALUE:a[i-1], ra=i==m?Integer.MAX_VALUE:a[i];
        int lb=j==0?Integer.MIN_VALUE:b[j-1], rb=j==n?Integer.MAX_VALUE:b[j];
        if(la<=rb && lb<=ra)
            return (m+n)%2==1?Math.max(la,lb):(Math.max(la,lb)+Math.min(ra,rb))/2.0;
        if(la>rb) right=i-1; else left=i+1;
    }
    return 0;
}`,
    python: `def find_median_sorted_arrays(a, b):
    if len(a) > len(b):
        a, b = b, a
    m, n = len(a), len(b)
    left, right = 0, m
    while left <= right:
        i = (left + right) // 2
        j = (m + n + 1) // 2 - i
        la = float("-inf") if i == 0 else a[i - 1]
        ra = float("inf") if i == m else a[i]
        lb = float("-inf") if j == 0 else b[j - 1]
        rb = float("inf") if j == n else b[j]
        if la <= rb and lb <= ra:
            if (m + n) % 2:
                return max(la, lb)
            return (max(la, lb) + min(ra, rb)) / 2
        if la > rb:
            right = i - 1
        else:
            left = i + 1`,
    cpp: `double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
    if(a.size()>b.size()) return findMedianSortedArrays(b,a);
    int m=a.size(), n=b.size(), left=0, right=m;
    while(left<=right) {
        int i=left+(right-left)/2, j=(m+n+1)/2-i;
        int la=i==0?INT_MIN:a[i-1], ra=i==m?INT_MAX:a[i];
        int lb=j==0?INT_MIN:b[j-1], rb=j==n?INT_MAX:b[j];
        if(la<=rb && lb<=ra)
            return (m+n)%2?max(la,lb):(max(la,lb)+min(ra,rb))/2.0;
        if(la>rb) right=i-1; else left=i+1;
    }
    return 0;
}`,
  },
  "searching-minimum-number-of-days-to-make-m-bouquets": {
    java: `int minDays(int[] bloomDay, int m, int k) {
    if ((long)m*k>bloomDay.length) return -1;
    int left=Arrays.stream(bloomDay).min().getAsInt();
    int right=Arrays.stream(bloomDay).max().getAsInt();
    while(left<right) {
        int day=left+(right-left)/2, made=0, run=0;
        for(int bloom:bloomDay) {
            if(bloom<=day) { if(++run==k) { made++; run=0; } }
            else run=0;
        }
        if(made>=m) right=day; else left=day+1;
    }
    return left;
}`,
    python: `def min_days(bloom_day, m, k):
    if m * k > len(bloom_day):
        return -1
    left, right = min(bloom_day), max(bloom_day)
    while left < right:
        day = (left + right) // 2
        made = consecutive = 0
        for bloom in bloom_day:
            if bloom <= day:
                consecutive += 1
                if consecutive == k:
                    made += 1
                    consecutive = 0
            else:
                consecutive = 0
        if made >= m:
            right = day
        else:
            left = day + 1
    return left`,
    cpp: `int minDays(vector<int>& bloomDay, int m, int k) {
    if((long long)m*k>bloomDay.size()) return -1;
    int left=*min_element(bloomDay.begin(),bloomDay.end());
    int right=*max_element(bloomDay.begin(),bloomDay.end());
    while(left<right) {
        int day=left+(right-left)/2, made=0, run=0;
        for(int x:bloomDay) {
            if(x<=day) { if(++run==k) { ++made; run=0; } }
            else run=0;
        }
        if(made>=m) right=day; else left=day+1;
    }
    return left;
}`,
  },
  "searching-peak-index-in-a-mountain-array": {
    java: `int peakIndexInMountainArray(int[] arr) {
    int left=0, right=arr.length-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(arr[mid]<arr[mid+1]) left=mid+1;
        else right=mid;
    }
    return left;
}`,
    python: `def peak_index_in_mountain_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < arr[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left`,
    cpp: `int peakIndexInMountainArray(vector<int>& arr) {
    int left=0, right=arr.size()-1;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(arr[mid]<arr[mid+1]) left=mid+1;
        else right=mid;
    }
    return left;
}`,
  },
  "searching-search-insert-position": {
    java: `int searchInsert(int[] nums, int target) {
    int left=0, right=nums.length;
    while(left<right) {
        int mid=left+(right-left)/2;
        if(nums[mid]<target) left=mid+1;
        else right=mid;
    }
    return left;
}`,
    python: `def search_insert(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left`,
    cpp: `int searchInsert(vector<int>& nums, int target) {
    return lower_bound(nums.begin(), nums.end(), target) - nums.begin();
}`,
  },
  "searching-search-a-2d-matrix": {
    java: `boolean searchMatrix(int[][] matrix, int target) {
    int rows=matrix.length, cols=matrix[0].length;
    int left=0, right=rows*cols-1;
    while(left<=right) {
        int mid=left+(right-left)/2;
        int value=matrix[mid/cols][mid%cols];
        if(value==target) return true;
        if(value<target) left=mid+1; else right=mid-1;
    }
    return false;
}`,
    python: `def search_matrix(matrix, target):
    rows, cols = len(matrix), len(matrix[0])
    left, right = 0, rows * cols - 1
    while left <= right:
        mid = (left + right) // 2
        value = matrix[mid // cols][mid % cols]
        if value == target:
            return True
        if value < target:
            left = mid + 1
        else:
            right = mid - 1
    return False`,
    cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows=matrix.size(), cols=matrix[0].size(), left=0, right=rows*cols-1;
    while(left<=right) {
        int mid=left+(right-left)/2, value=matrix[mid/cols][mid%cols];
        if(value==target) return true;
        if(value<target) left=mid+1; else right=mid-1;
    }
    return false;
}`,
  },
  "searching-search-a-2d-matrix-ii": {
    java: `boolean searchMatrix(int[][] matrix, int target) {
    int row=0, col=matrix[0].length-1;
    while(row<matrix.length && col>=0) {
        if(matrix[row][col]==target) return true;
        if(matrix[row][col]>target) col--;
        else row++;
    }
    return false;
}`,
    python: `def search_matrix(matrix, target):
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target:
            return True
        if matrix[row][col] > target:
            col -= 1
        else:
            row += 1
    return False`,
    cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int row=0, col=matrix[0].size()-1;
    while(row<matrix.size() && col>=0) {
        if(matrix[row][col]==target) return true;
        if(matrix[row][col]>target) --col;
        else ++row;
    }
    return false;
}`,
  },
  "searching-search-in-rotated-sorted-array": {
    java: `int search(int[] nums, int target) {
    int left=0, right=nums.length-1;
    while(left<=right) {
        int mid=left+(right-left)/2;
        if(nums[mid]==target) return mid;
        if(nums[left]<=nums[mid]) {
            if(nums[left]<=target && target<nums[mid]) right=mid-1;
            else left=mid+1;
        } else {
            if(nums[mid]<target && target<=nums[right]) left=mid+1;
            else right=mid-1;
        }
    }
    return -1;
}`,
    python: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        elif nums[mid] < target <= nums[right]:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    cpp: `int search(vector<int>& nums, int target) {
    int left=0, right=nums.size()-1;
    while(left<=right) {
        int mid=left+(right-left)/2;
        if(nums[mid]==target) return mid;
        if(nums[left]<=nums[mid]) {
            if(nums[left]<=target && target<nums[mid]) right=mid-1;
            else left=mid+1;
        } else {
            if(nums[mid]<target && target<=nums[right]) left=mid+1;
            else right=mid-1;
        }
    }
    return -1;
}`,
  },
  "searching-search-in-rotated-sorted-array-ii": {
    java: `boolean search(int[] nums, int target) {
    int left=0, right=nums.length-1;
    while(left<=right) {
        int mid=left+(right-left)/2;
        if(nums[mid]==target) return true;
        if(nums[left]==nums[mid] && nums[mid]==nums[right]) { left++; right--; }
        else if(nums[left]<=nums[mid]) {
            if(nums[left]<=target && target<nums[mid]) right=mid-1;
            else left=mid+1;
        } else {
            if(nums[mid]<target && target<=nums[right]) left=mid+1;
            else right=mid-1;
        }
    }
    return false;
}`,
    python: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return True
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        elif nums[mid] < target <= nums[right]:
            left = mid + 1
        else:
            right = mid - 1
    return False`,
    cpp: `bool search(vector<int>& nums, int target) {
    int left=0, right=nums.size()-1;
    while(left<=right) {
        int mid=left+(right-left)/2;
        if(nums[mid]==target) return true;
        if(nums[left]==nums[mid] && nums[mid]==nums[right]) { ++left; --right; }
        else if(nums[left]<=nums[mid]) {
            if(nums[left]<=target && target<nums[mid]) right=mid-1;
            else left=mid+1;
        } else if(nums[mid]<target && target<=nums[right]) left=mid+1;
        else right=mid-1;
    }
    return false;
}`,
  },
  "searching-split-array-largest-sum": {
    java: `int splitArray(int[] nums, int k) {
    long left=Arrays.stream(nums).max().getAsInt();
    long right=Arrays.stream(nums).asLongStream().sum();
    while(left<right) {
        long limit=left+(right-left)/2, sum=0; int parts=1;
        for(int x:nums) { if(sum+x>limit) { parts++; sum=0; } sum+=x; }
        if(parts<=k) right=limit; else left=limit+1;
    }
    return (int)left;
}`,
    python: `def split_array(nums, k):
    left, right = max(nums), sum(nums)
    while left < right:
        limit = (left + right) // 2
        parts, total = 1, 0
        for value in nums:
            if total + value > limit:
                parts += 1
                total = 0
            total += value
        if parts <= k:
            right = limit
        else:
            left = limit + 1
    return left`,
    cpp: `int splitArray(vector<int>& nums, int k) {
    long long left=*max_element(nums.begin(),nums.end());
    long long right=accumulate(nums.begin(),nums.end(),0LL);
    while(left<right) {
        long long limit=left+(right-left)/2, sum=0; int parts=1;
        for(int x:nums) { if(sum+x>limit) { ++parts; sum=0; } sum+=x; }
        if(parts<=k) right=limit; else left=limit+1;
    }
    return left;
}`,
  },
  "searching-sqrt-x": {
    java: `int mySqrt(int x) {
    int left=0, right=x, answer=0;
    while(left<=right) {
        int mid=left+(right-left)/2;
        if(mid==0 || mid<=x/mid) { answer=mid; left=mid+1; }
        else right=mid-1;
    }
    return answer;
}`,
    python: `def my_sqrt(x):
    left, right, answer = 0, x, 0
    while left <= right:
        mid = (left + right) // 2
        if mid == 0 or mid <= x // mid:
            answer = mid
            left = mid + 1
        else:
            right = mid - 1
    return answer`,
    cpp: `int mySqrt(int x) {
    long long left=0, right=x, answer=0;
    while(left<=right) {
        long long mid=left+(right-left)/2;
        if(mid==0 || mid<=x/mid) { answer=mid; left=mid+1; }
        else right=mid-1;
    }
    return answer;
}`,
  },
  "searching-valid-perfect-square": {
    java: `boolean isPerfectSquare(int num) {
    long left=1, right=num;
    while(left<=right) {
        long mid=left+(right-left)/2, square=mid*mid;
        if(square==num) return true;
        if(square<num) left=mid+1; else right=mid-1;
    }
    return false;
}`,
    python: `def is_perfect_square(num):
    left, right = 1, num
    while left <= right:
        mid = (left + right) // 2
        square = mid * mid
        if square == num:
            return True
        if square < num:
            left = mid + 1
        else:
            right = mid - 1
    return False`,
    cpp: `bool isPerfectSquare(int num) {
    long long left=1, right=num;
    while(left<=right) {
        long long mid=left+(right-left)/2, square=mid*mid;
        if(square==num) return true;
        if(square<num) left=mid+1; else right=mid-1;
    }
    return false;
}`,
  },
};

export function getSearchReferenceCode(slug, language) {
  return solutions[slug]?.[language] || "";
}
