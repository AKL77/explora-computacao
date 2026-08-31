<div align="center">
  <img src="public/branding/informatica-explorer-logo.png" alt="Símbolo do Informática Explorer" width="128" />

  # Informática Explorer

  **Explore. Planeje. Ensine.**

  Protótipo web para organizar recursos e apoiar a criação estruturada de
  planos de aula a partir da BNCC Computação e de conteúdos curados.

  [![Qualidade e GitHub Pages](https://github.com/AKL77/informatica-explorer/actions/workflows/quality-and-pages.yml/badge.svg)](https://github.com/AKL77/informatica-explorer/actions/workflows/quality-and-pages.yml)
  [![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-0969da?logo=github)](https://akl77.github.io/informatica-explorer/)
  [![Licença](https://img.shields.io/badge/licença-direitos%20reservados-6b7280)](LICENSE)
</div>

## Sobre o projeto

O Informática Explorer é parte de um Trabalho de Conclusão de Curso. A proposta
busca aproximar recursos externos, currículo e condições reais de aplicação em
sala de aula, oferecendo direcionamento sem substituir a decisão do docente.
O recorte curricular atual abrange do 4º ao 9º ano do Ensino Fundamental.

Esta entrega é um frontend demonstrativo. O catálogo contém **31 recursos**:
**Cyberbullying — Jogo Educativo**, **Lightbot**, **Blockly Games**, **Interland**,
quatro materiais didáticos de Rozelma França e as 23 atividades da coleção
**Computação Desplugada — Unicamp**. Educação Infantil não faz parte do recorte
atual.

> Consulte a [demonstração publicada](https://akl77.github.io/informatica-explorer/)
> e o [estado exato da versão atual](docs/estado-atual.md).

## Funcionalidades

- landing page pública com contexto e objetivos do projeto;
- entrada demonstrativa direta no Acervo;
- busca e filtros por turma e habilidade;
- cards compactos com título, turma e eixo; habilidade e códigos curriculares ficam no detalhe;
- detalhe do recurso organizado em três abas, com materiais, fonte e licença;
- alinhamentos explícitos por ano, eixo, habilidade e competências relacionadas;
- miniaturas otimizadas e diálogos carregados sob demanda para manter o Acervo leve;
- favoritos pelo botão de coração;
- criação e manutenção de pastas em **Meus Materiais**;
- busca e filtros recolhíveis dentro de Favoritos e pastas;
- página **Sobre** com explicações e FAQ;
- criação estruturada de uma proposta para uma, duas ou três aulas de 50 minutos;
- seleção explícita de materiais do Acervo alinhados ao ano e à habilidade;
- visualizações **Em Blocos** e **Descritivo** do mesmo plano;
- salvamento, pesquisa, edição e download de planos em PDF;
- persistência local da sessão, favoritos, pastas e planos, com interface responsiva e acessível.

**Meu perfil** e **Minhas Turmas** são exibidos como itens inativos nesta versão.

## Criação de planos

O fluxo de **Criar Plano de Aula** possui uma tela própria para compor, sem IA,
uma única proposta de uma, duas ou três aulas de 50 minutos. O docente informa
tema, ano escolar e habilidade, seleciona um material alinhado do Acervo, define
o objetivo, escolhe entre os tipos de metodologia — expositiva dialogada,
ativa/prática ou combinada — e pode incluir avaliação.

O Acervo continua sendo uma área de navegação independente. No criador, ano e
habilidade filtram todos os materiais com alinhamento curricular e link seguro;
metadados pedagógicos ausentes não ocultam os novos recursos. Quando o material
possui um objetivo de aprendizagem cadastrado, ele aparece como sugestão editável
com sua origem identificada; caso contrário, o objetivo começa vazio.

Metodologia e avaliação usam temporariamente textos distintos de lorem ipsum
enquanto seus modelos pedagógicos são discutidos. O mesmo registro alimenta a
visualização **Em Blocos**, com composição gráfica de documento pedagógico, e a
visualização **Descritivo**, organizada por aula. Um material selecionado pode
sustentar uma, duas ou três aulas; a avaliação opcional ocupa dez minutos da
última aula.

Planos podem ser salvos no navegador, pesquisados pelo tema, reabertos para
edição e baixados como PDF A4. O PDF é gerado localmente e não envia dados a um
servidor.

Metadados ausentes aparecem como não informados. Proposta de aplicação e
sugestão de avaliação permanecem internas quando existem. O processo usado
para converter a indicação ampla da Unicamp em anos e correspondências da BNCC
está em
[`docs/processo-curadoria-unicamp.md`](docs/processo-curadoria-unicamp.md); o
processo aplicado à coleção de Rozelma está em
[`docs/processo-curadoria-rozelma.md`](docs/processo-curadoria-rozelma.md); o
estado implementado permanece em [`docs/estado-atual.md`](docs/estado-atual.md).

## Fora do escopo atual

- backend, API e banco de dados;
- login Google ou qualquer autenticação real;
- inteligência artificial no recorte atual de planos; uma investigação futura exige especificação própria;
- inclusão de recursos por usuários;
- contas ou dados de estudantes;
- sincronização entre dispositivos ou compartilhamento remoto dos planos;
- analytics e cookies de rastreamento.
## Tecnologias

- React 19, TypeScript e Vite;
- React Router e Zustand;
- CSS Modules, Lucide e fontes locais do Fontsource;
- Vitest, Testing Library, Playwright e axe-core;
- GitHub Actions e GitHub Pages.

## Executar localmente

### Requisitos

- Node.js 22.22.2 ou superior;
- pnpm 11.

```bash
git clone https://github.com/AKL77/informatica-explorer.git
cd informatica-explorer
pnpm install --frozen-lockfile
pnpm dev
```

Abra [http://127.0.0.1:4173](http://127.0.0.1:4173). O botão **Entrar** cria
somente uma sessão local de demonstração e leva diretamente ao Acervo.

### Comandos disponíveis

| Comando | Finalidade |
|---|---|
| `pnpm dev` | servidor local com atualização automática |
| `pnpm build` | typecheck e build otimizado em `dist` |
| `pnpm preview` | prévia local do build de produção |
| `pnpm typecheck` | validação estática do TypeScript |
| `pnpm lint` | análise de padrões de código |
| `pnpm test` | testes unitários e de componentes |
| `pnpm test:watch` | testes durante o desenvolvimento |
| `pnpm test:e2e` | fluxos completos em desktop e mobile |

Na primeira execução do E2E, instale o navegador:

```bash
pnpm exec playwright install chromium
```

## Rotas

| Rota lógica | Conteúdo |
|---|---|
| `/` | landing page pública |
| `/app/acervo` | Acervo, busca e filtros |
| `/app/acervo/:slug` | detalhe de um recurso |
| `/app/pastas` | Favoritos e pastas pessoais |
| `/app/pastas/:folderId` | conteúdo de uma pasta |
| `/app/planos` | planos salvos, busca, edição e download |
| `/app/planos/:planId/editar` | edição de um plano salvo |
| `/app/plano-de-aula` | criação e visualização de uma proposta de plano |
| `/app/sobre` | propósito, organização de materiais e FAQ |

No GitHub Pages, essas rotas aparecem após `#`, por exemplo
`https://akl77.github.io/informatica-explorer/#/app/acervo`. O hash permite
recarregar links internos com segurança em uma hospedagem estática.

## Persistência e privacidade

A sessão demonstrativa, favoritos e pastas ficam no `localStorage` do próprio
navegador, nas chaves `informatica-explorer:session:v1` e
`informatica-explorer:library:v1`. Limpar os dados do site reinicia o
protótipo. Nenhuma credencial, informação pessoal ou dado de estudante é
coletado pelo Informática Explorer.

Os links do Acervo levam a sites externos, que possuem políticas próprias.

## Estrutura do repositório

```text
.
├── .github/workflows/       # verificação e deploy automático
├── config/                  # configurações das ferramentas
├── docs/                    # produto, TCC, arquitetura e créditos
├── public/                  # imagens e identidade distribuídas
├── src/                     # aplicação React organizada por features
├── tests/e2e/               # fluxos completos no Playwright
├── README.md                # visão geral e instruções
└── package.json             # scripts e dependências
```

A visão das camadas e as decisões técnicas estão em
[`docs/arquitetura.md`](docs/arquitetura.md).

> A pasta `.github` contém somente o workflow exigido pelo GitHub para validar
> e publicar a plataforma automaticamente no Pages.

## Documentação

- [Estado atual do protótipo](docs/estado-atual.md)
- [Especificação funcional e de interface](docs/especificacao-plataforma.md)
- [Histórico do plano de implementação](docs/historico/plano-implementacao.md)
- [Arquitetura do frontend](docs/arquitetura.md)
- [Deploy no GitHub Pages](docs/deploy-github-pages.md)
- [Créditos e licenças de ativos](docs/creditos-e-licencas.md)
- [Curadoria da coleção Computação Desplugada — Unicamp](docs/processo-curadoria-unicamp.md)
- [Curadoria dos materiais didáticos de Rozelma França](docs/processo-curadoria-rozelma.md)
- [Registro mestre do TCC](docs/registro-mestre-tcc.md)

## Deploy

Pushes para `main` passam por typecheck, lint, testes unitários, build e testes
E2E. Somente após todas as verificações o artefato `dist` é publicado no
GitHub Pages. Pull requests executam as mesmas verificações, sem deploy.

O processo e a simulação local estão documentados em
[`docs/deploy-github-pages.md`](docs/deploy-github-pages.md).

## Autoria, ativos e licença

Desenvolvido por **Augusto Lunardi** como protótipo acadêmico. Código e
documentação permanecem com direitos reservados; consulte [`LICENSE`](LICENSE).
Ativos de terceiros mantêm seus próprios termos e são detalhados em
[`docs/creditos-e-licencas.md`](docs/creditos-e-licencas.md).

Informática Explorer é independente e não possui afiliação ou endosso da
Microsoft, UFSM, MEC, CNE, ALT+INOVARE, Google, Rozelma França ou dos
responsáveis pela BNCC.
