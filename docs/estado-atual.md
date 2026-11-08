# Estado atual do protótipo

**Referência:** 8 de novembro de 2026 (interface, compartilhamento, login e
Buscar Materiais; esta versão é publicada pelo fluxo de qualidade do GitHub Pages)

**Versão do protótipo:** 0.3.0

**Fonte de verdade do estado implementado:** este documento e os testes automatizados

Este arquivo descreve a entrega executável atual. O registro mestre e os
documentos em `docs/historico` preservam decisões de etapas anteriores do TCC.

## Implementado

- página inicial pública, conta Google via Supabase e demonstração local opcional;
  entrada real validada localmente, com Google liberado para contas externas;
- **Manter conectado neste dispositivo** na entrada docente, inicialmente
  desmarcado: quando escolhido, o login sobrevive à reabertura do navegador,
  com renovação de tokens pelo SDK. Sem a opção, permanece restrito à aba.
  **Sair** encerra o acesso lembrado, inclusive nas outras abas que o usam.
  O comportamento é coberto por testes de armazenamento e de navegação;
- **Buscar Materiais** com 48 recursos locais, pesquisa textual e filtros por ano,
  assunto, habilidade da BNCC, formato e tipo de material. O filtro de assuntos reúne 45 palavras-chave
  baseadas nos três eixos da BNCC Computação, com seleção múltipla em uma janela;
  algumas opções ainda não têm materiais associados;
- barra de busca com cinco campos alinhados: **Ano escolar**, **Assuntos**,
  **Habilidades da BNCC**, **Tipo de material** e **Formato**. Cada campo abre
  suas opções e mostra a escolha atual ou a quantidade selecionada. Ano e
  formato também aceitam seleção múltipla em janela, com os mesmos botões
  arredondados de Assuntos e Tipo de material. O cabeçalho **Encontre materiais** /
  **Por onde você quer começar?** acompanha a busca. Em telas menores, os campos
  se reorganizam em linhas;
- prévias de materiais centralizadas, exibidas por inteiro e com margem em uma
  área uniforme. A largura e a organização dos cartões foram preservadas; a
  altura continua se ajustando ao texto. Quando o espaço diminui, o conteúdo
  passa a uma coluna para evitar sobreposição com os botões. Os cartões atendem à busca e
  à seleção de materiais em Minhas Trilhas. Imagens oficiais adicionadas para
  **Blockly Games**, **Crachá — micro:bit** e **Internet com Responsa**, seguidas
  pelas prévias dos 12 materiais restantes. Todos os **48 materiais** têm imagem
  específica obtida da fonte, de seu catálogo oficial ou do próprio material,
  com descrição alternativa. Miniaturas dos vídeos identificam os episódios;
  a playlist do NIC.br usa a do primeiro episódio. Créditos e condições em
  `creditos-e-licencas.md`;
- imagens na ficha do material exibidas por inteiro, com margem e preferência
  pelo arquivo original em vez da miniatura. Etapas de **Trilhas Prontas** e
  **Minhas Trilhas** também preservam as proporções, com os rótulos em uma faixa
  própria abaixo da imagem, sem gradiente cobrindo o conteúdo;
- retorno da ficha a **Buscar Materiais** recupera a posição de rolagem, a
  pesquisa e os filtros da entrada correspondente no histórico. Funciona pelo
  **Voltar** da ficha e pelo retorno do navegador. O estado é temporário,
  em memória dentro da área docente; seletores de materiais em janelas continuam
  independentes;
- **Habilidades da BNCC** em campo próprio, com seleção múltipla das habilidades
  vinculadas ao acervo, agrupadas por eixo e identificadas por código, descrição
  e anos. A janela permite pesquisar código ou descrição, limpar a seleção e
  concluir. Habilidades escolhidas usam união; os demais filtros se combinam por
  interseção, exigindo que ano e habilidade pertençam ao mesmo vínculo curricular.
  O filtro também integra a seleção de materiais em Minhas Trilhas;
- filtro **Tipo de material**, com cinco opções em janela própria, organizadas
  pelos títulos **Abordagem ativa** e **Abordagem expositiva**. Seleções de tipos
  usam união e combinam-se por interseção com ano, assunto, formato e pesquisa.
  Um material pode ter vários tipos e aparece uma única vez; a classificação
  também é exibida nas fichas, trilhas e turmas. Critérios em
  `classificacao-tipos-materiais.md`;
- livros, livros-jogo, tutoriais e projetos reunidos em **Atividades e exercícios**,
  com **Jogos** adicional quando pertinente; o cartaz **Evolução da Computação**
  integra **Textos e guias**. O filtro não exibe resumo abaixo de **Ver opções**;
