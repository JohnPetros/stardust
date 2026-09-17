-- =====================================================
-- STARDUST DATABASE SCHEMA
-- =====================================================
-- This file contains all database schemas in the correct
-- order for table creation, considering foreign key dependencies.
-- =====================================================

-- =====================================================
-- INDEPENDENT TABLES (No foreign key dependencies)
-- =====================================================

-- Feedback conversation tables are also represented in the additive
-- migration. IF NOT EXISTS keeps this schema safe for local resets that
-- already include the legacy remote-schema migration.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_intent') THEN
    CREATE TYPE public.feedback_intent AS ENUM ('bug', 'idea', 'other');
  END IF;
END $$;

-- 1. Cria o tipo 'challenge_difficulty_level'
CREATE TYPE public.challenge_difficulty_level AS ENUM (
    'easy',
    'medium',
    'hard'
);

-- 2. Cria o tipo 'challenge_vote'
CREATE TYPE public.challenge_vote AS ENUM (
    'upvote',
    'downvote'
);

-- 3. Cria o tipo 'ranking_status'
CREATE TYPE public.ranking_status AS ENUM (
    'winner',
    'loser'
);

-- 4. Cria o tipo 'insignia_role'
CREATE TYPE public.insignia_role AS ENUM (
    'engineer',
    'god'
);

-- Categories table
create table public.categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying not null,
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;

-- Tiers table
create table public.tiers (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  image text not null,
  position integer not null default 1,
  reward integer not null,
  constraint rankings_pkey primary key (id),
  constraint rankings_name_key unique (name)
) TABLESPACE pg_default;

-- Avatars table
create table public.avatars (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  image text not null,
  price bigint not null,
  is_selected_by_default boolean not null default false,
  is_acquired_by_default boolean not null default false,
  constraint avatars_pkey primary key (id)
) TABLESPACE pg_default;

-- Rockets table
create table public.rockets (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying not null,
  price integer not null,
  image character varying not null,
  is_selected_by_default boolean not null default false,
  is_acquired_by_default boolean not null default false,
  is_purchasable boolean not null default true,
  constraint rockets_pkey primary key (id),
  constraint rockets_image_key unique (image),
  constraint rockets_name_key unique (name)
) TABLESPACE pg_default;

-- Insignias table
create table public.insignias (
  id uuid not null default gen_random_uuid (),
  name text not null,
  price integer not null,
  image text not null,
  role public.insignia_role not null,
  is_purchasable boolean not null default false,
  constraint insignias_pkey primary key (id),
  constraint insignias_role_key unique (role)
) TABLESPACE pg_default;

-- Planets table
create table public.planets (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  image text not null,
  icon text not null,
  position integer not null,
  constraint planets_pkey primary key (id)
) TABLESPACE pg_default;

-- Achievements table
create table public.achievements (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  icon text not null,
  description text not null,
  metric text not null default ''::text,
  required_count bigint not null,
  reward integer not null default 20,
  position integer not null,
  constraint achievements_pkey primary key (id),
  constraint achievements_badge_achievement_key unique (icon),
  constraint achievements_description_achievement_key unique (description),
  constraint achievements_name_achievement_key unique (name)
) TABLESPACE pg_default;

-- Docs table
create table public.docs (
  title text not null,
  id uuid not null default extensions.uuid_generate_v4 (),
  position integer not null,
  content text null,
  constraint topics_pkey primary key (id)
) TABLESPACE pg_default;

-- =====================================================
-- USERS TABLE (References tiers, avatars, rockets)
-- =====================================================

