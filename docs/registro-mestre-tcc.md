# Registro mestre da proposta de TCC

**Tema provisório:** Plataforma web de curadoria de recursos para o ensino de Computação, alinhada à BNCC, com criação estruturada de planos de aula
**Versão:** 1.1
**Data de atualização:** 30 de agosto de 2026
**Função deste arquivo:** registrar a visão e as decisões acadêmicas do TCC. A especificação reúne os requisitos aceitos; o estado atual e os testes descrevem o que está implementado.

> **Hipótese central do projeto.** O diferencial mais defensável não é apenas reunir links nem produzir textos extensos de planejamento. É preservar a relação **habilidade curricular → material curado → metodologia executável → avaliação, quando aplicável**. Acervo e criador são fluxos de navegação independentes; no criador, o docente escolhe um material alinhado depois de definir ano e habilidade. O recorte atual não utiliza IA.

## 1. Resumo da proposta

O trabalho propõe desenvolver e avaliar um protótipo de plataforma web que reúna conteúdos relacionados ao ensino de Computação na Educação Básica, do 4º ao 9º ano do Ensino Fundamental. O acervo poderá incluir sites, jogos, textos, vídeos, atividades, ferramentas e outros recursos. A experiência será orientada por três pilares: **Exposição**, **Organização** e **Filtragem**.

O usuário pode navegar pelo acervo e localizar recursos associados a determinado ano escolar e a elementos da BNCC Computação. Em um fluxo de navegação independente, pode criar uma proposta única de plano para uma, duas ou três aulas de 50 minutos. Ano e habilidade filtram os materiais compatíveis e o docente escolhe qual deles fundamentará o plano. A intenção é reduzir um problema observado em geradores generalistas: planos aparentemente completos, mas pouco aplicáveis, com metodologia genérica, materiais desconectados das ações e distribuição irreal de tempo.

O recorte de criação de planos é determinístico e baseado em opções controladas, metadados curatoriais e conteúdo pedagógico previamente estruturado. Há seleção explícita do material, mas não há troca entre propostas alternativas nem chamada a modelos de inteligência artificial nesta fase. Metodologia e avaliação permanecem provisoriamente como lorem ipsum até definição com a orientadora.

Há uma possibilidade futura de geração de planos de estudo para estudantes. Essa funcionalidade ainda não está definida e, por envolver outro público, outra linguagem e outra lógica pedagógica, é tratada neste registro como extensão, e não como parte confirmada do produto mínimo viável.

## 2. Formulação recomendada do problema

Professores que precisam trabalhar habilidades de Computação encontram grande quantidade de recursos digitais dispersos, descritos de forma inconsistente e nem sempre relacionados claramente ao currículo ou a formas concretas de aplicação. Ao planejar, também encontram modelos formalmente completos, porém pouco úteis, porque nomeiam uma metodologia sem explicar como executá-la, separam materiais das atividades ou distribuem ações demais no tempo disponível.

**Problema de pesquisa provisório:** como apoiar docentes do 4º ao 9º ano do Ensino Fundamental na descoberta e no uso pedagógico de recursos de Computação, criando planos cuja metodologia seja clara, viável no tempo disponível e fundamentada em materiais curados compatíveis?

**Pergunta de pesquisa candidata:** em que medida um fluxo estruturado que recupera automaticamente materiais curados compatíveis com a habilidade melhora a clareza e a aplicabilidade de planos de aula para docentes do 4º ao 9º ano do Ensino Fundamental?

**Possível contribuição acadêmica:** propor e avaliar um modelo de metadados para recursos e um modelo estruturado de plano de aula, com foco na ligação rastreável entre currículo, material curado, objetivo, metodologia e avaliação opcional.

## 3. Escopo já definido

### 3.1 Público e etapa escolar

- Público principal: docentes que ensinam conteúdos de Computação.
- Etapa: Ensino Fundamental, do 4º ao 9º ano, incluindo 4º e 5º anos dos anos iniciais e todos os anos finais.
- Faixa etária de referência: aproximadamente 9 a 14 anos, reconhecendo que idade e ano podem variar.
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

### 3.4 Elementos do plano de aula no recorte atual

- Tema da aula.
- Ano escolar, distinto de uma turma ou classe específica.
- Uma, duas ou três aulas, sempre com 50 minutos cada.
- Habilidade curricular e seus vínculos curriculares derivados.
- Material do Acervo alinhado ao ano e à habilidade.
- Objetivo de aprendizagem.
- Tipo de metodologia controlado: **expositiva dialogada**, **ativa/prática** ou **combinada**.
- Metodologia preenchida provisoriamente com lorem ipsum; a estrutura pedagógica definitiva será discutida com a orientadora.
- Avaliação, quando aplicável.

Não serão campos do plano nesta fase: turma, evidências de aprendizagem,
anotações ou objeto de conhecimento. O docente seleciona um material compatível
no formulário. A criação produz uma única proposta, exibida em **Em Blocos** ou
**Descritivo** sem alterar seu conteúdo pedagógico.

## 4. Refinamento conceitual necessário

### 4.1 Ensino de Computação

O escopo da plataforma é o **ensino de Computação**. A expressão “informática na educação” poderá aparecer somente quando for conceitualmente pertinente na fundamentação teórica, pois ela também pode significar o uso de tecnologias para ensinar outras disciplinas. A referência curricular principal será a BNCC Computação.

### 4.2 Competência e habilidade não são sinônimos

Para a interface e o banco de dados, a unidade de filtragem será a **habilidade**, identificada por código e associada ao ano escolar. As competências são mais amplas, mas são pedagogicamente importantes: depois de escolher uma habilidade, o professor deverá conseguir visualizar as **competências relacionadas**. A estrutura de referência deve preservar a hierarquia oficial, por exemplo:

**Etapa → ano → eixo → objeto de conhecimento → habilidade → competência relacionada.**

A BNCC Computação foi instituída como complemento à BNCC pela Resolução CNE/CEB nº 1/2022 e trabalha três eixos: pensamento computacional, mundo digital e cultura digital. A plataforma deve declarar a edição e a fonte normativa usadas, sem reescrever livremente os enunciados oficiais.

