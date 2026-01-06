# backend\core\security.py
from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session as DBSession, select

from core.db import engine
from models import User, Session as AuthSession

reusable_oauth2 = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(reusable_oauth2)) -> User:
    with DBSession(engine) as session:
        # Look up the token in the AuthSession table
        statement = select(AuthSession).where(AuthSession.token == token.credentials)
        auth_session = session.exec(statement).first()

        # Validation: Check if session exists and is not expired
        if not auth_session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session token",
            )

        # Use timezone-aware datetime for comparison
        if auth_session.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
            )

        # Fetch the associated User
        user = session.get(User, auth_session.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return user