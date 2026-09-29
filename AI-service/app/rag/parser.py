import os
import re
from pathlib import Path
from typing import List, Dict, Any

def clean_category_name(folder_name: str) -> str:
    return re.sub(r"^\d+\.\s*", "", folder_name).strip()


def generate_slug(title: str) -> str:
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", title)
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    return s.strip("-").lower()


def parse_markdown_file(file_path: Path, category: str) -> Dict[str, Any]:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.strip().split("\n")
    raw_title = lines[0].replace("#", "").strip() if lines else file_path.stem
    title = re.sub(r"^\d+\.\s*", "", raw_title).strip()
    slug = generate_slug(title)

    difficulty = "Medium"
    for diff in ["Easy", "Medium", "Hard"]:
        if diff in content[:200]:
            difficulty = diff
            break

    code_match = re.search(r"```(?:java|python|cpp|python3)?\n(.*?)```", content, re.DOTALL)
    solution_code = code_match.group(1).strip() if code_match else ""

    document_text = f"Problem: {title}\nCategory: {category}\nDifficulty: {difficulty}\n\nContent:\n{content}"

    return {
        "id": slug,
        "slug": slug,
        "title": title,
        "category": category,
        "difficulty": difficulty,
        "text": document_text,
        "solution_code": solution_code,
        "source": str(file_path)
    }

def load_all_neetcode_problems(base_dir: str) -> List[Dict[str, Any]]:
    problems = []
    base_path = Path(base_dir)
    seen_ids = set()

    for category_dir in sorted(base_path.iterdir()):
        if not category_dir.is_dir() or category_dir.name.startswith("."):
            continue

        category_name = clean_category_name(category_dir.name)
        for md_file in sorted(category_dir.glob("*.md")):
            try:
                problem_data = parse_markdown_file(md_file, category_name)
                if problem_data["id"] not in seen_ids:
                    seen_ids.add(problem_data["id"])
                    problems.append(problem_data)
            except Exception as e:
                print(f"Lỗi khi đọc file {md_file}: {e}")
    return problems