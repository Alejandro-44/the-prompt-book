from typing import Annotated

from fastapi import HTTPException, Request, status
from fastapi.params import Depends
from jwt import ExpiredSignatureError, PyJWTError, InvalidTokenError
from bson import ObjectId

from app.dependencies import ServicesDependency
from app.core.security import decode_access_token
from app.schemas.user_schema import User
from app.core.exceptions import UserNotFoundError


async def get_optional_user(
    request: Request,
    services: ServicesDependency,
) -> User | None:
    cookie_token = request.cookies.get("access_token")

    if not cookie_token:
        return None

    try:
        payload = decode_access_token(cookie_token)
    except ExpiredSignatureError:
        return None
    except InvalidTokenError:
        return None
    except PyJWTError:
        return None
    

    user_id: str = payload.get("sub")

    if not user_id:
        return None

    try:
        user = await services.user.get_one({ 
            "id": ObjectId(user_id),
            "is_active": True 
        })
    except UserNotFoundError:
        return None
    
    return user


OptionalUserDependency = Annotated[User | None, Depends(get_optional_user)]
