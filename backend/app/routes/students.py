from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Student
from app.schemas import StudentCreate, StudentResponse, StudentUpdate
from app.routes.courses import get_course_or_404
from app.routes.helpers import commit_or_raise_conflict

router = APIRouter(tags=["students"])


def get_student_or_404(student_id: int, db: Session) -> Student:
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.post(
    "/courses/{course_id}/students",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_student(
    course_id: int,
    payload: StudentCreate,
    db: Session = Depends(get_db),
) -> Student:
    get_course_or_404(course_id, db)
    student = Student(course_id=course_id, **payload.model_dump())
    db.add(student)
    commit_or_raise_conflict(
        db, "A student with this roll number already exists in the course"
    )
    db.refresh(student)
    return student


@router.get("/courses/{course_id}/students", response_model=list[StudentResponse])
def list_students(course_id: int, db: Session = Depends(get_db)) -> list[Student]:
    get_course_or_404(course_id, db)
    return list(
        db.scalars(
            select(Student)
            .where(Student.course_id == course_id)
            .order_by(Student.id)
        ).all()
    )


@router.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)) -> Student:
    return get_student_or_404(student_id, db)


@router.put("/students/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int, payload: StudentUpdate, db: Session = Depends(get_db)
) -> Student:
    student = get_student_or_404(student_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    commit_or_raise_conflict(
        db, "A student with this roll number already exists in the course"
    )
    db.refresh(student)
    return student


@router.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)) -> Response:
    student = get_student_or_404(student_id, db)
    db.delete(student)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)