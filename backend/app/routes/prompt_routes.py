from fastapi import APIRouter, HTTPException, Query, status 
from bson import ObjectId
from bson.errors import InvalidId

from app.dependencies import ServicesDependency, UserDependency
from app.schemas import Prompt, PromptCreate, PromptUpdate, PromptSummary, Comment, CommentCreate, PaginatedResponse
from app.core.exceptions import PromptNotFoundError, DatabaseError, CommentNotFoundError, PromptOwnershipError


router = APIRouter(prefix="/prompts", tags=["Prompts"])


@router.get(
    "/",
    response_model=PaginatedResponse[PromptSummary],
    status_code=status.HTTP_200_OK
)
async def get_prompts(
    services: ServicesDependency,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    hashtags: list[str] | None = Query(None),
    model: str | None = None,
    author_handle: str | None = Query(None, max_length=30),
):
    filters = {
        "hashtags": hashtags,
        "model": model,
        "author_handle": author_handle,
    }

    return await services.prompts.get_summary(
        filters=filters,
        page=page,
        limit=limit
    )


@router.get(
    "/{prompt_id}",
    response_model=Prompt,
    status_code=status.HTTP_200_OK
)
async def get_prompt(prompt_id: str, services: ServicesDependency):
    try:
        return await services.prompts.get_one(ObjectId(prompt_id))
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid prompt id"
        )
    except PromptNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
async def create_prompt(
    prompt: PromptCreate,
    user: UserDependency,
    services: ServicesDependency):
    try:
        prompt_id = await services.prompts.create(user, prompt)
        return { "message": "New prompt created", "id": prompt_id}
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to create new prompt"
        )


@router.patch(
    "/{prompt_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def update_prompt(
    prompt_id: str,
    prompt_update: PromptUpdate,
    user: UserDependency,
    services: ServicesDependency
    ):
    try:
        await services.prompts.update(ObjectId(prompt_id), ObjectId(user.id), prompt_update)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid prompt id"
        )
    except PromptOwnershipError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    except PromptNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to update prompt"
        )


@router.delete(
    "/{prompt_id}", 
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_prompt(
    prompt_id: str,
    user: UserDependency,
    services: ServicesDependency
):
    try:
        await services.prompts.delete(ObjectId(prompt_id), ObjectId(user.id))
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid prompt id"
        )
    except PromptOwnershipError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    except PromptNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to delete new prompt"
        )


@router.get(
    "/{prompt_id}/comments",
    response_model=list[Comment],
    status_code=status.HTTP_200_OK
)
async def get_comments(
    prompt_id: str,
    services: ServicesDependency
):
    try:
        return await services.comments.get_prompt_comments(ObjectId(prompt_id))
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid prompt id"
        )
    except PromptNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )


@router.post(
    "/{prompt_id}/comments",
    status_code=status.HTTP_201_CREATED
)
async def create_comment(
    prompt_id: str,
    comment: CommentCreate,
    user: UserDependency,
    services: ServicesDependency
):
    try:
        comment_id = await services.comments.create(
            ObjectId(prompt_id),
            user,
            comment
        )
        return { "message": "New comment created", "id": comment_id}
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid prompt id"
        )
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to create new comment"
        )
        


@router.delete(
    "/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_comment(
    comment_id: str,
    user: UserDependency,
    services: ServicesDependency
):
    try:
        await services.comments.delete(ObjectId(comment_id), ObjectId(user.id))
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid prompt id"
        )
    except CommentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
