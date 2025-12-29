from datetime import datetime

import pytest
from bson import ObjectId

from app.repositories.comments_repository import CommentsRepository

@pytest.mark.asyncio
async def test_comment_lifecycle(db):
    repo = CommentsRepository(db)

    mock_user_id_a = ObjectId()
    await db.users.insert_one({
        "_id": mock_user_id_a,
        "username": "testuser",
        "email": "testuser@example.com"
    })

    mock_user_id_b = ObjectId()
    await db.users.insert_one({
        "_id": mock_user_id_b,
        "username": "testuser",
        "email": "testuser@example.com"
    })


    prompt_mock_id = ObjectId()

    comment_data_a = {
        "content": "Comment test",
        "prompt_id": prompt_mock_id,
        "user_id": mock_user_id_a,
        "pub_date": datetime.now()
    }

    comment_data_b = {
        "content": "Comment test",
        "prompt_id": prompt_mock_id,
        "user_id": mock_user_id_b,
        "pub_date": datetime.now()
    }


    inserted_id_a = await repo.create(comment_data_a)
    assert isinstance(inserted_id_a, str)

    inserted_id_b = await repo.create(comment_data_b)
    assert isinstance(inserted_id_b, str)

    # --- GET BY PROMPT ---
    found_comments = await repo.get_by_prompt(prompt_mock_id)
    assert len(found_comments) == 2

    # --- UPDATE ---
    updated = await repo.update(str(inserted_id_b), comment_data_b["user_id"], { "content":"New content" })
    assert updated
    
    comments = await repo.get_by_prompt(prompt_mock_id)
    for comment in comments:
        if comment["_id"] == inserted_id_b:
            assert comment["content"] == "New content"

    # --- DELETE ---
    deleted = await repo.delete(str(inserted_id_a), comment_data_a["user_id"])
    assert deleted

    comments = await repo.get_by_prompt(prompt_mock_id)
    assert len(comments) == 1
