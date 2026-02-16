# backend\api\routes\tasks.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from core.db import get_session
from core.security import get_current_user
from models import User, Task
from schemas import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskRead)
def create_task(
    *,
    session: Session = Depends(get_session),
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user)
):
    db_task = Task.model_validate(task_in, update={"userId": current_user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskRead])
def read_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Task).where(Task.userId == current_user.id)
    tasks = session.exec(statement).all()
    return tasks

@router.get("/{id}", response_model=TaskRead)
def read_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    task = session.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return task

@router.put("/{id}", response_model=TaskRead)
def update_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user)
):
    db_task = session.get(Task, id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.userId != current_user.id:
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
    current_user: User = Depends(get_current_user)
):
    db_task = session.get(Task, id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    session.delete(db_task)
    session.commit()
    return {"status": "success"}
