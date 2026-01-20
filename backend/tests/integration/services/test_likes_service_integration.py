import pytest
from bson import ObjectId

from app.core.exceptions import AlreadyLikedError, LikeNotFoundError

pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


async def test_like_prompt_success(services, seed_data, user_ids, prompt_ids):
    user_id = user_ids["johndoe"]
    prompt_id = prompt_ids["matt_prompt"]


    prompt_before = await services.prompts.get_one(prompt_id)
    initial_likes = prompt_before.likes_count

    await services.likes.like_prompt(prompt_id, user_id)


    prompt_after = await services.prompts.get_one(prompt_id)
    assert prompt_after.likes_count == initial_likes + 1


async def test_unlike_prompt_success(services, seed_data, user_ids, prompt_ids):
    user_id = user_ids["johndoe"]
    prompt_id = prompt_ids["commented_prompt_1"]

    prompt_before = await services.prompts.get_one(prompt_id)
    initial_likes = prompt_before.likes_count

    await services.likes.unlike_prompt(prompt_id, user_id)

    prompt_after = await services.prompts.get_one(prompt_id)
    assert prompt_after.likes_count == initial_likes - 1


async def test_unlike_prompt_not_found_raises_error(services, user_ids, prompt_ids):
    user_id = user_ids["johndoe"]
    prompt_id = prompt_ids["matt_prompt"]  # not liked

    with pytest.raises(LikeNotFoundError):
        await services.likes.unlike_prompt(prompt_id, user_id)
