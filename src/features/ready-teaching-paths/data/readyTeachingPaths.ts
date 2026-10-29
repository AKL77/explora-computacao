import { Binary, Braces, Bug, Globe, MessagesSquare, Network, Newspaper, Search, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

import type { Grade } from "@/domain/curriculum";
import type {
  TeachingPathBackgroundColor,
  TeachingPathIcon,
  TeachingPathLessonCount,
} from "@/domain/savedTeachingPath";

export type TrailCategory = "Todas" | "Pensamento Computacional" | "Mundo Digital" | "Cultura Digital";

interface TrailPreview {
  id: string;
  name: string;
  summary: string;
  category: Exclude<TrailCategory, "Todas">;
  grades: readonly Grade[];
  icon: ComponentType<{ size?: number; "aria-hidden"?: "true" }>;
}

interface ReadyPathStage {
  lessonCount?: TeachingPathLessonCount;
  resourceId: string;
  label: string;
  title: string;
  description: string;
  objective: string;
}

export interface ReadyPath extends TrailPreview {
  objective: string;
  journeyTitle: string;
  backgroundColor: TeachingPathBackgroundColor;
  savedIcon: TeachingPathIcon;
  stages: readonly ReadyPathStage[];
}

export const categories: readonly TrailCategory[] = [
  "Todas",
  "Pensamento Computacional",
  "Mundo Digital",
  "Cultura Digital",
];

export const readyPaths: readonly ReadyPath[] = [
  {
    id: "algoritmos-decisoes-blocos-desafios",
    name: "Algoritmos: decisões, blocos e desafios",
    summary: "Uma progressão da lógica desplugada à programação visual e à resolução de problemas.",
    category: "Pensamento Computacional",
    grades: [5],
    icon: Braces,
    objective:
      "Compreender como algoritmos organizam decisões e sequências, avançando de uma experiência desplugada para a programação em blocos e um desafio integrado.",
    journeyTitle: "Da decisão à construção de algoritmos",
    backgroundColor: "amber",
    savedIcon: "sparkles",
    stages: [
      {
        resourceId: "unicamp-desplugada-atividade-5",
        label: "Descobrir",
        title: "Decisões com perguntas de sim ou não",
        description:
          "A turma experimenta uma estratégia desplugada e percebe como cada decisão reduz as possibilidades.",
        objective: "Usar perguntas de “sim” ou “não” para compreender bits e decisões.",
      },
      {
        resourceId: "google-blockly-games",
        label: "Experimentar",
        title: "Algoritmos visuais com blocos",
        description:
          "Os estudantes resolvem desafios progressivos e aplicam sequências, laços e condicionais.",
        objective: "Construir algoritmos visuais com blocos, laços e condicionais.",
      },
      {
        resourceId: "rozelma-sertao-bit",
        label: "Aplicar",
        title: "Desafios em uma narrativa brasileira",
        description:
          "A aprendizagem é consolidada em problemas de decomposição, padrões e construção de algoritmos.",
        objective: "Resolver desafios para exercitar algoritmos e decomposição.",
      },
    ],
  },
  {
    id: "mensagens-sem-erro-paridade-protocolos",
    name: "Mensagens sem erro: paridade e protocolos",
    summary: "Uma investigação sobre como redes detectam falhas e reconstroem mensagens.",
    category: "Mundo Digital",
    grades: [6],
    icon: Network,
    objective:
      "Compreender como informações são verificadas, organizadas e recuperadas quando ocorrem erros durante uma transmissão.",
    journeyTitle: "Do erro localizado à mensagem reconstruída",
    backgroundColor: "indigo",
    savedIcon: "puzzle",
    stages: [
      {
        resourceId: "unicamp-desplugada-atividade-4",
        label: "Detectar",
        title: "Encontrando um erro com paridade",
        description:
          "Ao virar uma carta em uma matriz, a turma usa padrões pares e ímpares para localizar a alteração.",
        objective:
          "Identificar como bits de paridade permitem localizar alterações em uma mensagem.",
      },
      {
        resourceId: "unicamp-desplugada-atividade-13",
        label: "Reconstruir",
        title: "Criando regras para uma mensagem chegar inteira",
        description:
          "Com partes que podem atrasar, sumir ou chegar fora de ordem, a turma cria um protocolo para reconstruir a mensagem.",
        objective:
          "Criar regras para ordenar, confirmar e reenviar partes de uma mensagem.",
      },
    ],
  },
  {
    id: "privacidade-armadilhas-online",
    name: "Privacidade e armadilhas online",
    summary: "Histórias e decisões práticas para proteger dados e reconhecer golpes na internet.",
    category: "Cultura Digital",
    grades: [4, 5],
    icon: ShieldCheck,
    objective:
      "Analisar o que pode ser compartilhado na internet e reconhecer sinais de mensagens, links e situações enganosas.",
    journeyTitle: "Das escolhas pessoais à identificação de armadilhas",
    backgroundColor: "green",
    savedIcon: "flag",
    stages: [
      {
        resourceId: "rozelma-aventuras-digitais",
        label: "Analisar",
        title: "O que deve permanecer privado?",
        description:
          "A turma discute situações das histórias e identifica dados pessoais, riscos de exposição e escolhas responsáveis de compartilhamento.",
        objective:
          "Distinguir informações pessoais e avaliar riscos antes de compartilhar conteúdo.",
      },
      {
        resourceId: "google-interland",
        label: "Praticar",
        title: "Reconhecendo golpes e decisões arriscadas",
        description:
          "Em desafios do Interland, os estudantes testam decisões sobre phishing, informações enganosas e compartilhamento.",
        objective:
          "Reconhecer sinais de phishing, informações enganosas e escolhas inseguras em ambientes digitais.",
      },
    ],
  },
  {
    id: "programas-ler-testar-corrigir",
    name: "Programas em ação: ler, testar e corrigir",
    summary: "Do tabuleiro aos desafios na tela, uma sequência para executar instruções e encontrar erros.",
    category: "Pensamento Computacional",
    grades: [6],
    icon: Bug,
    objective:
      "Interpretar sequências, repetições e condições, simular sua execução e justificar correções em algoritmos.",
    journeyTitle: "Da execução de comandos à identificação de erros",
    backgroundColor: "coral",
    savedIcon: "puzzle",
    stages: [
      {
        resourceId: "ufsc-splashcode",
        label: "Executar",
        title: "Comandos que movimentam as peças",
        description:
          "Após uma breve apresentação de algoritmos, os grupos organizam cartas e simulam seus efeitos no tabuleiro. O professor prepara as peças antes da aula e apresenta as regras oficiais.",
        objective: "Relacionar a ordem dos comandos aos movimentos produzidos no tabuleiro.",
      },
      {
        resourceId: "computacional-bugs",
        label: "Corrigir",
        title: "Onde as instruções deixam de funcionar?",
        description:
          "Com as folhas impressas, os estudantes simulam os fluxogramas, localizam instruções inadequadas e testam suas correções. Cada grupo explica por que a mudança resolve o problema.",
        objective: "Localizar erros em instruções e verificar as correções por simulação.",
      },
      {
        resourceId: "toxicode-compute-it",
        label: "Interpretar",
        title: "Ler um programa e prever o percurso",
        description:
          "Nos desafios iniciais e intermediários do Compute It, os estudantes executam comandos em português. Explicam como sequências, repetições e condições determinam o percurso e retomam as tentativas quando necessário.",
        objective: "Prever e conferir o resultado de programas com sequências, repetições e condições.",
      },
    ],
  },
  {
    id: "buscar-ordenar-estrategia",
    name: "Buscar e ordenar com estratégia",
    summary: "Comparar tentativas e operações para compreender busca, ordenação e execução em paralelo.",
    category: "Pensamento Computacional",
    grades: [8],
    icon: Search,
    objective:
      "Comparar estratégias de ordenação e busca pelo número de operações e distinguir execução sequencial e paralela.",
    journeyTitle: "Da organização dos dados ao trabalho em paralelo",
    backgroundColor: "violet",
    savedIcon: "target",
    stages: [
      {
        resourceId: "unicamp-desplugada-atividade-7",
        label: "Ordenar",
        title: "Ordenar comparando pares",
        description:
          "Com recipientes de pesos diferentes e uma balança de dois pratos, a turma experimenta estratégias de ordenação. Registra o número de comparações e discute como cada estratégia organiza os dados.",
        objective: "Comparar estratégias de ordenação pelo número de comparações realizadas.",
      },
      {
        resourceId: "unicamp-desplugada-atividade-6",
        label: "Buscar",
        title: "Como a organização muda a busca?",
        description:
          "Em duplas, os estudantes comparam as versões de busca linear e binária da Batalha Naval. Registram tentativas e explicam por que a busca binária depende de dados ordenados.",
        objective: "Relacionar a organização dos dados à eficiência de estratégias de busca.",
      },
      {
        resourceId: "unicamp-desplugada-atividade-8",
        label: "Comparar",
        title: "Ordenar com comparações simultâneas",
        description:
          "A turma percorre uma rede de ordenação desenhada no chão e realiza comparações simultâneas. Depois, contrasta a dinâmica com as comparações feitas uma de cada vez na primeira etapa.",
        objective: "Distinguir operações sequenciais e paralelas em uma rede de ordenação.",
      },
    ],
  },
  {
    id: "dados-imagens-textos-compactacao",
    name: "Dados: imagens, textos e compactação",
    summary: "Entender onde os dados ficam guardados e explorar formas de representar imagens e textos com menos repetições.",
    category: "Mundo Digital",
    grades: [6],
    icon: Binary,
    objective:
      "Distinguir memória e armazenamento e comparar formas de representar imagens e textos, explorando a redução de repetições sem perder a informação.",
    journeyTitle: "Do armazenamento à representação compacta dos dados",
    backgroundColor: "blue",
    savedIcon: "lightbulb",
    stages: [
      {
        resourceId: "manual-mundo-memoria-computador",
        label: "Compreender",
        title: "O que permanece quando o computador desliga?",
        description:
          "O professor exibe o vídeo com pausas para distinguir memória volátil e armazenamento persistente. A turma organiza exemplos e discute por que o espaço para guardar dados é limitado.",
        objective: "Distinguir memória volátil e armazenamento persistente a partir de exemplos.",
      },
      {
        resourceId: "unicamp-desplugada-atividade-2",
        label: "Representar",
        title: "Uma imagem descrita por sequências de números",
        description:
          "Com folhas quadriculadas, os estudantes decodificam imagens em preto e branco. Comparam a descrição de cada pixel com a representação de grupos consecutivos e verificam se a imagem pode ser reconstruída.",
        objective: "Compreender a representação de imagens por pixels e por comprimentos de sequências.",
      },
      {
        resourceId: "unicamp-desplugada-atividade-3",
        label: "Compactar",
        title: "Evitar repetições em um texto",
        description:
          "A turma identifica trechos repetidos e experimenta as referências propostas na atividade. Reconstrói o texto e compara essa estratégia com a representação compacta de imagens da etapa anterior.",
        objective: "Explicar como referências a trechos repetidos podem reduzir a representação de um texto.",
      },
    ],
  },
  {
    id: "internet-enderecos-caminho-dados",
    name: "Internet: o caminho dos dados",
    summary: "Vídeos e uma simulação em grupo para relacionar endereços, circulação de dados e congestionamentos.",
    category: "Mundo Digital",
    grades: [8],
    icon: Globe,
    objective:
      "Explicar o papel de endereços IP e DNS e usar uma simulação para reconhecer limites e bloqueios na circulação de dados.",
    journeyTitle: "Do endereço de um site à circulação dos dados",
    backgroundColor: "turquoise",
    savedIcon: "route",
    stages: [
      {
        resourceId: "nicbr-como-funciona-internet-playlist",
        label: "Explorar",
        title: "Como o navegador encontra um site?",
        description:
          "Com os episódios sobre IP e DNS, a turma discute endereços e nomes de domínio. Representa um percurso simplificado até um site; os demais episódios ficam como aprofundamento opcional.",
        objective: "Relacionar nomes de domínio, DNS e endereços IP ao acesso a serviços na Internet.",
      },
      {
        resourceId: "unicamp-desplugada-atividade-10",
        label: "Simular",
        title: "Quando o caminho fica bloqueado",
        description:
          "No Jogo da Laranja, os participantes encaminham objetos com espaço limitado. Identificam congestionamentos e bloqueios e discutem o que a simulação ajuda a compreender sobre a circulação de dados.",
        objective: "Reconhecer como recursos limitados podem gerar bloqueios em uma simulação de rede.",
      },
    ],
  },
  {
    id: "cyberbullying-reconhecer-agir",
    name: "Cyberbullying: reconhecer e agir",
    summary: "Analisar casos, criar uma narrativa de enfrentamento e avaliar decisões em um jogo educativo.",
    category: "Cultura Digital",
    grades: [7],
    icon: MessagesSquare,
    objective:
      "Reconhecer situações de cyberbullying e justificar atitudes de prevenção e enfrentamento por meio de narrativas e decisões em um jogo.",
    journeyTitle: "Da análise dos casos às decisões de enfrentamento",
    backgroundColor: "coral",
    savedIcon: "flag",
    stages: [
      {
        resourceId: "rozelma-cyberbullying-brincadeira-mau-gosto",
        lessonCount: 3,
        label: "Analisar e criar",
        title: "Reconhecer a violência e construir respostas",
        description:
          "A turma segue as três aulas da sequência: diferencia bullying e cyberbullying, debate os casos ilustrados e cria uma narrativa ou animação no Scratch com formas de enfrentamento.",
        objective: "Analisar casos de cyberbullying e criar uma narrativa digital com respostas responsáveis.",
      },
      {
        resourceId: "altinovare-cyberbullying",
        label: "Decidir",
        title: "Aplicar o que foi discutido",
        description:
          "Após a introdução ao tema e a produção das narrativas, os estudantes enfrentam os dilemas do jogo. Ao final, justificam suas escolhas e as relacionam às atitudes discutidas na sequência.",
        objective: "Justificar decisões de prevenção e enfrentamento nos dilemas de um jogo educativo.",
      },
    ],
  },
  {
    id: "desinformacao-investigar-compartilhar",
    name: "Desinformação: investigar antes de compartilhar",
    summary: "Da leitura crítica à pesquisa e à construção de critérios para avaliar informações que circulam na Internet.",
    category: "Cultura Digital",
    grades: [9],
    icon: Newspaper,
    objective:
      "Investigar informações com base em autoria, contexto, fontes e evidências e justificar critérios antes de compartilhar notícias.",
    journeyTitle: "Da investigação de notícias aos critérios de compartilhamento",
    backgroundColor: "violet",
    savedIcon: "book-open-check",
    stages: [
      {
        resourceId: "sme-goiania-as-fake-news",
        lessonCount: 2,
        label: "Investigar",
        title: "Ler, pesquisar e sustentar conclusões",
        description:
          "A turma lê o texto, responde às questões e pesquisa efeitos da desinformação. Depois, socializa os resultados e justifica as conclusões por fontes e evidências, sem usar a aparência como prova.",
        objective: "Analisar notícias falsas e justificar conclusões com fontes e evidências.",
      },
      {
        resourceId: "nicbr-internet-responsa-adolescentes",
        label: "Sistematizar",
        title: "Que cuidados adotar antes de compartilhar?",
        description:
          "Com trechos do guia sobre desinformação, os estudantes revisam as conclusões da pesquisa. Elaboram um roteiro de verificação e explicam como aplicá-lo a uma situação selecionada pelo professor.",
        objective: "Construir e justificar critérios para verificar informações antes do compartilhamento.",
      },
    ],
  },
] as const;

export function getReadyPathLessonCount(path: ReadyPath): number {
  return path.stages.reduce((total, stage) => total + (stage.lessonCount ?? 1), 0);
}
