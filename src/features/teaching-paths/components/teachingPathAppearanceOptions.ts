import type {
  TeachingPathBackgroundColor,
  TeachingPathIcon,
} from "@/domain/savedTeachingPath";

export const teachingPathIconLabels: Record<TeachingPathIcon, string> = {
  "book-open-check": "Livro aberto",
  route: "Caminho",
  target: "Alvo",
  sparkles: "Estrelas",
  flag: "Bandeira",
  lightbulb: "Lâmpada",
  puzzle: "Quebra-cabeça",
};

export const teachingPathColorLabels: Record<TeachingPathBackgroundColor, string> = {
  turquoise: "Turquesa",
  blue: "Azul",
  green: "Verde",
  indigo: "Índigo",
  violet: "Violeta",
  amber: "Âmbar",
  coral: "Coral",
};
