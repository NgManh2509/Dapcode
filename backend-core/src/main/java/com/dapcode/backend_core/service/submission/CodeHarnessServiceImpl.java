package com.dapcode.backend_core.service.submission;

import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class CodeHarnessServiceImpl implements CodeHarnessService {

    public static final Set<String> DESIGN_SLUGS = Set.of(
            "design-hashset",
            "design-hashmap",
            "min-stack",
            "implement-queue-using-stacks",
            "implement-stack-using-queues",
            "design-circular-queue",
            "online-stock-span",
            "implement-trie-prefix-tree",
            "design-add-and-search-words-data-structure",
            "lru-cache",
            "time-based-key-value-store",
            "design-twitter",
            "find-median-from-data-stream",
            "range-sum-query-2d-immutable",
            "maximum-frequency-stack",
            "detect-squares",
            "lfu-cache",
            "kth-largest-element-in-a-stream");

    private String stripComments(String code) {
        if (code == null) {
            return "";
        }
        return code.replaceAll("(?s)/\\*.*?\\*/", "")
                   .replaceAll("(?m)//.*$", "")
                   .replaceAll("(?m)#.*$", "");
    }

    private boolean isDesignProblem(String slug, String code) {
        if (slug != null) {
            String clean = slug.toLowerCase().trim();
            if ("serialize-and-deserialize-binary-tree".equals(clean)) {
                return false;
            }
            if (DESIGN_SLUGS.contains(clean)) {
                return true;
            }
        }
        return !Pattern.compile("\\bclass\\s+(?:Solution|Codec)\\b").matcher(stripComments(code)).find();
    }

    @Override
    public String prepareSourceCode(String slug, int languageId, String rawSourceCode) {
        if (rawSourceCode == null || rawSourceCode.isBlank()) {
            return rawSourceCode;
        }

        return switch (languageId) {
            case 71 -> wrapPython(slug, rawSourceCode);
            case 54 -> wrapCpp(slug, rawSourceCode);
            case 62 -> wrapJava(slug, rawSourceCode);
            default -> rawSourceCode;
        };
    }

    private String wrapPython(String slug, String code) {
        if (code.contains("__main__")) {
            return code;
        }
        String cleanSlug = slug != null ? slug.toLowerCase().trim() : "";
        String uncommented = stripComments(code);

        String prefix = """
from __future__ import annotations
from typing import *
from functools import *
from itertools import *
from collections import *
from bisect import *
from math import *
from heapq import *
from operator import *
import collections
import heapq
import math
import json
import sys
import re
import random
from random import randint

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class MountainArray:
    def __init__(self, arr):
        self._arr = list(arr) if isinstance(arr, list) else []
    def get(self, index: int) -> int:
        return self._arr[index]
    def length(self) -> int:
        return len(self._arr)

_GUESS_PICK = 0
def guess(num: int) -> int:
    if num > _GUESS_PICK:
        return -1
    if num < _GUESS_PICK:
        return 1
    return 0

def _to_list_node(arr, pos=-1):
    if not isinstance(arr, list):
        return arr
    dummy = ListNode(0)
    curr = dummy
    nodes = []
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
        nodes.append(curr)
    if isinstance(pos, int) and 0 <= pos < len(nodes) and nodes:
        nodes[-1].next = nodes[pos]
    return dummy.next

def _from_list_node(node):
    res = []
    visited = set()
    while node is not None and id(node) not in visited:
        visited.add(id(node))
        res.append(node.val)
        node = node.next
    return res

def _to_tree_node(arr):
    if isinstance(arr, int):
        return TreeNode(arr)
    if not isinstance(arr, list) or not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    q = collections.deque([root])
    i = 1
    while q and i < len(arr):
        curr = q.popleft()
        if i < len(arr):
            if arr[i] is not None:
                curr.left = TreeNode(arr[i])
                q.append(curr.left)
            i += 1
        if i < len(arr):
            if arr[i] is not None:
                curr.right = TreeNode(arr[i])
                q.append(curr.right)
            i += 1
    return root

def _find_tree_node(root, val):
    if root is None:
        return None
    if root.val == val:
        return root
    left = _find_tree_node(root.left, val)
    return left if left is not None else _find_tree_node(root.right, val)

def _from_tree_node(root):
    if root is None:
        return []
    res = []
    q = collections.deque([root])
    while q:
        curr = q.popleft()
        if curr is None:
            res.append(None)
        else:
            res.append(curr.val)
            q.append(curr.left)
            q.append(curr.right)
    while res and res[-1] is None:
        res.pop()
    return res

def _to_graph_node(adj, cls):
    if not isinstance(adj, list) or len(adj) == 0:
        return None
    nodes = [cls(i + 1) for i in range(len(adj))]
    for i, neighbors in enumerate(adj):
        nodes[i].neighbors = [nodes[nb - 1] for nb in neighbors if 1 <= nb <= len(adj)]
    return nodes[0]

def _from_graph_node(node):
    if node is None:
        return []
    visited = {}
    q = collections.deque([node])
    while q:
        curr = q.popleft()
        if curr.val in visited:
            continue
        visited[curr.val] = [nb.val for nb in curr.neighbors]
        for nb in curr.neighbors:
            if nb.val not in visited:
                q.append(nb)
    if not visited:
        return []
    mx = max(visited.keys())
    return [visited.get(i, []) for i in range(1, mx + 1)]

def _to_random_list(arr, cls):
    if not isinstance(arr, list) or not arr:
        return None
    nodes = [cls(int(item[0])) for item in arr]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    for i, item in enumerate(arr):
        r_idx = item[1] if len(item) > 1 else None
        if r_idx is not None and 0 <= r_idx < len(nodes):
            nodes[i].random = nodes[r_idx]
    return nodes[0]

def _from_random_list(head):
    if head is None:
        return []
    nodes = []
    idx_map = {}
    curr = head
    i = 0
    while curr is not None and id(curr) not in idx_map:
        idx_map[id(curr)] = i
        nodes.append(curr)
        curr = curr.next
        i += 1
    res = []
    for n in nodes:
        r_idx = idx_map.get(id(n.random), None) if n.random is not None else None
        res.append([n.val, r_idx])
    return res

def _from_quad_tree(root):
    if root is None:
        return []
    res = []
    q = collections.deque([root])
    while q:
        curr = q.popleft()
        if curr is None:
            res.append(None)
        else:
            is_leaf = 1 if curr.isLeaf else 0
            val = (1 if curr.val else 0) if curr.isLeaf else 1
            res.append([is_leaf, val])
            if not curr.isLeaf:
                q.append(curr.topLeft)
                q.append(curr.topRight)
                q.append(curr.bottomLeft)
                q.append(curr.bottomRight)
            else:
                q.extend([None, None, None, None])
    while res and res[-1] is None:
        res.pop()
    return res

""";

        StringBuilder nodeDef = new StringBuilder();
        if (!uncommented.contains("class Node")) {
            if ("clone-graph".equals(cleanSlug)) {
                nodeDef.append("""
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
""");
            } else if ("copy-list-with-random-pointer".equals(cleanSlug)) {
                nodeDef.append("""
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
""");
            } else if ("construct-quad-tree".equals(cleanSlug)) {
                nodeDef.append("""
class Node:
    def __init__(self, val=False, isLeaf=False, topLeft=None, topRight=None, bottomLeft=None, bottomRight=None):
        self.val = val
        self.isLeaf = isLeaf
        self.topLeft = topLeft
        self.topRight = topRight
        self.bottomLeft = bottomLeft
        self.bottomRight = bottomRight
""");
            }
        }

        String runner = """

def _dapcode_main():
    import sys, re, inspect, ast, json
    global _GUESS_PICK

    _slug = "%s"
    _raw_input = sys.stdin.read().strip()
    if not _raw_input:
        return

    _lines = [_l.strip() for _l in _raw_input.split('\\n') if _l.strip()]
    if len(_lines) >= 2 and _lines[0].startswith('[') and _lines[1].startswith('['):
        try:
            _commands = json.loads(_lines[0])
            _args_list = json.loads(_lines[1])
            _cls_name = _commands[0]
            _cls = globals().get(_cls_name)
            if _cls:
                _obj = _cls(*_args_list[0])
                _results = [None]
                for _cmd, _m_args in zip(_commands[1:], _args_list[1:]):
                    _fn = getattr(_obj, _cmd)
                    _res = _fn(*_m_args)
                    _results.append(_res)
                print(json.dumps(_results))
                return
        except Exception:
            pass

    _scope = {}
    if _raw_input.startswith('{') and _raw_input.endswith('}'):
        try:
            _scope = json.loads(_raw_input)
        except Exception:
            pass

    if not _scope:
        _parts = re.split(r'(?:,|\\r?\\n)\\s*(?=[a-zA-Z_]\\w*\\s*=)', _raw_input)
        for _part in _parts:
            if '=' in _part:
                _k, _v = _part.split('=', 1)
                _v_str = _v.strip()
                try:
                    _scope[_k.strip()] = eval(_v_str, {"true": True, "false": False, "null": None})
                except Exception:
                    try:
                        _scope[_k.strip()] = ast.literal_eval(_v_str)
                    except Exception:
                        if re.fullmatch(r'[01]{32}', _v_str):
                            _scope[_k.strip()] = int(_v_str, 2)
    if not _scope and _lines:
        for _idx, _l in enumerate(_lines):
            try:
                _scope[f'_arg_{_idx}'] = eval(_l, {"true": True, "false": False, "null": None})
            except Exception:
                pass

    if 'pick' in _scope:
        try:
            _GUESS_PICK = int(_scope['pick'])
        except Exception:
            pass

    try:
        if _slug == 'serialize-and-deserialize-binary-tree' and 'Codec' in globals():
            _root_val = _scope.get('root', next(iter(_scope.values()), []))
            _root_node = _to_tree_node(_root_val)
            _ser = Codec()
            _deser = Codec()
            _ans = _deser.deserialize(_ser.serialize(_root_node))
            print(json.dumps(_from_tree_node(_ans)))
            return

        if _slug == 'encode-and-decode-strings':
            _sol = Solution()
            _strs = _scope.get('strs', _scope.get('dummy_input', next(iter(_scope.values()), [])))
            _enc = _sol.encode(_strs)
            _dec = _sol.decode(_enc)
            print(json.dumps(_dec))
            return

        if 'Solution' not in globals():
            return

        _sol = Solution()
        _methods = [_name for _name, _fn in inspect.getmembers(_sol, predicate=inspect.ismethod) if not _name.startswith('_')]
        if _methods:
            _target_method = getattr(_sol, _methods[0])
            _sig = inspect.signature(_target_method)
            _params = list(_sig.parameters.values())
            _raw_args = []
            for _param in _params:
                if _param.name in _scope:
                    _raw_args.append((_param, _scope[_param.name]))
            if len(_raw_args) < len(_params) and _scope:
                _raw_args = list(zip(_params, _scope.values()))

            _args = []
            _root_tree_ref = None
            for _param, _val in _raw_args:
                _ann = str(_param.annotation) if _param.annotation is not inspect.Parameter.empty else ''
                if _slug == 'clone-graph':
                    _val = _to_graph_node(_val, Node)
                elif _slug == 'copy-list-with-random-pointer':
                    _val = _to_random_list(_val, Node)
                elif 'MountainArray' in _ann or _param.name == 'mountainArr':
                    _val = MountainArray(_val)
                elif 'TreeNode' in _ann or _param.name in ('root', 'subRoot', 'tree', 't1', 't2'):
                    if isinstance(_val, int) and _root_tree_ref is not None:
                        _found = _find_tree_node(_root_tree_ref, _val)
                        _val = _found if _found is not None else TreeNode(_val)
                    else:
                        _val = _to_tree_node(_val)
                        if _root_tree_ref is None and isinstance(_val, TreeNode):
                            _root_tree_ref = _val
                elif _param.name == 'lists' or re.search(r'(?:List|list)\\s*\\[.*ListNode', _ann):
                    _val = [_to_list_node(_x) for _x in _val] if isinstance(_val, list) else []
                elif 'ListNode' in _ann or _param.name in ('head', 'headA', 'headB', 'list1', 'list2', 'l1', 'l2'):
                    _pos = _scope.get('pos', -1) if _param.name == 'head' else -1
                    if isinstance(_val, list) and _val and isinstance(_val[0], list):
                        _val = [_to_list_node(_x) for _x in _val]
                    else:
                        _val = _to_list_node(_val, _pos)
                _args.append(_val)

            _res = _target_method(*_args)
            _ret_ann = str(_sig.return_annotation) if _sig.return_annotation is not inspect.Signature.empty else ''

            if _res is None and ('None' in _ret_ann or _slug in ('walls-and-gates', 'merge-sorted-array', 'reorder-list', 'reverse-string', 'rotate-array', 'rotate-image', 'set-matrix-zeroes', 'sort-colors', 'surrounded-regions')) and not ('TreeNode' in _ret_ann or 'ListNode' in _ret_ann):
                _res = _args[0] if _args else None

            if _slug == 'clone-graph':
                print(json.dumps(_from_graph_node(_res)))
            elif _slug == 'copy-list-with-random-pointer':
                print(json.dumps(_from_random_list(_res)))
            elif _slug == 'construct-quad-tree':
                print(json.dumps(_from_quad_tree(_res)))
            elif _slug == 'lowest-common-ancestor-of-a-binary-search-tree' and isinstance(_res, TreeNode):
                print(_res.val)
            elif isinstance(_res, TreeNode):
                print(json.dumps(_from_tree_node(_res)))
            elif isinstance(_res, ListNode):
                print(json.dumps(_from_list_node(_res)))
            elif _res is None and ('TreeNode' in _ret_ann or 'ListNode' in _ret_ann):
                print('[]')
            elif isinstance(_res, list):
                print(json.dumps(_res))
            else:
                print(_res)
    except Exception:
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    _dapcode_main()
""".formatted(cleanSlug.replace("\"", ""));
        return prefix + nodeDef + "\n" + code + runner;
    }


    private String wrapCpp(String slug, String code) {
        if (code.contains("int main")) {
            return code;
        }

        String uncommented = stripComments(code);
        StringBuilder nodeDefs = new StringBuilder();
        if (!uncommented.contains("struct ListNode") && !uncommented.contains("class ListNode")) {
            nodeDefs.append("""
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
""");
        }
        if (!uncommented.contains("struct TreeNode") && !uncommented.contains("class TreeNode")) {
            nodeDefs.append("""
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
""");
        }

        String headers = """
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <cmath>
#include <queue>
#include <stack>
#include <map>
#include <set>

using namespace std;

""" + nodeDefs + """
static vector<int> parseVectorInt(const string& s) {
    vector<int> res;
    size_t start = s.find('[');
    size_t end = s.find(']', start);
    if (start == string::npos || end == string::npos) return res;
    string sub = s.substr(start + 1, end - start - 1);
    stringstream ss(sub);
    string token;
    while (getline(ss, token, ',')) {
        while (!token.empty() && isspace((unsigned char)token.front())) token.erase(token.begin());
        while (!token.empty() && isspace((unsigned char)token.back())) token.pop_back();
        if (!token.empty()) res.push_back(stoi(token));
    }
    return res;
}

static ListNode* parseListNode(const string& s) {
    vector<int> vals = parseVectorInt(s);
    ListNode dummy(0);
    ListNode* curr = &dummy;
    for (int v : vals) {
        curr->next = new ListNode(v);
        curr = curr->next;
    }
    return dummy.next;
}

static TreeNode* parseTreeNode(const string& s) {
    size_t start = s.find('[');
    size_t end = s.find(']', start);
    if (start == string::npos || end == string::npos) return nullptr;
    string sub = s.substr(start + 1, end - start - 1);
    vector<string> tokens;
    stringstream ss(sub);
    string token;
    while (getline(ss, token, ',')) {
        while (!token.empty() && isspace((unsigned char)token.front())) token.erase(token.begin());
        while (!token.empty() && isspace((unsigned char)token.back())) token.pop_back();
        if (!token.empty()) tokens.push_back(token);
    }
    if (tokens.empty() || tokens[0] == "null" || tokens[0] == "None") return nullptr;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    size_t idx = 1;
    while (!q.empty() && idx < tokens.size()) {
        TreeNode* curr = q.front();
        q.pop();
        if (idx < tokens.size()) {
            string t = tokens[idx++];
            if (t != "null" && t != "None") {
                curr->left = new TreeNode(stoi(t));
                q.push(curr->left);
            }
        }
        if (idx < tokens.size()) {
            string t = tokens[idx++];
            if (t != "null" && t != "None") {
                curr->right = new TreeNode(stoi(t));
                q.push(curr->right);
            }
        }
    }
    return root;
}

static int parseIntAfter(const string& s, const string& key) {
    size_t pos = s.find(key);
    if (pos == string::npos) {
        stringstream ss(s);
        int val;
        if (ss >> val) return val;
        return 0;
    }
    size_t eq = s.find('=', pos);
    if (eq == string::npos) return 0;
    return stoi(s.substr(eq + 1));
}

static string parseStringAfter(const string& s, const string& key) {
    size_t pos = s.find(key);
    size_t q1 = s.find('"', pos == string::npos ? 0 : pos);
    if (q1 == string::npos) return "";
    size_t q2 = s.find('"', q1 + 1);
    if (q2 == string::npos) return "";
    return s.substr(q1 + 1, q2 - q1 - 1);
}

static void printResult(const vector<int>& res) {
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i] << (i + 1 < res.size() ? ", " : "");
    }
    cout << "]";
}

static void printResult(const vector<string>& res) {
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        cout << "\\"" << res[i] << "\\"" << (i + 1 < res.size() ? ", " : "");
    }
    cout << "]";
}

static void printResult(const vector<vector<int>>& res) {
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        printResult(res[i]);
        if (i + 1 < res.size()) cout << ", ";
    }
    cout << "]";
}

static void printResult(const vector<vector<string>>& res) {
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        printResult(res[i]);
        if (i + 1 < res.size()) cout << ", ";
    }
    cout << "]";
}

static vector<string> parseVectorString(const string& s) {
    vector<string> res;
    size_t start = s.find('[');
    size_t end = s.rfind(']');
    if (start == string::npos || end == string::npos || start >= end) return res;
    string sub = s.substr(start + 1, end - start - 1);
    size_t p = 0;
    while ((p = sub.find('"', p)) != string::npos) {
        size_t q = sub.find('"', p + 1);
        if (q == string::npos) break;
        res.push_back(sub.substr(p + 1, q - p - 1));
        p = q + 1;
    }
    return res;
}

static void printResult(ListNode* head) {
    cout << "[";
    bool first = true;
    while (head) {
        if (!first) cout << ", ";
        cout << head->val;
        first = false;
        head = head->next;
    }
    cout << "]";
}

static void printResult(TreeNode* root) {
    if (!root) {
        cout << "[]";
        return;
    }
    vector<string> out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* curr = q.front();
        q.pop();
        if (!curr) {
            out.push_back("null");
        } else {
            out.push_back(to_string(curr->val));
            q.push(curr->left);
            q.push(curr->right);
        }
    }
    while (!out.empty() && out.back() == "null") {
        out.pop_back();
    }
    cout << "[";
    for (size_t i = 0; i < out.size(); i++) {
        cout << out[i] << (i + 1 < out.size() ? ", " : "");
    }
    cout << "]";
}

static void printResult(bool b) {
    cout << (b ? "True" : "False");
}

static void printResult(int x) {
    cout << x;
}

static void printResult(long long x) {
    cout << x;
}

static void printResult(double x) {
    cout << x;
}

static void printResult(const string& s) {
    cout << s;
}

static void printResult(const vector<char>& res) {
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        cout << "\\"" << res[i] << "\\"" << (i + 1 < res.size() ? ", " : "");
    }
    cout << "]";
}

static string extractRhs(const string& part) {
    size_t eq = part.find('=');
    string s = (eq == string::npos) ? part : part.substr(eq + 1);
    while (!s.empty() && isspace((unsigned char)s.front())) s.erase(s.begin());
    while (!s.empty() && isspace((unsigned char)s.back())) s.pop_back();
    return s;
}

static int parseIntVal(const string& part) {
    string s = extractRhs(part);
    stringstream ss(s);
    int v = 0;
    ss >> v;
    return v;
}

static string parseStringVal(const string& part) {
    string s = extractRhs(part);
    size_t q1 = s.find('"');
    if (q1 != string::npos) {
        size_t q2 = s.find('"', q1 + 1);
        if (q2 != string::npos) return s.substr(q1 + 1, q2 - q1 - 1);
    }
    return s;
}

static vector<vector<int>> parseVector2DInt(const string& part) {
    vector<vector<int>> res;
    string s = extractRhs(part);
    size_t outerStart = s.find('[');
    size_t outerEnd = s.rfind(']');
    if (outerStart == string::npos || outerEnd == string::npos || outerStart >= outerEnd) return res;
    string inner = s.substr(outerStart + 1, outerEnd - outerStart - 1);
    size_t pos = 0;
    while ((pos = inner.find('[', pos)) != string::npos) {
        size_t close = inner.find(']', pos);
        if (close == string::npos) break;
        res.push_back(parseVectorInt(inner.substr(pos, close - pos + 1)));
        pos = close + 1;
    }
    return res;
}

static vector<char> parseVectorChar(const string& part) {
    vector<char> res;
    vector<string> strs = parseVectorString(part);
    for (const string& st : strs) {
        if (!st.empty()) res.push_back(st[0]);
    }
    return res;
}

static vector<string> readInputParts() {
    vector<string> lines;
    string l;
    while (getline(cin, l)) {
        while (!l.empty() && isspace((unsigned char)l.back())) l.pop_back();
        if (!l.empty()) lines.push_back(l);
    }
    if (lines.empty()) return {};
    if (lines.size() > 1) return lines;
    const string& line = lines[0];
    vector<string> parts;
    int depth = 0;
    bool inQuotes = false;
    size_t start = 0;
    for (size_t i = 0; i < line.size(); i++) {
        char c = line[i];
        if (c == '"' && (i == 0 || line[i - 1] != '\\\\')) inQuotes = !inQuotes;
        if (!inQuotes) {
            if (c == '[' || c == '{' || c == '(') depth++;
            else if (c == ']' || c == '}' || c == ')') depth--;
            else if (c == ',' && depth == 0) {
                parts.push_back(line.substr(start, i - start));
                start = i + 1;
            }
        }
    }
    if (start < line.size()) parts.push_back(line.substr(start));
    return parts;
}
""";

        String driver = buildCppDriver(slug, code);
        return headers + "\n" + code + "\n" + driver;
    }

    private String buildCppDriver(String slug, String code) {
        String cleanSlug = slug != null ? slug.toLowerCase().trim() : "";

        if ("design-hashset".equals(cleanSlug)) {
            return """
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line1, line2;
    if (!getline(cin, line1) || !getline(cin, line2)) return 0;

    vector<string> cmds;
    size_t p = 0;
    while ((p = line1.find('\"', p)) != string::npos) {
        size_t q = line1.find('\"', p + 1);
        if (q == string::npos) break;
        cmds.push_back(line1.substr(p + 1, q - p - 1));
        p = q + 1;
    }

    vector<int> args;
    size_t b = 0;
    while ((b = line2.find('[', b + 1)) != string::npos) {
        size_t c = line2.find(']', b);
        if (c == string::npos) break;
        string inner = line2.substr(b + 1, c - b - 1);
        stringstream ss(inner);
        int val = 0;
        if (ss >> val) args.push_back(val);
        else args.push_back(-1);
        b = c;
    }

    MyHashSet* set = nullptr;
    cout << "[";
    for (size_t i = 0; i < cmds.size(); i++) {
        if (i > 0) cout << ", ";
        if (cmds[i] == "MyHashSet") {
            set = new MyHashSet();
            cout << "null";
        } else if (cmds[i] == "add") {
            if (set && i < args.size()) set->add(args[i]);
            cout << "null";
        } else if (cmds[i] == "remove") {
            if (set && i < args.size()) set->remove(args[i]);
            cout << "null";
        } else if (cmds[i] == "contains") {
            if (set && i < args.size()) {
                cout << (set->contains(args[i]) ? "true" : "false");
            } else {
                cout << "false";
            }
        }
    }
    cout << "]" << endl;
    return 0;
}
""";
        }

        if ("two-sum".equals(cleanSlug)) {
            String method = matchMethod(code, "twoSum", "TwoSum", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> nums = parseVectorInt(line);
    int target = parseIntAfter(line, "target");
    Solution sol;
    printResult(sol.%s(nums, target));
    return 0;
}
""", method);
        }

        if ("concatenation-of-array".equals(cleanSlug)) {
            String method = matchMethod(code, "getConcatenation", "conArr", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> nums = parseVectorInt(line);
    Solution sol;
    printResult(sol.%s(nums));
    return 0;
}
""", method);
        }

        if ("contains-duplicate".equals(cleanSlug)) {
            String method = matchMethod(code, "containsDuplicate", "ContainsDuplicate", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> nums = parseVectorInt(line);
    Solution sol;
    printResult(sol.%s(nums));
    return 0;
}
""", method);
        }

        if ("valid-anagram".equals(cleanSlug)) {
            String method = matchMethod(code, "isAnagram", "IsAnagram", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    string s = parseStringAfter(line, "s");
    string t = parseStringAfter(line, "t");
    Solution sol;
    printResult(sol.%s(s, t));
    return 0;
}
""", method);
        }

        if ("binary-search".equals(cleanSlug)) {
            String method = matchMethod(code, "search", "Search", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> nums = parseVectorInt(line);
    int target = parseIntAfter(line, "target");
    Solution sol;
    printResult(sol.%s(nums, target));
    return 0;
}
""", method);
        }

        if ("best-time-to-buy-and-sell-stock".equals(cleanSlug)) {
            String method = matchMethod(code, "maxProfit", "MaxProfit", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> prices = parseVectorInt(line);
    Solution sol;
    printResult(sol.%s(prices));
    return 0;
}
""", method);
        }

        if ("valid-parentheses".equals(cleanSlug)) {
            String method = matchMethod(code, "isValid", "IsValid", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    string s = parseStringAfter(line, "s");
    if (s.empty()) {
        size_t q1 = line.find('"');
        if (q1 != string::npos) {
            size_t q2 = line.find('"', q1 + 1);
            if (q2 != string::npos) s = line.substr(q1 + 1, q2 - q1 - 1);
        }
    }
    Solution sol;
    printResult(sol.%s(s));
    return 0;
}
""", method);
        }

        if ("generate-parentheses".equals(cleanSlug)) {
            String method = matchMethod(code, "generateParenthesis", "GenerateParenthesis", "solve");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    int n = parseIntAfter(line, "n");
    Solution sol;
    printResult(sol.%s(n));
    return 0;
}
""", method);
        }

        String autoMethod = findFirstMethodName(code);
        String params = extractParams(code);
        boolean isVoidReturn = stripComments(code).matches("(?s).*\\bvoid\\s+" + Pattern.quote(autoMethod) + "\\s*\\(.*");

        if (!isVoidReturn && params.contains("vector<int>") && (params.contains("target") || params.contains("int k"))) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> nums = parseVectorInt(line);
    int target = parseIntAfter(line, "target");
    if (target == 0 && line.find("k") != string::npos) target = parseIntAfter(line, "k");
    Solution sol;
    printResult(sol.%s(nums, target));
    return 0;
}
""", autoMethod);
        }

        if (!isVoidReturn && params.contains("vector<string>") && !params.contains(",")) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<string> strs = parseVectorString(line);
    Solution sol;
    printResult(sol.%s(strs));
    return 0;
}
""", autoMethod);
        }

        if (!isVoidReturn && params.contains("vector<int>") && !params.contains(",") && !params.contains("vector<vector")) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> nums = parseVectorInt(line);
    Solution sol;
    printResult(sol.%s(nums));
    return 0;
}
""", autoMethod);
        }

        if (!isVoidReturn && params.contains("string") && params.contains(",") && !params.contains("vector")) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    string s = parseStringAfter(line, "s");
    string t = parseStringAfter(line, "t");
    Solution sol;
    printResult(sol.%s(s, t));
    return 0;
}
""", autoMethod);
        }

        if (!isVoidReturn && params.contains("string") && !params.contains(",") && !params.contains("vector")) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    string s = parseStringAfter(line, "s");
    if (s.empty()) {
        size_t q1 = line.find('"');
        if (q1 != string::npos) {
            size_t q2 = line.find('"', q1 + 1);
            if (q2 != string::npos) s = line.substr(q1 + 1, q2 - q1 - 1);
        }
    }
    Solution sol;
    printResult(sol.%s(s));
    return 0;
}
""", autoMethod);
        }

        if (!isVoidReturn && params.contains("TreeNode") && !params.contains(",")) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    TreeNode* root = parseTreeNode(line);
    Solution sol;
    printResult(sol.%s(root));
    return 0;
}
""", autoMethod);
        }

        if (!isVoidReturn && params.contains("ListNode") && !params.contains(",")) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    ListNode* head = parseListNode(line);
    Solution sol;
    printResult(sol.%s(head));
    return 0;
}
""", autoMethod);
        }

        if (!isVoidReturn && params.contains("int") && !params.contains(",") && !params.contains("vector")) {
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    int n = parseIntAfter(line, "n");
    Solution sol;
    printResult(sol.%s(n));
    return 0;
}
""", autoMethod);
        }

        if (!params.isBlank()) {
            String[] paramDecls = params.split(",");
            StringBuilder decls = new StringBuilder();
            java.util.List<String> argNames = new java.util.ArrayList<>();
            for (int i = 0; i < paramDecls.length; i++) {
                String p = paramDecls[i].trim();
                String arg = "arg" + i;
                argNames.add(arg);
                String partExpr = String.format("(parts.size() > %d ? parts[%d] : \"\")", i, i);
                if (p.contains("vector<vector<int>>")) {
                    decls.append("    vector<vector<int>> ").append(arg).append(" = parseVector2DInt(").append(partExpr).append(");\n");
                } else if (p.contains("vector<string>")) {
                    decls.append("    vector<string> ").append(arg).append(" = parseVectorString(").append(partExpr).append(");\n");
                } else if (p.contains("vector<char>")) {
                    decls.append("    vector<char> ").append(arg).append(" = parseVectorChar(").append(partExpr).append(");\n");
                } else if (p.contains("vector<int>")) {
                    decls.append("    vector<int> ").append(arg).append(" = parseVectorInt(").append(partExpr).append(");\n");
                } else if (p.contains("TreeNode")) {
                    decls.append("    TreeNode* ").append(arg).append(" = parseTreeNode(").append(partExpr).append(");\n");
                } else if (p.contains("ListNode")) {
                    decls.append("    ListNode* ").append(arg).append(" = parseListNode(").append(partExpr).append(");\n");
                } else if (p.contains("string")) {
                    decls.append("    string ").append(arg).append(" = parseStringVal(").append(partExpr).append(");\n");
                } else if (p.contains("double")) {
                    decls.append("    double ").append(arg).append(" = stod(extractRhs(").append(partExpr).append("));\n");
                } else {
                    decls.append("    int ").append(arg).append(" = parseIntVal(").append(partExpr).append(");\n");
                }
            }
            String callExpr = "sol." + autoMethod + "(" + String.join(", ", argNames) + ")";
            String execBlock = isVoidReturn
                    ? ("    " + callExpr + ";\n    printResult(arg0);")
                    : ("    printResult(" + callExpr + ");");
            return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    vector<string> parts = readInputParts();
    if (parts.empty()) return 0;
%s    Solution sol;
%s
    return 0;
}
""", decls.toString(), execBlock);
        }

        return String.format("""
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    Solution sol;
    printResult(sol.%s());
    return 0;
}
""", autoMethod != null ? autoMethod : "solve");
    }

    private String wrapJava(String slug, String code) {
        if (code.contains("public static void main")) {
            return code;
        }

        if (isDesignProblem(slug, code)) {
            return wrapJavaDesign(code);
        }

        return wrapJavaStandard(slug, code);
    }

    private String wrapJavaDesign(String code) {
        return """