O documento normativo não publica uma matriz que associe individualmente cada
habilidade às sete competências do Ensino Fundamental. Portanto, a relação
**habilidade → competência** do Acervo é uma decisão curatorial, nunca um dado
atribuído à BNCC. Cada correspondência registra o ano, o eixo, o objeto, a
habilidade, as competências relacionadas, a justificativa, a força
(`forte` ou `parcial`) e o estado de validação. Correspondências ainda não
aprovadas permanecem identificadas como **pendentes de validação**.

### 4.3 Repositório, referatório ou catálogo curado

Há três modelos diferentes:

- **Repositório:** hospeda os arquivos.
- **Referatório:** mantém metadados e links para recursos externos.
- **Modelo híbrido:** hospeda alguns materiais e referencia outros.

O **modelo híbrido** é o candidato atual: hospedar materiais próprios ou autorizados quando necessário e referenciar recursos externos de qualidade. Ele permite variedade de conteúdos, mas exige regras claras para direitos autorais, checagem de links e indicação da origem. A confirmação final dependerá das decisões técnicas e da orientação.

## 5. Modelo inicial para os conteúdos

### 5.1 Metadados de identificação

- Título.
- URL ou arquivo.
- Autor, instituição ou fornecedor.
- Tipo de recurso: jogo, vídeo, texto, simulador, atividade desplugada, ferramenta, curso etc.
- Descrição objetiva e resumo elaborado pela curadoria.
- Idioma.

### 5.2 Metadados curriculares e pedagógicos

- Ano ou anos recomendados.
- Eixo da BNCC Computação.
- Objeto de conhecimento.
- Código e texto da habilidade.
- Competência ou competências relacionadas, com texto oficial e indicação de que a relação é curatorial quando não vier da fonte do material.
- Justificativa e força da correspondência curricular.
- Objetivo de aprendizagem sugerido.
- Pré-requisitos.
- Nível de dificuldade.
- Função pedagógica: introdução, exposição, exploração, prática, consolidação ou avaliação.
- Proposta de aplicação: orientação curatorial concisa sobre como empregar o recurso em aula.
- Sugestão de avaliação: possibilidade de acompanhamento coerente com a aplicação, sem torná-la obrigatória.
- Metodologia compatível: aprendizagem baseada em projetos, resolução de problemas, investigação, programação em pares, rotação por estações, aula expositiva dialogada, atividade desplugada etc.
- Forma de participação: individual, dupla, grupo ou turma inteira.
- Duração estimada e possibilidade de divisão em etapas.

Quando um recurso serve a mais de um ano, cada combinação
**ano + eixo + objeto + habilidade + competências** deve ser armazenada como
um alinhamento independente. O sistema não pode cruzar a habilidade de um ano
com outro ano recomendado para o mesmo recurso, nem nos filtros nem no criador
de planos.

No contrato geral, os campos curatoriais podem permanecer ausentes enquanto o
recurso está pendente. No recorte provisório atual, alinhamento ano–habilidade e
URL segura bastam para participar do criador, porque metodologia e avaliação
ainda usam placeholders. Função, proposta, duração e sugestão avaliativa serão
reavaliadas quando o modelo pedagógico definitivo for definido.

### 5.3 Metadados operacionais e de inclusão

- Dispositivo necessário.
- Necessidade de cadastro ou instalação.
- Gratuito, freemium ou pago.
- Quantidade de dispositivos por estudante ou grupo.
- Possibilidade de uso desplugado.
- Recursos de acessibilidade conhecidos: legenda, transcrição, contraste, navegação por teclado, leitor de tela, audiodescrição etc.
- Barreiras potenciais e alternativas acessíveis.
- Dados pessoais coletados e indicação de idade mínima, quando aplicável.

### 5.4 Proveniência, direitos e curadoria

- Licença de uso ou situação autoral.
- Permissão para copiar, adaptar, incorporar ou apenas criar link.
- Fonte original.
- Responsável pela curadoria.
- Data e versão da avaliação.
- Critérios de qualidade atendidos.
- Observações, limitações e riscos.

## 6. Estratégia de TAGs

Não se recomenda manter todas as informações em um único conjunto livre de TAGs. Isso produz sinônimos, grafias divergentes e filtros inconsistentes. O melhor desenho combina:

- **Campos controlados:** ano, eixo, habilidade, formato, duração, metodologia, infraestrutura, licença e acessibilidade.
- **Vocabulário controlado:** lista administrada de termos pedagógicos e temáticos.
- **TAGs livres:** usadas apenas para descoberta de assuntos emergentes e posteriormente revisadas.

Cada TAG deve ter nome preferido, definição, categoria, sinônimos, responsável e estado. Exemplo: “programação em blocos” pode ter “programação visual” como sinônimo, mas apenas um termo deve ser usado no filtro.

**Regra importante de produto:** TAGs ajudam a descobrir recursos, mas não
substituem metadados estruturados, notas de curadoria, limitações nem avaliação
pedagógica. O criador consulta o Acervo internamente e só pode compor o plano
quando houver conteúdo curado compatível com as opções selecionadas.

## 7. Estrutura do plano de aula

### 7.1 Elementos essenciais

- **Tema:** texto informado pelo docente.
- **Ano escolar:** do 4º ao 9º ano, sem identificar uma turma concreta.
- **Quantidade:** uma, duas ou três aulas de 50 minutos.
- **Alinhamento curricular do plano:** habilidade selecionada, eixo e competência relacionados conforme a fonte curricular validada. O objeto de conhecimento permanece no Acervo, mas não integra o plano.
- **Objetivo:** texto revisável que expressa o que se pretende ensinar no conjunto de aulas.
- **Tipo de metodologia:** expositiva dialogada, ativa/prática ou combinada.
- **Metodologia no protótipo atual:** texto provisório de lorem ipsum até que a estrutura pedagógica seja definida com a orientadora. Os materiais aparecem em um bloco próprio em **Em Blocos** e por aula em **Descritivo**.
- **Avaliação:** opcional e, no protótipo atual, preenchida por um segundo lorem ipsum provisório.

Os três tipos permanecem disponíveis para os materiais elegíveis enquanto o
conteúdo metodológico for provisório.

Cada aula preserva cinco minutos de margem operacional. Sem avaliação, a
atividade central recebe 45 minutos. Quando a avaliação é incluída, a última
aula reserva 35 minutos para a atividade, dez para a avaliação e cinco para a
margem, sem ultrapassar os 50 minutos.

O plano é um único conteúdo estruturado com duas formas de leitura:

