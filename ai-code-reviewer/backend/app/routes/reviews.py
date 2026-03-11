import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewWithFeedback
from app.services.ai_service import review_code
from app.routes.deps import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", response_model=ReviewWithFeedback)
async def create_review(data: ReviewCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    feedback = await review_code(data.code, data.language)
    score = feedback.get("score")
    review = Review(user_id=current_user.id, code=data.code, language=data.language, ai_feedback=json.dumps(feedback), score=float(score) if score is not None else None)
    db.add(review)
    await db.flush()
    await db.refresh(review)
    return ReviewWithFeedback(id=review.id, code=review.code, language=review.language, score=review.score, feedback=feedback, created_at=review.created_at.isoformat() if review.created_at else "")


@router.get("", response_model=list[ReviewResponse])
async def list_reviews(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Review).where(Review.user_id == current_user.id).order_by(Review.created_at.desc()))
    reviews = result.scalars().all()
    return [ReviewResponse(id=r.id, user_id=r.user_id, code=r.code[:200] + "..." if len(r.code) > 200 else r.code, language=r.language, ai_feedback=r.ai_feedback, score=r.score, created_at=r.created_at.isoformat() if r.created_at else "") for r in reviews]


@router.get("/{review_id}", response_model=ReviewWithFeedback)
async def get_review(review_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Review).where(Review.id == review_id, Review.user_id == current_user.id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    feedback = json.loads(review.ai_feedback) if review.ai_feedback else {}
    return ReviewWithFeedback(id=review.id, code=review.code, language=review.language, score=review.score, feedback=feedback, created_at=review.created_at.isoformat() if review.created_at else "")
