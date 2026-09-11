from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CourseOutcome, Score, Student
from app.schemas import ScoreCreate, ScoreResponse, ScoreUpdate
from app.routes.helpers import commit_or_raise_conflict

router = APIRouter(tags=["scores"])


def get_score_or_404(score_id: int, db: Session) -> Score:
    score = db.get(Score, score_id)
    if score is None:
        raise HTTPException(status_code=404, detail="Score not found")
    return score


def get_score_parts_or_404(
    student_id: int, co_id: int, db: Session
) -> tuple[Student, CourseOutcome]:
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    outcome = db.get(CourseOutcome, co_id)
    if outcome is None:
        raise HTTPException(status_code=404, detail="Course outcome not found")
    if student.course_id != outcome.course_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student and course outcome must belong to the same course",
        )
    return student, outcome


@router.post("/scores", response_model=ScoreResponse, status_code=status.HTTP_201_CREATED)
def create_score(payload: ScoreCreate, db: Session = Depends(get_db)) -> Score:
    get_score_parts_or_404(payload.student_id, payload.co_id, db)
    score = Score(**payload.model_dump())
    db.add(score)
    commit_or_raise_conflict(db, "A score already exists for this student and course outcome")
    db.refresh(score)
    return score


@router.get("/scores/{score_id}", response_model=ScoreResponse)
def get_score(score_id: int, db: Session = Depends(get_db)) -> Score:
    return get_score_or_404(score_id, db)


@router.put("/scores/{score_id}", response_model=ScoreResponse)
def update_score(
    score_id: int, payload: ScoreUpdate, db: Session = Depends(get_db)
) -> Score:
    score = get_score_or_404(score_id, db)
    values = payload.model_dump(exclude_unset=True)
    student_id = values.get("student_id", score.student_id)
    co_id = values.get("co_id", score.co_id)
    get_score_parts_or_404(student_id, co_id, db)
    for field, value in values.items():
        setattr(score, field, value)
    commit_or_raise_conflict(db, "A score already exists for this student and course outcome")
    db.refresh(score)
    return score


@router.delete("/scores/{score_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_score(score_id: int, db: Session = Depends(get_db)) -> Response:
    score = get_score_or_404(score_id, db)
    db.delete(score)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/students/{student_id}/scores", response_model=list[ScoreResponse])
def list_student_scores(student_id: int, db: Session = Depends(get_db)) -> list[Score]:
    if db.get(Student, student_id) is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return list(
        db.scalars(
            select(Score).where(Score.student_id == student_id).order_by(Score.id)
        ).all()
    )


@router.get("/outcomes/{co_id}/scores", response_model=list[ScoreResponse])
def list_outcome_scores(co_id: int, db: Session = Depends(get_db)) -> list[Score]:
    if db.get(CourseOutcome, co_id) is None:
        raise HTTPException(status_code=404, detail="Course outcome not found")
    return list(
        db.scalars(select(Score).where(Score.co_id == co_id).order_by(Score.id)).all()
    )