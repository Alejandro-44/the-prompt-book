from datetime import datetime

import pytest

from bson import ObjectId
from bson.errors import InvalidId

from app.services.prompts_service import PromptsService
from app.core.exceptions import PromptNotFoundError, DatabaseError, UnauthorizedError, PromptOwnershipError
from app.schemas.prompt_schema import PromptCreate, PromptUpdate, PromptSummary, Prompt


pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


MOCK_PROMPT_ID = "507f1f77bcf86cd799439011"
MOCK_USER_ID = "507f1f77bcf86cd799439012"
MOCK_RANDOM_ID = "507f1f77bcf86cd799439013"


@pytest.fixture
def service(service_factory):
    return service_factory(PromptsService)


@pytest.fixture
def mock_prompt():
    return {
        "_id": ObjectId(MOCK_PROMPT_ID),
        "title": "Test Prompt",
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "tags": ["tag1"],
        "pub_date": "2024-01-01T00:00:00Z",
        "author": {
            "_id": ObjectId(MOCK_USER_ID),
            "username": "user",
            "email": "user@example.com",
            "is_active": True
        }
    }


async def test_get_summary_returns_metadata_query(service, mock_repo):
    mock_repo.get_summary.return_value = ([{
        "_id": ObjectId(),
        "title": "Test Prompt",
        "tags": ["tag1"],
        "model": "gpt-4",
        "pub_date": "2024-01-01T00:00:00Z",
        "author_id": ObjectId(),
        "author_name": "user1"
    },
    {
        "_id": ObjectId(),
        "title": "Test Prompt 2",
        "tags": ["tag2"],
        "model": "gpt-3.5",
        "pub_date": "2024-01-02T00:00:00Z",
        "author_id": ObjectId(),
        "author_name": "user2"
    }], 2 )

    result = await service.get_summary(filters={}, page=2, limit=2)
    mock_repo.get_summary.assert_awaited_once_with({}, 2, 2)

    prompts = result["items"]

    assert len(prompts) == 2
    assert result["total"] == 2
    assert result["limit"] == 2
    assert result["page"] == 2
    assert result["pages"] == 1

    for prompt in prompts:
        PromptSummary.model_validate(prompt)


async def test_get_one(service, mock_repo):
    mock_repo.get_one.return_value = {
        "_id": ObjectId(MOCK_PROMPT_ID),
        "title": "Test Prompt",
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "tags": ["tag1"],
        "pub_date": "2024-01-01T00:00:00Z",
        "author": {
            "_id": ObjectId(MOCK_USER_ID),
            "username": "user",
            "email": "user@example.com",
            "is_active": True
        }
    }

    result = await service.get_one(MOCK_PROMPT_ID)
    Prompt.model_validate(result)


async def test_get_by_id_empty_response_raise_not_found(service, mock_repo):
    mock_repo.get_one.return_value = {}

    with pytest.raises(PromptNotFoundError):
        await service.get_one(MOCK_RANDOM_ID)


async def test_bad_id_raise_not_found(service, mock_repo):
    mock_repo.get_one.side_effect = InvalidId("Invalid ObjectId")

    with pytest.raises(PromptNotFoundError):
        await service.get_one("")

    mock_repo.get_one.assert_awaited_once_with("")


async def test_create_adds_user_id_and_pub_date(service, mock_repo):
    prompt_in = PromptCreate(
        title="Title",
        prompt="Do something",
        result_example="Example",
        model="gpt-4",
        tags=["tag1"],
    )

    mock_repo.create.return_value = "some-id"

    result = await service.create(MOCK_USER_ID, prompt_in)

    assert result == "some-id"
    mock_repo.create.assert_awaited_once()

    (payload,), _ = mock_repo.create.call_args

    assert payload["title"] == "Title"
    assert payload["model"] == "gpt-4"
    assert payload["tags"] == ["tag1"]
    assert payload["user_id"] == ObjectId(MOCK_USER_ID)
    assert "pub_date" in payload
    assert isinstance(payload["pub_date"], datetime)


async def test_create_prompt_database_error(service, mock_repo):
    prompt_in = PromptCreate(
        title="Title",
        prompt="Do something",
        result_example="Example",
        model="gpt-4",
        tags=["tag1"]
    )
    mock_repo.create.side_effect = Exception("DB failure")

    with pytest.raises(DatabaseError):
        await service.create(MOCK_USER_ID, prompt_in)


async def test_update_prompt_success(service, mock_repo, mock_prompt):
    mock_repo.get_one.return_value = mock_prompt
    mock_repo.update.return_value = True

    update_data = PromptUpdate(title="New Title")
    result = await service.update(MOCK_PROMPT_ID, MOCK_USER_ID, update_data)

    mock_repo.get_one.assert_awaited_once()
    mock_repo.update.assert_awaited_once()
    assert result is True

async def test_update_prompt_with_not_owner_user_unauthorized(service, mock_repo, mock_prompt):
    mock_repo.get_one.return_value = mock_prompt
    mock_repo.update.return_value = True

    update_data = PromptUpdate(title="New Title")
    with pytest.raises(PromptOwnershipError):
        await service.update(MOCK_PROMPT_ID, MOCK_RANDOM_ID, update_data)


async def test_update_prompt_not_found(service, mock_repo):
    mock_repo.get_one.side_effect = PromptNotFoundError()
    update_data = PromptUpdate(title="New Title")

    with pytest.raises(PromptNotFoundError):
        await service.update(MOCK_RANDOM_ID, MOCK_USER_ID, update_data)


async def test_update_prompt_raise_error_on_data_layer(service, mock_repo, mock_prompt):
    mock_repo.get_one.return_value = mock_prompt
    mock_repo.update.side_effect = Exception()

    update_data = PromptUpdate(title="Same Title")
    with pytest.raises(DatabaseError):
        await service.update(MOCK_PROMPT_ID, MOCK_USER_ID, update_data)


async def test_delete_prompt_success(service, mock_repo, mock_prompt):
    mock_repo.get_one.return_value = mock_prompt
    mock_repo.delete.return_value = True

    result = await service.delete(MOCK_PROMPT_ID, MOCK_USER_ID)

    assert result is True


async def test_delete_prompt_not_found(service, mock_repo):
    mock_repo.get_one.side_effect = PromptNotFoundError()

    with pytest.raises(PromptNotFoundError):
        await service.delete(MOCK_USER_ID, MOCK_RANDOM_ID)
