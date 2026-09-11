from sqlalchemy import CheckConstraint, Float, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)

    outcomes: Mapped[list["CourseOutcome"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )
    students: Mapped[list["Student"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )


class CourseOutcome(Base):
    __tablename__ = "course_outcomes"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"), index=True, nullable=False
    )
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)

    course: Mapped[Course] = relationship(back_populates="outcomes")
    scores: Mapped[list["Score"]] = relationship(
        back_populates="course_outcome", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("course_id", "code"),)


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"), index=True, nullable=False
    )
    roll_number: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)

    course: Mapped[Course] = relationship(back_populates="students")
    scores: Mapped[list["Score"]] = relationship(
        back_populates="student", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("course_id", "roll_number"),)


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False
    )
    co_id: Mapped[int] = mapped_column(
        ForeignKey("course_outcomes.id", ondelete="CASCADE"), index=True, nullable=False
    )
    marks: Mapped[float] = mapped_column(Float, nullable=False)

    student: Mapped[Student] = relationship(back_populates="scores")
    course_outcome: Mapped[CourseOutcome] = relationship(back_populates="scores")

    __table_args__ = (
        UniqueConstraint("student_id", "co_id"),
        CheckConstraint("marks >= 0", name="ck_scores_marks_non_negative"),
    )
