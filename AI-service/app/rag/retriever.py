from typing import Optional, Dict, Any, List
from app.rag.vector_store import get_neetcode_collection

def get_problem_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    normalized_slug = slug.strip().lower().replace("_", "-")
    collection = get_neetcode_collection()
    res = collection.get(ids=[normalized_slug])
    
    if not res["ids"]:
        return None
    
    meta = res["metadatas"][0]
    return {
        "slug": normalized_slug,
        "title": meta.get("title", ""),
        "category": meta.get("category", ""),
        "difficulty": meta.get("difficulty", "Medium"),
        "solution_code": meta.get("solution_code", ""),
        "content": res["documents"][0] if res["documents"] else ""
    }

def search_related_concepts(query: str, n_results: int = 2) -> List[Dict[str, Any]]:
    collection = get_neetcode_collection()
    res = collection.query(query_texts=[query], n_results=n_results)
    
    results = []
    if not res["ids"] or not res["ids"][0]:
        return results

    for i, doc_id in enumerate(res["ids"][0]):
        meta = res["metadatas"][0][i]
        results.append({
            "id": doc_id,
            "title": meta.get("title", ""),
            "category": meta.get("category", ""),
            "document": res["documents"][0][i],
            "distance": res["distances"][0][i] if "distances" in res and res["distances"] else None
        })
    return results
