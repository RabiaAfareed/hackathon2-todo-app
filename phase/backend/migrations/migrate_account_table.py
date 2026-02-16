"""
Migration script to rename snake_case columns to camelCase in account table.
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import psycopg2
from core.config import settings

def migrate():
    conn = psycopg2.connect(settings.DATABASE_URL)
    cursor = conn.cursor()

    try:
        # Rename account table columns
        cursor.execute('ALTER TABLE "account" RENAME COLUMN "user_id" TO "userId";')
        cursor.execute('ALTER TABLE "account" RENAME COLUMN "account_id" TO "accountId";')
        cursor.execute('ALTER TABLE "account" RENAME COLUMN "provider_id" TO "providerId";')
        cursor.execute('ALTER TABLE "account" RENAME COLUMN "access_token" TO "accessToken";')
        cursor.execute('ALTER TABLE "account" RENAME COLUMN "refresh_token" TO "refreshToken";')
        cursor.execute('ALTER TABLE "account" RENAME COLUMN "id_token" TO "idToken";')
        cursor.execute('ALTER TABLE "account" RENAME COLUMN "expires_at" TO "expiresAt";')

        conn.commit()
        print("Successfully renamed account table columns to camelCase")
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    migrate()
