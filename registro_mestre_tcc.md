# Registro mestre da proposta de TCC

**Tema provisório:** Plataforma web de curadoria de recursos para o ensino de Computação, alinhada à BNCC, com geração contextualizada de planos de aula
**Versão:** 0.7
**Data de atualização:** 12 de agosto de 2026
**Função deste arquivo:** fonte de verdade do projeto. Toda decisão nova deve atualizar este registro.

> **Hipótese central do projeto.** O diferencial mais defensável não é apenas reunir links nem apenas gerar planos com IA. É criar uma camada de orquestração pedagógica que conecte uma habilidade curricular a recursos curados, condições reais de uso, metodologia e evidências de aprendizagem, mantendo rastreabilidade entre o plano gerado e os materiais que o fundamentaram.

## 1. Resumo da proposta

O trabalho propõe desenvolver e avaliar um protótipo de plataforma web que reúna conteúdos relacionados ao ensino de Computação na Educação Básica, especialmente nos anos finais do Ensino Fundamental. O acervo poderá incluir sites, jogos, textos, vídeos, atividades, ferramentas e outros recursos. A experiência será orientada por três pilares: **Exposição**, **Organização** e **Filtragem**.

O usuário poderá navegar pelo acervo e localizar recursos associados a determinado ano escolar e a elementos da BNCC Computação. Como complemento, a plataforma deverá gerar planos de aula contextualizados a partir dos recursos selecionados ou recuperados no próprio repositório. A intenção é reduzir um problema observado em geradores generalistas: planos aparentemente completos, mas pouco aplicáveis, sem conexão explícita com metodologias, materiais, infraestrutura, faixa etária e contexto da turma.

Há uma possibilidade futura de geração de planos de estudo para estudantes. Essa funcionalidade ainda não está definida e, por envolver outro público, outra linguagem e outra lógica pedagógica, é tratada neste registro como extensão, e não como parte confirmada do produto mínimo viável.

## 2. Formulação recomendada do problema

Professores que precisam trabalhar habilidades de Computação encontram grande quantidade de recursos digitais dispersos, descritos de forma inconsistente e nem sempre relacionados claramente ao currículo, à metodologia ou às condições reais da escola. Ferramentas generativas podem acelerar o planejamento, mas tendem a produzir propostas genéricas quando não recebem fontes pedagógicas e restrições contextuais suficientes.

**Problema de pesquisa provisório:** como apoiar docentes dos anos finais do Ensino Fundamental na descoberta e no uso pedagógico de recursos de Computação, produzindo planos de aula mais contextualizados, rastreáveis e adaptáveis do que aqueles gerados apenas por instruções genéricas?

**Pergunta de pesquisa candidata:** em que medida a recuperação de recursos curados e alinhados às habilidades da BNCC Computação melhora a contextualização e a aplicabilidade de planos de aula gerados por IA para os anos finais do Ensino Fundamental?

**Possível contribuição acadêmica:** propor e avaliar um modelo de metadados e um protótipo de geração apoiada por recuperação de recursos curados, com foco na ligação entre currículo, recurso, metodologia e contexto de aplicação.

## 3. Escopo já definido

### 3.1 Público e etapa escolar

- Público principal: docentes que ensinam conteúdos de Computação.
- Etapa: anos finais do Ensino Fundamental, do 6º ao 9º ano.
- Faixa etária de referência: aproximadamente 11 a 14 anos, reconhecendo que idade e ano podem variar.
- Público secundário potencial: estudantes que desejem estudar uma habilidade de forma autônoma.

### 3.2 Objetivos declarados

- Facilitar e agilizar a preparação de aulas.
- Orientar docentes diante da quantidade e dispersão dos materiais disponíveis.
- Apresentar novas possibilidades para abordar conhecimentos de Computação.
- Propor formas variadas de trabalhar habilidades curriculares.
- Permitir adaptação à realidade da escola e à visão pedagógica de cada docente.

### 3.3 Pilares do repositório

1. **Exposição:** tornar recursos relevantes visíveis e compreensíveis.
2. **Organização:** estruturar recursos por metadados pedagógicos, curriculares e operacionais.
3. **Filtragem:** permitir recortes úteis por ano, habilidade, formato, metodologia, duração e condições de uso.

