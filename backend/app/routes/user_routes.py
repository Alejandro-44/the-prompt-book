from typing import Annotated

from fastapi import APIRouter, Path, Query, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId

from app.dependencies import UserDependency, ServicesDependency
from app.schemas import PromptSummary, User, PrivateUser, UpdateUser, PaginatedResponse
from app.core.exceptions import UserNotFoundError, UnauthorizedError, DatabaseError

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me/", response_model=PrivateUser)
async def get_me(current_user: UserDependency):
    """
    Get current logged in user
    """
    return current_user


@router.get("/me/prompts/", response_model=PaginatedResponse[PromptSummary], summary="Get my prompts")
async def get_my_prompts(
    current_user: UserDependency,
    services: ServicesDependency,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    tags: list[str] | None = Query(None),
    model: str | None = None):
    """
    Get prompts created by the current user
    """
    filters = {
        "tags": tags,
        "model": model,
        "author_id": ObjectId(current_user.id),
    }

    return await services.prompts.get_summary(
        filters=filters,
        page=page,
        limit=limit
    )


@router.delete("/me/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(user: UserDependency, service: ServicesDependency):
    deactivated = await service.user.deactivate(ObjectId(user.id))
    if deactivated:
        await service.prompts.update_author_data(ObjectId(user.id), new_name="deleted user", new_handle="deleted")
        await service.comments.update_author_data(ObjectId(user.id), new_name="deleted user", new_handle="deleted")


@router.get("/{user_handle}/", response_model=User)
async def get_user(
    user_handle: Annotated[str, Path(title="The handle of a user", max_length=30)],
    service: ServicesDependency):
    try:
        return await service.user.get_one({ "handle": user_handle, "is_active": True })
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


@router.get("/{user_handle}/prompts/", response_model=PaginatedResponse[PromptSummary], summary="Get user prompts")
async def get_user_prompts(
    user_handle: Annotated[str, Path(title="The handle of a user", max_length=30)],
    services: ServicesDependency,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    tags: list[str] | None = Query(None),
    model: str | None = Query(None),
    liked_by: str | None = Query(None)
):
    """
    Get prompts created by a specific user
    """
    try:
        filters = {
            "tags": tags,
            "model": model,
            "author_handle": user_handle
        }

        if liked_by:
            filters["liked_by"] = ObjectId(liked_by)

        return await services.prompts.get_summary(
            filters=filters,
            page=page,
            limit=limit
        )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user id"
        )


@router.patch("/{user_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def update_user(
    user_id: str,
    user_data: UpdateUser,
    current_user: UserDependency,
    services: ServicesDependency
):
    try:
        updated = await services.user.update(ObjectId(user_id), current_user, user_data)
        if updated:
            await services.prompts.update_author_data(
                ObjectId(user_id),
                new_name=user_data.username,
            )
            await services.comments.update_author_data(
                ObjectId(user_id),
                new_name=user_data.username,
            )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user id"
        )
    except UnauthorizedError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this resource"
        )
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
