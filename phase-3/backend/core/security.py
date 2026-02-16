# backend\core\security.py
from datetime import datetime, timezone  # UTC ki jagah timezone import karein
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session as DBSession, select

from .db import engine
from models import User, Session as AuthSession

reusable_oauth2 = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(reusable_oauth2)) -> User:
    with DBSession(engine) as session:
        # Look up the token in the AuthSession table
        statement = select(AuthSession).where(AuthSession.token == token.credentials)
        auth_session = session.exec(statement).first()
        
        # Validation: Check if session exists
        if not auth_session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session token",
            )
        
        # FIX: Comparison Error solve karne ke liye dono ko aware banayein
        # Agar expiresAt naive hai, toh usme UTC force karein (.replace)
        expires_at = auth_session.expiresAt
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
            
        current_time = datetime.now(timezone.utc)

        if expires_at < current_time:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
            )
        
        # Fetch the associated User
        user = session.get(User, auth_session.userId)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
            
        return user