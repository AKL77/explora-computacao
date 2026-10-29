import type { Resource } from "@/domain/resource";
import { publicAsset } from "@/lib/publicAsset";

import { createCurriculumAlignment } from "../bnccComputing";

const VERIFIED_AT = "2026-10-28";
const COMPUTACIONAL = "https://www.computacional.com.br/atividadespc";
const GUARDIAO = "https://cartilha.cert.br/guardiao/";
const GUARDIAO_SLIDES = `${GUARDIAO}fasciculo-egc-slides.pdf`;
const FAKE_NEWS = "https://sme.goiania.go.gov.br/conexaoescola/ensino_fundamental/lingua-portuguesa-as-fake-news/";
const SPLASHCODE = "https://computacaonaescola.ufsc.br/jogo-splashcode/";
const SPLASHCODE_PDF = "https://drive.google.com/file/d/1oGLKu591iNugt_axWSVMt7Rt25XyMDgD/view";
const BOARD_PAGE = "https://internetsegura.br/tabuleiro/";
const BOARD_PDF = "https://internetsegura.br/pdf/tabuleiro/jogo-tabuleiro-segurancaonline.pdf";
const SHARE_ALIKE = "CC BY-NC-SA 4.0";

const accessibility: Resource["accessibility"] = {
  evaluationStatus: "pending",
  knownFeatures: [],
  potentialBarriers: [],
  alternatives: [],
};

function preview(name: string, alt: string, license = SHARE_ALIKE): Resource["image"] {
  return {
    src: publicAsset(`images/cards/curadoria-outubro-28/${name}.jpg`),
    thumbnailSrc: publicAsset(`images/cards/thumbnails/curadoria-outubro-28/${name}.jpg`),
    alt,
    license,
  };
}

const evolution: Resource = {
  id: "computacional-evolucao-computacao",
  slug: "evolucao-da-computacao",
  title: "Evolução da Computação",
  provider: "Computacional — Christian Brackmann",
  sourceUrl: COMPUTACIONAL,
  canonicalUrl: "https://www.computacional.com.br/atividades_download/evolucaodacomputacao.pdf",
  type: "text",
  language: "Português do Brasil",
  topic: "História da Computação e transformações tecnológicas",
  summary: "Painel cronológico ilustrado sobre máquinas de calcular, gerações de computadores, componentes, linguagens, redes e outras transformações da Computação. Serve de apoio visual para uma exposição dialogada e para comparar tecnologias de diferentes épocas.",
  additionalInformation: "O PDF é um painel horizontal de uma página, com crédito de 2025 a Christian Brackmann, baseado no projeto de Rogério Azambuja. O catálogo indica a partir do 6º ano; são apresentados os anos desse público dentro do recorte da plataforma. O texto é pequeno: para exposição, ampliar trechos do PDF ou usar impressão em formato grande. Não acompanha roteiro de aula nem duração. Nota de curadoria: o trecho sobre a Máquina Analítica chama Ada Lovelace de esposa de Charles Babbage, o que está incorreto. Ela foi sua colaboradora. O professor deve explicitar essa correção; há uma referência do Computer History Museum nos materiais complementares. O cartaz original permanece no site do autor.",
  curatorNotes: "Público a partir do 6º ano e licença constam da fonte. A verificação de disponibilidade não significa validação de todas as afirmações históricas do painel. O erro sobre Ada Lovelace foi conferido e sinalizado na ficha. A proposta de comparação crítica, a familiaridade e o vínculo curricular parcial são curatoriais e pendentes de validação.",
  recommendedGrades: [6, 7, 8, 9],
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 9, axis: "Cultura Digital", knowledgeObject: "Transformações e impactos das tecnologias digitais",
    skillCode: "EF09CO07", competencies: [1, 2], strength: "partial",
    rationale: "A linha do tempo oferece exemplos históricos para analisar mudanças tecnológicas. A avaliação de implicações sociais e a proposição de alternativas previstas na habilidade exigem a mediação e o aprofundamento sugeridos pela curadoria; não são desenvolvidas pelo painel isoladamente.",
  })] },
  pedagogy: {
    learningObjective: "Comparar artefatos e marcos da história da Computação, relacionando transformações tecnológicas a mudanças em seus usos sociais.",
    pedagogicalFunction: "exposition",
    materials: ["Painel ampliado para projeção ou impressão em formato grande", "Papel ou caderno para registrar comparações"],
    applicationProposal: "Proposta curatorial: selecionar trechos legíveis da linha do tempo e conduzir uma exposição dialogada. Antes de apresentar a Máquina Analítica, corrigir a identificação de Ada Lovelace como colaboradora de Babbage. Pedir que os estudantes comparem artefatos de duas épocas, seus usos e mudanças no cotidiano. Consultar a referência histórica complementar para revisar o trecho sobre Ada.",
  },
  requirements: { internet: false, devices: ["Computador e projetor para a opção de exposição digital; dispensáveis com o painel impresso"], accountRequired: false, pricing: "free" },
  accessibility: { ...accessibility, potentialBarriers: ["Texto pequeno em painel muito largo", "Conteúdo visual dependente de ampliação e descrição pelo docente"] },
  provenance: { source: "Brackmann, Christian. Evolução da Computação (2025), baseado no projeto de Rogério Azambuja", license: SHARE_ALIKE, lastVerifiedAt: VERIFIED_AT, status: "verified" },
  image: preview("evolucao-computacao", "Painel completo Evolução da Computação com marcos históricos e gerações de computadores"),
  supplementaryLinks: [
    { label: "Catálogo oficial — público e versão em imagem", url: COMPUTACIONAL },
    { label: "Referência para a correção sobre Ada Lovelace — Computer History Museum (inglês)", url: "https://computerhistory.org/events/thinking-bigada-lovelace-mathematician-visionary/" },
  ],
  tags: ["história da computação", "linha do tempo", "gerações de computadores", "evolução tecnológica", "Ada Lovelace", "hardware", "software", "exposição", "painel"],
};

