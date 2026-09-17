create table public.challenge_roadmap_revisions (
  id uuid not null default gen_random_uuid(),
  key text not null,
  version integer not null,
  status text not null default 'draft',
  published_at timestamp with time zone,
  constraint challenge_roadmap_revisions_pkey primary key (id),
  constraint challenge_roadmap_revisions_key_version_key unique (key, version),
  constraint challenge_roadmap_revisions_version_check check (version > 0),
  constraint challenge_roadmap_revisions_status_check check (
    status in ('draft', 'published')
  ),
  constraint challenge_roadmap_revisions_publication_check check (
    (status = 'published' and published_at is not null)
    or (status = 'draft' and published_at is null)
  )
) tablespace pg_default;

create unique index challenge_roadmap_revisions_one_published_idx
  on public.challenge_roadmap_revisions (status)
  where status = 'published';

create index challenge_roadmap_revisions_active_idx
  on public.challenge_roadmap_revisions (id)
  where status = 'published';

create table public.challenge_roadmap_nodes (
  id uuid not null default gen_random_uuid(),
  revision_id uuid not null,
  key text not null,
  category_id uuid not null,
  position_x double precision not null,
  position_y double precision not null,
  recommendation_order integer not null,
  state text not null default 'content',
  constraint challenge_roadmap_nodes_pkey primary key (id),
  constraint challenge_roadmap_nodes_revision_id_key unique (revision_id, id),
  constraint challenge_roadmap_nodes_revision_key_key unique (revision_id, key),
  constraint challenge_roadmap_nodes_revision_category_key unique (revision_id, category_id),
  constraint challenge_roadmap_nodes_revision_recommendation_order_key unique (
    revision_id,
    recommendation_order
  ),
  constraint challenge_roadmap_nodes_revision_id_fkey
    foreign key (revision_id)
    references public.challenge_roadmap_revisions(id)
    on delete restrict,
  constraint challenge_roadmap_nodes_category_id_fkey
    foreign key (category_id)
    references public.categories(id)
    on delete restrict,
  constraint challenge_roadmap_nodes_recommendation_order_check check (
    recommendation_order > 0
  ),
  constraint challenge_roadmap_nodes_state_check check (
    state in ('content', 'comingSoon')
  )
) tablespace pg_default;

create index challenge_roadmap_nodes_revision_idx
  on public.challenge_roadmap_nodes (revision_id);

create table public.challenge_roadmap_edges (
  revision_id uuid not null,
  prerequisite_node_id uuid not null,
  dependent_node_id uuid not null,
  constraint challenge_roadmap_edges_pkey primary key (
    revision_id,
    prerequisite_node_id,
    dependent_node_id
  ),
  constraint challenge_roadmap_edges_revision_id_fkey
    foreign key (revision_id)
    references public.challenge_roadmap_revisions(id)
    on delete restrict,
  constraint challenge_roadmap_edges_prerequisite_node_fkey
    foreign key (revision_id, prerequisite_node_id)
    references public.challenge_roadmap_nodes(revision_id, id)
    on delete restrict,
  constraint challenge_roadmap_edges_dependent_node_fkey
    foreign key (revision_id, dependent_node_id)
    references public.challenge_roadmap_nodes(revision_id, id)
    on delete restrict,
  constraint challenge_roadmap_edges_no_self_edge_check check (
    prerequisite_node_id <> dependent_node_id
  )
) tablespace pg_default;

create index challenge_roadmap_edges_prerequisite_idx
  on public.challenge_roadmap_edges (revision_id, prerequisite_node_id);

create index challenge_roadmap_edges_dependent_idx
  on public.challenge_roadmap_edges (revision_id, dependent_node_id);

create table public.challenge_roadmap_node_challenges (
  revision_id uuid not null,
  node_id uuid not null,
  challenge_id uuid not null,
  position integer not null,
  constraint challenge_roadmap_node_challenges_pkey primary key (
    revision_id,
    node_id,
    challenge_id
  ),
  constraint challenge_roadmap_node_challenges_revision_challenge_key unique (
    revision_id,
    challenge_id
  ),
  constraint challenge_roadmap_node_challenges_node_position_key unique (
    node_id,
    position
  ),
  constraint challenge_roadmap_node_challenges_revision_id_fkey
    foreign key (revision_id)
    references public.challenge_roadmap_revisions(id)
    on delete restrict,
  constraint challenge_roadmap_node_challenges_node_fkey
    foreign key (revision_id, node_id)
    references public.challenge_roadmap_nodes(revision_id, id)
    on delete restrict,
  constraint challenge_roadmap_node_challenges_challenge_id_fkey
    foreign key (challenge_id)
    references public.challenges(id)
    on delete restrict,
  constraint challenge_roadmap_node_challenges_position_check check (position > 0)
) tablespace pg_default;

