-- A conexão administrativa cria somente dados temporários, revertidos ao final.
begin;
do $$
declare teacher_a uuid := gen_random_uuid(); teacher_b uuid := gen_random_uuid();
begin
  insert into auth.users(id) values (teacher_a), (teacher_b);
  perform set_config('test.delete_teacher_a',teacher_a::text,true);
  perform set_config('test.delete_teacher_b',teacher_b::text,true);
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.delete_teacher_a'),true);
do $$
declare p jsonb;
begin
  p := public.save_teaching_path(gen_random_uuid(),'{"name":"Excluir teste","objective":"Teste de exclusão","backgroundColor":"blue","icon":"route","resourceIds":["google-interland"],"lessonCountsByResourceId":{}}',null);
  perform set_config('test.delete_path_id',p->>'id',true);
  begin
    perform public.delete_teaching_path((p->>'id')::uuid,0);
    raise exception 'FAIL: exclusão com revisão antiga';
  exception when serialization_failure then null; end;
  if jsonb_array_length(public.teacher_workspace()->'paths') <> 1 then
    raise exception 'FAIL: conflito removeu a trilha';
  end if;
end $$;

select set_config('request.jwt.claim.sub',current_setting('test.delete_teacher_b'),true);
do $$
begin
  begin
    perform public.delete_teaching_path(current_setting('test.delete_path_id')::uuid,1);
    raise exception 'FAIL: exclusão de outro professor';
  exception when insufficient_privilege then null; end;
  perform public.save_teaching_path(gen_random_uuid(),'{"name":"Preservar teste","objective":"Outro professor","backgroundColor":"blue","icon":"route","resourceIds":["google-interland"],"lessonCountsByResourceId":{}}',null);
end $$;

set local role anon;
do $$ begin
  begin
    perform public.delete_teaching_path(current_setting('test.delete_path_id')::uuid,1);
    raise exception 'FAIL: exclusão anônima';
  exception when insufficient_privilege then null; end;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
  begin
    perform public.delete_teaching_path(current_setting('test.delete_path_id')::uuid,1);
    raise exception 'FAIL: exclusão sem identificação';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub',current_setting('test.delete_teacher_a'),true);
do $$ begin
  if not public.delete_teaching_path(current_setting('test.delete_path_id')::uuid,1) then
    raise exception 'FAIL: exclusão não confirmada';
  end if;
  if jsonb_array_length(public.teacher_workspace()->'paths') <> 0 then
    raise exception 'FAIL: trilha não foi removida';
  end if;
end $$;

select set_config('request.jwt.claim.sub',current_setting('test.delete_teacher_b'),true);
do $$ begin
  if jsonb_array_length(public.teacher_workspace()->'paths') <> 1 then
    raise exception 'FAIL: exclusão afetou outro professor';
  end if;
end $$;
rollback;
select 'PASS: exclusão pelo dono, revisão, isolamento e bloqueio anônimo; dados revertidos' as result;
