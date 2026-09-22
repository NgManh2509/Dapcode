import argparse
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

GEMINI_MODEL = "gemini-3.1-flash-lite"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_INPUT_JSON = os.path.join(SCRIPT_DIR, "theory.json")
CACHE_FILE = os.path.join(SCRIPT_DIR, "theories_cache.json")
OUTPUT_JSON = os.path.join(SCRIPT_DIR, "dapcode_theories.json")
OUTPUT_SQL = os.path.join(SCRIPT_DIR, "V6__seed_theories.sql")
ENV_FILE = os.path.join(SCRIPT_DIR, ".env")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,vi;q=0.8"
}

def load_env():
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def fetch_html_content(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw_bytes = resp.read()
            charset = resp.headers.get_content_charset() or "utf-8"
            return raw_bytes.decode(charset, errors="replace")
    except Exception as e:
        print(f"  [ERROR] Failed to fetch {url}: {e}")
        return None

def clean_html_to_text(raw_html):
    if not raw_html:
        return ""

    text = re.sub(r'<(script|style|svg|noscript|nav|header|footer|aside)[^>]*>.*?</\1>', '', raw_html, flags=re.DOTALL | re.IGNORECASE)

    article_match = re.search(r'<article[^>]*>(.*?)</article>', text, flags=re.DOTALL | re.IGNORECASE)
    if article_match:
        text = article_match.group(1)
    else:
        main_match = re.search(r'<main[^>]*>(.*?)</main>', text, flags=re.DOTALL | re.IGNORECASE)
        if main_match:
            text = main_match.group(1)

    text = re.sub(r'<h[1-6][^>]*>(.*?)</h[1-6]>', r'\n\n### \1\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<pre[^>]*>(.*?)</pre>', r'\n```\n\1\n```\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<code[^>]*>(.*?)</code>', r'`\1`', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'\n- \1', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'</?(p|div|br|tr)[^>]*>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)

    lines = [line.strip() for line in text.splitlines()]
    clean_lines = []
    for line in lines:
        if line:
            clean_lines.append(line)
        elif clean_lines and clean_lines[-1] != "":
            clean_lines.append("")

    return "\n".join(clean_lines).strip()[:30000]

def call_gemini_flash(api_key, category, source_url, article_text, model=GEMINI_MODEL):
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    system_instruction = (
        "Bạn là một chuyên gia khoa học máy tính và giảng viên thuật toán tại Dapcode. "
        "Nhiệm vụ của bạn là bóc tách và viết lại bài học lý thuyết Cấu trúc dữ liệu & Giải thuật "
        "từ nội dung thô của bài viết được cung cấp thành một bài giảng tiếng Việt hoàn chỉnh, "
        "súc tích, học thuật và chuẩn xác."
    )

    prompt = f"""
Chuyên mục: {category}
Nguồn bài viết gốc: {source_url}

Nội dung bài viết thô:
---
{article_text}
---

YÊU CẦU ĐẦU RA:
Trả về DUY NHẤT một đối tượng JSON hợp lệ theo schema sau:
{{
  "title": "Tiêu đề tiếng Việt kèm thuật ngữ tiếng Anh trong ngoặc (Ví dụ: Ngăn xếp (Stack))",
  "slug": "url-slug-chuan-khong-dau (Ví dụ: ngan-xep-stack)",
  "summary": "Tóm tắt 1-2 câu ngắn gọn về bản chất và bài toán ứng dụng điển hình",
  "content_markdown": "Nội dung bài học chuẩn Markdown"
}}

Yêu cầu các đề mục trong `content_markdown`:
1. ## 1. Đặt vấn đề & Khái niệm
2. ## 2. Các thao tác cơ bản (Core Operations)
3. ## 3. Đánh giá độ phức tạp (Big-O Complexity) - có bảng Markdown Thao tác | Average | Worst | Space
4. ## 4. Cài đặt mẫu (Implementation) - code mẫu chuẩn C++, Java hoặc Python có chú thích
5. ## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
"""

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_instruction}\n\n{prompt}"}
                ]
            }
        ],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    }

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            raw_text = res_json["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(raw_text)
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='replace')
        print(f"  [ERROR] Gemini API HTTP {e.code}: {err_msg}")
        return None
    except Exception as e:
        print(f"  [ERROR] Gemini call failed: {e}")
        return None

def generate_sql_migration(theories):
    sql_lines = [
        "-- ==========================================================================",
        "-- Flyway Migration: V6__seed_theories.sql",
        f"-- Generated: {len(theories)} theory articles for Dapcode",
        "-- ==========================================================================\n"
    ]

    for t in theories:
        t_id = t["id"]
        t_title = t["title"].replace("'", "''")
        t_slug = t["slug"].replace("'", "''")
        t_category = t["category"].replace("'", "''")
        t_summary = t["summary"].replace("'", "''")
        t_order = t["order_index"]
        t_content = t["content_markdown"]

        sql = f"""INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '{t_id}',
    '{t_title}',
    '{t_slug}',
    '{t_category}',
    '{t_summary}',
    $content${t_content}$content$,
    {t_order},
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;
"""
        sql_lines.append(sql)

    return "\n".join(sql_lines)

