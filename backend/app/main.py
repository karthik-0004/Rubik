from fastapi import FastAPI

from app.database import init_db
from app.routes.health import router as health_router

app = FastAPI(
    title="CO Attainment Calculator API",
    description="Backend foundation for a faculty-focused OBE application.",
    version="0.1.0",
)

app.include_router(health_router, prefix="/api")


@app.on_event("startup")
def initialize_database() -> None:
    init_db()
