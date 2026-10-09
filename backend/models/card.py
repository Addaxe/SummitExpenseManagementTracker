from datetime import datetime, timezone
from extensions import db
from decimal import Decimal
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Card(db.Model):
    __tablename__ = 'fake_company_cards'

    # Native PostgreSQL UUID for primary keys
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Corporate Ownership Links
    company_id = db.Column(UUID(as_uuid=True), nullable=True, index=True)
    employee_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False, index=True)
    employee_name = db.Column(db.String(100), nullable=False)
    employee = db.relationship("User", back_populates="cards")
    
    # Card Credentials
    card_number = db.Column(db.String(19), nullable=False, unique=True)
    brand = db.Column(db.String(20), nullable=False)       # Visa, Mastercard, Amex
    expiration_date = db.Column(db.Date, nullable=False)
    cvv = db.Column(db.String(4), nullable=False)
    
    # Expense Controls & Budgeting (Using PostgreSQL NUMERIC for currency safety)
    monthly_budget = db.Column(db.Numeric(12, 2), nullable=False, default=Decimal('2000.00'))
    spent_this_month = db.Column(db.Numeric(12, 2), nullable=False, default=Decimal('0.00'))
    single_transaction_limit = db.Column(db.Numeric(12, 2), nullable=False, default=Decimal('250.00'))
    
    # Configuration and Status
    card_type = db.Column(db.String(10), nullable=False, default='DEBIT') # VIRTUAL, PHYSICAL, CREDIT, DEBIT
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    is_frozen = db.Column(db.Boolean, nullable=False, default=False)
