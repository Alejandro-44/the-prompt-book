import pytest
from bson import ObjectId
from app.schemas import PromptCreate, PromptUpdate, Prompt, PromptSummary, User
from app.core.exceptions import PromptNotFoundError, PromptOwnershipError

pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


async def test_create_prompt_success(services, seed_data, user_ids):
    prompt_in = PromptCreate(
        title="Test prompt",
        prompt="Test prompt",
        result_example="something incredible",
        model="ChatGPT",
        tags=["ai", "nlp"],
    )

    test_user_data = seed_data["users"][0]
    test_user = User(
        id=str(test_user_data["_id"]),
        username=test_user_data["username"],
        handle=test_user_data["handle"],
        is_active=test_user_data["is_active"]
    )

    prompt_id = await services.prompts.create(
        test_user, prompt_in
    )

    assert isinstance(prompt_id, str)

    prompt = await services.prompts.get_one(ObjectId(prompt_id))
    Prompt.model_validate(prompt)

    assert prompt.title == "Test prompt"
    assert prompt.author_name == test_user.username
    assert prompt.author_handle == test_user.handle
    assert prompt.model == "ChatGPT"

async def test_get_summary_returns_paginated_prompts(
    services, seed_data
):
    result = await services.prompts.get_summary(
        {}, page=1, limit=10
    )

    prompts = result["items"]

    for prompt in prompts:
        PromptSummary.model_validate(prompt)

    assert len(prompts) == 10
    assert result["page"] == 1
    assert result["total"] == 18
    assert result["pages"] == 2


async def test_get_by_user_id_returns_only_user_prompts(
    services, seed_data, user_ids
):
    result = await services.prompts.get_summary(
        {"author_id": user_ids["alex"]}, page=1, limit=10
    )

    prompts = result["items"]

    for prompt in prompts:
        PromptSummary.model_validate(prompt)

    assert len(prompts) == 4
    assert result["page"] == 1
    assert result["total"] == 4
    assert result["pages"] == 1


async def test_get_one_returns_prompt_sucessfully(services, seed_data, prompt_ids):
    prompt_id = prompt_ids["matt_prompt"]

    prompt = await services.prompts.get_one(prompt_id)

    prompt = Prompt.model_validate(prompt)
    assert prompt.id == str(prompt_id)
    assert prompt.author_name == "matt_coder"
    assert prompt.author_handle == "matt_coder"


async def test_get_one_not_found_raises_error(
    services, seed_data
):
    with pytest.raises(PromptNotFoundError):
        await services.prompts.get_one(ObjectId())


async def test_update_prompt_success(
    services, seed_data, user_ids, prompt_ids
):
    update_data = PromptUpdate(title="New Title", model="Claude")

    result = await services.prompts.update(
        prompt_ids["matt_prompt"],
        user_ids["matt"],
        update_data,
    )

    assert result is True

    updated_prompt = await services.prompts.get_one(
        prompt_ids["matt_prompt"]
    )

    assert updated_prompt.title == "New Title"
    assert updated_prompt.model == "Claude"


async def test_update_prompt_not_found_raises_error(
    services, seed_data
):
    with pytest.raises(PromptNotFoundError):
        await services.prompts.update(
            str(ObjectId()),
            str(ObjectId()),
            PromptUpdate(title="Test"),
        )


async def test_update_prompt_do_not_owner_raises_error(
    services, seed_data, user_ids, prompt_ids
):
    with pytest.raises(PromptOwnershipError):
        await services.prompts.update(
            prompt_ids["not_owner_prompt"],
            user_ids["matt"],
            PromptUpdate(title="Test"),
        )


async def test_delete_prompt_success(
    services, seed_data, user_ids, prompt_ids
):
    result = await services.prompts.delete(
        prompt_ids["luna_prompt"],
        user_ids["luna"],
    )

    assert result is True

    with pytest.raises(PromptNotFoundError):
        await services.prompts.get_one(prompt_ids["luna_prompt"])


async def test_delete_prompt_do_not_owner_raises_error(
    services, seed_data, user_ids, prompt_ids
):
    with pytest.raises(PromptOwnershipError):
        await services.prompts.delete(
            prompt_ids["not_owner_prompt"],
            user_ids["luna"],
        )
