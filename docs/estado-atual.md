# Estado atual do protótipo

**Referência:** 1º de setembro de 2026
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
- página **Criar Trilha de Ensino** com busca livre e tags clicáveis de ano,
  formato e abordagem;
- piloto da trilha com três recursos distintos do 5º ano alinhados
  curatorialmente a `EF05CO04`: **Vinte Palpites**, **Blockly Games** e
  **Sertão.bit**;
- cartões compactos de recurso com objetivo breve, ações dos estudantes e
  materiais, ligados à página correspondente no Acervo;
- trilhas salvas localmente com nome, objetivo, cor de fundo e ícone
  personalizados, sem sugestão pedagógica automática;
- área **Minhas Trilhas** com sequência visual conectada, reordenação por
  arrastar e soltar, ficha enxuta por material, duração de uma, duas ou três
  aulas, tempo total calculado e confirmação explícita das alterações;
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

Os itens abaixo continuam visíveis, mas desabilitados na navegação:

- Meu perfil;
- Minhas Turmas.
- Meus Planos de Aula (a rota legada permanece preservada para continuidade dos
  dados locais).

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

## Criador de trilhas

**Criar Trilha de Ensino** é o fluxo principal exposto no menu. O docente pode
iniciar por uma busca de assunto, conceito ou código de habilidade e refiná-la
com tags clicáveis de ano escolar, formato e abordagem. A pesquisa usa aliases
curatoriais explícitos: por
exemplo, `EF05CO04` encontra os três recursos piloto, enquanto **laço de
repetição** encontra somente o Blockly Games.

Os cards oferecem uma prévia compacta com objetivo breve, descrição do que os
estudantes farão e como farão, além dos materiais usados; eles também abrem a
página detalhada do material no Acervo. Os textos dessa camada são curatoriais e
se mantêm separados do cadastro-base do Acervo. O recurso pode ser selecionado
diretamente para uma nova trilha em criação e removido do resumo leve. Para
salvar, o docente informa nome e objetivo obrigatórios e pode escolher a cor de
fundo e o ícone da trilha. Depois de salvar, a opção de adicionar a uma trilha
existente fica disponível. A interface não sugere nem valida uma ordem
pedagógica, mas permite que o docente a reorganize por arrastar e soltar em
**Minhas Trilhas**.

As trilhas salvas permanecem no armazenamento local deste navegador. Em
**Minhas Trilhas**, abrir uma sequência revela um caminho visual conectado de
etapas; clicar em uma etapa abre uma ficha de planejamento enxuta com duração
editável de uma, duas ou três aulas de 50 minutos. Nome, objetivo, cor e ícone
da trilha continuam editáveis. Reordenação, duração, edição dos dados e remoção
são feitas em rascunho: a remoção pode ser desfeita e só é persistida ao usar
**Salvar alterações**. Quando todas as etapas têm duração, a interface mostra o
tempo total. O marco final conectado apresenta nome, objetivo personalizado,
ícone escolhido e os códigos curriculares sob o rótulo de apresentação
**Competências da BNCC relacionados**.
O criador de planos anterior e seus planos salvos foram preservados, mas
**Criar Plano de Aula** e **Meus Planos de Aula** não aparecem como ações
operacionais no menu principal.

## Persistência, busca e edição

Sessão, favoritos, pastas, planos e trilhas usam chaves independentes e
versionadas no `localStorage`. Um plano salvo é um snapshot: alterações
posteriores no Acervo não mudam silenciosamente o documento já guardado. A
edição atualiza o mesmo ID e preserva a data de criação.

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
| `/app/trilha-de-ensino` | busca por tags e seleção de uma trilha piloto |
| `/app/minhas-trilhas` | lista e edição visual de trilhas salvas |
| `/app/plano-de-aula` | criação de plano |
| `/app/planos` | planos salvos e busca |
| `/app/planos/:planId/editar` | edição de plano salvo |

## Fora do escopo desta versão

- backend, API e banco de dados;
- autenticação Google ou gestão de contas;
- inteligência artificial no recorte atual de planos;
- inclusão de materiais por usuários;
- compartilhamento ou sugestão automática da ordem das trilhas;
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
- A criação de trilhas usa apenas três recursos para validação do fluxo; os
  demais materiais do Acervo ainda não participam dessa busca.
