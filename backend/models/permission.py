from extensions import db


class Permission(db.Model):
    __tablename__ = "permissions"

    id = db.Column(db.Integer, primary_key=True)

    key = db.Column(
        db.String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    name = db.Column(db.String(100), nullable=False)

    description = db.Column(
        db.String(255),
        nullable=False,
        default="",
    )

    category = db.Column(
        db.String(50),
        nullable=False,
    )

    def __repr__(self):
        return f"<Permission {self.key}>"
