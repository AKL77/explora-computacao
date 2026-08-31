# Estado atual do protótipo

**Referência:** 30 de agosto de 2026
**Versão do protótipo:** 0.1.0
**Fonte de verdade do estado implementado:** este documento e os testes automatizados

Este arquivo separa a entrega executável da visão futura do TCC. A especificação
detalha os requisitos e o registro mestre preserva as decisões acadêmicas.

## Implementado

- landing page pública e sessão local demonstrativa, sem conta Google;
- Acervo com 31 recursos, busca e filtros por ano do 4º ao 9º e habilidade;
- alinhamentos explícitos por ano, eixo, habilidade e competências, incluindo
  correspondências curatoriais marcadas para validação;
- cards, detalhes em três abas, fontes, licenças, miniaturas e materiais
  complementares curados;
- favoritos e pastas de **Meus Materiais**, persistidos no navegador;
- página **Sobre** com propósito, organização e FAQ;
- criador determinístico de planos, sem IA, para uma, duas ou três aulas de 50
  minutos;
- seleção explícita de um material do Acervo depois do ano e da habilidade;
- todos os recursos alinhados e com URL HTTP(S) segura disponíveis no criador,
  mesmo quando duração, função pedagógica ou proposta de aplicação ainda não
  foram cadastradas;
- objetivo sugerido somente quando o material possui `learningObjective`; a
  interface identifica o material de origem e permite editar o texto;
- metodologia expositiva dialogada, ativa/prática ou combinada;
- metodologia e avaliação opcional preenchidas, por enquanto, com textos
  canônicos e distintos de lorem ipsum;
- materiais do cadastro pedagógico combinados com requisitos de dispositivo,
  Internet e conta;
- reutilização do material selecionado em uma, duas ou três aulas, sem exigir
  três recursos diferentes;
- visualização **Em Blocos**, com cinco blocos pedagógicos, faixa geométrica e
  composição assimétrica, e visualização **Descritivo** organizada por aula;
- salvamento local de snapshots completos dos planos;
- **Meus Planos de Aula** com busca por tema, ignorando caixa e acentos;
- edição de planos salvos sem criar duplicatas;
- download de qualquer plano como PDF A4 vetorial, paginado e com texto
  selecionável;
- layout responsivo, navegação por teclado, testes unitários e de componentes,
  checagem de tipos, lint e pipeline de publicação no GitHub Pages.

## Visível, mas inativo

Os itens abaixo continuam desabilitados e não possuem rota própria:

- Meu perfil;
- Minhas Turmas.

## Criador de planos

Acervo e criador permanecem fluxos de navegação independentes. No formulário,
o docente escolhe ano e habilidade e, em seguida, um dos materiais alinhados.
Não existem campos de turma concreta, evidência de aprendizagem, anotações ou
objeto de conhecimento.

O objetivo não é produzido por IA. Ao escolher um material, a tela copia
literalmente seu `pedagogy.learningObjective`, quando o campo existe. A origem é
informada logo abaixo do editor. Materiais sem esse metadado deixam o objetivo
vazio para preenchimento do docente.

Cada solicitação produz uma proposta canônica. Alterar o formulário marca a
prévia como desatualizada; salvar e baixar ficam bloqueados até selecionar
**Atualizar plano**. Não existe regeneração aleatória ou lista de propostas
alternativas.

A visualização **Em Blocos** e a **Descritivo** derivam do mesmo registro. A
primeira prioriza leitura rápida em um documento gráfico; a segunda explicita
as aulas em sequência. Alternar o formato não modifica o plano salvo.

## Persistência, busca e edição

Sessão, favoritos, pastas e planos usam chaves independentes e versionadas no
`localStorage`. Um plano salvo é um snapshot: alterações posteriores no Acervo
não mudam silenciosamente o documento já guardado. A edição atualiza o mesmo ID
e preserva a data de criação.

**Meus Planos de Aula** usa o tema como nome do plano, ordena os registros pela
atualização mais recente e permite busca sem diferenciar acentos ou maiúsculas.
Limpar os dados do site remove essas informações. Nada é enviado a um servidor
do Informática Explorer.

## PDF

O PDF é gerado inteiramente no navegador a partir do mesmo plano canônico. O
arquivo usa A4, blocos vetoriais azuis, paginação, acentos em WinAnsi com mapa
ToUnicode e nome derivado do tema. O Blob não é armazenado no `localStorage`.

## URLs

O desenvolvimento local usa `http://127.0.0.1:4173/`. No GitHub Pages, as rotas
ficam depois de `#`.

| Rota lógica | Conteúdo |
|---|---|
| `/app/acervo` | Acervo |
| `/app/pastas` | Favoritos e pastas |
| `/app/plano-de-aula` | criação de plano |
| `/app/planos` | planos salvos e busca |
| `/app/planos/:planId/editar` | edição de plano salvo |

## Fora do escopo desta versão

- backend, API e banco de dados;
- autenticação Google ou gestão de contas;
- inteligência artificial no recorte atual de planos;
- inclusão de materiais por usuários;
- contas ou dados de estudantes;
- sincronização, colaboração ou compartilhamento remoto;
- analytics, cookies de rastreamento e service worker.

## Limitações conhecidas

- Metodologia e avaliação ainda são placeholders e precisam de definição com a
  orientadora.
- A maioria dos novos recursos não possui objetivo sugerido; nesses casos, o
  docente precisa escrevê-lo.
- Os planos ficam restritos à origem do navegador e não sincronizam entre o
  ambiente local e o GitHub Pages.
- Limpar os dados do navegador apaga os planos salvos; ainda não existe ação de
  exclusão individual na interface.
- O PDF possui texto pesquisável, mas ainda não é um PDF semanticamente
  etiquetado para leitores de tela; a versão HTML é a experiência acessível
  principal.
- Alinhamentos curatoriais e a identidade visual ainda precisam de validação
  acadêmica antes da versão final do TCC.
