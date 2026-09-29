import os
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from app.rag.parser import load_all_neetcode_problems
from app.rag.vector_store import get_neetcode_collection

def ingest_data():
    base_dir = Path(__file__).resolve().parent.parent.parent / "NeetCode-150-main"
    print(f"Đang đọc dữ liệu từ: {base_dir}")

    problems = load_all_neetcode_problems(str(base_dir))
    if not problems:
        print("Không tìm thấy bài toán nào trong thư mục!")
        return

    print(f"Tìm thấy {len(problems)} bài toán. Bắt đầu nạp vào ChromaDB...")
    collection = get_neetcode_collection()

    ids = [p["id"] for p in problems]
    documents = [p["text"] for p in problems]
    metadatas = [
        {
            "slug": p["slug"],
            "title": p["title"],
            "category": p["category"],
            "difficulty": p["difficulty"],
            "solution_code": p["solution_code"],
            "source": p["source"]
        }
        for p in problems
    ]

    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )
    print(f"Hoàn tất! Đã nạp thành công {len(problems)} bài toán vào ChromaDB (collection: {collection.name}).")

if __name__ == "__main__":
    ingest_data()