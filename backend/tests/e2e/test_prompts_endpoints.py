import pytest
from bson import ObjectId

from app.schemas.prompt_schema import Prompt, PromptSummary
from tests.mocks.prompt_mocks import prompt_create_mocks

MOCK_RANDOM_ID = str(ObjectId())


@pytest.mark.asyncio
async def test_register_and_create_a_prompt(e2e_client):
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

    mock_prompt = {
        "title": "Integration test",
        "prompt": "Write a poem",
        "result_example": "A small poem",
        "model": "ChatGPT",
        "tags": ["ai", "poem"]
    }

    response = await e2e_client.post("/prompts/", json=mock_prompt)

    assert response.status_code == 201
    
    data = response.json()
    assert "message" in data
    assert "id" in data

    response = await e2e_client.get(f'/prompts/{data["id"]}')
    data = response.json()
    Prompt.model_validate(data)


@pytest.mark.asyncio
async def test_add_prompts_and_get_prompts(e2e_client):
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
        
    for mock_prompt in prompt_create_mocks:
        response = await e2e_client.post("/prompts/", json=mock_prompt)
        assert response.status_code == 201

    response = await e2e_client.get("/prompts/")
    assert response.status_code == 200

    data = response.json()
    prompts = data["items"]

    assert len(prompts) == 3

    for prompt in prompts:
        PromptSummary.model_validate(prompt)

@pytest.mark.asyncio
async def test_add_prompt_and_update(e2e_client):
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

    
    mock_prompt =   {
        "title": "Write a perfect essay",
        "prompt": "Write a essay...",
        "result_example": "A prefect essay...",
        "model": "gpt-4",
        "tags": ["ai", "poem"]
    }

    response = await e2e_client.post("/prompts/", json=mock_prompt)
    assert response.status_code == 201

    data = response.json()
    prompt_id = data["id"]
    update_data = { "model": "Claude" }

    response = await e2e_client.patch(f'/prompts/{prompt_id}', json=update_data)
    assert response.status_code == 204

    response = await e2e_client.get(f'/prompts/{prompt_id}')
    data = response.json()

    assert data["model"] == "Claude"


@pytest.mark.asyncio
async def test_create_and_delete_prompt(e2e_client):
    # Register and login a new user to add prompts
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

    mock_prompt =   {
        "title": "Write a perfect essay",
        "prompt": "Write a essay...",
        "result_example": "A prefect essay...",
        "model": "gpt-4",
        "tags": ["ai", "poem"]
    }

    response = await e2e_client.post("/prompts/", json=mock_prompt)
    assert response.status_code == 201

    data = response.json()
    prompt_id = data["id"]

    response = await e2e_client.delete(f"/prompts/{prompt_id}")
    assert response.status_code == 204

    response = await e2e_client.get("/prompts/")
    response.status_code == 200
    data = response.json()
    prompts = data["items"]
    assert len(prompts) == 0


@pytest.mark.asyncio
async def test_try_get_an_unexists_prompt_returns_not_found(e2e_client):
    response = await e2e_client.get(f'/prompts/{MOCK_RANDOM_ID}')
    assert response.status_code == 404


@pytest.mark.asyncio
async def trying_to_modify_a_prompt_that_does_not_exist_or_not_being_the_owner_returns_not_found(e2e_client):
    # Register and login a new user to add prompts
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

    mock_prompt =   {
        "title": "Write a perfect essay",
        "prompt": "Write a essay...",
        "result_example": "A prefect essay...",
        "model": "gpt-4",
        "tags": ["ai", "poem"]
    }

    response = await e2e_client.post("/prompts/", json=mock_prompt)
    assert response.status_code == 201

    data = response.json()
    prompt_id = data["id"]
    update_data = { "model": "Claude" }

    response = await e2e_client.patch(f'/prompts/{MOCK_RANDOM_ID}', json=update_data)
    assert response.status_code == 404

    # Register and login another user to try to modify the prompt
    test_user = {"username": "maria", "email": "maria@example.com", "password": "1234"}
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

    response = await e2e_client.patch(f'/prompts/{prompt_id}', json=update_data)
    assert response.status_code == 404


@pytest.mark.asyncio
async def trying_to_delete_a_prompt_that_does_not_exist_or_not_being_the_owner_returns_not_found(e2e_client):
    # Register and login a new user to add prompts
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

    mock_prompt =   {
        "title": "Write a perfect essay",
        "prompt": "Write a essay...",
        "result_example": "A prefect essay...",
        "model": "gpt-4",
        "tags": ["ai", "poem"]
    }

    response = await e2e_client.post("/prompts/", json=mock_prompt)
    assert response.status_code == 201

    data = response.json()
    prompt_id = data["id"]

    response = await e2e_client.delete(f'/prompts/{MOCK_RANDOM_ID}')
    assert response.status_code == 404

    # Register and login another user to try to delete the prompt
    test_user = {"username": "maria", "email": "maria@example.com", "password": "1234"}
    await e2e_client.post(
        "/auth/register",
        json=test_user
    )

    login_data = {
        "username": test_user["email"],
        "password": test_user["password"],
    }

    response = await e2e_client.post("/auth/login", data=login_data)
    e2e_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.delete(f'/prompts/{prompt_id}')
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_add_comment_to_a_prompt(e2e_client):
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

    mock_prompt =   {
        "title": "Write a perfect essay",
        "prompt": "Write a essay...",
        "result_example": "A prefect essay...",
        "model": "gpt-4",
        "tags": ["ai", "poem"]
    }

    response = await e2e_client.post("/prompts/", json=mock_prompt)
    assert response.status_code == 201

    data = response.json()
    prompt_id = data["id"]

     # Register and login another user to try to modify the prompt
    test_user = {"username": "maria", "email": "maria@example.com", "password": "1234"}
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

    new_comment = { "content": "It's useful!!!" }
    response = await e2e_client.post(f"/prompts/{prompt_id}/comments", json=new_comment)
    assert response.status_code == 201
    data = response.json()

    assert "message" in data
    assert "id" in data

    response = await e2e_client.get(f"/prompts/{prompt_id}/comments")
    comments = response.json()

    assert len(comments) == 1
