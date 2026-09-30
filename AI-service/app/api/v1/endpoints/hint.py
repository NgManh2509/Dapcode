from fastapi import APIRouter, HTTPException
from app.schema.tutor import HintRequest, HintResponse
from app.service.LLM_service import generate_hint

router = APIRouter()

@router.post("/hint", response_model= HintResponse)
def get_hint(req: HintRequest):
    try: 
        return generate_hint(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")
    