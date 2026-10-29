import type { Resource } from "@/domain/resource";

import { createCurriculumAlignment } from "../bnccComputing";

const VERIFIED_AT = "2026-10-28";
const TECHNOLOGY_PAGE = "https://sme.goiania.go.gov.br/conexaoescola/ensino_fundamental/ciencias-da-natureza-tecnologia-e-vida-humana/";
const INTERNET_PLAYLIST = "https://www.youtube.com/playlist?list=PLQq8-9yVHyOYMFAc9v7Yb_cqmNMksEdrk";
const HISTORY_VIDEO = "https://www.youtube.com/watch?v=xajcV4lwY3Q";
const MEMORY_VIDEO = "https://www.youtube.com/watch?v=rS1SgcjYbIE";

const technologyAndHumanLife: Resource = {
  id: "sme-goiania-tecnologia-vida-humana",
  slug: "tecnologia-e-vida-humana",
  title: "Tecnologia e vida humana — Conexão Escola",
  provider: "SME Goiânia — Mariana Araguaia",
  sourceUrl: TECHNOLOGY_PAGE,
  canonicalUrl: "https://drive.google.com/file/d/1NQKqK9-AizswnleyTr05Uo_tPdOF4ca3/view",
  type: "text",
  language: "Português do Brasil",
  topic: "Tecnologia, qualidade de vida e impactos socioambientais",
  summary: "Apresentação de 34 slides para uma exposição dialogada sobre o conceito de tecnologia e sua presença na saúde, educação e comunicação. Discute benefícios, riscos, desigualdade digital e impactos ambientais. Acompanha texto e atividade com quatro questões.",
  additionalInformation: "Proposta de Ciências da Natureza de Mariana Araguaia, destinada ao 7º ano pela SME Goiânia. A fonte informa EF07CI11 de Ciências; o vínculo com a BNCC Computação foi produzido pela curadoria. Os arquivos conferidos são uma apresentação em PowerPoint (PPTX), com 34 slides incluindo revelações progressivas, texto e atividade em Word (DOCX). Para a exposição, baixar os slides e usar computador com leitor de apresentações e projetor; não é necessário imprimir. Para a atividade escrita, imprimir ou disponibilizar digitalmente a folha de quatro questões. Há exemplos e dados do período de ensino remoto na pandemia: apresentar seu contexto histórico e ajustar a pergunta sobre a vivência pessoal à turma. A fonte não informa duração total nem licença explícita para reutilização dos arquivos.",
  curatorNotes: "Público, autoria e EF07CI11 são declarados pela fonte. O vínculo parcial à Computação, os níveis de familiaridade e a proposta de aplicação são curatoriais e pendentes de validação. Os anexos permanecem na fonte original; não foram reproduzidas imagens sem licença identificada.",
  recommendedGrades: [7],
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 7, axis: "Cultura Digital", knowledgeObject: "Tecnologia digital, sustentabilidade e descarte eletrônico",
    skillCode: "EF07CO10", competencies: [1, 2], strength: "partial",
    rationale: "A apresentação e o texto discutem impactos ambientais, resíduos eletrônicos e redução, reúso e reciclagem. O aprofundamento do descarte de peças de computadores e de suas consequências depende da mediação proposta; o recurso aborda tecnologia de forma mais ampla. A fonte declara EF07CI11 de Ciências da Natureza.",
  })] },
  pedagogy: {
    learningObjective: "Reconhecer tecnologias em diferentes dimensões da vida humana e discutir seus benefícios, desigualdades de acesso e impactos socioambientais.",
    participation: ["whole-class"], pedagogicalFunction: "exposition",
    materials: ["Apresentação de 34 slides previamente baixada", "Texto de apoio para o professor", "Folha de quatro questões impressa ou digital, se o docente adotar a atividade complementar"],
    applicationProposal: "Proposta curatorial: iniciar com as perguntas dos slides sobre o que é tecnologia e acolher as hipóteses da turma. Selecionar exemplos de saúde, educação e comunicação e comparar benefícios e impactos. No bloco ambiental, relacionar consumo e descarte de eletrônicos à redução, ao reúso e à reciclagem, aprofundando os exemplos locais. Se usar a atividade complementar, distribuir sua folha impressa ou digital e contextualizar os dados da pandemia, ajustando a pergunta sobre experiências pessoais. A exposição não exige impressão.",
  },
  requirements: { internet: false, devices: ["Computador com leitor de PowerPoint e projetor para apresentar os arquivos previamente baixados"], accountRequired: false, pricing: "free" },
  accessibility: { evaluationStatus: "pending", knownFeatures: [], potentialBarriers: ["Imagens, infográficos e gráficos exigem descrição pelo docente", "Leitura e contraste dos slides ainda não avaliados integralmente"], alternatives: ["Texto de apoio disponível em Word e na página oficial"] },
  provenance: { source: "Mariana Araguaia — Portal Conexão Escola, SME Goiânia, Ciências da Natureza, 7º ano", lastVerifiedAt: VERIFIED_AT, status: "verified" },
  supplementaryLinks: [
    { label: "Página oficial — texto, quatro questões e autoria", url: TECHNOLOGY_PAGE },
    { label: "Slides para baixar — PowerPoint (PPTX)", url: "https://drive.google.com/file/d/1NQKqK9-AizswnleyTr05Uo_tPdOF4ca3/view" },
    { label: "Atividade para imprimir ou preencher digitalmente — Word (DOCX)", url: "https://drive.google.com/file/d/10xPUG5aSxOyGXYhhdQ2xKpv1yEkIhsA5/view" },
    { label: "Texto de apoio — Word (DOCX)", url: "https://drive.google.com/file/d/1jz3VrX1xVmfd1pJyA85buItaOBZZkwTS/view" },
  ],
  tags: ["slides", "apresentação", "exposição", "tecnologia e vida humana", "impactos socioambientais", "sustentabilidade", "lixo eletrônico", "desigualdade digital", "Conexão Escola", "EF07CI11"],
};

