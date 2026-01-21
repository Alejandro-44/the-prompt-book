from datetime import datetime

import pytest

from bson import ObjectId

from app.services.prompts_service import PromptsService
from app.core.exceptions import PromptNotFoundError, DatabaseError, PromptOwnershipError
from app.schemas import PromptCreate, PromptUpdate, PromptSummary, Prompt, User


pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


MOCK_PROMPT_ID = "507f1f77bcf86cd799439011"
MOCK_USER_ID = "507f1f77bcf86cd799439012"
MOCK_RANDOM_ID = "507f1f77bcf86cd799439013"


@pytest.fixture
def likes_repo(mocker):
    return mocker.AsyncMock()


@pytest.fixture
def prompts_repo(mocker):
    return mocker.AsyncMock()


@pytest.fixture
def service(likes_repo, prompts_repo) -> PromptsService:
    return PromptsService(prompts_repo, likes_repo)


@pytest.fixture
def mock_prompt():
    return {
        "_id": ObjectId(MOCK_PROMPT_ID),
        "title": "Test Prompt",
        "description": "this is a test prompt",
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "hashtags": ["tag1"],
        "pub_date": "2024-01-01T00:00:00Z",
        "author_id": ObjectId(MOCK_USER_ID),
        "author_name": "user",
        "author_handle": "user",
        "likes_count": 0,
    }


async def test_get_summary_returns_metadata_query(service, prompts_repo):
    prompts_repo.get_summary.return_value = ([{
        "_id": ObjectId(),
        "title": "Test Prompt",
        "description": "Test description",
        "hashtags": ["tag1"],
        "model": "gpt-4",
        "pub_date": "2024-01-01T00:00:00Z",
        "author_id": ObjectId(),
        "author_name": "user1",
        "author_handle": "user1",
        "likes_count": 0,
    },
    {
        "_id": ObjectId(),
        "title": "Test Prompt 2",
        "description": "Test description",
        "hashtags": ["tag2"],
        "model": "gpt-3.5",
        "pub_date": "2024-01-02T00:00:00Z",
        "author_id": ObjectId(),
        "author_name": "user2",
        "author_handle": "user2",
        "likes_count": 0,
    }], 2 )

    result = await service.get_summary(filters={}, page=2, limit=2)
    prompts_repo.get_summary.assert_awaited_once_with({}, 2, 2)

    prompts = result["items"]

    assert len(prompts) == 2
    assert result["total"] == 2
    assert result["limit"] == 2
    assert result["page"] == 2
    assert result["pages"] == 1

    for prompt in prompts:
        PromptSummary.model_validate(prompt)


async def test_get_one(service, prompts_repo, mock_prompt):
    prompts_repo.get_one.return_value = mock_prompt

    result = await service.get_one(ObjectId(MOCK_PROMPT_ID))
    prompts_repo.get_one.assert_awaited_once_with(ObjectId(MOCK_PROMPT_ID))
    Prompt.model_validate(result)


async def test_get_by_id_empty_response_raise_not_found(service, prompts_repo):
    prompts_repo.get_one.return_value = {}

    with pytest.raises(PromptNotFoundError):
        await service.get_one(ObjectId(MOCK_PROMPT_ID))


async def test_get_one_with_like_by_me(service, prompts_repo, likes_repo, mock_prompt):
    prompts_repo.get_one.return_value = mock_prompt
    likes_repo.get_prompt_ids_by_user.return_value = [ObjectId(MOCK_PROMPT_ID)]
    user = User(id=MOCK_USER_ID, handle="user", username="user", is_active=True)

    result = await service.get_one(ObjectId(MOCK_PROMPT_ID), user)
    Prompt.model_validate(result)
    assert result.like_by_me == True


