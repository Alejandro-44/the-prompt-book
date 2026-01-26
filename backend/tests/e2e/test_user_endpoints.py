import pytest

from bson import ObjectId

from app.schemas import User, PromptSummary


pytestmark = [pytest.mark.e2e, pytest.mark.asyncio]


MOCK_RANDOM_ID = str(ObjectId())


async def test_register_user_and_access_its_own_info(e2e_client):
    test_user = {"username": "testuser", "email": "testuser@example.com", "password": "Password12345"}
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
    data = response.json()
    User.model_validate(data)
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"


async def test_get_my_prompts_with_filters(e2e_client, seed_data):
    login_data = {"email": "alex@example.com", "password": "password12345"}
    auth_response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", auth_response.cookies.get("access_token"))

    params = {"model": "gpt-4", "tags": ["marketing"]} 
    response = await e2e_client.get("/users/me/prompts", params=params)

    assert response.status_code == 200
    data = response.json()

    assert "items" in data
    assert "total" in data
    if data["total"] > 0:
        assert "marketing" in data["items"][0]["hashtags"]


async def test_user_prompts_get_only_its_own_prompts_paginated(e2e_client, seed_data, user_handles):
    user_handle = user_handles["alex"]
    response = await e2e_client.get(f"/users/{user_handle}/prompts")

    data = response.json()

    prompts = data["items"]
    assert len(prompts) == 4
    assert data["total"] == 4
    assert data["page"] == 1
    assert data["pages"] == 1

    for prompt in prompts:
        PromptSummary.model_validate(prompt)


async def test_get_user_prompts_with_handle_too_long_returns_422(e2e_client):
    long_handle = "a" * 31
    
    response = await e2e_client.get(f"/users/{long_handle}/prompts")
    
    assert response.status_code == 422
    
    data = response.json()
    assert "detail" in data
    assert any("user_handle" in str(error) for error in data["detail"])


async def test_get_public_user_info(e2e_client, seed_data, user_handles):
    user_handle = user_handles["alex"]
    response = await e2e_client.get(f"/users/{user_handle}")
    assert response.status_code == 200
    data = response.json()
    User.model_validate(data)


async def test_get_user_with_handle_too_long_returns_422(e2e_client):
    long_handle = "a" * 31
    
    response = await e2e_client.get(f"/users/{long_handle}")
    
    assert response.status_code == 422
    
    data = response.json()
    assert "detail" in data
    assert any("user_handle" in str(error) for error in data["detail"])


async def test_trying_to_get_a_handle_that_does_not_exist_return_not_found(e2e_client, seed_data, user_ids):
    random_handle = "random_12345"
    response = await e2e_client.get(f"users/{random_handle}")
    assert response.status_code == 404


async def test_deactivate_user(e2e_client, seed_data, user_handles):
    user_handle = user_handles["matt"]
    login_data = { "email": "matt@example.com", "password": "password12345" }
    response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))
    response = await e2e_client.delete("users/me")
    assert response.status_code == 204

    response = await e2e_client.get(f"users/{user_handle}")
    data = response.json()

    assert data["username"] == "deleted user"
    assert data["is_active"] is False
