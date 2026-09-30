from sys import prefix
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints.hint import router as hint_router

app = FastAPI(
    title="Dapcode AI Socratic Tutor Service",
    description="Microservice cung cấp gợi ý định hướng tư duy DSA bằng RAG + Groq",
    version="1.0.0"
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
