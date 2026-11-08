-- Cópias de trilhas pertencem à turma; a original pode ser editada ou excluída.
create function private.valid_classroom_paths(items jsonb) returns boolean
language plpgsql stable set search_path = '' as $$
declare item jsonb; seen text[] := '{}';
begin
  if jsonb_typeof(items) is distinct from 'array' or jsonb_array_length(items) > 50 then return false; end if;
  for item in select value from jsonb_array_elements(items) loop
    if not private.valid_path(item)
      or jsonb_typeof(item->'id') is distinct from 'string'
      or not coalesce(item->>'id' ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', false)
      or item->>'id' = any(seen)
      or jsonb_typeof(item->'visible') is distinct from 'boolean'
      or jsonb_typeof(item->'sharedAt') is distinct from 'string'
      or jsonb_typeof(item->'sourceUpdatedAt') is distinct from 'string'
      or jsonb_typeof(item->'sourceRevision') is distinct from 'number'
      or not coalesce(item->>'sourceRevision' ~ '^[1-9][0-9]*$', false)
      then return false; end if;
    perform (item->>'sharedAt')::timestamptz;
    perform (item->>'sourceUpdatedAt')::timestamptz;
    seen := array_append(seen, item->>'id');
  end loop;
  return true;
exception when invalid_datetime_format or datetime_field_overflow then return false;
end $$;
revoke all on function private.valid_classroom_paths(jsonb) from public, anon, authenticated;

alter table public.classrooms add column shared_paths jsonb not null default '[]'
  check (private.valid_classroom_paths(shared_paths));

create or replace function private.classroom_json(c public.classrooms) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object('id',c.id,'code',c.code,'name',c.name,'grade',c.grade,
    'school',c.school,'schoolYear',c.school_year,'color',c.color,'archived',c.archived,
    'materials',c.materials,'sharedPaths',c.shared_paths,'revision',c.revision,'createdAt',c.created_at)
$$;

-- A gravação genérica de turmas preserva shared_paths. Só esta operação altera cópias.
create function private.change_classroom_teaching_path(
  p_classroom_id uuid, p_path_id uuid, p_revision integer, p_action text,
  p_path_revision integer, p_visible boolean, p_direction integer
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare c public.classrooms; source public.teaching_paths;
  items jsonb[]; item jsonb; copied jsonb; position integer := 0; target integer; i integer;
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  if not coalesce(p_action in ('share','update','visibility','remove','move'), false) then
    raise exception 'invalid_path_action' using errcode = '23514';
  end if;
  select * into c from public.classrooms where id = p_classroom_id and owner_id = auth.uid() for update;
  if not found then raise exception 'classroom_not_found' using errcode = '42501'; end if;
  if c.archived then raise exception 'classroom_archived' using errcode = '23514'; end if;
  if p_revision is distinct from c.revision then raise exception 'workspace_conflict' using errcode = '40001'; end if;
  select coalesce(array_agg(value order by ordinal), '{}'::jsonb[]) into items
    from jsonb_array_elements(c.shared_paths) with ordinality as paths(value,ordinal);
  for i in 1..coalesce(array_length(items,1),0) loop
    if items[i]->>'id' = p_path_id::text then position := i; exit; end if;
  end loop;
  if p_action <> 'share' and position = 0 then raise exception 'shared_path_not_found' using errcode = '23514'; end if;

  if p_action in ('share','update') then
    -- Bloqueia a versão de origem durante a cópia e verifica os dois proprietários.
    select * into source from public.teaching_paths where id = p_path_id and owner_id = auth.uid() for share;
    if not found then raise exception 'path_not_found' using errcode = '42501'; end if;
    if p_path_revision is distinct from source.revision then raise exception 'workspace_conflict' using errcode = '40001'; end if;
    if p_action = 'share' and position > 0 then return private.classroom_json(c); end if;
    if p_action = 'share' and coalesce(array_length(items,1),0) >= 50 then raise exception 'too_many_shared_paths' using errcode = '23514'; end if;
    copied := source.data || jsonb_build_object('id',source.id,'sourceRevision',source.revision,
      'sourceUpdatedAt',source.updated_at,'sharedAt',coalesce(items[position]->'sharedAt',to_jsonb(clock_timestamp())),
      'visible',coalesce(items[position]->'visible','true'::jsonb));
    if position = 0 then items := array_append(items,copied); else items[position] := copied; end if;
  elsif p_action = 'visibility' then
    if p_visible is null then raise exception 'invalid_visibility' using errcode = '23514'; end if;
    items[position] := items[position] || jsonb_build_object('visible',p_visible);
  elsif p_action = 'remove' then
    items := array_remove(items,items[position]);
  elsif p_action = 'move' then
    if p_direction is null or p_direction not in (-1,1) then raise exception 'invalid_direction' using errcode = '23514'; end if;
    target := position + p_direction;
    if target < 1 or target > array_length(items,1) then return private.classroom_json(c); end if;
    item := items[position]; items[position] := items[target]; items[target] := item;
  end if;
  update public.classrooms set shared_paths = to_jsonb(items), revision = revision + 1, updated_at = clock_timestamp()
    where id = c.id returning * into c;
  return private.classroom_json(c);
end $$;

create function public.change_classroom_teaching_path(
  p_classroom_id uuid, p_path_id uuid, p_revision integer, p_action text,
  p_path_revision integer default null, p_visible boolean default null, p_direction integer default null
) returns jsonb language sql security invoker set search_path = '' as $$
  select private.change_classroom_teaching_path(p_classroom_id,p_path_id,p_revision,p_action,p_path_revision,p_visible,p_direction);
$$;
revoke all on function private.change_classroom_teaching_path(uuid,uuid,integer,text,integer,boolean,integer) from public, anon, authenticated;
revoke all on function public.change_classroom_teaching_path(uuid,uuid,integer,text,integer,boolean,integer) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.change_classroom_teaching_path(uuid,uuid,integer,text,integer,boolean,integer) to authenticated;
grant execute on function public.change_classroom_teaching_path(uuid,uuid,integer,text,integer,boolean,integer) to authenticated;

-- Alunos recebem só os campos de apresentação e as etapas de cópias visíveis.
create or replace function public.student_classroom(p_code text, p_client_hash text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare c public.classrooms; count_hits integer; bucket timestamptz := date_trunc('minute',clock_timestamp()); result jsonb;
begin
  if p_client_hash is null or length(p_client_hash) <> 64 then raise exception 'invalid_client'; end if;
  insert into private.student_access_limits as limits(client_hash,window_start,hits) values(p_client_hash,bucket,1)
  on conflict(client_hash) do update set
    hits = case when limits.window_start = bucket then limits.hits + 1 else 1 end,
    window_start = bucket returning hits into count_hits;
  if random() < 0.01 then delete from private.student_access_limits where window_start < bucket - interval '1 day'; end if;
  if count_hits > 600 then return jsonb_build_object('error','rate_limited'); end if;
  if p_code is null or p_code !~ '^[1-9][0-9]{5}$' then return null; end if;
  select * into c from public.classrooms where code = p_code and not archived;
  if not found then return null; end if;
  result := private.classroom_json(c) - 'revision' - 'sharedPaths';
  return result || jsonb_build_object('materials',coalesce((
    select jsonb_agg(jsonb_build_object('resourceId',item->>'resourceId','visible',true,'instruction',item->>'instruction') order by position)
      from jsonb_array_elements(c.materials) with ordinality as entries(item,position)
      where item->'visible' = 'true'::jsonb
  ),'[]'::jsonb),'sharedPaths',coalesce((
    select jsonb_agg(jsonb_build_object('id',item->>'id','name',item->>'name','backgroundColor',item->>'backgroundColor',
      'icon',item->>'icon','resourceIds',item->'resourceIds','visible',true) order by position)
      from jsonb_array_elements(c.shared_paths) with ordinality as entries(item,position)
      where item->'visible' = 'true'::jsonb
  ),'[]'::jsonb));
end $$;
revoke all on function public.student_classroom(text,text) from public, anon, authenticated;
grant execute on function public.student_classroom(text,text) to service_role;
