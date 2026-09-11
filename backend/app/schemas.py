from pydantic import BaseModel, ConfigDict, Field


class CourseBase(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=200)


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    code: str | None = Field(default=None, min_length=1, max_length=50)
    name: str | None = Field(default=None, min_length=1, max_length=200)


class CourseResponse(CourseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class CourseOutcomeBase(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=500)


class CourseOutcomeCreate(CourseOutcomeBase):
    pass


class CourseOutcomeUpdate(BaseModel):
    code: str | None = Field(default=None, min_length=1, max_length=50)
    description: str | None = Field(default=None, min_length=1, max_length=500)


class CourseOutcomeResponse(CourseOutcomeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_id: int


class StudentBase(BaseModel):
    roll_number: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=200)


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    roll_number: str | None = Field(default=None, min_length=1, max_length=50)
    name: str | None = Field(default=None, min_length=1, max_length=200)


class StudentResponse(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_id: int


class ScoreBase(BaseModel):
    marks: float = Field(ge=0)


class ScoreCreate(ScoreBase):
    student_id: int
    co_id: int


class ScoreUpdate(BaseModel):
    student_id: int | None = None
    co_id: int | None = None
    marks: float | None = Field(default=None, ge=0)


class ScoreResponse(ScoreBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    co_id: int
