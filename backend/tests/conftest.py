from httpx import ASGITransport, AsyncClient

import pytest
from testcontainers.mongodb import MongoDbContainer
from pymongo import AsyncMongoClient

from app.services.services_manager import ServiceManager
from app.dependencies.database_deps import get_services
from app.main import app

from tests.mocks import mock_users, mock_prompts, mock_comments


@pytest.fixture
def mock_repo(mocker):
    return mocker.AsyncMock()


@pytest.fixture
def service_factory(mock_repo):
    def _factory(service_class):
        return service_class(mock_repo)
    return _factory


@pytest.fixture(scope="session")
def mongo_connection_url():
    with MongoDbContainer(
        "mongodb/mongodb-community-server:8.2.3-ubi8"
    ) as mongo:
        yield mongo.get_connection_url()


@pytest.fixture()
async def mongo_client(mongo_connection_url):
    client = AsyncMongoClient(mongo_connection_url)
    yield client
    await client.close()


@pytest.fixture
async def db(mongo_client):
    db = mongo_client.get_database("test_db")
    yield db
    await mongo_client.drop_database("test_db")


@pytest.fixture()
def services(db):
    return ServiceManager(db)


@pytest.fixture
async def seed_users(db):
    await db.users.insert_many(mock_users)
    return mock_users


@pytest.fixture
async def seed_prompts(db):
    await db.prompts.insert_many(mock_prompts)
    return mock_prompts


@pytest.fixture
async def seed_comments(db):
    await db.comments.insert_many(mock_comments)
    return mock_comments


@pytest.fixture
async def seed_data(seed_users, seed_prompts, seed_comments):
    return {
        "users": seed_users,
        "prompts": seed_prompts,
        "comments": seed_comments,
    }


@pytest.fixture
def user_ids(seed_data):
    return {
        "johndoe": str(seed_data["users"][0]["_id"]),
        "alex": str(seed_data["users"][1]["_id"]),
        "matt": str(seed_data["users"][2]["_id"]),
        "luna": str(seed_data["users"][3]["_id"]),
        "invalid": str(seed_data["users"][5]["_id"])
    }


@pytest.fixture
def prompt_ids(seed_data):
    return {
        "matt_prompt": str(seed_data["prompts"][5]["_id"]),
        "luna_prompt": str(seed_data["prompts"][8]["_id"]),
        "not_owner_prompt": str(seed_data["prompts"][2]["_id"]),
        "commented_prompt_1": str(seed_data["prompts"][0]["_id"]),
        "commented_prompt_2": str(seed_data["prompts"][1]["_id"]),
    }

@pytest.fixture
def comments_ids(seed_data):
    return {
        "comment_1": str(seed_data["comments"][0]["_id"]),
        "comment_2": str(seed_data["comments"][1]["_id"]),
        "comment_3": str(seed_data["comments"][2]["_id"]),
    }

@pytest.fixture
async def e2e_client(db):
    service_manager = ServiceManager(db)
    app.state.database = db

    app.dependency_overrides.clear()
    app.dependency_overrides[get_services] = lambda: service_manager

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
