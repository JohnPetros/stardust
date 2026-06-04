create or replace function public.clear_text_block_audio(
  p_star_id uuid,
  p_block_index integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_block_index < 0 then
    raise exception 'p_block_index must be greater than or equal to zero';
  end if;

  update public.stars
  set texts = jsonb_set(
    texts,
    array[p_block_index::text],
    (texts -> p_block_index) - 'audio',
    false
  )
  where id = p_star_id
    and texts is not null
    and jsonb_typeof(texts) = 'array'
    and p_block_index < jsonb_array_length(texts);

  if not found then
    raise exception 'Star or block index not found for audio cleanup';
  end if;
end;
$$;

grant execute on function public.clear_text_block_audio(uuid, integer) to service_role;
