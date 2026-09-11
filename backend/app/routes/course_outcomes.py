from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CourseOutcome, Score
from app.services.attainment import calculate_attainment_summary
from app.schemas import (
    AttainmentResponse,
    CourseOutcomeCreate,
    CourseOutcomeResponse,
    CourseOutcomeUpdate,
)
from app.routes.courses import get_course_or_404
from app.routes.helpers import commit_or_raise_conflict

router = APIRouter(tags=["course outcomes"])


def get_outcome_or_404(co_id: int, db: Session) -> CourseOutcome:
    outcome = db.get(CourseOutcome, co_id)
    if outcome is None:
        raise HTTPException(status_code=404, detail="Course outcome not found")
    return outcome


@router.post(
    "/courses/{course_id}/outcomes",
    response_model=CourseOutcomeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_outcome(
    course_id: int,
    payload: CourseOutcomeCreate,
    db: Session = Depends(get_db),
) -> CourseOutcome:
    get_course_or_404(course_id, db)
    outcome = CourseOutcome(course_id=course_id, **payload.model_dump())
    db.add(outcome)
    commit_or_raise_conflict(
        db, "A course outcome with this code already exists for the course"
    )
    db.refresh(outcome)
    return outcome


@router.get(
    "/courses/{course_id}/outcomes",
    response_model=list[CourseOutcomeResponse],
)
def list_outcomes(course_id: int, db: Session = Depends(get_db)) -> list[CourseOutcome]:
    get_course_or_404(course_id, db)
    return list(
        db.scalars(
            select(CourseOutcome)
            .where(CourseOutcome.course_id == course_id)
            .order_by(CourseOutcome.id)
        ).all()
    )


@router.get("/outcomes/{co_id}", response_model=CourseOutcomeResponse)
def get_outcome(co_id: int, db: Session = Depends(get_db)) -> CourseOutcome:
    return get_outcome_or_404(co_id, db)


@router.get(
    "/outcomes/{co_id}/attainment",
    response_model=AttainmentResponse,
    summary="Calculate course outcome attainment",
)
def get_attainment(
    co_id: int,
    threshold: float = Query(..., description="Minimum score that counts as met"),
    db: Session = Depends(get_db),
) -> AttainmentResponse:
    get_outcome_or_404(co_id, db)
    scores = db.scalars(
        select(Score.marks).where(Score.co_id == co_id).order_by(Score.id)
    ).all()
    result = calculate_attainment_summary(scores, threshold)
    return AttainmentResponse(
        co_id=co_id,
        threshold=threshold,
        total_students=result.total_students,
        students_met=result.students_met,
        attainment_percentage=result.attainment_percentage,
    )


@router.put("/outcomes/{co_id}", response_model=CourseOutcomeResponse)
def update_outcome(
    co_id: int, payload: CourseOutcomeUpdate, db: Session = Depends(get_db)
) -> CourseOutcome:
    outcome = get_outcome_or_404(co_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(outcome, field, value)
    commit_or_raise_conflict(
        db, "A course outcome with this code already exists for the course"
    )
    db.refresh(outcome)
    return outcome


@router.delete("/outcomes/{co_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_outcome(co_id: int, db: Session = Depends(get_db)) -> Response:
    outcome = get_outcome_or_404(co_id, db)
    db.delete(outcome)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)