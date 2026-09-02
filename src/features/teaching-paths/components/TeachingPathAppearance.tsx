import {
  BookOpenCheck,
  Flag,
  Route,
  Sparkles,
  Target,
  type LucideProps,
} from "lucide-react";

import type { TeachingPathIcon } from "@/domain/savedTeachingPath";

const iconComponents = {
  "book-open-check": BookOpenCheck,
  route: Route,
  target: Target,
  sparkles: Sparkles,
  flag: Flag,
} as const;

interface TeachingPathIconGlyphProps extends Omit<LucideProps, "ref"> {
  icon: TeachingPathIcon;
}

export function TeachingPathIconGlyph({ icon, ...props }: TeachingPathIconGlyphProps) {
  const Icon = iconComponents[icon];
  return <Icon {...props} />;
}
