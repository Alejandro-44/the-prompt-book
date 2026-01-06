import pytest

from bson import ObjectId

from app.services.user_service import UserService
from app.core.exceptions import UserNotFoundError, UserAlreadyExistsError, DatabaseError
from app.schemas.user_schema import UserCreate


pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


MOCK_USER_ID = "507f1f77bcf86cd799439012"
MOCK_RANDOM_ID = "507f1f77bcf86cd799439013"


@pytest.fixture
def service(service_factory) -> UserService:
    return service_factory(UserService)


@pytest.fixture
def mock_user():
    return {
        "_id": ObjectId(MOCK_USER_ID),
        "username": "John",
        "email": "john@example.com",
        "is_active": True
    }


@pytest.fixture
def mock_deleted_user():
    return {
        "_id": ObjectId(MOCK_USER_ID),
        "username": "test",
        "email": "test@example.com",
        "is_active": False
    }


async def test_get_one_with_id_returns_user(service, mock_repo, mock_user):
    mock_repo.get_one.return_value = mock_user

    filters = {
        "id": MOCK_USER_ID
    }

    user = await service.get_one(filters)
    mock_repo.get_one.assert_awaited_once_with(filters)

    assert user.username == "John"


async def test_get_one_by_id_raises_not_found_when_user_does_not_exist(service, mock_repo):
    mock_repo.get_one.return_value = None

    with pytest.raises(UserNotFoundError):
        await service.get_one({ "id": ObjectId(MOCK_RANDOM_ID)})


async def test_get_one_by_id_returns_deleted_user(service, mock_repo, mock_deleted_user):
    mock_repo.get_one.return_value = mock_deleted_user

    user = await service.get_one({ "id": ObjectId(MOCK_RANDOM_ID)})

    assert user.username == "deleted user"
    assert user.is_active is False


async def test_register_user_success(service, mock_repo, mocker):
    mock_repo.create.return_value = MOCK_USER_ID
    mock_repo.get_one.side_effect = UserNotFoundError()

    mocker.patch("app.services.user_service.hash_password", return_value="hashed_pw")

    user_in = UserCreate(username="Alice", email="alice@example.com", password="1234")

    user = await service.register_user(user_in)

    assert user.username == "Alice"
    assert user.id == MOCK_USER_ID
    
    mock_repo.get_one.assert_awaited_once_with({ "email": "alice@example.com", "is_active": True })
    mock_repo.create.assert_awaited_once()
    (payload,), _ = mock_repo.create.call_args
    assert "hashed_password" in payload


async def test_register_user_raises_already_exists(service, mock_repo, mock_user):
    mock_repo.get_one.return_value = mock_user

    user_in = UserCreate(username="johndoe", email="johndoe@example.com", password="password")

    with pytest.raises(UserAlreadyExistsError):
        await service.register_user(user_in)


async def test_register_user_raises_database_error(service, mock_repo, mocker):
    mock_repo.get_one.side_effect = UserNotFoundError()
    mock_repo.create.side_effect = Exception()

    mocker.patch("app.services.user_service.hash_password", return_value="hashed_pw")

    user_in = UserCreate(username="Fail", email="fail@example.com", password="x")

    with pytest.raises(DatabaseError):
        await service.register_user(user_in)


async def test_deactivate_user_success(service, mock_repo):
    mock_repo.update.return_value = True

    result = await service.deactivate(ObjectId(MOCK_USER_ID))

    assert result is True
    mock_repo.update.assert_awaited_once_with(ObjectId(MOCK_USER_ID), {"is_active": False})


async def test_deactivate_user_fails(service, mock_repo):
    mock_repo.update.return_value = False

    with pytest.raises(DatabaseError):
        await service.deactivate(ObjectId(MOCK_USER_ID))
