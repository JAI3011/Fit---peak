import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from mongomock_motor import AsyncMongoMockClient

import app.database as db_module
from app.main import app


@pytest_asyncio.fixture
async def mock_db():
    """Provide a mongomock database and patch the module-level client."""
    client = AsyncMongoMockClient()
    original_client = db_module._client
    db_module._client = client
    yield client[db_module.settings.database_name]
    db_module._client = original_client


@pytest_asyncio.fixture
async def async_client(mock_db):
    """HTTP client wired to the FastAPI app with a mocked DB."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture
async def registered_user(async_client):
    """Register a user and return their credentials + token."""
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
    }
    resp = await async_client.post("/api/auth/register", json=payload)
    assert resp.status_code == 201, resp.text

    login_resp = await async_client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpassword123"},
    )
    assert login_resp.status_code == 200, login_resp.text
    token = login_resp.json()["access_token"]

    return {**payload, "token": token, "id": resp.json()["_id"]}


@pytest_asyncio.fixture
async def auth_headers(registered_user):
    return {"Authorization": f"Bearer {registered_user['token']}"}
