from datetime import date
from decimal import Decimal
import secrets

from models.card import Card


def create_employee_card(user):
  card_number = "9" + "".join(
    str(secrets.randbelow(10))
    for _ in range(15)
  )

  card = Card(
    company_id=user.company_id,
    employee_id=user.id,
    employee_name=f"{user.first_name} {user.last_name}",
    card_number=card_number,
    brand="Visa",
    expiration_date=date(
        date.today().year + 4,
        date.today().month,
        1,
    ),
    cvv=f"{secrets.randbelow(1000):03d}",
    monthly_budget=Decimal("1000.00"),
    spent_this_month=Decimal("0.00"),
    single_transaction_limit=Decimal("250.00"),
    card_type="VIRTUAL",
    is_active=True,
    is_frozen=False,
  )

  return card