import java.util.*;
import java.io.*;
import java.lang.reflect.*;

""" + code + """

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\\n");
        }
        String rawInput = sb.toString().trim();
        if (rawInput.isEmpty()) return;

        List<String> topArrays = parseTopLevelArrays(rawInput);
        if (topArrays.size() < 2) return;

        List<String> rawCommands = parseArrayTokens(topArrays.get(0));
        List<String> rawArgsList = parseArrayTokens(topArrays.get(1));

        List<String> commands = new ArrayList<>();
        for (String c : rawCommands) {
            commands.add(c.replaceAll("^[\\"']|[\\"']$", "").trim());
        }
        if (commands.isEmpty()) return;

        String className = commands.get(0);
        Class<?> clazz = Class.forName(className);

        List<String> ctorRawArgs = parseArrayTokens(rawArgsList.get(0));
        Constructor<?> targetCtor = null;
        for (Constructor<?> c : clazz.getDeclaredConstructors()) {
            if (c.getParameterCount() == ctorRawArgs.size()) {
                targetCtor = c;
                break;
            }
        }
        if (targetCtor == null) {
            Constructor<?>[] ctors = clazz.getDeclaredConstructors();
            if (ctors.length > 0) targetCtor = ctors[0];
            else return;
        }
        targetCtor.setAccessible(true);
        Class<?>[] ctorParamTypes = targetCtor.getParameterTypes();
        Type[] ctorGenTypes = targetCtor.getGenericParameterTypes();
        Object[] ctorArgs = new Object[ctorParamTypes.length];
        for (int i = 0; i < ctorParamTypes.length; i++) {
            ctorArgs[i] = parseArg(i < ctorRawArgs.size() ? ctorRawArgs.get(i) : "", ctorParamTypes[i], ctorGenTypes[i]);
        }
        Object instance = targetCtor.newInstance(ctorArgs);

        List<String> results = new ArrayList<>();
        results.add("null");

        for (int i = 1; i < commands.size(); i++) {
            String methodName = commands.get(i);
            String rawArgStr = i < rawArgsList.size() ? rawArgsList.get(i) : "[]";
            List<String> methodRawArgs = parseArrayTokens(rawArgStr);

            Method targetMethod = null;
            for (Method m : clazz.getDeclaredMethods()) {
                if (m.getName().equals(methodName) && m.getParameterCount() == methodRawArgs.size()) {
                    targetMethod = m;
                    break;
                }
            }
            if (targetMethod == null) {
                for (Method m : clazz.getDeclaredMethods()) {
                    if (m.getName().equalsIgnoreCase(methodName)) {
                        targetMethod = m;
                        break;
                    }
                }
            }
            if (targetMethod == null) {
                results.add("null");
                continue;
            }
            targetMethod.setAccessible(true);
            Class<?>[] pTypes = targetMethod.getParameterTypes();
            Type[] gpTypes = targetMethod.getGenericParameterTypes();
            Object[] mArgs = new Object[pTypes.length];
            for (int j = 0; j < pTypes.length; j++) {
                mArgs[j] = parseArg(j < methodRawArgs.size() ? methodRawArgs.get(j) : "", pTypes[j], gpTypes[j]);
            }

            Object ret = targetMethod.invoke(instance, mArgs);
            if (targetMethod.getReturnType().equals(void.class)) {
                results.add("null");
            } else {
                results.add(formatDesignResult(ret));
            }
        }

        StringBuilder out = new StringBuilder("[");
        for (int i = 0; i < results.size(); i++) {
            out.append(results.get(i));
            if (i < results.size() - 1) out.append(", ");
        }
        out.append("]");
        System.out.println(out.toString());
    }

    private static List<String> parseTopLevelArrays(String s) {
        List<String> res = new ArrayList<>();
        int depth = 0;
        int start = -1;
        boolean inQuotes = false;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"' && (i == 0 || s.charAt(i - 1) != '\\\\')) {
                inQuotes = !inQuotes;
            }
            if (!inQuotes) {
                if (c == '[') {
                    if (depth == 0) start = i;
                    depth++;
                } else if (c == ']') {
                    depth--;
                    if (depth == 0 && start != -1) {
                        res.add(s.substring(start, i + 1).trim());
                        start = -1;
                    }
                }
            }
        }
        return res;
    }

    private static List<String> parseArrayTokens(String s) {
        List<String> list = new ArrayList<>();
        if (s == null) return list;
        s = s.trim();
        int startBracket = s.indexOf('[');
        int endBracket = s.lastIndexOf(']');
        if (startBracket == -1 || endBracket == -1 || startBracket >= endBracket) return list;
        String inner = s.substring(startBracket + 1, endBracket).trim();
        if (inner.isEmpty()) return list;

        int depth = 0;
        boolean inQuotes = false;
        StringBuilder current = new StringBuilder();
        for (int i = 0; i < inner.length(); i++) {
            char c = inner.charAt(i);
            if (c == '"' && (i == 0 || inner.charAt(i - 1) != '\\\\')) {
                inQuotes = !inQuotes;
                current.append(c);
            } else if (!inQuotes && (c == '[' || c == '{')) {
                depth++;
                current.append(c);
            } else if (!inQuotes && (c == ']' || c == '}')) {
                depth--;
                current.append(c);
            } else if (!inQuotes && c == ',' && depth == 0) {
                if (current.length() > 0) {
                    list.add(current.toString().trim());
                    current.setLength(0);
                }
            } else {
                current.append(c);
            }
        }
        if (current.length() > 0) {
            list.add(current.toString().trim());
        }
        return list;
    }

    private static Object parseArg(String s, Class<?> type, Type genericType) {
        if (s == null) return null;
        s = s.trim();
        if (type == int.class || type == Integer.class) {
            String digits = s.replaceAll("[^0-9-]", "");
            return digits.isEmpty() ? 0 : Integer.parseInt(digits);
        }
        if (type == long.class || type == Long.class) {
            String digits = s.replaceAll("[^0-9-]", "");
            return digits.isEmpty() ? 0L : Long.parseLong(digits);
        }
        if (type == double.class || type == Double.class) {
            String digits = s.replaceAll("[^0-9.-]", "");
            return digits.isEmpty() ? 0.0 : Double.parseDouble(digits);
        }
        if (type == boolean.class || type == Boolean.class) {
            return s.equalsIgnoreCase("true") || s.equals("1");
        }
        if (type == char.class || type == Character.class) {
            s = s.replaceAll("^['\\"]|['\\"]$", "");
            return s.isEmpty() ? ' ' : s.charAt(0);
        }
        if (type == String.class) {
            if (s.startsWith("\\"") && s.endsWith("\\"") && s.length() >= 2) {
                return s.substring(1, s.length() - 1);
            }
            return s;
        }
        if (type == int[].class) {
            List<String> tokens = parseArrayTokens(s);
            int[] arr = new int[tokens.size()];
            for (int i = 0; i < tokens.size(); i++) {
                String d = tokens.get(i).replaceAll("[^0-9-]", "");
                arr[i] = d.isEmpty() ? 0 : Integer.parseInt(d);
            }
            return arr;
        }
        if (type == int[][].class) {
            List<String> rows = parseArrayTokens(s);
            int[][] arr = new int[rows.size()][];
            for (int i = 0; i < rows.size(); i++) {
                arr[i] = (int[]) parseArg(rows.get(i), int[].class, int[].class);
            }
            return arr;
        }
        return s;
    }

    private static String formatDesignResult(Object res) {
        if (res == null) return "null";
        if (res instanceof Boolean) return res.toString().toLowerCase();
        if (res instanceof String) return "\\"" + res + "\\"";
        if (res instanceof int[]) return Arrays.toString((int[]) res);
        if (res instanceof double[] || res instanceof Double) return String.valueOf(res);
        if (res instanceof Object[]) return Arrays.deepToString((Object[]) res);
        return res.toString();
    }
}
""";
    }

    private String wrapJavaStandard(String slug, String code) {
        String cleanSlug = slug != null ? slug.toLowerCase().trim() : "";
        String uncommented = stripComments(code);
        String sanitizedCode = code.replaceAll("\\bpublic\\s+class\\s+(?!Main\\b)", "class ");
        StringBuilder helpers = new StringBuilder();
        if (!uncommented.contains("class ListNode")) {
            helpers.append("""
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
""");
        }
        if (!uncommented.contains("class TreeNode")) {
            helpers.append("""
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
""");
        }
        if (!uncommented.contains("class GuessGame")) {
            helpers.append("""
