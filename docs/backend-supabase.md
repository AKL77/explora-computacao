# Backend Supabase

Implementação de 2 de novembro de 2026. O catálogo e as Trilhas Prontas continuam
no projeto. Apenas contas docentes, turmas e trilhas pessoais usam o Supabase.
Não há importação de dados da demonstração nem contas de estudantes.

## Projeto provisionado

- Nome: Explora Computação; plano Free; região São Paulo (`sa-east-1`).
- Referência: `cxxerjudbcbcpglzllrz`.
- [Painel](https://supabase.com/dashboard/project/cxxerjudbcbcpglzllrz).
- Migrações `teacher_workspace` e `catalog_resource_ids` aplicadas.
- Edge Function `student-classroom` publicada e respondendo.
- Google OAuth habilitado, com retorno para o site e `http://127.0.0.1:4173/`.
- Projeto Google `Explora Computacao`, ID `psyched-oxide-513519-s0`, criado sem
  ativar faturamento. Aplicativo externo **Em produção**, autorizado pelo autor.
- Entrada real com a conta do autor validada no desenvolvimento local. Após
  cada publicação, conferir a entrada no Pages conforme o roteiro abaixo.

## Configuração do site

`.env.production` contém apenas a URL e a chave **publishable**, públicas por
definição. O build de produção usa esse projeto. Segredos `service_role`,
`sb_secret_` e Client Secret do Google nunca podem ir para arquivos `VITE_*`,
para o Git, para o frontend entregue aos visitantes ou para logs da aplicação.

Para desenvolvimento online, copiar os mesmos valores de `.env.production`
para `.env.local` e executar `pnpm dev`. Para demonstração isolada, definir
`VITE_APP_MODE=demo` em `.env.local`. Sem configuração no desenvolvimento, o
modo é demonstrativo. Configuração online incompleta bloqueia o acesso; nunca
simula uma gravação bem-sucedida usando dados locais.

Os testes unitários e E2E antigos usam demonstração explicitamente. O workflow
compila uma demonstração para esses testes, testa a integração online com
respostas controladas e só então recompila a versão online para publicação.
A publicação do frontend usa o workflow `quality-and-pages.yml`, acionado por
push em `main`. Acompanhar a conclusão antes de considerar a versão disponível.

## Ativar entrada com Google

1. No Google Cloud, criar ou escolher um projeto do autor. Configurar a tela de
   consentimento com nome **Explora Computação**, público externo e contato do
   responsável. Solicitar apenas os dados básicos de entrada (`openid`, e-mail
   e perfil); não solicitar acesso a Drive, Gmail ou outros serviços.
2. Criar um cliente OAuth de tipo **Aplicativo da Web**. Cadastrar as origens
   `https://akl77.github.io` e `http://127.0.0.1:4173`, e o retorno autorizado:
   `https://cxxerjudbcbcpglzllrz.supabase.co/auth/v1/callback`.
3. No Supabase, **Authentication → Sign In / Providers → Google**, habilitar e
   preencher Client ID e Client Secret. Manter as verificações de nonce e a
   exigência de e-mail ativadas (não ativar as opções que as ignoram).
4. Em **Authentication → URL Configuration**, usar Site URL
   `https://akl77.github.io/explora-computacao/` e permitir exatamente esse
   endereço e `http://127.0.0.1:4173/` em Redirect URLs. Os retornos não usam `#`:
   o site troca o código PKCE e encaminha à área docente.
5. Manter cadastro de novos usuários permitido e entrada anônima desativada.
   O Google cria a conta docente no primeiro acesso. Não é necessário SMTP.
6. Enquanto o aplicativo Google estiver em teste, cadastrar os avaliadores como
   usuários de teste. Conferir no painel Google a disponibilização para o público
   externo antes de divulgar a professores em geral.
7. Testar no endereço publicado: entrar com Google, criar turma e trilha, sair,
   entrar novamente e verificar os registros. Em outro navegador sem conta,
   acessar `/#/alunos` e usar o código. Confirmar ocultação e arquivamento.

Referências oficiais: [Google no Supabase](https://supabase.com/docs/guides/auth/social-login/auth-google)
e [URLs de retorno](https://supabase.com/docs/guides/auth/redirect-urls).

## Dados e permissões

- `public.classrooms`: metadados, código, lista ordenada de materiais, orientação,
  visibilidade, revisão e dono. RLS permite leitura só pelo dono autenticado.
- `public.teaching_paths`: dados das trilhas, revisão e dono; mesma proteção.
- `public.catalog_resource_ids`: somente IDs permitidos do acervo. Sem leitura
  pública nem gravação docente. Não duplica textos, imagens ou URLs do catálogo.
- `private.classroom_codes`: reserva permanente dos códigos, inclusive depois de
  excluir uma turma. Alterar ou arquivar não troca o código.
- `private.student_access_limits`: contagem por minuto por hash do endereço de
  rede com segredo do servidor. Limite de 600 consultas por minuto por origem
  para comportar laboratórios compartilhando uma conexão. Limpeza periódica de
  contadores com mais de um dia, acionada pelas consultas.

Não existem permissões diretas de escrita para `anon` ou `authenticated`.
As funções de professor exigem `auth.uid()`, verificam o dono e a revisão e
usam `search_path=''`. Um conflito de revisão preserva o dado confirmado e pede
atualização. A interface só anuncia sucesso após confirmação do banco.

O aluno chama apenas a Edge Function, com a chave pública e o código no corpo.
Não cria sessão Supabase, não usa autenticação anônima e não consulta tabelas.
A função usa a credencial de serviço somente no servidor. A consulta pública
projeta os campos permitidos e remove materiais ocultos **no banco**, sem
enviá-los ao navegador. Turma arquivada ou excluída retorna indisponibilidade.
Quem sabe o código pode consultar os dados públicos da turma: não incluir dados
pessoais de alunos em nomes e orientações.

A sessão docente usa `sessionStorage` da aba. Sair limpa sessão e dados em
memória. Dados locais antigos são ignorados no modo online. A seleção do aluno
existe só em memória, sem código na URL ou no armazenamento. A página consulta
atualizações a cada 20 segundos enquanto visível e ao recuperar foco; ocultações
e arquivamentos passam a valer na próxima consulta.

## Atualizar ou recriar

O histórico reproduzível está em `supabase/migrations/`, o registro inicial do
acervo em `supabase/seed.sql` e o código público em `supabase/functions/`.
Para outro projeto, aplicar as migrações em ordem, executar o seed e publicar
`student-classroom` com `verify_jwt=false`. A função valida a chave publishable
por conta própria e usa as variáveis automáticas do Supabase; não recebe segredo
pelo cliente. Depois atualizar a configuração pública e os retornos Google.

Ao cadastrar material novo no código:

1. Executar `pnpm backend:catalog`.
2. Aplicar o SQL de `supabase/seed.sql` ao projeto. Ele apenas acrescenta IDs,
   preservando referências antigas e todos os dados docentes.
3. Publicar o frontend atualizado pelo fluxo habitual.

## Verificação

- `pnpm typecheck`, `pnpm lint`, `pnpm test` e `pnpm build`.
  Verificações realizadas: 116 testes unitários, 50 E2E no build de produção
  demonstrativo e quatro E2E da integração online com respostas controladas.
- `pnpm test:e2e`: fluxos demonstrativos em desktop e celular.
- `pnpm test:e2e:backend`: gravações confirmadas, falha do servidor e acesso em
  navegadores separados, usando respostas controladas sem depender do Google.
- `supabase/tests/workspace_security.sql`: teste transacional executado no
  projeto real, com dois professores, RLS, conflito, IDs inválidos, leitura
  anônima bloqueada, projeção pública, arquivamento e reserva de código. Usa
  `ROLLBACK`, sem deixar contas ou turmas de teste.
- Verificação real com Google: o autor entrou, a interface criou uma turma,
  adicionou Interland e recarregou os dados do banco. A consulta pública sem
  autenticação retornou o material (200), retirou-o após ocultar (200, lista
  vazia) e encerrou o acesso após arquivar (404). Uma Trilha Pronta também foi
  copiada para a conta e recuperada após recarregar. A turma e a cópia temporárias
  foram removidas ao concluir; a conta docente real foi preservada.

Os avisos do Advisor sobre funções `SECURITY DEFINER` autenticadas são esperados:
são os únicos pontos de escrita e validam o dono explicitamente. A tabela de
IDs não tem política de leitura porque não deve estar acessível aos visitantes.
Esses avisos não foram silenciados nem solucionados abrindo permissões.

## Continuidade e defesa

O Free pode ser pausado pelo Supabase se houver pouca atividade durante sete
dias. Não há garantia de disponibilidade contínua nesse plano. Antes da defesa,
conferir o painel e testar entrada, gravação e acesso público com antecedência;
restaurar manualmente se estiver pausado. A implementação não adiciona tarefas
artificiais para impedir a pausa, assinaturas pagas ou um servidor para manter.
Referência: [pausa de projetos Free](https://supabase.com/docs/guides/platform/free-project-pausing).

Manter acesso à conta proprietária, conferir avisos enviados pelo provedor e
exportar o banco antes de alterações relevantes. Cópias de segurança dos dados
reais são responsabilidade do responsável pelo projeto; migrações e seed
reconstroem a estrutura e o acervo de IDs, não os registros dos professores.
