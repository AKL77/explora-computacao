-- Acervo continua versionado no site. Somente seus identificadores são registrados aqui.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.catalog_resource_ids (
  id text primary key check (length(id) between 1 and 200)
);
alter table public.catalog_resource_ids enable row level security;
revoke all on public.catalog_resource_ids from anon, authenticated;

create function private.valid_materials(items jsonb) returns boolean
language plpgsql stable set search_path = '' as $$
declare item jsonb; seen text[] := '{}'; rid text;
begin
  if jsonb_typeof(items) is distinct from 'array' or jsonb_array_length(items) > 100 then return false; end if;
  for item in select value from jsonb_array_elements(items) loop
    rid := item->>'resourceId';
    if rid is null or rid = any(seen) or not exists(select 1 from public.catalog_resource_ids where id = rid)
      or jsonb_typeof(item->'visible') is distinct from 'boolean'
      or jsonb_typeof(item->'instruction') is distinct from 'string'
      or length(item->>'instruction') > 500 then return false; end if;
    seen := array_append(seen, rid);
  end loop;
  return true;
end $$;

create function private.valid_path(data jsonb) returns boolean
language plpgsql stable set search_path = '' as $$
declare rid text; seen text[] := '{}'; entry record;
begin
  if jsonb_typeof(data) is distinct from 'object'
    or jsonb_typeof(data->'resourceIds') is distinct from 'array'
    or jsonb_array_length(data->'resourceIds') not between 1 and 100
    or jsonb_typeof(data->'lessonCountsByResourceId') is distinct from 'object'
    or coalesce(length(btrim(data->>'name')), 0) not between 1 and 160
    or coalesce(length(btrim(data->>'objective')), 0) not between 1 and 4000
    or not coalesce(data->>'backgroundColor' in ('turquoise','blue','green','indigo','violet','amber','coral'), false)
    or not coalesce(data->>'icon' in ('book-open-check','route','target','sparkles','flag','lightbulb','puzzle'), false)
    then return false; end if;
  for rid in select jsonb_array_elements_text(data->'resourceIds') loop
    if rid = any(seen) or not exists(select 1 from public.catalog_resource_ids where id = rid) then return false; end if;
    seen := array_append(seen, rid);
  end loop;
  for entry in select key, value from jsonb_each(data->'lessonCountsByResourceId') loop
    if not entry.key = any(seen) or entry.value not in ('1'::jsonb,'2'::jsonb,'3'::jsonb) then return false; end if;
  end loop;
  return true;
end $$;

create table public.classrooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique check (code ~ '^[1-9][0-9]{5}$'),
  name text not null check (length(btrim(name)) between 1 and 80),
  grade integer not null check (grade between 4 and 9),
  school text not null default '' check (length(school) <= 120),
  school_year integer not null check (school_year between 2000 and 2100),
  color text not null check (color in ('blue','green','violet','amber','coral')),
  archived boolean not null default false,
  materials jsonb not null default '[]' check (private.valid_materials(materials)),
  revision integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index classrooms_owner_id_idx on public.classrooms(owner_id);
alter table public.classrooms enable row level security;
revoke all on public.classrooms from anon, authenticated;
grant select on public.classrooms to authenticated;
create policy classrooms_owner_read on public.classrooms for select to authenticated
using (owner_id = (select auth.uid()));

create table private.classroom_codes (
  code text primary key,
  classroom_id uuid unique references public.classrooms(id) on delete set null
);
-- O código permanece reservado depois de excluir a turma.
revoke all on private.classroom_codes from public, anon, authenticated;

