import pytest
from bson import ObjectId
from datetime import datetime

from app.services.comments_service import CommentsService
from app.core.exceptions import CommentNotFoundError
from app.schemas import CommentCreate, CommentUpdate, Comment, User

pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


MOCK_PROMPT_ID = "507f1f77bcf86cd799439011"
MOCK_USER_ID = "507f1f77bcf86cd799439012"
MOCK_COMMENT_ID = "507f1f77bcf86cd799439013"


@pytest.fixture
def service(service_factory) -> CommentsService:
    return service_factory(CommentsService)


async def test_get_prompt_comments_returns_comment_models_paginated(service, mock_repo):
    mock_repo.get_by_prompt.return_value = ([
        {
            "_id": ObjectId(),
            "content": "Nice prompt",
            "pub_date": datetime.now(),
            "prompt_id": ObjectId(MOCK_PROMPT_ID),
            "author_id": ObjectId(MOCK_USER_ID),
            "author_name": "john doe",
            "author_handle": "john_doe",
        }
    ], 1)
    page = 1
    limit = 5
    result = await service.get_prompt_comments(ObjectId(MOCK_PROMPT_ID), page, limit)
    skip = (page - 1) * limit
    mock_repo.get_by_prompt.assert_awaited_once_with(ObjectId(MOCK_PROMPT_ID), skip, limit)

    comments = result["items"]

    assert len(comments) == 1
    assert isinstance(comments[0], Comment)
    assert result["page"] == 1
    assert result["pages"] == 1
    assert result["total"] == 1


async def test_create_comment_adds_required_fields(service, mock_repo):
    comment_in = CommentCreate(content="Hello world")
    user = User(
        id=MOCK_USER_ID,
        username="john doe",
        handle="john_doe",
        is_active=True
    )
    
    mock_repo.create.return_value = MOCK_COMMENT_ID

    result = await service.create(
        ObjectId(MOCK_PROMPT_ID),
        user,
        comment_in,
    )

    assert result == MOCK_COMMENT_ID
    mock_repo.create.assert_awaited_once()

    (payload,), _ = mock_repo.create.call_args

    assert payload["content"] == "Hello world"
    assert payload["prompt_id"] == ObjectId(MOCK_PROMPT_ID)
    assert payload["author_id"] == ObjectId(user.id)
    assert payload["author_name"] == user.username
    assert payload["author_handle"] == user.handle
    assert isinstance(payload["pub_date"], datetime)


async def test_update_comment_success(service, mock_repo):
    mock_repo.update.return_value = True
    
    update_data = CommentUpdate(content="Updated")

    result = await service.update(
        ObjectId(MOCK_COMMENT_ID),
        ObjectId(MOCK_USER_ID),
        update_data,
    )

    mock_repo.update.assert_awaited_once_with(
        ObjectId(MOCK_COMMENT_ID),
        ObjectId(MOCK_USER_ID),
        {"content": "Updated"},
    )

    assert result is True


async def test_update_comment_not_found_raises_error(
    service, mock_repo
):
    mock_repo.update.return_value = False

    with pytest.raises(CommentNotFoundError):
        await service.update(
            ObjectId(MOCK_COMMENT_ID),
            ObjectId(MOCK_USER_ID),
            CommentUpdate(content="Test"),
        )


async def test_delete_comment_success(service, mock_repo):
    mock_repo.delete.return_value = True

    result = await service.delete(
        ObjectId(MOCK_COMMENT_ID),
        ObjectId(MOCK_USER_ID),
    )

    mock_repo.delete.assert_awaited_once_with(
        ObjectId(MOCK_COMMENT_ID),
        ObjectId(MOCK_USER_ID),
    )

    assert result is True


async def test_delete_comment_not_found_raises_error(
    service, mock_repo
):
    mock_repo.delete.return_value = False

    with pytest.raises(CommentNotFoundError):
        await service.delete(
            MOCK_COMMENT_ID,
            MOCK_USER_ID,
        )

  