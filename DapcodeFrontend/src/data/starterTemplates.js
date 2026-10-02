export const DEFAULT_STARTER_CODE = {
  python: `class Solution:
    def solve(self, *args):
        pass
`,
  java: `class Solution {
    public void solve() {
    }
}
`,
  cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    void solve() {
    }
};
`,
};

export const PROBLEM_STARTER_TEMPLATES = {
  'two-sum': {
    python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass
`,
    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {};
    }
};
`,
    java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}
`,
  },
  'contains-duplicate': {
    python: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        pass
`,
    cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        return false;
    }
};
`,
    java: `import java.util.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        return false;
    }
}
`,
  },
  'valid-anagram': {
    python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass
`,
    cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        return false;
    }
};
`,
    java: `import java.util.*;

class Solution {
    public boolean isAnagram(String s, String t) {
        return false;
    }
}
`,
  },
  'binary-search': {
    python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        pass
`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        return -1;
    }
};
`,
    java: `class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}
`,
  },
};

export function getStarterCode(slug, language) {
  if (slug && PROBLEM_STARTER_TEMPLATES[slug] && PROBLEM_STARTER_TEMPLATES[slug][language]) {
    return PROBLEM_STARTER_TEMPLATES[slug][language];
  }
  return DEFAULT_STARTER_CODE[language] || '';
}
