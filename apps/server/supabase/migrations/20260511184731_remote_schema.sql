drop function if exists "public"."get_next_star_from_next_planet"(_current_planet_id uuid, _user_id character varying);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_next_star_from_next_planet(_current_planet_id uuid, _user_id character varying)
 RETURNS SETOF public.next_star_from_next_planet
 LANGUAGE sql
AS $function$
    SELECT 
    S.id, 
    EXISTS (
        SELECT 1 
        FROM users_unlocked_stars AS UUS 
        WHERE 
        UUS.star_id = S.id AND UUS.user_id = _user_id
    ) AS is_unlocked
    FROM stars AS S
    JOIN planets AS P ON P.id = S.planet_id
    WHERE 
        P.position = 7
        AND S.number = 1
$function$
;