const guardian: Resource = {
  id: "certbr-guardiao-cibernetico",
  slug: "guardiao-cibernetico",
  title: "Guardião Cibernético — Proteja os seus dados",
  provider: "CERT.br / NIC.br",
  sourceUrl: GUARDIAO,
  canonicalUrl: GUARDIAO_SLIDES,
  type: "text",
  language: "Português do Brasil",
  topic: "Proteção de dados pessoais e segurança na Internet",
  summary: "Apresentação de 45 slides sobre o valor dos dados pessoais, formas de abuso e cuidados para protegê-los. Aborda mecanismos de segurança, redução da exposição e direitos relacionados aos dados. Inclui versão com notas para o apresentador e fascículos complementares.",
  additionalInformation: "O título da apresentação é Proteja os seus dados e os da sua empresa, da parceria Guardião Cibernético. O conjunto tem 45 slides e está disponível em PDF, PowerPoint e PDF com notas. Foi concebido para palestras, com exemplos também empresariais, sem ano escolar ou duração declarados. A seleção do 7º ao 9º ano é curatorial: escolher exemplos pertinentes aos adolescentes e ajustar a linguagem. Os fascículos, as notas e os outros formatos estão reunidos na aba Fonte do mesmo cadastro. Para adaptar os slides, preservar os créditos, a identidade visual dos slides que usam conteúdo da Cartilha e a licença, conforme as condições da fonte.",
  curatorNotes: "Não são criados cadastros separados para os fascículos ou formatos complementares. Público escolar, familiaridade, proposta e vínculos à BNCC são curatoriais e pendentes de validação. A licença foi verificada na página e nas notas do PDF; não equivale a validação da acessibilidade.",
  recommendedGrades: [7, 8, 9],
  curriculum: { alignments: [
    createCurriculumAlignment({
      grade: 7, axis: "Mundo Digital", knowledgeObject: "Segurança cibernética e proteção de dados",
      skillCode: "EF07CO07", competencies: [2, 7], strength: "partial",
      rationale: "Os slides permitem identificar ameaças aos dados e conhecer mecanismos de proteção, mas a experimentação prática prevista na habilidade depende de uma atividade adicional organizada pelo professor.",
    }),
    createCurriculumAlignment({
      grade: 8, axis: "Cultura Digital", knowledgeObject: "Segurança e privacidade em ambientes virtuais",
      skillCode: "EF08CO10", competencies: [2, 7],
      rationale: "Os exemplos de coleta, exposição e acesso indevido a dados oferecem situações para discutir segurança e privacidade em ambientes virtuais.",
    }),
  ] },
  pedagogy: {
    learningObjective: "Reconhecer riscos aos dados pessoais e discutir medidas para reduzir a exposição e proteger a privacidade.",
    pedagogicalFunction: "exposition",
    materials: ["Slides selecionados e notas do apresentador", "Fascículos complementares para leitura digital ou impressão, conforme a seleção docente"],
    applicationProposal: "Proposta curatorial: ler as notas do apresentador e selecionar os slides adequados à turma, substituindo exemplos empresariais quando necessário. Explicar o valor dos dados pessoais, discutir situações de exposição e relacioná-las aos cuidados propostos. Usar um dos fascículos complementares para apoiar a leitura e encerrar com um registro das medidas de proteção justificadas pelos estudantes.",
  },
  requirements: { internet: false, devices: ["Computador e projetor para apresentar os slides previamente baixados; a leitura também pode usar impressos"], accountRequired: false, pricing: "free" },
  accessibility: { ...accessibility, potentialBarriers: ["Quantidade de texto nos slides", "Exemplos empresariais exigem adequação à turma"] },
  provenance: { source: "CERT.br / NIC.br — parceria Guardião Cibernético, apresentação e notas oficiais", license: SHARE_ALIKE, lastVerifiedAt: VERIFIED_AT, status: "verified" },
  image: preview("guardiao-cibernetico", "Capa da apresentação Proteja os seus dados e os da sua empresa, do Guardião Cibernético"),
  supplementaryLinks: [
    { label: "Slides em PowerPoint — formato editável", url: `${GUARDIAO}fasciculo-egc-slides.pptx` },
    { label: "Slides com notas para o apresentador (PDF)", url: `${GUARDIAO}fasciculo-egc-slides-notas.pdf` },
    { label: "Fascículo complementar — Autenticação", url: `${GUARDIAO}fasciculo-autenticacao-egc.pdf` },
    { label: "Fascículo complementar — Proteção de Dados", url: `${GUARDIAO}fasciculo-protecao-de-dados-egc.pdf` },
    { label: "Fascículo complementar — Boatos", url: `${GUARDIAO}fasciculo-boatos-egc.pdf` },
    { label: "Fascículo complementar — Phishing e Outros Golpes", url: `${GUARDIAO}fasciculo-phishing-golpes-egc.pdf` },
    { label: "Todos os fascículos, vídeos e condições de reutilização", url: GUARDIAO },
  ],
  tags: ["Guardião Cibernético", "CERT.br", "slides", "apresentação", "proteção de dados", "privacidade", "autenticação", "segurança cibernética", "golpes", "exposição"],
};

