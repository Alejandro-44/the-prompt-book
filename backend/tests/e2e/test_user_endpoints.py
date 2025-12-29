import pytest

from app.schemas.user_schema import User
from tests.mocks.test_prompts_mock import prompt_create_mocks

PROMPT_MOCKS_FILE = "./tests/mocks/test_prompts_mock.json"

@pytest.mark.asyncio
async def test_register_user_and_access_its_own_info(e2e_client):
    test_user = {"username": "john", "email": "john@example.com", "password": "1234"}
    await e2e_client.post(
        "/auth/register",
        json=test_user
    )

    login_data = {
        "email": test_user["email"],
        "password": test_user["password"],
    }

    response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.get("/users/me")
    User.model_validate(response.json())


@pytest.mark.asyncio
async def test_user_create_prompts_and_get_only_its_own_prompts(e2e_client):
    test_user_a = {"username": "john", "email": "john@example.com", "password": "1234"}
    test_user_b = {"username": "alice", "email": "alice@example.com", "password": "1234"}
    
    # Log with user a, add three prompts and should return three prompts
    await e2e_client.post(
        "/auth/register",
        json=test_user_a
    )

    login_data = {
        "email": test_user_a["email"],
        "password": test_user_a["password"],
    }

    response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    for mock_prompt in prompt_create_mocks:
        response = await e2e_client.post("/prompts/", json=mock_prompt)
        assert response.status_code == 201

    response = await e2e_client.get("/users/me/prompts")
    data = response.json()

    assert len(data) == 3

    # Register user b
    await e2e_client.post(
        "/auth/register",
        json=test_user_b
    )

    # Login with user b, create one prompt, and should return only one prompt
    login_data = {
        "email": test_user_b["email"],
        "password": test_user_b["password"],
    }

    response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.post("/prompts/", json=prompt_create_mocks[0])
    assert response.status_code == 201
    data = response.json()

    response = await e2e_client.get("/users/me/prompts")
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1


@pytest.mark.asyncio
async def test_register_user_and_get_public_info(e2e_client):
    test_user = {"username": "john", "email": "john@example.com", "password": "1234"}
    
    # Log with user a, add three prompts and should return three prompts
    response = await e2e_client.post(
        "/auth/register",
        json=test_user
    )

    data = response.json()
    user_id = data["id"]

    response = await e2e_client.get(f"users/{user_id}")
    assert response.status_code == 200

    User.model_validate(response.json())    


@pytest.mark.asyncio
async def test_deactivate_user(e2e_client):
    test_user = {"username": "john", "email": "john@example.com", "password": "1234"}
    response = await e2e_client.post(
        "/auth/register",
        json=test_user
    )

    data = response.json()
    user_id = data["id"]

    login_data = {
        "email": test_user["email"],
        "password": test_user["password"],
    }

    response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.delete("users/me")
    assert response.status_code == 204

    response = await e2e_client.get(f"users/{user_id}")
    data = response.json()

    assert data["username"] == "deleted user"
    assert data["is_active"] is False
