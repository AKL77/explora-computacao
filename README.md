<div align="center">
  <img src="public/branding/informatica-explorer-logo.png" alt="Símbolo do Informática Explorer" width="128" />

  # Informática Explorer

  **Explore. Planeje. Ensine.**

  Protótipo web para organizar recursos e facilitar a criação de planos de
  aula contextualizados a partir da BNCC Computação e da realidade de cada
  turma.

  [![Qualidade e GitHub Pages](https://github.com/AKL77/informatica-explorer/actions/workflows/quality-and-pages.yml/badge.svg)](https://github.com/AKL77/informatica-explorer/actions/workflows/quality-and-pages.yml)
  [![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-0969da?logo=github)](https://akl77.github.io/informatica-explorer/)
  [![Licença](https://img.shields.io/badge/licença-direitos%20reservados-6b7280)](LICENSE)
</div>

## Sobre o projeto

O Informática Explorer é parte de um Trabalho de Conclusão de Curso. A proposta
busca aproximar recursos externos, currículo e condições reais de aplicação em
sala de aula, oferecendo direcionamento sem substituir a decisão do docente.

Esta entrega é um frontend demonstrativo. O catálogo começa com um único
recurso — **Cyberbullying — Jogo Educativo** — e foi estruturado para receber
novos conteúdos e um backend em etapas posteriores.

> Consulte a [demonstração publicada](https://akl77.github.io/informatica-explorer/)
> e o [estado exato da versão atual](docs/estado-atual.md).

## Funcionalidades

- landing page pública com contexto e objetivos do projeto;
- entrada demonstrativa direta no Acervo;
- busca e filtros por turma e habilidade;
- cards compactos com dados curriculares essenciais;
- detalhe do recurso organizado em três abas;
- favoritos pelo botão de coração;
- criação e manutenção de pastas em **Meus Materiais**;
- busca e filtros recolhíveis dentro de Favoritos e pastas;
- página **Sobre** com explicações e FAQ;
- persistência local e interface responsiva e acessível.

**Meu perfil**, **Minhas Turmas**, **Meus Planos de Aula** e **Criar Plano de
Aula** são exibidos como itens inativos nesta versão.

## Fora do escopo atual

- backend, API e banco de dados;
- login Google ou qualquer autenticação real;
- geração de conteúdo por inteligência artificial;
- inclusão de recursos por usuários;
- contas ou dados de estudantes;
- sincronização entre dispositivos;
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
├── .github/                 # CI, deploy, Dependabot e templates
├── docs/                    # produto, arquitetura, decisões e créditos
├── e2e/                     # testes Playwright
├── public/                  # imagens e identidade distribuídas
├── src/                     # aplicação React organizada por features
├── CONTRIBUTING.md          # fluxo e convenções de contribuição
├── SECURITY.md              # canal e escopo de segurança
└── registro_mestre_tcc.md   # registro acadêmico principal
```

A visão das camadas e as decisões técnicas estão em
[`docs/arquitetura.md`](docs/arquitetura.md).

## Documentação

- [Estado atual do protótipo](docs/estado-atual.md)
- [Especificação funcional e de interface](docs/especificacao-plataforma.md)
- [Plano e decisões de implementação](docs/plano-implementacao.md)
- [Arquitetura do frontend](docs/arquitetura.md)
- [Deploy no GitHub Pages](docs/deploy-github-pages.md)
- [Créditos e licenças de ativos](docs/creditos-e-licencas.md)
- [Registro mestre do TCC](registro_mestre_tcc.md)
- [Como contribuir](CONTRIBUTING.md)
- [Política de segurança](SECURITY.md)

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
Microsoft, UFSM, MEC, CNE, ALT+INOVARE ou dos responsáveis pela BNCC.