const fakeNews: Resource = {
  id: "sme-goiania-as-fake-news",
  slug: "as-fake-news-conexao-escola",
  title: "As fake news — Conexão Escola",
  provider: "SME Goiânia — Marlon Santos",
  sourceUrl: FAKE_NEWS,
  type: "activity",
  language: "Português do Brasil",
  topic: "Desinformação e avaliação da confiabilidade das fontes",
  summary: "Proposta interdisciplinar de leitura e discussão sobre notícias falsas, com texto explicativo, seis questões, pesquisa e socialização de resultados. A página reúne uma videoaula e arquivos de atividade, texto e slides para apoiar a aplicação.",
  additionalInformation: "Material de Marlon Santos para o 9º ano, apresentado pela SME Goiânia como atividade de Língua Portuguesa baseada no Programa Aprender Sempre. A fonte declara EF09LP01; o vínculo com a BNCC Computação é uma associação da curadoria. Os downloads foram conferidos: atividade e texto em Word (DOCX), apresentação com 13 slides em PowerPoint (PPTX). O texto e as seis questões também podem ser lidos diretamente na página. A proposta inclui pesquisar os efeitos das notícias falsas e compartilhar os resultados com a classe. Não há duração total declarada. A licença de reutilização dos arquivos não foi identificada; o acesso é feito na fonte original.",
  curatorNotes: "O 9º ano e EF09LP01 são declarados pela fonte. EF09CO10, familiaridade e modo de uso são curatoriais e pendentes de validação. A grafia, o tom ou a aparência de uma mensagem não determinam sua veracidade: a mediação deve valorizar a verificação de autoria, fontes, contexto e evidências. Os arquivos permanecem externos; não foi republicada uma imagem sem licença confirmada.",
  recommendedGrades: [9],
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 9, axis: "Cultura Digital", knowledgeObject: "Qualidade da informação e desinformação",
    skillCode: "EF09CO10", competencies: [3, 5, 7],
    rationale: "A leitura, as questões e a pesquisa solicitam avaliar a veracidade das notícias e discutir os propósitos e consequências de sua disseminação. A correspondência à Computação é curatorial; a fonte apresenta EF09LP01 de Língua Portuguesa.",
  })] },
  pedagogy: {
    learningObjective: "Avaliar a confiabilidade das informações e discutir os propósitos e efeitos da disseminação de notícias falsas.",
    pedagogicalFunction: "exploration",
    materials: ["Texto e folha de seis questões, impressos ou em formato digital", "Apresentação de 13 slides e videoaula, conforme a seleção do professor", "Caderno para registrar a pesquisa e as respostas"],
    applicationProposal: "Usar as perguntas iniciais para discutir experiências com notícias falsas. Ler o texto e, se pertinente, apresentar os slides ou a videoaula. Responder às questões e realizar a pesquisa sobre os efeitos da desinformação indicada na atividade, socializando os resultados com a turma. Como mediação curatorial, pedir que os estudantes justifiquem as conclusões por autoria, contexto, fontes e evidências, sem tratar aparência ou erros gramaticais como prova de falsidade.",
  },
  requirements: { internet: true, devices: ["Computador ou outro dispositivo com navegador para a pesquisa e a videoaula", "Projetor para a apresentação coletiva (opcional)"], accountRequired: false, pricing: "free" },
  accessibility: { ...accessibility, potentialBarriers: ["Leitura de textos e da apresentação", "Acessibilidade da videoaula e dos anexos ainda não avaliada"] },
  provenance: { source: "Marlon Santos — Portal Conexão Escola, SME Goiânia, Aprender Sempre, 9º ano", lastVerifiedAt: VERIFIED_AT, status: "verified" },
  supplementaryLinks: [
    { label: "Atividade para baixar — Word (DOCX)", url: "https://drive.google.com/file/d/1MkbE7Yebu6lOm2t9xM4Ds2g_vltNH3M_/view" },
    { label: "Slides para baixar — PowerPoint (PPTX)", url: "https://drive.google.com/file/d/1XJgjNMlxDFMIcaJY1PT6CalLnUeKgx6j/view" },
    { label: "Texto para leitura — Word (DOCX)", url: "https://drive.google.com/file/d/1wv6Lp6ZX4JUYanui-EtI9F0c0eIpVa8-/view" },
    { label: "Videoaula — As fake news, professor Marlon Santos", url: "https://www.youtube.com/watch?v=S_84IP0_4N0" },
  ],
  tags: ["fake news", "notícias falsas", "desinformação", "confiabilidade das fontes", "pesquisa na internet", "leitura crítica", "Conexão Escola", "Língua Portuguesa", "EF09LP01"],
};

