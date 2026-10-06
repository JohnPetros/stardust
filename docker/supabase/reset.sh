#!/bin/sh
set -eu

: "${STARDUST_LOCAL_RESET:?Local reset confirmation is required}"
[ "$STARDUST_LOCAL_RESET" = "compose" ] || {
  echo 'Local reset confirmation is invalid.' >&2
  exit 1
}

case "${DATABASE_URL:-}" in
  postgres://postgres@supabase-postgres:5432/postgres) ;;
  *)
    echo 'DATABASE_URL must target the local Compose PostgreSQL service.' >&2
    exit 1
    ;;
esac

: "${PGPASSWORD:?Local PostgreSQL password is required}"

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
DROP SCHEMA IF EXISTS drizzle CASCADE;
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
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;
SQL