async def test_create_adds_user_id_pub_date_and_author_data(service, prompts_repo):
    prompt_in = PromptCreate(
        title="Title",
        description="This is a test #ai #nlp",
        prompt="Test prompt",
        result_example="something incredible",
        model="gpt-4",
    )

    user = User(
        id=MOCK_USER_ID,
        username="john doe",
        handle="john_doe",
        is_active=True
    )

    prompts_repo.create.return_value = "some-id"

    result = await service.create(user, prompt_in)

    assert result == "some-id"
    prompts_repo.create.assert_awaited_once()

    (payload,), _ = prompts_repo.create.call_args

    assert payload["title"] == "Title"
    assert payload["model"] == "gpt-4"
    assert payload["hashtags"] == ["ai", "nlp"]
    assert isinstance(payload["pub_date"], datetime)
    assert payload["author_id"] == ObjectId(user.id)
    assert payload["author_name"] == user.username
    assert payload["author_handle"] == user.handle


async def test_create_prompt_database_error(service, prompts_repo):
    prompt_in = PromptCreate(
        title="Title",
        description="This is a test prompt #test",
        prompt="Do something",
        result_example="Example",
        model="gpt-4",
    )

    user = User(
        id=MOCK_USER_ID,
        username="john doe",
        handle="john_doe",
        is_active=True
    )


    prompts_repo.create.side_effect = Exception("DB failure")

    with pytest.raises(DatabaseError):
        await service.create(user, prompt_in)


async def test_update_prompt_success(service, prompts_repo, mock_prompt):
    prompts_repo.get_one.return_value = mock_prompt
    prompts_repo.update.return_value = True

    update_data = PromptUpdate(title="New Title")
    result = await service.update(ObjectId(MOCK_PROMPT_ID), ObjectId(MOCK_USER_ID), update_data)

    prompts_repo.get_one.assert_awaited_once_with(ObjectId(MOCK_PROMPT_ID))
    prompts_repo.update.assert_awaited_once()
    assert result is True


async def test_update_prompt_with_not_owner_user_unauthorized(service, prompts_repo, mock_prompt):
    prompts_repo.get_one.return_value = mock_prompt

    update_data = PromptUpdate(title="New Title")
    with pytest.raises(PromptOwnershipError):
        await service.update(ObjectId(MOCK_PROMPT_ID), ObjectId(MOCK_RANDOM_ID), update_data)


async def test_update_prompt_not_found(service, prompts_repo):
    prompts_repo.get_one.side_effect = PromptNotFoundError()
    update_data = PromptUpdate(title="New Title")

    with pytest.raises(PromptNotFoundError):
        await service.update(ObjectId(MOCK_RANDOM_ID), ObjectId(MOCK_USER_ID), update_data)


async def test_update_prompt_raise_error_on_data_layer(service, prompts_repo, mock_prompt):
    prompts_repo.get_one.return_value = mock_prompt
    prompts_repo.update.side_effect = Exception()

    update_data = PromptUpdate(title="Same Title")
    with pytest.raises(DatabaseError):
        await service.update(ObjectId(MOCK_PROMPT_ID), ObjectId(MOCK_USER_ID), update_data)


async def test_delete_prompt_success(service, prompts_repo, mock_prompt):
    prompts_repo.get_one.return_value = mock_prompt
    prompts_repo.delete.return_value = True

    result = await service.delete(ObjectId(MOCK_PROMPT_ID), ObjectId(MOCK_USER_ID))

    assert result is True


async def test_delete_prompt_not_found(service, prompts_repo):
    prompts_repo.get_one.side_effect = PromptNotFoundError()

    with pytest.raises(PromptNotFoundError):
        await service.delete(ObjectId(MOCK_RANDOM_ID), ObjectId(MOCK_USER_ID))


async def test_delete_prompt_with_not_owner_user_unauthorized(service, prompts_repo, mock_prompt):
    prompts_repo.get_one.return_value = mock_prompt

    update_data = PromptUpdate(title="New Title")
    with pytest.raises(PromptOwnershipError):
        await service.update(ObjectId(MOCK_PROMPT_ID), ObjectId(MOCK_RANDOM_ID), update_data)
