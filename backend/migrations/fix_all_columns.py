"""
Migration script to fix remaining columns in session and verification tables.
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
        # Fix session table
        cursor.execute('ALTER TABLE "session" RENAME COLUMN "created_at" TO "createdAt";')
        cursor.execute('ALTER TABLE "session" RENAME COLUMN "updated_at" TO "updatedAt";')

        # Fix verification table
        cursor.execute('ALTER TABLE "verification" RENAME COLUMN "created_at" TO "createdAt";')
        cursor.execute('ALTER TABLE "verification" RENAME COLUMN "updated_at" TO "updatedAt";')

        conn.commit()
        print("Successfully renamed columns to camelCase")
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    migrate()
