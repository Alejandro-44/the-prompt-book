import pytest
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from app.services.comments_service import CommentsService
from app.core.exceptions import CommentNotFoundError, DatabaseError
from app.schemas import CommentCreate, CommentUpdate, Comment

pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


MOCK_PROMPT_ID = "507f1f77bcf86cd799439011"
MOCK_USER_ID = "507f1f77bcf86cd799439012"
MOCK_COMMENT_ID = "507f1f77bcf86cd799439013"


@pytest.fixture
def service(service_factory):
    return service_factory(CommentsService)


async def test_get_prompt_comments_returns_comment_models(service, mock_repo):
    mock_repo.get_by_prompt.return_value = [
        {
            "_id": ObjectId(),
            "content": "Nice prompt",
            "pub_date": datetime.now(),
            "prompt_id": ObjectId(MOCK_PROMPT_ID),
            "user_id": ObjectId(MOCK_USER_ID),
            "author": "johndoe"
        }
    ]

    result = await service.get_prompt_comments(MOCK_PROMPT_ID)

    mock_repo.get_by_prompt.assert_awaited_once_with(MOCK_PROMPT_ID)
    assert len(result) == 1
    assert isinstance(result[0], Comment)


async def test_get_prompt_comments_invalid_prompt_id_raises_error(
    service, mock_repo
):
    mock_repo.get_by_prompt.side_effect = InvalidId()

    with pytest.raises(DatabaseError):
        await service.get_prompt_comments("bad-id")


async def test_create_comment_adds_required_fields(service, mock_repo):
    comment_in = CommentCreate(content="Hello world")
    mock_repo.create.return_value = MOCK_COMMENT_ID

    result = await service.create(
        MOCK_PROMPT_ID,
        MOCK_USER_ID,
        comment_in,
    )

    assert result == MOCK_COMMENT_ID
    mock_repo.create.assert_awaited_once()

    (payload,), _ = mock_repo.create.call_args

    assert payload["content"] == "Hello world"
    assert payload["prompt_id"] == ObjectId(MOCK_PROMPT_ID)
    assert payload["user_id"] == ObjectId(MOCK_USER_ID)
    assert isinstance(payload["pub_date"], datetime)


async def test_update_comment_success(service, mock_repo):
    mock_repo.update.return_value = True

    update_data = CommentUpdate(content="Updated")

    result = await service.update(
        MOCK_COMMENT_ID,
        MOCK_USER_ID,
        update_data,
    )

    mock_repo.update.assert_awaited_once_with(
        MOCK_COMMENT_ID,
        MOCK_USER_ID,
        {"content": "Updated"},
    )

    assert result is True


async def test_update_comment_not_found_raises_error(
    service, mock_repo
):
    mock_repo.update.return_value = False

    with pytest.raises(CommentNotFoundError):
        await service.update(
            MOCK_COMMENT_ID,
            MOCK_USER_ID,
            CommentUpdate(content="Test"),
        )


async def test_delete_comment_success(service, mock_repo):
    mock_repo.delete.return_value = True

    result = await service.delete(
        MOCK_COMMENT_ID,
        MOCK_USER_ID,
    )

    mock_repo.delete.assert_awaited_once_with(
        MOCK_COMMENT_ID,
        MOCK_USER_ID,
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

  