const computersWerePeople: Resource = {
  id: "manual-mundo-computadores-pessoas",
  slug: "os-computadores-eram-pessoas",
  title: "Os computadores eram pessoas! — Manual do Mundo",
  provider: "Manual do Mundo — Iberê Thenório",
  sourceUrl: HISTORY_VIDEO,
  type: "video",
  language: "Português do Brasil",
  topic: "História da Computação e máquinas de calcular",
  summary: "Primeiro episódio de A Saga dos Computadores, com 20min48s. Apresenta os calculadores humanos, formas de contar e calcular e a passagem para máquinas mecânicas, com uma demonstração da Pascalina. Apoia uma exposição dialogada sobre a história da Computação.",
  additionalInformation: "Vídeo do canal oficial Manual do Mundo, publicado em 22 de março de 2022 e apresentado por Iberê Thenório. A duração de 20min48s é do vídeo; o tempo da aula depende das pausas e da discussão e não é informado pela fonte. A recomendação do 6º ao 9º ano é curatorial, pois o produtor não declara ano escolar. O conteúdo original é em português e o YouTube pode oferecer outras faixas de áudio: selecionar Português (original), se necessário. Inclui promoção comercial da Alura. Não acompanha folha para imprimir ou plano de aula; a montagem demonstrada no vídeo não é um requisito para assisti-lo em sala. A descrição reserva os direitos ao Manual do Mundo; não foi identificada licença aberta para redistribuição.",
  curatorNotes: "Acesso, autoria, descrição, capítulos e duração foram conferidos no canal oficial. Ano escolar, familiaridade, vínculo curricular parcial e uso em aula são curatoriais e pendentes de validação. Não se atribui ao produtor a proposta abaixo nem se considera a exibição isolada suficiente para desenvolver toda a habilidade.",
  recommendedGrades: [6, 7, 8, 9],
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 9, axis: "Cultura Digital", knowledgeObject: "História da Computação e transformações do trabalho",
    skillCode: "EF09CO07", competencies: [1, 2], strength: "partial",
    rationale: "O episódio oferece exemplos históricos da passagem do cálculo humano para máquinas. A comparação com tecnologias digitais atuais e a avaliação de implicações sociais e alternativas dependem da discussão curatorial; o vídeo histórico não desenvolve sozinho toda a habilidade.",
  })] },
  pedagogy: {
    learningObjective: "Relacionar o trabalho dos calculadores humanos ao desenvolvimento de máquinas de calcular e discutir transformações nas formas de realizar cálculos.",
    estimatedDuration: "Vídeo: 20 min 48 s; duração da aula não informada",
    participation: ["whole-class"], pedagogicalFunction: "exposition",
    materials: ["Vídeo oficial e equipamento para projeção com som", "Caderno para registrar comparações"],
    applicationProposal: "Proposta curatorial: perguntar como as pessoas realizavam cálculos antes dos computadores eletrônicos. Exibir o episódio com pausas nos blocos sobre calculadores humanos e máquinas mecânicas. Pedir que os estudantes expliquem o que cada solução permitia fazer e comparem essas tarefas com usos dos computadores atuais. Retomar as mudanças no trabalho e os limites das tecnologias de cada época. Não é necessário imprimir ou construir a máquina mostrada no vídeo; reservar tempo além dos 20min48s para a mediação e os registros.",
  },
  requirements: { internet: true, devices: ["Computador com navegador, projetor ou tela e saída de som"], accountRequired: false, pricing: "free" },
  accessibility: { evaluationStatus: "pending", knownFeatures: [], potentialBarriers: ["Explicação oral e demonstrações visuais", "Legendas e demais recursos de acessibilidade ainda não avaliados"], alternatives: [] },
  provenance: { source: "Manual do Mundo — A Saga dos Computadores, episódio 1 (22/03/2022)", lastVerifiedAt: VERIFIED_AT, status: "verified" },
  supplementaryLinks: [{ label: "Vídeo completo — canal oficial, original em português", url: HISTORY_VIDEO }],
  tags: ["vídeo", "exposição", "história da computação", "calculadores humanos", "Pascalina", "máquinas de calcular", "Manual do Mundo", "Saga dos Computadores", "transformações do trabalho"],
};

