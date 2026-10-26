
from sqlalchemy.dialects.postgresql import UUID
from extensions import db
from models.permission import Permission

role_permissions = db.Table(
    "role_permissions",
    db.Column(
        "role_id",
        db.Integer,
        db.ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    db.Column(
        "permission_id",
        db.Integer,
        db.ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    company_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("companies.id"),
        nullable=False,
        index=True,
    )

    name = db.Column(
        db.String(100),
        nullable=False,
    )

    description = db.Column(
        db.String(255),
        nullable=False,
        default="",
    )

    is_system = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
    )

    # Permissions assigned to this role.
    permissions = db.relationship(
        "Permission",
        secondary=role_permissions,
        lazy="selectin",
    )

    # Users assigned to this role.
    employees = db.relationship(
        "User",
        back_populates="role",
    )

    company = db.relationship(
        "Company",
        back_populates="roles",
    )

    __table_args__ = (
        db.UniqueConstraint(
            "company_id",
            "name",
            name="uq_role_company_name",
        ),
    )

    def has_permission(self, permission_key):
        """Return True if this role has the specified permission."""
        return any(
            permission.key == permission_key
            for permission in self.permissions
        )

    def __repr__(self):
        return f"<Role {self.name}>"