- **Em Blocos:** prioriza consulta rápida durante a aula;
- **Descritivo:** detalha a execução sem acrescentar ou trocar a proposta pedagógica.

Não haverá, nesta fase, campos de turma, evidências de aprendizagem, anotações
ou objeto de conhecimento. O material do Acervo é escolhido explicitamente,
mas não há ação para gerar ou trocar entre propostas alternativas.

### 7.2 Requisitos de qualidade do plano criado

- Não inventar funcionalidades dos recursos.
- Não citar habilidade incompatível com o ano ou com o objetivo.
- Distribuir atividades dentro do tempo disponível.
- Explicitar como a metodologia acontece, e não apenas nomeá-la.
- Relacionar cada material diretamente à ação metodológica em que será usado.
- Quando houver avaliação, descrever uma verificação coerente com o objetivo, e não somente “participação”.
- Manter linguagem adequada à faixa etária.
- Permitir revisão e decisão final do docente.
- Preservar o mesmo conteúdo nas visualizações Em Blocos e Descritivo.

## 8. Plano de aula e plano de estudo: distinção inicial

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

**Recomendação de escopo:** não implementar o plano de estudo no primeiro MVP. Primeiro valide a qualidade do Acervo, do fluxo estruturado de plano de aula e do vínculo interno entre habilidade, material recuperado e metodologia. Depois, trate o plano de estudo como um segundo produto, com pesquisa própria com estudantes e requisitos de proteção de menores.

## 9. Criação estruturada sem IA

**Decisão atual:** a criação de planos não utiliza IA nesta fase. O resultado é
composto de maneira determinística a partir de dados curriculares
validados, opções controladas e conteúdos compatíveis recuperados do Acervo.
Função pedagógica, proposta de aplicação, sugestão de avaliação, limitações e
demais metadados curatoriais fundamentam a metodologia. Se essa base não for
suficiente, o sistema informa a impossibilidade de criar o plano em vez de
preencher lacunas com conteúdo genérico.
Não haverá prompt, streaming, escolha de modelo, regeneração ou troca de
proposta. Uma eventual investigação futura de IA deverá ser especificada como
outro recorte e não pode ser introduzida incidentalmente no fluxo atual.

### 9.1 Conteúdo externo e direitos autorais

Mesmo sem IA, a curadoria não deve copiar indiscriminadamente páginas, vídeos
ou materiais protegidos. O protótipo deve usar metadados, trechos permitidos,
recursos abertos e resumos produzidos pela curadoria, guardando licença e
origem de cada item.

## 10. Potenciais problemas e respostas propostas

### 10.1 Escopo excessivo

**Risco:** repositório, sistema de busca, curadoria, planejamento e dois públicos podem equivaler a vários projetos.
**Resposta:** manter Acervo e criação de planos como fluxos de navegação independentes, preservar somente o vínculo interno necessário para recuperar a base curada, limitar o plano a uma, duas ou três aulas de 50 minutos e tratar plano de estudo e IA como trabalhos futuros.

### 10.2 Problema ainda não validado com docentes

**Risco:** afirmar que os planos atuais são descontextualizados sem evidência pode enfraquecer o trabalho.
**Resposta:** realizar entrevistas exploratórias ou questionário breve com docentes e complementar com literatura.

### 10.3 Ambiguidade curricular

**Risco:** associar recursos apenas a “competências” amplas ou misturar a BNCC geral com seu complemento de Computação.
**Resposta:** usar códigos e textos oficiais, registrar a versão normativa e modelar habilidades, objetos e eixos separadamente.

### 10.4 TAGs inconsistentes

**Risco:** uma taxonomia totalmente livre compromete filtros, métricas e composição estruturada.
**Resposta:** adotar facetas controladas, sinônimos e governança de vocabulário.

### 10.5 Curadoria subjetiva ou inviável

**Risco:** muitos recursos, critérios implícitos e avaliações não reproduzíveis.
**Resposta:** criar uma rubrica simples, registrar revisor e data, testar concordância em uma pequena amostra e limitar o corpus.

### 10.6 Links quebrados e mudança de conteúdo

**Risco:** recursos externos desaparecem ou mudam depois da curadoria.
**Resposta:** registrar última verificação, executar checagem periódica, permitir denúncia e manter estado do item.

### 10.7 Direitos autorais

**Risco:** copiar, incorporar ou processar materiais sem permissão.
**Resposta:** priorizar recursos abertos, registrar licença e diferenciar link, incorporação e hospedagem.

### 10.8 Falsa completude do plano estruturado

**Risco:** opções controladas dão aparência de precisão, mas a metodologia continua genérica ou pedagogicamente incoerente.
**Resposta:** curar o conteúdo pedagógico, validar combinações, limitar os tipos de metodologia, exigir base compatível no Acervo e manter revisão e decisão final do docente.

### 10.9 Planos formalmente completos, mas impraticáveis

**Risco:** o texto inclui todos os campos, porém propõe ações demais para blocos de 50 minutos ou cita materiais que não aparecem na execução.
**Resposta:** validar o orçamento de tempo de cada aula e exigir que os materiais estejam associados diretamente às ações metodológicas.

### 10.10 Acessibilidade e inclusão tardias

**Risco:** recursos inadequados para parte dos estudantes e redesign no fim do projeto.
**Resposta:** incluir acessibilidade no modelo de dados e na curadoria do Acervo e garantir que o fluxo de plano seja acessível desde o início.

### 10.11 Privacidade e proteção de menores

**Risco:** cadastro ou exposição indevida de dados de estudantes.
**Resposta:** evitar contas estudantis no MVP, não incluir turma nem nomes individuais no plano e minimizar os dados armazenados.

### 10.12 Divergência entre visualizações

**Risco:** as versões enxuta e descritiva apresentarem planos diferentes ou ficarem inconsistentes após ajustes.
**Resposta:** manter um único plano estruturado e derivar dele ambas as visualizações.

### 10.13 Falta de critério de sucesso

**Risco:** demonstrar que a aplicação funciona tecnicamente, mas não que melhora o planejamento.
**Resposta:** aplicar uma rubrica ao plano estruturado e realizar avaliação por docentes, separando qualidade pedagógica de funcionamento técnico.

## 11. Proposta de avaliação acadêmica

### 11.1 Avaliação principal