const computerMemory: Resource = {
  id: "manual-mundo-memoria-computador",
  slug: "como-funciona-a-memoria-do-computador",
  title: "Como funciona a memória do computador? — Manual do Mundo",
  provider: "Manual do Mundo — Iberê Thenório",
  sourceUrl: MEMORY_VIDEO,
  type: "video",
  language: "Português do Brasil",
  topic: "Memória e armazenamento de dados",
  summary: "Episódio de A Saga dos Computadores, com 12min16s, sobre formas de guardar informações. Apresenta exemplos de memória volátil e armazenamento persistente, como RAM, HD, SSD e outros suportes, com demonstrações para apoiar a explicação em sala.",
  additionalInformation: "Sétimo episódio de A Saga dos Computadores, publicado pelo Manual do Mundo em 22 de setembro de 2022 e apresentado por Iberê Thenório. Os 12min16s correspondem ao vídeo, sem incluir a mediação do professor. Não há ano escolar declarado: a seleção do 6º ao 9º ano é curatorial, com uso introdutório no 6º como apoio ao estudo de armazenamento e gestão de dados. O vídeo original é em português; selecionar Português (original) no YouTube caso seja apresentada outra faixa de áudio. Há divulgação comercial da Alura. Não acompanha roteiro de aula ou material obrigatório para impressão. Os dispositivos mostrados no vídeo são exemplos; não precisam ser adquiridos nem desmontados pela turma. Não foi identificada licença aberta para redistribuição.",
  curatorNotes: "Título, descrição, autoria e duração foram conferidos no canal oficial. Público, familiaridade e alinhamento à BNCC são curatoriais e pendentes de validação. O vídeo explica suportes e funcionamento da memória; não ensina por si só todos os procedimentos de manipulação, compactação e recuperação de arquivos previstos na habilidade associada.",
  recommendedGrades: [6, 7, 8, 9],
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 6, axis: "Mundo Digital", knowledgeObject: "Memória e formas de armazenamento de dados",
    skillCode: "EF06CO08", competencies: [1, 2], strength: "partial",
    rationale: "A distinção entre memória volátil e armazenamento persistente oferece base conceitual para compreender onde os dados ficam guardados. A utilização de arquivos, sua manipulação, compactação e recuperação exigem práticas adicionais; o vídeo não cobre integralmente a habilidade.",
  })] },
  pedagogy: {
    learningObjective: "Distinguir memória volátil e armazenamento persistente e relacionar diferentes suportes às formas de guardar e acessar informações.",
    estimatedDuration: "Vídeo: 12 min 16 s; duração da aula não informada",
    participation: ["whole-class"], pedagogicalFunction: "exposition",
    materials: ["Vídeo oficial e equipamento para projeção com som", "Caderno para organizar exemplos de memória e armazenamento"],
    applicationProposal: "Proposta curatorial: levantar o que a turma acredita acontecer com programas e arquivos quando desligamos o computador. Exibir o vídeo com pausas para distinguir memória volátil e armazenamento persistente. Organizar no quadro os exemplos apresentados e pedir que os estudantes justifiquem quais informações permanecem guardadas após desligar o equipamento. No 6º ano, selecionar as explicações introdutórias como apoio à gestão de dados. Não há impressão ou montagem obrigatória; a aula precisa de tempo além dos 12min16s do vídeo.",
  },
  requirements: { internet: true, devices: ["Computador com navegador, projetor ou tela e saída de som"], accountRequired: false, pricing: "free" },
  accessibility: { evaluationStatus: "pending", knownFeatures: [], potentialBarriers: ["Conceitos técnicos explicados por fala e demonstrações", "Legendas e demais recursos de acessibilidade ainda não avaliados"], alternatives: [] },
  provenance: { source: "Manual do Mundo — A Saga dos Computadores, episódio 7 (22/09/2022)", lastVerifiedAt: VERIFIED_AT, status: "verified" },
  supplementaryLinks: [{ label: "Vídeo completo — canal oficial, original em português", url: MEMORY_VIDEO }],
  tags: ["vídeo", "exposição", "memória", "armazenamento de dados", "RAM", "HD", "SSD", "memória volátil", "armazenamento persistente", "Manual do Mundo", "Saga dos Computadores"],
};

