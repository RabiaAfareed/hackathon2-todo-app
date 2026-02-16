"""
Migration script to rename snake_case columns to camelCase in session and verification tables.
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
        # Rename session table columns
        cursor.execute('ALTER TABLE "session" RENAME COLUMN "user_id" TO "userId";')
        cursor.execute('ALTER TABLE "session" RENAME COLUMN "expires_at" TO "expiresAt";')
        cursor.execute('ALTER TABLE "session" RENAME COLUMN "ip_address" TO "ipAddress";')
        cursor.execute('ALTER TABLE "session" RENAME COLUMN "user_agent" TO "userAgent";')

        # Rename verification table columns
        cursor.execute('ALTER TABLE "verification" RENAME COLUMN "expires_at" TO "expiresAt";')

        conn.commit()
        print("Successfully renamed session and verification table columns to camelCase")
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    migrate()
