import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


@pytest.fixture
def client() -> TestClient:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    testing_session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    def override_get_db():
        with testing_session() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def test_create_course_and_duplicate_code_conflict(client: TestClient) -> None:
    response = client.post("/api/courses", json={"name": "DBMS", "code": "CS301"})
    assert response.status_code == 201
    assert response.json()["code"] == "CS301"

    duplicate = client.post(
        "/api/courses", json={"name": "Other DBMS", "code": "CS301"}
    )
    assert duplicate.status_code == 409


def test_create_outcome_student_and_score(client: TestClient) -> None:
    course = client.post(
        "/api/courses", json={"name": "DBMS", "code": "CS301"}
    ).json()
    course_id = course["id"]

    outcome = client.post(
        f"/api/courses/{course_id}/outcomes",
        json={"code": "CO1", "description": "Understand databases"},
    )
    student = client.post(
        f"/api/courses/{course_id}/students",
        json={"name": "Rahul Kumar", "roll_number": "23R01A0501"},
    )
    assert outcome.status_code == 201
    assert student.status_code == 201

    score = client.post(
        "/api/scores",
        json={
            "student_id": student.json()["id"],
            "co_id": outcome.json()["id"],
            "marks": 75,
        },
    )
    assert score.status_code == 201
    assert score.json()["marks"] == 75

    duplicate = client.post("/api/scores", json=score.json())
    assert duplicate.status_code == 409


def test_score_rejects_student_and_outcome_from_different_courses(
    client: TestClient,
) -> None:
    first_course = client.post(
        "/api/courses", json={"name": "DBMS", "code": "CS301"}
    ).json()
    second_course = client.post(
        "/api/courses", json={"name": "Networks", "code": "CS302"}
    ).json()
    student = client.post(
        f"/api/courses/{first_course['id']}/students",
        json={"name": "Rahul", "roll_number": "R1"},
    ).json()
    outcome = client.post(
        f"/api/courses/{second_course['id']}/outcomes",
        json={"code": "CO1", "description": "Understand networks"},
    ).json()

    response = client.post(
        "/api/scores",
        json={"student_id": student["id"], "co_id": outcome["id"], "marks": 80},
    )
    assert response.status_code == 400
    assert "same course" in response.json()["detail"]