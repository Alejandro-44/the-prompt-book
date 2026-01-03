import pytest
from bson import ObjectId
from app.schemas import Comment, CommentCreate, CommentUpdate, UserCreate
from app.core.exceptions import CommentNotFoundError

MOCK_USER_ID = str(ObjectId())
MOCK_PROMPT_ID = str(ObjectId())
MOCK_RANDOM_ID = str(ObjectId())


@pytest.mark.asyncio
async def test_create_comment_success(services):
    test_user = UserCreate(
        username="testuser",
        email="testuser@example.com",
        password="securepassword"
    )

    await services.user.register_user(test_user)

    test_user = await services.user.get_by_email(test_user.email)
    user_id = test_user.id

    mock_comment = CommentCreate(content="Awesome!")
    comment_id = await services.comments.create(MOCK_PROMPT_ID, user_id, mock_comment)
    assert isinstance(comment_id, str)


@pytest.mark.asyncio
async def test_create_comments_and_get(services):
    test_user_a = UserCreate(
        username="johndoe",
        email="johndoe@example.com",
        password="securepassword"
    )

    test_user_b = UserCreate(
        username="janedoe",
        email="janedoe@example.com",
        password="securepassword"
    )

    await services.user.register_user(test_user_a)
    await services.user.register_user(test_user_b)

    test_user_a = await services.user.get_by_email(test_user_a.email)
    test_user_b = await services.user.get_by_email(test_user_b.email)
    user_id_a = test_user_a.id
    user_id_b = test_user_b.id

    mock_comment_a = CommentCreate(content="Hey! It's useful")
    mock_comment_b = CommentCreate(content="Awesome!")
    
    await services.comments.create(MOCK_PROMPT_ID, user_id_a, mock_comment_a)
    await services.comments.create(MOCK_PROMPT_ID, user_id_b, mock_comment_b)

    comments = await services.comments.get_prompt_comments(MOCK_PROMPT_ID)

    assert len(comments) == 2
    for comment in comments:
        Comment.model_validate(comment)


@pytest.mark.asyncio
async def test_update_comment_success(services):
    test_user = UserCreate(
        username="testuser",
        email="testuser@example.com",
        password="securepassword"
    )

    await services.user.register_user(test_user)

    test_user = await services.user.get_by_email(test_user.email)
    user_id = test_user.id

    mock_comment = CommentCreate(
        content="Awesome!"
    )

    comment_id = await services.comments.create(MOCK_PROMPT_ID, user_id, mock_comment)

    update_data = CommentUpdate(
        content="WOW!"
    )

    result = await services.comments.update(comment_id, user_id, update_data)

    assert result is True

    comments = await services.comments.get_prompt_comments(MOCK_PROMPT_ID)

    assert comments[0].content == "WOW!"


@pytest.mark.asyncio
async def test_update_comment_not_found_raises_error(services):
    with pytest.raises(CommentNotFoundError):
        await services.comments.update(
            MOCK_RANDOM_ID, MOCK_USER_ID, CommentCreate(content="Test")
        )


@pytest.mark.asyncio
async def test_delete_comment_success(services):
    test_user = UserCreate(
        username="testuser",
        email="testuser@example.com",
        password="securepassword"
    )

    await services.user.register_user(test_user)

    test_user = await services.user.get_by_email(test_user.email)
    user_id = test_user.id

    mock_comment = CommentCreate(
        content="Awesome!"
    )
    comment_id = await services.comments.create(MOCK_PROMPT_ID, user_id, mock_comment)

    comments = await services.comments.get_prompt_comments(MOCK_PROMPT_ID)
    assert len(comments) == 1

    result = await services.comments.delete(comment_id, user_id)
    assert result is True

    comments = await services.comments.get_prompt_comments(MOCK_PROMPT_ID)
    assert len(comments) == 0
