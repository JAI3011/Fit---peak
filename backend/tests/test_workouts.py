import pytest


@pytest.mark.asyncio
async def test_create_workout(async_client, auth_headers):
    resp = await async_client.post(
        "/api/workouts",
        json={"name": "Morning Run", "workout_type": "cardio", "duration_minutes": 30},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Morning Run"
    assert data["workout_type"] == "cardio"
    assert "_id" in data


@pytest.mark.asyncio
async def test_list_workouts(async_client, auth_headers):
    await async_client.post(
        "/api/workouts",
        json={"name": "Workout A", "duration_minutes": 45},
        headers=auth_headers,
    )
    await async_client.post(
        "/api/workouts",
        json={"name": "Workout B", "duration_minutes": 60},
        headers=auth_headers,
    )

    resp = await async_client.get("/api/workouts", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 2


@pytest.mark.asyncio
async def test_list_workouts_pagination(async_client, auth_headers):
    for i in range(5):
        await async_client.post(
            "/api/workouts",
            json={"name": f"Workout {i}"},
            headers=auth_headers,
        )

    resp = await async_client.get("/api/workouts?limit=3", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) <= 3


@pytest.mark.asyncio
async def test_get_workout(async_client, auth_headers):
    create_resp = await async_client.post(
        "/api/workouts",
        json={"name": "Leg Day", "workout_type": "strength"},
        headers=auth_headers,
    )
    workout_id = create_resp.json()["_id"]

    resp = await async_client.get(f"/api/workouts/{workout_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Leg Day"


@pytest.mark.asyncio
async def test_get_workout_not_found(async_client, auth_headers):
    resp = await async_client.get(
        "/api/workouts/507f1f77bcf86cd799439011", headers=auth_headers
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_workout_invalid_id(async_client, auth_headers):
    resp = await async_client.get("/api/workouts/not-an-id", headers=auth_headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_workout(async_client, auth_headers):
    create_resp = await async_client.post(
        "/api/workouts",
        json={"name": "Original Name"},
        headers=auth_headers,
    )
    workout_id = create_resp.json()["_id"]

    resp = await async_client.put(
        f"/api/workouts/{workout_id}",
        json={"name": "Updated Name", "duration_minutes": 45},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Updated Name"
    assert data["duration_minutes"] == 45


@pytest.mark.asyncio
async def test_delete_workout(async_client, auth_headers):
    create_resp = await async_client.post(
        "/api/workouts",
        json={"name": "To Delete"},
        headers=auth_headers,
    )
    workout_id = create_resp.json()["_id"]

    resp = await async_client.delete(f"/api/workouts/{workout_id}", headers=auth_headers)
    assert resp.status_code == 204

    get_resp = await async_client.get(f"/api/workouts/{workout_id}", headers=auth_headers)
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_workout_not_found(async_client, auth_headers):
    resp = await async_client.delete(
        "/api/workouts/507f1f77bcf86cd799439011", headers=auth_headers
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_workout_requires_auth(async_client):
    resp = await async_client.get("/api/workouts")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_users_cannot_access_others_workouts(async_client, auth_headers):
    create_resp = await async_client.post(
        "/api/workouts",
        json={"name": "User 1 Workout"},
        headers=auth_headers,
    )
    workout_id = create_resp.json()["_id"]

    # Register and login as a second user
    await async_client.post(
        "/api/auth/register",
        json={
            "username": "user2",
            "email": "user2@example.com",
            "password": "password123",
        },
    )
    login_resp = await async_client.post(
        "/api/auth/login",
        data={"username": "user2", "password": "password123"},
    )
    user2_token = login_resp.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    resp = await async_client.get(f"/api/workouts/{workout_id}", headers=user2_headers)
    assert resp.status_code == 404
