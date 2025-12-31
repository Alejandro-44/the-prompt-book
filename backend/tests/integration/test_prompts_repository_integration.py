import pytest
from bson import ObjectId

from app.repositories.prompts_repository import PromptsRepository
from tests.mocks.user_mocks import mock_users
from tests.mocks.prompt_mocks import mock_prompts


@pytest.mark.asyncio
async def test_prompt_lifecycle(db):
    prompts_repo = PromptsRepository(db)

    mock_user_id = ObjectId()
    
    await db.users.insert_one({
        "_id": mock_user_id,
        "username": "testuser",
        "email": "testuser@example.com"
    })

    prompt_mock = {
        "title": "Integration test",
        "prompt": "Write a poem",
        "result_example": "A small poem",
        "model": "gpt-4",
        "tags": ["ai", "poem"],
        "user_id": mock_user_id,
    }

    inserted_id = await prompts_repo.create(prompt_mock)
    assert isinstance(inserted_id, str)

    found_prompt = await prompts_repo.get_by_id(inserted_id)
    assert len(found_prompt) == 1
    assert found_prompt[0]["title"] == "Integration test"

    update_data = { "title": "Updated title" }
    updated = await prompts_repo.update(inserted_id, mock_user_id, update_data)
    assert updated

    updated_prompt = await prompts_repo.get_by_id(inserted_id)
    assert updated_prompt[0]["title"] == "Updated title"

    prompts, total = await prompts_repo.get_summary({}, 0, 1)
    assert len(prompts) == 1
    assert prompts[0]["_id"] == ObjectId(inserted_id)

    deleted = await prompts_repo.delete(inserted_id, mock_user_id)
    assert deleted

    prompts, total = await prompts_repo.get_summary({}, 0, 1)
    assert len(prompts) == 0
    assert total == 0


@pytest.mark.asyncio
async def test_prompt_summary_returns_number_of_items_specified_in_limit(db):
    await db.users.insert_many(mock_users)
    await db.prompts.insert_many(mock_prompts)

    prompts_repo = PromptsRepository(db)
    items, total = await prompts_repo.get_summary({}, 0, 10)

    assert len(items) == 10
    assert total == 18

@pytest.mark.asyncio
async def test_prompt_summary_returns_remain_items_with_specified_skip(db):
    await db.users.insert_many(mock_users)
    await db.prompts.insert_many(mock_prompts)

    prompts_repo = PromptsRepository(db)
    items, total = await prompts_repo.get_summary({}, 10, 10)

    assert len(items) == 8
    assert total == 18


@pytest.mark.asyncio
async def test_prompt_summary_apply_users_filter(db):
    await db.users.insert_many(mock_users)
    await db.prompts.insert_many(mock_prompts)

    prompts_repo = PromptsRepository(db)
    items, total = await prompts_repo.get_summary({ "user_id": "6939872c7f7a423bcb83fe0b" }, 0, 10)

    assert len(items) == 4
    assert total == 4


@pytest.mark.asyncio
async def test_prompt_summary_apply_model_filter(db):
    await db.users.insert_many(mock_users)
    await db.prompts.insert_many(mock_prompts)

    prompts_repo = PromptsRepository(db)
    items, total = await prompts_repo.get_summary({ "model": "gpt-4" }, 0, 10)

    assert len(items) == 8
    assert total == 8


@pytest.mark.asyncio
async def test_prompt_summary_apply_tags_filter(db):
    await db.users.insert_many(mock_users)
    await db.prompts.insert_many(mock_prompts)

    prompts_repo = PromptsRepository(db)
    items, total = await prompts_repo.get_summary({ "tags": ["javascript"] }, 0, 10)

    assert len(items) == 2
    assert total == 2
