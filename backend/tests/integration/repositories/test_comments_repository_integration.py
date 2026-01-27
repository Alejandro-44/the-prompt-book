import pytest
from bson import ObjectId
from datetime import datetime, timezone

from app.repositories.comments_repository import CommentsRepository


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


@pytest.fixture
def comments_repo(db):
    return CommentsRepository(db)


async def test_get_by_prompt_returns_comments_with_author(
    comments_repo, seed_comments, prompt_ids
    ):
    skip = 0
    limit = 5
    items, total = await comments_repo.get_by_prompt(
        prompt_ids["commented_prompt_1"], skip, limit
    )

    assert len(items) == 2

    assert items[0]["content"] == "Second comment"
    assert items[1]["content"] == "First comment"

    assert all(
        (comment["author_name"] == "john doe" and
        comment["author_handle"] == "john_doe")
        for comment in items
    )


async def test_get_by_prompt_returns_empty_list_for_unknown_prompt(
    comments_repo, seed_comments
):
    items, total = await comments_repo.get_by_prompt(ObjectId(), 0, 5)
    assert items == []
    assert total == 0


async def test_create_inserts_comment_and_returns_id(
    comments_repo, seed_comments, user_ids
):

    comment_data = {
        "content": "New comment",
        "prompt_id": ObjectId(),
        "author_id": ObjectId(),
        "author_name": "john doe",
        "author_handle": "john_doe",
        "pub_date": datetime.now(timezone.utc),
    }

    comment_id = await comments_repo.create(comment_data)

    saved = await comments_repo._CommentsRepository__collection.find_one(
        {"_id": ObjectId(comment_id)}
    )

    assert saved["content"] == "New comment"


async def test_update_updates_comment_if_owner(
    comments_repo, seed_comments, user_ids, comments_ids
):
    comment_id = comments_ids["comment_1"]
    user_id = user_ids["johndoe"]

    updated = await comments_repo.update(
        comment_id,
        user_id,
        {"content": "Updated"},
    )

    assert updated is True

    saved = await comments_repo._CommentsRepository__collection.find_one(
        {"_id": comment_id}
    )

    assert saved["content"] == "Updated"


async def test_update_returns_false_if_not_owner(
    comments_repo, seed_comments, 
):
    comment = seed_comments[0]
    other_user_id = ObjectId()

    updated = await comments_repo.update(
        comment["_id"],
        other_user_id,
        {"content": "Hacked"},
    )

    assert updated is False


async def test_delete_deletes_comment_if_owner(
    comments_repo, seed_comments, user_ids
):
    comment = seed_comments[0]
    user_id = user_ids["johndoe"]

    deleted = await comments_repo.delete(
        comment["_id"],
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
        comment["_id"],
        other_user_id,
    )

    assert deleted is False


async def test_update_author_data_updates_comments_author_info(
    comments_repo, seed_comments, user_ids
):
    author_id = user_ids["johndoe"]

    updated = await comments_repo.update_author_data(
        author_id, new_name="Updated Name", new_handle="updated_handle"
    )

    assert updated is True

    comments = await comments_repo._CommentsRepository__collection.find({"author_id": author_id}).to_list()

    for comment in comments:
        assert comment["author_name"] == "Updated Name"
        assert comment["author_handle"] == "updated_handle"


async def test_update_author_data_updates_only_name_if_handle_none(
    comments_repo, seed_comments, user_ids
):
    author_id = user_ids["johndoe"]

    updated = await comments_repo.update_author_data(
        author_id, new_name="Updated Name", new_handle=None
    )

    assert updated is True

    comments = await comments_repo._CommentsRepository__collection.find({"author_id": author_id}).to_list()

    for comment in comments:
        assert comment["author_name"] == "Updated Name"
        assert comment["author_handle"] == "john_doe"


async def test_update_author_data_returns_false_if_no_comments(
    comments_repo
):
    non_existent_author_id = ObjectId()

    updated = await comments_repo.update_author_data(
        non_existent_author_id, new_name="Updated Name", new_handle="updated_handle"
    )

    assert updated is False
