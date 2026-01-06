// Run this script to create database tables
// Usage: node run-migration.js

const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_kX0rhy5YBeHG@ep-crimson-hall-a141wgmm-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
});

const sql = `
-- Drop existing tables first (to fix schema)
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- User Table (snake_case columns for Better Auth)
CREATE TABLE "user" (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "email_verified" BOOLEAN DEFAULT FALSE,
    "image" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Table
CREATE TABLE "session" (
    "id" VARCHAR(255) PRIMARY KEY,
    "user_id" VARCHAR(255) NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "token" VARCHAR(255) NOT NULL UNIQUE,
    "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "ip_address" VARCHAR(255),
    "user_agent" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account Table
CREATE TABLE "account" (
    "id" VARCHAR(255) PRIMARY KEY,
    "user_id" VARCHAR(255) NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "account_id" VARCHAR(255) NOT NULL,
    "provider_id" VARCHAR(255) NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "expires_at" TIMESTAMP WITH TIME ZONE,
    "password" VARCHAR(255),
    "scope" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("provider_id", "account_id")
);

-- Verification Table
CREATE TABLE "verification" (
    "id" VARCHAR(255) PRIMARY KEY,
    "identifier" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_session_user_id" ON "session"("user_id");
CREATE INDEX IF NOT EXISTS "idx_account_user_id" ON "account"("user_id");
CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification"("identifier");
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
`;

async function runMigration() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Running migration...');
        await client.query(sql);
        console.log('✓ Tables created successfully!');
        await client.end();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

runMigration();