- cinco cadastros locais aprovados em 28 de outubro: **Evolução da Computação**,
  **Guardião Cibernético**, **As fake news**, **SplashCode** e **Segurança Online**.
  Os fascículos do Guardião são complementos do mesmo registro. Os jogos
  explicitam impressão e montagem prévias; a linha do tempo sinaliza a correção
  histórica sobre Ada Lovelace. Esses cadastros integram a entrega 0.3.0.
  Evidências em `processo-curadoria-2026-10-28.md`;
- **Compute It** incluído após confirmação do autor, com `?lang=pt` nos acessos
  para fixar os comandos em português na ficha e no percurso pelas trilhas.
  Não depende da detecção do idioma do navegador. Elementos da interface
  permanecem em inglês; a prévia usa uma captura obtida na página oficial,
  com os créditos e limites registrados em `creditos-e-licencas.md`;
- quatro novos expositivos locais: **Tecnologia e vida humana**, dois vídeos do
  **Manual do Mundo** e a playlist oficial **Como funciona a Internet? — NIC.br**.
  A playlist é um único cadastro com quatro episódios nos complementos. Os
  slides incluem texto e folha de quatro questões; a duração dos vídeos é
  distinguida da duração da aula. O material do EducaMídia foi rejeitado e não
  foi incluído. Evidências em `processo-curadoria-expositivos-2026-10-28.md`;
- textos breves de **O que farão e como** e listas compactas de **Materiais**
  para os cadastros recentes e os dois outros pontos mais extensos. Os dados
  originais dos 48 recursos foram preservados. A revisão de consistência e
  os problemas mantidos sem correção estão em `revisao-materiais-2026-10-28.md`;
- anos da busca e das propostas alinhados às fichas: **Blockly Games** no 4º e
  5º anos e **Vinte Palpites** no 4º, 5º e 8º (extensão). **Sertão.bit** mantém
  abordagem combinada na ficha e pode ser encontrado por livro, jogo ou atividade;
- alinhamentos explícitos por ano, eixo, habilidade e competências, incluindo
  correspondências curatoriais sinalizadas para validação;
- níveis curatoriais de familiaridade (Básico, Intermediário e Avançado) para
  aluno e professor em cada material, exibidos na busca, no detalhe e na
  proposta de atividade, com explicação na página **Sobre**;
- detalhe do material em três abas, com informações pedagógicas, condições de
  uso, fonte, licença e materiais complementares. O resumo não repete o
  fornecedor nem o aviso de saída da plataforma; as informações de origem
  permanecem na aba **Fonte**. O card exibe o nome do material antes de **Turma**;
  o cabeçalho usa **Planejamento por materiais** e **Detalhes do material**;
- fichas e propostas de atividade identificam as referências curriculares como
  **Habilidades da BNCC**. Na ficha, o tema antes chamado **Habilidade** aparece
  como **Assunto**, antes das habilidades, e continua usado na busca e no apoio
  aos objetivos. O filtro **Assuntos** mantém sua lista própria de palavras-chave;
- **Buscar Materiais** oferece apenas **Adicionar à trilha**, escolhendo uma
  trilha existente, e **Adicionar à turma**, com seleção de turma ativa. As ações
  ficam ao lado de **Preparação necessária**, dentro do conteúdo do cartão,
  com o mesmo tamanho e hierarquia, sem a faixa extra no rodapé. Em telas
  menores, se reorganizam abaixo da preparação.
  A criação de trilhas foi removida da busca e permanece em **Minhas Trilhas**.
  Quando não há trilhas, a janela orienta o acesso a essa área; materiais já
  presentes não podem ser adicionados novamente. A lista abre sem uma trilha
  selecionada e exige a escolha antes de habilitar a adição;
- salvamento de trilhas com nome, objetivo, cor e ícone, online por professor
  ou local no modo demonstrativo;
- área docente sem faixa permanente de status online ou botão de atualização
  manual; o salvamento não exibe uma faixa no topo e avisos aparecem em caso de erro,
  com nova tentativa disponível quando o carregamento falha;
- **Minhas Trilhas** com sequência visual conectada, reordenação por arrastar e
  soltar, duração de uma a três aulas por etapa e tempo total calculado. A trilha
  aberta exibe o nome em destaque na área azul, acima do objetivo, como nas
  **Trilhas Prontas**. O cabeçalho usa **Planejamento por materiais** e
  **Detalhes da trilha de ensino**. As ações da trilha ficam alinhadas à base
  das informações na área azul;
- criação de trilhas e adição de materiais pela própria área **Minhas Trilhas**,
  em janela com os mesmos filtros e prévias de **Buscar Materiais**. Materiais
  já presentes não são duplicados; novas etapas de uma trilha existente entram
  no rascunho e só são gravadas com **Salvar alterações**;
