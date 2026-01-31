from fastapi import APIRouter, HTTPException, status, Response
from bson import ObjectId

from app.schemas import (
    User,
    UserLogin,
    UserCreate,
    UpdatePassword,
    Token
)
from app.dependencies import UserDependency, ServicesDependency 
from app.core.exceptions import (
    UserAlreadyExistsError,
    DatabaseError,
    UserNotFoundError,
    UnauthorizedError
)
from app.core.config import settings


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register/", response_model=User, summary="Create new user", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, services: ServicesDependency):
    """
    Create a new user
    """
    try:
        return await services.user.register_user(user)
    except UserAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email aleady registered"
        )
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user in service"
        )



@router.post("/login/", response_model=Token, summary="Login user", status_code=status.HTTP_200_OK)
async def login(
    login: UserLogin,
    response: Response,
    services: ServicesDependency
    ):
    """
    Login with OAuth2 a user and create a cookie with a JWT token
    """
    try:
        token = await services.auth.login(login.email, login.password)
    
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=settings.is_prod,
            samesite="strict",
            path="/"
        )

        return Token(access_token=token)
    except UnauthorizedError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


@router.post("/logout/", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response, current_user: UserDependency):

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=settings.is_prod,
        samesite="strict",
        path="/"
    )


@router.post("/change-password/", summary="Change password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    request: UpdatePassword,
    user: UserDependency,
    services: ServicesDependency
    ):
    """
    Change the password of the current user
    """
    try:
        await services.auth.change_password(ObjectId(user.id), request.old_password, request.new_password)
    except UnauthorizedError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong password"
        )
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )
