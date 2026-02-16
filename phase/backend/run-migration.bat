@echo off
echo Running database migration...
set DATABASE_URL=postgresql://neondb_owner:npg_kX0rhy5YBeHG@ep-crimson-hall-a141wgmm-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

echo If you have psql installed, run this command:
echo psql "%DATABASE_URL%" -f migrations/001_create_better_auth_tables.sql

echo.
echo Otherwise, copy the SQL from migrations/001_create_better_auth_tables.sql
echo and paste it in Neon SQL Editor: https://console.neon.tech
pause
