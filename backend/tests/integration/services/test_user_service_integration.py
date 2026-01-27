import pytest

from bson import ObjectId

from app.schemas.user_schema import UserCreate, User, UpdateUser
from app.core.exceptions import UserAlreadyExistsError, UserNotFoundError, DatabaseError, UnauthorizedError


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


async def test_register_new_user_succesfully(services):
    user_in = UserCreate(username="Alice", email="alice@example.com", password="Password12345")

    user = await services.user.register_user(user_in)
    assert user.username == "Alice"

    saved = await services.user.get_one({ "id": ObjectId(user.id) })
    assert saved.username == "Alice"
    assert saved.handle == "alice"
    assert saved.is_active is True


async def test_register_duplicate_user_raises_error(services, seed_data):
    user_in = UserCreate(username="alex", email="alex@example.com", password="Password12345")

    with pytest.raises(UserAlreadyExistsError):
        await services.user.register_user(user_in)


async def test_get_one_by_email_returns_user(services, seed_data):
    user = await services.user.get_one({ "email": "alex@example.com" })
    assert user.username == "alex"
    assert user.handle == "alex"
    assert user.is_active is True


async def test_get_one_by_email_raise_if_not_found(services):
    with pytest.raises(UserNotFoundError):
        await services.user.get_one({ "email": "missing@test.com" })


async def test_get_one_by_id_returns_user_sucessfully(services, seed_users, user_ids):
    user_id = user_ids["johndoe"]
    user = await services.user.get_one({ "id": user_id })
    assert user.username == "john doe"
    assert user.handle == "john_doe"
    assert user.is_active is True


async def test_get_one_by_id_and_private_returns_private_user_sucessfully(services, seed_users, user_ids):
    user_id = user_ids["johndoe"]
    user = await services.user.get_one({ "id": user_id }, private=True)
    assert user.username == "john doe"
    assert user.handle == "john_doe"
    assert user.email == "johndoe@example.com"
    assert user.is_active is True


async def test_get_one_by_handle_returns_user_sucessfully(services, seed_users, user_handles):
    user_handle = user_handles["johndoe"]
    user = await services.user.get_one({ "handle": user_handle })
    assert user.username == "john doe"
    assert user.handle == "john_doe"
    assert user.is_active is True


async def test_deactivate_user_successfully(services, seed_users, user_ids):
    user_id = user_ids["matt"]
    result = await services.user.deactivate(user_id)
    assert result is True


async def test_deactivate_nonexistent_user_raises(services):
    with pytest.raises(DatabaseError):
        await services.user.deactivate(ObjectId())


async def test_update_user_successfully(services, seed_users, user_ids):
    user_id = user_ids["johndoe"]
    user = await services.user.get_one({ "id": user_id })

    update_data = UpdateUser(username="Updated John", email="updatedjohn@example.com")

    await services.user.update(user_id, user, update_data)

    updated_user = await services.user.get_one({ "id": user_id })
    assert updated_user.username == "Updated John"
    assert updated_user.handle == "john_doe"  # handle shouldn't change
    assert updated_user.is_active is True


async def test_update_user_unauthorized(services, seed_users, user_ids):
    user_id = user_ids["johndoe"]
    wrong_user_id = user_ids["matt"]
    user = await services.user.get_one({ "id": user_id })

    update_data = UpdateUser(username="Hacked")

    with pytest.raises(UnauthorizedError):
        await services.user.update(wrong_user_id, user, update_data)


async def test_update_nonexistent_user_raises(services):
    fake_user_id = ObjectId()
    fake_user = User(id=str(fake_user_id), username="fake", handle="fake", is_active=True)
    update_data = UpdateUser(username="Updated")

    with pytest.raises(DatabaseError):
        await services.user.update(fake_user_id, fake_user, update_data)
