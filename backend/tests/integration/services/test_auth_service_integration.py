import pytest

from bson import ObjectId

from app.core.exceptions import UnauthorizedError, UserNotFoundError

pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


async def test_login_success(services, seed_users):
    token = await services.auth.login("johndoe@example.com", "qwerty12345")

    assert isinstance(token, str)
    assert token is not None


async def test_login_email_not_registered(services):
    with pytest.raises(UnauthorizedError):
        await services.auth.login("missing@test.com", "password")


async def test_login_wrong_password(services, seed_users):
    with pytest.raises(UnauthorizedError):
        await services.auth.login("alex@example.com", "wrong-password")


async def test_change_password_success(services, seed_users, user_ids):
    user_id = user_ids["johndoe"]

    result = await services.auth.change_password(
        user_id,
        "qwerty12345",
        "new-password"
    )

    assert result is True

    token = await services.auth.login("johndoe@example.com", "new-password")
    assert token is not None
    assert isinstance(token, str)


async def test_change_password_user_not_found(services):
    with pytest.raises(UserNotFoundError):
        await services.auth.change_password(
            str(ObjectId()),
            "old",
            "new"
        )
