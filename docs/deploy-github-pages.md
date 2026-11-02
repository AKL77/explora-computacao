# Deploy no GitHub Pages

O deploy é automatizado pelo workflow
`.github/workflows/quality-and-pages.yml`. Todo push válido para `main` executa
as verificações e, se todas passarem, publica o conteúdo de `dist`.

## Pipeline

1. checkout do commit;
2. instalação reproduzível com Node e pnpm fixados;
3. typecheck, lint e testes unitários;
4. build demonstrativo com `VITE_BASE_PATH=/<repositorio>/`;
5. testes E2E contra esse build no mesmo subdiretório e testes da integração online;
6. novo build online, usando a configuração pública de `.env.production`;
7. empacotamento exclusivo de `dist` e deploy no ambiente protegido `github-pages`.

Pull requests executam as verificações, mas não publicam.

## Configuração inicial no GitHub

Em **Settings → Pages → Build and deployment**, a origem deve ser **GitHub
Actions**. O ambiente `github-pages` e a URL são associados automaticamente ao
primeiro deploy bem-sucedido.

## Simular o Pages localmente

PowerShell:

```powershell
$env:VITE_BASE_PATH='/explora-computacao/'
$env:PLAYWRIGHT_BASE_PATH='/explora-computacao/'
$env:PLAYWRIGHT_USE_PREVIEW='true'
$env:VITE_APP_MODE='demo'
pnpm build
pnpm test:e2e
Remove-Item Env:VITE_BASE_PATH, Env:PLAYWRIGHT_BASE_PATH, Env:PLAYWRIGHT_USE_PREVIEW, Env:VITE_APP_MODE
```

Bash:

```bash
VITE_BASE_PATH=/explora-computacao/ VITE_APP_MODE=demo pnpm build
VITE_BASE_PATH=/explora-computacao/ \
PLAYWRIGHT_BASE_PATH=/explora-computacao/ \
PLAYWRIGHT_USE_PREVIEW=true pnpm test:e2e
```

## Por que as URLs contêm `#`

O Pages entrega arquivos estáticos e não redireciona automaticamente uma rota
como `/app/trilhas-prontas` para `index.html`. A URL
`/explora-computacao/#/app/trilhas-prontas` preserva o roteamento no navegador e
permite atualizar ou compartilhar telas internas sem receber 404.

## Microsoft Clarity

O build já usa o ID público `z4honwtjtg` por padrão. Não é necessário cadastrar
segredo ou variável no GitHub para ativar esse projeto. Após a publicação, o
rastreador só carrega quando o visitante aceita a análise. O servidor de
desenvolvimento não o carrega.

Para trocar o projeto, defina `VITE_CLARITY_PROJECT_ID` no ambiente do build.
Defina a variável como vazia para gerar um build sem análise. O arquivo
`.env.example` documenta a opção; nenhum dado de acesso ao painel é necessário.

Os testes de análise interceptam as solicitações ao Clarity e usam respostas
locais, sem enviar sessões de teste à Microsoft. As verificações finais no
painel e no site publicado estão em `integracao-clarity.md`.

## Supabase e Google

O build final usa o projeto gratuito configurado em `.env.production`. A chave
publishable é pública; não são necessários segredos do banco no GitHub Pages.
O Google precisa permitir o retorno exato à raiz do site publicado, antes do
fragmento `#`. A configuração e o teste real de entrada estão em
[backend-supabase.md](backend-supabase.md). Publicar o frontend não substitui a
ativação do Google no painel.

## Diagnóstico

- **Tela sem estilos/imagens:** confirme que `VITE_BASE_PATH` começa e termina
  com `/` e corresponde ao nome do repositório.
- **Workflow falha em Pages:** confirme a origem **GitHub Actions** nas
  configurações do repositório.
- **Teste E2E não encontra o site:** gere `dist` antes de usar
  `PLAYWRIGHT_USE_PREVIEW=true`.
- **Deploy antigo permanece visível:** consulte a execução mais recente em
  **Actions** e o ambiente `github-pages`.
