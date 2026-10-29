# Quatro materiais expositivos — 28 de outubro de 2026

Inclusão autorizada pelo autor após avaliação das sugestões. O catálogo local
passa de **44 para 48 materiais**. Nenhum commit, envio ou publicação é parte
desta etapa; o catálogo publicado da versão 0.2.0 continua com 38 materiais.

## Seleção e fontes

| Cadastro | Evidência conferida | Público e duração | Preparação |
|---|---|---|---|
| [Tecnologia e vida humana](https://sme.goiania.go.gov.br/conexaoescola/ensino_fundamental/ciencias-da-natureza-tecnologia-e-vida-humana/) | Mariana Araguaia, SME Goiânia; PowerPoint com 34 slides, incluindo revelações progressivas, texto e atividade em DOCX com quatro questões | 7º ano e EF07CI11 declarados pela fonte; duração não informada | Baixar os slides; usar leitor de apresentações e projetor. Impressão opcional da atividade complementar |
| [Os computadores eram pessoas!](https://www.youtube.com/watch?v=xajcV4lwY3Q) | Canal oficial Manual do Mundo; A Saga dos Computadores, episódio 1, publicado em 22/03/2022; descrição e capítulos sobre calculadores humanos e máquinas mecânicas | 20min48s de vídeo; 6º–9º por curadoria; a duração da aula não foi inventada | Projeção, som e Internet; sem impressão ou construção obrigatória da máquina demonstrada |
| [Como funciona a memória do computador?](https://www.youtube.com/watch?v=rS1SgcjYbIE) | Canal oficial Manual do Mundo; episódio 7, publicado em 22/09/2022; descrição sobre memória e armazenamento | 12min16s de vídeo; 6º–9º por curadoria, com uso introdutório no 6º para apoiar gestão de dados | Projeção, som e Internet; sem aquisição ou desmontagem de componentes |
| [Como funciona a Internet? — playlist](https://www.youtube.com/playlist?list=PLQq8-9yVHyOYMFAc9v7Yb_cqmNMksEdrk) | Playlist do próprio NICbrvideos, com quatro episódios; título, responsável, lista e durações conferidos na interface do YouTube | 26min35s de vídeos, sem mediação; 7º–9º por curadoria, sem ano escolar declarado pelo produtor | Escolher episódios; testar a escuta por causa da trilha musical; contextualizar produção de 2014 e explicar o vocabulário da parte 2 |

Os arquivos de apresentação e os dois DOCX da SME foram baixados para
`tmp/pesquisa-expositivos-2026-10-28/` e tiveram seus textos/formatos conferidos.
Os vídeos não foram baixados. A conferência de descrição, capítulos, duração
e disponibilidade não equivale a uma avaliação integral de acessibilidade
ou a validação de cada afirmação feita pelos autores.

## Playlist como unidade do cadastro

Um único registro, `nicbr-como-funciona-internet-playlist`, abre a playlist
oficial. A grafia correta do identificador, confirmada no navegador, contém
**c minúsculo** em `PLQq8-9yVHyOYMFAc9v7Yb_cqmNMksEdrk`.

Os quatro episódios são complementos do registro, sem cards individuais:

1. [O protocolo IP](https://www.youtube.com/watch?v=HNQD0qJ0TC4) — 5min44s.
2. [Sistemas Autônomos, BGP, PTTs](https://www.youtube.com/watch?v=C5qNAT_j63M) — 7min06s.
3. [DNS](https://www.youtube.com/watch?v=ACGuo26MswI) — 6min55s.
4. [Governança da Internet](https://www.youtube.com/watch?v=ZYsjMEISR6E) — 6min50s.

Somam 26min35s. Não se confunde esse tempo com o da aula ou com publicidade
eventualmente inserida pelo YouTube. As páginas institucionais de cada
episódio também aparecem na ficha como referências complementares.

## Direitos, idioma e limites

- Todos os acessos ficam externos. As quatro fichas usam o placeholder do
  catálogo; nenhum vídeo, slide ou miniatura foi republicado na plataforma.
- A SME não apresenta licença explícita para os anexos. A descrição do
  Manual do Mundo reserva os direitos ao produtor. A licença geral do site
  do NIC.br não foi estendida automaticamente aos vídeos do YouTube.
- Os vídeos do Manual do Mundo são originalmente em português, com outras
  faixas de áudio possivelmente oferecidas pelo YouTube. A ficha orienta
  selecionar Português (original) se necessário. Há divulgação da Alura.
- A apresentação da SME cita dados e vivências do ensino remoto durante a
  pandemia: o uso proposto contextualiza esses dados e ajusta a pergunta
  pessoal à turma atual. EF07CI11 é uma habilidade de Ciências, não foi
  apresentada como código de Computação.
- A ressalva sobre música de fundo nos vídeos do NIC.br está na ficha e
  na proposta de aula. Acessibilidade dos materiais permanece pendente.
- **Inteligência artificial no cotidiano — EducaMídia** foi rejeitado pelo
  autor e não entra no catálogo. **Algoritmos e fluxogramas** não fez parte
  da seleção final aprovada: a ilustração troca numerador por denominador.
  O curso Machine Learning para Todos/UFSC ficou em espera porque sua área
  de aulas está em manutenção. Nenhum desses materiais foi incluído.

## Integração e currículo

Os dados estão em `src/data/resources/expositoryMaterials.ts`, importados
no catálogo central. Todos recebem assuntos padronizados, familiaridade
de aluno e professor, função expositiva e proposta de aplicação. Dessa
forma participam da busca, dos filtros, da ficha, da seleção e salvamento
de trilhas e das propostas de atividade. Os slides usam Texto, assim como
o apoio expositivo Guardião Cibernético; os três registros audiovisuais
usam Vídeo. Os complementos permanecem nas respectivas fichas.

| Material | Alinhamento à BNCC Computação e limite | Familiaridade aluno / professor |
|---|---|---|
| Tecnologia e vida humana | 7º EF07CO10, parcial: o descarte eletrônico exige aprofundamento docente; a fonte original declara EF07CI11 | Básico / Básico |
| Os computadores eram pessoas! | 9º EF09CO07, parcial: relacionar a história às implicações atuais e avaliar alternativas exige mediação | Básico / Intermediário |
| Memória do computador | 6º EF06CO08, parcial: base conceitual para armazenamento; não cobre manipulação, compactação e recuperação de arquivos | Básico / Intermediário |
| Playlist Internet | 7º EF07CO06 e 8º EF08CO06: papel dos protocolos e estrutura e funcionamento da Internet | Básico / Intermediário |

Todos os vínculos são curatoriais e pendentes de validação. EF07CO10 foi
acrescentada ao dicionário a partir do Complemento à BNCC de 2022, já
preservado na curadoria do projeto. O uso introdutório de Memória no 6º
amplia a sugestão inicial de 7º–9º para explicitar seu papel de apoio à
gestão de dados, sem atribuir essa recomendação ao produtor.

## Verificação local

- Typecheck, lint dos fontes (excluindo os arquivos de pesquisa em `tmp/`)
  e build concluídos sem erros.
- Suíte unitária: **84 testes aprovados**, em 19 arquivos. Após o ajuste de
  classificação dos vídeos como plugados, os dois testes da integração
  expositiva foram executados novamente e aprovados.
- Navegação automatizada: **32 testes aprovados**, nos perfis computador
  e celular, incluindo busca dos quatro materiais, seleção e salvamento
  de trilha, proposta da playlist, duração, link principal e complementos.
- Ficha local da playlist inspecionada também no navegador, com quatro
  links de episódios e as referências institucionais na aba Fonte.
- Os vídeos são classificados como plugados mesmo quando sua proposta
  inclui anotações em papel; a anotação não dispensa a exibição do vídeo.
