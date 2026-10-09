from datetime import datetime, timezone
from extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Company(db.Model):
    __tablename__ = "companies"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    website = db.Column(db.String(255), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    users = db.relationship("User", back_populates="company")