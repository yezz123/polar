from datetime import datetime
import random
import uuid

import pytest_asyncio
from polar.enums import Platforms

from polar.models.issue import Issue
from polar.models.organization import Organization
from polar.models.pledge import Pledge
from polar.models.pull_request import PullRequest
from polar.models.repository import Repository
from polar.models.user import User
from polar.organization.schemas import OrganizationCreate
from polar.pledge.schemas import PledgeState
from polar.postgres import AsyncSession

from polar.integrations.github.service import (
    github_organization,
    github_repository,
)
from polar.repository.schemas import RepositoryCreate


@pytest_asyncio.fixture(scope="module")
async def predictable_organization(session: AsyncSession) -> Organization:
    create_schema = OrganizationCreate(
        platform=Platforms.github,
        name="testorg",
        external_id=random.randrange(5000),
        avatar_url="http://avatar_url",
        is_personal=False,
        installation_id=random.randrange(5000),
        installation_created_at=datetime.now(),
        installation_updated_at=datetime.now(),
        installation_suspended_at=None,
    )

    org = await github_organization.upsert(session, create_schema)
    session.add(org)
    await session.commit()
    return org


@pytest_asyncio.fixture(scope="module")
async def predictable_pledging_organization(session: AsyncSession) -> Organization:
    create_schema = OrganizationCreate(
        platform=Platforms.github,
        name="pledging_org",
        external_id=random.randrange(5000),
        avatar_url="http://avatar_url",
        is_personal=False,
        installation_id=random.randrange(5000),
        installation_created_at=datetime.now(),
        installation_updated_at=datetime.now(),
        installation_suspended_at=None,
    )

    org = await github_organization.upsert(session, create_schema)
    session.add(org)
    await session.commit()
    return org


@pytest_asyncio.fixture(scope="module")
async def predictable_repository(
    session: AsyncSession, predictable_organization: Organization
) -> Repository:
    create_schema = RepositoryCreate(
        platform=Platforms.github,
        name="testrepo",
        organization_id=predictable_organization.id,
        external_id=random.randrange(5000),
        is_private=True,
    )
    repo = await github_repository.upsert(session, create_schema)
    session.add(repo)
    await session.commit()
    return repo


@pytest_asyncio.fixture(scope="module")
async def predictable_issue(
    session: AsyncSession,
    predictable_organization: Organization,
    predictable_repository: Repository,
) -> Issue:
    issue = await Issue.create(
        session=session,
        id=uuid.uuid4(),
        organization_id=predictable_organization.id,
        repository_id=predictable_repository.id,
        title="issue title",
        number=123,
        platform=Platforms.github,
        external_id=random.randrange(5000),
        state="open",
        issue_created_at=datetime.now(),
        issue_modified_at=datetime.now(),
    )

    await session.commit()
    return issue


@pytest_asyncio.fixture(scope="module")
async def predictable_user(
    session: AsyncSession,
) -> User:
    user = await User.create(
        session=session,
        id=uuid.uuid4(),
        username="foobar",
        email="test@example.com",
        invite_only_approved=True,
    )

    await session.commit()
    return user


@pytest_asyncio.fixture(scope="module")
async def predictable_pledge(
    session: AsyncSession,
    predictable_organization: Organization,
    predictable_repository: Repository,
    predictable_issue: Issue,
    predictable_pledging_organization: Organization,
) -> Pledge:
    pledge = await Pledge.create(
        session=session,
        id=uuid.uuid4(),
        by_organization_id=predictable_pledging_organization.id,
        issue_id=predictable_issue.id,
        repository_id=predictable_repository.id,
        organization_id=predictable_organization.id,
        amount=12345,
        fee=123,
        state=PledgeState.created,
    )

    await session.commit()
    return pledge


@pytest_asyncio.fixture(scope="module")
async def predictable_pull_request(
    session: AsyncSession,
    predictable_organization: Organization,
    predictable_repository: Repository,
) -> PullRequest:
    pr = await PullRequest.create(
        session=session,
        id=uuid.uuid4(),
        repository_id=predictable_repository.id,
        organization_id=predictable_organization.id,
        number=5555,
        external_id=random.randrange(5000),
        title="PR Title",
        author={"login": "pr_creator_login"},
        platform=Platforms.github,
        state="open",
        issue_created_at=datetime.now(),
        issue_modified_at=datetime.now(),
    )

    await session.commit()
    return pr
