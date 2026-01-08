import pytest


pytestmark = [pytest.mark.e2e, pytest.mark.asyncio]


async def test_register_user_success(e2e_client):
    test_user = {"username": "alice", "email": "alice@example.com", "password": "1234"} 
    response = await e2e_client.post(
        "/auth/register",
        json=test_user
    )
    assert response.status_code == 201
    data = response.json()
    assert isinstance(data["id"], str)
    assert data["username"] == "alice"
    assert data["handle"] == "alice"


async def test_register_user_conflict(e2e_client, seed_users):
    test_user = {"username": "test", "email": "johndoe@example.com", "password": "abcd"}
    response = await e2e_client.post("/auth/register", json=test_user)
    assert response.status_code == 409


async def test_login_flow_with_cookie(e2e_client):
    test_user = {
        "username": "alice doe",
        "email": "alice@example.com",
        "password": "examplePass123",
    }

    response = await e2e_client.post("/auth/register", json=test_user)
    
    assert response.status_code == 201

    login_data = {
        "email": test_user["email"],
        "password": test_user["password"],
    }

    response = await e2e_client.post("/auth/login", json=login_data)
    assert response.status_code == 200

    assert "access_token" in response.cookies, "Cookie not found in request"

    cookie_client = e2e_client
    cookie_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await cookie_client.get("users/me")
    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert "username" in data
    assert data["username"] == test_user["username"]
    assert data["handle"] == "alice_doe"


async def test_login_user_not_found(e2e_client, seed_users):
    test_user = {"email": "ghost@example.com", "password": "xxx"}
    response = await e2e_client.post(
        "/auth/login",
        json=test_user
    )
    assert response.status_code == 401


async def test_change_password_success(e2e_client, seed_users):
    test_user = { "email": "alex@example.com", "password": "password12345"}

    response = await e2e_client.post(
        "/auth/login",
        json={"email": test_user["email"], "password": test_user["password"]}
    )

    assert response.status_code == 200

    cookie_client = e2e_client
    cookie_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await cookie_client.post(
        "/auth/change-password",
        json={"old_password": "password12345", "new_password": "newpass12345"},
    )

    assert response.status_code == 204

    response = await e2e_client.post(
    "/auth/login",
        json={"email": test_user["email"], "password": "newpass12345"}
    )
    assert response.status_code == 200


async def test_change_password_wrong_password(e2e_client, seed_users):
    test_user = { "email": "johndoe@example.com", "password": "qwerty12345" }

    response = await e2e_client.post(
        "/auth/login",
        json={"email": test_user["email"], "password": test_user["password"]}
    )

    assert response.status_code == 200

    cookie_client = e2e_client
    cookie_client.cookies.set("access_token", response.cookies.get("access_token"))

    response = await e2e_client.post(
        "/auth/change-password",
        json={"old_password": "wrongpass", "new_password": "newpass"}
    )
    assert response.status_code == 401


async def test_logout_user(e2e_client, seed_users):
    test_user = { "email": "matt@example.com", "password": "password12345"}

    response = await e2e_client.post(
        "/auth/login",
        json={"email": test_user["email"], "password": test_user["password"]}
    )
    assert response.status_code == 200

    token = response.cookies.get("access_token")
    assert token is not None

    cookie_client = e2e_client
    cookie_client.cookies.set("access_token", token)

    response = await cookie_client.post("/auth/logout")
    assert response.status_code == 204

    delete_cookie_header = response.headers.get("set-cookie")
    assert delete_cookie_header is not None
    assert "Max-Age=0" in delete_cookie_header or "expires=" in delete_cookie_header.lower()
    assert "access_token" not in response.cookies
