import pytest


@pytest.mark.asyncio
async def test_create_progress_record(async_client, auth_headers):
    resp = await async_client.post(
        "/api/progress",
        json={"weight_kg": 75.5, "body_fat_percentage": 18.0, "waist_cm": 82.0},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["weight_kg"] == 75.5
    assert data["body_fat_percentage"] == 18.0
    assert "_id" in data


@pytest.mark.asyncio
async def test_list_progress_records(async_client, auth_headers):
    await async_client.post(
        "/api/progress",
        json={"weight_kg": 75.0},
        headers=auth_headers,
    )
    await async_client.post(
        "/api/progress",
        json={"weight_kg": 74.5},
        headers=auth_headers,
    )

    resp = await async_client.get("/api/progress", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 2


@pytest.mark.asyncio
async def test_get_progress_record(async_client, auth_headers):
    create_resp = await async_client.post(
        "/api/progress",
        json={"weight_kg": 76.0, "chest_cm": 100.0},
        headers=auth_headers,
    )
    record_id = create_resp.json()["_id"]

    resp = await async_client.get(f"/api/progress/{record_id}", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["weight_kg"] == 76.0
    assert data["chest_cm"] == 100.0


@pytest.mark.asyncio
async def test_get_progress_record_not_found(async_client, auth_headers):
    resp = await async_client.get(
        "/api/progress/507f1f77bcf86cd799439011", headers=auth_headers
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_progress_summary_empty(async_client, auth_headers):
    resp = await async_client.get("/api/progress/summary", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_records"] == 0
    assert data["latest_weight_kg"] is None


@pytest.mark.asyncio
async def test_get_progress_summary_with_data(async_client, auth_headers):
    await async_client.post(
        "/api/progress",
        json={"weight_kg": 80.0, "body_fat_percentage": 20.0},
        headers=auth_headers,
    )
    await async_client.post(
        "/api/progress",
        json={"weight_kg": 78.5, "body_fat_percentage": 19.0, "waist_cm": 85.0},
        headers=auth_headers,
    )

    resp = await async_client.get("/api/progress/summary", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_records"] == 2
    assert data["latest_weight_kg"] is not None


@pytest.mark.asyncio
async def test_progress_pagination(async_client, auth_headers):
    for i in range(5):
        await async_client.post(
            "/api/progress",
            json={"weight_kg": 75.0 - i * 0.5},
            headers=auth_headers,
        )

    resp = await async_client.get("/api/progress?limit=3", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 3


@pytest.mark.asyncio
async def test_progress_requires_auth(async_client):
    resp = await async_client.get("/api/progress")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_users_cannot_access_others_progress(async_client, auth_headers):
    create_resp = await async_client.post(
        "/api/progress",
        json={"weight_kg": 70.0},
        headers=auth_headers,
    )
    record_id = create_resp.json()["_id"]

    await async_client.post(
        "/api/auth/register",
        json={
            "username": "user2prog",
            "email": "user2prog@example.com",
            "password": "password123",
        },
    )
    login_resp = await async_client.post(
        "/api/auth/login",
        data={"username": "user2prog", "password": "password123"},
    )
    user2_token = login_resp.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    resp = await async_client.get(f"/api/progress/{record_id}", headers=user2_headers)
    assert resp.status_code == 404
