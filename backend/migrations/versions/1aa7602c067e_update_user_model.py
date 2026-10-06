"""update user model

Revision ID: 1aa7602c067e
Revises:
Create Date: 2026-10-05 00:03:48.163155

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1aa7602c067e"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("company_id", sa.Integer(), nullable=True)
        )

        batch_op.add_column(
            sa.Column("manager_id", sa.Integer(), nullable=True)
        )

        batch_op.add_column(
            sa.Column("is_active", sa.Boolean(), nullable=False)
        )

        batch_op.create_foreign_key(
            "fk_users_company_id",
            "companies",
            ["company_id"],
            ["id"]
        )

        batch_op.create_foreign_key(
            "fk_users_manager_id",
            "users",
            ["manager_id"],
            ["id"]
        )


def downgrade():
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_constraint(
            "fk_users_manager_id",
            type_="foreignkey"
        )

        batch_op.drop_constraint(
            "fk_users_company_id",
            type_="foreignkey"
        )

        batch_op.drop_column("is_active")
        batch_op.drop_column("manager_id")
        batch_op.drop_column("company_id")