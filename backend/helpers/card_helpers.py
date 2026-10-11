from datetime import date
from decimal import Decimal
import secrets

from models.card import Card


def create_employee_card(user):
    """
    Generate a mock virtual expense card for an employee.

    The card is returned but not committed to the database here.
    The calling route is responsible for saving it.
    """

    card_number = "9" + "".join(
        str(secrets.randbelow(10))
        for _ in range(15)
    )

    today = date.today()
    card = Card(
        company_id=user.company_id,
        employee_id=user.id,
        employee_name=f"{user.first_name} {user.last_name}",
        card_number=card_number,
        brand="Visa",
        expiration_date=date(
            today.year + 4,
            today.month,
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

def serialize_card(card):
    """
    Return safe card information for the frontend.

    Do not return the stored CVV or complete card number.
    """
    return {
        "id": str(card.id),
        "employeeId": str(card.employee_id),
        "employeeName": card.employee_name,
        "lastFour": card.card_number[-4:],
        "brand": card.brand,
        "expirationDate": card.expiration_date.isoformat(),
        "monthlyBudget": float(card.monthly_budget),
        "spentThisMonth": float(card.spent_this_month),
        "singleTransactionLimit": float(
            card.single_transaction_limit
        ),
        "cardType": card.card_type,
        "isActive": card.is_active,
        "isFrozen": card.is_frozen,
    }