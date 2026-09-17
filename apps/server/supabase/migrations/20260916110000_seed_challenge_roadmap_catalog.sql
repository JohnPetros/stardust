-- Local catalog fixture required by the roadmap migration's fail-fast seed.
-- It is a no-op when the curated catalog already exists (including Supabase Dev).
do $$
begin
  if not exists (
    select 1
      from public.challenges challenge
     where challenge.slug = any(array[
       'enviando-mensagem',
       'pedido-de-ajuda',
       'acoplagem-no-nucleo-da-nave',
       'mensagem-hacker-no-terminal-espacial',
       'posicao-no-alfabeto-da-central-estelar',
       'conversor-de-numeros-para-crons',
       'perimetro-espacial',
       'resistencias-em-circuitos',
       'veredito-do-painel-estelar',
       'lista-de-multiplos',
       'contando-batatas',
       'juntando-listas',
       'quantos-planetas-habitaveis',
       'retornando-o-primeiro-planeta-destino',
       'onde-esta-o-animal',
       'o-codigo-espelhado-do-comando-estelar',
       'verificando-numero-cosmico',
       'a-senha-e-um-repdigit',
       'consertando-teclado-da-nave',
       'detector-de-naves-bumerangue'
     ]::text[])
  ) then
insert into public.avatars (id, name, image, price, is_selected_by_default, is_acquired_by_default)
values (
  '6d27f2d0-3b50-4f86-9d65-9a9d3f1c2b7e',
  'Panda',
  'panda.jpg',
  0,
  false,
  true
);

insert into public.users (id, name, email, slug, tier_id, rocket_id, avatar_id)
values (
  '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c',
  'Challenge Roadmap Fixture Author',
  'challenge-roadmap-fixture-author@stardust.dev',
  '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c',
  null,
  null,
  '6d27f2d0-3b50-4f86-9d65-9a9d3f1c2b7e'
);

insert into public.categories (name)
values
  ('básico'),
  ('textos'),
  ('números'),
  ('operadores'),
  ('condicionais'),
  ('listas'),
  ('lógicos'),
  ('laços');

insert into public.challenges (title, difficulty_level, initial_code, test_cases, slug, user_id, description, is_public, is_new)
values
  ('enviando-mensagem', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'enviando-mensagem', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: enviando-mensagem', true, false),
  ('pedido-de-ajuda', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'pedido-de-ajuda', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: pedido-de-ajuda', true, false),
  ('acoplagem-no-nucleo-da-nave', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'acoplagem-no-nucleo-da-nave', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: acoplagem-no-nucleo-da-nave', true, false),
  ('mensagem-hacker-no-terminal-espacial', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'mensagem-hacker-no-terminal-espacial', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: mensagem-hacker-no-terminal-espacial', true, false),
  ('posicao-no-alfabeto-da-central-estelar', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'posicao-no-alfabeto-da-central-estelar', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: posicao-no-alfabeto-da-central-estelar', true, false),
  ('conversor-de-numeros-para-crons', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'conversor-de-numeros-para-crons', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: conversor-de-numeros-para-crons', true, false),
  ('perimetro-espacial', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'perimetro-espacial', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: perimetro-espacial', true, false),
  ('resistencias-em-circuitos', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'resistencias-em-circuitos', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: resistencias-em-circuitos', true, false),
  ('veredito-do-painel-estelar', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'veredito-do-painel-estelar', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: veredito-do-painel-estelar', true, false),
  ('lista-de-multiplos', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'lista-de-multiplos', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: lista-de-multiplos', true, false),
  ('contando-batatas', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'contando-batatas', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: contando-batatas', true, false),
  ('juntando-listas', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'juntando-listas', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: juntando-listas', true, false),
  ('quantos-planetas-habitaveis', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'quantos-planetas-habitaveis', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: quantos-planetas-habitaveis', true, false),
  ('retornando-o-primeiro-planeta-destino', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'retornando-o-primeiro-planeta-destino', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: retornando-o-primeiro-planeta-destino', true, false),
  ('onde-esta-o-animal', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'onde-esta-o-animal', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: onde-esta-o-animal', true, false),
  ('o-codigo-espelhado-do-comando-estelar', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'o-codigo-espelhado-do-comando-estelar', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: o-codigo-espelhado-do-comando-estelar', true, false),
  ('verificando-numero-cosmico', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'verificando-numero-cosmico', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: verificando-numero-cosmico', true, false),
  ('a-senha-e-um-repdigit', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'a-senha-e-um-repdigit', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: a-senha-e-um-repdigit', true, false),
  ('consertando-teclado-da-nave', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'consertando-teclado-da-nave', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: consertando-teclado-da-nave', true, false),
  ('detector-de-naves-bumerangue', 'easy', '', '[{"position":1,"inputs":[],"expectedOutput":"","isLocked":false}]'::jsonb, 'detector-de-naves-bumerangue', '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c', 'Fixture: detector-de-naves-bumerangue', true, false);

insert into public.challenges_categories (challenge_id, category_id)
select challenge.id, category.id
  from public.challenges challenge
  join public.categories category on category.name = case challenge.slug
    when 'enviando-mensagem' then 'básico'
    when 'pedido-de-ajuda' then 'básico'
    when 'acoplagem-no-nucleo-da-nave' then 'básico'
    when 'mensagem-hacker-no-terminal-espacial' then 'textos'
    when 'posicao-no-alfabeto-da-central-estelar' then 'textos'
    when 'conversor-de-numeros-para-crons' then 'números'
    when 'perimetro-espacial' then 'operadores'
    when 'resistencias-em-circuitos' then 'operadores'
    when 'veredito-do-painel-estelar' then 'condicionais'
    when 'lista-de-multiplos' then 'condicionais'
    when 'contando-batatas' then 'condicionais'
    when 'juntando-listas' then 'listas'
    when 'quantos-planetas-habitaveis' then 'listas'
    when 'retornando-o-primeiro-planeta-destino' then 'listas'
    when 'onde-esta-o-animal' then 'listas'
    when 'o-codigo-espelhado-do-comando-estelar' then 'lógicos'
    when 'verificando-numero-cosmico' then 'lógicos'
    when 'a-senha-e-um-repdigit' then 'laços'
    when 'consertando-teclado-da-nave' then 'laços'
    when 'detector-de-naves-bumerangue' then 'laços'
  end
 where challenge.user_id = '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c';
  end if;
end;
$$;
