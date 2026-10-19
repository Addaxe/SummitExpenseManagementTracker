
import uuid
from decimal import Decimal

from extensions import db
from sqlalchemy.dialects.postgresql import UUID


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    company_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    employee_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )

    card_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("fake_company_cards.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    category_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("expense_categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )

    merchant = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500), nullable=True)

    amount = db.Column(
        db.Numeric(12, 2),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="pending"
    )  # pending, approved, declined, reversed

    occurred_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
        index=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    employee = db.relationship(
        "User",
        back_populates="transactions"
    )

    card = db.relationship(
        "Card",
        back_populates="transactions"
    )

    category = db.relationship(
        "ExpenseCategory",
        back_populates="transactions"
    )

    __table_args__ = (
        db.CheckConstraint(
            "amount >= 0",
            name="ck_transaction_amount_nonnegative"
        ),
        db.CheckConstraint(
            "status IN ('pending', 'approved', 'declined', 'reversed')",
            name="ck_transaction_status"
        ),
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "company_id": str(self.company_id),
            "employee_id": str(self.employee_id),
            "card_id": str(self.card_id) if self.card_id else None,
            "category_id": str(self.category_id),
            "category": self.category.name,
            "merchant": self.merchant,
            "description": self.description,
            "amount": str(self.amount),
            "status": self.status,
            "occurred_at": (
                self.occurred_at.isoformat()
                if self.occurred_at else None
            ),
        }
