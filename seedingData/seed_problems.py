import argparse
import html
import json
import os
import re
import time
import urllib.request
import urllib.parse
import uuid

GRAPHQL_URL = "https://leetcode.com/graphql"
HF_DATASET_URL = "https://huggingface.co/datasets/newfacade/LeetCodeDataset/resolve/main/LeetCodeDataset-train.jsonl"
local_json = os.path.join(os.path.dirname(__file__), "neetcode_250_complete.json")
parent_json = os.path.join(os.path.dirname(__file__), "..", "neetcode_250_complete.json")
DEFAULT_JSON_PATH = local_json if os.path.exists(local_json) else parent_json
CACHE_TESTCASES_PATH = os.path.join(os.path.dirname(__file__), "testcases_cache.json")
OUTPUT_JSON_PATH = os.path.join(os.path.dirname(__file__), "dapcode_problems.json")
OUTPUT_SQL_PATH = os.path.join(os.path.dirname(__file__), "V3__seed_problems.sql")
PREMIUM_FALLBACKS_PATH = os.path.join(os.path.dirname(__file__), "premium_fallbacks.json")

HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

QUESTION_QUERY = """
query getQuestionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    title
    difficulty
    content
    topicTags { name slug }
    codeSnippets { lang langSlug code }
    sampleTestCase
    exampleTestcaseList
  }
}
"""

def extract_slug(leetcode_url):
    m = re.search(r'/problems/([^/]+)/?', leetcode_url)
    return m.group(1) if m else None

