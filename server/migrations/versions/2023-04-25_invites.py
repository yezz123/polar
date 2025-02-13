"""invites

Revision ID: 925c9f34054d
Revises: b6e372d137bc
Create Date: 2023-04-25 15:46:05.455775

"""
from alembic import op
import sqlalchemy as sa


# Polar Custom Imports

# revision identifiers, used by Alembic.
revision = "925c9f34054d"
down_revision = "b6e372d137bc"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    op.create_table(
        "invites",
        sa.Column("created_by", sa.UUID(), nullable=False),
        sa.Column("sent_to_email", sa.String(), nullable=True),
        sa.Column("claimed_by", sa.UUID(), nullable=True),
        sa.Column("code", sa.String(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("modified_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["claimed_by"], ["users.id"], name=op.f("invites_claimed_by_fkey")
        ),
        sa.ForeignKeyConstraint(
            ["created_by"], ["users.id"], name=op.f("invites_created_by_fkey")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("invites_pkey")),
    )
    op.create_index(op.f("ix_invites_code"), "invites", ["code"], unique=True)

    # Add as nullable -> Set default for existing rows -> Drop nullable
    op.add_column(
        "users",
        sa.Column("invite_only_approved", sa.Boolean(), nullable=True),
    )
    op.execute("update users set invite_only_approved = 'true'")
    op.alter_column("users", "invite_only_approved", nullable=False)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("users", "invite_only_approved")
    op.drop_index(op.f("ix_invites_code"), table_name="invites")
    op.drop_table("invites")
    # ### end Alembic commands ###
