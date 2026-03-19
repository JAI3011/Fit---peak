from contextlib import asynccontextmanager

import motor.motor_asyncio

from app.config import settings

_client: motor.motor_asyncio.AsyncIOMotorClient | None = None


@asynccontextmanager
async def lifespan(app):
    global _client
    _client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongodb_url)
    yield
    if _client:
        _client.close()


def get_client() -> motor.motor_asyncio.AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError("Database client not initialized. Use lifespan context.")
    return _client


def get_database() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    return get_client()[settings.database_name]
