from pydantic import BaseModel
from typing import Optional, Any


class ReviewCreate(BaseModel):
    code: str
    language: str = "python"


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    code: str
    language: str
    ai_feedback: Optional[str] = None
    score: Optional[float] = None
    created_at: str
    class Config:
        from_attributes = True


class ReviewWithFeedback(BaseModel):
    id: int
    code: str
    language: str
    score: Optional[float] = None
    feedback: Any
    created_at: str
