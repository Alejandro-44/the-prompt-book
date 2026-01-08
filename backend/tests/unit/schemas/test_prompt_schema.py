import pytest
from bson import ObjectId
from datetime import datetime, timezone

from app.schemas.prompt_schema import Prompt
from app.schemas.user_schema import User

pytestmark = pytest.mark.unit


def test_prompt_from_document_maps_fields_and_author():
    now = datetime.now(timezone.utc)

    document = {
        "_id": ObjectId("507f1f77bcf86cd799439021"),
        "title": "Test Prompt",
        "description": "this is a test #ai #hlp",
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "hashtags": ["ai", "nlp"],
        "pub_date": now,
        "author_id": ObjectId("507f1f77bcf86cd799439022"),
        "author_name": "john doe",
        "author_handle": "john_doe"
    }

    prompt = Prompt.from_document(document)

    assert prompt.id == "507f1f77bcf86cd799439021"
    assert prompt.title == "Test Prompt"
    assert prompt.description == "this is a test #ai #hlp"
    assert prompt.prompt == "Do something"
    assert prompt.result_example == "Example"
    assert prompt.model == "gpt-4"
    assert prompt.hashtags == ["ai", "nlp"]
    assert prompt.pub_date == now
    assert prompt.author_id == "507f1f77bcf86cd799439022"
    assert prompt.author_name == "john doe"
    assert prompt.author_handle == "john_doe"


def test_prompt_from_document_sets_empty_hashtags_when_missing():
    document = {
        "_id": ObjectId(),
        "title": "Test Prompt",
        "prompt": "Do something",
        "description": "This is a test description",
        "result_example": "Example",
        "model": "gpt-4",
        "pub_date": datetime.now(timezone.utc),
        "author_id": ObjectId("507f1f77bcf86cd799439022"),
        "author_name": "john doe",
        "author_handle": "john_doe"
    }

    prompt = Prompt.from_document(document)

    assert prompt.hashtags == []
