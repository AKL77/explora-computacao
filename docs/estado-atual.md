# Estado atual do protótipo

**Referência:** 28 de outubro de 2026

**Versão do protótipo:** 0.3.0

**Fonte de verdade do estado implementado:** este documento e os testes automatizados

Este arquivo descreve a entrega executável atual. O registro mestre e os
documentos em `docs/historico` preservam decisões de etapas anteriores do TCC.

## Implementado

- página inicial pública e sessão local demonstrativa, sem conta real;
- **Buscar Materiais** com 48 recursos locais, pesquisa textual e filtros por ano,
  assunto, formato e abordagem. O filtro de assuntos reúne 45 palavras-chave
  baseadas nos três eixos da BNCC Computação, com seleção múltipla em uma janela;
  algumas opções ainda não têm materiais associados;
- cinco cadastros locais aprovados em 28 de outubro: **Evolução da Computação**,
  **Guardião Cibernético**, **As fake news**, **SplashCode** e **Segurança Online**.
  Os fascículos do Guardião são complementos do mesmo registro. Os jogos
  explicitam impressão e montagem prévias; a linha do tempo sinaliza a correção
  histórica sobre Ada Lovelace. Esses cadastros integram a entrega 0.3.0.
  Evidências em `processo-curadoria-2026-10-28.md`;
- **Compute It** incluído após confirmação do autor, com `?lang=pt` nos acessos
  para fixar os comandos em português na ficha e no percurso pelas trilhas.
  Não depende da detecção do idioma do navegador. Elementos da interface
  permanecem em inglês; o material usa o placeholder por licença não identificada;
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
  5º anos e **Vinte Palpites** no 4º, 5º e 8º (extensão). **Sertão.bit**, de
  abordagem combinada, permanece nos resultados ao selecionar ativa,
  expositiva ou ambas. Somente esses dois pontos da revisão foram autorizados;
- alinhamentos explícitos por ano, eixo, habilidade e competências, incluindo
  correspondências curatoriais sinalizadas para validação;
- níveis curatoriais de familiaridade (Básico, Intermediário e Avançado) para
  aluno e professor em cada material, exibidos na busca, no detalhe e na
  proposta de atividade, com explicação na página **Sobre**;
- detalhe do material em três abas, com informações pedagógicas, condições de
  uso, fonte, licença e materiais complementares;
- fichas e propostas de atividade identificam as referências curriculares como
  **Habilidades da BNCC**. Na ficha, o tema antes chamado **Habilidade** aparece
  como **Assunto**, antes das habilidades, e continua usado na busca e no apoio
  aos objetivos. O filtro **Assuntos** mantém sua lista própria de palavras-chave;
- seleção de materiais para criar uma trilha própria;
- salvamento local de trilhas com nome, objetivo, cor e ícone;
- **Minhas Trilhas** com sequência visual conectada, reordenação por arrastar e
  soltar, duração de uma a três aulas por etapa e tempo total calculado;
- edição em rascunho, com descarte ou confirmação explícita de alterações;
- proposta de atividade ao abrir uma etapa, com referência curricular,
  objetivo, materiais, descrição da atividade, duração ajustável e acesso
  destacado ao material completo;
- **Trilhas Prontas** com filtros por eixo e nove percursos locais, três por
  eixo. As três sequências iniciais foram preservadas; as seis novas abordam
  execução e correção de programas (6º), busca e ordenação (8º), representação
  e compactação de dados (6º), funcionamento da Internet (8º), cyberbullying
  (7º) e desinformação (9º). A duração deriva das etapas, inclusive quando um
  material ocupa duas ou três aulas, e é preservada na cópia editável.
  Critérios em `curadoria-trilhas-prontas-2026-10-28.md`;
- cópia de qualquer trilha pronta para **Minhas Trilhas**;
- páginas **Meu perfil** e **Sobre**;
- integração do Microsoft Clarity em produção, condicionada à aceitação do
  visitante, com recusa, revogação e página pública de privacidade;
- layout responsivo, navegação por teclado, testes automatizados e publicação no
  GitHub Pages.

## Fora do escopo atual

- favoritos e pastas pessoais de materiais;
- cadastro de turmas;
- criação, armazenamento ou exportação de planos de aula;
- backend, API e banco de dados;
- autenticação real ou gestão de contas;
- inteligência artificial integrada à aplicação ou disponível ao usuário;
- inclusão de materiais por usuários;
- contas ou dados de estudantes;
- sincronização, colaboração ou compartilhamento remoto;
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

1. O docente entra na sessão demonstrativa e chega a **Buscar Materiais**.
2. Pode pesquisar e filtrar os materiais disponíveis.
3. Seleciona recursos, informa a identidade visual da trilha e salva.
4. Em **Minhas Trilhas**, reorganiza etapas e define suas durações.
5. Como alternativa, escolhe uma sequência em **Trilhas Prontas** e a adiciona
   ao espaço pessoal.

## Persistência

A sessão demonstrativa, as trilhas e a preferência de análise de uso são
persistidas no `localStorage`, em chaves independentes e versionadas. O Explora
Computação não possui servidor próprio. Com aceitação, dados de navegação são
enviados ao Microsoft Clarity, conforme `integracao-clarity.md`. A integração
faz parte da versão 0.2.0 e permanece condicionada à aceitação do visitante.

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
