-- Legacy application migrations attach policies to storage.objects. The local
-- stack intentionally has no Supabase Storage API or preloaded objects.
CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL,
  name text NOT NULL,
  UNIQUE (bucket_id, name)
);
