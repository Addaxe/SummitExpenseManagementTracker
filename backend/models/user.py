
from datetime import datetime, timezone
import uuid

from extensions import db
from sqlalchemy.dialects.postgresql import UUID


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    # Connect this user to a customizable database role.
    # Nullable initially to support existing users during migration.
    role_id = db.Column(
        db.Integer,
        db.ForeignKey("roles.id"),
        nullable=True,
        index=True,
    )

    department = db.Column(db.String(100), nullable=True)

    company_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("companies.id"),
        nullable=True,
        index=True,
    )

    manager_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Assigned role and its permissions.
    role = db.relationship(
        "Role",
        back_populates="employees",
    )

    cards = db.relationship(
        "Card",
        back_populates="employee",
    )

    company = db.relationship(
        "Company",
        back_populates="users",
    )

    manager = db.relationship(
        "User",
        remote_side=[id],
        backref="direct_reports",
    )

    spending_limits = db.relationship(
        "EmployeeSpendingLimit",
        back_populates="employee",
        cascade="all, delete-orphan",
    )

    transactions = db.relationship(
        "Transaction",
        back_populates="employee",
    )

    def has_permission(self, permission_key):
        """Check whether this user has a specific permission."""
        if not self.is_active or self.role is None:
            return False

        # Ensure the assigned role belongs to the user's company.
        if self.role.company_id != self.company_id:
            return False

        return self.role.has_permission(permission_key)
