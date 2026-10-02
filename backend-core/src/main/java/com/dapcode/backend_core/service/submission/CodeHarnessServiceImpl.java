package com.dapcode.backend_core.service.submission;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class CodeHarnessServiceImpl implements CodeHarnessService {

    @Override
    public String prepareSourceCode(String slug, int languageId, String rawSourceCode) {
        if (rawSourceCode == null || rawSourceCode.isBlank()) {
            return rawSourceCode;
        }

        return switch (languageId) {
            case 71 -> wrapPython(rawSourceCode);
            case 54 -> wrapCpp(slug, rawSourceCode);
            case 62 -> wrapJava(slug, rawSourceCode);
            default -> rawSourceCode;
        };
    }

    private String wrapPython(String code) {
        if (code.contains("__main__")) {
            return code;
        }

        String prefix = """
from __future__ import annotations
from typing import *
import collections
import heapq
import math

""";

        String runner = """

if __name__ == '__main__':
    import sys, re, inspect, ast

    raw_input = sys.stdin.read().strip()
    if raw_input:
        parts = re.split(r',\\s*(?=[a-zA-Z_]\\w*\\s*=)', raw_input)
        scope = {}
        for p in parts:
            if '=' in p:
                k, v = p.split('=', 1)
                try:
                    scope[k.strip()] = ast.literal_eval(v.strip())
                except Exception:
                    try:
                        scope[k.strip()] = eval(v.strip(), {"true": True, "false": False, "null": None})
                    except Exception:
                        pass
        sol = Solution()
        methods = [name for name, fn in inspect.getmembers(sol, predicate=inspect.ismethod) if not name.startswith('_')]
        if methods:
            target_method = getattr(sol, methods[0])
            sig = inspect.signature(target_method)
            args = []
            for p in sig.parameters.values():
                if p.name in scope:
                    args.append(scope[p.name])
            if not args and scope:
                args = list(scope.values())
            res = target_method(*args)
            print(res)
""";
        return prefix + code + runner;
    }


    private String wrapCpp(String slug, String code) {
        if (code.contains("int main")) {
            return code;
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

static void printResult(bool b) {
    cout << (b ? "True" : "False");
}

static void printResult(int x) {
    cout << x;
}

static void printResult(const string& s) {
    cout << s;
}
""";

        String driver = buildCppDriver(slug, code);
        return headers + "\n" + code + "\n" + driver;
    }

    private String buildCppDriver(String slug, String code) {
        String cleanSlug = slug != null ? slug.toLowerCase().trim() : "";

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

        if (params.contains("vector<int>") && (params.contains("target") || params.contains("int k"))) {
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

        if (params.contains("vector<int>") && !params.contains(",")) {
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

        if (params.contains("string") && params.contains(",")) {
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

        if (params.contains("string") && !params.contains(",")) {
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

        if (params.contains("int") && !params.contains(",")) {
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

        String cleanSlug = slug != null ? slug.toLowerCase().trim() : "";
        String method = matchMethod(code, "twoSum", "containsDuplicate", "isAnagram", "solve");

        String driverBody = switch (cleanSlug) {
            case "two-sum" -> String.format("""
        String line = reader.readLine();
        if (line == null) return;
        int[] nums = parseArray(line);
        int target = parseIntAfter(line, "target");
        int[] res = new Solution().%s(nums, target);
        System.out.print(Arrays.toString(res));
""", method);
            case "concatenation-of-array" -> String.format("""
        String line = reader.readLine();
        if (line == null) return;
        int[] nums = parseArray(line);
        int[] res = new Solution().%s(nums);
        System.out.print(Arrays.toString(res));
""", method);
            case "contains-duplicate" -> String.format("""
        String line = reader.readLine();
        if (line == null) return;
        int[] nums = parseArray(line);
        boolean res = new Solution().%s(nums);
        System.out.print(res ? "True" : "False");
""", method);
            default -> String.format("""
        new Solution().%s();
""", method);
        };

        return """
import java.util.*;
import java.io.*;

""" + code + """

public class Main {
    private static int[] parseArray(String s) {
        int start = s.indexOf('[');
        int end = s.indexOf(']', start);
        if (start == -1 || end == -1) return new int[0];
        String[] tokens = s.substring(start + 1, end).split(",");
        List<Integer> list = new ArrayList<>();
        for (String t : tokens) {
            String trimmed = t.trim();
            if (!trimmed.isEmpty()) list.add(Integer.parseInt(trimmed));
        }
        int[] arr = new int[list.size()];
        for (int i = 0; i < list.size(); i++) arr[i] = list.get(i);
        return arr;
    }

    private static int parseIntAfter(String s, String key) {
        int pos = s.indexOf(key);
        if (pos == -1) return 0;
        int eq = s.indexOf('=', pos);
        if (eq == -1) return 0;
        String sub = s.substring(eq + 1).trim();
        return Integer.parseInt(sub.split("[^0-9-+]")[0]);
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
""" + driverBody + """
    }
}
""";
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
        Pattern pattern = Pattern.compile("(?:vector<[^>]+>|int|bool|string|void)\\s+([a-zA-Z0-9_]+)\\s*\\(");
        Matcher m = pattern.matcher(code);
        if (m.find()) {
            return m.group(1);
        }
        return "solve";
    }

    private String extractParams(String code) {
        Pattern pattern = Pattern.compile("(?:vector<[^>]+>|int|bool|string|void)\\s+[a-zA-Z0-9_]+\\s*\\(([^)]*)\\)");
        Matcher m = pattern.matcher(code);
        if (m.find()) {
            return m.group(1).trim();
        }
        return "";
    }
}
