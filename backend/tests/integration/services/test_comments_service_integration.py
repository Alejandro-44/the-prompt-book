import pytest
from bson import ObjectId
from app.schemas import Comment, CommentCreate, CommentUpdate
from app.core.exceptions import CommentNotFoundError, DatabaseError


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


async def test_create_comment_success(services, seed_data, user_ids, prompt_ids):
    user_id = user_ids["johndoe"]
    mock_comment = CommentCreate(content="Awesome!")
    prompt_id = prompt_ids["commented_prompt_1"]
    comment_id = await services.comments.create(prompt_id, user_id, mock_comment)
    assert isinstance(comment_id, str)


async def test_create_comment_invalid_prompt_id_raises(services, user_ids):
    with pytest.raises(DatabaseError):
        await services.comments.create(
            "invalid-id",
            user_ids["johndoe"],
            CommentCreate(content="Test"),
        )


async def test_create_comment_invalid_user_id_raises(services, prompt_ids):
    with pytest.raises(DatabaseError):
        await services.comments.create(
            prompt_ids["commented_prompt_1"],
            "invalid-id",
            CommentCreate(content="Test"),
        )


async def test_get_comments_are_ordered_by_date_desc(services, seed_data, prompt_ids):
    prompt_id = prompt_ids["commented_prompt_1"]
    comments = await services.comments.get_prompt_comments(prompt_id)
    assert len(comments) == 2
    for comment in comments:
        Comment.model_validate(comment)
    assert comments[0].pub_date >= comments[1].pub_date


async def test_get_comments_invalid_prompt_id_raises(services):
    with pytest.raises(DatabaseError):
        await services.comments.get_prompt_comments("invalid-id")


async def test_update_comment_success(services, seed_data, user_ids, prompt_ids, comments_ids):
    user_id = user_ids["matt"]
    prompt_id = prompt_ids["commented_prompt_2"]
    comment_id = comments_ids["comment_3"]
    update_data = CommentUpdate(content="WOW!")
    result = await services.comments.update(comment_id, user_id, update_data)
    assert result is True
    comments = await services.comments.get_prompt_comments(prompt_id)
    assert len(comments) > 0
    assert comments[0].content == "WOW!"


async def test_update_comment_not_found_raises_error(services):
    with pytest.raises(CommentNotFoundError):
        await services.comments.update(
            str(ObjectId()), str(ObjectId()), CommentCreate(content="Test")
        )


async def test_delete_comment_success(services, seed_data, user_ids, prompt_ids, comments_ids):
    user_id = user_ids["johndoe"]
    prompt_id = prompt_ids["commented_prompt_1"]
    comment_id = comments_ids["comment_2"]

    comments = await services.comments.get_prompt_comments(prompt_id)
    assert len(comments) == 2

    result = await services.comments.delete(comment_id, user_id)
    assert result is True

    comments = await services.comments.get_prompt_comments(prompt_id)
    assert len(comments) == 1
