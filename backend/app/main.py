from fastapi import FastAPI

from app.routes.health import router as health_router

app = FastAPI(
    title="CO Attainment Calculator API",
    description="Backend foundation for a faculty-focused OBE application.",
    version="0.1.0",
)

app.include_router(health_router, prefix="/api")
