import pytest
from bson import ObjectId

from app.services.auth_service import AuthService
from app.core.exceptions import (
    UnauthorizedError,
    WrongPasswordError,
    UserNotFoundError,
    EmailNotRegisteredError
)


pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


@pytest.fixture
def user_repo(mocker):
    return mocker.AsyncMock()


@pytest.fixture
def auth_service(user_repo):
    return AuthService(user_repo)


async def test_login_user_email_not_found(auth_service, user_repo):
    user_repo.get_by_email.return_value = None

    with pytest.raises(EmailNotRegisteredError):
        await auth_service.login("test@mail.com", "1234")


async def test_login_user_wrong_password_returns_unauthorized_error(auth_service, user_repo, mocker):
    user_repo.get_by_email.return_value = {
        "_id": ObjectId(),
        "email": "test@mail.com",
        "hashed_password": "hashed",
    }

    mocker.patch(
        "app.services.auth_service.verify_password",
        return_value=False
    )

    with pytest.raises(UnauthorizedError):
        await auth_service.login("test@mail.com", "wrong")

async def test_login_returns_token(auth_service, user_repo, mocker):
    user = {
        "_id": ObjectId(),
        "email": "test@mail.com",
        "hashed_password": "hashed",
    }

    user_repo.get_by_email.return_value = user

    mocker.patch(
        "app.services.auth_service.verify_password",
        return_value=True
    )

    create_token = mocker.patch(
        "app.services.auth_service.create_access_token",
        return_value="fake-token"
    )

    token = await auth_service.login("test@mail.com", "password")

    assert token == "fake-token"
    create_token.assert_called_once()


async def test_change_password_user_not_found(auth_service, user_repo):
    user_repo.get_by_id.return_value = None

    with pytest.raises(UserNotFoundError):
        await auth_service.change_password("user-id", "old", "new")


async def test_change_password_wrong_password(auth_service, user_repo, mocker):
    user_repo.get_by_id.return_value = {
        "_id": ObjectId(),
        "hashed_password": "hashed-old",
    }

    mocker.patch(
        "app.services.auth_service.verify_password",
        return_value=False
    )

    with pytest.raises(UnauthorizedError):
        await auth_service.change_password("id", "old", "new")


async def test_change_password_success(auth_service, user_repo, mocker):
    user_repo.get_by_id.return_value = {
        "_id": ObjectId(),
        "hashed_password": "hashed-old",
    }

    mocker.patch(
        "app.services.auth_service.verify_password",
        return_value=True
    )

    mock_hash = mocker.patch(
        "app.services.auth_service.hash_password",
        return_value="hashed-new"
    )

    user_repo.update.return_value = True

    result = await auth_service.change_password("id", "old", "new")

    mock_hash.assert_called_once_with("new")
    user_repo.update.assert_called_once_with(
        "id", {"hashed_password": "hashed-new"}
    )

    assert result is True
