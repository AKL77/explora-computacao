-- Testes locais transacionais: as cópias nunca consultam a trilha original no acesso público.
begin;
insert into auth.users(id) values ('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$
declare c jsonb; p jsonb; other_path jsonb; original_copy jsonb;
begin
  c := public.save_classroom(null,'{"name":"Turma das trilhas","grade":6,"school":"","schoolYear":2026,"color":"blue","materials":[]}',null);
  p := public.save_teaching_path(gen_random_uuid(),'{"name":"Algoritmos","objective":"SEGREDO_DOCENTE","backgroundColor":"amber","icon":"puzzle","resourceIds":["lightbot-web","toxicode-compute-it"],"lessonCountsByResourceId":{"lightbot-web":2}}',null);
  perform set_config('test.classroom_id',c->>'id',true);
  perform set_config('test.classroom_code',c->>'code',true);
  perform set_config('test.path_id',p->>'id',true);
  c := public.change_classroom_teaching_path((c->>'id')::uuid,(p->>'id')::uuid,1,'share',1);
  if jsonb_array_length(c->'sharedPaths') <> 1 or c->'sharedPaths'->0->>'icon' <> 'puzzle' or c->'sharedPaths'->0->'resourceIds' <> p->'resourceIds' then raise exception 'FAIL: snapshot'; end if;
  original_copy := c->'sharedPaths';
  c := public.change_classroom_teaching_path((c->>'id')::uuid,(p->>'id')::uuid,2,'share',1);
  if (c->>'revision')::integer <> 2 or c->'sharedPaths' <> original_copy then raise exception 'FAIL: compartilhamento duplicado'; end if;
  p := public.save_teaching_path((p->>'id')::uuid,p || '{"name":"Algoritmos revisados","resourceIds":["toxicode-compute-it","lightbot-web"]}',1);
  c := public.teacher_workspace()->'classrooms'->0;
  if c->'sharedPaths' <> original_copy then raise exception 'FAIL: edição da original alterou a cópia'; end if;
  begin
    perform public.change_classroom_teaching_path((c->>'id')::uuid,(p->>'id')::uuid,1,'update',2);
    raise exception 'FAIL: revisão antiga da turma aceita';
  exception when serialization_failure then null; end;
  begin
    perform public.change_classroom_teaching_path((c->>'id')::uuid,(p->>'id')::uuid,2,'update',1);
    raise exception 'FAIL: revisão antiga da trilha aceita';
  exception when serialization_failure then null; end;
  c := public.change_classroom_teaching_path((c->>'id')::uuid,(p->>'id')::uuid,2,'visibility',null,false);
  c := public.change_classroom_teaching_path((c->>'id')::uuid,(p->>'id')::uuid,3,'update',2);
  if c->'sharedPaths'->0->>'name' <> 'Algoritmos revisados' or c->'sharedPaths'->0->'visible' <> 'false'::jsonb or c->'sharedPaths'->0->>'sharedAt' <> original_copy->0->>'sharedAt' then raise exception 'FAIL: atualização de cópia'; end if;
  original_copy := c->'sharedPaths';
  c := public.save_classroom((c->>'id')::uuid,c || '{"name":"Turma renomeada","sharedPaths":[]}',4);
  if c->'sharedPaths' <> original_copy then raise exception 'FAIL: gravação genérica alterou cópias'; end if;
  other_path := public.save_teaching_path(gen_random_uuid(),'{"name":"Cidadania","objective":"Objetivo docente","backgroundColor":"blue","icon":"route","resourceIds":["google-interland"],"lessonCountsByResourceId":{}}',null);
  perform set_config('test.second_path_id',other_path->>'id',true);
  c := public.change_classroom_teaching_path((c->>'id')::uuid,(other_path->>'id')::uuid,5,'share',1);
  c := public.change_classroom_teaching_path((c->>'id')::uuid,(other_path->>'id')::uuid,6,'move',null,null,-1);
  if c->'sharedPaths'->0->>'id' <> other_path->>'id' then raise exception 'FAIL: ordem das trilhas'; end if;
  perform set_config('test.classroom_revision',c->>'revision',true);
end $$;

-- O segundo professor não pode alterar a turma do primeiro nem copiar sua trilha.
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$
declare c jsonb; p jsonb;
begin
  c := public.save_classroom(null,'{"name":"Outra turma","grade":6,"school":"","schoolYear":2026,"color":"blue","materials":[]}',null);
  p := public.save_teaching_path(gen_random_uuid(),'{"name":"Outra trilha","objective":"Outro dono","backgroundColor":"blue","icon":"route","resourceIds":["google-interland"],"lessonCountsByResourceId":{}}',null);
  perform set_config('test.foreign_path_id',p->>'id',true);
  begin
    perform public.change_classroom_teaching_path(current_setting('test.classroom_id')::uuid,(p->>'id')::uuid,current_setting('test.classroom_revision')::integer,'share',1);
    raise exception 'FAIL: turma de outro professor';
  exception when insufficient_privilege then null; end;
  begin
    perform public.change_classroom_teaching_path((c->>'id')::uuid,current_setting('test.path_id')::uuid,1,'share',2);
    raise exception 'FAIL: trilha de outro professor';
  exception when insufficient_privilege then null; end;
end $$;

set local role service_role;
do $$
declare c jsonb;
begin
  c := public.student_classroom(current_setting('test.classroom_code'),repeat('a',64));
  if jsonb_array_length(c->'sharedPaths') <> 1 or c::text like '%toxicode-compute-it%' or c::text like '%SEGREDO_DOCENTE%' or c ? 'revision' or c->'sharedPaths'->0 ? 'sourceRevision' or c->'sharedPaths'->0 ? 'objective' then raise exception 'FAIL: projeção pública e ocultação'; end if;
end $$;
set local role anon;
do $$ begin
  begin
    perform public.change_classroom_teaching_path(current_setting('test.classroom_id')::uuid,current_setting('test.path_id')::uuid,7,'remove');
    raise exception 'FAIL: RPC anônima';
  exception when insufficient_privilege then null; end;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$
declare c jsonb;
begin
  begin
    perform public.change_classroom_teaching_path(current_setting('test.classroom_id')::uuid,current_setting('test.foreign_path_id')::uuid,7,'share',1);
    raise exception 'FAIL: cópia de trilha alheia';
  exception when insufficient_privilege then null; end;
  c := public.change_classroom_teaching_path(current_setting('test.classroom_id')::uuid,current_setting('test.path_id')::uuid,7,'visibility',null,true);
  perform public.delete_teaching_path(current_setting('test.path_id')::uuid,2);
  c := public.save_classroom((c->>'id')::uuid,c || '{"archived":true}',8);
  begin
    perform public.change_classroom_teaching_path((c->>'id')::uuid,current_setting('test.second_path_id')::uuid,9,'remove');
    raise exception 'FAIL: turma arquivada aceita alteração';
  exception when check_violation then null; end;
  c := public.unarchive_classroom((c->>'id')::uuid,9);
  if jsonb_array_length(c->'sharedPaths') <> 2 then raise exception 'FAIL: cópias após desarquivar'; end if;
  perform set_config('test.classroom_revision',c->>'revision',true);
end $$;
set local role service_role;
do $$
declare c jsonb;
begin
  c := public.student_classroom(current_setting('test.classroom_code'),repeat('b',64));
  if jsonb_array_length(c->'sharedPaths') <> 2 or c->'sharedPaths'->1->'resourceIds' <> '["toxicode-compute-it","lightbot-web"]'::jsonb or c::text like '%SEGREDO_DOCENTE%' then raise exception 'FAIL: cópia após excluir original e reabrir turma'; end if;
end $$;
set local role authenticated;
do $$
declare c jsonb;
begin
  c := public.change_classroom_teaching_path(current_setting('test.classroom_id')::uuid,current_setting('test.path_id')::uuid,current_setting('test.classroom_revision')::integer,'remove');
  if jsonb_array_length(c->'sharedPaths') <> 1 or jsonb_array_length(public.teacher_workspace()->'paths') <> 1 then raise exception 'FAIL: remoção de cópia afetou original'; end if;
end $$;
reset role;
select 'PASS: snapshots, revisões, donos, visibilidade, projeção, ordem, exclusão e arquivamento' as result;
rollback;
