-- Custom data migration: seeds the galaxy catalog, backfills planets and locks the table down.
-- Apply under the migration runner transaction and dedicated advisory-lock session.
-- 0003_galaxies creates the schema (planets.galaxy_id still nullable) and
-- 0005_planets_galaxy_required adds NOT NULL and the unique (galaxy_id, position) afterwards.
--
-- Inverse SQL of 0003-0005 (returns the schema to the state after 0002_server_owned_access).
-- Documentation only: it is never applied by the runner and is executed by
-- scripts/tests/galaxies-migration.integration.test.mjs inside a rolled back transaction.
-- inverse> ALTER TABLE "planets" DROP CONSTRAINT IF EXISTS "planets_galaxy_id_position_key";
-- inverse> ALTER TABLE "planets" DROP COLUMN IF EXISTS "galaxy_id";
-- inverse> ALTER TABLE "users" DROP COLUMN IF EXISTS "current_galaxy_id";
-- inverse> DROP TABLE IF EXISTS "galaxies";
-- inverse> DROP TYPE IF EXISTS "public"."galaxy_status";

INSERT INTO "public"."galaxies" ("id", "slug", "name", "description", "animation", "position", "status")
VALUES (
  '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01',
  'logica-de-programacao',
  'Lógica de Programação',
  'Aprenda a pensar como quem programa: variáveis, condições, laços e funções.',
  'logica-de-programacao.json',
  1,
  'published'
);
--> statement-breakpoint
INSERT INTO "public"."galaxies" ("id", "slug", "name", "description", "animation", "position", "status")
VALUES (
  '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a02',
  'orientacao-a-objetos',
  'Orientação a Objetos',
  'Organize programas em classes e objetos que trabalham juntos.',
  'orientacao-a-objetos.json',
  2,
  'announced'
);
--> statement-breakpoint
UPDATE "public"."planets" SET "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01' WHERE "galaxy_id" IS NULL;
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."galaxies" FROM PUBLIC, "anon", "authenticated";