### 3.4 Elementos mínimos de um plano de aula já indicados

- Duração.
- Competência ou habilidade curricular.
- Metodologia.
- Materiais necessários.
- Avaliação, quando aplicável.

## 4. Refinamento conceitual necessário

### 4.1 Ensino de Computação

O escopo da plataforma é o **ensino de Computação**. A expressão “informática na educação” poderá aparecer somente quando for conceitualmente pertinente na fundamentação teórica, pois ela também pode significar o uso de tecnologias para ensinar outras disciplinas. A referência curricular principal será a BNCC Computação.

### 4.2 Competência e habilidade não são sinônimos

Para a interface e o banco de dados, a unidade de filtragem será a **habilidade**, identificada por código e associada ao ano escolar. As competências são mais amplas, mas são pedagogicamente importantes: depois de escolher uma habilidade, o professor deverá conseguir visualizar as **competências contempladas** por ela. A estrutura de referência deve preservar a hierarquia oficial, por exemplo:

**Etapa → ano → eixo → objeto de conhecimento → habilidade → competência relacionada.**

A BNCC Computação foi instituída como complemento à BNCC pela Resolução CNE/CEB nº 1/2022 e trabalha três eixos: pensamento computacional, mundo digital e cultura digital. A plataforma deve declarar a edição e a fonte normativa usadas, sem reescrever livremente os enunciados oficiais.

### 4.3 Repositório, referatório ou catálogo curado

Há três modelos diferentes:

- **Repositório:** hospeda os arquivos.
- **Referatório:** mantém metadados e links para recursos externos.
- **Modelo híbrido:** hospeda alguns materiais e referencia outros.

O **modelo híbrido** é o candidato atual: hospedar materiais próprios ou autorizados quando necessário e referenciar recursos externos de qualidade. Ele permite variedade de conteúdos, mas exige regras claras para direitos autorais, checagem de links e indicação da origem. A confirmação final dependerá das decisões técnicas e da orientação.

## 7. Modelo inicial para os conteúdos

### 7.1 Metadados de identificação

- Título.
- URL ou arquivo.
- Autor, instituição ou fornecedor.
- Tipo de recurso: jogo, vídeo, texto, simulador, atividade desplugada, ferramenta, curso etc.
- Descrição objetiva e resumo elaborado pela curadoria.
- Idioma.

### 7.2 Metadados curriculares e pedagógicos

- Ano ou anos recomendados.
- Eixo da BNCC Computação.
- Objeto de conhecimento.
- Código e texto da habilidade.
- Objetivo de aprendizagem sugerido.
- Pré-requisitos.
- Nível de dificuldade.
- Função pedagógica: introdução, exploração, prática, sistematização, avaliação ou revisão.
- Metodologia compatível: aprendizagem baseada em projetos, resolução de problemas, investigação, programação em pares, rotação por estações, aula expositiva dialogada, atividade desplugada etc.
- Forma de participação: individual, dupla, grupo ou turma inteira.
- Duração estimada e possibilidade de divisão em etapas.

### 7.3 Metadados operacionais e de inclusão

- Dispositivo necessário.
- Necessidade de cadastro ou instalação.
- Gratuito, freemium ou pago.
- Quantidade de dispositivos por estudante ou grupo.
- Possibilidade de uso desplugado.
- Recursos de acessibilidade conhecidos: legenda, transcrição, contraste, navegação por teclado, leitor de tela, audiodescrição etc.
- Barreiras potenciais e alternativas acessíveis.
- Dados pessoais coletados e indicação de idade mínima, quando aplicável.

### 7.4 Proveniência, direitos e curadoria

- Licença de uso ou situação autoral.
- Permissão para copiar, adaptar, incorporar ou apenas criar link.
- Fonte original.
- Responsável pela curadoria.
- Data e versão da avaliação.
- Critérios de qualidade atendidos.
- Observações, limitações e riscos.

## 8. Estratégia de TAGs

Não se recomenda manter todas as informações em um único conjunto livre de TAGs. Isso produz sinônimos, grafias divergentes e filtros inconsistentes. O melhor desenho combina:

