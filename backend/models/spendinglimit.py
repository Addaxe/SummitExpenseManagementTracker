
import uuid
from decimal import Decimal

from extensions import db
from sqlalchemy.dialects.postgresql import UUID


class EmployeeSpendingLimit(db.Model):
    __tablename__ = "employee_spending_limits"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    employee_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    category_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("expense_categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )

    amount = db.Column(
        db.Numeric(12, 2),
        nullable=False
    )

    frequency = db.Column(
        db.String(20),
        nullable=False
    )  # daily, weekly, monthly, yearly

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

    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    employee = db.relationship(
        "User",
        back_populates="spending_limits"
    )

    category = db.relationship(
        "ExpenseCategory",
        back_populates="spending_limits"
    )

    __table_args__ = (
        db.CheckConstraint(
            "amount >= 0",
            name="ck_employee_spending_limit_nonnegative"
        ),
        db.CheckConstraint(
            "frequency IN ('daily', 'weekly', 'monthly', 'yearly')",
            name="ck_employee_spending_limit_frequency"
        ),
        db.UniqueConstraint(
            "employee_id",
            "category_id",
            name="uq_employee_spending_limit_category"
        ),
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "employee_id": str(self.employee_id),
            "category_id": str(self.category_id),
            "category": self.category.name,
            "amount": float(self.amount),
            "frequency": self.frequency,
            "is_active": self.is_active,
        }