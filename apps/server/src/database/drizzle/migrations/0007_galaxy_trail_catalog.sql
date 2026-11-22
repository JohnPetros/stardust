-- Custom data migration: replaces the Logic trail catalog, resets the progress facts and rebuilds the SQL objects
-- that read the removed progress tables. Applied under the migration runner transaction.
-- 0006 creates users_completed_stars/users_opened_planets, stars.description and planets.concept;
-- 0008 drops users_unlocked_stars and users_recently_unlocked_stars.
--
-- Inverse SQL (documentation only; executed by scripts/tests/galaxy-trail-migration.integration.test.mjs
-- inside a rolled back transaction). It restores the catalog placement, not the removed progress data.
-- inverse> DELETE FROM "stars" WHERE "planet_id" IN (SELECT "id" FROM "planets" WHERE "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01' AND "concept" IS NOT NULL);
-- inverse> DELETE FROM "planets" WHERE "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01' AND "concept" IS NOT NULL;
-- inverse> UPDATE "stars" SET "slug" = regexp_replace("slug", '-trilha-anterior$', '') WHERE "planet_id" IN (SELECT "id" FROM "planets" WHERE "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a04');
-- inverse> UPDATE "planets" SET "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01' WHERE "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a04';
-- inverse> DELETE FROM "galaxies" WHERE "id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a04';

--> statement-breakpoint
INSERT INTO "public"."galaxies" ("id", "slug", "name", "description", "animation", "position", "status")
VALUES ('7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a04', 'trilha-anterior', 'Trilha anterior', 'Trilha anterior da Lógica de Programação, preservada fora da trilha publicada.', 'logica-de-programacao.json', 4, 'unpublished')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
UPDATE "public"."stars" SET "slug" = "slug" || '-trilha-anterior'
WHERE "planet_id" IN (SELECT "id" FROM "public"."planets" WHERE "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01') AND "slug" NOT LIKE '%-trilha-anterior';
--> statement-breakpoint
UPDATE "public"."planets" SET "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a04' WHERE "galaxy_id" = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01';
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('8f63bbe8-1a61-5e02-8203-02b2cced2c0e', 'Aurora', 'planet-aurora-image.webp', 'planet-2ee862da-4b73-4fb3-984a-d6ed1743102b-icon.svg', 1, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Introdução')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('8871e6f0-504e-5950-b143-2231834ddb59', 'Trívia', 'planet-trivia-image.webp', 'planet-8c3b6cab-d3c6-4d64-8701-c580d4a6d31a-icon.svg', 2, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Tipos de dados')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('ce465553-4dd6-5269-8c65-476153c95672', 'Kalkulon', 'planet-kalkulon-image.webp', 'planet-800775c1-b4f7-4dc7-8010-142f8dfb7ac9-icon.svg', 3, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Operadores')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('c7ccb862-a6dd-545e-bc42-019982781071', 'Ifthenia', 'planet-ifthenia-image.webp', 'planet-83500701-a9b7-4f5b-8a63-599a08406f73-icon.svg', 4, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Condicionais')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('b70a8265-3da1-50b3-89e6-21670b16560e', 'Cíclade', 'planet-ciclade-image.webp', 'planet-6a4aca25-b962-4cad-9aa4-81e0a2b6c0ee-icon.svg', 5, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Laços')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('7c6cbba3-6885-5299-9e60-0292c805eb98', 'O Comboio, parte 1', 'planet-o-comboio-parte-1-image.webp', 'planet-f0fa99e3-d5fb-4ff0-8c29-a3fc7cff21e8.icon.svg', 6, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Listas: acessar e modificar')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('75d05e17-a249-5169-bf1f-f67416de64ca', 'O Comboio, parte 2', 'planet-o-comboio-parte-2-image.webp', 'planet-f0fa99e3-d5fb-4ff0-8c29-a3fc7cff21e8.icon.svg', 7, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Listas: transformar e percorrer')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('4577fd66-fe43-56ad-85d9-ef04b82a2b11', 'Arcana', 'planet-arcana-image.webp', 'planet-af70e6c2-49b3-4bdf-a548-6512b0f5dc94-icon.svg', 8, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Funções')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('a226fe90-e261-5674-b911-179c4fc4c87a', 'Perene', 'planet-perene-image.webp', 'planet-f0fa99e3-d5fb-4ff0-8c29-a3fc7cff21e8.icon.svg', 9, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Tuplas')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."planets" ("id", "name", "image", "icon", "position", "is_available", "galaxy_id", "concept")
VALUES ('b65124fd-d6c2-5f64-972e-56cfb29361c9', 'Chavalor', 'planet-chavalor-image.webp', 'planet-4334d4ed-7b36-4e17-a917-7839f09f670e-image.svg-icon.svg', 10, true, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01', 'Dicionários')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('34a9d6e5-9992-560d-95bb-bb1dd642b31b', 'Lógica de programação', 1, false, '8f63bbe8-1a61-5e02-8203-02b2cced2c0e', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'logica-de-programacao', NULL, true, 'Estrela de história sobre lógica de programação.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('6fcd9371-bcf1-5392-98ec-5679e5c3715e', 'Variáveis', 2, false, '8f63bbe8-1a61-5e02-8203-02b2cced2c0e', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'variaveis', NULL, true, 'Estrela de história sobre variáveis.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('ecfa36b3-52a9-5c34-b69b-09cbb57765ed', 'Escreva e leia', 3, false, '8f63bbe8-1a61-5e02-8203-02b2cced2c0e', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'escreva-e-leia', NULL, true, 'Estrela de história sobre escreva e leia.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('840e6889-a7ce-55fd-930a-f62274e07b9b', 'Desafio: Decolar', 4, true, '8f63bbe8-1a61-5e02-8203-02b2cced2c0e', NULL, NULL, 'desafio-decolar', NULL, true, 'Desafio final de Aurora.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('d108b809-c54c-58cf-833b-afe495b12dd0', 'Tipo texto', 1, false, '8871e6f0-504e-5950-b143-2231834ddb59', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'tipo-texto', NULL, true, 'Estrela de história sobre tipo texto.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('5f956f61-8f15-5d65-978f-655b51e4d286', 'Tipo número', 2, false, '8871e6f0-504e-5950-b143-2231834ddb59', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'tipo-numero', NULL, true, 'Estrela de história sobre tipo número.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('a649a09b-f470-533d-a800-7779f419a3dd', 'Tipo lógico', 3, false, '8871e6f0-504e-5950-b143-2231834ddb59', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'tipo-logico', NULL, true, 'Estrela de história sobre tipo lógico.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('0ec4db70-858c-5af5-b48c-eeb19a8db2c2', 'Desafio: Reunir os três pedaços', 4, true, '8871e6f0-504e-5950-b143-2231834ddb59', NULL, NULL, 'desafio-reunir-os-tres-pedacos', NULL, true, 'Desafio final de Trívia.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('9fc20d4a-23e3-5d1f-a543-5bb2b6a4864c', 'Operadores aritméticos', 1, false, 'ce465553-4dd6-5269-8c65-476153c95672', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'operadores-aritmeticos', NULL, true, 'Estrela de história sobre operadores aritméticos.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('bc79a87d-f8bd-5fb0-8927-5ad360a67c0a', 'Operadores relacionais', 2, false, 'ce465553-4dd6-5269-8c65-476153c95672', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'operadores-relacionais', NULL, true, 'Estrela de história sobre operadores relacionais.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('336156eb-4edc-5f4e-a8d1-5dc19c63e0ab', 'Operadores lógicos', 3, false, 'ce465553-4dd6-5269-8c65-476153c95672', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'operadores-logicos', NULL, true, 'Estrela de história sobre operadores lógicos.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('7251f0b5-3409-5b9c-907a-77294b6d798e', 'Desafio: Atravessar a chuva de asteroides', 4, true, 'ce465553-4dd6-5269-8c65-476153c95672', NULL, NULL, 'desafio-atravessar-a-chuva-de-asteroides', NULL, true, 'Desafio final de Kalkulon.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('3a790d12-9eb8-58fb-bda4-edb566ccfdfc', 'Se', 1, false, 'c7ccb862-a6dd-545e-bc42-019982781071', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'se', NULL, true, 'Estrela de história sobre se.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('0b9821ea-86b3-50b9-9c25-6ab9cd0c66b4', 'Senão', 2, false, 'c7ccb862-a6dd-545e-bc42-019982781071', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'senao', NULL, true, 'Estrela de história sobre senão.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('1d8725db-acec-5454-b7e1-067428a87e26', 'Senão se', 3, false, 'c7ccb862-a6dd-545e-bc42-019982781071', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'senao-se', NULL, true, 'Estrela de história sobre senão se.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('3a90e5bf-151c-55b5-ad6d-25449c3e0c45', 'Escolha caso', 4, false, 'c7ccb862-a6dd-545e-bc42-019982781071', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'escolha-caso', NULL, true, 'Estrela de história sobre escolha caso.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('c82a9b28-2b2c-5a4a-8745-cec95df5ea06', 'Desafio: Reais ou Ocos', 5, true, 'c7ccb862-a6dd-545e-bc42-019982781071', NULL, NULL, 'desafio-reais-ou-ocos', NULL, true, 'Desafio final de Ifthenia.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('e970bacd-761f-5af5-8514-4f593dfc1e55', 'Para', 1, false, 'b70a8265-3da1-50b3-89e6-21670b16560e', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'para', NULL, true, 'Estrela de história sobre para.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('218b7e45-6300-54e9-97c8-87b2b65b968b', 'Enquanto', 2, false, 'b70a8265-3da1-50b3-89e6-21670b16560e', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'enquanto', NULL, true, 'Estrela de história sobre enquanto.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('4b66c0d1-0a98-552b-9a1f-7ac423498df4', 'Fazer enquanto', 3, false, 'b70a8265-3da1-50b3-89e6-21670b16560e', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'fazer-enquanto', NULL, true, 'Estrela de história sobre fazer enquanto.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('32622914-ed4a-5176-902a-b33def714d1d', 'Desafio: Sair de Cíclade', 4, true, 'b70a8265-3da1-50b3-89e6-21670b16560e', NULL, NULL, 'desafio-sair-de-ciclade', NULL, true, 'Desafio final de Cíclade.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('c2b6bf48-3e3c-51f2-bf31-331467dcec41', 'Índice', 1, false, '7c6cbba3-6885-5299-9e60-0292c805eb98', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'indice', NULL, true, 'Estrela de história sobre índice.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('0b7d4634-f770-5d3a-ae0e-88f59f82e36e', 'Adicionar e remover', 2, false, '7c6cbba3-6885-5299-9e60-0292c805eb98', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'adicionar-e-remover', NULL, true, 'Estrela de história sobre adicionar e remover.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('2a8b06bf-8ba6-5cb4-8ca5-29be7fd33031', 'Desafio: Alcançar a nave zero', 3, true, '7c6cbba3-6885-5299-9e60-0292c805eb98', NULL, NULL, 'desafio-alcancar-a-nave-zero', NULL, true, 'Desafio final de O Comboio, parte 1.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('88c843a1-5e07-5f2d-91b7-50fd404417f3', 'Ordenar e fatiar', 1, false, '75d05e17-a249-5169-bf1f-f67416de64ca', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'ordenar-e-fatiar', NULL, true, 'Estrela de história sobre ordenar e fatiar.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('b7931d2d-c253-550e-832c-e5557f3f71b7', 'Métodos de texto', 2, false, '75d05e17-a249-5169-bf1f-f67416de64ca', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'metodos-de-texto', NULL, true, 'Estrela de história sobre métodos de texto.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('b5ce0a85-c636-53f0-ad4c-3c289c4e2f85', 'Laços com listas', 3, false, '75d05e17-a249-5169-bf1f-f67416de64ca', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'lacos-com-listas', NULL, true, 'Estrela de história sobre laços com listas.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('0c3cf5f3-bc2d-5316-b3bd-abb8646bcbf7', 'Desafio: Resgatar os tripulantes', 4, true, '75d05e17-a249-5169-bf1f-f67416de64ca', NULL, NULL, 'desafio-resgatar-os-tripulantes', NULL, true, 'Desafio final de O Comboio, parte 2.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('0b141ff5-d51a-5e86-bc17-736339dc82e5', 'Criando funções', 1, false, '4577fd66-fe43-56ad-85d9-ef04b82a2b11', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'criando-funcoes', NULL, true, 'Estrela de história sobre criando funções.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('71b47a25-af19-519a-956c-bbffd10f9867', 'Retorna', 2, false, '4577fd66-fe43-56ad-85d9-ef04b82a2b11', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'retorna', NULL, true, 'Estrela de história sobre retorna.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('45cff843-d588-5fba-b34e-5304440c6b98', 'Funções nativas', 3, false, '4577fd66-fe43-56ad-85d9-ef04b82a2b11', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'funcoes-nativas', NULL, true, 'Estrela de história sobre funções nativas.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('a94cae9b-75fb-5341-bd33-e2c7c080c825', 'Funções avançadas', 4, false, '4577fd66-fe43-56ad-85d9-ef04b82a2b11', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'funcoes-avancadas', NULL, true, 'Estrela de história sobre funções avançadas.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('e36f98a4-9f0e-57cf-8ef8-ccba8d0e05b5', 'Desafio: Abrir a Fortaleza', 5, true, '4577fd66-fe43-56ad-85d9-ef04b82a2b11', NULL, NULL, 'desafio-abrir-a-fortaleza', NULL, true, 'Desafio final de Arcana.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('87324b0b-8e53-5d0d-a875-7693fd9a806b', 'Criar tuplas', 1, false, 'a226fe90-e261-5674-b911-179c4fc4c87a', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'criar-tuplas', NULL, true, 'Estrela de história sobre criar tuplas.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('0bcf8ce7-1084-5bea-83f3-3a3794190a6e', 'Imutabilidade', 2, false, 'a226fe90-e261-5674-b911-179c4fc4c87a', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'imutabilidade', NULL, true, 'Estrela de história sobre imutabilidade.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('41c5ff1c-1600-5e9e-aebc-96f9ef0be43b', 'Tuplas ou listas', 3, false, 'a226fe90-e261-5674-b911-179c4fc4c87a', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'tuplas-ou-listas', NULL, true, 'Estrela de história sobre tuplas ou listas.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('74917013-be25-5dcc-8b8a-5c233a3a5dec', 'Desafio: Guardar o que precisa sobreviver', 4, true, 'a226fe90-e261-5674-b911-179c4fc4c87a', NULL, NULL, 'desafio-guardar-o-que-precisa-sobreviver', NULL, true, 'Desafio final de Perene.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('76b35caf-f823-5f8b-9ee4-ea28441d4c63', 'Acessar e alterar valores', 1, false, 'b65124fd-d6c2-5f64-972e-56cfb29361c9', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'acessar-e-alterar-valores', NULL, true, 'Estrela de história sobre acessar e alterar valores.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('e9cd5d67-dd69-533c-a7c5-bd9cccf83090', 'Chaves e valores', 2, false, 'b65124fd-d6c2-5f64-972e-56cfb29361c9', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'chaves-e-valores', NULL, true, 'Estrela de história sobre chaves e valores.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('27785235-a51f-5b97-a55e-25ec814c24a4', 'Desestruturação', 3, false, 'b65124fd-d6c2-5f64-972e-56cfb29361c9', '[{"type": "default", "content": "Conteúdo desta estrela em produção."}]'::jsonb, '[]'::jsonb, 'desestruturacao', NULL, true, 'Estrela de história sobre desestruturação.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "public"."stars" ("id", "name", "number", "is_challenge", "planet_id", "texts", "questions", "slug", "story", "is_available", "description")
VALUES ('e17ed797-ac71-5288-b311-4d3fa05b501e', 'Desafio: Devolver o valor', 4, true, 'b65124fd-d6c2-5f64-972e-56cfb29361c9', NULL, NULL, 'desafio-devolver-o-valor', NULL, true, 'Desafio final de Chavalor.')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
UPDATE "public"."users" SET "has_completed_space" = false;
--> statement-breakpoint
DROP VIEW IF EXISTS "public"."users_view";
--> statement-breakpoint
DROP VIEW IF EXISTS "public"."planets_view";
--> statement-breakpoint
DROP VIEW IF EXISTS "public"."users_completed_planets_view";
--> statement-breakpoint
DROP FUNCTION IF EXISTS "public"."get_last_user_unlocked_star_id"(users);
--> statement-breakpoint
DROP FUNCTION IF EXISTS "public"."verify_user_space_completion"(users);
--> statement-breakpoint
DROP FUNCTION IF EXISTS "public"."insert_initial_data"();
--> statement-breakpoint
DROP FUNCTION IF EXISTS "public"."insert_user_initial_data"();
--> statement-breakpoint
DROP FUNCTION IF EXISTS "public"."count_user_unlocked_stars"(users);
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_user_completed_stars(user_row users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) FROM public.users_completed_stars WHERE user_id = user_row.id;
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_star_unlocks(star_row stars)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(*) FROM public.users_completed_stars WHERE star_id = star_row.id;
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_planet_completions(planet_row planets)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) FROM (
    SELECT ucs.user_id
    FROM public.users_completed_stars ucs
    JOIN public.stars s ON s.id = ucs.star_id
    WHERE s.planet_id = planet_row.id
    GROUP BY ucs.user_id
    HAVING count(*) >= (SELECT count(*) FROM public.stars WHERE planet_id = planet_row.id)
  ) AS completions;
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_users_at_planet(planet_row planets)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(DISTINCT uop.user_id)
  FROM public.users_opened_planets uop
  WHERE uop.planet_id = planet_row.id
  AND NOT EXISTS (
    SELECT 1
    FROM public.users_opened_planets uop_check
    JOIN public.planets p_check ON p_check.id = uop_check.planet_id
    WHERE uop_check.user_id = uop.user_id
    AND p_check.galaxy_id = planet_row.galaxy_id
    AND p_check.position > planet_row.position
  );
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_users_at_star(star_row stars)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(DISTINCT uop.user_id)
  FROM public.users_opened_planets uop
  WHERE uop.planet_id = star_row.planet_id
  AND NOT EXISTS (
    SELECT 1 FROM public.users_completed_stars ucs
    WHERE ucs.user_id = uop.user_id AND ucs.star_id = star_row.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.stars previous_star
    WHERE previous_star.planet_id = star_row.planet_id
    AND previous_star.number < star_row.number
    AND NOT EXISTS (
      SELECT 1 FROM public.users_completed_stars ucs
      WHERE ucs.user_id = uop.user_id AND ucs.star_id = previous_star.id
    )
  );
$function$;
--> statement-breakpoint
CREATE VIEW "public"."users_completed_planets_view" AS
 SELECT ucs.user_id AS user_id,
    s.planet_id AS planet_id
   FROM public.users_completed_stars ucs
     JOIN public.stars s ON s.id = ucs.star_id
  GROUP BY ucs.user_id, s.planet_id
 HAVING count(*) >= (SELECT count(*) FROM public.stars all_stars WHERE all_stars.planet_id = s.planet_id);
--> statement-breakpoint
ALTER VIEW "public"."users_completed_planets_view" OWNER TO "postgres";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_completed_stars" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_opened_planets" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_completed_planets_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_user_completed_stars"(user_row users) FROM PUBLIC, "anon", "authenticated";