- **Campos controlados:** ano, eixo, habilidade, formato, duração, metodologia, infraestrutura, licença e acessibilidade.
- **Vocabulário controlado:** lista administrada de termos pedagógicos e temáticos.
- **TAGs livres:** usadas apenas para descoberta de assuntos emergentes e posteriormente revisadas.

Cada TAG deve ter nome preferido, definição, categoria, sinônimos, responsável e estado. Exemplo: “programação em blocos” pode ter “programação visual” como sinônimo, mas apenas um termo deve ser usado no filtro.

**Regra importante para a IA:** a geração não deve se basear em TAGs isoladas. Deve receber metadados estruturados, notas de curadoria, limitações e referências do recurso. TAGs ajudam a recuperar candidatos; não substituem a avaliação pedagógica.

## 9. Estrutura recomendada de um bom plano de aula

### 9.1 Elementos essenciais

- Definirei futuramente

### 9.2 Requisitos de qualidade do plano gerado

- Não inventar funcionalidades dos recursos.
- Não citar habilidade incompatível com o ano ou com o objetivo.
- Distribuir atividades dentro do tempo disponível.
- Explicitar como a metodologia acontece, e não apenas nomeá-la.
- Usar materiais realmente disponíveis no contexto informado.
- Propor evidências observáveis, não somente “participação”.
- Manter linguagem adequada à faixa etária.
- Permitir edição e decisão final do docente.
- Mostrar quais informações vieram do repositório e quais são sugestões da IA.

## 10. Plano de aula e plano de estudo: distinção inicial

| Dimensão | Plano de aula | Plano de estudo |
|---|---|---|
| Usuário principal | Docente | Estudante |
| Mediação | Conduzido por professor | Autônomo ou parcialmente orientado |
| Unidade de organização | Uma ou mais aulas | Sessões e metas ao longo de dias ou semanas |
| Linguagem | Técnica e pedagógica | Direta, motivadora e adequada à idade |
| Atividades | Gestão de turma, interação e intervenções | Leitura, prática, autoexplicação e revisão |
| Avaliação | Evidências coletadas pelo docente | Autoverificação, exercícios e marcos de progresso |
| Adaptação | Realidade da turma e recursos escolares | Ritmo, disponibilidade e conhecimentos do estudante |
| Segurança | Gestão docente de ferramentas e dados | Orientações explícitas para menores e responsáveis |
| Resultado | Roteiro de ensino editável | Jornada de aprendizagem acompanhável |

**Recomendação de escopo:** não implementar o plano de estudo no primeiro MVP. Primeiro valide a qualidade do vínculo entre recurso e plano de aula. Depois, trate o plano de estudo como um segundo produto, com pesquisa própria com estudantes e requisitos de proteção de menores.

## 11. Arquitetura futura de geração por IA — em aberto

**Decisão atual:** a arquitetura de IA não será definida, nem implementada, nesta etapa. RAG, modelo próprio, serviço de terceiros e abordagens híbridas permanecem alternativas de investigação futura, a serem discutidas com a orientadora e avaliadas segundo qualidade pedagógica, rastreabilidade, privacidade, custo, disponibilidade, manutenção e viabilidade acadêmica.

### 11.2 Conteúdo externo e direitos autorais

“Alimentar a IA” não deve significar copiar indiscriminadamente páginas, vídeos ou materiais protegidos. Para o protótipo, recomenda-se usar metadados, trechos permitidos, transcrições autorizadas, recursos abertos e resumos produzidos pela curadoria. O sistema deve guardar a licença e a origem de cada item.

## 13. Potenciais problemas e respostas propostas

### 13.1 Escopo excessivo

**Risco:** repositório, sistema de busca, curadoria, IA, dois públicos e avaliação podem equivaler a vários projetos.
**Resposta:** concentrar o TCC no catálogo curado e na geração de planos de aula; tratar plano de estudo como trabalho futuro.

### 13.2 Problema ainda não validado com docentes

**Risco:** afirmar que os planos atuais são descontextualizados sem evidência pode enfraquecer o trabalho.
**Resposta:** realizar entrevistas exploratórias ou questionário breve com docentes e complementar com literatura.

