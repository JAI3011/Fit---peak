import pytest


@pytest.mark.asyncio
async def test_register_success(async_client):
    resp = await async_client.post(
        "/api/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "hashed_password" not in data
    assert "_id" in data


@pytest.mark.asyncio
async def test_register_duplicate_username(async_client, registered_user):
    resp = await async_client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "other@example.com",
            "password": "password123",
        },
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_register_duplicate_email(async_client, registered_user):
    resp = await async_client.post(
        "/api/auth/register",
        json={
            "username": "otheruser",
            "email": "test@example.com",
            "password": "password123",
        },
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_login_success(async_client, registered_user):
    resp = await async_client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpassword123"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(async_client, registered_user):
    resp = await async_client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "wrongpassword"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_user(async_client):
    resp = await async_client.post(
        "/api/auth/login",
        data={"username": "nobody", "password": "pass"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me(async_client, registered_user, auth_headers):
    resp = await async_client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "testuser"


@pytest.mark.asyncio
async def test_get_me_no_token(async_client):
    resp = await async_client.get("/api/auth/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me_invalid_token(async_client):
    resp = await async_client.get(
        "/api/auth/me", headers={"Authorization": "Bearer invalidtoken"}
    )
    assert resp.status_code == 401
