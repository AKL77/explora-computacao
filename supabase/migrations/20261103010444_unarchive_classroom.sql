-- Reativa somente o arquivamento, preservando código, materiais e dados da turma.
create function public.unarchive_classroom(p_id uuid, p_revision integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare c public.classrooms;
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  select * into c from public.classrooms where id = p_id and owner_id = auth.uid() for update;
  if not found then raise exception 'classroom_not_found' using errcode = '42501'; end if;
  if p_revision is distinct from c.revision then raise exception 'workspace_conflict' using errcode = '40001'; end if;
  if not c.archived then raise exception 'classroom_not_archived' using errcode = '23514'; end if;

  update public.classrooms set archived = false, revision = revision + 1, updated_at = clock_timestamp()
  where id = c.id returning * into c;
  return private.classroom_json(c);
end $$;

revoke all on function public.unarchive_classroom(uuid,integer) from public, anon, authenticated;
grant execute on function public.unarchive_classroom(uuid,integer) to authenticated;
