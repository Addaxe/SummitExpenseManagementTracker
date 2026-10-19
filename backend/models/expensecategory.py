

import uuid

from extensions import db
from sqlalchemy.dialects.postgresql import UUID


class ExpenseCategory(db.Model):
    __tablename__ = "expense_categories"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # NULL means this is a shared/default category.
    company_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    spending_limits = db.relationship(
        "EmployeeSpendingLimit",
        back_populates="category",
        cascade="all, delete-orphan"
    )

    transactions = db.relationship(
        "Transaction",
        back_populates="category"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "company_id",
            "name",
            name="uq_expense_category_company_name"
        ),
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "company_id": (
                str(self.company_id) if self.company_id else None
            ),
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
        }