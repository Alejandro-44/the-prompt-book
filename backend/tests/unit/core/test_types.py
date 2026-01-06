import pytest

from bson import ObjectId

from app.core.types import PyObjectId


pytestmark = pytest.mark.unit


def test_valid_object_id():
    oid = PyObjectId.validate("507f1f77bcf86cd799439011")
    assert isinstance(oid, ObjectId)

def test_invalid_object_id():
    with pytest.raises(ValueError):
        PyObjectId.validate("invalid")