create index challenge_roadmap_node_challenges_node_position_idx
  on public.challenge_roadmap_node_challenges (node_id, position);

create index challenge_roadmap_node_challenges_challenge_idx
  on public.challenge_roadmap_node_challenges (challenge_id);

create or replace function public.prevent_published_challenge_roadmap_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  old_revision_status text;
  new_revision_status text;
begin
  if TG_TABLE_NAME = 'challenge_roadmap_revisions' then
    if OLD.status = 'published' then
      raise exception 'Published challenge roadmap revisions are immutable';
    end if;

    if TG_OP = 'DELETE' then
      return OLD;
    end if;

    return NEW;
  end if;

  if TG_OP <> 'INSERT' then
    select status
      into old_revision_status
      from public.challenge_roadmap_revisions
     where id = OLD.revision_id;

    if old_revision_status = 'published' then
      raise exception 'Published challenge roadmap rows are immutable';
    end if;
  end if;

  if TG_OP <> 'DELETE' then
    select status
      into new_revision_status
      from public.challenge_roadmap_revisions
     where id = NEW.revision_id;

    if new_revision_status = 'published' then
      raise exception 'Published challenge roadmap rows are immutable';
    end if;

    return NEW;
  end if;

  return OLD;
end;
$$;

create trigger challenge_roadmap_revisions_immutable_trigger
before update or delete on public.challenge_roadmap_revisions
for each row execute function public.prevent_published_challenge_roadmap_mutation();

create trigger challenge_roadmap_nodes_immutable_trigger
before insert or update or delete on public.challenge_roadmap_nodes
for each row execute function public.prevent_published_challenge_roadmap_mutation();

create trigger challenge_roadmap_edges_immutable_trigger
before insert or update or delete on public.challenge_roadmap_edges
for each row execute function public.prevent_published_challenge_roadmap_mutation();

create trigger challenge_roadmap_node_challenges_immutable_trigger
before insert or update or delete on public.challenge_roadmap_node_challenges
for each row execute function public.prevent_published_challenge_roadmap_mutation();

alter table public.challenge_roadmap_revisions enable row level security;
alter table public.challenge_roadmap_nodes enable row level security;
alter table public.challenge_roadmap_edges enable row level security;
alter table public.challenge_roadmap_node_challenges enable row level security;

create policy "Published challenge roadmap revisions are readable"
on public.challenge_roadmap_revisions
for select
to anon, authenticated
using (status = 'published');

create policy "Published challenge roadmap nodes are readable"
on public.challenge_roadmap_nodes
for select
to anon, authenticated
using (
  exists (
    select 1
      from public.challenge_roadmap_revisions revision
     where revision.id = challenge_roadmap_nodes.revision_id
       and revision.status = 'published'
  )
);

create policy "Published challenge roadmap edges are readable"
on public.challenge_roadmap_edges
for select
to anon, authenticated
using (
  exists (
    select 1
      from public.challenge_roadmap_revisions revision
     where revision.id = challenge_roadmap_edges.revision_id
       and revision.status = 'published'
  )
);

create policy "Published challenge roadmap challenges are readable"
on public.challenge_roadmap_node_challenges
for select
to anon, authenticated
using (
  exists (
    select 1
      from public.challenge_roadmap_revisions revision
     where revision.id = challenge_roadmap_node_challenges.revision_id
       and revision.status = 'published'
  )
);

revoke all on table
  public.challenge_roadmap_revisions,
  public.challenge_roadmap_nodes,
  public.challenge_roadmap_edges,
  public.challenge_roadmap_node_challenges
from anon, authenticated;

grant select on table
  public.challenge_roadmap_revisions,
  public.challenge_roadmap_nodes,
  public.challenge_roadmap_edges,
  public.challenge_roadmap_node_challenges
to anon, authenticated;

