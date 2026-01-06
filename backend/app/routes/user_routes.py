from fastapi import APIRouter, Query, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId

from app.dependencies import UserDependency, ServicesDependency
from app.schemas import PromptSummary, User, PaginatedResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=User)
async def get_me(current_user: UserDependency):
    """
    Get current logged in user
    """
    return current_user


@router.get("/me/prompts", response_model=PaginatedResponse[PromptSummary], summary="Get my prompts")
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
        "user_id": ObjectId(current_user.id),
    }

    return await services.prompts.get_summary(
        filters=filters,
        page=page,
        limit=limit
    )


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(user: UserDependency, service: ServicesDependency):
    await service.user.deactivate(ObjectId(user.id))


@router.get("/{user_id}")
async def get_user(user_id: str, service: ServicesDependency):
    try:
        return await service.user.get_one({ "id": ObjectId(user_id) })
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid user id"
        )


@router.get("/{user_id}/prompts", response_model=PaginatedResponse[PromptSummary], summary="Get user prompts")
async def get_user_prompts(
    user_id: str,
    services: ServicesDependency,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    tags: list[str] | None = Query(None),
    model: str | None = None):
    """
    Get prompts created by a specific user
    """
    try:
        filters = {
            "tags": tags,
            "model": model,
            "user_id": ObjectId(user_id),
        }

        return await services.prompts.get_summary(
            filters=filters,
            page=page,
            limit=limit
        )
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid user id"
        )