const howTheInternetWorks: Resource = {
  id: "nicbr-como-funciona-internet-playlist",
  slug: "como-funciona-a-internet-playlist",
  title: "Como funciona a Internet? — Playlist do NIC.br",
  provider: "NIC.br — NICbrvideos",
  sourceUrl: INTERNET_PLAYLIST,
  type: "video",
  language: "Português do Brasil",
  topic: "Funcionamento da Internet, protocolos e DNS",
  summary: "Playlist oficial com quatro animações explicativas sobre o protocolo IP; Sistemas Autônomos, BGP e pontos de troca de tráfego; DNS; e governança da Internet. O conjunto tem 26min35s e permite selecionar episódios para uma exposição dialogada.",
  additionalInformation: "A playlist Como funciona a Internet?, do canal NICbrvideos, foi conferida com quatro vídeos em português: parte 1, O protocolo IP (5min44s); parte 2, Sistemas Autônomos, BGP, PTTs (7min06s); parte 3, DNS (6min55s); parte 4, Governança da Internet (6min50s). O total de 26min35s é a soma dos vídeos, sem pausas, discussão ou eventual publicidade do YouTube. Os episódios são de 2014; contextualizar essa data ao apresentar exemplos e a governança. Não há ano escolar declarado: o recorte do 7º ao 9º ano é curatorial. A parte 2 é mais técnica e requer explicação docente. O próprio canal informa que a trilha musical de fundo não pode ser ajustada separadamente e pode dificultar a escuta; testar o som antes da aula. Não acompanha folha para impressão ou plano de aula. Os episódios ficam como complementos deste único cadastro, sem cards separados.",
  curatorNotes: "Autoria da playlist, quatro episódios e durações foram confirmados na interface do YouTube. As páginas institucionais descrevem o conteúdo de cada parte. Público, familiaridade, proposta e vínculos à BNCC são curatoriais e pendentes de validação. A licença geral do site institucional não foi estendida automaticamente aos vídeos hospedados no YouTube ou às suas miniaturas; não foram republicados arquivos de mídia.",
  recommendedGrades: [7, 8, 9],
  curriculum: { alignments: [
    createCurriculumAlignment({
      grade: 7, axis: "Mundo Digital", knowledgeObject: "Protocolos de comunicação e transmissão de dados",
      skillCode: "EF07CO06", competencies: [1, 2],
      rationale: "Os episódios sobre IP, BGP e DNS explicam como regras compartilhadas permitem endereçar, encaminhar e localizar informações entre redes, apoiando a compreensão do papel dos protocolos.",
    }),
    createCurriculumAlignment({
      grade: 8, axis: "Mundo Digital", knowledgeObject: "Estrutura e funcionamento da Internet",
      skillCode: "EF08CO06", competencies: [1, 2],
      rationale: "A sequência apresenta a Internet como rede de redes, o encaminhamento de pacotes, a interligação de sistemas autônomos e a resolução de nomes por DNS. A exposição dialogada retoma essas relações para compreender seu funcionamento.",
    }),
  ] },
  pedagogy: {
    learningObjective: "Explicar como redes interligadas usam protocolos, endereços IP e DNS para transmitir dados e localizar serviços na Internet.",
    estimatedDuration: "Playlist: 26 min 35 s; duração da aula não informada",
    participation: ["whole-class"], pedagogicalFunction: "exposition",
    materials: ["Playlist oficial ou episódio selecionado", "Equipamento para projeção com som", "Quadro ou caderno para representar o caminho dos dados"],
    applicationProposal: "Proposta curatorial: selecionar os episódios conforme o objetivo, sem exigir a exibição integral da playlist em uma única aula. Começar pelo IP para discutir endereços e pacotes; retomar os conceitos antes do DNS, perguntando como o navegador encontra o site digitado. Se adotar a parte 2, explicar previamente Sistemas Autônomos, BGP e pontos de troca de tráfego. Contextualizar a parte de governança como produção de 2014. Pedir que a turma represente o percurso simplificado de uma solicitação e explique a função dos protocolos. Testar a escuta por causa da música de fundo e reservar tempo além da duração dos vídeos. Não há impressão obrigatória.",
  },
  requirements: { internet: true, devices: ["Computador com navegador, projetor ou tela e saída de som"], accountRequired: false, pricing: "free" },
  accessibility: { evaluationStatus: "pending", knownFeatures: [], potentialBarriers: ["Música de fundo pode competir com a narração", "Animações e vocabulário técnico exigem mediação", "Legendas e demais recursos de acessibilidade ainda não avaliados"], alternatives: ["Descrições institucionais dos temas nos links complementares"] },
  provenance: { source: "NIC.br — playlist oficial Como funciona a Internet?, NICbrvideos, quatro episódios (2014)", lastVerifiedAt: VERIFIED_AT, status: "verified" },
  supplementaryLinks: [
    { label: "Parte 1 — O protocolo IP (5min44s)", url: "https://www.youtube.com/watch?v=HNQD0qJ0TC4" },
    { label: "Parte 2 — Sistemas Autônomos, BGP, PTTs (7min06s)", url: "https://www.youtube.com/watch?v=C5qNAT_j63M" },
    { label: "Parte 3 — DNS (6min55s)", url: "https://www.youtube.com/watch?v=ACGuo26MswI" },
    { label: "Parte 4 — Governança da Internet (6min50s)", url: "https://www.youtube.com/watch?v=ZYsjMEISR6E" },
    { label: "Referência institucional — O protocolo IP", url: "https://www.nic.br/videos/ver/como-funciona-a-internet-parte-1-o-protocolo-ip/" },
    { label: "Referência institucional — Sistemas Autônomos, BGP, PTTs", url: "https://www.nic.br/videos/ver/como-funciona-a-internet-parte-2-sistemas-autonomos-bgp-ptts/" },
    { label: "Referência institucional — DNS", url: "https://www.nic.br/videos/ver/como-funciona-a-internet-parte-3-dns/" },
    { label: "Referência institucional — Governança da Internet", url: "https://www.nic.br/videos/ver/como-funciona-a-internet-parte-4-governanca-da-internet/" },
  ],
  tags: ["vídeo", "playlist", "exposição", "redes", "internet", "protocolo IP", "pacotes", "Sistemas Autônomos", "BGP", "PTT", "pontos de troca de tráfego", "DNS", "domínios", "governança da internet", "NIC.br"],
};

export const expositoryMaterials: Resource[] = [
  technologyAndHumanLife,
  computersWerePeople,
  computerMemory,
  howTheInternetWorks,
];
