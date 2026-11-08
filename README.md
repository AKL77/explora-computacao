<div align="center">
  <img src="public/branding/explora-computacao-symbol.svg" alt="Símbolo do Explora Computação" width="128" />

  # Explora Computação

  **Explore. Planeje. Ensine.**

  Protótipo web para descobrir materiais e montar trilhas de ensino alinhadas à
  BNCC Computação.

  [![Qualidade e GitHub Pages](https://github.com/AKL77/explora-computacao/actions/workflows/quality-and-pages.yml/badge.svg)](https://github.com/AKL77/explora-computacao/actions/workflows/quality-and-pages.yml)
  [![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-0969da?logo=github)](https://akl77.github.io/explora-computacao/)
  [![Licença](https://img.shields.io/badge/licença-direitos%20reservados-6b7280)](LICENSE)
</div>

## Sobre o projeto

O Explora Computação é parte de um Trabalho de Conclusão de Curso. A
plataforma aproxima materiais externos, currículo e condições reais de uso em
sala de aula, oferecendo direcionamento sem substituir a decisão do docente.
O recorte atual abrange do 4º ao 9º ano do Ensino Fundamental.

O trabalho é desenvolvido em colaboração com o NTEM e utiliza IA generativa
fora da aplicação para apoiar a curadoria, a padronização das informações e a
criação das Trilhas Prontas. A plataforma não contém geração por IA nem chama
modelos ou serviços de IA durante seu uso.

Esta entrega tem frontend estático, backend Supabase e **48 materiais**: o jogo educativo
de cyberbullying da ALT+INOVARE, Lightbot, Blockly Games, Compute It, Interland, quatro
materiais didáticos de Rozelma França e as 23 atividades da coleção Computação
Desplugada — Unicamp, quatro atividades do Computacional, IA para os Oceanos,
Crachá — micro:bit, o guia Internet com Responsa — Só para Adolescentes e cinco
materiais aprovados em 28 de outubro: Evolução da Computação, Guardião
Cibernético, As fake news, SplashCode e Segurança Online. Outros quatro cadastros
expositivos foram aprovados: Tecnologia e vida humana, dois episódios do Manual
do Mundo e a playlist oficial Como funciona a Internet?, do NIC.br.

Os cadastros de 28 de outubro mantêm os complementos na mesma ficha e integração
às buscas e propostas das trilhas. Compute It usa comandos em português pelo
endereço `?lang=pt`. Evidências, licenças, limites e correção histórica
do cartaz em [processo-curadoria-2026-10-28.md](docs/processo-curadoria-2026-10-28.md).
A seleção expositiva e a playlist estão documentadas em
[processo-curadoria-expositivos-2026-10-28.md](docs/processo-curadoria-expositivos-2026-10-28.md).

A versão **0.3.0**, de 28 de outubro de 2026, reúne 48 materiais e nove Trilhas
Prontas, com descrições concisas, anos escolares consistentes entre ficha e
busca e filtro corrigido para abordagens combinadas. Mantém a integração do
Microsoft Clarity com escolha de análise de uso.

> Consulte a [demonstração publicada](https://akl77.github.io/explora-computacao/)
> e o [estado atual do protótipo](docs/estado-atual.md).

## Funcionalidades

- página inicial pública com contexto e objetivos do projeto;
- entrada docente com Google via Supabase e demonstração local opcional;
- opção **Manter conectado neste dispositivo** para lembrar o login docente;
- **Buscar Materiais** com pesquisa e filtros por ano, assunto, habilidade da BNCC,
  formato e tipo de material;
- seleção de vários tipos em **Ver opções**, agrupados por abordagem ativa e
  expositiva; materiais com mais de um tipo aparecem uma única vez nos resultados;
- cartões de descoberta com informações pedagógicas concisas;
- imagens para os 48 materiais, com proporções preservadas na busca e nas trilhas;
- retorno à busca preservando a rolagem e os filtros usados;
- níveis de familiaridade para aluno e professor em cada material, explicados
  na página **Sobre**;
- detalhe de cada material com assunto, habilidades da BNCC, descrição, condições de uso,
  fonte e licença;
- **Trilhas Prontas** com filtro por eixo e nove percursos, três para
  cada eixo da BNCC Computação;
- criação de trilhas próprias a partir dos materiais selecionados;
- **Minhas Trilhas** com edição de nome, objetivo, cor e ícone;
- exclusão de trilhas próprias com confirmação, preservando os materiais e as Trilhas Prontas;
- reordenação das etapas, escolha de duração por material e cálculo do tempo
  total;
- proposta de atividade ao abrir cada etapa, com objetivo, materiais, descrição
  do que os estudantes farão, referências curriculares e duração;
- turmas e trilhas salvas online por professor;
- menu **Minha conta** pelo nome/avatar do professor, com identificação, acesso
  a **Privacidade e preferências** e saída; página **Sobre**;
- **Minhas Turmas**, com nome, ano/série, escola opcional, ano letivo e cor;
- código fixo por turma e entrada pública **Acessar turma**, sem login de alunos;
- seleção, ordenação, orientações e visibilidade de materiais por turma, visíveis
  por padrão ao adicionar; atalho **Adicionar à turma** na ficha do material;
- arquivamento e exclusão de turmas, encerrando o acesso pelo código;
- desarquivamento com o mesmo código, materiais, orientações e visibilidade;
- interface responsiva, navegação por teclado e testes de acessibilidade.

Favoritos, pastas pessoais e planos de aula não fazem parte do escopo
atual. Endereços antigos dessas áreas apenas redirecionam para os fluxos atuais.

**Backend:** projeto gratuito em São Paulo, banco e serviço de acesso dos alunos
ativos. Google OAuth configurado para professores, com entrada real validada
localmente. O build publicado no Pages usa essa integração online. Consulte
[configuração e manutenção](docs/backend-supabase.md).
O aluno não recebe uma sessão persistente: reabrir a entrada pede o código novamente.

## Trilhas Prontas

Há nove trilhas, preservando os três percursos iniciais:

- **Pensamento Computacional:** Algoritmos: decisões, blocos e desafios;
- **Mundo Digital:** Mensagens sem erro: paridade e protocolos;
- **Cultura Digital:** Privacidade e armadilhas online.

Os seis novos percursos são:

| Trilha | Ano | Aulas sugeridas |
|---|---|---|
| Programas em ação: ler, testar e corrigir | 6º | 3 |
| Buscar e ordenar com estratégia | 8º | 3 |
| Dados: imagens, textos e compactação | 6º | 3 |
| Internet: o caminho dos dados | 8º | 2 |
| Cyberbullying: reconhecer e agir | 7º | 4 |
| Desinformação: investigar antes de compartilhar | 9º | 3 |

Cada trilha apresenta uma sequência pedagógica sugerida e pode ser adicionada a
**Minhas Trilhas**, onde passa a aceitar os mesmos ajustes das trilhas criadas
pelo docente. O tempo total deriva das aulas de cada etapa e é preservado
na cópia. Os anos e a organização dos novos percursos são curatoriais,
pendentes de validação docente. Critérios em
[curadoria-trilhas-prontas-2026-10-28.md](docs/curadoria-trilhas-prontas-2026-10-28.md).

## Tecnologias

- React 19, TypeScript e Vite;
- React Router e Zustand;
- Supabase Auth, PostgreSQL com RLS e Edge Function para acesso por código;
- CSS Modules, Lucide e fontes locais do Fontsource;
- Vitest, Testing Library, Playwright e axe-core;
- GitHub Actions e GitHub Pages.

## Executar localmente

### Requisitos

- Node.js 22.22.2 ou superior;
- pnpm 11.

```bash
git clone https://github.com/AKL77/explora-computacao.git
cd explora-computacao
pnpm install --frozen-lockfile
pnpm dev
```

Abra [http://127.0.0.1:4173](http://127.0.0.1:4173). Sem `.env.local`, o desenvolvimento
usa demonstração. Para conectar o projeto online, use os valores públicos de
`.env.production` em `.env.local`. **Área do professor** abre a entrada com Google
no modo online, ou a sessão demonstrativa no modo local.
**Acessar turma** abre a página pública de entrada por código, disponível também
em `/#/alunos`, sem criar uma sessão de professor.

### Comandos disponíveis

| Comando | Finalidade |
|---|---|
| `pnpm dev` | servidor local com atualização automática |
| `pnpm build` | checagem de tipos e build otimizado em `dist` |
| `pnpm preview` | prévia local do build de produção |
| `pnpm typecheck` | validação estática do TypeScript |
| `pnpm lint` | análise de padrões de código |
| `pnpm test` | testes unitários e de componentes |
| `pnpm test:watch` | testes durante o desenvolvimento |
| `pnpm test:e2e` | fluxos completos em desktop e mobile |
| `pnpm test:e2e:backend` | integração online com respostas controladas |
| `pnpm backend:catalog` | prepara os IDs do acervo para o banco |

## Rotas atuais

| Rota lógica | Conteúdo |
|---|---|
| `/` | página inicial pública |
| `/privacidade` | informações e preferências de análise de uso, sem login |
| `/entrar` | entrada docente com Google |
| `/alunos` | entrada por código e materiais visíveis da turma, sem login |
| `/app/trilha-de-ensino` | busca e seleção de materiais |
| `/app/materiais/:slug` | detalhe de um material |
| `/app/trilhas-prontas` | trilhas preparadas por eixo |
| `/app/minhas-trilhas` | consulta e edição das trilhas salvas |
| `/app/minhas-turmas` | turmas ativas e arquivadas |
| `/app/minhas-turmas/:classroomId` | materiais, visibilidade e código da turma |
| `/app/perfil` | endereço antigo, redireciona para Buscar Materiais |
| `/app/sobre` | propósito e perguntas frequentes |

No GitHub Pages, as rotas aparecem depois de `#`, por exemplo
`https://akl77.github.io/explora-computacao/#/app/trilhas-prontas`.

## Persistência e privacidade

No modo online, turmas e trilhas ficam vinculadas à conta docente no Supabase,
com isolamento por professor. A sessão usa `sessionStorage` da aba ou, ao marcar
**Manter conectado neste dispositivo**, `localStorage` para lembrar o login.
Sair encerra a sessão e limpa os dados em memória. A demonstração mantém dados apenas no `localStorage` e não
os importa para contas reais. A plataforma não solicita dados de estudantes.

Em produção, o Microsoft Clarity analisa a navegação somente depois de o
visitante aceitar. A escolha pode ser alterada em **Privacidade e preferências**,
acessível pelo rodapé e pelo menu da área docente. A integração usa o projeto
`z4honwtjtg`, mantém negado o consentimento para armazenamento de publicidade
e mascara nomes e objetivos das trilhas nas reconstituições.

O Clarity não é carregado no servidor de desenvolvimento. A variável opcional
`VITE_CLARITY_PROJECT_ID` troca o projeto; definida como vazia, desativa a análise
no build. Consulte a [documentação da integração](docs/integracao-clarity.md).

Os materiais podem direcionar a sites externos, que possuem políticas próprias.

## Documentação

- [Estado atual do protótipo](docs/estado-atual.md)
- [Arquitetura do frontend](docs/arquitetura.md)
- [Backend Supabase: configuração, testes e continuidade](docs/backend-supabase.md)
- [Deploy no GitHub Pages](docs/deploy-github-pages.md)
- [Microsoft Clarity e privacidade](docs/integracao-clarity.md)
- [Créditos e licenças de ativos](docs/creditos-e-licencas.md)
- [Curadoria da coleção Computação Desplugada — Unicamp](docs/processo-curadoria-unicamp.md)
- [Curadoria dos materiais didáticos de Rozelma França](docs/processo-curadoria-rozelma.md)
- [Curadoria da ampliação de outubro de 2026](docs/processo-curadoria-2026-10-26.md)
- [Registro mestre do TCC](docs/registro-mestre-tcc.md)
- [Histórico da especificação](docs/especificacao-plataforma.md)

## Deploy

Pushes para `main` passam por checagem de tipos, lint, testes unitários, build e
testes E2E. Somente após todas as verificações o artefato `dist` é publicado no
GitHub Pages.

## Autoria, ativos e licença

Desenvolvido por **Augusto Lunardi** como protótipo acadêmico. Código e
documentação permanecem com direitos reservados; consulte [LICENSE](LICENSE).
Ativos de terceiros mantêm seus próprios termos, detalhados em
[Créditos e licenças](docs/creditos-e-licencas.md).

O Explora Computação é independente e não possui afiliação ou endosso da
UFSM, MEC, CNE, ALT+INOVARE, Google, Rozelma França ou dos
responsáveis pela BNCC.