def html_to_markdown(raw_html):
    if not raw_html:
        return ""
    text = raw_html
    text = re.sub(r'<strong[^>]*>|<b[^>]*>', '**', text)
    text = re.sub(r'</strong>|</b>', '**', text)
    text = re.sub(r'<em[^>]*>|<i[^>]*>', '*', text)
    text = re.sub(r'</em>|</i>', '*', text)
    text = re.sub(r'<code[^>]*>(.*?)</code>', r'`\1`', text)
    text = re.sub(r'<pre[^>]*>(.*?)</pre>', r'```\n\1\n```', text, flags=re.DOTALL)
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1\n', text)
    text = re.sub(r'</?(ul|ol|p|div|span)[^>]*>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text

def parse_example_testcases(raw_html):
    if not raw_html:
        return []
    examples = []
    pattern = r'<strong>Input:</strong>\s*(.*?)\s*<strong>Output:</strong>\s*(.*?)(?:<strong>Explanation:</strong>|<strong>Constraints:</strong>|</pre>|\n\n)'
    blocks = re.findall(pattern, raw_html, re.DOTALL | re.IGNORECASE)
    for inp, out in blocks:
        clean_inp = html.unescape(re.sub(r'<[^>]+>', '', inp)).strip()
        clean_out = html.unescape(re.sub(r'<[^>]+>', '', out)).strip()
        if clean_inp and clean_out:
            examples.append({
                "input": clean_inp,
                "output": clean_out,
                "is_hidden": False
            })
    return examples

def load_or_fetch_full_testcases(target_slugs, force_refresh=False):
    testcases_map = {}
    if not force_refresh and os.path.exists(CACHE_TESTCASES_PATH):
        try:
            with open(CACHE_TESTCASES_PATH, "r", encoding="utf-8") as f:
                testcases_map = json.load(f)
        except Exception:
            testcases_map = {}

    missing_slugs = set(target_slugs) - set(testcases_map.keys())
    if not missing_slugs:
        print(f"Loaded {len(testcases_map)} full test cases from cache.")
        return testcases_map

    print(f"Fetching missing test cases for {len(missing_slugs)} problems from HuggingFace LeetCodeDataset...")
    req = urllib.request.Request(HF_DATASET_URL, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            while True:
                line = resp.readline()
                if not line:
                    break
                try:
                    record = json.loads(line.decode("utf-8"))
                    task_id = record.get("task_id")
                    if task_id in missing_slugs:
                        io_list = record.get("input_output", [])
                        testcases_map[task_id] = [
                            {"input": str(item.get("input")), "output": str(item.get("output"))}
                            for item in io_list if item.get("input") is not None
                        ]
                        missing_slugs.remove(task_id)
                        if not missing_slugs:
                            break
                except Exception:
                    continue

        with open(CACHE_TESTCASES_PATH, "w", encoding="utf-8") as f:
            json.dump(testcases_map, f, ensure_ascii=False, indent=2)
        print(f"Cached full test cases for {len(testcases_map)} problems.")
    except Exception as e:
        print(f"Warning: Could not fetch full test cases ({e}). Will fallback to example test cases.")
    
    return testcases_map

def fetch_problem_metadata(slug):
    payload = json.dumps({"query": QUESTION_QUERY, "variables": {"titleSlug": slug}}).encode("utf-8")
    req = urllib.request.Request(GRAPHQL_URL, data=payload, headers=HEADERS)
    
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("data", {}).get("question")
        except Exception as e:
            time.sleep(1 + attempt)
    return None

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def generate_sql_migration(problems):
    lines = [
        "-- Dapcode Problem & TestCase Seed Migration",
        "-- Auto-generated by seedingData/seed_problems.py",
        "BEGIN;",
        ""
    ]

    for p in problems:
        p_id = p["id"]
        slug = escape_sql(p["slug"])
        title = escape_sql(p["title"])
        diff = escape_sql(p["difficulty"])
        cat = escape_sql(p.get("category"))
        desc = escape_sql(p["description_markdown"])

        lines.append(f"""INSERT INTO problems (id, slug, title, difficulty, category, description_markdown, time_limit_ms, memory_limit_kb)
VALUES ('{p_id}', {slug}, {title}, {diff}, {cat}, {desc}, 2000, 262144)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    difficulty = EXCLUDED.difficulty,
    category = EXCLUDED.category,
    description_markdown = EXCLUDED.description_markdown;""")

        for tc in p.get("test_cases", []):
            tc_id = str(uuid.uuid4())
            inp = escape_sql(tc["input"])
            out = escape_sql(tc["output"])
            is_hidden = "TRUE" if tc.get("is_hidden") else "FALSE"
            lines.append(f"""INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
VALUES ('{tc_id}', '{p_id}', {inp}, {out}, {is_hidden});""")
        
        lines.append("")

    lines.append("COMMIT;")
    lines.append("")
    return "\n".join(lines)

def main():
    parser = argparse.ArgumentParser(description="Seed problems and testcases for Dapcode.")
    parser.add_argument("--json", default=DEFAULT_JSON_PATH, help="Path to neetcode complete json file")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of problems to process")
    parser.add_argument("--skip-full-tests", action="store_true", help="Skip fetching full test cases from HF")
    parser.add_argument("--copy-to-migrations", action="store_true", help="Copy generated SQL to backend-core migrations")
    args = parser.parse_args()

    with open(args.json, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    problem_list = data.get("problems", [])
    if args.limit:
        problem_list = problem_list[:args.limit]

    print(f"Total problems to process: {len(problem_list)}")

    slug_map = {}
    for item in problem_list:
        slug = extract_slug(item.get("leetcode_url")) or item.get("slug")
        if slug:
            slug_map[slug] = item

    full_tests_map = {}
    if not args.skip_full_tests:
        full_tests_map = load_or_fetch_full_testcases(set(slug_map.keys()))

    premium_fallbacks = {}
    if os.path.exists(PREMIUM_FALLBACKS_PATH):
        try:
            with open(PREMIUM_FALLBACKS_PATH, "r", encoding="utf-8") as f:
                premium_fallbacks = json.load(f)
        except Exception:
            premium_fallbacks = {}

    processed_problems = []
    for idx, (slug, item) in enumerate(slug_map.items(), 1):
        print(f"[{idx}/{len(slug_map)}] Processing: {item.get('name')} ({slug})...")
        q = fetch_problem_metadata(slug)
        
        title = q.get("title") if q else item.get("name")
        difficulty = q.get("difficulty") if q else item.get("difficulty", "Medium")
        raw_content = q.get("content", "") if q else ""
        desc_md = html_to_markdown(raw_content)

        test_cases = []
        if slug in full_tests_map and full_tests_map[slug]:
            all_tests = full_tests_map[slug]
            for i, tc in enumerate(all_tests[:15]):
                test_cases.append({
                    "input": tc["input"],
                    "output": tc["output"],
                    "is_hidden": (i >= 3)
                })
        
        if not test_cases and raw_content:
            test_cases = parse_example_testcases(raw_content)

        if (not desc_md or not desc_md.strip()) and slug in premium_fallbacks:
            fb = premium_fallbacks[slug]
            desc_md = fb.get("description_markdown", desc_md)
            if not test_cases and fb.get("test_cases"):
                test_cases = fb["test_cases"]
            if not title or title == slug:
                title = fb.get("title", title)
            if not difficulty:
                difficulty = fb.get("difficulty", difficulty)

        problem_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"dapcode.problem.{slug}"))
        processed_problems.append({
            "id": problem_uuid,
            "slug": slug,
            "title": title,
            "difficulty": difficulty,
            "category": item.get("category", "General"),
            "description_markdown": desc_md,
            "test_cases": test_cases
        })

        time.sleep(0.3)

    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(processed_problems, f, ensure_ascii=False, indent=2)
    print(f"Saved problems JSON to {OUTPUT_JSON_PATH}")

    sql_content = generate_sql_migration(processed_problems)
    with open(OUTPUT_SQL_PATH, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"Saved migration SQL to {OUTPUT_SQL_PATH}")

    if args.copy_to_migrations:
        dest = os.path.join(os.path.dirname(__file__), "..", "backend-core", "src", "main", "resources", "db", "migration", "V3__seed_problems.sql")
        with open(dest, "w", encoding="utf-8") as f:
            f.write(sql_content)
        print(f"Copied migration to {dest}")

if __name__ == "__main__":
    main()
