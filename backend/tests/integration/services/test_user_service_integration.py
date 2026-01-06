import pytest

from bson import ObjectId

from app.schemas.user_schema import UserCreate
from app.core.exceptions import UserAlreadyExistsError, UserNotFoundError, DatabaseError


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


async def test_register_new_user_succesfully(services):
    user_in = UserCreate(username="Alice", email="alice@example.com", password="1234")

    user = await services.user.register_user(user_in)
    assert user.username == "Alice"

    saved = await services.user.get_one({ "id": ObjectId(user.id) })
    assert saved.username == "Alice"
    assert saved.is_active is True


async def test_register_duplicate_user_raises_error(services, seed_data):
    user_in = UserCreate(username="alex", email="alex@example.com", password="abcdefghi")

    with pytest.raises(UserAlreadyExistsError):
        await services.user.register_user(user_in)


async def test_get_one_by_email_returns_user(services, seed_data):
    user = await services.user.get_one({ "email": "alex@example.com" })
    assert user.username == "alex"
    assert user.is_active is True


async def test_get_one_by_email_raise_if_not_found(services):
    with pytest.raises(UserNotFoundError):
        await services.user.get_one({ "email": "missing@test.com" })


async def test_get_one_by_id_returns_user_sucessfully(services, seed_users, user_ids):
    user_id = user_ids["johndoe"]
    user = await services.user.get_one({ "id": user_id })
    assert user.username == "johndoe"
    assert user.is_active is True


async def test_get_one_by_id_returns_deleted_user_if_inactive(services, seed_users, user_ids):
    user_id = user_ids["invalid"]

    result = await services.user.get_one({ "id": user_id })

    assert result.username == "deleted user"
    assert result.is_active is False


async def test_deactivate_user_successfully(services, seed_users, user_ids):
    user_id = user_ids["matt"]
    result = await services.user.deactivate(user_id)
    assert result is True


async def test_deactivate_nonexistent_user_raises(services):
    with pytest.raises(DatabaseError):
        await services.user.deactivate(ObjectId())