Produzir planos estruturados para cenários equivalentes, variando quantidade de
aulas e tipo de metodologia. Avaliar tanto **Em Blocos** quanto **Descritivo**,
confirmando que as duas representam a mesma proposta. O desenho comparativo e
a eventual linha de base ainda deverão ser definidos antes da coleta.

### 11.2 Rubrica candidata

Avaliar cada critério em escala definida, por exemplo de 0 a 4:

- Alinhamento à habilidade curricular.
- Clareza dos objetivos.
- Coerência entre objetivo, metodologia e avaliação.
- Clareza operacional da metodologia.
- Coerência entre a habilidade e os materiais recuperados do Acervo.
- Viabilidade no tempo disponível.
- Integração dos materiais às ações descritas.
- Adequação à faixa etária.
- Inclusão e acessibilidade.
- Coerência da avaliação, quando houver.
- Equivalência entre as visualizações Em Blocos e Descritivo.
- Quantidade de correções necessárias antes do uso.

### 11.3 Métricas complementares

- Tempo para configurar, compreender e concluir um plano.
- Percentual de planos considerados utilizáveis com pequenas alterações.
- Número de ações que excedem o tempo disponível ou citam materiais não integrados.
- Percentual de solicitações atendidas com base curada suficiente.
- Usabilidade percebida, possivelmente com SUS.
- Comentários qualitativos dos docentes.

**Ponto ético:** se houver participação de professores ou estudantes em pesquisa, verificar antecipadamente as exigências da instituição, termos de consentimento e eventual submissão ao comitê de ética. Não iniciar coleta antes dessa definição.

## 12. Registro de pontos em aberto

| ID | Questão a decidir | Prioridade | Critério para decisão |
|---|---|---|---|
| A-001 | Qual é a formulação final do problema e da pergunta de pesquisa? | P0 | Deve ser investigável e vinculada à avaliação |
| A-002 | Quem fará a validação acadêmica final das correspondências curatoriais entre recursos, habilidades e competências? | P0 | Preservar fidelidade curricular e tornar a aprovação auditável |
| A-003 | Quem ministra esses conteúdos no contexto pesquisado? | P0 | Define personas e recrutamento |
| A-004 | Quais habilidades compõem o corpus avaliado do 4º ao 9º ano? | P0 | Viabilidade de curadoria e diversidade mínima |
| A-006 | Qual rubrica valida a qualidade de um recurso? | P0 | Reprodutibilidade da curadoria |
| A-007 | Qual rubrica avalia um plano de aula? | P0 | Deve responder à pergunta de pesquisa |
| A-008 | Quais conteúdos estruturados alimentam cada combinação de habilidade e metodologia? | P0 | Equilibrar cobertura, qualidade pedagógica e custo de curadoria |
| A-010 | Recursos serão apenas referenciados ou também hospedados? | P1 | Direitos, custo e manutenção |
| A-011 | Quem cadastra e quem aprova recursos? | P1 | Governança e qualidade |
| A-012 | Será necessário login? | P1 | Recursos salvos/exportação versus privacidade |
| A-013 | Quais requisitos de acessibilidade serão obrigatórios? | P1 | Público e normas aplicáveis |
| A-014 | Qual backend, hospedagem e orçamento? | P1 | Google Workspace é hipótese; decisão com a orientadora |
| A-015 | Como lidar com indisponibilidade e mudanças nos links? | P1 | Manutenção e confiabilidade |
| A-016 | Qual será o nome da plataforma? | P2 | Identidade; não bloqueia pesquisa |
| A-017 | O plano de estudo entra no protótipo? | P2 | Recomendação atual: não |

## 13. Ideias de funcionalidades

### 13.1 Alto valor para o MVP

- Filtros combináveis com contagem de resultados.
- Indicação “por que este recurso combina com sua busca”.
- Selo de “verificado em” e alerta de link externo.
- Função pedagógica visível e proposta de aplicação e sugestão de avaliação mantidas internamente em cada recurso.
- Criação de uma proposta de plano para uma, duas ou três aulas de 50 minutos.
- Escolha entre metodologia expositiva dialogada, ativa/prática ou combinada.
- Recuperação automática de conteúdo compatível do Acervo, com resposta de base insuficiente.
- Visualizações enxuta e descritiva derivadas do mesmo plano.

### 13.2 Para versões posteriores

- Coleções compartilhadas entre professores.
- Avaliações e comentários moderados.
- Sugestões baseadas em lacunas do acervo.
- Painel de cobertura por ano, eixo e habilidade.
- Exportação e histórico de planos, após especificação própria.
- Plano de estudo com metas, acompanhamento e autoavaliação.
- Integração com AVA ou calendário.

## 14. Cinco plataformas agregadoras para estudo comparativo

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

### 14.1 Roteiro de análise das plataformas

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

## 15. Fontes normativas e páginas consultadas

