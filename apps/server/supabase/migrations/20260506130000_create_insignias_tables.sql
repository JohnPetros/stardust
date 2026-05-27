create type "public"."insignia_role" as enum ('engineer', 'god');


create table "public"."insignias" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "price" integer not null,
    "image" text not null,
    "role" "public"."insignia_role" not null,
    "is_purchasable" boolean not null default false
);


create table "public"."users_acquired_insignias" (
    "user_id" character varying not null,
    "insignia_id" uuid not null
);


CREATE UNIQUE INDEX insignias_pkey ON public.insignias USING btree (id);

CREATE UNIQUE INDEX insignias_role_key ON public.insignias USING btree (role);

CREATE UNIQUE INDEX users_acquired_insignias_pkey ON public.users_acquired_insignias USING btree (user_id, insignia_id);


alter table "public"."insignias" add constraint "insignias_pkey" PRIMARY KEY using index "insignias_pkey";

alter table "public"."insignias" add constraint "insignias_role_key" UNIQUE using index "insignias_role_key";

alter table "public"."users_acquired_insignias" add constraint "users_acquired_insignias_pkey" PRIMARY KEY using index "users_acquired_insignias_pkey";

alter table "public"."users_acquired_insignias" add constraint "users_acquired_insignias_insignia_id_fkey" FOREIGN KEY (insignia_id) REFERENCES insignias(id) ON DELETE CASCADE not valid;

alter table "public"."users_acquired_insignias" validate constraint "users_acquired_insignias_insignia_id_fkey";

alter table "public"."users_acquired_insignias" add constraint "users_acquired_insignias_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_acquired_insignias" validate constraint "users_acquired_insignias_user_id_fkey";
