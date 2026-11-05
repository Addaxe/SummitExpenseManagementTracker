import uuid
from sqlalchemy.dialects.postgresql import UUID
from extensions import db


class Department(db.Model):
    __tablename__ = "departments"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    company_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("companies.id"),
        nullable=False,
        index=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.String(255),
        nullable=False,
        default=""
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    company = db.relationship(
        "Company",
        back_populates="departments"
    )

    employees = db.relationship(
        "User",
        back_populates="department"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "company_id",
            "name",
            name="uq_department_company_name"
        ),
    )