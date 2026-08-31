import type {
  ComposedLessonPlan,
  LessonMaterial,
} from "@/domain/lessonPlan";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PAGE_MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const FOOTER_TOP = PAGE_HEIGHT - 30;
const CONTENT_BOTTOM = PAGE_HEIGHT - 46;
const BLOCK_GAP = 10;
const BLOCK_HEADER_HEIGHT = 24;
const BLOCK_PADDING_TOP = 9;
const BLOCK_PADDING_BOTTOM = 10;
const BODY_FONT_SIZE = 10;
const BODY_LINE_HEIGHT = 13.5;
const BLOCK_OVERHEAD =
  BLOCK_HEADER_HEIGHT + BLOCK_PADDING_TOP + BLOCK_PADDING_BOTTOM;

const COLORS = {
  navy: "0.031 0.184 0.286",
  blue: "0.027 0.349 0.522",
  cyan: "0.055 0.455 0.565",
  brightCyan: "0.133 0.827 0.933",
  paleBlue: "0.918 0.957 0.969",
  border: "0.620 0.714 0.753",
  text: "0.078 0.129 0.169",
  muted: "0.322 0.380 0.420",
  white: "1 1 1",
} as const;

type PdfFont = "regular" | "bold";

interface PdfLine {
  text: string;
  font: PdfFont;
}

interface PdfSection {
  title: string;
  lines: PdfLine[];
}

interface PdfPage {
  commands: string[];
}

