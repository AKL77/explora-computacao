# Como contribuir

O Informática Explorer é um protótipo acadêmico em desenvolvimento. Sugestões
são bem-vindas, mas a incorporação de mudanças depende da aderência ao escopo
do TCC e da revisão do responsável pelo projeto.

## Antes de começar

1. Consulte o [estado atual](docs/estado-atual.md), a
   [especificação](docs/especificacao-plataforma.md) e as
   [decisões de implementação](docs/plano-implementacao.md).
2. Para bugs e propostas pequenas, abra uma issue antes de preparar uma
   alteração extensa.
3. Não inclua dados pessoais, credenciais, materiais de estudantes ou ativos
   sem licença e atribuição verificáveis.

## Ambiente local

Requisitos: Node.js 22.22.2 ou superior e pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Antes de enviar uma alteração, execute:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Na primeira execução dos testes de interface, instale o Chromium com
`pnpm exec playwright install chromium`.

## Convenções

- Use TypeScript estrito e componentes funcionais.
- Preserve navegação por teclado, foco visível e semântica acessível.
- Textos da interface devem estar em português do Brasil.
- Dados de recursos pertencem à camada local de catálogo e devem sempre
  registrar fonte, licença e situação de validação.
- Commits devem ser pequenos, objetivos e escritos no imperativo.
- Pull requests devem explicar objetivo, impacto visual, testes executados e
  qualquer decisão que altere o escopo acadêmico.

## Ativos e direitos autorais

Não adicione capturas, marcas, imagens ou textos extensos de terceiros sem
permissão clara. Registre todo ativo aceito em
[`docs/creditos-e-licencas.md`](docs/creditos-e-licencas.md).
