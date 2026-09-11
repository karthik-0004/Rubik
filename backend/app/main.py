from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routes.course_outcomes import router as course_outcomes_router
from app.routes.courses import router as courses_router
from app.routes.health import router as health_router
from app.routes.scores import router as scores_router
from app.routes.students import router as students_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    del app
    init_db()
    yield


app = FastAPI(
    title="CO Attainment Calculator API",
    description="Backend foundation for a faculty-focused OBE application.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(courses_router, prefix="/api")
app.include_router(course_outcomes_router, prefix="/api")
app.include_router(students_router, prefix="/api")
app.include_router(scores_router, prefix="/api")