### 13.3 Ambiguidade curricular

**Risco:** associar recursos apenas a “competências” amplas ou misturar a BNCC geral com seu complemento de Computação.
**Resposta:** usar códigos e textos oficiais, registrar a versão normativa e modelar habilidades, objetos e eixos separadamente.

### 13.4 TAGs inconsistentes

**Risco:** uma taxonomia totalmente livre compromete filtros, métricas e geração.
**Resposta:** adotar facetas controladas, sinônimos e governança de vocabulário.

### 13.5 Curadoria subjetiva ou inviável

**Risco:** muitos recursos, critérios implícitos e avaliações não reproduzíveis.
**Resposta:** criar uma rubrica simples, registrar revisor e data, testar concordância em uma pequena amostra e limitar o corpus.

### 13.6 Links quebrados e mudança de conteúdo

**Risco:** recursos externos desaparecem ou mudam depois da curadoria.
**Resposta:** registrar última verificação, executar checagem periódica, permitir denúncia e manter estado do item.

### 13.7 Direitos autorais

**Risco:** copiar, incorporar ou processar materiais sem permissão.
**Resposta:** priorizar recursos abertos, registrar licença e diferenciar link, incorporação e hospedagem.

### 13.8 Alucinações e falsa autoridade da IA

**Risco:** a geração inventa funcionalidades, referências ou adequações pedagógicas.
**Resposta:** RAG, saída estruturada, validação, proveniência visível, resposta de insuficiência e revisão obrigatória do docente.

### 13.9 Planos formalmente completos, mas impraticáveis

**Risco:** o texto inclui todos os campos, porém ignora tempo, número de dispositivos, internet ou tamanho da turma.
**Resposta:** tratar restrições operacionais como entrada obrigatória e avaliá-las na rubrica.

### 13.10 Acessibilidade e inclusão tardias

**Risco:** recursos inadequados para parte dos estudantes e redesign no fim do projeto.
**Resposta:** incluir acessibilidade no modelo de dados, na curadoria, nos filtros e no plano desde o início.

### 13.11 Privacidade e proteção de menores

**Risco:** cadastro de estudantes ou envio de dados pessoais a serviços de IA.
**Resposta:** evitar contas estudantis no MVP, minimizar dados, não usar nomes ou perfis individuais e analisar LGPD e termos dos fornecedores.

### 13.12 Dependência do fornecedor de IA

**Risco:** custo, limite, indisponibilidade ou mudança de modelo.
**Resposta:** encapsular a chamada ao modelo, versionar prompts e modelo, limitar tamanho de contexto e manter um modo demonstrativo reproduzível.

### 13.13 Falta de critério de sucesso

**Risco:** demonstrar que a aplicação funciona tecnicamente, mas não que melhora o planejamento.
**Resposta:** comparar planos com e sem recuperação do repositório usando rubrica e avaliação por docentes.

## 14. Proposta de avaliação acadêmica

### 14.1 Comparação principal

Produzir planos para os mesmos cenários em duas condições:

1. **Linha de base:** modelo generativo recebe apenas habilidade e contexto básico.
2. **Proposta:** modelo recebe recursos curados recuperados pelo sistema, metadados e limitações.

Os avaliadores não devem saber qual condição produziu cada plano, quando isso for viável.

### 14.2 Rubrica candidata

Avaliar cada critério em escala definida, por exemplo de 0 a 4:

- Alinhamento à habilidade curricular.
- Clareza dos objetivos.
- Coerência entre objetivo, metodologia e avaliação.
- Especificidade do uso dos recursos.
- Viabilidade no tempo disponível.
- Viabilidade de infraestrutura.
- Adequação à faixa etária.
- Inclusão e acessibilidade.
- Rastreabilidade das fontes.
- Quantidade de correções necessárias antes do uso.

### 14.3 Métricas complementares

- Tempo para localizar recursos e concluir um plano.
- Percentual de planos considerados utilizáveis com pequenas alterações.
- Número de afirmações não apoiadas pelos registros do repositório.
- Usabilidade percebida, possivelmente com SUS.
- Comentários qualitativos dos docentes.