create table public.users (
  id character varying not null,
  name character varying not null,
  email character varying not null,
  level integer not null default 1,
  xp integer not null default 0,
  coins integer not null default 0,
  created_at timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  streak integer not null default 0,
  week_status text[] not null default '{todo,todo,todo,todo,todo,todo,todo}'::text[],
  did_complete_saturday boolean not null default false,
  tier_id uuid null default 'f542f61a-4e42-4914-88f6-9aa7c2358473'::uuid,
  rocket_id uuid null default '03f3f359-a0ee-42c1-bd5f-b2ad01810d47'::uuid,
  weekly_xp integer not null default 0,
  can_see_ranking boolean not null default false,
  last_week_ranking_position integer null,
  avatar_id uuid null default '557a33e8-ce8a-4ac2-992c-7eab630d186d'::uuid,
  study_time text not null default '10:00'::text,
  did_break_streak boolean not null default false,
  is_loser boolean null default false,
  slug text not null,
  has_completed_space boolean not null default false,
  constraint user_pkey primary key (id),
  constraint users_name_key unique (name),
  constraint user_email_user_key unique (email),
  constraint users_slug_key unique (slug),
  constraint users_ranking_id_fkey foreign KEY (tier_id) references tiers (id),
  constraint users_avatar_id_fkey foreign KEY (avatar_id) references avatars (id),
  constraint users_rocket_id_fkey foreign KEY (rocket_id) references rockets (id)
) TABLESPACE pg_default;

create table if not exists public.feedback_reports (
  id uuid not null default gen_random_uuid(),
  content text not null,
  screenshot text,
  created_at timestamptz not null default now(),
  intent public.feedback_intent not null,
  user_id character varying not null,
  title varchar(60) not null default '',
  status text not null default 'open' check (status in ('open', 'closed')),
  last_activity_at timestamptz not null default now(),
  last_user_message_at timestamptz,
  studio_read_at timestamptz,
  last_admin_message_at timestamptz,
  author_read_at timestamptz,
  constraint feedback_reports_pkey primary key (id),
  constraint feedback_reports_user_id_fkey foreign key (user_id)
    references public.users(id) on update cascade on delete cascade,
  constraint feedback_reports_title_length_check check (char_length(title) between 1 and 60)
) TABLESPACE pg_default;

create table if not exists public.feedback_messages (
  id uuid not null,
  report_id uuid not null references public.feedback_reports(id) on delete cascade,
  author_role text not null check (author_role in ('user', 'admin')),
  author_id character varying not null,
  content text not null check (char_length(trim(content)) between 1 and 2000),
  created_at timestamptz not null default now(),
  constraint feedback_messages_pkey primary key (id)
) TABLESPACE pg_default;

create table if not exists public.feedback_message_attachments (
  id uuid not null,
  message_id uuid not null references public.feedback_messages(id) on delete cascade,
  storage_key text not null unique,
  original_name text not null,
  mime_type text not null check (mime_type in ('image/png', 'image/jpeg')),
  size bigint not null check (size between 1 and 10485760),
  position smallint not null check (position between 0 and 2),
  constraint feedback_message_attachments_pkey primary key (id),
  constraint feedback_message_attachments_message_position_key unique (message_id, position)
) TABLESPACE pg_default;

create index if not exists feedback_reports_queue_idx
  on public.feedback_reports (status, last_activity_at desc, id desc);
create index if not exists feedback_reports_unread_idx
  on public.feedback_reports (last_user_message_at, studio_read_at);
create index if not exists feedback_reports_user_idx
  on public.feedback_reports (user_id);
create index if not exists feedback_reports_author_history_idx
  on public.feedback_reports (user_id, last_activity_at desc, id desc);
create index if not exists feedback_reports_author_unread_idx
  on public.feedback_reports (user_id, last_admin_message_at desc)
  where last_admin_message_at is not null
    and (author_read_at is null or last_admin_message_at > author_read_at);
create index if not exists feedback_messages_report_idx
  on public.feedback_messages (report_id, created_at, id);
create index if not exists feedback_message_attachments_message_idx
  on public.feedback_message_attachments (message_id, position);
-- =====================================================
-- STARS TABLE (References planets)
-- =====================================================

