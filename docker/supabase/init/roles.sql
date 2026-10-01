-- The Supabase Postgres image supplies most of these roles. Keep bootstrap
-- idempotent so it also works with a freshly initialized local data directory.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator LOGIN NOINHERIT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin LOGIN NOINHERIT CREATEROLE CREATEDB;
  END IF;
END
$$;

GRANT anon, authenticated, service_role TO authenticator;

-- Supabase reserves these roles for superuser administration. The local
-- bootstrap process supplies the password through its environment and psql
-- quotes it as a SQL literal, including any special characters.
\getenv role_password SUPABASE_DATABASE_PASSWORD
ALTER ROLE authenticator WITH PASSWORD :'role_password';
ALTER ROLE supabase_auth_admin WITH PASSWORD :'role_password';

CREATE SCHEMA IF NOT EXISTS _realtime AUTHORIZATION supabase_admin;
ALTER SCHEMA _realtime OWNER TO supabase_admin;
GRANT ALL ON SCHEMA _realtime TO supabase_admin;
