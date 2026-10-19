"""Replace invitation card limit with category limits

Revision ID: d01eb850e94e
Revises: ee3d00a61959
Create Date: 2026-10-18 21:01:21.178528
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# Revision identifiers used by Alembic.
revision = 'd01eb850e94e'
down_revision = 'ee3d00a61959'
branch_labels = None
depends_on = None


def upgrade():
    # Add the new column as nullable for existing invitation records.
    op.add_column(
        'employee_invitations',
        sa.Column('spending_limits', sa.JSON(), nullable=True)
    )

    # Populate existing records with an empty list of category limits.
    op.execute(
        "UPDATE employee_invitations "
        "SET spending_limits = '[]'::json "
        "WHERE spending_limits IS NULL"
    )

    # Enforce NOT NULL only after every existing row has a value.
    op.alter_column(
        'employee_invitations',
        'spending_limits',
        existing_type=sa.JSON(),
        nullable=False
    )

    # Update timestamp columns to use timezone-aware datetimes.
    op.alter_column(
        'employee_invitations',
        'accepted_at',
        existing_type=postgresql.TIMESTAMP(),
        type_=sa.DateTime(timezone=True),
        existing_nullable=True
    )

    op.alter_column(
        'employee_invitations',
        'revoked_at',
        existing_type=postgresql.TIMESTAMP(),
        type_=sa.DateTime(timezone=True),
        existing_nullable=True
    )

    op.alter_column(
        'employee_invitations',
        'created_at',
        existing_type=postgresql.TIMESTAMP(),
        type_=sa.DateTime(timezone=True),
        existing_nullable=False
    )

    # Remove the old overall card-limit columns.
    op.drop_column('employee_invitations', 'card_limit')
    op.drop_column('employee_invitations', 'card_limit_frequency')


def downgrade():
    # Restore the old columns if this migration is rolled back.
    # Previously stored card-limit values cannot be recovered.
    op.add_column(
        'employee_invitations',
        sa.Column(
            'card_limit_frequency',
            sa.VARCHAR(length=10),
            nullable=False,
            server_default='monthly'
        )
    )

    op.add_column(
        'employee_invitations',
        sa.Column(
            'card_limit',
            sa.NUMERIC(precision=12, scale=2),
            nullable=True
        )
    )

    op.alter_column(
        'employee_invitations',
        'created_at',
        existing_type=sa.DateTime(timezone=True),
        type_=postgresql.TIMESTAMP(),
        existing_nullable=False
    )

    op.alter_column(
        'employee_invitations',
        'revoked_at',
        existing_type=sa.DateTime(timezone=True),
        type_=postgresql.TIMESTAMP(),
        existing_nullable=True
    )

    op.alter_column(
        'employee_invitations',
        'accepted_at',
        existing_type=sa.DateTime(timezone=True),
        type_=postgresql.TIMESTAMP(),
        existing_nullable=True
    )

    op.drop_column('employee_invitations', 'spending_limits')