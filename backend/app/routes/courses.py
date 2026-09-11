from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Course
from app.schemas import CourseCreate, CourseResponse, CourseUpdate
from app.routes.helpers import commit_or_raise_conflict

router = APIRouter(prefix="/courses", tags=["courses"])


def get_course_or_404(course_id: int, db: Session) -> Course:
    course = db.get(Course, course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)) -> Course:
    course = Course(**payload.model_dump())
    db.add(course)
    commit_or_raise_conflict(db, "A course with this code already exists")
    db.refresh(course)
    return course


@router.get("", response_model=list[CourseResponse])
def list_courses(db: Session = Depends(get_db)) -> list[Course]:
    return list(db.scalars(select(Course).order_by(Course.id)).all())


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)) -> Course:
    return get_course_or_404(course_id, db)


@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)
) -> Course:
    course = get_course_or_404(course_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    commit_or_raise_conflict(db, "A course with this code already exists")
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)) -> Response:
    course = get_course_or_404(course_id, db)
    db.delete(course)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)