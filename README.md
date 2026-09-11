# CO Attainment Calculator

A faculty-focused web application foundation for managing courses, course outcomes, students, scores, and outcome attainment in an Outcome-Based Education (OBE) workflow.

## Technology Stack

- **Backend:** Python 3.10+, FastAPI, SQLAlchemy, SQLite, Pydantic, pytest
- **Frontend:** React, Vite, Tailwind CSS

## High-Level Architecture

- `backend/app/main.py` creates the FastAPI application and registers API routes.
- `backend/app/database.py` owns the SQLite engine and SQLAlchemy session configuration.
- `backend/app/models.py` defines the relational domain model for courses, outcomes, students, and scores.
- `backend/app/schemas.py` contains Pydantic request and response contracts.
- `backend/app/services/` contains business logic that can be tested independently of HTTP routes.
- `frontend/src/api/` will contain browser-to-API communication.
- `frontend/src/components/` and `frontend/src/pages/` provide reusable UI structure and page-level views.

## Planned Features

- Manage courses and their course outcomes.
- Manage students associated with a course.
- Enter and edit student scores for each course outcome.
- Configure an attainment threshold.
- Calculate and display attainment percentage for each course outcome.
- Add focused backend and service-level tests as implementation progresses.

## Local Setup

> To be completed as implementation progresses.

The backend and frontend dependency manifests are included as the starting point for local development. CRUD workflows, calculation behavior, and their setup commands will be documented when those features are implemented.

### Seed development data

From the `backend` directory, run:

```powershell
python -m app.seed
```

This creates three courses, four outcomes per course, 60 students, and 240 scores. Running the command again reports that the complete seed is already present and does not create duplicates.
