import pytest
from bson import ObjectId

from app.repositories.user_repository import UserRepository

pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


@pytest.fixture
def user_repo(db):
    return UserRepository(db)


async def test_create_inserts_user_and_returns_id(
    user_repo
):
    user_data = {
        "username": "newuser",
        "email": "newuser@test.com",
        "is_active": True,
    }

    user_id = await user_repo.create(user_data)

    saved = await user_repo._UserRepository__collection.find_one(
        {"_id": ObjectId(user_id)}
    )

    assert saved["email"] == "newuser@test.com"


async def test_get_one_by_email_returns_user(
    user_repo, seed_users
):
    email = seed_users[0]["email"]
    filters = {
        "email": email
    }

    user = await user_repo.get_one(filters)

    assert user is not None
    assert user["email"] == email
    assert user["username"] == "johndoe"


async def test_get_one_by_email_returns_none_if_not_found(
    user_repo, seed_users
):
    user = await user_repo.get_one({ "email": "notfound@test.com"})
    assert user is None


async def test_get_one_by_id_returns_user(
    user_repo, seed_users, user_ids
):
    user_id = user_ids["johndoe"]

    user = await user_repo.get_one({ "id": user_id })

    assert user is not None
    assert user["_id"] == user_id
    assert user["username"] == "johndoe"


async def test_get_one_by_id_returns_none_if_not_found(
    user_repo, seed_users
):
    user = await user_repo.get_one({ "id": ObjectId() })
    assert user is None


async def test_update_updates_user(
    user_repo, seed_users, user_ids
):
    user_id = user_ids["johndoe"]

    updated = await user_repo.update(
        user_id,
        {"is_active": False},
    )

    assert updated is True
    saved = await user_repo._UserRepository__collection.find_one(
        {"_id": user_id }
    )

    assert saved["is_active"] is False


async def test_update_returns_false_if_user_not_found(
    user_repo, seed_users
):
    updated = await user_repo.update(
        ObjectId(),
        {"is_active": False},
    )

    assert updated is False
