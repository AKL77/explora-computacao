/**
 * Vocabulário curatorial de assuntos para a busca. Os grupos acompanham os
 * eixos da BNCC Computação, mas os termos não são rótulos oficiais da BNCC.
 */
export const materialKeywordGroups = [
  {
    axis: "Pensamento Computacional",
    options: [
      { id: "algoritmos", label: "Algoritmos" },
      { id: "sequencias-instrucoes", label: "Sequências de instruções" },
      { id: "repeticoes", label: "Repetições" },
      { id: "condicoes", label: "Condições" },
      { id: "logica-computacional", label: "Lógica computacional" },
      { id: "decomposicao", label: "Decomposição de problemas" },
      { id: "generalizacao-reuso", label: "Generalização e reúso" },
      { id: "programacao", label: "Programação" },
      { id: "variaveis-tipos", label: "Variáveis e tipos de dados" },
      { id: "depuracao", label: "Depuração de programas" },
      { id: "matrizes-coordenadas", label: "Matrizes e coordenadas" },
      { id: "registros", label: "Registros" },
      { id: "listas", label: "Listas" },
      { id: "grafos-arvores", label: "Grafos e árvores" },
      { id: "busca-ordenacao", label: "Busca e ordenação" },
      { id: "recursao", label: "Recursão" },
      { id: "automatos-eventos", label: "Autômatos e eventos" },
    ],
  },
  {
    axis: "Mundo Digital",
    options: [
      { id: "codificacao-digital", label: "Codificação digital" },
      { id: "sistema-binario", label: "Sistema binário" },
      { id: "imagens-digitais-pixels", label: "Imagens digitais e pixels" },
      { id: "componentes-computador", label: "Componentes do computador" },
      { id: "sistema-operacional", label: "Sistema operacional" },
      { id: "armazenamento-dados", label: "Armazenamento de dados" },
      { id: "arquivos-compactacao", label: "Arquivos e compactação" },
      { id: "transmissao-dados", label: "Transmissão de dados" },
      { id: "protocolos-comunicacao", label: "Protocolos de comunicação" },
      { id: "redes-internet", label: "Redes e internet" },
      { id: "sistemas-distribuidos", label: "Sistemas distribuídos" },
      { id: "seguranca-cibernetica", label: "Segurança cibernética" },
      { id: "criptografia", label: "Criptografia" },
    ],
  },
  {
    axis: "Cultura Digital",
    options: [
      { id: "pesquisa-internet", label: "Pesquisa na internet" },
      { id: "confiabilidade-fontes", label: "Confiabilidade das fontes" },
      { id: "desinformacao", label: "Desinformação" },
      { id: "producao-conteudo", label: "Produção de conteúdo digital" },
      { id: "etica-digital", label: "Ética digital" },
      { id: "dados-pessoais-privacidade", label: "Dados pessoais e privacidade" },
      { id: "direitos-autorais-imagem", label: "Direitos autorais e de imagem" },
      { id: "redes-sociais", label: "Redes sociais" },
      { id: "convivencia-respeito", label: "Convivência e respeito online" },
      { id: "cyberbullying", label: "Cyberbullying" },
      { id: "impactos-sociedade", label: "Impactos da tecnologia na sociedade" },
      { id: "tecnologia-trabalho", label: "Tecnologia e trabalho" },
      { id: "desigualdade-acesso", label: "Desigualdade de acesso digital" },
      { id: "sustentabilidade-descarte", label: "Sustentabilidade e descarte eletrônico" },
    ],
  },
] as const;

export type MaterialKeywordId = (typeof materialKeywordGroups)[number]["options"][number]["id"];

/** Assuntos atribuídos ao conteúdo de cada material, sem inferi-los de competências amplas. */
export const materialKeywordIdsByResourceId: Record<string, readonly MaterialKeywordId[]> = {
  "altinovare-cyberbullying": ["cyberbullying", "etica-digital", "convivencia-respeito"],
  "unicamp-desplugada-atividade-1": ["codificacao-digital", "sistema-binario"],
  "unicamp-desplugada-atividade-2": [
    "codificacao-digital", "imagens-digitais-pixels", "matrizes-coordenadas", "arquivos-compactacao",
  ],
  "unicamp-desplugada-atividade-3": ["arquivos-compactacao"],
  "unicamp-desplugada-atividade-4": ["codificacao-digital", "matrizes-coordenadas", "transmissao-dados"],
  "unicamp-desplugada-atividade-5": ["condicoes", "grafos-arvores", "busca-ordenacao"],
  "unicamp-desplugada-atividade-6": ["algoritmos", "listas", "busca-ordenacao"],
  "unicamp-desplugada-atividade-7": ["algoritmos", "listas", "busca-ordenacao"],
  "unicamp-desplugada-atividade-8": ["algoritmos", "busca-ordenacao"],
  "unicamp-desplugada-atividade-9": ["grafos-arvores"],
  "unicamp-desplugada-atividade-10": ["redes-internet", "sistemas-distribuidos"],
  "unicamp-desplugada-atividade-11": ["automatos-eventos"],
  "unicamp-desplugada-atividade-12": ["algoritmos", "sequencias-instrucoes", "programacao"],
  "unicamp-desplugada-atividade-13": ["transmissao-dados", "protocolos-comunicacao", "redes-internet"],
  "unicamp-desplugada-atividade-14": ["grafos-arvores"],
  "unicamp-desplugada-atividade-15": ["grafos-arvores"],
  "unicamp-desplugada-atividade-16": ["grafos-arvores"],
  "unicamp-desplugada-atividade-17": [
    "protocolos-comunicacao", "criptografia", "dados-pessoais-privacidade",
  ],
  "unicamp-desplugada-atividade-18": ["protocolos-comunicacao", "seguranca-cibernetica"],
  "unicamp-desplugada-atividade-19": ["criptografia", "seguranca-cibernetica"],
  "unicamp-desplugada-atividade-22": ["armazenamento-dados", "arquivos-compactacao"],
  "unicamp-desplugada-atividade-23": ["matrizes-coordenadas", "decomposicao"],
  "lightbot-web": ["algoritmos", "sequencias-instrucoes", "repeticoes", "programacao"],
  "google-blockly-games": ["algoritmos", "repeticoes", "condicoes", "programacao"],
  "rozelma-lua-bit-bit-variaveis": ["programacao", "variaveis-tipos", "generalizacao-reuso"],
  "rozelma-sertao-bit": ["algoritmos", "decomposicao", "programacao"],
  "rozelma-aventuras-digitais": [
    "pesquisa-internet", "confiabilidade-fontes", "desinformacao", "etica-digital",
    "dados-pessoais-privacidade", "direitos-autorais-imagem",
  ],
  "rozelma-cyberbullying-brincadeira-mau-gosto": [
    "cyberbullying", "convivencia-respeito", "producao-conteudo", "programacao",
  ],
  "google-interland": [
    "confiabilidade-fontes", "desinformacao", "etica-digital",
    "dados-pessoais-privacidade", "convivencia-respeito", "cyberbullying",
  ],
};

export function getMaterialKeywordIds(resourceId: string): readonly MaterialKeywordId[] {
  return materialKeywordIdsByResourceId[resourceId] ?? [];
}