**Ponto ético:** se houver participação de professores ou estudantes em pesquisa, verificar antecipadamente as exigências da instituição, termos de consentimento e eventual submissão ao comitê de ética. Não iniciar coleta antes dessa definição.

## 16. Registro de pontos em aberto

| ID | Questão a decidir | Prioridade | Critério para decisão |
|---|---|---|---|
| A-001 | Qual é a formulação final do problema e da pergunta de pesquisa? | P0 | Deve ser investigável e vinculada à avaliação |
| A-002 | Como serão representadas as competências contempladas por cada habilidade? | P0 | Preservar fidelidade à fonte curricular e clareza na interface |
| A-003 | Quem ministra esses conteúdos no contexto pesquisado? | P0 | Define personas e recrutamento |
| A-004 | Quais anos e habilidades compõem o corpus avaliado? | P0 | Viabilidade de curadoria e diversidade mínima |
| A-005 | Quais campos do plano serão obrigatórios? | P0 | Basear no referencial e nas entrevistas |
| A-006 | Qual rubrica valida a qualidade de um recurso? | P0 | Reprodutibilidade da curadoria |
| A-007 | Qual rubrica avalia um plano de aula? | P0 | Deve responder à pergunta de pesquisa |
| A-008 | Quais metadados alimentam filtros e geração? | P0 | Equilibrar completude e custo de cadastro |
| A-009 | Qual será a arquitetura e o modelo de IA? | P1 | Investigar somente em fase futura: qualidade, rastreabilidade, custo e privacidade |
| A-010 | Recursos serão apenas referenciados ou também hospedados? | P1 | Direitos, custo e manutenção |
| A-011 | Quem cadastra e quem aprova recursos? | P1 | Governança e qualidade |
| A-012 | Será necessário login? | P1 | Recursos salvos/exportação versus privacidade |
| A-013 | Quais requisitos de acessibilidade serão obrigatórios? | P1 | Público e normas aplicáveis |
| A-014 | Qual backend, hospedagem e orçamento? | P1 | Google Workspace é hipótese; decisão com a orientadora |
| A-015 | Como lidar com indisponibilidade e mudanças nos links? | P1 | Manutenção e confiabilidade |
| A-016 | Qual será o nome da plataforma? | P2 | Identidade; não bloqueia pesquisa |
| A-017 | O plano de estudo entra no protótipo? | P2 | Recomendação atual: não |

## 17. Ideias de funcionalidades

### 17.1 Alto valor para o MVP

- Filtros combináveis com contagem de resultados.
- Indicação “por que este recurso combina com sua busca”.
- Comparação de dois ou três recursos.
- Coleção temporária para montar uma aula antes da geração.
- Selo de “verificado em” e alerta de link externo.
- Alternativa sem internet ou com poucos dispositivos.
- Ajustes rápidos do plano: reduzir tempo, trocar metodologia, aumentar colaboração, adaptar infraestrutura.
- Exportação com referências e ficha dos recursos.
- Histórico dos parâmetros, recursos e versão do modelo usados na geração.

### 17.2 Para versões posteriores

- Coleções compartilhadas entre professores.
- Avaliações e comentários moderados.
- Sugestões baseadas em lacunas do acervo.
- Painel de cobertura por ano, eixo e habilidade.
- Plano de estudo com metas, acompanhamento e autoavaliação.
- Integração com AVA ou calendário.

## 18. Cinco plataformas agregadoras para estudo comparativo

