from dataclasses import dataclass

from sqlalchemy import func, select

from app.database import SessionLocal, init_db
from app.models import Course, CourseOutcome, Score, Student

COURSE_SEEDS = (
    {
        "name": "Database Management Systems",
        "code": "CS301",
        "outcomes": (
            ("CO1", "Understand database fundamentals"),
            ("CO2", "Design normalized relational schemas"),
            ("CO3", "Write SQL queries"),
            ("CO4", "Understand transactions and concurrency"),
        ),
    },
    {
        "name": "Operating Systems",
        "code": "CS302",
        "outcomes": (
            ("CO1", "Understand operating system concepts"),
            ("CO2", "Analyze process scheduling"),
            ("CO3", "Understand memory management"),
            ("CO4", "Explain file systems"),
        ),
    },
    {
        "name": "Computer Networks",
        "code": "CS303",
        "outcomes": (
            ("CO1", "Understand networking fundamentals"),
            ("CO2", "Explain network protocols"),
            ("CO3", "Analyze IP addressing and routing"),
            ("CO4", "Understand transport-layer communication"),
        ),
    },
)

STUDENT_NAMES = (
    "Rahul Kumar",
    "Priya Sharma",
    "Anil Reddy",
    "Sneha Patel",
    "Vikram Singh",
    "Kavya Nair",
    "Arjun Mehta",
    "Neha Gupta",
    "Rohit Verma",
    "Isha Joshi",
    "Aditya Rao",
    "Pooja Iyer",
    "Sanjay Menon",
    "Ananya Das",
    "Karthik Babu",
    "Meera Shah",
    "Nikhil Jain",
    "Divya Reddy",
    "Manish Kumar",
    "Aditi Kulkarni",
    "Suresh Naidu",
    "Riya Kapoor",
    "Harish Yadav",
    "Swati Mishra",
    "Gaurav Sinha",
    "Lakshmi Devi",
    "Varun Nair",
    "Aarav Malhotra",
    "Deepak Pillai",
    "Tanvi Deshmukh",
    "Akash Choudhary",
    "Nandini Rao",
    "Pranav Shetty",
    "Shreya Bose",
    "Mohit Agarwal",
    "Sakshi Bansal",
    "Vivek Hegde",
    "Madhuri Krishnan",
    "Yash Thakur",
    "Pallavi Roy",
    "Ramesh Iyer",
    "Simran Kaur",
    "Abhishek Patil",
    "Nisha Thomas",
    "Varsha Menon",
    "Rohan Desai",
    "Komal Saxena",
    "Ajay Prasad",
    "Mansi Vora",
    "Suraj Bhat",
    "Nikita Sethi",
    "Pradeep Kumar",
    "Ayesha Khan",
    "Ashwin Raju",
    "Bhavana Nair",
    "Chirag Shah",
    "Deeksha Reddy",
    "Faisal Ahmed",
    "Gayatri Joshi",
    "Himanshu Rawat",
)


@dataclass(frozen=True)
class SeedSummary:
    created: bool
    courses: int
    outcomes: int
    students: int
    scores: int


def marks_for(student_index: int, outcome_index: int) -> float:
    """Return stable score bands with exact threshold boundary cases."""
    base_scores = (50, 92, 84, 72, 66, 58, 62, 45, 38, 50)
    outcome_offsets = (-4, 3, 8, -7)
    base = base_scores[student_index % len(base_scores)]
    offset = outcome_offsets[outcome_index % len(outcome_offsets)]

    if student_index % 10 in (0, 9):
        return 50
    return float(max(0, min(100, base + offset)))


def _summary(db, created: bool) -> SeedSummary:
    return SeedSummary(
        created=created,
        courses=db.scalar(select(func.count(Course.id))) or 0,
        outcomes=db.scalar(select(func.count(CourseOutcome.id))) or 0,
        students=db.scalar(select(func.count(Student.id))) or 0,
        scores=db.scalar(select(func.count(Score.id))) or 0,
    )


def seed_data() -> SeedSummary:
    """Create the complete demo dataset once and return database counts."""
    init_db()
    db = SessionLocal()
    try:
        seed_codes = {course["code"] for course in COURSE_SEEDS}
        existing_codes = set(
            db.scalars(select(Course.code).where(Course.code.in_(seed_codes))).all()
        )
        if existing_codes:
            if existing_codes != seed_codes:
                raise RuntimeError(
                    "Seed data is partially present; restore a clean database before seeding."
                )
            return _summary(db, created=False)

        if len(STUDENT_NAMES) != 60:
            raise RuntimeError("The seed dataset must contain exactly 60 student names.")

        for course_index, course_seed in enumerate(COURSE_SEEDS):
            course = Course(name=course_seed["name"], code=course_seed["code"])
            course.outcomes = [
                CourseOutcome(code=code, description=description)
                for code, description in course_seed["outcomes"]
            ]
            start = course_index * 20
            course.students = [
                Student(
                    name=STUDENT_NAMES[start + student_index],
                    roll_number=f"23R01A{course_index + 5:02d}{student_index + 1:02d}",
                )
                for student_index in range(20)
            ]
            db.add(course)
            db.flush()

            for student_index, student in enumerate(course.students):
                for outcome_index, outcome in enumerate(course.outcomes):
                    db.add(
                        Score(
                            student_id=student.id,
                            co_id=outcome.id,
                            marks=marks_for(student_index, outcome_index),
                        )
                    )

        db.commit()
        return _summary(db, created=True)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    summary = seed_data()
    action = "created" if summary.created else "already present"
    print(
        f"Seed data {action}: {summary.courses} courses, "
        f"{summary.outcomes} outcomes, {summary.students} students, "
        f"{summary.scores} scores."
    )