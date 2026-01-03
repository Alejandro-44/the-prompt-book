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
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "tags": ["ai", "nlp"],
        "pub_date": now,
        "author": {
            "_id": ObjectId("507f1f77bcf86cd799439022"),
            "username": "johndoe",
            "is_active": True,
        },
    }

    prompt = Prompt.from_document(document)

    assert prompt.id == "507f1f77bcf86cd799439021"
    assert prompt.title == "Test Prompt"
    assert prompt.prompt == "Do something"
    assert prompt.result_example == "Example"
    assert prompt.model == "gpt-4"
    assert prompt.tags == ["ai", "nlp"]
    assert prompt.pub_date == now

    assert isinstance(prompt.author, User)
    assert prompt.author.id == "507f1f77bcf86cd799439022"
    assert prompt.author.username == "johndoe"
    assert prompt.author.is_active is True


def test_prompt_from_document_sets_empty_tags_when_missing():
    document = {
        "_id": ObjectId(),
        "title": "Test Prompt",
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "pub_date": datetime.now(timezone.utc),
        "author": {
            "_id": ObjectId(),
            "username": "johndoe",
            "is_active": True,
        },
    }

    prompt = Prompt.from_document(document)

    assert prompt.tags == []


def test_prompt_from_document_invalid_author_raises_error():
    document = {
        "_id": ObjectId(),
        "title": "Test Prompt",
        "prompt": "Do something",
        "result_example": "Example",
        "model": "gpt-4",
        "pub_date": datetime.now(timezone.utc),
        "author": {
            "username": "johndoe",
        },
    }

    with pytest.raises(KeyError):
        Prompt.from_document(document)
