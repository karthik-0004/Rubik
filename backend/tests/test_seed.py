import pytest
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import seed
from app.database import Base
from app.models import Course, CourseOutcome, Score, Student


@pytest.fixture
def seeded_database(monkeypatch):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    monkeypatch.setattr(seed, "init_db", lambda: None)
    monkeypatch.setattr(seed, "SessionLocal", session_factory)
    yield engine, session_factory
    Base.metadata.drop_all(bind=engine)


def test_seed_creates_expected_data_and_is_idempotent(seeded_database) -> None:
    engine, session_factory = seeded_database

    first = seed.seed_data()
    second = seed.seed_data()

    assert first.created is True
    assert second.created is False
    assert (first.courses, first.outcomes, first.students, first.scores) == (
        3,
        12,
        60,
        240,
    )
    assert (second.courses, second.outcomes, second.students, second.scores) == (
        3,
        12,
        60,
        240,
    )

    with session_factory() as db:
        assert db.scalar(select(func.count(Score.id)).where(Score.marks == 50)) >= 12
        invalid_course_scores = db.scalar(
            select(func.count(Score.id))
            .join(Score.student)
            .join(Score.course_outcome)
            .where(Student.course_id != CourseOutcome.course_id)
        )
        assert invalid_course_scores == 0
        assert db.scalar(
            select(func.count()).select_from(
                select(Score.student_id, Score.co_id)
                .group_by(Score.student_id, Score.co_id)
                .subquery()
            )
        ) == 240
