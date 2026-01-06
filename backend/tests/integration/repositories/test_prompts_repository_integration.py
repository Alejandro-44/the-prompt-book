from datetime import datetime, timezone

import pytest
from bson import ObjectId
from bson.errors import InvalidId

from app.repositories.prompts_repository import PromptsRepository


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


@pytest.fixture
def prompts_repo(db):
    return PromptsRepository(db)


async def test_get_summary_returns_paginated_prompts(
    prompts_repo, seed_data
):
    items, total = await prompts_repo.get_summary(
        filters={},
        skip=0,
        limit=5,
    )

    assert total == len(seed_data["prompts"])
    assert len(items) == 5

    dates = [p["pub_date"] for p in items]
    assert dates == sorted(dates, reverse=True)

    for item in items:
        assert "author_name" in item
        assert "author_id" in item


async def test_get_summary_filters_by_user_id(
    prompts_repo, seed_prompts, user_ids
):
    user_id = str(user_ids["alex"])

    items, total = await prompts_repo.get_summary(
        filters={"user_id": user_id},
        skip=0,
        limit=20,
    )

    assert total == 4
    assert all(
        str(item["author_id"]) == user_id
        for item in items
    )


async def test_get_summary_filters_by_tags(
    prompts_repo, seed_users, seed_prompts
):
    items, total = await prompts_repo.get_summary(
        filters={"tags": ["marketing"]},
        skip=0,
        limit=20,
    )

    assert total > 0
    assert all(
        "marketing" in item["tags"]
        for item in items
    )


async def test_get_summary_filters_by_model(
    prompts_repo, seed_users, seed_prompts
):
    items, total = await prompts_repo.get_summary(
        filters={"model": "gpt-4"},
        skip=0,
        limit=50,
    )

    assert total > 0
    assert all(
        item["model"] == "gpt-4"
        for item in items
    )


async def test_get_summary_with_no_matches_returns_empty(
    prompts_repo, seed_users, seed_prompts
):
    items, total = await prompts_repo.get_summary(
        filters={"model": "non-existing-model"},
        skip=0,
        limit=10,
    )

    assert items == []
    assert total == 0


async def test_get_by_one_returns_prompt_with_author(
    prompts_repo, seed_users, seed_prompts, prompt_ids
):
    prompt_id = prompt_ids["matt_prompt"]

    result = await prompts_repo.get_one(prompt_id)

    assert str(result["_id"]) == prompt_id
    assert "author" in result
    assert result["author"]["username"] == "matt_coder"


async def test_get_one_returns_none_for_unknown_id(
    prompts_repo, seed_users, seed_prompts
):
    result = await prompts_repo.get_one(
        str(ObjectId())
    )

    assert result == None


async def test_get_one_invalid_id_raises_error(
    prompts_repo
):
    with pytest.raises(InvalidId):
        await prompts_repo.get_one("invalid-id")


async def test_create_inserts_prompt_and_returns_id(
    prompts_repo, seed_users
):
    user = seed_users[0]

    prompt_data = {
        "title": "New prompt",
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "tags": ["test"],
        "user_id": user["_id"],
        "pub_date": datetime.now(timezone.utc),
    }

    prompt_id = await prompts_repo.create(prompt_data)

    assert ObjectId.is_valid(prompt_id)

    saved = await prompts_repo._PromptsRepository__collection.find_one(
        {"_id": ObjectId(prompt_id)}
    )

    assert saved["title"] == "New prompt"


async def test_update_prompt(
    prompts_repo, seed_prompts
):
    prompt = seed_prompts[0]

    updated = await prompts_repo.update(
        str(prompt["_id"]),
        {"title": "Updated title"},
    )

    assert updated is True

    saved = await prompts_repo._PromptsRepository__collection.find_one(
        {"_id": prompt["_id"]}
    )
    assert saved["title"] == "Updated title"


async def test_delete_prompt(
    prompts_repo, seed_users, seed_prompts
):
    prompt = seed_prompts[0]

    deleted = await prompts_repo.delete(
        str(prompt["_id"]),
    )

    assert deleted is True

    found = await prompts_repo._PromptsRepository__collection.find_one(
        {"_id": prompt["_id"]}
    )

    assert found is None

