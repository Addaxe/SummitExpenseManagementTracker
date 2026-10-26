from datetime import datetime, timezone
import uuid
from extensions import db
from sqlalchemy.dialects.postgresql import UUID


class Company(db.Model):
    __tablename__ = "companies"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name = db.Column(
        db.String(255),
        nullable=False,
    )

    website = db.Column(
        db.String(255),
        unique=True,
        nullable=True,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Employees and users belonging to this company.
    users = db.relationship(
        "User",
        back_populates="company",
    )

    # Custom and system roles belonging to this company.
    roles = db.relationship(
        "Role",
        back_populates="company",
    )