const splashCode: Resource = {
  id: "ufsc-splashcode",
  slug: "splashcode",
  title: "SplashCode",
  provider: "Computação na Escola — UFSC / INCoD / INE",
  sourceUrl: SPLASHCODE,
  type: "game",
  language: "Português do Brasil",
  topic: "Algoritmos e sequências de instruções",
  summary: "Jogo de tabuleiro desplugado para complementar a introdução a algoritmos e programação. Os estudantes organizam instruções usando cartas de movimento e simulam seus efeitos no tabuleiro. A fonte oferece peças para imprimir e vídeos de preparação, cartas e regras.",
  additionalInformation: "A UFSC indica Ensino Fundamental II; são apresentados o 6º ao 9º ano. O PDF de nove páginas contém personagens, cartas de programação, tabela de programação e tabuleiro em partes para montar. É necessário imprimir, recortar e colar as peças antes da aula; as instruções indicam tampas de garrafa como bases dos personagens e cola bastão para a montagem. As regras estão nos vídeos oficiais vinculados na aba Fonte. A fonte recomenda o jogo como complemento a uma aula expositiva inicial. A duração total e o número de jogadores não foram declarados no cadastro. O conteúdo do PDF tem licença CC BY-NC-SA 4.0, com ilustrações creditadas a Freepik.",
  curatorNotes: "A etapa escolar é declarada pela UFSC. O alinhamento à habilidade de programação é parcial: o jogo usa cartas e simulação desplugada, sem implementar um programa em computador. A proposta abaixo é uma orientação curatorial e não substitui os vídeos de regras do jogo. Familiaridade e vínculos são curatoriais e pendentes de validação.",
  recommendedGrades: [6, 7, 8, 9],
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 6, axis: "Pensamento Computacional", knowledgeObject: "Algoritmos e programação com instruções pictográficas",
    skillCode: "EF06CO02", competencies: [4, 5], strength: "partial",
    rationale: "Organizar cartas e simular seus movimentos trabalha a construção de algoritmos sequenciais. O jogo desplugado não cobre integralmente a elaboração em linguagem de programação com repetição e seleção prevista na habilidade.",
  })] },
  pedagogy: {
    learningObjective: "Decompor percursos em sequências de instruções e compreender um algoritmo como passos ordenados para executar uma tarefa.",
    participation: ["group"], pedagogicalFunction: "practice",
    materials: ["PDF do jogo impresso: personagens, cartas, tabela de programação e tabuleiro (9 páginas)", "Tesoura e cola bastão para recortar e montar", "Tampas de garrafa para as bases dos personagens"],
    applicationProposal: "Proposta curatorial: assistir previamente aos vídeos oficiais de preparação e regras. Imprimir e montar o conjunto do jogo antes da aula. Retomar o conceito de algoritmo, explicar as cartas e demonstrar uma jogada conforme as regras originais. Acompanhar os grupos na organização e simulação das instruções e encerrar discutindo a ordem dos comandos e as correções realizadas.",
  },
  requirements: { internet: false, accountRequired: false, pricing: "free" },
  accessibility: { ...accessibility, potentialBarriers: ["Interpretação visual do tabuleiro e das cartas", "Recorte e manipulação das peças"] },
  provenance: { source: "Computação na Escola / INCoD / INE / UFSC — página do SplashCode e MaterialSplashCode_v10P.pdf", license: SHARE_ALIKE, lastVerifiedAt: VERIFIED_AT, status: "verified" },
  image: preview("splashcode", "Primeira folha do SplashCode com personagens recortáveis, cartas e instruções de montagem"),
  supplementaryLinks: [
    { label: "Material para imprimir — personagens, cartas e tabuleiro (PDF, 9 páginas)", url: SPLASHCODE_PDF },
    { label: "Vídeo oficial — Preparação do jogo", url: "https://www.youtube.com/watch?v=Yf-_eZZ9OU8" },
    { label: "Vídeo oficial — Cartas", url: "https://www.youtube.com/watch?v=KBTivp4bBcM" },
    { label: "Vídeo oficial — Como jogar?", url: "https://www.youtube.com/watch?v=LVKKEDUIuNo" },
    { label: "Questionário de avaliação do jogo — MEEGA+KIDS", url: "https://drive.google.com/file/d/10RQDxT9vg4GN2ZOClqFpGtckFq5dRJ1U/view" },
  ],
  tags: ["SplashCode", "UFSC", "algoritmos", "sequências de instruções", "programação", "jogo de tabuleiro", "cartas", "atividade desplugada"],
};