- cartões pessoais sem o rótulo repetido **Trilha de ensino**, com **Abrir trilha**
  junto à quantidade de materiais, durações e data de atualização no rodapé do
  cartão. **Criar trilha** integra o cabeçalho da página; orientação de arrastar
  integrada aos controles das etapas;
- edição em rascunho, com descarte ou confirmação explícita de alterações;
- aviso de alterações pendentes ao voltar à lista, navegar para outra tela,
  fechar a edição de informações ou sair da conta. Recarregar ou fechar a aba
  usa o aviso nativo do navegador; continuar editando preserva o rascunho;
- proposta de atividade ao abrir uma etapa, com referência curricular,
  objetivo, materiais, descrição da atividade, duração ajustável e acesso
  ao material completo no primeiro bloco, que abre a ficha na plataforma;
- **Trilhas Prontas** com filtros por eixo e nove percursos locais, três por
  eixo. As três sequências iniciais foram preservadas; as seis novas abordam
  execução e correção de programas (6º), busca e ordenação (8º), representação
  e compactação de dados (6º), funcionamento da Internet (8º), cyberbullying
  (7º) e desinformação (9º). A duração deriva das etapas, inclusive quando um
  material ocupa duas ou três aulas, e é preservada na cópia editável.
  Critérios em `curadoria-trilhas-prontas-2026-10-28.md`;
- cópia de qualquer trilha pronta para **Minhas Trilhas**;
- menu **Minha conta** pelo nome/avatar no rodapé, com nome, e-mail, identificação
  da conta Google, acesso a **Privacidade e preferências** e saída;
- página **Sobre**; endereço antigo de perfil redireciona para **Buscar Materiais**;
- **Minhas Turmas**, com cadastro e edição de nome, ano/série, escola
  opcional, ano letivo e cor, sem campo de turno ou lista de alunos;
- **Criar turma** no cabeçalho; lista sem busca, organizada em abas **Ativas**
  e **Arquivadas**, com contadores e navegação por teclado. Detalhes sem os
  textos instrutivos removidos, botão **Arquivar** com borda e endereço de
  acesso com fonte ampliada na janela do código;
- adição de materiais pela turma ou pelo atalho **Adicionar à turma** na ficha;
  materiais ficam visíveis por padrão, com visibilidade independente por turma,
  ordenação e orientação opcional aos alunos;
- **Criar turma** integrado ao rodapé da janela **Adicionar à turma**, com borda
  e alinhamento aos demais controles; na primeira turma, aparece como ação principal;
- confirmação ao remover um material ou uma trilha pelo **X** da turma;
  cancelar preserva o item e confirmar retira apenas o compartilhamento nessa turma;
- compartilhamento de uma cópia de trilha por **Adicionar trilha**, na turma,
  ou **Adicionar à turma**, em Minhas Trilhas. Cada cópia preserva nome,
  objetivo, aparência, etapas e durações; aceita visibilidade, reordenação e
  remoção independentes por turma. Editar ou excluir a original não modifica
  a cópia; **Atualizar cópia** aplica uma versão nova por escolha do professor;
- alunos veem as trilhas visíveis como cartões expansíveis, com etapas numeradas
  e links diretos aos recursos, junto aos materiais avulsos. Não recebem o
  objetivo docente nem os campos internos de revisão. O fluxo está disponível
  em demonstração e no projeto online. A migração foi aplicada ao Supabase após
  autorização do responsável, com testes transacionais de compartilhamento e
  segurança aprovados e os dados existentes preservados;
- código fixo de seis números por turma, junto de **Mostrar código** no
  cabeçalho da turma ativa, com janela para projeção e cópia;
- entrada pública em `/alunos`, sem login, com turma escolhida apenas em memória;
  reabrir a página pede o código, mesmo com sessão docente no navegador;
- página dos alunos com materiais visíveis e links diretos para a fonte externa;
- arquivamento que preserva os materiais e encerra o acesso; exclusão que remove
  a turma e reserva seu código para não ser reutilizado;
- **Desarquivar turma** no detalhe de uma turma arquivada, retornando-a às ativas
  com o mesmo código, materiais, ordem, orientações e visibilidade. A operação
  está ativa no Supabase, com propriedade e revisão verificadas no servidor;
- backend Supabase Free em São Paulo, com banco e serviço público de turmas ativos;
- isolamento de dados por professor, confirmação de gravações e detecção de conflito;
- consulta pública dos alunos sem conta, removendo materiais ocultos no servidor;
- atualização da tela do aluno a cada 20 segundos enquanto visível e ao recuperar foco;
- sincronização entre abas por armazenamento somente no modo demonstrativo;
- integração do Microsoft Clarity em produção, condicionada à aceitação do
  visitante, com recusa, revogação e página pública de privacidade;