create table public.teaching_paths (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null check (private.valid_path(data)),
  revision integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index teaching_paths_owner_id_idx on public.teaching_paths(owner_id);
alter table public.teaching_paths enable row level security;
revoke all on public.teaching_paths from anon, authenticated;
grant select on public.teaching_paths to authenticated;
create policy teaching_paths_owner_read on public.teaching_paths for select to authenticated
using (owner_id = (select auth.uid()));

create function private.classroom_json(c public.classrooms) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object('id',c.id,'code',c.code,'name',c.name,'grade',c.grade,
    'school',c.school,'schoolYear',c.school_year,'color',c.color,'archived',c.archived,
    'materials',c.materials,'revision',c.revision,'createdAt',c.created_at)
$$;
create function private.path_json(p public.teaching_paths) returns jsonb
language sql stable set search_path = '' as $$
  select p.data || jsonb_build_object('id',p.id,'createdAt',p.created_at,'updatedAt',p.updated_at,'revision',p.revision)
$$;

create function public.teacher_workspace() returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  return jsonb_build_object(
    'classrooms', coalesce((select jsonb_agg(private.classroom_json(c) order by c.created_at desc) from public.classrooms c where c.owner_id = auth.uid()), '[]'::jsonb),
    'paths', coalesce((select jsonb_agg(private.path_json(p) order by p.updated_at desc) from public.teaching_paths p where p.owner_id = auth.uid()), '[]'::jsonb)
  );
end $$;

create function public.save_classroom(p_id uuid, p_data jsonb, p_revision integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare c public.classrooms; new_code text; tries integer := 0;
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  if p_id is null then
    if coalesce((p_data->>'archived')::boolean, false) then raise exception 'invalid_classroom' using errcode = '23514'; end if;
    loop
      tries := tries + 1;
      if tries > 100 then raise exception 'code_allocation_failed'; end if;
      new_code := (100000 + floor(random() * 900000)::integer)::text;
      insert into private.classroom_codes(code) values(new_code) on conflict do nothing;
      exit when found;
    end loop;
    insert into public.classrooms(owner_id,code,name,grade,school,school_year,color,materials)
    values(auth.uid(),new_code,btrim(p_data->>'name'),(p_data->>'grade')::integer,
      btrim(coalesce(p_data->>'school','')),(p_data->>'schoolYear')::integer,p_data->>'color',coalesce(p_data->'materials','[]'))
    returning * into c;
    update private.classroom_codes set classroom_id = c.id where code = new_code;
  else
    select * into c from public.classrooms where id = p_id and owner_id = auth.uid() for update;
    if not found then raise exception 'classroom_not_found' using errcode = '42501'; end if;
    if c.archived then raise exception 'classroom_archived' using errcode = '23514'; end if;
    if p_revision is distinct from c.revision then raise exception 'workspace_conflict' using errcode = '40001'; end if;
    update public.classrooms set name = btrim(p_data->>'name'), grade = (p_data->>'grade')::integer,
      school = btrim(coalesce(p_data->>'school','')), school_year = (p_data->>'schoolYear')::integer,
      color = p_data->>'color', archived = (p_data->>'archived')::boolean, materials = p_data->'materials',
      revision = revision + 1, updated_at = clock_timestamp()
    where id = c.id returning * into c;
  end if;
  return private.classroom_json(c);
end $$;

create function public.delete_classroom(p_id uuid, p_revision integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare c public.classrooms;
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  select * into c from public.classrooms where id = p_id and owner_id = auth.uid() for update;
  if not found then raise exception 'classroom_not_found' using errcode = '42501'; end if;
  if p_revision is distinct from c.revision then raise exception 'workspace_conflict' using errcode = '40001'; end if;
  delete from public.classrooms where id = c.id;
  return true;
end $$;

create function public.save_teaching_path(p_id uuid, p_data jsonb, p_revision integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare p public.teaching_paths; clean jsonb;
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  clean := jsonb_build_object('name',btrim(p_data->>'name'),'objective',btrim(p_data->>'objective'),
    'backgroundColor',p_data->>'backgroundColor','icon',p_data->>'icon',
    'resourceIds',p_data->'resourceIds','lessonCountsByResourceId',p_data->'lessonCountsByResourceId');
  if p_revision is null then
    insert into public.teaching_paths(id,owner_id,data) values(p_id,auth.uid(),clean) returning * into p;
  else
    select * into p from public.teaching_paths where id = p_id and owner_id = auth.uid() for update;
    if not found then raise exception 'path_not_found' using errcode = '42501'; end if;
    if p_revision is distinct from p.revision then raise exception 'workspace_conflict' using errcode = '40001'; end if;
    update public.teaching_paths set data = clean, revision = revision + 1, updated_at = clock_timestamp()
    where id = p.id returning * into p;
  end if;
  return private.path_json(p);
end $$;

-- Consulta de alunos somente pelo serviço da Edge Function; nunca pela chave pública.
create table private.student_access_limits (
  client_hash text primary key check (length(client_hash) = 64),
  window_start timestamptz not null,
  hits integer not null
);
create index student_access_limits_window_idx on private.student_access_limits(window_start);
revoke all on private.student_access_limits from public, anon, authenticated;

create function public.student_classroom(p_code text, p_client_hash text) returns jsonb
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
  result := private.classroom_json(c);
  return (result - 'revision') || jsonb_build_object('materials',coalesce((
    select jsonb_agg(jsonb_build_object('resourceId',item->>'resourceId','visible',true,'instruction',item->>'instruction') order by position)
    from jsonb_array_elements(c.materials) with ordinality as entries(item,position)
    where item->'visible' = 'true'::jsonb
  ),'[]'::jsonb));
end $$;

revoke all on function public.teacher_workspace() from public, anon;
revoke all on function public.save_classroom(uuid,jsonb,integer) from public, anon;
revoke all on function public.delete_classroom(uuid,integer) from public, anon;
revoke all on function public.save_teaching_path(uuid,jsonb,integer) from public, anon;
revoke all on function public.student_classroom(text,text) from public, anon, authenticated;
grant execute on function public.teacher_workspace() to authenticated;
grant execute on function public.save_classroom(uuid,jsonb,integer) to authenticated;
grant execute on function public.delete_classroom(uuid,integer) to authenticated;
grant execute on function public.save_teaching_path(uuid,jsonb,integer) to authenticated;
grant execute on function public.student_classroom(text,text) to service_role;
revoke all on all functions in schema private from public, anon, authenticated;