def main():
    parser = argparse.ArgumentParser(description="Scrape and seed DSA Theory lessons using Gemini for Dapcode.")
    parser.add_argument("--input", default=DEFAULT_INPUT_JSON, help="Path to theory.json")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of articles to process")
    parser.add_argument("--api-key", default=None, help="Gemini API Key")
    parser.add_argument("--delay", type=float, default=1.5, help="Delay between API calls in seconds")
    parser.add_argument("--dry-run", action="store_true", help="Scrape without calling Gemini API")
    parser.add_argument("--copy-to-migrations", action="store_true", help="Copy generated SQL to backend-core migrations")
    args = parser.parse_args()

    env = load_env()
    api_key = args.api_key or env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")

    if not args.dry_run and not api_key:
        print("[ERROR] GEMINI_API_KEY is required! Set it in `seedingData/.env` or pass `--api-key YOUR_KEY`.")
        sys.exit(1)

    if not os.path.exists(args.input):
        print(f"[ERROR] Input file not found: {args.input}")
        sys.exit(1)

    with open(args.input, "r", encoding="utf-8") as f:
        categories_data = json.load(f)

    all_tasks = []
    seen_urls = set()
    for group in categories_data:
        category = group.get("category", "General")
        order = 1
        for url in group.get("link", []):
            url = url.strip()
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)
            all_tasks.append({
                "category": category,
                "url": url,
                "order_index": order
            })
            order += 1

    if args.limit:
        all_tasks = all_tasks[:args.limit]

    print(f"Found {len(all_tasks)} unique theory articles to process (Model: {GEMINI_MODEL}).")

    cache = {}
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                cache = json.load(f)
            print(f"Loaded {len(cache)} cached theory articles.")
        except Exception:
            cache = {}

    processed_theories = []
    used_slugs = set()

    for idx, task in enumerate(all_tasks, 1):
        url = task["url"]
        category = task["category"]
        order_index = task["order_index"]
        print(f"\n[{idx}/{len(all_tasks)}] [{category}] {url}")

        if url in cache and not args.dry_run:
            cached_data = cache[url]
            slug = cached_data.get("slug")
            if slug in used_slugs:
                slug = f"{slug}-{order_index}"
            used_slugs.add(slug)

            theory_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"dapcode.theory.{slug}"))
            processed_theories.append({
                "id": theory_uuid,
                "title": cached_data.get("title"),
                "slug": slug,
                "category": category,
                "summary": cached_data.get("summary"),
                "content_markdown": cached_data.get("content_markdown"),
                "order_index": order_index,
                "source_url": url
            })
            print(f"  -> Cache hit: {cached_data.get('title')} ({slug})")
            continue

        raw_html = fetch_html_content(url)
        if not raw_html:
            continue

        clean_text = clean_html_to_text(raw_html)

        if args.dry_run:
            print(f"  -> [DRY RUN] Extracted {len(clean_text)} chars.")
            continue

        print(f"  -> Calling {GEMINI_MODEL}...")
        ai_res = call_gemini_flash(api_key, category, url, clean_text, model=GEMINI_MODEL)
        if not ai_res:
            continue

        slug = ai_res.get("slug") or re.sub(r'[^a-z0-9]+', '-', ai_res.get("title", "theory").lower()).strip('-')
        if slug in used_slugs:
            slug = f"{slug}-{order_index}"
        used_slugs.add(slug)
        ai_res["slug"] = slug

        cache[url] = ai_res
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)

        theory_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"dapcode.theory.{slug}"))
        processed_theories.append({
            "id": theory_uuid,
            "title": ai_res.get("title"),
            "slug": slug,
            "category": category,
            "summary": ai_res.get("summary"),
            "content_markdown": ai_res.get("content_markdown"),
            "order_index": order_index,
            "source_url": url
        })
        print(f"  -> Generated: {ai_res.get('title')} ({slug})")

        time.sleep(args.delay)

    if args.dry_run:
        print("\n[DRY RUN COMPLETE]")
        return

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(processed_theories, f, ensure_ascii=False, indent=2)
    print(f"\n[OK] Saved {len(processed_theories)} theories to {OUTPUT_JSON}")

    sql_content = generate_sql_migration(processed_theories)
    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"[OK] Saved migration SQL to {OUTPUT_SQL}")

    if args.copy_to_migrations:
        dest = os.path.join(SCRIPT_DIR, "..", "backend-core", "src", "main", "resources", "db", "migration", "V6__seed_theories.sql")
        with open(dest, "w", encoding="utf-8") as f:
            f.write(sql_content)
        print(f"[OK] Copied migration to {dest}")

if __name__ == "__main__":
    main()
