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
  turquoise: "Azul profundo",
  blue: "Azul",
  green: "Bronze",
  indigo: "Chumbo",
  violet: "Laranja",
  amber: "Dourado",
  coral: "Prata",
};
