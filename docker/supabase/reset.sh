#!/bin/sh
set -eu

: "${DATABASE_URL:?DATABASE_URL must point to the local Compose database}"

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

DO $$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    TRUNCATE TABLE auth.users CASCADE;
  END IF;
END
$$;

SQL

psql -h supabase-postgres -U supabase_admin -d postgres -v ON_ERROR_STOP=1 -c 'DROP SCHEMA IF EXISTS storage CASCADE'
psql -h supabase-postgres -U supabase_admin -d postgres -v ON_ERROR_STOP=1 -f /docker/supabase/init/roles.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f /docker/supabase/init/storage-compatibility.sql

for migration in /migrations/*.sql; do
  [ -f "$migration" ] || continue
  printf 'Applying local migration: %s\n' "${migration##*/}"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration"
done
