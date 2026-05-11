create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "content" text not null default ''::text,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "user_id" character varying not null
);

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY ("id");

alter table "public"."notes" add constraint "notes_title_check" CHECK ((length(title) >= 1));

alter table "public"."notes" add constraint "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_user_id_fkey";

create index "notes_user_id_updated_at_idx" on "public"."notes" using btree ("user_id", "updated_at" desc);

revoke all on table "public"."notes" from "anon";
grant select, insert, update, delete on table "public"."notes" to "authenticated";
grant all on table "public"."notes" to "service_role";
