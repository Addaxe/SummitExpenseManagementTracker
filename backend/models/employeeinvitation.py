import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.dialects.postgresql import UUID
from extensions import db


class EmployeeInvitation(db.Model):
  __tablename__ = "employee_invitations"

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,)
  company_id = db.Column(UUID(as_uuid=True), db.ForeignKey("companies.id"), nullable=False, index=True,)
  invited_by_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False,)

  email = db.Column(db.String(255), nullable=False, index=True)
  first_name = db.Column(db.String(100), nullable=False)
  last_name = db.Column(db.String(100), nullable=False)
  role = db.Column(db.String(100), nullable=False)
  department = db.Column(db.String(100), nullable=True)

  # NULL means no overall spending cap is assigned.
  card_limit = db.Column(db.Numeric(12, 2), nullable=True)
  card_limit_frequency = db.Column(db.String(10), nullable=False, default="monthly",)

  # Store a hash, not the original invitation token.
  token_hash = db.Column(db.String(64), nullable=False, unique=True)
  expires_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc) + timedelta(minutes=3),
)
  accepted_at = db.Column(db.DateTime, nullable=True)
  revoked_at = db.Column(db.DateTime, nullable=True)
  
  created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))