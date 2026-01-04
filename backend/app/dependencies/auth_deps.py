from typing import Annotated

from fastapi import HTTPException, Request, status
from fastapi.params import Depends
from jwt import ExpiredSignatureError, PyJWTError, InvalidTokenError

from app.dependencies import ServicesDependency
from app.core.security import decode_access_token
from app.schemas.user_schema import User
from app.core.exceptions import UserNotFoundError


async def get_current_user(
    request: Request,
    services: ServicesDependency,
):
    cookie_token = request.cookies.get("access_token")

    if not cookie_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(cookie_token)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    

    user_id: str = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user = await services.user.get_by_id(user_id)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    return user


UserDependency = Annotated[User, Depends(get_current_user)]
