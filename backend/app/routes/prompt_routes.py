from fastapi import APIRouter, HTTPException, Query, status 

from app.dependencies import ServicesDependency, UserDependency
from app.schemas import Prompt, PromptCreate, PromptUpdate, PromptSummary, Comment, CommentCreate, PaginatedResponse
from app.core.exceptions import PromptNotFoundError, DatabaseError, CommentNotFoundError


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
    tags: list[str] | None = Query(None),
    model: str | None = None,
    user_id: str | None = None,
):
    filters = {
        "tags": tags,
        "model": model,
        "user_id": user_id,
    }

    return await services.prompts.get_summary(
        filters=filters,
        page=page,
        limit=limit
    )


@router.get("/{prompt_id}", response_model=Prompt, status_code=status.HTTP_200_OK)
async def get_prompt(prompt_id: str, services: ServicesDependency):
    try:
        return await services.prompts.get_by_id(prompt_id)
    except PromptNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_prompt(prompt: PromptCreate, user: UserDependency, services: ServicesDependency):
    try:
        prompt_id = await services.prompts.create(user.id, prompt)
        return { "message": "New prompt created", "id": prompt_id}
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to create new prompt"
        )


@router.patch("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_prompt(
    prompt_id: str,
    prompt_update: PromptUpdate,
    user: UserDependency,
    services: ServicesDependency
    ):
    try:
        await services.prompts.update(prompt_id, user.id, prompt_update)
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


@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prompt(prompt_id: str, user: UserDependency, services: ServicesDependency):
    try:
        await services.prompts.delete(prompt_id, user.id)
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


@router.get("/{prompt_id}/comments", response_model=list[Comment], status_code=status.HTTP_200_OK)
async def get_comments(prompt_id: str, services: ServicesDependency):
    try:
        return await services.comments.get_prompt_comments(prompt_id)
    except PromptNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )

@router.post("/{prompt_id}/comments", status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment: CommentCreate,
    prompt_id: str,
    user: UserDependency,
    services: ServicesDependency
    ):
    comment_id = await services.comments.create(prompt_id, user.id, comment) 
    return { "message": "New comment created", "id": comment_id}


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: str, user: UserDependency, services: ServicesDependency):
    try:
        await services.comments.delete(comment_id, user.id)
    except CommentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
