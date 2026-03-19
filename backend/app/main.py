from datetime import timedelta

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.database import lifespan
from app.routers import auth, diet, exercises, progress, users, workouts

app = FastAPI(title="Fit Peak API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(workouts.router, prefix="/api/workouts", tags=["workouts"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["exercises"])
app.include_router(diet.router, prefix="/api/diet", tags=["diet"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])


@app.get("/")
async def root():
    return {"message": "Fit Peak API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
