from typing import Optional
from pydantic import BaseModel, Field

class HintRequest(BaseModel):
    problem_slug: str = Field(..., description="Slug của bài toán (ví dụ: two-sum)")
    code: Optional[str] = Field(default="", description="Code hiện tại của học viên")
    language: Optional[str] = Field(default="python", description="Ngôn ngữ lập trình")
    hint_level: int = Field(default=1, ge=1, le=2, description="1: Gợi ý tư duy (Nudge), 2: Mã giả (Pseudocode)")
    error_message: Optional[str] = Field(default=None, description="Thông báo lỗi khi nộp bài (nếu có)")
    question: Optional[str] = Field(default=None, description="Thắc mắc riêng của học viên")

class HintResponse(BaseModel):
    problem_slug: str
    problem_title: str
    hint_lv : int
    hint: str
    related_concept: Optional[str] = None