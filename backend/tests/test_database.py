import pytest
from sqlalchemy import create_engine, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models import Course, CourseOutcome, Score, Student


@pytest.fixture
def session() -> Session:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        yield db
    Base.metadata.drop_all(bind=engine)


def test_course_relationships_and_score(session: Session) -> None:
    course = Course(code="CS301", name="Database Management Systems")
    outcome = CourseOutcome(code="CO1", description="Understand database fundamentals")
    student = Student(roll_number="23R01A0501", name="Rahul")
    course.outcomes.append(outcome)
    course.students.append(student)
    session.add(course)
    session.flush()

    score = Score(student_id=student.id, co_id=outcome.id, marks=75)
    session.add(score)
    session.commit()

    assert course.outcomes == [outcome]
    assert course.students == [student]
    assert student.scores == [score]
    assert outcome.scores == [score]


def test_duplicate_student_outcome_score_is_rejected(session: Session) -> None:
    course = Course(code="CS302", name="Data Systems")
    outcome = CourseOutcome(code="CO1", description="Understand data systems")
    student = Student(roll_number="23R01A0502", name="Asha")
    course.outcomes.append(outcome)
    course.students.append(student)
    session.add(course)
    session.flush()
    session.add(Score(student_id=student.id, co_id=outcome.id, marks=70))
    session.commit()

    session.add(Score(student_id=student.id, co_id=outcome.id, marks=80))
    with pytest.raises(IntegrityError):
        session.commit()


def test_negative_marks_are_rejected(session: Session) -> None:
    course = Course(code="CS303", name="Information Systems")
    outcome = CourseOutcome(code="CO1", description="Understand information systems")
    student = Student(roll_number="23R01A0503", name="Mina")
    course.outcomes.append(outcome)
    course.students.append(student)
    session.add(course)
    session.flush()

    session.add(Score(student_id=student.id, co_id=outcome.id, marks=-1))
    with pytest.raises(IntegrityError):
        session.commit()


def test_deleting_course_cascades_to_dependents(session: Session) -> None:
    course = Course(code="CS304", name="Software Design")
    outcome = CourseOutcome(code="CO1", description="Understand software design")
    student = Student(roll_number="23R01A0504", name="Dev")
    course.outcomes.append(outcome)
    course.students.append(student)
    session.add(course)
    session.flush()
    session.add(Score(student_id=student.id, co_id=outcome.id, marks=90))
    session.commit()

    session.delete(course)
    session.commit()

    assert session.scalars(select(CourseOutcome)).all() == []
    assert session.scalars(select(Student)).all() == []
    assert session.scalars(select(Score)).all() == []