import pytest
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.services.likes_service import LikesService
from app.core.exceptions import AlreadyLikedError, LikeNotFoundError

pytestmark = [pytest.mark.unit, pytest.mark.asyncio]

MOCK_PROMPT_ID = "507f1f77bcf86cd799439011"
MOCK_USER_ID = "507f1f77bcf86cd799439012"


@pytest.fixture
def likes_repo(mocker):
    return mocker.AsyncMock()


@pytest.fixture
def prompts_repo(mocker):
    return mocker.AsyncMock()


@pytest.fixture
def service(likes_repo, prompts_repo) -> LikesService:
    return LikesService(likes_repo, prompts_repo)


async def test_like_prompt_success(service, likes_repo, prompts_repo):
    prompt_id = ObjectId(MOCK_PROMPT_ID)
    user_id = ObjectId(MOCK_USER_ID)

    await service.like_prompt(prompt_id, user_id)

    likes_repo.create.assert_awaited_once()
    call_args = likes_repo.create.call_args[0][0]
    assert call_args["prompt_id"] == prompt_id
    assert call_args["user_id"] == user_id
    assert "created_at" in call_args

    prompts_repo.increment_likes.assert_awaited_once_with(prompt_id, 1)


async def test_like_prompt_duplicate(service, likes_repo, prompts_repo):
    prompt_id = ObjectId(MOCK_PROMPT_ID)
    user_id = ObjectId(MOCK_USER_ID)

    likes_repo.create.side_effect = DuplicateKeyError("Duplicate")

    with pytest.raises(AlreadyLikedError):
        await service.like_prompt(prompt_id, user_id)

    likes_repo.create.assert_awaited_once()
    prompts_repo.increment_likes.assert_not_awaited()


async def test_unlike_prompt_success(service, likes_repo, prompts_repo):
    prompt_id = ObjectId(MOCK_PROMPT_ID)
    user_id = ObjectId(MOCK_USER_ID)

    likes_repo.delete.return_value = True

    await service.unlike_prompt(prompt_id, user_id)

    likes_repo.delete.assert_awaited_once_with(prompt_id, user_id)
    prompts_repo.increment_likes.assert_awaited_once_with(prompt_id, -1)


async def test_unlike_prompt_not_found(service, likes_repo, prompts_repo):
    prompt_id = ObjectId(MOCK_PROMPT_ID)
    user_id = ObjectId(MOCK_USER_ID)

    likes_repo.delete.return_value = False

    with pytest.raises(LikeNotFoundError):
        await service.unlike_prompt(prompt_id, user_id)

    likes_repo.delete.assert_awaited_once_with(prompt_id, user_id)
    prompts_repo.increment_likes.assert_not_awaited()