class GuessGame {
    public static int PICK = 0;
    public int guess(int num) {
        if (num > PICK) return -1;
        if (num < PICK) return 1;
        return 0;
    }
}
""");
        }
        if (!uncommented.contains("interface MountainArray") && !uncommented.contains("class MountainArray")) {
            helpers.append("""
interface MountainArray {
    int get(int index);
    int length();
}
class MountainArrayImpl implements MountainArray {
    private final int[] arr;
    MountainArrayImpl(int[] arr) { this.arr = arr; }
    public int get(int index) { return arr[index]; }
    public int length() { return arr.length; }
}
""");
        }

        return """
import java.util.*;
import java.io.*;
import java.lang.reflect.*;

""" + helpers + "\n" + sanitizedCode + """

public class Main {
    private static final String SLUG = "%s";
    private static int POS_CYCLE = -1;

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\\n");
        }
        String rawInput = sb.toString().trim();

        if ("serialize-and-deserialize-binary-tree".equals(SLUG)) {
            Class<?> codecClass = Class.forName("Codec");
            Object ser = codecClass.getDeclaredConstructor().newInstance();
            Object deser = codecClass.getDeclaredConstructor().newInstance();
            Method serM = codecClass.getDeclaredMethod("serialize", TreeNode.class);
            Method deserM = codecClass.getDeclaredMethod("deserialize", String.class);
            serM.setAccessible(true);
            deserM.setAccessible(true);
            List<String> rawVals = extractRawArgs(rawInput, new Parameter[0]);
            TreeNode root = (TreeNode) parseArg(rawVals.isEmpty() ? "[]" : rawVals.get(0), TreeNode.class, TreeNode.class);
            String data = (String) serM.invoke(ser, root);
            Object ans = deserM.invoke(deser, data);
            printResult(ans);
            return;
        }

        Class<?> solClass = Solution.class;
        if ("encode-and-decode-strings".equals(SLUG)) {
            Object sol = solClass.getDeclaredConstructor().newInstance();
            Method encM = null, decM = null;
            for (Method m : solClass.getDeclaredMethods()) {
                if (m.getName().equals("encode")) encM = m;
                if (m.getName().equals("decode")) decM = m;
            }
            if (encM != null && decM != null) {
                encM.setAccessible(true);
                decM.setAccessible(true);
                List<String> rawVals = extractRawArgs(rawInput, encM.getParameters());
                Object arg0 = parseArg(rawVals.isEmpty() ? "[]" : rawVals.get(0), encM.getParameterTypes()[0], encM.getGenericParameterTypes()[0]);
                Object encoded = encM.invoke(sol, arg0);
                Object decoded = decM.invoke(sol, encoded);
                printResult(decoded);
                return;
            }
        }

        Method targetMethod = null;
        for (Method m : solClass.getDeclaredMethods()) {
            if (Modifier.isPublic(m.getModifiers()) && !m.getName().startsWith("_")) {
                targetMethod = m;
                break;
            }
        }
        if (targetMethod == null) {
            Method[] methods = solClass.getDeclaredMethods();
            if (methods.length > 0) targetMethod = methods[0];
            else return;
        }
        targetMethod.setAccessible(true);

        Class<?>[] paramTypes = targetMethod.getParameterTypes();
        Type[] genericParamTypes = targetMethod.getGenericParameterTypes();
        Parameter[] parameters = targetMethod.getParameters();

        List<String> rawArgValues = extractRawArgs(rawInput, parameters);

        Object[] invokeArgs = new Object[paramTypes.length];
        for (int i = 0; i < paramTypes.length; i++) {
            String rawVal = i < rawArgValues.size() ? rawArgValues.get(i) : "";
            invokeArgs[i] = parseArg(rawVal, paramTypes[i], genericParamTypes[i]);
        }

        Solution sol = new Solution();
        Object result = targetMethod.invoke(sol, invokeArgs);

        if (targetMethod.getReturnType().equals(void.class)) {
            result = invokeArgs.length > 0 ? invokeArgs[0] : null;
        }

        printResult(result);
    }

    private static List<String> extractRawArgs(String rawInput, Parameter[] parameters) {
        List<String> list = new ArrayList<>();
        if (rawInput == null || rawInput.isBlank()) return list;

        if (rawInput.matches("(?s).*?\\\\b[a-zA-Z_][a-zA-Z0-9_]*\\\\s*=.*")) {
            String[] parts = rawInput.split("(?:,|\\\\r?\\\\n)\\\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\\\s*=)");
            Map<String, String> map = new LinkedHashMap<>();
            for (String p : parts) {
                int eq = p.indexOf('=');
                if (eq != -1) {
                    map.put(p.substring(0, eq).trim(), p.substring(eq + 1).trim());
                }
            }
            if (map.containsKey("pick")) {
                try {
                    GuessGame.PICK = Integer.parseInt(map.get("pick").replaceAll("[^0-9-]", ""));
                } catch (Exception ignored) {}
            }
            if (map.containsKey("pos")) {
                try {
                    POS_CYCLE = Integer.parseInt(map.get("pos").replaceAll("[^0-9-]", ""));
                } catch (Exception ignored) {}
            }
            boolean matchedAllByName = true;
            for (Parameter param : parameters) {
                if (!param.isNamePresent() || !map.containsKey(param.getName())) {
                    matchedAllByName = false;
                    break;
                }
            }
            if (matchedAllByName && parameters.length > 0) {
                for (Parameter param : parameters) {
                    list.add(map.get(param.getName()));
                }
            } else {
                list.addAll(map.values());
            }
        } else {
            String[] lines = rawInput.split("\\\\r?\\\\n");
            for (String l : lines) {
                if (!l.trim().isEmpty()) list.add(l.trim());
            }
        }
        return list;
    }

    private static Object parseArg(String s, Class<?> type, Type genericType) {
        if (s == null) return null;
        s = s.trim();
        if (type == int.class || type == Integer.class) {
            String digits = s.replaceAll("[^0-9-]", "");
            return digits.isEmpty() ? 0 : (int) Long.parseLong(digits);
        }
        if (type == long.class || type == Long.class) {
            String digits = s.replaceAll("[^0-9-]", "");
            return digits.isEmpty() ? 0L : Long.parseLong(digits);
        }
        if (type == double.class || type == Double.class) {
            String digits = s.replaceAll("[^0-9.-]", "");
            return digits.isEmpty() ? 0.0 : Double.parseDouble(digits);
        }
        if (type == boolean.class || type == Boolean.class) {
            return s.equalsIgnoreCase("true") || s.equals("1");
        }
        if (type == char.class || type == Character.class) {
            s = s.replaceAll("^['\\\"]|['\\\"]$", "");
            return s.isEmpty() ? ' ' : s.charAt(0);
        }
        if (type == String.class) {
            if (s.startsWith("\\\"") && s.endsWith("\\\"") && s.length() >= 2) {
                return s.substring(1, s.length() - 1);
            }
            return s;
        }
        if (type == int[].class) {
            List<String> tokens = parseArrayTokens(s);
            int[] arr = new int[tokens.size()];
            for (int i = 0; i < tokens.size(); i++) {
                String d = tokens.get(i).replaceAll("[^0-9-]", "");
                arr[i] = d.isEmpty() ? 0 : Integer.parseInt(d);
            }
            return arr;
        }
        if (type == int[][].class) {
            List<String> rows = parseArrayTokens(s);
            int[][] arr = new int[rows.size()][];
            for (int i = 0; i < rows.size(); i++) {
                arr[i] = (int[]) parseArg(rows.get(i), int[].class, int[].class);
            }
            return arr;
        }
        if (type == char[].class) {
            List<String> tokens = parseArrayTokens(s);
            char[] arr = new char[tokens.size()];
            for (int i = 0; i < tokens.size(); i++) {
                String t = tokens.get(i).replaceAll("^['\\\"]|['\\\"]$", "");
                arr[i] = t.isEmpty() ? ' ' : t.charAt(0);
            }
            return arr;
        }
        if (type == char[][].class) {
            List<String> rows = parseArrayTokens(s);
            char[][] arr = new char[rows.size()][];
            for (int i = 0; i < rows.size(); i++) {
                arr[i] = (char[]) parseArg(rows.get(i), char[].class, char[].class);
            }
            return arr;
        }
        if (type == String[].class) {
            List<String> tokens = parseArrayTokens(s);
            String[] arr = new String[tokens.size()];
            for (int i = 0; i < tokens.size(); i++) {
                String t = tokens.get(i).trim();
                if (t.startsWith("\\\"") && t.endsWith("\\\"") && t.length() >= 2) t = t.substring(1, t.length() - 1);
                arr[i] = t;
            }
            return arr;
        }
        if (type.getSimpleName().equals("MountainArray")) {
            int[] arr = (int[]) parseArg(s, int[].class, int[].class);
            return new MountainArrayImpl(arr);
        }
        if (type.getSimpleName().equals("ListNode[]")) {
            List<String> rows = parseArrayTokens(s);
            ListNode[] arr = new ListNode[rows.size()];
            for (int i = 0; i < rows.size(); i++) {
                arr[i] = (ListNode) parseArg(rows.get(i), ListNode.class, ListNode.class);
            }
            return arr;
        }
        if (List.class.isAssignableFrom(type)) {
            List<String> tokens = parseArrayTokens(s);
            if (!tokens.isEmpty() && tokens.get(0).trim().startsWith("[")) {
                List<Object> outer = new ArrayList<>();
                for (String row : tokens) {
                    outer.add(parseArg(row, List.class, null));
                }
                return outer;
            }
            List<Object> list = new ArrayList<>();
            for (String t : tokens) {
                t = t.trim();
                if (t.startsWith("\\\"") && t.endsWith("\\\"")) {
                    list.add(t.substring(1, t.length() - 1));
                } else if (t.equalsIgnoreCase("true") || t.equalsIgnoreCase("false")) {
                    list.add(Boolean.parseBoolean(t));
                } else {
                    try {
                        list.add(Integer.parseInt(t));
                    } catch (Exception e) {
                        list.add(t);
                    }
                }
            }
            return list;
        }
        if (type.getSimpleName().equals("ListNode")) {
            List<String> tokens = parseArrayTokens(s);
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            List<ListNode> nodes = new ArrayList<>();
            for (String t : tokens) {
                String d = t.replaceAll("[^0-9-]", "");
                if (!d.isEmpty()) {
                    curr.next = new ListNode(Integer.parseInt(d));
                    curr = curr.next;
                    nodes.add(curr);
                }
            }
            if (POS_CYCLE >= 0 && POS_CYCLE < nodes.size() && !nodes.isEmpty()) {
                nodes.get(nodes.size() - 1).next = nodes.get(POS_CYCLE);
            }
            return dummy.next;
        }
        if (type.getSimpleName().equals("TreeNode")) {
            if (!s.contains("[")) {
                String d = s.replaceAll("[^0-9-]", "");
                return d.isEmpty() ? null : new TreeNode(Integer.parseInt(d));
            }
            List<String> tokens = parseArrayTokens(s);
            if (tokens.isEmpty() || tokens.get(0).trim().equals("null")) return null;
            TreeNode root = new TreeNode(Integer.parseInt(tokens.get(0).replaceAll("[^0-9-]", "")));
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
            int idx = 1;
            while (!queue.isEmpty() && idx < tokens.size()) {
                TreeNode curr = queue.poll();
                if (idx < tokens.size()) {
                    String t = tokens.get(idx++).trim();
                    if (!t.equals("null")) {
                        curr.left = new TreeNode(Integer.parseInt(t.replaceAll("[^0-9-]", "")));
                        queue.offer(curr.left);
                    }
                }
                if (idx < tokens.size()) {
                    String t = tokens.get(idx++).trim();
                    if (!t.equals("null")) {
                        curr.right = new TreeNode(Integer.parseInt(t.replaceAll("[^0-9-]", "")));
                        queue.offer(curr.right);
                    }
                }
            }
            return root;
        }
        return s;
    }

    private static List<String> parseArrayTokens(String s) {
        List<String> list = new ArrayList<>();
        if (s == null) return list;
        s = s.trim();
        int startBracket = s.indexOf('[');
        int endBracket = s.lastIndexOf(']');
        if (startBracket == -1 || endBracket == -1 || startBracket >= endBracket) return list;
        String inner = s.substring(startBracket + 1, endBracket).trim();
        if (inner.isEmpty()) return list;

        int depth = 0;
        boolean inQuotes = false;
        StringBuilder current = new StringBuilder();
        for (int i = 0; i < inner.length(); i++) {
            char c = inner.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
                current.append(c);
            } else if (!inQuotes && (c == '[' || c == '{')) {
                depth++;
                current.append(c);
            } else if (!inQuotes && (c == ']' || c == '}')) {
                depth--;
                current.append(c);
            } else if (!inQuotes && c == ',' && depth == 0) {
                if (current.length() > 0) {
                    list.add(current.toString().trim());
                    current.setLength(0);
                }
            } else {
                current.append(c);
            }
        }
        if (current.length() > 0) {
            list.add(current.toString().trim());
        }
        return list;
    }

    private static void printResult(Object res) {
        if (res == null) {
            System.out.print("null");
        } else if (res instanceof Boolean) {
            System.out.print((Boolean) res ? "True" : "False");
        } else if (res instanceof int[]) {
            System.out.print(Arrays.toString((int[]) res));
        } else if (res instanceof long[]) {
            System.out.print(Arrays.toString((long[]) res));
        } else if (res instanceof double[]) {
            System.out.print(Arrays.toString((double[]) res));
        } else if (res instanceof char[]) {
            System.out.print(Arrays.toString((char[]) res));
        } else if (res instanceof Object[]) {
            System.out.print(Arrays.deepToString((Object[]) res));
        } else if (res instanceof List) {
            System.out.print(res.toString());
        } else if (res.getClass().getSimpleName().equals("ListNode")) {
            List<Integer> list = new ArrayList<>();
            try {
                Field valField = res.getClass().getDeclaredField("val");
                Field nextField = res.getClass().getDeclaredField("next");
                valField.setAccessible(true);
                nextField.setAccessible(true);
                Set<Object> visited = Collections.newSetFromMap(new IdentityHashMap<>());
                Object curr = res;
                while (curr != null && visited.add(curr)) {
                    list.add((Integer) valField.get(curr));
                    curr = nextField.get(curr);
                }
            } catch (Exception ignored) {}
            System.out.print(list.toString());
        } else if (res.getClass().getSimpleName().equals("TreeNode")) {
            try {
                Field valField = res.getClass().getDeclaredField("val");
                valField.setAccessible(true);
                if ("lowest-common-ancestor-of-a-binary-search-tree".equals(SLUG)) {
                    System.out.print(valField.get(res));
                    return;
                }
                Field leftField = res.getClass().getDeclaredField("left");
                Field rightField = res.getClass().getDeclaredField("right");
                leftField.setAccessible(true);
                rightField.setAccessible(true);

                List<String> list = new ArrayList<>();
                Queue<Object> q = new LinkedList<>();
                q.offer(res);
                while (!q.isEmpty()) {
                    Object curr = q.poll();
                    if (curr == null) {
                        list.add("null");
                    } else {
                        list.add(String.valueOf(valField.get(curr)));
                        q.offer(leftField.get(curr));
                        q.offer(rightField.get(curr));
                    }
                }
                while (!list.isEmpty() && list.get(list.size() - 1).equals("null")) {
                    list.remove(list.size() - 1);
                }
                System.out.print(list.toString());
            } catch (Exception ignored) {}
        } else {
            System.out.print(res.toString());
        }
    }
}
""".formatted(cleanSlug.replace("\"", ""));
    }

    private String matchMethod(String code, String... candidates) {
        for (String c : candidates) {
            Pattern pattern = Pattern.compile("(?i)\\b(" + c + ")\\b");
            Matcher m = pattern.matcher(code);
            if (m.find()) {
                return m.group(1);
            }
        }
        String auto = findFirstMethodName(code);
        if (auto != null && !"main".equals(auto)) {
            return auto;
        }
        return candidates.length > 0 ? candidates[0] : "solve";
    }

    private String findFirstMethodName(String code) {
        Pattern pattern = Pattern.compile("(?:vector\\s*<\\s*vector\\s*<[^>]+>\\s*>|vector\\s*<[^>]+>|TreeNode\\s*\\*|ListNode\\s*\\*|int\\[\\]|long\\s+long|double|int|bool|boolean|string|String|void)\\s+([a-zA-Z0-9_]+)\\s*\\(");
        Matcher m = pattern.matcher(stripComments(code));
        if (m.find()) {
            return m.group(1);
        }
        return "solve";
    }

    private String extractParams(String code) {
        Pattern pattern = Pattern.compile("(?:vector\\s*<\\s*vector\\s*<[^>]+>\\s*>|vector\\s*<[^>]+>|TreeNode\\s*\\*|ListNode\\s*\\*|int\\[\\]|long\\s+long|double|int|bool|boolean|string|String|void)\\s+[a-zA-Z0-9_]+\\s*\\(([^)]*)\\)");
        Matcher m = pattern.matcher(stripComments(code));
        if (m.find()) {
            return m.group(1).trim();
        }
        return "";
    }
}
