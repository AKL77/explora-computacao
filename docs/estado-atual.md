# Estado atual do protótipo

**Referência:** 12 de agosto de 2026
**Versão do protótipo:** 0.1.0
**Fonte de verdade do estado implementado:** este documento e os testes automatizados

Este registro separa o que já funciona da visão futura descrita no TCC. A
especificação detalha o produto; o plano registra decisões; este arquivo resume
exatamente a entrega executável disponível na branch `main`.

## Implementado

- landing page pública com proposta, contexto, acervo e planejamento;
- entrada demonstrativa direta, sem conta Google;
- Acervo com busca, filtros por turma e habilidade e estado na URL;
- card compacto com imagem, título, turma, eixo, habilidade, coração de
  favorito e menu para organização;
- detalhe do recurso com abas **Descrição**, **Informações adicionais** e
  **Fonte**;
- favoritos e pastas pessoais persistidos no navegador;
- busca e filtros recolhíveis dentro de Favoritos e de cada pasta;
- página **Sobre** com propósito, orientações sobre materiais e FAQ;
- layout responsivo e navegação por teclado;
- testes unitários, de componentes, E2E e verificações automáticas de
  acessibilidade;
- pipeline de qualidade e deploy automático no GitHub Pages.

## Visível, mas inativo

Os itens abaixo são botões desabilitados e não possuem rota pública:

- Meu perfil;
- Minhas Turmas;
- Meus Planos de Aula;
- Criar Plano de Aula.

## Fora do escopo desta versão

- backend, API e banco de dados;
- autenticação Google ou gestão de contas;
- geração de planos de aula por inteligência artificial;
- inclusão de materiais por usuários;
- contas ou dados de estudantes;
- sincronização entre navegadores ou dispositivos;
- analytics, cookies de rastreamento e service worker.

## Conteúdo inicial

O catálogo contém apenas **Cyberbullying — Jogo Educativo**, da ALT+INOVARE,
relacionado à habilidade **EF07CO09 — Reconhecer e debater sobre
cyberbullying** e ao eixo **Cultura Digital**.

## Persistência

A sessão demonstrativa, favoritos e pastas ficam no `localStorage` da origem
em que o site é acessado. Limpar os dados do site reinicia o protótipo. Nenhum
dado é enviado a um servidor do Informática Explorer.

## URLs

O desenvolvimento local usa `http://127.0.0.1:4173/`. No GitHub Pages, as
rotas da aplicação ficam após `#`, por exemplo
`/informatica-explorer/#/app/acervo`. Essa decisão evita erro 404 ao atualizar
uma tela interna em uma hospedagem estática.

## Limitações conhecidas

- Os dados são locais e demonstrativos.
- O catálogo ainda não representa a diversidade prevista para a pesquisa.
- Links externos e licenças precisam de revisão periódica.
- A identidade visual é provisória e deve ser validada antes da versão final
  do TCC.
