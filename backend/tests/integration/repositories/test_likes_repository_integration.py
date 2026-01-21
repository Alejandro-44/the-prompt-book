import pytest
from bson import ObjectId
from datetime import datetime

from app.repositories.likes_repository import LikesRepository

pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


@pytest.fixture
def likes_repo(db):
    return LikesRepository(db)


async def test_create_inserts_like_and_returns_id(likes_repo):
    like_data = {
        "prompt_id": ObjectId(),
        "user_id": ObjectId(),
        "created_at": datetime.now(),
    }

    like_id = await likes_repo.create(like_data)

    assert ObjectId.is_valid(like_id)

    saved = await likes_repo._LikesRepository__collection.find_one(
        {"_id": ObjectId(like_id)}
    )

    assert saved["prompt_id"] == like_data["prompt_id"]
    assert saved["user_id"] == like_data["user_id"]


async def test_delete_deletes_like_and_returns_true(likes_repo, seed_likes):
    like = seed_likes[0]

    deleted = await likes_repo.delete(like["prompt_id"], like["user_id"])

    assert deleted is True

    found = await likes_repo._LikesRepository__collection.find_one(
        {"_id": like["_id"]}
    )

    assert found is None


async def test_delete_returns_false_if_like_not_found(likes_repo):
    deleted = await likes_repo.delete(ObjectId(), ObjectId())

    assert deleted is False


async def test_get_prompt_ids_by_user_returns_distinct_prompt_ids(
    likes_repo, seed_likes, user_ids
):
    user_id = user_ids["johndoe"]

    prompt_ids = await likes_repo.get_prompt_ids_by_user(user_id)

    expected_ids = [
        ObjectId("69398c1d5393462cecf974b8"),
        ObjectId("69398c1d5393462cecf974b9"),
    ]

    assert set(prompt_ids) == set(expected_ids)


async def test_get_prompt_ids_by_user_returns_empty_list_for_user_with_no_likes(
    likes_repo
):
    prompt_ids = await likes_repo.get_prompt_ids_by_user(ObjectId())

    assert prompt_ids == []
