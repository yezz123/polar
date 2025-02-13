import asyncio
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio
from httpx import AsyncClient

from polar.app import app
from polar.postgres import AsyncSession, AsyncSessionLocal, get_db_session


# We used to use anyio, but it was causing garbage collection issues
# with SQLAlchemy (known issue - https://stackoverflow.com/a/74221652)
#
# However, since we're using asyncio, it's clearer and cleaner to use it
# throughout vs. anyio with an asyncio backend. We need to setup the
# event loop though as per:
# https://pytest-asyncio.readthedocs.io/en/latest/reference/fixtures.html


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture()
async def client(session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db_session() -> AsyncGenerator[AsyncSession, None]:
        async with AsyncSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db_session] = override_get_db_session

    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