const onlineSafety: Resource = {
  id: "nicbr-tabuleiro-seguranca-online",
  slug: "seguranca-online-tabuleiro",
  title: "Segurança Online — Jogo de Tabuleiro",
  provider: "Internet Segura — CERT.br / NIC.br / CGI.br",
  sourceUrl: BOARD_PAGE,
  canonicalUrl: BOARD_PDF,
  type: "game",
  language: "Português do Brasil",
  topic: "Cuidados com dispositivos, dados e segurança na Internet",
  summary: "Jogo de percurso da Turma do Bem em que atitudes de proteção permitem avançar e comportamentos arriscados trazem consequências. As casas abordam cópias de segurança, atualizações, bloqueio de tela, links, aplicativos e proteção de mensagens. Inclui tabuleiro, peças recortáveis e regras.",
  additionalInformation: "Este cadastro representa Segurança Online, distinto de Comportamento Seguro, oferecido na mesma página. O PDF tem duas páginas: a primeira reúne o tabuleiro e peças; a segunda traz regras e instruções de montagem. É possível recortar o dado e os personagens ou usar um dado pronto e marcadores como botões. Para iniciar, é preciso tirar 1 ou 6, começando sempre na casa 1; vence quem alcançar a chegada com o número exato, conforme as regras do arquivo. O público é infantil, sem ano escolar ou duração declarados: a seleção do 4º ao 6º ano é curatorial. Após baixar e imprimir, a aplicação é inteiramente desplugada. O PDF de alta resolução tem aproximadamente 72 MB.",
  curatorNotes: "A licença CC BY-NC-ND 4.0 está impressa nas duas páginas. A prévia local é apenas uma renderização integral da primeira página, redimensionada sem alterar o conteúdo. Os anos, a familiaridade, a discussão final e os vínculos curriculares parciais são curatoriais. O jogo enfatiza cuidados de segurança e não cobre sozinho todos os aspectos éticos, legais e de direitos autorais da habilidade geral.",
  recommendedGrades: [4, 5, 6],
  curriculum: { alignments: ([4, 5] as const).map((grade) => createCurriculumAlignment({
    grade, axis: "Cultura Digital", knowledgeObject: "Uso seguro e responsável das tecnologias",
    skillCode: "EF15CO09", competencies: [2, 7], strength: "partial",
    rationale: "As casas relacionam escolhas cotidianas à proteção de dados e dispositivos, apoiando o uso seguro e responsável da tecnologia. Direitos autorais, de imagem e leis não são desenvolvidos integralmente neste jogo.",
  })) },
  pedagogy: {
    learningObjective: "Reconhecer atitudes que aumentam ou reduzem a segurança de dados e dispositivos e justificar cuidados no uso da Internet.",
    participation: ["group"], pedagogicalFunction: "consolidation",
    materials: ["Tabuleiro e regras impressos (PDF de duas páginas)", "Um dado e marcadores por grupo, prontos ou recortados das folhas", "Tesoura e cola para os componentes recortáveis, se utilizados"],
    applicationProposal: "Imprimir o tabuleiro e as regras e preparar o dado e os marcadores antes da aula. Explicar o início com 1 ou 6, os efeitos das casas especiais e a chegada com o número exato, seguindo o PDF. Organizar as partidas em grupos. Como complemento curatorial, pedir que os estudantes expliquem por que as atitudes retratadas aumentam ou reduzem a segurança e registrem cuidados para sua rotina.",
  },
  requirements: { internet: false, accountRequired: false, pricing: "free" },
  accessibility: { ...accessibility, potentialBarriers: ["Leitura das casas e identificação visual do percurso", "Manipulação do dado e das peças"] },
  provenance: { source: "Internet Segura — Jogo de Tabuleiro Segurança Online, CERT.br / NIC.br / CGI.br", license: "CC BY-NC-ND 4.0", lastVerifiedAt: VERIFIED_AT, status: "verified" },
  image: preview("seguranca-online", "Página completa do jogo Segurança Online com percurso, personagens e dado para recortar", "CC BY-NC-ND 4.0"),
  supplementaryLinks: [
    { label: "Regras e montagem das peças — página 2 do PDF", url: `${BOARD_PDF}#page=2` },
    { label: "PDF com marcas de corte — para impressão", url: "https://internetsegura.br/pdf/tabuleiro/jogo-tabuleiro-segurancaonline-grafica.pdf" },
    { label: "Portal Internet Segura — materiais para crianças", url: "https://internetsegura.br/criancas/" },
    { label: "Licença de uso do material", url: "https://internetsegura.br/licenca/" },
  ],
  tags: ["Segurança Online", "Internet Segura", "Turma do Bem", "segurança cibernética", "proteção de dados", "backup", "atualizações", "links", "aplicativos", "jogo de tabuleiro"],
};

export const approvedMaterialsOctober28: Resource[] = [evolution, guardian, fakeNews, splashCode, onlineSafety];
