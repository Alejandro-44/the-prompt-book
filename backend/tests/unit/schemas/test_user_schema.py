import pytest
from bson import ObjectId

from app.schemas.user_schema import User, PrivateUser


pytestmark = pytest.mark.unit


def test_user_from_document_maps_fields_correctly():
    document = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "username": "johndoe",
        "is_active": True,
    }

    user = User.from_document(document)

    assert user.id == "507f1f77bcf86cd799439011"
    assert user.username == "johndoe"
    assert user.is_active is True


def test_user_from_document_missing_field_raises_key_error():
    document = {
        "_id": ObjectId(),
        "username": "johndoe",
    }

    with pytest.raises(KeyError):
        User.from_document(document)


def test_private_user_from_document_maps_fields_correctly():
    document = {
        "_id": ObjectId("507f1f77bcf86cd799439012"),
        "username": "johndoe",
        "email": "john@example.com",
        "is_active": True,
    }

    user = PrivateUser.from_document(document)

    assert user.id == "507f1f77bcf86cd799439012"
    assert user.username == "johndoe"
    assert user.email == "john@example.com"
    assert user.is_active is True


def test_private_user_from_document_invalid_email_raises_error():
    document = {
        "_id": ObjectId(),
        "username": "johndoe",
        "email": "not-an-email",
        "is_active": True,
    }

    with pytest.raises(ValueError):
        PrivateUser.from_document(document)

