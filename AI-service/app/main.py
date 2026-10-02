from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints.hint import router as hint_router
from app.rag.vector_store import get_neetcode_collection

@asynccontextmanager
async def lifespan(app: FastAPI):
    get_neetcode_collection()
    yield

app = FastAPI(
    title="Dapcode AI Socratic Tutor Service",
    description="Microservice cung cấp gợi ý định hướng tư duy DSA bằng RAG + Groq",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hint_router, prefix="/api/v1/tutor", tags=["AI tutor"])

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI Socratic Tutor"}

#cách chạy : uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
