from pydantic import BaseModel, ConfigDict, Field


class CourseBase(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=200)


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class CourseOutcomeBase(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=500)


class CourseOutcomeCreate(CourseOutcomeBase):
    course_id: int


class CourseOutcomeResponse(CourseOutcomeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_id: int


class StudentBase(BaseModel):
    roll_number: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=200)


class StudentCreate(StudentBase):
    course_id: int


class StudentResponse(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_id: int


class ScoreBase(BaseModel):
    marks: float = Field(ge=0)


class ScoreCreate(ScoreBase):
    student_id: int
    co_id: int


class ScoreResponse(ScoreBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    co_id: int
