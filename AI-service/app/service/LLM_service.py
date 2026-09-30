from groq import Groq
from app.core.config import settings
from app.core.prompt import SOCRATIC_SYSTEM_PROMPT, build_user_prompt
from app.rag.retriever import get_problem_by_slug, search_related_concepts
from app.schema.tutor import HintRequest, HintResponse

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL_NAME = "openai/gpt-oss-120b"

def generate_hint(req: HintRequest) -> HintResponse:
    problem = get_problem_by_slug(req.problem_slug)
    problem_title = problem["title"] if problem else req.problem_slug
    problem_content = problem["content"] if problem else "Problem details not found in local database."

    related_concept = None
    related_context = None

    search_query = req.question or req.error_message
    if search_query:
        related_res = search_related_concepts(search_query, n_results=1)
        if related_res and related_res[0].get("distance") is not None and related_res[0].get("distance") < 0.6:
            top_concept = related_res[0]
            related_concept = top_concept["title"]
            related_context = f"{top_concept['title']}\n{top_concept['document']}"

    user_prompt = build_user_prompt(
        problem_title=problem_title,
        problem_content=problem_content,
        user_code=req.code,
        language=req.language,
        hint_level=req.hint_level,
        error_message=req.error_message,
        user_question=req.question,
        related_context=related_context
    )

    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SOCRATIC_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.6,
        max_tokens=1024
    )

    hint_text = completion.choices[0].message.content

    return HintResponse(
        problem_slug=req.problem_slug,
        problem_title=problem_title,
        hint_lv=req.hint_level,
        hint=hint_text,
        related_concept=related_concept
    )