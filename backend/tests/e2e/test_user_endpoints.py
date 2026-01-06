import pytest

from app.schemas import User, PromptSummary


pytestmark = [pytest.mark.e2e, pytest.mark.asyncio]


async def test_register_user_and_access_its_own_info(e2e_client):
    test_user = {"username": "testuser", "email": "testuser@example.com", "password": "12345678"}
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


async def test_user_prompts_get_only_its_own_prompts_paginated(e2e_client, seed_data, user_ids):
    user_id = str(user_ids["alex"])

    response = await e2e_client.get(f"/users/{user_id}/prompts")

    data = response.json()

    prompts = data["items"]
    assert len(prompts) == 4
    assert data["total"] == 4
    assert data["page"] == 1
    assert data["pages"] == 1

    for prompt in prompts:
        PromptSummary.model_validate(prompt)
    


async def test_get_public_user_info(e2e_client, seed_data, user_ids):
    user_id = str(user_ids["alex"])
    response = await e2e_client.get(f"users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    User.model_validate(data)    


async def test_deactivate_user(e2e_client, seed_data, user_ids):
    user_id = str(user_ids["matt"])
    login_data = { "email": "matt@example.com", "password": "password12345" }
    response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))
    response = await e2e_client.delete("users/me")
    assert response.status_code == 204

    response = await e2e_client.get(f"users/{user_id}")
    data = response.json()

    assert data["username"] == "deleted user"
    assert data["is_active"] is False