- layout responsivo, navegação por teclado, testes automatizados e publicação no
  GitHub Pages.

## Fora do escopo atual

- favoritos e pastas pessoais de materiais;
- criação, armazenamento ou exportação de planos de aula;
- inteligência artificial integrada à aplicação ou disponível ao usuário;
- inclusão de materiais por usuários;
- contas ou dados de estudantes;
- colaboração de vários professores na mesma turma;
- service worker.

## Uso de IA generativa no projeto

A IA generativa é utilizada fora da aplicação como apoio ao desenvolvimento e
à curadoria. O autor utiliza o Codex para auxiliar na padronização e sumarização
de informações dos materiais e para criar propostas de Trilhas Prontas a partir
de temas e recursos selecionados. A incorporação dos resultados ao protótipo
depende de decisão humana.

O Explora Computação não chama modelos ou APIs de IA em tempo de execução e
não oferece geração automática de trilhas ao docente.

## Avaliação

Uma avaliação com docentes poderá ser realizada futuramente, mas não possui
previsão ou método definido e não integra o escopo atual. A versão executável
não deve ser descrita como validada por docentes.

As antigas páginas de Favoritos, Pastas e Planos de Aula foram removidas. URLs
legadas redirecionam para **Buscar Materiais** ou **Minhas Trilhas**, evitando
telas órfãs e links quebrados.

## Fluxo principal

1. O docente entra com Google (ou usa a demonstração local) e chega a **Buscar Materiais**.
2. Pode pesquisar e filtrar os materiais disponíveis.
3. Seleciona recursos, informa a identidade visual da trilha e salva.
   Também pode começar diretamente em **Minhas Trilhas**, pelo botão
   **Criar trilha**, escolhendo os materiais na janela de seleção.
4. Em **Minhas Trilhas**, reorganiza etapas e define suas durações.
   Pode adicionar materiais na própria tela e salvar o conjunto de alterações.
5. Como alternativa, escolhe uma sequência em **Trilhas Prontas** e a adiciona
   ao espaço pessoal.

## Persistência

Turmas e trilhas online ficam no Supabase, vinculadas ao professor. A sessão
docente usa `sessionStorage` ou `localStorage` quando o professor escolhe manter
o dispositivo conectado; a seleção do aluno fica só em memória. No modo
demonstrativo, sessão, trilhas e turmas continuam no `localStorage`, sem migração
para contas. O acervo permanece no código. Com aceitação, dados de navegação
são enviados ao Microsoft Clarity, conforme `integracao-clarity.md`.
Detalhes de provisionamento, segurança e manutenção em `backend-supabase.md`.

Dados antigos das funcionalidades removidas podem continuar no armazenamento
do navegador de quem utilizou versões anteriores, mas não são mais lidos nem
alterados pela aplicação.

## URLs

A versão 0.3.0 reúne 48 materiais e nove Trilhas Prontas, com textos compactos,
anos consistentes e filtro de abordagem combinada corrigido. Em 28 de outubro,
o autor autorizou publicar o conjunto atual no GitHub Pages. A curadoria está
documentada nos registros de materiais e trilhas de 28 de outubro.

O desenvolvimento local usa `http://127.0.0.1:4173/`. No GitHub Pages, as rotas
ficam depois de `#`.

| Rota lógica | Conteúdo |
|---|---|
| `/privacidade` | informações e preferências de análise, sem login |
| `/entrar` | entrada docente com Google |
| `/alunos` | entrada pública por código |
| `/app/minhas-turmas` | turmas do professor |
| `/app/trilha-de-ensino` | busca e seleção de materiais |
| `/app/materiais/:slug` | detalhe de um material |
| `/app/trilhas-prontas` | percursos prontos por eixo |
| `/app/minhas-trilhas` | lista e edição de trilhas salvas |
| `/app/perfil` | endereço antigo, redireciona para Buscar Materiais |
| `/app/sobre` | propósito e perguntas frequentes |

## Limitações conhecidas

- depois de cada publicação, repetir o teste de entrada no endereço do Pages;
- o plano Free pode ser pausado por pouca atividade em sete dias; conferir o
  painel e testar com antecedência à defesa;
- o modo demonstrativo continua restrito ao navegador e não transfere seus dados
  para contas online;
- alinhamentos curatoriais ainda precisam de validação acadêmica;
- as imagens de terceiros mantêm seus créditos e condições próprias no manifesto
  de ativos; licença do recurso ou do portal não é presumida como licença da imagem;
- as Trilhas Prontas são um conjunto inicial e ainda reduzido.