create table public.stars (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  number integer not null,
  is_challenge boolean not null default false,
  planet_id uuid not null,
  texts jsonb null,
  questions jsonb null,
  slug text not null,
  story text null default ''::text,
  constraint stars_pkey primary key (id),
  constraint stars_planet_id_fkey foreign KEY (planet_id) references planets (id) on delete CASCADE
) TABLESPACE pg_default;

-- =====================================================
-- CHALLENGES TABLE (References stars, users)
-- =====================================================

create table public.challenges (
  title character varying not null default ''::character varying,
  difficulty_level character varying not null default 'easy'::character varying,
  created_at timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  id uuid not null default extensions.uuid_generate_v4 (),
  star_id uuid null,
  initial_code text not null,
  texts jsonb null,
  function_name text null,
  test_cases jsonb not null,
  slug text not null,
  user_id text not null default '38976417-7c77-44ff-9e26-5dc8b457f768'::text,
  description text null,
  is_public boolean not null default false,
  constraint challenges_pkey primary key (id),
  constraint challenges_star_id_fkey foreign KEY (star_id) references stars (id) on delete CASCADE,
  constraint challenges_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- =====================================================
-- CHALLENGE ROADMAP TABLES (References categories, challenges)
-- =====================================================

create table public.challenge_roadmap_revisions (
  id uuid not null default gen_random_uuid (),
  key text not null,
  version integer not null,
  status text not null default 'draft'::text,
  published_at timestamp with time zone,
  constraint challenge_roadmap_revisions_pkey primary key (id),
  constraint challenge_roadmap_revisions_key_version_key unique (key, version),
  constraint challenge_roadmap_revisions_version_check check (version > 0),
  constraint challenge_roadmap_revisions_status_check check (status in ('draft', 'published')),
  constraint challenge_roadmap_revisions_publication_check check (
    (status = 'published' and published_at is not null)
    or (status = 'draft' and published_at is null)
  )
) TABLESPACE pg_default;

create unique index challenge_roadmap_revisions_one_published_idx
  on public.challenge_roadmap_revisions (status)
  where status = 'published';

create index challenge_roadmap_revisions_active_idx
  on public.challenge_roadmap_revisions (id)
  where status = 'published';

create table public.challenge_roadmap_nodes (
  id uuid not null default gen_random_uuid (),
  revision_id uuid not null,
  key text not null,
  category_id uuid not null,
  position_x double precision not null,
  position_y double precision not null,
  recommendation_order integer not null,
  state text not null default 'content'::text,
  constraint challenge_roadmap_nodes_pkey primary key (id),
  constraint challenge_roadmap_nodes_revision_id_key unique (revision_id, id),
  constraint challenge_roadmap_nodes_revision_key_key unique (revision_id, key),
  constraint challenge_roadmap_nodes_revision_category_key unique (revision_id, category_id),
  constraint challenge_roadmap_nodes_revision_recommendation_order_key unique (
    revision_id,
    recommendation_order
  ),
  constraint challenge_roadmap_nodes_revision_id_fkey
    foreign key (revision_id) references challenge_roadmap_revisions (id) on delete restrict,
  constraint challenge_roadmap_nodes_category_id_fkey
    foreign key (category_id) references categories (id) on delete restrict,
  constraint challenge_roadmap_nodes_recommendation_order_check check (recommendation_order > 0),
  constraint challenge_roadmap_nodes_state_check check (state in ('content', 'comingSoon'))
) TABLESPACE pg_default;

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
    foreign key (revision_id) references challenge_roadmap_revisions (id) on delete restrict,
  constraint challenge_roadmap_edges_prerequisite_node_fkey
    foreign key (revision_id, prerequisite_node_id)
    references challenge_roadmap_nodes (revision_id, id) on delete restrict,
  constraint challenge_roadmap_edges_dependent_node_fkey
    foreign key (revision_id, dependent_node_id)
    references challenge_roadmap_nodes (revision_id, id) on delete restrict,
  constraint challenge_roadmap_edges_no_self_edge_check check (prerequisite_node_id <> dependent_node_id)
) TABLESPACE pg_default;

