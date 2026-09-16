# Estado atual do protótipo

**Referência:** 14 de setembro de 2026

**Versão do protótipo:** 0.1.0

**Fonte de verdade do estado implementado:** este documento e os testes automatizados

Este arquivo descreve a entrega executável atual. O registro mestre e os
documentos em `docs/historico` preservam decisões de etapas anteriores do TCC.

## Implementado

- página inicial pública e sessão local demonstrativa, sem conta real;
- **Buscar Materiais** com 31 recursos e filtros por ano, eixo e
  características;
- alinhamentos explícitos por ano, eixo, habilidade e competências, incluindo
  correspondências curatoriais sinalizadas para validação;
- detalhe do material em três abas, com informações pedagógicas, condições de
  uso, fonte, licença e materiais complementares;
- seleção de materiais para criar uma trilha própria;
- salvamento local de trilhas com nome, objetivo, cor e ícone;
- **Minhas Trilhas** com sequência visual conectada, reordenação por arrastar e
  soltar, duração de uma a três aulas por etapa e tempo total calculado;
- edição em rascunho, com descarte ou confirmação explícita de alterações;
- ficha de planejamento ao abrir uma etapa, com acesso destacado ao material
  completo;
- **Trilhas Prontas** com filtros por eixo e três percursos funcionais:
  - Pensamento Computacional: **Algoritmos: decisões, blocos e desafios**;
  - Mundo Digital: **Mensagens sem erro: paridade e protocolos**;
  - Cultura Digital: **Privacidade e armadilhas online**;
- cópia de qualquer trilha pronta para **Minhas Trilhas**;
- páginas **Meu perfil** e **Sobre**;
- layout responsivo, navegação por teclado, testes automatizados e publicação no
  GitHub Pages.

## Fora do escopo atual

- favoritos e pastas pessoais de materiais;
- cadastro de turmas;
- criação, armazenamento ou exportação de planos de aula;
- backend, API e banco de dados;
- autenticação real ou gestão de contas;
- inteligência artificial;
- inclusão de materiais por usuários;
- contas ou dados de estudantes;
- sincronização, colaboração ou compartilhamento remoto;
- analytics, cookies de rastreamento e service worker.

As antigas páginas de Favoritos, Pastas e Planos de Aula foram removidas. URLs
legadas redirecionam para **Buscar Materiais** ou **Minhas Trilhas**, evitando
telas órfãs e links quebrados.

## Fluxo principal

1. O docente entra na sessão demonstrativa e chega a **Buscar Materiais**.
2. Pode pesquisar e filtrar os materiais disponíveis.
3. Seleciona recursos, informa a identidade visual da trilha e salva.
4. Em **Minhas Trilhas**, reorganiza etapas e define suas durações.
5. Como alternativa, escolhe uma sequência em **Trilhas Prontas** e a adiciona
   ao espaço pessoal.

## Persistência

Somente a sessão demonstrativa e as trilhas são persistidas no `localStorage`,
em chaves independentes e versionadas. Nenhum dado é enviado a um servidor do
Informática Explorer.

Dados antigos das funcionalidades removidas podem continuar no armazenamento
do navegador de quem utilizou versões anteriores, mas não são mais lidos nem
alterados pela aplicação.

## URLs

O desenvolvimento local usa `http://127.0.0.1:4173/`. No GitHub Pages, as rotas
ficam depois de `#`.

| Rota lógica | Conteúdo |
|---|---|
| `/app/trilha-de-ensino` | busca e seleção de materiais |
| `/app/materiais/:slug` | detalhe de um material |
| `/app/trilhas-prontas` | percursos prontos por eixo |
| `/app/minhas-trilhas` | lista e edição de trilhas salvas |
| `/app/perfil` | perfil demonstrativo |
| `/app/sobre` | propósito e perguntas frequentes |

## Limitações conhecidas

- a persistência fica restrita ao navegador e não sincroniza entre o ambiente
  local e o GitHub Pages;
- limpar os dados do navegador apaga as trilhas salvas;
- alinhamentos curatoriais ainda precisam de validação acadêmica;
- alguns materiais externos não permitem reutilização verificada de suas
  imagens e, por isso, usam o placeholder do projeto;
- as Trilhas Prontas são um conjunto inicial e ainda reduzido.
