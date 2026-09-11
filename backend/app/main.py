from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import init_db
from app.routes.health import router as health_router


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

app.include_router(health_router, prefix="/api")
