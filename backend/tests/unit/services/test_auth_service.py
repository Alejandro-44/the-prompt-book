import pytest
from app.services.auth_service import AuthService
from app.core.exceptions import (
    UnauthorizedError,
    WrongPasswordError,
    UserNotFoundError,
)


pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


@pytest.fixture
def service(service_factory):
    return service_factory(AuthService)


async def test_authenticate_user_success(service, mock_repo, mocker):
    mock_repo.get_by_email.return_value = {"hashed_password": "hashed123"}
    mocker.patch("app.services.auth_service.verify_password", return_value=True)

    user = await service.authenticate_user("test@example.com", "1234")

    assert user == {"hashed_password": "hashed123"}
    mock_repo.get_by_email.assert_awaited_once_with("test@example.com")


async def test_authenticate_user_fails_invalid_password(service, mock_repo, mocker):
    mock_repo.get_by_email.return_value = {"hashed_password": "hashed123"}
    mocker.patch("app.services.auth_service.verify_password", return_value=False)

    with pytest.raises(UnauthorizedError):
        await service.authenticate_user("test@example.com", "wrongpass")


async def test_authenticate_user_fails_user_not_found(service, mock_repo, mocker):
    mock_repo.get_by_email.return_value = None
    mocker.patch("app.services.auth_service.verify_password", return_value=True)

    with pytest.raises(UnauthorizedError):
        await service.authenticate_user("test@example.com", "1234")


async def test_login_success(service, mock_repo, mocker):
    mock_repo.get_by_email.return_value = {
        "_id": "123",
        "email": "john@example.com",
        "hashed_password": "hashed"
    }

    mocker.patch("app.services.auth_service.verify_password", return_value=True)
    mocker.patch("app.services.auth_service.create_access_token", return_value="jwt.token.here")

    token = await service.login("john@example.com", "1234")

    assert token == "jwt.token.here"
    mock_repo.get_by_email.assert_awaited_once_with("john@example.com")


async def test_login_invalid_password_raises_error(service, mock_repo, mocker):
    mock_repo.get_by_email.return_value = {
        "_id": "123",
        "email": "john@example.com",
        "hashed_password": "hashed"
    }

    mocker.patch("app.services.auth_service.verify_password", return_value=False)

    with pytest.raises(UnauthorizedError):
        await service.login("john@example.com", "wrongpass")


async def test_change_password_success(service, mock_repo, mocker):
    mock_repo.get_by_id.return_value = {"_id": "123", "hashed_password": "old_hashed"}
    mocker.patch("app.services.auth_service.verify_password", return_value=True)
    mocker.patch("app.services.auth_service.hash_password", return_value="new_hashed")

    mock_repo.update.return_value = True

    result = await service.change_password("123", "old_pass", "new_pass")

    assert result is True
    mock_repo.update.assert_awaited_once_with("123", {"hashed_password": "new_hashed"})


async def test_change_password_user_not_found(service, mock_repo):
    mock_repo.get_by_id.return_value = None

    with pytest.raises(UserNotFoundError):
        await service.change_password("123", "old", "new")


async def test_change_password_wrong_password(service, mock_repo, mocker):
    mock_repo.get_by_id.return_value = {"_id": "123", "hashed_password": "old_hashed"}
    mocker.patch("app.services.auth_service.verify_password", return_value=False)

    with pytest.raises(WrongPasswordError):
        await service.change_password("123", "wrong_pass", "new_pass")
