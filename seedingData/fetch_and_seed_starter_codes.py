import json
import os
import re
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

GRAPHQL_URL = "https://leetcode.com/graphql"
HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

QUESTION_QUERY = """
query getQuestionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    codeSnippets { lang langSlug code }
  }
}
"""

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROBLEMS_JSON_PATH = os.path.join(BASE_DIR, "dapcode_problems.json")
CACHE_PATH = os.path.join(BASE_DIR, "starter_codes_cache.json")
MIGRATION_PATH = os.path.join(BASE_DIR, "..", "backend-core", "src", "main", "resources", "db", "migration", "V8__add_starter_code_to_problems.sql")

def fetch_snippets_for_slug(slug):
    payload = json.dumps({"query": QUESTION_QUERY, "variables": {"titleSlug": slug}}).encode("utf-8")
    req = urllib.request.Request(GRAPHQL_URL, data=payload, headers=HEADERS)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                snippets = data.get("data", {}).get("question", {}).get("codeSnippets", [])
                result = {}
                for s in snippets:
                    l = s.get("langSlug")
                    if l == "cpp":
                        result["cpp"] = s.get("code")
                    elif l == "java":
                        result["java"] = s.get("code")
                    elif l == "python3":
                        result["python"] = s.get("code")
                    elif l == "python" and "python" not in result:
                        result["python"] = s.get("code")
                return slug, result
        except Exception as e:
            time.sleep(1 + attempt)
    return slug, {}

def main():
    with open(PROBLEMS_JSON_PATH, "r", encoding="utf-8") as f:
        problems = json.load(f)

    slugs = [p["slug"] for p in problems if p.get("slug")]
    print(f"Total slugs to process: {len(slugs)}")

    cache = {}
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                cache = json.load(f)
            print(f"Loaded {len(cache)} snippets from cache.")
        except Exception:
            cache = {}

    missing_slugs = [s for s in slugs if s not in cache or not cache[s]]
    print(f"Need to fetch: {len(missing_slugs)} slugs")

    if missing_slugs:
        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_slug = {executor.submit(fetch_snippets_for_slug, s): s for s in missing_slugs}
            completed = 0
            for future in as_completed(future_to_slug):
                slug, snippets = future.result()
                if snippets:
                    cache[slug] = snippets
                completed += 1
                if completed % 25 == 0 or completed == len(missing_slugs):
                    print(f"Fetched {completed}/{len(missing_slugs)}...")
                    with open(CACHE_PATH, "w", encoding="utf-8") as f:
                        json.dump(cache, f, ensure_ascii=False, indent=2)

    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)
    print(f"Cache complete with {len(cache)} entries.")

    # Generate V8 SQL migration
    sql_lines = [
        "-- Dapcode Migration V8: Add starter_code to problems and seed snippets",
        "ALTER TABLE problems ADD COLUMN IF NOT EXISTS starter_code TEXT;",
        ""
    ]

    for p in problems:
        slug = p["slug"]
        if slug in cache and cache[slug]:
            # Save into json
            p["starter_code"] = cache[slug]
            json_str = json.dumps(cache[slug], ensure_ascii=False).replace("'", "''")
            safe_slug = slug.replace("'", "''")
            sql_lines.append(f"UPDATE problems SET starter_code = '{json_str}' WHERE slug = '{safe_slug}';")

    with open(PROBLEMS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)
    print(f"Updated {PROBLEMS_JSON_PATH}")

    os.makedirs(os.path.dirname(MIGRATION_PATH), exist_ok=True)
    with open(MIGRATION_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))
    print(f"Generated Flyway migration: {MIGRATION_PATH}")

if __name__ == "__main__":
    main()
