-- A função privilegiada fica fora do esquema exposto pela Data API.
-- Somente esta operação privada é executável por professores autenticados.
create function private.delete_teaching_path(p_id uuid, p_revision integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare p public.teaching_paths;
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into p from public.teaching_paths
  where id = p_id and owner_id = auth.uid()
  for update;

  if not found then
    raise exception 'path_not_found' using errcode = '42501';
  end if;
  if p_revision is distinct from p.revision then
    raise exception 'workspace_conflict' using errcode = '40001';
  end if;

  delete from public.teaching_paths where id = p.id and owner_id = auth.uid();
  return true;
end $$;

create function public.delete_teaching_path(p_id uuid, p_revision integer) returns boolean
language sql security invoker set search_path = '' as $$
  select private.delete_teaching_path(p_id, p_revision);
$$;

revoke all on function private.delete_teaching_path(uuid,integer) from public, anon, authenticated;
revoke all on function public.delete_teaching_path(uuid,integer) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.delete_teaching_path(uuid,integer) to authenticated;
grant execute on function public.delete_teaching_path(uuid,integer) to authenticated;