create index challenge_roadmap_edges_prerequisite_idx
  on public.challenge_roadmap_edges (revision_id, prerequisite_node_id);
create index challenge_roadmap_edges_dependent_idx
  on public.challenge_roadmap_edges (revision_id, dependent_node_id);

create table public.challenge_roadmap_node_challenges (
  revision_id uuid not null,
  node_id uuid not null,
  challenge_id uuid not null,
  position integer not null,
  constraint challenge_roadmap_node_challenges_pkey primary key (revision_id, node_id, challenge_id),
  constraint challenge_roadmap_node_challenges_revision_challenge_key unique (revision_id, challenge_id),
  constraint challenge_roadmap_node_challenges_node_position_key unique (node_id, position),
  constraint challenge_roadmap_node_challenges_revision_id_fkey
    foreign key (revision_id) references challenge_roadmap_revisions (id) on delete restrict,
  constraint challenge_roadmap_node_challenges_node_fkey
    foreign key (revision_id, node_id)
    references challenge_roadmap_nodes (revision_id, id) on delete restrict,
  constraint challenge_roadmap_node_challenges_challenge_id_fkey
    foreign key (challenge_id) references challenges (id) on delete restrict,
  constraint challenge_roadmap_node_challenges_position_check check (position > 0)
) TABLESPACE pg_default;

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
    if TG_OP = 'DELETE' then return OLD; end if;
    return NEW;
  end if;

  if TG_OP <> 'INSERT' then
    select status into old_revision_status
      from public.challenge_roadmap_revisions where id = OLD.revision_id;
    if old_revision_status = 'published' then
      raise exception 'Published challenge roadmap rows are immutable';
    end if;
  end if;

  if TG_OP <> 'DELETE' then
    select status into new_revision_status
      from public.challenge_roadmap_revisions where id = NEW.revision_id;
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
on public.challenge_roadmap_revisions for select to anon, authenticated
using (status = 'published');
create policy "Published challenge roadmap nodes are readable"
on public.challenge_roadmap_nodes for select to anon, authenticated
using (exists (select 1 from public.challenge_roadmap_revisions revision
  where revision.id = challenge_roadmap_nodes.revision_id and revision.status = 'published'));
create policy "Published challenge roadmap edges are readable"
on public.challenge_roadmap_edges for select to anon, authenticated
using (exists (select 1 from public.challenge_roadmap_revisions revision
  where revision.id = challenge_roadmap_edges.revision_id and revision.status = 'published'));
create policy "Published challenge roadmap challenges are readable"
on public.challenge_roadmap_node_challenges for select to anon, authenticated
using (exists (select 1 from public.challenge_roadmap_revisions revision
  where revision.id = challenge_roadmap_node_challenges.revision_id and revision.status = 'published'));

revoke all on table
  public.challenge_roadmap_revisions, public.challenge_roadmap_nodes,
  public.challenge_roadmap_edges, public.challenge_roadmap_node_challenges
from anon, authenticated;
grant select on table
  public.challenge_roadmap_revisions, public.challenge_roadmap_nodes,
  public.challenge_roadmap_edges, public.challenge_roadmap_node_challenges
to anon, authenticated;
grant all on table
  public.challenge_roadmap_revisions, public.challenge_roadmap_nodes,
  public.challenge_roadmap_edges, public.challenge_roadmap_node_challenges
to service_role;

-- =====================================================
-- SOLUTIONS TABLE (References challenges, users)
-- =====================================================

