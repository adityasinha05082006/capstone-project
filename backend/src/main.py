from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Task(BaseModel):
    id: int
    title: str
    description: str | None = None
    completed: bool = False


class TaskCreate(BaseModel):
    title: str
    description: str | None = None


app = FastAPI(title="Capstone Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


tasks_db: List[Task] = [
    Task(id=1, title="Define project scope", description="Write the initial requirements", completed=True),
    Task(id=2, title="Build backend API", description="Create the FastAPI endpoints", completed=False),
]


@app.get("/")
def read_root():
    return {"message": "Backend is running", "project": "week12-capstone-project"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/tasks", response_model=List[Task])
def list_tasks():
    return tasks_db


@app.post("/api/tasks", response_model=Task)
def create_task(task: TaskCreate):
    new_task = Task(id=len(tasks_db) + 1, title=task.title, description=task.description, completed=False)
    tasks_db.append(new_task)
    return new_task