grant all on table
  public.challenge_roadmap_revisions,
  public.challenge_roadmap_nodes,
  public.challenge_roadmap_edges,
  public.challenge_roadmap_node_challenges
to service_role;

do $$
declare
  roadmap_revision_id uuid;
  node_count bigint;
  edge_count bigint;
  challenge_count bigint;
begin
  insert into public.challenge_roadmap_revisions (key, version, status)
  values ('desafios', 1, 'draft')
  returning id into roadmap_revision_id;

  if exists (
    select expected.challenge_slug
      from (
        values
          ('enviando-mensagem'),
          ('pedido-de-ajuda'),
          ('acoplagem-no-nucleo-da-nave'),
          ('mensagem-hacker-no-terminal-espacial'),
          ('posicao-no-alfabeto-da-central-estelar'),
          ('conversor-de-numeros-para-crons'),
          ('perimetro-espacial'),
          ('resistencias-em-circuitos'),
          ('veredito-do-painel-estelar'),
          ('lista-de-multiplos'),
          ('contando-batatas'),
          ('juntando-listas'),
          ('quantos-planetas-habitaveis'),
          ('retornando-o-primeiro-planeta-destino'),
          ('onde-esta-o-animal'),
          ('o-codigo-espelhado-do-comando-estelar'),
          ('verificando-numero-cosmico'),
          ('a-senha-e-um-repdigit'),
          ('consertando-teclado-da-nave'),
          ('detector-de-naves-bumerangue')
      ) as expected(challenge_slug)
      left join public.challenges challenge on challenge.slug = expected.challenge_slug
     group by expected.challenge_slug
    having count(challenge.id) <> 1
  ) then
    raise exception 'Challenge roadmap V1 requires exactly one catalog row for every curated slug';
  end if;

  if exists (
    select 1
      from (
        values
          ('basico', 'básico', 390::double precision, 150::double precision, 1),
          ('textos', 'textos', 150::double precision, 300::double precision, 2),
          ('numeros', 'números', 410::double precision, 300::double precision, 3),
          ('operadores', 'operadores', 670::double precision, 300::double precision, 4),
          ('condicionais', 'condicionais', 410::double precision, 450::double precision, 5),
          ('listas', 'listas', 750::double precision, 450::double precision, 6),
          ('logicos', 'lógicos', 150::double precision, 590::double precision, 7),
          ('lacos', 'laços', 410::double precision, 620::double precision, 8)
      ) as expected(node_key, category_name, position_x, position_y, recommendation_order)
     where (
       select count(*)
         from public.categories category
        where category.name = expected.category_name
     ) <> 1
  ) then
    raise exception 'Challenge roadmap V1 requires exactly one row for every curated category';
  end if;

  insert into public.challenge_roadmap_nodes (
    revision_id,
    key,
    category_id,
    position_x,
    position_y,
    recommendation_order,
    state
  )
  select
    roadmap_revision_id,
    expected.node_key,
    category.id,
    expected.position_x,
    expected.position_y,
    expected.recommendation_order,
    'content'
    from (
      values
        ('basico', 'básico', 390::double precision, 150::double precision, 1),
        ('textos', 'textos', 150::double precision, 300::double precision, 2),
        ('numeros', 'números', 410::double precision, 300::double precision, 3),
        ('operadores', 'operadores', 670::double precision, 300::double precision, 4),
        ('condicionais', 'condicionais', 410::double precision, 450::double precision, 5),
        ('listas', 'listas', 750::double precision, 450::double precision, 6),
        ('logicos', 'lógicos', 150::double precision, 590::double precision, 7),
        ('lacos', 'laços', 410::double precision, 620::double precision, 8)
    ) as expected(node_key, category_name, position_x, position_y, recommendation_order)
    join public.categories category on category.name = expected.category_name;

  select count(*)
    into node_count
    from public.challenge_roadmap_nodes
   where revision_id = roadmap_revision_id;

  if node_count <> 8 then
    raise exception 'Challenge roadmap V1 requires exactly 8 nodes, got %', node_count;
  end if;

  if exists (
    select 1
      from (
        values
          ('basico', 'textos'),
          ('basico', 'numeros'),
          ('basico', 'operadores'),
          ('textos', 'logicos'),
          ('numeros', 'condicionais'),
          ('operadores', 'condicionais'),
          ('operadores', 'listas'),
          ('logicos', 'lacos'),
          ('condicionais', 'lacos'),
          ('listas', 'lacos')
      ) as expected(prerequisite_key, dependent_key)
      left join public.challenge_roadmap_nodes prerequisite
        on prerequisite.revision_id = roadmap_revision_id
       and prerequisite.key = expected.prerequisite_key
      left join public.challenge_roadmap_nodes dependent
        on dependent.revision_id = roadmap_revision_id
       and dependent.key = expected.dependent_key
     where prerequisite.id is null or dependent.id is null
  ) then
    raise exception 'Challenge roadmap V1 contains an edge with an unknown node';
  end if;

  insert into public.challenge_roadmap_edges (
    revision_id,
    prerequisite_node_id,
    dependent_node_id
  )
  select
    roadmap_revision_id,
    prerequisite.id,
    dependent.id
    from (
      values
        ('basico', 'textos'),
        ('basico', 'numeros'),
        ('basico', 'operadores'),
        ('textos', 'logicos'),
        ('numeros', 'condicionais'),
        ('operadores', 'condicionais'),
        ('operadores', 'listas'),
        ('logicos', 'lacos'),
        ('condicionais', 'lacos'),
        ('listas', 'lacos')
    ) as expected(prerequisite_key, dependent_key)
    join public.challenge_roadmap_nodes prerequisite
      on prerequisite.revision_id = roadmap_revision_id
     and prerequisite.key = expected.prerequisite_key
    join public.challenge_roadmap_nodes dependent
      on dependent.revision_id = roadmap_revision_id
     and dependent.key = expected.dependent_key;

  select count(*)
    into edge_count
    from public.challenge_roadmap_edges
   where revision_id = roadmap_revision_id;

  if edge_count <> 10 then
    raise exception 'Challenge roadmap V1 requires exactly 10 edges, got %', edge_count;
  end if;

  if exists (
    with recursive reachable(prerequisite_node_id, dependent_node_id) as (
      select edge.prerequisite_node_id, edge.dependent_node_id
        from public.challenge_roadmap_edges edge
       where edge.revision_id = roadmap_revision_id
      union
      select reachable.prerequisite_node_id, edge.dependent_node_id
        from reachable
        join public.challenge_roadmap_edges edge
          on edge.revision_id = roadmap_revision_id
         and edge.prerequisite_node_id = reachable.dependent_node_id
    )
    select 1
      from reachable
     where prerequisite_node_id = dependent_node_id
  ) then
    raise exception 'Challenge roadmap V1 must be acyclic';
  end if;

  if exists (
    select 1
      from public.challenge_roadmap_nodes node
     where node.revision_id = roadmap_revision_id
       and node.state = 'comingSoon'
       and exists (
         select 1
           from public.challenge_roadmap_edges edge
          where edge.revision_id = node.revision_id
            and edge.prerequisite_node_id = node.id
       )
  ) then
    raise exception 'Coming soon challenge roadmap nodes must be terminal';
  end if;

  if exists (
    select 1
      from (
        values
          ('basico', 'básico', 1, 'enviando-mensagem'),
          ('basico', 'básico', 2, 'pedido-de-ajuda'),
          ('basico', 'básico', 3, 'acoplagem-no-nucleo-da-nave'),
          ('textos', 'textos', 1, 'mensagem-hacker-no-terminal-espacial'),
          ('textos', 'textos', 2, 'posicao-no-alfabeto-da-central-estelar'),
          ('numeros', 'números', 1, 'conversor-de-numeros-para-crons'),
          ('operadores', 'operadores', 1, 'perimetro-espacial'),
          ('operadores', 'operadores', 2, 'resistencias-em-circuitos'),
          ('condicionais', 'condicionais', 1, 'veredito-do-painel-estelar'),
          ('condicionais', 'condicionais', 2, 'lista-de-multiplos'),
          ('condicionais', 'condicionais', 3, 'contando-batatas'),
          ('listas', 'listas', 1, 'juntando-listas'),
          ('listas', 'listas', 2, 'quantos-planetas-habitaveis'),
          ('listas', 'listas', 3, 'retornando-o-primeiro-planeta-destino'),
          ('listas', 'listas', 4, 'onde-esta-o-animal'),
          ('logicos', 'lógicos', 1, 'o-codigo-espelhado-do-comando-estelar'),
          ('logicos', 'lógicos', 2, 'verificando-numero-cosmico'),
          ('lacos', 'laços', 1, 'a-senha-e-um-repdigit'),
          ('lacos', 'laços', 2, 'consertando-teclado-da-nave'),
          ('lacos', 'laços', 3, 'detector-de-naves-bumerangue')
      ) as expected(node_key, category_name, position, challenge_slug)
      left join public.challenges challenge on challenge.slug = expected.challenge_slug
     where challenge.id is null
        or challenge.is_public is not true
        or challenge.star_id is not null
        or not exists (
          select 1
            from public.challenges_categories challenge_category
            join public.categories category on category.id = challenge_category.category_id
           where challenge_category.challenge_id = challenge.id
             and category.name = expected.category_name
        )
  ) then
    raise exception 'Challenge roadmap V1 references a missing, ineligible, or incorrectly categorized challenge';
  end if;

  insert into public.challenge_roadmap_node_challenges (
    revision_id,
    node_id,
    challenge_id,
    position
  )
  select
    roadmap_revision_id,
    node.id,
    challenge.id,
    expected.position
    from (
      values
        ('basico', 'básico', 1, 'enviando-mensagem'),
        ('basico', 'básico', 2, 'pedido-de-ajuda'),
        ('basico', 'básico', 3, 'acoplagem-no-nucleo-da-nave'),
        ('textos', 'textos', 1, 'mensagem-hacker-no-terminal-espacial'),
        ('textos', 'textos', 2, 'posicao-no-alfabeto-da-central-estelar'),
        ('numeros', 'números', 1, 'conversor-de-numeros-para-crons'),
        ('operadores', 'operadores', 1, 'perimetro-espacial'),
        ('operadores', 'operadores', 2, 'resistencias-em-circuitos'),
        ('condicionais', 'condicionais', 1, 'veredito-do-painel-estelar'),
        ('condicionais', 'condicionais', 2, 'lista-de-multiplos'),
        ('condicionais', 'condicionais', 3, 'contando-batatas'),
        ('listas', 'listas', 1, 'juntando-listas'),
        ('listas', 'listas', 2, 'quantos-planetas-habitaveis'),
        ('listas', 'listas', 3, 'retornando-o-primeiro-planeta-destino'),
        ('listas', 'listas', 4, 'onde-esta-o-animal'),
        ('logicos', 'lógicos', 1, 'o-codigo-espelhado-do-comando-estelar'),
        ('logicos', 'lógicos', 2, 'verificando-numero-cosmico'),
        ('lacos', 'laços', 1, 'a-senha-e-um-repdigit'),
        ('lacos', 'laços', 2, 'consertando-teclado-da-nave'),
        ('lacos', 'laços', 3, 'detector-de-naves-bumerangue')
    ) as expected(node_key, category_name, position, challenge_slug)
    join public.challenge_roadmap_nodes node
      on node.revision_id = roadmap_revision_id
     and node.key = expected.node_key
    join public.challenges challenge on challenge.slug = expected.challenge_slug;

  select count(*)
    into challenge_count
    from public.challenge_roadmap_node_challenges
   where revision_id = roadmap_revision_id;

  if challenge_count <> 20 then
    raise exception 'Challenge roadmap V1 requires exactly 20 challenges, got %', challenge_count;
  end if;

  if exists (
    select 1
      from public.challenge_roadmap_nodes node
     where node.revision_id = roadmap_revision_id
       and node.state = 'content'
       and not exists (
         select 1
           from public.challenge_roadmap_node_challenges node_challenge
          where node_challenge.revision_id = node.revision_id
            and node_challenge.node_id = node.id
       )
  ) then
    raise exception 'Content challenge roadmap nodes must contain challenges';
  end if;

  if exists (
    select 1
      from public.challenge_roadmap_node_challenges node_challenge
      join public.challenges challenge on challenge.id = node_challenge.challenge_id
     where node_challenge.revision_id = roadmap_revision_id
       and (challenge.is_public is not true or challenge.star_id is not null)
  ) then
    raise exception 'Challenge roadmap V1 contains an ineligible challenge';
  end if;

  update public.challenge_roadmap_revisions
     set status = 'published', published_at = now()
   where id = roadmap_revision_id;
end;
$$;