1. **MEC RED — Plataforma Integrada de Recursos Educacionais Digitais**
   Link: [Acessar a MEC RED](https://mecred.mec.gov.br/)
   Por que estudar: é o comparador brasileiro mais próximo. Reúne acervo próprio e links externos, recursos para a Educação Básica, coleções e funções sociais. Observar o modelo híbrido de repositório/referatório, os metadados, filtros e a contribuição de usuários.

2. **eduCAPES**
   Link: [Acessar o eduCAPES](https://educapes.capes.gov.br/)
   Por que estudar: reúne objetos educacionais em diferentes formatos, usa metadados e integra registros próprios e de repositórios parceiros. Observar licenças, Dublin Core, busca, proveniência e qualidade dos registros.

3. **OER Commons**
   Link: [Acessar o OER Commons](https://oercommons.org/)
   Por que estudar: biblioteca pública de recursos educacionais abertos com busca avançada, alinhamento a padrões educacionais, coleções e rubricas de avaliação. É uma referência especialmente útil para o desenho de alinhamento curricular e curadoria.

4. **MERLOT**
   Link: [Acessar o MERLOT](https://www.merlot.org/merlot/)
   Por que estudar: coleção internacional de materiais de aprendizagem com comunidade, categorização por disciplina, avaliações e revisão por pares. Observar como separa descoberta, qualidade, comentários e formas de uso pedagógico.

5. **Smithsonian Learning Lab**
   Link: [Acessar o Smithsonian Learning Lab](https://learninglab.si.edu/)
   Por que estudar: permite descobrir recursos digitais, organizá-los em coleções e transformá-los em experiências educacionais com notas, questões e TAGs. Observar a transição entre recurso isolado, coleção e atividade/planejamento.

### 18.1 Roteiro de análise das plataformas

Para cada plataforma, registrar:

- Público e problema atendido.
- Tipos e origem dos recursos.
- Modelo de curadoria e autoria.
- Estrutura de metadados e TAGs.
- Filtros e ordenação.
- Alinhamento a currículo ou padrões.
- Página de detalhe e explicação pedagógica.
- Coleções e compartilhamento.
- Critérios de qualidade, avaliação e moderação.
- Licenças e tratamento de links externos.
- Acessibilidade.
- Pontos fortes, fricções e ideias que não devem ser copiadas.

## 19. Melhor forma de desenvolver este trabalho comigo

### 19.1 Regra de colaboração

Use este registro como fonte de verdade. Ao trazer novas informações, indique se são **decisão**, **hipótese**, **dúvida**, **fonte**, **feedback de usuário** ou **resultado de teste**. Eu atualizarei a seção correspondente e o histórico.

Um pedido útil pode ser tão simples quanto: “Atualize o registro: decidimos limitar a avaliação ao 6º e 7º ano; motivo: prazo de curadoria.”

### 19.2 Entregas incrementais sugeridas

1. Delimitação do problema, pergunta, hipótese e objetivos.
2. Protocolo de busca e revisão de literatura.
3. Entrevista ou questionário exploratório com docentes.
4. Taxonomia da BNCC Computação e rubrica de curadoria.
5. Modelo de dados e contratos de API.
6. Fluxos de usuário e wireframes.
7. Backlog priorizado e critérios de aceite.
8. Protótipo do catálogo e filtros.
9. Protótipo de recuperação e geração estruturada.
10. Instrumento de avaliação, experimento e análise.
11. Redação dos capítulos e revisão de coerência e referências.

### 19.4 Uso responsável de IA na autoria acadêmica

- Confirmar as regras da instituição e do orientador sobre uso de IA.
- Manter registro do que foi produzido, revisado e decidido pelo autor.
- Não incluir referências não verificadas.
- Revisar conceitos, citações, dados e código antes de entregar.
- Usar a IA como apoio a análise, estrutura, prototipação e revisão; a responsabilidade acadêmica permanece do estudante.

## 22. Fontes normativas e páginas consultadas

- Conselho Nacional de Educação. [**Resolução CNE/CEB nº 1, de 4 de outubro de 2022: Normas sobre Computação na Educação Básica — Complemento à BNCC.**](https://portal.mec.gov.br/docman/outubro-2022-pdf/241671-rceb001-22/file)
- Ministério da Educação. [**BNCC Computação — complemento à BNCC.**](https://www.gov.br/mec/pt-br/escolas-conectadas/BNCCComputaoCompletodiagramado.pdf)
- MEC RED. [**Plataforma Integrada de Recursos Educacionais Digitais.**](https://mecred.mec.gov.br/)
- CAPES. [**Sobre o eduCAPES.**](https://educapes.capes.gov.br/redirect?action=about)
- OER Commons. [**Welcome to OER Commons.**](https://help.oercommons.org/support/solutions/articles/42000046848-welcome-to-oer-commons)
- OER Commons. [**Align to standards.**](https://help.oercommons.org/support/solutions/articles/42000046871-align-to-standards)
- MERLOT. [**Collection and search.**](https://www.merlot.org/merlot/)
- Smithsonian Learning Lab. [**About.**](https://learninglab.si.edu/about)
- Universidade Federal de Santa Maria. [**Guia de Identidade Visual da UFSM.**](https://www.ufsm.br/app/uploads/2022/01/manual_id_ufsm_2019_012.pdf)

## 23. Decisões e feedback incorporados ao protótipo — 12 de agosto de 2026

- **Decisão de interface:** a área de organização passa a se chamar **Meus Materiais**; **Favoritos** permanece como coleção automática e as demais coleções são criadas pelo docente.
- **Decisão de entrada:** ao selecionar **Entrar**, o protótipo cria uma sessão local e abre diretamente o Acervo. O modal e a autenticação Google ficam adiados para uma etapa futura.
- **Decisão de navegação:** a área autenticada apresenta **Meu perfil**, **Acervo**, **Meus Materiais**, **Minhas Turmas**, **Meus Planos de Aula**, **Criar Plano de Aula**, **Sobre** e **Sair**. Meu perfil, Minhas Turmas, Meus Planos de Aula e Criar Plano de Aula permanecem inativos nesta iteração e não alteram a URL quando selecionados.
- **Decisão da página Sobre:** a página mantém a apresentação do propósito, a explicação de Favoritos e Meus Materiais e um FAQ de seis perguntas; a seção separada “Como utilizar” foi removida.
- **Decisão de protótipo:** o planejamento por IA não é simulado nesta fase; os itens relacionados a planos permanecem inativos, não chamam serviços externos e não produzem um plano.
- **Decisão de descoberta:** busca e filtros permanecem visíveis no Acervo; em Favoritos e nas coleções pessoais começam recolhidos e podem ser exibidos por um controle de alternância.
- **Decisão de detalhe:** o recurso usa três abas — **Descrição**, **Informações adicionais** e **Fonte** — para reduzir a densidade da página sem perder metadados essenciais.
- **Decisão de organização:** o coração representa favoritar; o menu de três pontos abre a organização do recurso em coleções.
- **Decisão de conteúdo do corpus inicial:** o jogo de cyberbullying é associado à habilidade `EF07CO09`, com duração indicada de 50 minutos, uso individual ou em grupos, necessidade de internet, computador ou notebook e ausência de cadastro.
- **Fonte informada pelo autor do projeto:** licença indicada para o recurso: **CC BY-NC-ND 3.0 BR**. A licença e a autorização de uso da imagem deverão ser confirmadas na fonte original antes da publicação do TCC.
- **Feedback de interface:** a landing enfatiza recursos organizados e planos contextualizados, sem rotular explicitamente essas áreas como “funcionalidade futura”.

## 24. Decisões de repositório e publicação — 12 de agosto de 2026

- **Decisão de hospedagem do protótipo:** o frontend estático será versionado no GitHub e publicado pelo GitHub Pages a partir da branch `main`.
- **Decisão de integração contínua:** todo push para `main` executa checagem de tipos, lint, testes unitários, build e testes E2E antes de publicar; pull requests executam as verificações sem deploy.
- **Decisão de roteamento:** a versão publicada usa rotas por hash. O endereço externo mantém o subdiretório do repositório e coloca a rota lógica depois de `#`, evitando erro 404 em atualizações de página.
- **Decisão de ativos:** apenas imagens necessárias ao protótipo e com crédito explícito entram em `public/`. Referências visuais de processo sem licença de redistribuição comprovada permanecem localmente em `.private-references/` e são ignoradas pelo Git.
- **Decisão de licenciamento:** até que o autor escolha uma licença aberta, código e documentação permanecem com direitos reservados. Ativos de terceiros mantêm suas licenças e são listados em `docs/creditos-e-licencas.md`.
- **Decisão de documentação:** `README.md` serve como porta de entrada; `docs/estado-atual.md` registra o que está realmente implementado; a especificação e este registro continuam preservando visão de produto e decisões acadêmicas.
- **Decisão de persistência:** a publicação no Pages não altera o modelo de dados desta etapa; sessão, favoritos e pastas continuam somente no `localStorage`, sem sincronização remota.
