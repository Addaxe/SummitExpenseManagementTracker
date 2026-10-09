from datetime import datetime, timezone
from extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(50), nullable=False, default="Employee")
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey("companies.id"), nullable=True, index=True)
    manager_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=True, index=True)

    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    cards = db.relationship( "Card", back_populates="employee")
    company = db.relationship("Company", back_populates="users")
    manager = db.relationship("User", remote_side=[id], backref="direct_reports")