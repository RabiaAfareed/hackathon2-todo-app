"""
Migration script to rename snake_case columns to camelCase for Better Auth compatibility.
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
        # Rename columns from snake_case to camelCase
        cursor.execute('ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt";')
        cursor.execute('ALTER TABLE "user" RENAME COLUMN "updated_at" TO "updatedAt";')
        conn.commit()
        print("Successfully renamed columns: created_at -> createdAt, updated_at -> updatedAt")
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    migrate()
