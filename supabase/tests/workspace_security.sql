-- Executar em uma conexão administrativa. Todos os dados de teste são revertidos.
begin;
insert into auth.users(id) values ('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$
declare c jsonb; p jsonb;
begin
  c := public.save_classroom(null,'{"name":"Turma de teste","grade":6,"school":"Escola de teste","schoolYear":2026,"color":"blue","materials":[{"resourceId":"google-interland","visible":true,"instruction":"Em duplas"},{"resourceId":"lightbot-web","visible":false,"instruction":"NÃO PUBLICAR"}]}',null);
  perform set_config('test.classroom_id',c->>'id',true);
  perform set_config('test.classroom_code',c->>'code',true);
  p := public.save_teaching_path(gen_random_uuid(),'{"name":"Trilha de teste","objective":"Objetivo","backgroundColor":"blue","icon":"route","resourceIds":["google-interland"],"lessonCountsByResourceId":{"google-interland":2}}',null);
  if jsonb_array_length(public.teacher_workspace()->'classrooms') <> 1 or jsonb_array_length(public.teacher_workspace()->'paths') <> 1 then raise exception 'FAIL: gravação e leitura do professor'; end if;
  begin
    perform public.save_classroom((c->>'id')::uuid,c,999);
    raise exception 'FAIL: versão antiga aceita';
  exception when serialization_failure then null; end;
  begin
    perform public.save_teaching_path(gen_random_uuid(),'{"name":"Inválida","objective":"Objetivo","backgroundColor":"blue","icon":"route","resourceIds":["material-inexistente"],"lessonCountsByResourceId":{}}',null);
    raise exception 'FAIL: material fora do acervo aceito';
  exception when check_violation then null; end;
end $$;

select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$
begin
  if (select count(*) from public.classrooms) <> 0 or (select count(*) from public.teaching_paths) <> 0 then raise exception 'FAIL: RLS expôs outro professor'; end if;
  if jsonb_array_length(public.teacher_workspace()->'classrooms') <> 0 then raise exception 'FAIL: RPC expôs outro professor'; end if;
  begin
    perform public.save_classroom(current_setting('test.classroom_id')::uuid,'{}',1);
    raise exception 'FAIL: alteração de outro professor aceita';
  exception when insufficient_privilege then null; end;
  begin
    perform public.delete_classroom(current_setting('test.classroom_id')::uuid,1);
    raise exception 'FAIL: exclusão de outro professor aceita';
  exception when insufficient_privilege then null; end;
end $$;

set local role anon;
do $$
begin
  begin perform * from public.classrooms; raise exception 'FAIL: leitura anônima de turmas'; exception when insufficient_privilege then null; end;
  begin perform public.teacher_workspace(); raise exception 'FAIL: área docente anônima'; exception when insufficient_privilege then null; end;
  begin perform public.student_classroom(current_setting('test.classroom_code'),repeat('a',64)); raise exception 'FAIL: RPC pública contornou a Edge Function'; exception when insufficient_privilege then null; end;
end $$;

set local role service_role;
do $$
declare c jsonb;
begin
  c := public.student_classroom(current_setting('test.classroom_code'),repeat('a',64));
  if jsonb_array_length(c->'materials') <> 1 or c->'materials'->0->>'resourceId' <> 'google-interland' or c::text like '%NÃO PUBLICAR%' or c ? 'owner_id' then raise exception 'FAIL: projeção pública'; end if;
  if public.student_classroom('000000',repeat('a',64)) is not null then raise exception 'FAIL: código inexistente'; end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$
declare c jsonb;
begin
  c := public.teacher_workspace()->'classrooms'->0;
  perform public.save_classroom((c->>'id')::uuid,c || '{"archived":true}',1);
end $$;
set local role service_role;
do $$ begin
  if public.student_classroom(current_setting('test.classroom_code'),repeat('a',64)) is not null then raise exception 'FAIL: turma arquivada acessível'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
  begin
    perform public.unarchive_classroom(current_setting('test.classroom_id')::uuid,2);
    raise exception 'FAIL: desarquivamento por outro professor aceito';
  exception when insufficient_privilege then null; end;
end $$;
set local role anon;
do $$ begin
  begin
    perform public.unarchive_classroom(current_setting('test.classroom_id')::uuid,2);
    raise exception 'FAIL: desarquivamento anônimo aceito';
  exception when insufficient_privilege then null; end;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$
declare c jsonb; restored jsonb;
begin
  c := public.teacher_workspace()->'classrooms'->0;
  begin
    perform public.save_classroom((c->>'id')::uuid,c || '{"archived":false}',2);
    raise exception 'FAIL: edição genérica de turma arquivada aceita';
  exception when check_violation then null; end;
  begin
    perform public.unarchive_classroom((c->>'id')::uuid,1);
    raise exception 'FAIL: revisão antiga aceita ao desarquivar';
  exception when serialization_failure then null; end;
  restored := public.unarchive_classroom((c->>'id')::uuid,2);
  if (restored->>'archived')::boolean or (restored->>'revision')::integer <> 3
    or (restored - 'archived' - 'revision') is distinct from (c - 'archived' - 'revision')
    then raise exception 'FAIL: desarquivamento alterou dados preservados'; end if;
  begin
    perform public.unarchive_classroom((c->>'id')::uuid,3);
    raise exception 'FAIL: desarquivamento de turma já ativa aceito';
  exception when check_violation then null; end;
end $$;
set local role service_role;
do $$
declare c jsonb;
begin
  c := public.student_classroom(current_setting('test.classroom_code'),repeat('a',64));
  if c is null or jsonb_array_length(c->'materials') <> 1
    or c->'materials'->0->>'resourceId' <> 'google-interland' or c::text like '%NÃO PUBLICAR%'
    then raise exception 'FAIL: código ou visibilidade não preservados ao desarquivar'; end if;
end $$;
set local role authenticated;
select public.delete_classroom(current_setting('test.classroom_id')::uuid,3);
set local role postgres;
do $$ begin
  if not exists(select 1 from private.classroom_codes where code=current_setting('test.classroom_code') and classroom_id is null) then raise exception 'FAIL: código excluído não foi reservado'; end if;
end $$;
select 'PASS: isolamento, permissões, visibilidade, conflitos, acervo, arquivamento, desarquivamento e exclusão' as result;
rollback;
