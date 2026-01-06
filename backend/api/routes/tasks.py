from typing import List
from fastapi import APIRouter, HTTPException, Header, Depends
from sqlmodel import Session, select

from core.db import get_session
from models import User, Task
from schemas import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Helper function to get user by email
def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

@router.post("/", response_model=TaskRead)
def create_task(
    *,
    session: Session = Depends(get_session),
    task_in: TaskCreate,
    x_user_email: str = Header(None)  # Get user email from header
):
    # Get user by email from header (sent from frontend)
    if not x_user_email:
        # For development, create a demo user if none provided
        user = get_user_by_email(session, "demo@example.com")
        if not user:
            user = User(id="demo-user", email="demo@example.com", name="Demo User", emailVerified=False)
            session.add(user)
            session.commit()
    else:
        user = get_user_by_email(session, x_user_email)
        if not user:
            # Create user if doesn't exist
            user = User(id=x_user_email.split("@")[0], email=x_user_email, name=x_user_email.split("@")[0], emailVerified=False)
            session.add(user)
            session.commit()

    db_task = Task.model_validate(task_in, update={"user_id": user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskRead])
def read_tasks(
    session: Session = Depends(get_session),
    x_user_email: str = Header(None)
):
    if not x_user_email:
        # Return empty list for demo
        return []

    user = get_user_by_email(session, x_user_email)
    if not user:
        return []

    statement = select(Task).where(Task.user_id == user.id)
    tasks = session.exec(statement).all()
    return tasks

@router.get("/{id}", response_model=TaskRead)
def read_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    x_user_email: str = Header(None)
):
    task = session.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if x_user_email:
        user = get_user_by_email(session, x_user_email)
        if user and task.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    return task

@router.put("/{id}", response_model=TaskRead)
def update_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    task_in: TaskUpdate,
    x_user_email: str = Header(None)
):
    db_task = session.get(Task, id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if x_user_email:
        user = get_user_by_email(session, x_user_email)
        if user and db_task.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

    task_data = task_in.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.delete("/{id}")
def delete_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    x_user_email: str = Header(None)
):
    db_task = session.get(Task, id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if x_user_email:
        user = get_user_by_email(session, x_user_email)
        if user and db_task.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(db_task)
    session.commit()
    return {"status": "success"}
