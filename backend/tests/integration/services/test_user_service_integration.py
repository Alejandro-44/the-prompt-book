import pytest

from app.schemas.user_schema import UserCreate
from app.core.exceptions import UserAlreadyExistsError
from app.core.exceptions import UserNotFoundError

@pytest.mark.asyncio
async def test_register_and_get_user(services):
    user_in = UserCreate(username="Alice", email="alice@example.com", password="1234")

    user = await services.user.register_user(user_in)
    assert user.username == "Alice"

    found = await services.user.get_by_id(user.id)
    assert found.username == "Alice"
    assert found.is_active is True


@pytest.mark.asyncio
async def test_register_duplicate_user_raises_error(services):
    user_in = UserCreate(username="Bob", email="bob@example.com", password="abcd")

    await services.user.register_user(user_in)

    with pytest.raises(UserAlreadyExistsError):
        await services.user.register_user(user_in)


@pytest.mark.asyncio
async def test_deactivate_user_changes_status(services):
    user_in = UserCreate(username="Eve", email="eve@example.com", password="xyz")
    user = await services.user.register_user(user_in)

    result = await services.user.deactivate(user.id)
    assert result is True

    found = await services.user.get_by_id(user.id)
    assert found.username == "deleted user"
    assert not found.is_active


@pytest.mark.asyncio
async def test_get_nonexistent_user_raises(services):
    with pytest.raises(UserNotFoundError):
        await services.user.get_by_id("66fda4b20f00000000000000")
