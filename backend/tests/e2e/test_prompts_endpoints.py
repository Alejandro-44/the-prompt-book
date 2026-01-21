import pytest
from bson import ObjectId

from app.schemas.prompt_schema import Prompt, PromptSummary
from tests.mocks.prompt_mocks import prompt_create_mocks


pytestmark = [pytest.mark.e2e, pytest.mark.asyncio]

MOCK_RANDOM_ID = str(ObjectId())


async def test_register_and_create_a_prompt(e2e_client):
    test_user = {"username": "testsuser", "email": "testsuser@example.com", "password": "123456"} 
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

    mock_prompt = prompt_create_mocks[0]
    response = await e2e_client.post("/prompts/", json=mock_prompt)

    assert response.status_code == 201
    
    data = response.json()
    assert "message" in data
    assert "id" in data

    response = await e2e_client.get(f'/prompts/{data["id"]}')
    assert response.status_code == 200
    data = response.json()
    Prompt.model_validate(data)


async def test_get_paginated_prompts(e2e_client, seed_data):
    response = await e2e_client.get("/prompts/")
    assert response.status_code == 200

    data = response.json()
    prompts = data["items"]
    assert len(prompts) == 10
    assert data["total"] == 18
    assert data["page"] == 1
    assert data["pages"] == 2

    for prompt in prompts:
        PromptSummary.model_validate(prompt)

    response = await e2e_client.get("/prompts/", params={"page": 2})

    data = response.json()
    prompts = data["items"]
    assert len(prompts) == 8
    assert data["total"] == 18
    assert data["page"] == 2
    assert data["pages"] == 2

async def test_get_a_prompt_with_a_user_like_returns_like_by_me_as_true(e2e_client, seed_data, prompt_ids):
    login_data = {
        "email": "alex@example.com",
        "password": "password12345",
    }

    response = await e2e_client.post("/auth/login", json=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.get(f"/prompts/{prompt_ids["luna_prompt"]}")
    data = response.json()

    assert data["like_by_me"] == True


async def test_get_an_unexistent_prompt_returns_not_found(e2e_client, seed_data):
    response = await e2e_client.get(f"/prompts/{MOCK_RANDOM_ID}")
    assert response.status_code == 404


async def test_trying_to_get_a_prompt_with_bad_id_get_bad_request(e2e_client, seed_data):
    response = await e2e_client.get("/prompts/abcf")
    assert response.status_code == 400


async def test_update_prompt(e2e_client, seed_data, prompt_ids):
    test_user = { "email": "matt@example.com", "password": "password12345"}
    prompt_id = str(prompt_ids["matt_prompt"])

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200 
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    update_data = { "model": "Claude" }

    response = await e2e_client.patch(f'/prompts/{prompt_id}', json=update_data)
    assert response.status_code == 204

    response = await e2e_client.get(f'/prompts/{prompt_id}')
    data = response.json()

    assert data["model"] == "Claude"


async def test_trying_to_modify_a_prompt_with_a_bad_id_returns_bad_request(e2e_client, seed_data):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    update_data = { "model": "Claude" }

    response = await e2e_client.patch(f'/prompts/abcdef', json=update_data)
    assert response.status_code == 400


async def test_trying_to_modify_a_prompt_that_does_not_exist_returns_not_found(e2e_client, seed_data):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    update_data = { "model": "Claude" }

    response = await e2e_client.patch(f'/prompts/{MOCK_RANDOM_ID}', json=update_data)
    assert response.status_code == 404


async def test_trying_to_modify_a_prompt_when_user_is_not_owner_returns_forbidden(
        e2e_client,
        seed_data,
        prompt_ids
    ):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}
    prompt_id = str(prompt_ids["matt_prompt"])
    
    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    update_data = { "title": "Updated title" }

    response = await e2e_client.patch(f'/prompts/{prompt_id}', json=update_data)
    assert response.status_code == 403


async def test_delete_prompt(e2e_client, seed_data, prompt_ids):
    test_user = { "email": "matt@example.com", "password": "password12345"}
    prompt_id = str(prompt_ids["matt_prompt"])

    response = await e2e_client.post("/auth/login", json=test_user)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.delete(f"/prompts/{prompt_id}")
    assert response.status_code == 204

    response = await e2e_client.get(f"/prompts/{prompt_id}")
    response.status_code == 404


async def test_trying_to_delete_a_prompt_with_a_bad_id_returns_bad_request(e2e_client, seed_data):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.delete(f'/prompts/abcdef')
    assert response.status_code == 400


async def test_trying_to_delete_a_prompt_that_does_not_exist_returns_not_found(e2e_client, seed_data):
    test_user = {"email": "alex@example.com", "password": "password12345"}

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.delete(f'/prompts/{MOCK_RANDOM_ID}')
    assert response.status_code == 404


async def test_trying_to_delete_a_prompt_when_user_is_not_owner_returns_forbidden(e2e_client, seed_data, prompt_ids):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}
    prompt_id = str(prompt_ids["matt_prompt"])

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.delete(f'/prompts/{prompt_id}')
    assert response.status_code == 403



async def test_get_comments_from_a_prompt(e2e_client, seed_data, prompt_ids):
    prompt_id = str(prompt_ids["commented_prompt_1"])
    response = await e2e_client.get(f"/prompts/{prompt_id}/comments")
    assert response.status_code == 200
    comments = response.json()
    assert len(comments) == 2


async def test_like_prompt(e2e_client, seed_data, prompt_ids):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}
    prompt_id = str(prompt_ids["matt_prompt"])

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    # Get initial likes count
    response = await e2e_client.get(f"/prompts/{prompt_id}")
    initial_likes = response.json()["likes_count"]

    # Like the prompt
    response = await e2e_client.post(f"/prompts/{prompt_id}/like")
    assert response.status_code == 201

    # Check likes count increased
    response = await e2e_client.get(f"/prompts/{prompt_id}")
    assert response.json()["likes_count"] == initial_likes + 1



async def test_unlike_prompt(e2e_client, seed_data, prompt_ids):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}
    prompt_id = str(prompt_ids["matt_prompt"])

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    # Like first
    response = await e2e_client.post(f"/prompts/{prompt_id}/like")
    assert response.status_code == 201

    # Get likes count after like
    response = await e2e_client.get(f"/prompts/{prompt_id}")
    liked_likes = response.json()["likes_count"]

    # Unlike
    response = await e2e_client.delete(f"/prompts/{prompt_id}/like")
    assert response.status_code == 204

    # Check likes count decreased
    response = await e2e_client.get(f"/prompts/{prompt_id}")
    assert response.json()["likes_count"] == liked_likes - 1


async def test_unlike_prompt_without_like_returns_not_found(e2e_client, seed_data, prompt_ids):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}
    prompt_id = str(prompt_ids["matt_prompt"])

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    # Try to unlike without liking
    response = await e2e_client.delete(f"/prompts/{prompt_id}/like")
    assert response.status_code == 404


async def test_like_prompt_with_bad_id_returns_bad_request(e2e_client, seed_data):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.post("/prompts/abc/like")
    assert response.status_code == 400


async def test_unlike_prompt_with_bad_id_returns_bad_request(e2e_client, seed_data):
    test_user = {"email": "johndoe@example.com", "password": "qwerty12345"}

    response = await e2e_client.post("/auth/login", json=test_user)
    assert response.status_code == 200
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.delete("/prompts/abc/like")
    assert response.status_code == 400
