import pytest
from bson import ObjectId
from datetime import datetime, timezone

from app.schemas.comment_schema import Comment

pytestmark = pytest.mark.unit

def test_comment_from_document_maps_fields_correctly():
    now = datetime.now(timezone.utc)

    document = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "content": "Nice prompt",
        "prompt_id": ObjectId("507f1f77bcf86cd799439012"),
        "user_id": ObjectId("507f1f77bcf86cd799439013"),
        "author": "john",
        "pub_date": now,
    }

    comment = Comment.from_document(document)

    assert comment.id == "507f1f77bcf86cd799439011"
    assert comment.content == "Nice prompt"
    assert comment.prompt_id == "507f1f77bcf86cd799439012"
    assert comment.user_id == "507f1f77bcf86cd799439013"
    assert comment.author == "john"
    assert comment.pub_date == now


def test_comment_from_document_missing_field_raises_error():
    document = {
        "_id": ObjectId(),
        "content": "Test",
    }

    with pytest.raises(KeyError):
        Comment.from_document(document)