- Conselho Nacional de Educação. [**Resolução CNE/CEB nº 1, de 4 de outubro de 2022: Normas sobre Computação na Educação Básica — Complemento à BNCC.**](https://portal.mec.gov.br/docman/outubro-2022-pdf/241671-rceb001-22/file)
- Ministério da Educação. [**BNCC Computação — complemento à BNCC.**](https://www.gov.br/mec/pt-br/escolas-conectadas/BNCCComputaoCompletodiagramado.pdf)
- MEC RED. [**Plataforma Integrada de Recursos Educacionais Digitais.**](https://mecred.mec.gov.br/)
- CAPES. [**Sobre o eduCAPES.**](https://educapes.capes.gov.br/redirect?action=about)
- OER Commons. [**Welcome to OER Commons.**](https://help.oercommons.org/support/solutions/articles/42000046848-welcome-to-oer-commons)
- OER Commons. [**Align to standards.**](https://help.oercommons.org/support/solutions/articles/42000046871-align-to-standards)
- MERLOT. [**Collection and search.**](https://www.merlot.org/merlot/)
- Smithsonian Learning Lab. [**About.**](https://learninglab.si.edu/about)
- Universidade Federal de Santa Maria. [**Guia de Identidade Visual da UFSM.**](https://www.ufsm.br/app/uploads/2022/01/manual_id_ufsm_2019_012.pdf)
- Lightbot. [**Versão web e ajuda integrada.**](https://www.lightbot.lu/#/welcome)
- Blockly Games. [**Jogos para os programadores de amanhã.**](https://blockly.games/?lang=pt-br)
- Blockly Games. [**Informações para educadores.**](https://blockly.games/about?lang=pt-br)
- Blockly Games. [**Repositório oficial e licença Apache 2.0.**](https://github.com/blockly-games/blockly-games)
- Rozelma França. [**Materiais didáticos.**](https://www.falecomrozelma.com/materiaisdidaticos)
- Rozelma França. [**Lua & Bit-Bit — Programando com Variáveis.**](https://www.falecomrozelma.com/aventurasdelua)
- Rozelma França. [**Sertão.bit.**](https://www.falecomrozelma.com/sertaobit)
- Lucas Silva e Rozelma França. [**Aventuras Digitais — Tornando-se um Cidadão Digital.**](https://www.falecomrozelma.com/aventurasdigitais)
- Wellington Pereira e Rozelma França. [**Cyberbullying — Uma Brincadeira de Mau Gosto.**](https://www.falecomrozelma.com/cyberbullying)
- Google. [**Interland.**](https://beinternetawesome.withgoogle.com/pt-br_br/interland)
- Google. [**Perguntas frequentes do Seja Incrível na Internet.**](https://beinternetawesome.withgoogle.com/pt-br_br/perguntas-frequentes)
- Google. [**Recursos para educadores do Seja Incrível na Internet.**](https://beinternetawesome.withgoogle.com/pt-br_br/educadores)

## 16. Decisões e feedback incorporados ao protótipo — 12 de agosto de 2026

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

## 17. Decisões de repositório e publicação — 12 de agosto de 2026

- **Decisão de hospedagem do protótipo:** o frontend estático será versionado no GitHub e publicado pelo GitHub Pages a partir da branch `main`.
- **Decisão de integração contínua:** todo push para `main` executa checagem de tipos, lint, testes unitários, build e testes E2E antes de publicar; pull requests executam as verificações sem deploy.
- **Decisão de roteamento:** a versão publicada usa rotas por hash. O endereço externo mantém o subdiretório do repositório e coloca a rota lógica depois de `#`, evitando erro 404 em atualizações de página.
- **Decisão de ativos:** apenas imagens necessárias ao protótipo e com crédito explícito entram em `public/`. Referências visuais de processo sem licença de redistribuição comprovada permanecem localmente em `.private-references/` e são ignoradas pelo Git.
- **Decisão de licenciamento:** até que o autor escolha uma licença aberta, código e documentação permanecem com direitos reservados. Ativos de terceiros mantêm suas licenças e são listados em `docs/creditos-e-licencas.md`.
- **Decisão de documentação:** `README.md` serve como porta de entrada; `docs/estado-atual.md` registra o que está realmente implementado; a especificação e este registro continuam preservando visão de produto e decisões acadêmicas.
- **Decisão de organização:** a raiz pública mantém apenas entradas essenciais; configurações ficam em `config/`, testes de interface em `tests/e2e/`, registros acadêmicos em `docs/` e o histórico do plano em `docs/historico/`.
- **Decisão sobre `.github`:** somente o workflow de qualidade e GitHub Pages permanece nessa pasta, pois ele é necessário para validar e publicar automaticamente o site.
- **Decisão de persistência:** a publicação no Pages não altera o modelo de dados desta etapa; sessão, favoritos e pastas continuam somente no `localStorage`, sem sincronização remota.

## 18. Recorte de criação de planos — 24 de agosto de 2026

- **Decisão de navegação:** **Criar Plano de Aula** está ativo em `/app/plano-de-aula`; **Meus Planos de Aula** permanece inativo e não entra automaticamente nesse recorte.
- **Decisão de independência:** o Acervo e a criação de planos são fluxos de navegação independentes. O formulário não apresenta recurso como campo, mas o sistema recupera e seleciona internamente conteúdos compatíveis do Acervo para fundamentar metodologia e avaliação.
- **Decisão de duração:** cada plano cobre uma, duas ou três aulas, sempre com 50 minutos por aula. Cada aula preserva cinco minutos de margem; a avaliação opcional ocupa dez minutos da última aula e reduz sua atividade central de 45 para 35 minutos.
- **Decisão de campos:** o formulário usa ano escolar, mas não uma turma concreta. Turma, evidências de aprendizagem, anotações e recurso não fazem parte do plano desta fase.
- **Decisão de metodologia:** o docente escolhe entre **expositiva dialogada**, **ativa/prática** e **combinada**, mas a interface oferece somente os tipos compatíveis com a função pedagógica dos conteúdos disponíveis. A metodologia explica a execução e incorpora os materiais nas ações correspondentes.
- **Decisão de avaliação:** a avaliação é opcional; o controle fica disponível somente quando a base compatível possui sugestão cadastrada.
- **Decisão de apresentação:** existe um único plano com visualizações **enxuta** e **descritiva**; alternar a visualização não cria, substitui ou altera a proposta.
- **Decisão de composição:** não há IA, regeneração nem ação de troca de proposta ou do conteúdo selecionado nesta fase. Cada aula exige uma proposta distinta com função pedagógica correspondente; quando não há cobertura suficiente, o sistema informa a insuficiência, não reutiliza o mesmo conteúdo e não produz texto genérico. IA pode ser investigada futuramente mediante especificação própria.
- **Decisão de enriquecimento do Acervo:** o modelo de recurso contém **função pedagógica**, **proposta de aplicação** e **sugestão de avaliação**. Os campos são opcionais no contrato geral para representar dados pendentes; função, proposta e a duração já existente são obrigatórias para participar do criador, enquanto a sugestão de avaliação permanece opcional. Esses metadados pertencem ao registro curado do recurso e também alimentam internamente a composição do plano.

## 19. Ajustes provisórios do plano — 24 de agosto de 2026

- **Decisão de detalhe:** **Proposta de aplicação** e **Sugestão de avaliação** deixam de aparecer em **Informações adicionais**. Os dados permanecem internos para elegibilidade e avaliação.
- **Decisão curricular:** o objeto de conhecimento continua no Acervo, mas é removido do formulário, do contrato e das visualizações do plano.
- **Decisão metodológica provisória:** a metodologia visível contém somente um texto canônico de lorem ipsum. Sua estrutura definitiva será discutida com a orientadora antes de nova implementação.
- **Decisão de apresentação:** o plano não usa chips ou etiquetas flutuantes para habilidade, eixo, tipo metodológico, recurso, materiais ou distribuição de tempo.
- **Decisão de visualização:** a versão enxuta usa blocos separados de **Materiais**, **BNCC**, **Objetivo**, **Metodologia** e **Avaliação**. A descritiva passa a ser um documento organizado cronologicamente por aula.
- **Decisão de texto:** foram removidos os textos auxiliares que explicavam preenchimento obrigatório, incorporação automática de materiais, dependência da função pedagógica e composição sem IA.

## 20. Ampliação curricular e integridade dos metadados — 27 e 28 de agosto de 2026

- **Decisão de recorte:** o Ensino Fundamental passa a abranger do 4º ao 9º ano. Isso inclui 4º e 5º anos dos anos iniciais e todos os anos finais.
- **Decisão técnica:** a lista de anos aceitos é única no domínio e compartilhada pelos filtros, pelo criador de planos e pela validação do compositor.
- **Decisão de exclusão da Educação Infantil:** o recorte atual não abrange Educação Infantil. Por esse motivo, nenhuma das 33 atividades do projeto **Descobrindo o Computar**, declaradas para crianças de 4 a 5 anos, integra o catálogo ativo.
- **Regra de integridade:** título, turma/ano, eixo, habilidade, competência, descrição, informações adicionais e fonte não podem ser apresentados como fatos sem base. Dados factuais vêm da fonte original; alinhamentos curriculares autorizados pelo autor do projeto podem ser produzidos por curadoria, desde que tragam justificativa, força e estado pendente de validação.
- **Regra de imagem:** imagens de terceiros só podem ser incorporadas quando houver licença ou permissão verificável; caso contrário, o catálogo deve referenciar a imagem externa ou usar o placeholder, preservando fonte e situação autoral.

## 21. Incorporação da coleção Computação Desplugada — Unicamp — 28 de agosto de 2026

- **Decisão de corpus:** foram incorporadas as 23 atividades publicadas na coleção **Computação Desplugada — Unicamp**, além do jogo de cyberbullying já existente, totalizando 24 recursos no catálogo local.
- **Fonte dos fatos:** título, descrição, indicação ampla de público, materiais, arquivos complementares e links são extraídos das páginas oficiais de cada atividade. A ausência de duração, função pedagógica, proposta de aplicação ou avaliação não é preenchida por suposição.
- **Fonte normativa:** códigos, textos de habilidades e competências são preservados a partir do **Complemento à BNCC Computação (2022)**.
- **Natureza do alinhamento:** a Unicamp não publica correspondências dessas atividades com a BNCC Computação. Ano específico, habilidade e competência são associações curatoriais conservadoras, justificadas individualmente e marcadas como pendentes de validação.
- **Correspondência parcial:** quando a atividade cobre somente parte de uma habilidade — por exemplo, um autômato desplugado sem sua automatização em linguagem baseada em eventos — essa limitação permanece no registro curatorial, mesmo quando a justificativa não é exibida na ficha pública.
- **Múltiplos anos:** um mesmo recurso pode ter alinhamentos diferentes para anos diferentes; cada par ano–habilidade é preservado explicitamente no modelo e no planejador.
- **Correção de fonte secundária:** códigos ou textos exibidos nas páginas das atividades não são tratados como BNCC sem conferência normativa. Na atividade **Nonogramas e Tomografias**, a associação publicada a `EF69CO04` não foi reutilizada porque o texto mostrado não corresponde ao enunciado oficial de 2022.
- **Imagens e licença:** as 23 ilustrações associadas foram incorporadas localmente com atribuição à coleção. O site informa licença **CC BY-NC-SA 4.0**, origem no CS Unplugged, traduções coordenadas em diferentes etapas e ilustrações recriadas pela Caiena.
- **Elegibilidade no planejador:** o cadastro no Acervo não torna automaticamente uma atividade elegível para criação de planos. Enquanto duração, função pedagógica e proposta de aplicação não estiverem validadas, as atividades da Unicamp permanecem visíveis e filtráveis, mas fora da seleção automática do planejador.
- **Processo auditável:** o procedimento e a tabela completa de decisões estão registrados em [`processo-curadoria-unicamp.md`](processo-curadoria-unicamp.md).

## 22. Simplificação dos cards e da ficha — 28 de agosto de 2026

- **Decisão dos cards:** os cartões do Acervo apresentam somente imagem, título, turma e eixo. Habilidades, códigos e justificativas curriculares ficam fora dos cards para reduzir e padronizar sua altura.
- **Decisão da ficha:** o campo visível **Habilidade** apresenta um único tema do recurso, sem código. O campo **Competências** apresenta somente os códigos `EF...` deduplicados associados ao recurso.
- **Preservação do domínio:** a nomenclatura e os vínculos oficiais da BNCC continuam armazenados internamente como habilidades e competências; a simplificação é uma convenção de apresentação solicitada para o protótipo.
- **Decisão de transparência:** o critério, a força e a justificativa de alinhamento deixam de aparecer na interface, mas continuam registrados nos dados e no processo de curadoria.
- **Decisão dos filtros:** Turma e Habilidade têm abertura exclusiva. Em larguras de tablet e celular, os painéis entram no fluxo da página para impedir sobreposição e rolagem horizontal.

## 23. Desempenho, camadas e turmas aplicáveis — 28 de agosto de 2026

- **Decisão de desempenho:** cards e detalhes usam miniaturas locais de até 960 px e decodificação assíncrona; os cards também usam contenção de pintura. Assim, a interface não carrega nem processa ilustrações originais de vários milhares de pixels.
- **Decisão de montagem:** o diálogo de organização em pastas só existe no DOM enquanto está aberto; avisos de leitor de tela vazios também não são montados.
- **Decisão de camadas:** cada card isola seus próprios botões de ação, mantendo os dropdowns de Turma e Habilidade acima do coração e dos três pontos.
- **Decisão sobre materiais editáveis:** os pacotes ZIP genéricos da coleção deixam de aparecer na ficha. PDFs complementares específicos permanecem disponíveis quando cadastrados.
- **Decisão sobre a aba Fonte:** a ficha apresenta fonte, licença e materiais complementares específicos; o estado de alinhamento com a BNCC Computação permanece interno.
- **Decisão sobre turmas:** a interface lista todos os anos de aplicação informados pelo público da fonte dentro do recorte do 4º ao 9º ano, unidos a extensões curatoriais documentadas. Os alinhamentos continuam vinculando somente os pares ano–habilidade efetivamente registrados.

## 24. Incorporação de Lightbot e Blockly Games — 29 de agosto de 2026

- **Decisão de corpus:** Lightbot e Blockly Games passam a integrar o Acervo, que totaliza 26 recursos.
- **Lightbot — fatos confirmados:** a versão consultada foi desenvolvida por Laurent Haan, possui 16 níveis, orienta a montagem de instruções em um programa executado pelo robô e oferece comandos de movimento, salto, iluminação e repetição. A interface possui inglês, alemão e francês, mas não português.
- **Lightbot — limites documentais:** a página não informa ano escolar, faixa etária, duração ou licença. Por isso, o recurso usa o placeholder e a licença aparece como não informada.
- **Blockly Games — fatos confirmados:** a página oficial o descreve como uma série autoinstrucional de jogos de programação para crianças sem experiência prévia. Quebra-Cabeça, Labirinto, Pássaro, Tartaruga, Filme, Música, Tutor de Lagoa e Lagoa trabalham blocos, laços, condicionais, equações, animação, funções e transição para JavaScript. A interface oferece português brasileiro.
- **Blockly Games — licença:** o repositório oficial declara Apache 2.0 para o código-fonte. Essa qualificação acompanha o valor da licença para não estendê-la automaticamente a todo conteúdo visual do site; nenhum ativo externo foi incorporado.
- **Decisão curricular:** ambos são associados curatorialmente ao 4º ano (`EF04CO03`) e ao 5º ano (`EF05CO04`). No Lightbot, a correspondência do 5º ano é parcial porque a versão consultada trabalha sequências e repetições, mas não seleção condicional.
- **Decisão de integridade:** turmas, habilidades e competências são mapeamentos curatoriais pendentes de validação. Ausência de duração e proposta de aplicação mantém os dois recursos fora da composição automática de planos.

## 25. Incorporação dos materiais de Rozelma e do Interland — 29 de agosto de 2026

- **Decisão de corpus:** quatro materiais da página de Rozelma França e o jogo Interland passam a integrar o Acervo, elevando o total de 26 para 31 recursos.
- **Materiais de Rozelma incluídos:** **Lua & Bit-Bit — Programando com Variáveis** para o 6º ano; **Sertão.bit** para o 5º ano; **Aventuras Digitais — Tornando-se um Cidadão Digital** para o 4º e o 5º ano; e **Cyberbullying — Uma Brincadeira de Mau Gosto** para o 7º ano.
- **Materiais fora do recorte:** **Gato de Botas na Era Digital** é destinado ao 1º–3º ano e **Os Pequenos Inventores**, ao 1º–2º ano. Eles não foram ampliados artificialmente para o recorte do 4º ao 9º ano.
- **Material bloqueado:** **As garotas que amavam caixas** aparece como um card sem link na página consultada. Como turma, eixo, habilidades, duração, requisitos e licença não puderam ser verificados, o item não foi cadastrado.
- **Alinhamentos declarados:** Lua & Bit-Bit declara `EF06CO06`; Aventuras Digitais declara, dentro do recorte atual, `EF04CO07`, `EF04CO08`, `EF05CO08`, `EF05CO09` e `EF15CO09`; o material de cyberbullying declara `EF07CO09` e `EF07CO03`. Os textos desses códigos foram conferidos no Complemento à BNCC Computação de 2022.
- **Alinhamento curatorial de Sertão.bit:** a versão atual do guia informa que o vínculo com o Complemento à BNCC ainda será acrescentado. O cadastro usa `EF05CO04` e `EF15CO04` como correspondências curatoriais pendentes, com base nos desafios e na aplicação documentada com estudantes do 5º ano.
- **Imagens e licenças:** Lua & Bit-Bit e Sertão.bit declaram CC BY-NC 4.0; suas capas e miniaturas foram incorporadas e creditadas sob essa licença. Aventuras Digitais e o material de cyberbullying não declaram licença de reutilização e, por isso, usam o placeholder.
- **Interland — fatos confirmados:** o jogo do Google pratica segurança e cidadania digital em quatro mundos sobre compartilhamento responsável, golpes e informações falsas, gentileza e bullying, senhas e privacidade. É gratuito, não exige conta e funciona no navegador com Internet.
- **Público do Interland:** o programa oficial é destinado do 2º ao 6º ano, de 7 a 12 anos. O Acervo registra somente a interseção com o recorte atual: 4º, 5º e 6º ano.
- **Alinhamento do Interland:** a fonte não declara BNCC Computação. As correspondências `EF04CO07`, `EF04CO08`, `EF05CO08` e `EF06CO09` são curatoriais, justificadas individualmente e pendentes de validação.
- **Imagem e licença do Interland:** não foi localizada licença explícita de reutilização para o jogo ou seus ativos visuais. A gratuidade de acesso não foi interpretada como autorização de republicação; o cadastro usa o placeholder e exibe a licença como não informada.
- **Duração e planejador:** Lua & Bit-Bit, Sertão.bit, Aventuras Digitais e Interland não informam duração. O material de cyberbullying informa “3 aulas”, sem duração unitária parseável de até 50 minutos. Os cinco permanecem fora da seleção automática do criador de planos, sem preenchimento presumido.
- **Processo auditável:** fontes, inclusões, exclusões, dados ausentes e decisões curriculares estão registrados em [`processo-curadoria-rozelma.md`](processo-curadoria-rozelma.md).

## 26. Revisão do criador, persistência e apresentação — 30 de agosto de 2026

As decisões desta seção substituem, no que houver conflito, as regras anteriores
de seleção automática e elegibilidade por metadados pedagógicos registradas nas
seções 18, 19, 21, 24 e 25.

- **Decisão de seleção:** depois do ano e da habilidade, o formulário apresenta
  **Material do Acervo**. O docente escolhe um recurso alinhado; não existe um
  botão separado de troca de proposta.
- **Decisão de elegibilidade provisória:** todo recurso com alinhamento exato
  ano–habilidade e URL HTTP(S) segura participa do criador. Ausência de duração,
  função pedagógica, proposta de aplicação ou sugestão de avaliação não o
  exclui enquanto metodologia e avaliação forem placeholders.
- **Decisão de sequência:** o mesmo material pode sustentar uma, duas ou três
  aulas. Nesta etapa, o compositor não exige materiais distintos para cada
  sessão.
- **Decisão sobre o objetivo:** a sugestão não é gerada por IA. Quando existe,
  ela é uma cópia editável de `pedagogy.learningObjective` do material escolhido
  e sua origem deve ser informada. Sem esse metadado, o campo começa vazio.
- **Decisão metodológica provisória:** metodologia continua com o lorem ipsum
  canônico até discussão com a orientadora.
- **Decisão avaliativa provisória:** quando a avaliação é marcada, o plano usa
  somente um segundo lorem ipsum canônico; `assessmentSuggestion` não alimenta
  o texto visível nesta fase.
- **Decisão de apresentação:** a antiga visualização **Enxuta** passa a se
  chamar **Em Blocos**. Ela mantém Materiais, BNCC, Objetivo, Metodologia e
  Avaliação, mas assume aparência de documento pedagógico, com faixa geométrica,
  blocos retangulares assimétricos e maior contraste visual. **Descritivo**
  permanece como projeção do mesmo plano.
- **Decisão de persistência:** planos podem ser salvos como snapshots no
  navegador. **Meus Planos de Aula** torna-se uma rota ativa com busca pelo tema
  e edição do mesmo registro, preservando identidade e data de criação.
- **Decisão de exportação:** qualquer plano composto ou salvo pode ser baixado
  como PDF A4 gerado localmente. O PDF não é armazenado no `localStorage`.
- **Limite preservado:** não há backend, sincronização remota, IA generativa ou
  propostas alternativas. A persistência é específica da origem do navegador.

## 27. Mudança de foco para trilhas de ensino — 1º de setembro de 2026

As decisões desta seção substituem, no que houver conflito, a centralidade do
CRUD de planos de aula descrita nas seções anteriores. A implementação antiga
foi preservada para comparação e continuidade dos dados, mas deixou de ser o
principal ponto de entrada do menu.

- **Decisão de foco:** os materiais e o contato inicial com eles passam a ser o
  centro do fluxo. O item **Criar Plano de Aula** é substituído no menu por
  **Criar Trilha de Ensino**.
- **Decisão de descoberta (revisada):** o professor pode começar por uma barra
  de busca e refinar o resultado por tags clicáveis de ano escolar, material
  plugado ou desplugado e abordagem ativa ou expositiva. A escolha evita menus
  suspensos como primeiro contato com a busca, conforme a orientação recebida.
- **Decisão de prévia (revisada):** cada resultado é um cartão compacto com
  objetivo breve, uma síntese priorizada do que os estudantes farão e como, e
  os materiais usados em forma concisa. Ao clicar no cartão, o docente abre a
  página detalhada no Acervo.
- **Decisão de composição (revisada):** o docente pode selecionar ou remover
  materiais diretamente no resultado para uma nova trilha em criação e
  acompanhá-los em um resumo leve. Ao salvar, informa nome e objetivo
  obrigatórios e escolhe a cor de fundo e o ícone que representam a trilha.
  Depois disso, pode adicionar materiais a uma trilha existente, reordenar as
  etapas por arrastar e soltar em **Minhas Trilhas** e selecionar a duração de
  uma, duas ou três aulas de 50 minutos para cada material. A interface não
  sugere nem valida uma ordem pedagógica.
- **Decisão de recorte piloto:** a validação inicial usa **Vinte Palpites —
  Teoria da Informação**, **Blockly Games** e **Sertão.bit — Livro-jogo de
  Pensamento Computacional**, todos apresentados para o 5º ano e vinculados
  curatorialmente a `EF05CO04`.
- **Base documental do piloto:** os objetivos e as descrições de ação foram
  sintetizados curatorialmente a partir da [atividade oficial Vinte
  Palpites](https://desplugada.ime.unicamp.br/atividade5/index.html), das
  [informações oficiais do Blockly Games para
  educadores](https://blockly.games/about?lang=pt-br) e da [página oficial do
  Sertão.bit](https://www.falecomrozelma.com/sertaobit). Essas fontes sustentam
  o funcionamento e os materiais, mas não declaram o alinhamento `EF05CO04`, que
  permanece uma correspondência curatorial pendente de validação.
- **Decisão de persistência (revisada):** trilhas com nome, objetivo, cor de
  fundo e ícone personalizados são persistidas no armazenamento local do
  navegador, no mesmo escopo dos planos salvos deste protótipo. **Minhas
  Trilhas** é a área de consulta e edição: nome, objetivo, cor e ícone podem
  ser alterados, enquanto reordenação, duração e remoção são mantidas em
  rascunho até **Salvar alterações**. Um material marcado para remoção pode ser
  desfeito antes dessa confirmação. O caminho visual termina em um marco
  conectado que reúne o nome, o objetivo personalizado, o ícone escolhido e os
  códigos curriculares extraídos dos alinhamentos já cadastrados, sob o rótulo
  de apresentação **Competências da BNCC relacionados**. Compartilhamento,
  exportação e sincronização permanecem fora deste recorte.
- **Decisão sobre planos:** as rotas e os planos salvos anteriores permanecem
  funcionais, mas **Meus Planos de Aula** fica visível e inativo na navegação
  para não competir com o fluxo principal de trilhas. Uma futura relação entre
  material da trilha e plano de aula não é presumida nesta etapa.

## 28. Consolidação do escopo atual — 14 de setembro de 2026

As decisões desta seção substituem a preservação técnica das funcionalidades
anteriores descrita ao final da seção 27.

- **Decisão de escopo:** Favoritos, pastas pessoais, turmas e planos de aula não
  fazem parte da versão atual do produto.
- **Decisão de implementação:** componentes, páginas, domínio, armazenamento e
  testes exclusivos de Favoritos, Pastas e Planos de Aula são removidos, em vez
  de permanecerem acessíveis por rotas não exibidas no menu.
- **Decisão de compatibilidade:** endereços antigos redirecionam para **Buscar
  Materiais** ou **Minhas Trilhas**, sem apresentar telas legadas.
- **Decisão de terminologia:** a interface usa **Buscar Materiais**; “Acervo”
  permanece apenas em registros históricos e não como área ativa do produto.
- **Decisão de persistência:** somente a sessão demonstrativa e as trilhas são
  lidas e atualizadas pela aplicação. Dados locais de versões anteriores são
  ignorados.
