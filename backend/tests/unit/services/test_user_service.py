import pytest
from app.services.user_service import UserService
from app.core.exceptions import UserNotFoundError, UserAlreadyExistsError, DatabaseError
from app.schemas.user_schema import UserCreate


pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


@pytest.fixture
def service(service_factory):
    return service_factory(UserService)


async def test_get_by_id_returns_user(service, mock_repo):
    mock_repo.get_by_id.return_value = {
        "_id": "123",
        "username": "John",
        "email": "john@example.com",
        "is_active": True
    }

    user = await service.get_by_id("123")
    mock_repo.get_by_id.assert_awaited_once_with("123")

    assert user.username == "John"


async def test_get_by_id_raises_not_found(service, mock_repo):
    mock_repo.get_by_id.return_value = None

    with pytest.raises(UserNotFoundError):
        await service.get_by_id("123")


async def test_get_by_id_returns_deleted_user(service, mock_repo):
    mock_repo.get_by_id.return_value = {
        "_id": "123",
        "is_active": False,
    }

    user = await service.get_by_id("123")

    assert user.username == "deleted user"
    assert not user.is_active


async def test_register_user_success(service, mock_repo, mocker):
    mock_repo.create.return_value = "abc123"
    mock_repo.get_by_email.return_value = None

    mocker.patch("app.services.user_service.hash_password", return_value="hashed_pw")

    user_in = UserCreate(username="Alice", email="alice@example.com", password="1234")

    user = await service.register_user(user_in)

    assert user.username == "Alice"
    assert user.id == "abc123"
    
    mock_repo.create.assert_awaited_once()
    mock_repo.get_by_email.assert_awaited_once_with("alice@example.com")


async def test_register_user_raises_already_exists(service, mock_repo):
    mock_repo.get_by_email.return_value = {
        "_id": "existing_id",
        "username": "ExistingUser",
        "email": "exists@example.com",
        "is_active": True
    }

    user_in = UserCreate(username="John", email="exists@example.com", password="pass")

    with pytest.raises(UserAlreadyExistsError):
        await service.register_user(user_in)


async def test_register_user_raises_database_error(service, mock_repo, mocker):
    mock_repo.get_by_email.return_value = None
    mock_repo.create.side_effect = Exception()

    mocker.patch("app.services.user_service.hash_password", return_value="hashed_pw")

    user_in = UserCreate(username="Fail", email="fail@example.com", password="x")

    with pytest.raises(DatabaseError):
        await service.register_user(user_in)


async def test_deactivate_user_success(service, mock_repo):
    mock_repo.update.return_value = True

    result = await service.deactivate("123")

    assert result is True
    mock_repo.update.assert_awaited_once_with("123", {"is_active": False})


async def test_deactivate_user_fails(service, mock_repo):
    mock_repo.update.return_value = False

    with pytest.raises(DatabaseError):
        await service.deactivate("123")
