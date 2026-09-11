from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))

    outcomes: Mapped[list["CourseOutcome"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )
    students: Mapped[list["Student"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )


class CourseOutcome(Base):
    __tablename__ = "course_outcomes"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), index=True)
    code: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(500))

    course: Mapped[Course] = relationship(back_populates="outcomes")
    scores: Mapped[list["Score"]] = relationship(
        back_populates="course_outcome", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("course_id", "code"),)


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), index=True)
    student_number: Mapped[str] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(200))

    course: Mapped[Course] = relationship(back_populates="students")
    scores: Mapped[list["Score"]] = relationship(
        back_populates="student", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("course_id", "student_number"),)


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), index=True)
    course_outcome_id: Mapped[int] = mapped_column(
        ForeignKey("course_outcomes.id"), index=True
    )
    value: Mapped[float | None]

    student: Mapped[Student] = relationship(back_populates="scores")
    course_outcome: Mapped[CourseOutcome] = relationship(back_populates="scores")

    __table_args__ = (UniqueConstraint("student_id", "course_outcome_id"),)
