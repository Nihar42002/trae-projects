import os
import sys

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
DEMO_EMAIL = os.getenv("DEMO_EMAIL", "demo@example.com")
DEMO_PASSWORD = os.getenv("DEMO_PASSWORD")
DEMO_NAME = os.getenv("DEMO_NAME", "Demo Organizer")


def get_required_config() -> tuple[str, str, str]:
    missing = [
        name
        for name, value in {
            "SUPABASE_URL": SUPABASE_URL,
            "SUPABASE_SERVICE_ROLE_KEY": SERVICE_ROLE_KEY,
            "DEMO_PASSWORD": DEMO_PASSWORD,
        }.items()
        if not value
    ]
    if missing:
        raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")
    return SUPABASE_URL, SERVICE_ROLE_KEY, DEMO_PASSWORD


def create_or_find_user(client: Client, email: str, password: str) -> str:
    users = client.auth.admin.list_users()
    existing = next((user for user in users if user.email == email), None)

    if existing:
        return existing.id

    response = client.auth.admin.create_user(
        {
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {"name": DEMO_NAME},
        }
    )
    return response.user.id


def update_seeded_rows(client: Client, user_id: str) -> None:
    for table, column in (("events", "organizerid"), ("bookings", "userid")):
        response = client.table(table).update({column: user_id}).eq(column, "demo-organizer").execute()
        if response.data:
            print(f"Updated {len(response.data)} {table} row(s)")


if __name__ == "__main__":
    try:
        url, service_role_key, password = get_required_config()
        supabase = create_client(url, service_role_key)
        user_id = create_or_find_user(supabase, DEMO_EMAIL, password)
        update_seeded_rows(supabase, user_id)
        print(f"Demo user ready: {DEMO_EMAIL} ({user_id})")
    except Exception as error:
        print(f"Failed to create demo user: {error}", file=sys.stderr)
        raise SystemExit(1)