const WINDOWS_1252_SPECIAL = new Map<number, number>([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function number(value: number): string {
  return Number(value.toFixed(2)).toString();
}

function normalizeDisplayText(value: string): string {
  return value
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u00a0\u202f]/g, " ")
    .replace(/\u2026/g, "...")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toWindows1252Byte(character: string): number {
  const codePoint = character.codePointAt(0) ?? 0x3f;

  if (codePoint <= 0x7f || (codePoint >= 0xa0 && codePoint <= 0xff)) {
    return codePoint;
  }

  return WINDOWS_1252_SPECIAL.get(codePoint) ?? 0x3f;
}

/** Produz uma string literal PDF ASCII com o conteúdo em WinAnsi. */
function escapePdfLiteral(value: string): string {
  let escaped = "";

  for (const character of normalizeDisplayText(value)) {
    const byte = toWindows1252Byte(character);

    if (byte === 0x28 || byte === 0x29 || byte === 0x5c) {
      escaped += `\\${String.fromCharCode(byte)}`;
    } else if (byte < 0x20 || byte > 0x7e) {
      escaped += `\\${byte.toString(8).padStart(3, "0")}`;
    } else {
      escaped += String.fromCharCode(byte);
    }
  }

  return escaped;
}

function toUnicodeCMap(): string {
  const specialMappings = [...WINDOWS_1252_SPECIAL.entries()]
    .sort((left, right) => left[1] - right[1])
    .map(
      ([unicode, byte]) =>
        `<${byte.toString(16).padStart(2, "0").toUpperCase()}> <${unicode
          .toString(16)
          .padStart(4, "0")
          .toUpperCase()}>`,
    );

  return [
    "/CIDInit /ProcSet findresource begin",
    "12 dict begin",
    "begincmap",
    "/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def",
    "/CMapName /WinAnsi-UCS def",
    "/CMapType 2 def",
    "1 begincodespacerange",
    "<00> <FF>",
    "endcodespacerange",
    "2 beginbfrange",
    "<00> <7F> <0000>",
    "<A0> <FF> <00A0>",
    "endbfrange",
    `${specialMappings.length} beginbfchar`,
    ...specialMappings,
    "endbfchar",
    "endcmap",
    "CMapName currentdict /CMap defineresource pop",
    "end",
    "end",
  ].join("\n");
}

function characterWidthFactor(character: string): number {
  if (/[ ilI1.,:;'!|]/.test(character)) return 0.29;
  if (/[mwMW@%&]/.test(character)) return 0.82;
  if (/[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(character)) return 0.64;
  return 0.52;
}

function estimatedTextWidth(text: string, fontSize: number): number {
  return [...text].reduce(
    (width, character) => width + characterWidthFactor(character) * fontSize,
    0,
  );
}

function splitLongWord(
  word: string,
  maximumWidth: number,
  fontSize: number,
): string[] {
  const pieces: string[] = [];
  let current = "";

  for (const character of word) {
    const candidate = `${current}${character}`;
    if (current && estimatedTextWidth(candidate, fontSize) > maximumWidth) {
      pieces.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }

  if (current) pieces.push(current);
  return pieces;
}

function wrapText(
  value: string,
  maximumWidth: number,
  fontSize = BODY_FONT_SIZE,
): string[] {
  const normalized = normalizeDisplayText(value);
  if (!normalized) return [""];

  const words = normalized.split(" ").flatMap((word) =>
    estimatedTextWidth(word, fontSize) > maximumWidth
      ? splitLongWord(word, maximumWidth, fontSize)
      : [word],
  );
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && estimatedTextWidth(candidate, fontSize) > maximumWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function textCommand(
  value: string,
  x: number,
  baselineFromTop: number,
  options: {
    color?: string;
    font?: PdfFont;
    size?: number;
  } = {},
): string {
  const font = options.font === "bold" ? "/F2" : "/F1";
  const size = options.size ?? BODY_FONT_SIZE;
  const color = options.color ?? COLORS.text;
  const baseline = PAGE_HEIGHT - baselineFromTop;

  return [
    "BT",
    `${font} ${number(size)} Tf`,
    `${color} rg`,
    `1 0 0 1 ${number(x)} ${number(baseline)} Tm`,
    `(${escapePdfLiteral(value)}) Tj`,
    "ET",
  ].join("\n");
}

function rectangleCommand(
  x: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  stroke?: string,
): string {
  const bottom = PAGE_HEIGHT - top - height;
  const commands = ["q", `${fill} rg`];

  if (stroke) commands.push(`${stroke} RG`, "0.8 w");
  commands.push(
    `${number(x)} ${number(bottom)} ${number(width)} ${number(height)} re`,
    stroke ? "B" : "f",
    "Q",
  );
  return commands.join("\n");
}

function polygonCommand(points: readonly [number, number][], fill: string): string {
  const [first, ...rest] = points;
  const commands = [
    "q",
    `${fill} rg`,
    `${number(first[0])} ${number(PAGE_HEIGHT - first[1])} m`,
    ...rest.map(
      ([x, top]) => `${number(x)} ${number(PAGE_HEIGHT - top)} l`,
    ),
    "h",
    "f",
    "Q",
  ];

  return commands.join("\n");
}

function uniqueMaterials(plan: ComposedLessonPlan): LessonMaterial[] {
  const materials = new Map<string, LessonMaterial>();

  for (const session of plan.sessions) {
    for (const material of session.centralActivity.materials) {
      const key = [
        normalizeDisplayText(material.label).toLocaleLowerCase("pt-BR"),
        normalizeDisplayText(material.details ?? "").toLocaleLowerCase("pt-BR"),
      ].join("|");
      if (!materials.has(key)) materials.set(key, material);
    }
  }

  return [...materials.values()];
}

function wrappedLines(
  value: string,
  font: PdfFont = "regular",
): PdfLine[] {
  const bodyWidth = CONTENT_WIDTH - 24;
  return wrapText(value, bodyWidth).map((text) => ({ text, font }));
}

function bulletLines(value: string): PdfLine[] {
  const bodyWidth = CONTENT_WIDTH - 36;
  const lines = wrapText(value, bodyWidth);

  return lines.map((text, index) => ({
    text: `${index === 0 ? "- " : "  "}${text}`,
    font: "regular",
  }));
}

function sectionContent(plan: ComposedLessonPlan): PdfSection[] {
  const materials = uniqueMaterials(plan);
  const materialLines =
    materials.length > 0
      ? materials.flatMap((material) =>
          bulletLines(
            material.details
              ? `${material.label} - ${material.details}`
              : material.label,
          ),
        )
      : wrappedLines("Nenhum material informado.");

  const bnccLines = wrappedLines(
    `${plan.skill.code} - ${plan.skill.officialText}`,
  );

  const methodologyLines = plan.sessions.flatMap((session, index) => [
    ...(index > 0 ? [{ text: "", font: "regular" as const }] : []),
    ...wrappedLines(
      `Aula ${session.number} - ${session.durationMinutes} minutos`,
      "bold",
    ),
    ...wrappedLines(session.centralActivity.description),
  ]);

  return [
    { title: "BNCC", lines: bnccLines },
    { title: "Objetivo", lines: wrappedLines(plan.objective) },
    { title: "Materiais", lines: materialLines },
    { title: "Metodologia", lines: methodologyLines },
    {
      title: "Avaliação",
      lines: wrappedLines(
        plan.evaluation?.description ?? "Não prevista para este plano.",
      ),
    },
  ];
}

function firstPageHeader(
  plan: ComposedLessonPlan,
): { commands: string[]; contentTop: number } {
  const titleWidth = CONTENT_WIDTH - 92;
  const titleLines = wrapText(plan.theme, titleWidth, 20);
  const titleStart = 52;
  const titleLineHeight = 23;
  const metaBaseline = titleStart + (titleLines.length - 1) * titleLineHeight + 25;
  const headerHeight = metaBaseline + 20;
  const commands = [
    rectangleCommand(0, 0, PAGE_WIDTH, headerHeight, COLORS.navy),
    polygonCommand(
      [
        [430, 0],
        [PAGE_WIDTH, 0],
        [PAGE_WIDTH, headerHeight],
        [485, headerHeight - 20],
      ],
      COLORS.blue,
    ),
    polygonCommand(
      [
        [505, 0],
        [PAGE_WIDTH, 0],
        [PAGE_WIDTH, 67],
      ],
      COLORS.brightCyan,
    ),
    textCommand("Plano de aula", PAGE_MARGIN, 27, {
      color: COLORS.white,
      font: "bold",
      size: 9,
    }),
    ...titleLines.map((line, index) =>
      textCommand(line, PAGE_MARGIN, titleStart + index * titleLineHeight, {
        color: COLORS.white,
        font: "bold",
        size: 20,
      }),
    ),
    textCommand(
      `${plan.grade}º ano | ${plan.lessonCount} ${
        plan.lessonCount === 1 ? "aula" : "aulas"
      } | ${plan.totalDurationMinutes} minutos`,
      PAGE_MARGIN,
      metaBaseline,
      { color: COLORS.white, size: 9.5 },
    ),
  ];

  return { commands, contentTop: headerHeight + 15 };
}

function continuationPageHeader(): { commands: string[]; contentTop: number } {
  const headerHeight = 58;
  return {
    commands: [
      rectangleCommand(0, 0, PAGE_WIDTH, headerHeight, COLORS.navy),
      polygonCommand(
        [
          [450, 0],
          [PAGE_WIDTH, 0],
          [PAGE_WIDTH, headerHeight],
          [510, headerHeight],
        ],
        COLORS.blue,
      ),
      textCommand("Plano de aula - continuação", PAGE_MARGIN, 36, {
        color: COLORS.white,
        font: "bold",
        size: 14,
      }),
    ],
    contentTop: headerHeight + 15,
  };
}

function blockCommands(
  title: string,
  lines: readonly PdfLine[],
  top: number,
): { commands: string[]; height: number } {
  const height = BLOCK_OVERHEAD + lines.length * BODY_LINE_HEIGHT;
  const bodyStart = top + BLOCK_HEADER_HEIGHT + BLOCK_PADDING_TOP + BODY_FONT_SIZE;
  const commands = [
    rectangleCommand(
      PAGE_MARGIN,
      top,
      CONTENT_WIDTH,
      height,
      COLORS.paleBlue,
      COLORS.border,
    ),
    rectangleCommand(
      PAGE_MARGIN,
      top,
      CONTENT_WIDTH,
      BLOCK_HEADER_HEIGHT,
      COLORS.cyan,
    ),
    textCommand(title, PAGE_MARGIN + 12, top + 16.5, {
      color: COLORS.white,
      font: "bold",
      size: 10,
    }),
    ...lines.map((line, index) =>
      textCommand(
        line.text,
        PAGE_MARGIN + 12,
        bodyStart + index * BODY_LINE_HEIGHT,
        {
          color: line.text ? COLORS.text : COLORS.muted,
          font: line.font,
          size: BODY_FONT_SIZE,
        },
      ),
    ),
  ];

  return { commands, height };
}

function layoutPages(plan: ComposedLessonPlan): PdfPage[] {
  const firstHeader = firstPageHeader(plan);
  const pages: PdfPage[] = [{ commands: [...firstHeader.commands] }];
  let currentPage = pages[0];
  let cursorTop = firstHeader.contentTop;

  const addPage = () => {
    const header = continuationPageHeader();
    currentPage = { commands: [...header.commands] };
    pages.push(currentPage);
    cursorTop = header.contentTop;
  };

  for (const section of sectionContent(plan)) {
    const allLines = section.lines.length
      ? section.lines
      : [{ text: "Não informado.", font: "regular" as const }];
    let lineIndex = 0;
    let continuation = false;

    while (lineIndex < allLines.length) {
      let availableHeight = CONTENT_BOTTOM - cursorTop;
      const minimumHeight = BLOCK_OVERHEAD + BODY_LINE_HEIGHT;

      if (availableHeight < minimumHeight) {
        addPage();
        availableHeight = CONTENT_BOTTOM - cursorTop;
      }

      const capacity = Math.max(
        1,
        Math.floor((availableHeight - BLOCK_OVERHEAD) / BODY_LINE_HEIGHT),
      );
      const chunk = allLines.slice(lineIndex, lineIndex + capacity);
      const block = blockCommands(
        `${section.title}${continuation ? " (continuação)" : ""}`,
        chunk,
        cursorTop,
      );

      currentPage.commands.push(...block.commands);
      cursorTop += block.height + BLOCK_GAP;
      lineIndex += chunk.length;
      continuation = true;

      if (lineIndex < allLines.length) addPage();
    }
  }

  const pageCount = pages.length;
  pages.forEach((page, index) => {
    const lineY = PAGE_HEIGHT - FOOTER_TOP + 12;
    page.commands.push(
      [
        "q",
        `${COLORS.border} RG`,
        "0.6 w",
        `${number(PAGE_MARGIN)} ${number(lineY)} m`,
        `${number(PAGE_WIDTH - PAGE_MARGIN)} ${number(lineY)} l`,
        "S",
        "Q",
      ].join("\n"),
      textCommand("Informática Explorer", PAGE_MARGIN, FOOTER_TOP + 17, {
        color: COLORS.muted,
        size: 8,
      }),
      textCommand(
        `Página ${index + 1} de ${pageCount}`,
        PAGE_WIDTH - PAGE_MARGIN - 68,
        FOOTER_TOP + 17,
        { color: COLORS.muted, size: 8 },
      ),
    );
  });

  return pages;
}

function buildPdfBytes(plan: ComposedLessonPlan): Uint8Array {
  const pages = layoutPages(plan);
  const objects = new Map<number, string>();
  const regularFontObject = 3;
  const boldFontObject = 4;
  const unicodeMapObject = 5;
  const firstPageObject = 6;
  const pageObjectNumbers = pages.map((_, index) => firstPageObject + index * 2);
  const infoObject = firstPageObject + pages.length * 2;

  objects.set(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objects.set(
    2,
    `<< /Type /Pages /Kids [${pageObjectNumbers
      .map((objectNumber) => `${objectNumber} 0 R`)
      .join(" ")}] /Count ${pages.length} >>`,
  );
  objects.set(
    regularFontObject,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding /ToUnicode ${unicodeMapObject} 0 R >>`,
  );
  objects.set(
    boldFontObject,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding /ToUnicode ${unicodeMapObject} 0 R >>`,
  );
  const unicodeMap = toUnicodeCMap();
  objects.set(
    unicodeMapObject,
    `<< /Length ${unicodeMap.length} >>\nstream\n${unicodeMap}\nendstream`,
  );

  pages.forEach((page, index) => {
    const pageObject = pageObjectNumbers[index];
    const contentObject = pageObject + 1;
    const stream = page.commands.join("\n");

    objects.set(
      pageObject,
      [
        "<< /Type /Page",
        "/Parent 2 0 R",
        `/MediaBox [0 0 ${number(PAGE_WIDTH)} ${number(PAGE_HEIGHT)}]`,
        `/Resources << /Font << /F1 ${regularFontObject} 0 R /F2 ${boldFontObject} 0 R >> >>`,
        `/Contents ${contentObject} 0 R`,
        ">>",
      ].join(" "),
    );
    objects.set(
      contentObject,
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    );
  });

  objects.set(
    infoObject,
    `<< /Title (${escapePdfLiteral(`Plano de aula - ${plan.theme}`)}) /Author (${escapePdfLiteral("Informática Explorer")}) /Producer (${escapePdfLiteral("Informática Explorer")}) >>`,
  );

  let pdf = "%PDF-1.4\n% Informatica Explorer\n";
  const offsets: number[] = [0];

  for (let objectNumber = 1; objectNumber <= infoObject; objectNumber += 1) {
    const body = objects.get(objectNumber);
    if (!body) throw new Error(`Objeto PDF ausente: ${objectNumber}.`);
    offsets[objectNumber] = pdf.length;
    pdf += `${objectNumber} 0 obj\n${body}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${infoObject + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let objectNumber = 1; objectNumber <= infoObject; objectNumber += 1) {
    pdf += `${offsets[objectNumber].toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += [
    "trailer",
    `<< /Size ${infoObject + 1} /Root 1 0 R /Info ${infoObject} 0 R >>`,
    "startxref",
    xrefOffset.toString(),
    "%%EOF",
    "",
  ].join("\n");

  return new TextEncoder().encode(pdf);
}

export function createLessonPlanPdf(plan: ComposedLessonPlan): Blob {
  const bytes = buildPdfBytes(plan);
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([buffer], { type: "application/pdf" });
}

export function lessonPlanPdfFileName(plan: ComposedLessonPlan): string {
  const slug = plan.theme
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return `plano-de-aula-${slug || "sem-titulo"}.pdf`;
}

export function downloadLessonPlanPdf(plan: ComposedLessonPlan): void {
  if (
    typeof document === "undefined" ||
    typeof URL.createObjectURL !== "function" ||
    typeof URL.revokeObjectURL !== "function"
  ) {
    throw new Error("O download de PDF requer um navegador compatível.");
  }

  const blob = createLessonPlanPdf(plan);
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = lessonPlanPdfFileName(plan);
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
