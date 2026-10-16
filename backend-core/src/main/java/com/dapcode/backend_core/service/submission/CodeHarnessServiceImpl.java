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

    private boolean isDesignProblem(String slug, String code) {
        if (slug != null && DESIGN_SLUGS.contains(slug.toLowerCase().trim())) {
            return true;
        }
        return !Pattern.compile("\\bclass\\s+Solution\\b").matcher(code).find();
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

        String prefix = """
from __future__ import annotations
from typing import *
import collections
import heapq
import math
import json

""";

        String runner = """

if __name__ == '__main__':
    import sys, re, inspect, ast, json

    raw_input = sys.stdin.read().strip()
    if raw_input:
        lines = [l.strip() for l in raw_input.split('\\n') if l.strip()]
        if len(lines) >= 2 and lines[0].startswith('[') and lines[1].startswith('['):
            try:
                commands = json.loads(lines[0])
                args_list = json.loads(lines[1])
                cls_name = commands[0]
                cls = globals().get(cls_name)
                if cls:
                    obj = cls(*args_list[0])
                    results = [None]
                    for cmd, m_args in zip(commands[1:], args_list[1:]):
                        fn = getattr(obj, cmd)
                        res = fn(*m_args)
                        results.append(res)
                    print(json.dumps(results))
                    sys.exit(0)
            except Exception:
                pass

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
        try:
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
        except Exception:
            pass
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

        if (isDesignProblem(slug, code)) {
            return wrapJavaDesign(code);
        }

        return wrapJavaStandard(code);
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

    private String wrapJavaStandard(String code) {
        StringBuilder helpers = new StringBuilder();
        if (!code.contains("class ListNode")) {
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
        if (!code.contains("class TreeNode")) {
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

        return """
import java.util.*;
import java.io.*;
import java.lang.reflect.*;

""" + helpers + "\n" + code + """

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\\n");
        }
        String rawInput = sb.toString().trim();

        Class<?> solClass = Solution.class;
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
            String[] parts = rawInput.split(",\\\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\\\s*=)");
            Map<String, String> map = new LinkedHashMap<>();
            for (String p : parts) {
                int eq = p.indexOf('=');
                if (eq != -1) {
                    map.put(p.substring(0, eq).trim(), p.substring(eq + 1).trim());
                }
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
            for (String t : tokens) {
                String d = t.replaceAll("[^0-9-]", "");
                if (!d.isEmpty()) {
                    curr.next = new ListNode(Integer.parseInt(d));
                    curr = curr.next;
                }
            }
            return dummy.next;
        }
        if (type.getSimpleName().equals("TreeNode")) {
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
                Object curr = res;
                while (curr != null) {
                    list.add((Integer) valField.get(curr));
                    curr = nextField.get(curr);
                }
            } catch (Exception ignored) {}
            System.out.print(list.toString());
        } else if (res.getClass().getSimpleName().equals("TreeNode")) {
            List<String> list = new ArrayList<>();
            try {
                Field valField = res.getClass().getDeclaredField("val");
                Field leftField = res.getClass().getDeclaredField("left");
                Field rightField = res.getClass().getDeclaredField("right");
                valField.setAccessible(true);
                leftField.setAccessible(true);
                rightField.setAccessible(true);

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
            } catch (Exception ignored) {}
            System.out.print(list.toString());
        } else {
            System.out.print(res.toString());
        }
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
        Pattern pattern = Pattern.compile("(?:vector<[^>]+>|int\\[\\]|int|bool|boolean|string|String|void)\\s+([a-zA-Z0-9_]+)\\s*\\(");
        Matcher m = pattern.matcher(code);
        if (m.find()) {
            return m.group(1);
        }
        return "solve";
    }

    private String extractParams(String code) {
        Pattern pattern = Pattern.compile("(?:vector<[^>]+>|int\\[\\]|int|bool|boolean|string|String|void)\\s+[a-zA-Z0-9_]+\\s*\\(([^)]*)\\)");
        Matcher m = pattern.matcher(code);
        if (m.find()) {
            return m.group(1).trim();
        }
        return "";
    }
}
