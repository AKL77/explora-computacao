# Deploy no GitHub Pages

O deploy é automatizado pelo workflow
`.github/workflows/quality-and-pages.yml`. Todo push válido para `main` executa
as verificações e, se todas passarem, publica o conteúdo de `dist`.

## Pipeline

1. checkout do commit;
2. instalação reproduzível com Node e pnpm fixados;
3. typecheck, lint e testes unitários;
4. build com `VITE_BASE_PATH=/<repositorio>/`;
5. testes E2E contra o build de produção no mesmo subdiretório;
6. empacotamento exclusivo de `dist`;
7. deploy no ambiente protegido `github-pages`.

Pull requests executam as verificações, mas não publicam.

## Configuração inicial no GitHub

Em **Settings → Pages → Build and deployment**, a origem deve ser **GitHub
Actions**. O ambiente `github-pages` e a URL são associados automaticamente ao
primeiro deploy bem-sucedido.

## Simular o Pages localmente

PowerShell:

```powershell
$env:VITE_BASE_PATH='/informatica-explorer/'
$env:PLAYWRIGHT_BASE_PATH='/informatica-explorer/'
$env:PLAYWRIGHT_USE_PREVIEW='true'
pnpm build
pnpm test:e2e
Remove-Item Env:VITE_BASE_PATH, Env:PLAYWRIGHT_BASE_PATH, Env:PLAYWRIGHT_USE_PREVIEW
```

Bash:

```bash
VITE_BASE_PATH=/informatica-explorer/ pnpm build
VITE_BASE_PATH=/informatica-explorer/ \
PLAYWRIGHT_BASE_PATH=/informatica-explorer/ \
PLAYWRIGHT_USE_PREVIEW=true pnpm test:e2e
```

## Por que as URLs contêm `#`

O Pages entrega arquivos estáticos e não redireciona automaticamente uma rota
como `/app/trilhas-prontas` para `index.html`. A URL
`/informatica-explorer/#/app/trilhas-prontas` preserva o roteamento no navegador e
permite atualizar ou compartilhar telas internas sem receber 404.

## Diagnóstico

- **Tela sem estilos/imagens:** confirme que `VITE_BASE_PATH` começa e termina
  com `/` e corresponde ao nome do repositório.
- **Workflow falha em Pages:** confirme a origem **GitHub Actions** nas
  configurações do repositório.
- **Teste E2E não encontra o site:** gere `dist` antes de usar
  `PLAYWRIGHT_USE_PREVIEW=true`.
- **Deploy antigo permanece visível:** consulte a execução mais recente em
  **Actions** e o ambiente `github-pages`.
