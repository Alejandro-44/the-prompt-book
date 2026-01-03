import pytest
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone, timedelta

from app.repositories.comments_repository import CommentsRepository


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


@pytest.fixture
def comments_repo(db):
    return CommentsRepository(db)

async def test_get_by_prompt_returns_comments_with_author(
    comments_repo, seed_comments, prompt_ids
    ):
    result = await comments_repo.get_by_prompt(
        prompt_ids["commented_prompt_1"]
    )

    assert len(result) == 2

    assert result[0]["content"] == "Second comment"
    assert result[1]["content"] == "First comment"

    for comment in result:
        assert "author" in comment
        assert comment["author"] == "johndoe"


async def test_get_by_prompt_returns_empty_list_for_unknown_prompt(
    comments_repo, seed_comments
):
    result = await comments_repo.get_by_prompt(str(ObjectId()))
    assert result == []

async def test_get_by_prompt_invalid_id_raises_error(comments_repo, seed_comments):
    with pytest.raises(InvalidId):
        await comments_repo.get_by_prompt("invalid-id")


async def test_create_inserts_comment_and_returns_id(
    comments_repo, seed_comments, user_ids
):
    user_id = user_ids["johndoe"]
    prompt_id = ObjectId()

    comment_data = {
        "content": "New comment",
        "prompt_id": prompt_id,
        "user_id": user_id,
        "pub_date": datetime.now(timezone.utc),
    }

    comment_id = await comments_repo.create(comment_data)

    assert ObjectId.is_valid(comment_id)

    saved = await comments_repo._CommentsRepository__collection.find_one(
        {"_id": ObjectId(comment_id)}
    )

    assert saved["content"] == "New comment"


async def test_update_updates_comment_if_owner(
    comments_repo, seed_comments, user_ids
):
    comment = seed_comments[0]
    user_id = user_ids["johndoe"]

    updated = await comments_repo.update(
        str(comment["_id"]),
        user_id,
        {"content": "Updated"},
    )

    assert updated is True

    saved = await comments_repo._CommentsRepository__collection.find_one(
        {"_id": comment["_id"]}
    )

    assert saved["content"] == "Updated"


async def test_update_returns_false_if_not_owner(
    comments_repo, seed_comments, 
):
    comment = seed_comments[0]
    other_user_id = ObjectId()

    updated = await comments_repo.update(
        str(comment["_id"]),
        str(other_user_id),
        {"content": "Hacked"},
    )

    assert updated is False


async def test_delete_deletes_comment_if_owner(
    comments_repo, seed_comments, user_ids
):
    comment = seed_comments[0]
    user_id = user_ids["johndoe"]

    deleted = await comments_repo.delete(
        str(comment["_id"]),
        user_id,
    )

    assert deleted is True

    found = await comments_repo._CommentsRepository__collection.find_one(
        {"_id": comment["_id"]}
    )

    assert found is None


async def test_delete_returns_false_if_not_owner(
    comments_repo, seed_comments, user_ids
):
    comment = seed_comments[0]
    other_user_id = ObjectId()

    deleted = await comments_repo.delete(
        str(comment["_id"]),
        str(other_user_id),
    )

    assert deleted is False