create table public.solutions (
  created_at timestamp with time zone not null default now(),
  title text not null,
  content text not null,
  challenge_id uuid not null,
  id uuid not null default gen_random_uuid (),
  slug text not null,
  user_id character varying not null,
  views_count bigint not null,
  constraint solution_pkey primary key (id),
  constraint solutions_slug_key unique (slug),
  constraint solutions_title_key unique (title),
  constraint public_solution_challenge_id_fkey foreign KEY (challenge_id) references challenges (id) on update CASCADE on delete CASCADE,
  constraint solutions_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- =====================================================
-- COMMENTS TABLE (References users, self-referencing)
-- =====================================================

create table public.comments (
  id uuid not null default extensions.uuid_generate_v4 (),
  created_at timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  content text not null,
  parent_comment_id uuid null,
  user_id character varying not null default 'apollo'::text,
  constraint comments_pkey primary key (id),
  constraint comments_parent_comment_id_fkey foreign KEY (parent_comment_id) references comments (id) on delete CASCADE,
  constraint comments_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE,
  constraint comments_content_check check ((length(content) >= 3))
) TABLESPACE pg_default;

-- =====================================================
-- SNIPPETS TABLE (References users)
-- =====================================================

create table public.snippets (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null default 'Sem título'::text,
  code text not null,
  created_at timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  is_public boolean not null default true,
  user_id character varying not null,
  constraint codes_pkey primary key (id),
  constraint snippets_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- =====================================================
-- JUNCTION TABLES (Many-to-many relationships)
-- =====================================================

-- Challenges Categories junction table
create table public.challenges_categories (
  challenge_id uuid not null,
  category_id uuid not null,
  id uuid not null default extensions.uuid_generate_v4 (),
  constraint challenges_categories_pkey primary key (id),
  constraint challenges_categories_category_id_fkey foreign KEY (category_id) references categories (id) on delete CASCADE,
  constraint challenges_categories_challenge_id_fkey foreign KEY (challenge_id) references challenges (id) on delete CASCADE
) TABLESPACE pg_default;

-- Challenges Comments junction table
create table public.challenges_comments (
  id uuid not null default gen_random_uuid (),
  challenge_id uuid null,
  comment_id uuid not null,
  constraint challenge_comments_pkey primary key (id),
  constraint challenge_comments_challenge_id_fkey foreign KEY (challenge_id) references challenges (id) on update CASCADE on delete CASCADE,
  constraint challenge_comments_comment_id_fkey foreign KEY (comment_id) references comments (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Solutions Comments junction table
create table public.solutions_comments (
  comment_id uuid not null,
  solution_id uuid not null,
  constraint solutions_comments_pkey primary key (comment_id, solution_id),
  constraint solutions_comments_comment_id_fkey foreign KEY (comment_id) references comments (id) on update CASCADE on delete CASCADE,
  constraint solutions_comments_solution_id_fkey foreign KEY (solution_id) references solutions (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Users Acquired Avatars junction table
create table public.users_acquired_avatars (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id character varying not null,
  avatar_id uuid not null,
  constraint users_acquired_avatars_pkey primary key (id),
  constraint users_acquired_avatars_avatar_id_fkey foreign KEY (avatar_id) references avatars (id) on delete CASCADE,
  constraint users_acquired_avatars_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Users Acquired Rockets junction table
create table public.users_acquired_rockets (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id character varying not null,
  rocket_id uuid not null,
  constraint users_acquired_rockets_pkey primary key (id),
  constraint users_acquired_rockets_rocket_id_fkey foreign KEY (rocket_id) references rockets (id),
  constraint users_acquired_rockets_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Users Acquired Insignias junction table
create table public.users_acquired_insignias (
  user_id character varying not null,
  insignia_id uuid not null,
  constraint users_acquired_insignias_pkey primary key (user_id, insignia_id),
  constraint users_acquired_insignias_insignia_id_fkey foreign KEY (insignia_id) references insignias (id) on delete CASCADE,
  constraint users_acquired_insignias_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Users Challenge Votes junction table
create table public.users_challenge_votes (
  challenge_id uuid not null,
  user_id character varying not null,
  vote public.challenge_vote not null,
  constraint users_challenge_votes_pkey primary key (challenge_id, user_id),
  constraint users_voted_challenges_challenge_id_fkey foreign KEY (challenge_id) references challenges (id) on update CASCADE on delete CASCADE,
  constraint users_voted_challenges_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Users Completed Challenges junction table
create table public.users_completed_challenges (
  user_id character varying not null,
  challenge_id uuid not null,
  constraint users_completed_challenges_pkey primary key (user_id, challenge_id),
  constraint users_completed_challenges_challenge_id_fkey foreign KEY (challenge_id) references challenges (id) on delete CASCADE,
  constraint users_completed_challenges_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Users Rescuable Achievements junction table
create table public.users_rescuable_achievements (
  user_id character varying not null,
  achievement_id uuid not null,
  constraint users_rescuable_achievements_pkey primary key (user_id, achievement_id),
  constraint users_rescuable_achievements_achievement_id_fkey foreign KEY (achievement_id) references achievements (id) on delete CASCADE,
  constraint users_rescuable_achievements_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Users Unlocked Achievements junction table
create table public.users_unlocked_achievements (
  user_id character varying not null,
  achievement_id uuid not null,
  constraint users_unlocked_achievements_pkey primary key (user_id, achievement_id),
  constraint users_unlocked_achievements_achievement_id_fkey foreign KEY (achievement_id) references achievements (id) on delete CASCADE,
  constraint users_unlocked_achievements_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Users Unlocked Stars junction table
create table public.users_unlocked_stars (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id character varying not null,
  star_id uuid not null,
  constraint user_unlocked_stars_pkey primary key (id),
  constraint users_unlocked_stars_star_id_fkey foreign KEY (star_id) references stars (id) on delete CASCADE,
  constraint users_unlocked_stars_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Users Upvoted Comments junction table
create table public.users_upvoted_comments (
  user_id character varying not null,
  comment_id uuid not null,
  constraint users_upvoted_comments_pkey primary key (user_id, comment_id),
  constraint users_upvoted_comments_comment_id_fkey foreign KEY (comment_id) references comments (id) on delete CASCADE,
  constraint users_upvoted_comments_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Users Upvoted Solutions junction table
create table public.users_upvoted_solutions (
  solution_id uuid not null,
  user_id character varying not null,
  constraint user_upvoted_solutions_pkey primary key (solution_id, user_id),
  constraint user_upvoted_solutions_solution_id_fkey foreign KEY (solution_id) references solutions (id) on update CASCADE on delete CASCADE,
  constraint user_upvoted_solutions_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- =====================================================
-- VIEWS (Depend on all tables above)
-- =====================================================

-- Users View
create view public.users_view as
with
  unlocked_stars_by_planet as (
    select
      p.id as planet_id,
      p.name as planet_name,
      count(distinct uus_1.star_id) as unlocked_stars_count,
      uus_1.user_id
    from
      users_unlocked_stars uus_1
      join stars s on uus_1.star_id = s.id
      join planets p on s.planet_id = p.id
    group by
      p.id,
      p.name,
      p."position",
      uus_1.user_id
    order by
      p."position"
  ),
  all_stars_by_planet as (
    select
      p.id as planet_id,
      p.name as planet_name,
      count(s.id) as stars_count
    from
      planets p
      join stars s on s.planet_id = p.id
    group by
      p.id,
      p.name,
      p."position"
    order by
      p."position"
  )
select
  u.id,
  u.name,
  u.email,
  u.level,
  u.xp,
  u.coins,
  u.created_at,
  u.streak,
  u.week_status,
  u.did_complete_saturday,
  u.tier_id,
  u.rocket_id,
  u.weekly_xp,
  u.can_see_ranking,
  u.last_week_ranking_position,
  u.avatar_id,
  u.study_time,
  u.did_break_streak,
  u.is_loser,
  u.slug,
  array_agg(distinct uus.star_id) as unlocked_stars_ids,
  array_agg(distinct uua.achievement_id) as unlocked_achievements_ids,
  array_agg(distinct ura.achievement_id) as rescuable_achievements_ids,
  array_agg(distinct ucc.challenge_id) as completed_challenges_ids,
  array_agg(distinct uar.rocket_id) as acquired_rockets_ids,
  array_agg(distinct uaa.avatar_id) as acquired_avatars_ids,
  array_agg(distinct uuc.comment_id) as upvoted_comments_ids,
  array_agg(distinct uuso.solution_id) as upvoted_solutions_ids,
  (
    select
      array_agg(distinct asbp.planet_id) as array_agg
    from
      unlocked_stars_by_planet usbp
      join all_stars_by_planet asbp on usbp.planet_id = asbp.planet_id
    where
      usbp.unlocked_stars_count >= asbp.stars_count
      and usbp.user_id::text = u.id::text
  ) as completed_planets_ids
from
  users u
  left join users_unlocked_stars uus on uus.user_id::text = u.id::text
  left join users_unlocked_achievements uua on uua.user_id::text = u.id::text
  left join users_rescuable_achievements ura on ura.user_id::text = u.id::text
  left join users_completed_challenges ucc on ucc.user_id::text = u.id::text
  left join users_acquired_rockets uar on uar.user_id::text = u.id::text
  left join users_acquired_avatars uaa on uaa.user_id::text = u.id::text
  left join users_upvoted_comments uuc on uuc.user_id::text = u.id::text
  left join users_upvoted_solutions uuso on uuso.user_id::text = u.id::text
group by
  u.id;

-- Challenges View
create view public.challenges_view as
select
  c.title,
  c.difficulty_level,
  c.created_at,
  c.id,
  c.star_id,
  c.initial_code,
  c.texts,
  c.function_name,
  c.test_cases,
  c.slug,
  c.user_id,
  c.description,
  c.is_public,
  u.id as author_id,
  u.name as author_name,
  u.slug as author_slug,
  a.name as author_avatar_name,
  a.image as author_avatar_image,
  count(
    distinct case
      when uvc.vote = 'upvote'::challenge_vote then 1
      else null::integer
    end
  ) as upvotes_count,
  count(
    distinct case
      when uvc.vote = 'downvote'::challenge_vote then 1
      else null::integer
    end
  ) as downvotes_count,
  count(distinct ucc.challenge_id) as total_completitions,
  array(
    select
      json_build_object('id', category.id, 'name', category.name)
    from (
      select distinct
        ccc2.id,
        ccc2.name
      from
        challenges_categories cc2
        join categories ccc2 on ccc2.id = cc2.category_id
      where
        cc2.challenge_id = c.id
      order by
        ccc2.name
    ) as category
  ) as categories
from
  challenges c
  left join users u on u.id::text = c.user_id
  left join users_challenge_votes uvc on uvc.challenge_id = c.id
  left join users_completed_challenges ucc on ucc.challenge_id = c.id
  left join avatars a on a.id = u.avatar_id
group by
  c.id,
  u.id,
  a.name,
  a.image;

-- Solutions View
create view public.solutions_view as
select
  s.id,
  s.title,
  s.content,
  s.slug,
  s.views_count,
  s.challenge_id,
  s.created_at,
  s.user_id as author_id,
  COALESCE(
    (
      select
        count(users_upvoted_solutions.solution_id) as count
      from
        users_upvoted_solutions
      where
        users_upvoted_solutions.solution_id = s.id
    ),
    0::bigint
  ) as upvotes_count,
  COALESCE(
    (
      select
        count(solutions_comments.solution_id) as count
      from
        solutions_comments
      where
        solutions_comments.solution_id = s.id
    ),
    0::bigint
  ) as comments_count,
  u.name as author_name,
  u.slug as author_slug,
  a.name as author_avatar_name,
  a.image as author_avatar_image
from
  solutions s
  left join users u on u.id::text = s.user_id::text
  left join avatars a on a.id = u.avatar_id
group by
  s.id,
  u.id,
  a.name,
  a.image;

-- Comments View
create view public.comments_view as
select
  c.id,
  c.content,
  c.created_at,
  c.parent_comment_id,
  c.user_id as author_id,
  COALESCE(
    (
      select
        count(users_upvoted_comments.comment_id) as count
      from
        users_upvoted_comments
      where
        users_upvoted_comments.comment_id = c.id
    ),
    0::bigint
  ) as upvotes_count,
  COALESCE(
    (
      select
        count(comments.id) as count
      from
        comments
      where
        comments.parent_comment_id = c.id
    ),
    0::bigint
  ) as replies_count,
  u.name as author_name,
  u.slug as author_slug,
  a.name as author_avatar_name,
  a.image as author_avatar_image
from
  comments c
  left join users u on u.id::text = c.user_id::text
  left join avatars a on a.id = u.avatar_id
group by
  c.id,
  u.id,
  a.name,
  a.image;

-- Planets View
create view public.planets_view as
with
  planet_star_counts as (
    select
      stars.planet_id,
      count(stars.id) as total_stars
    from
      stars
    group by
      stars.planet_id
  ),
  user_planet_progress as (
    select
      s.planet_id,
      uus.user_id,
      count(uus.star_id) as unlocked_stars_count
    from
      users_unlocked_stars uus
      join stars s on uus.star_id = s.id
    group by
      s.planet_id,
      uus.user_id
  ),
  completed_planets_counts as (
    select
      upp.planet_id,
      count(upp.user_id) as completion_count
    from
      user_planet_progress upp
      join planet_star_counts psc on upp.planet_id = psc.planet_id
    where
      upp.unlocked_stars_count = psc.total_stars
    group by
      upp.planet_id
  )
select
  p.id,
  p.name,
  p.image,
  p.icon,
  p."position",
  COALESCE(cpc.completion_count, 0::bigint) as completions_count
from
  planets p
  left join completed_planets_counts cpc on p.id = cpc.planet_id;

-- Snippets View
create view public.snippets_view as
select
  s.id,
  s.title,
  s.code,
  s.is_public,
  s.created_at,
  s.user_id as author_id,
  u.name as author_name,
  u.slug as author_slug,
  a.name as author_avatar_name,
  a.image as author_avatar_image
from
  snippets s
  left join users u on u.id::text = s.user_id::text
  left join avatars a on a.id = u.avatar_id
group by
  s.id,
  u.id,
  a.name,
  a.image;

-- Users Completed Planets View
create view public.users_completed_planets_view as
with
  unlocked_stars_by_planet as (
    select
      p.id as planet_id,
      p.name as planet_name,
      count(distinct uus.star_id) as unlocked_stars_count,
      uus.user_id
    from
      users_unlocked_stars uus
      join stars s on uus.star_id = s.id
      join planets p on s.planet_id = p.id
    group by
      p.id,
      p.name,
      p."position",
      uus.user_id
    order by
      p."position"
  ),
  all_stars_by_planet as (
    select
      p.id as planet_id,
      p.name as planet_name,
      count(s.id) as stars_count
    from
      planets p
      join stars s on s.planet_id = p.id
    group by
      p.id,
      p.name,
      p."position"
    order by
      p."position"
  )
select
  u.id as user_id,
  asbp.planet_id
from
  unlocked_stars_by_planet usbp
  join all_stars_by_planet asbp on usbp.planet_id = asbp.planet_id
  join users u on u.id::text = usbp.user_id::text
where
  usbp.unlocked_stars_count >= asbp.stars_count
  and usbp.user_id::text = u.id::text;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
