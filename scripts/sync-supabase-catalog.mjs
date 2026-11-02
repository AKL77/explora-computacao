import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const sources = ["src/data/resources.mock.ts", ...readdirSync(resolve(root, "src/data/resources")).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts")).map((file) => `src/data/resources/${file}`)];
const ids = new Set();
for (const file of sources) {
  const source = ts.createSourceFile(file, readFileSync(resolve(root, file), "utf8"), ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
      if (node.name.text === "id" && ts.isStringLiteral(node.initializer)) ids.add(node.initializer.text);
      if (file.endsWith("unicampUnplugged.ts") && node.name.text === "number" && ts.isNumericLiteral(node.initializer)) ids.add(`unicamp-desplugada-atividade-${node.initializer.text}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
if (!ids.size || [...ids].some((id) => !/^[a-z0-9-]+$/.test(id))) throw new Error("Identificadores do acervo inválidos");
const sql = `-- Gerado por node scripts/sync-supabase-catalog.mjs. Não contém dados de usuários.\ninsert into public.catalog_resource_ids(id) values\n${[...ids].sort().map((id) => `  ('${id}')`).join(",\n")}\non conflict(id) do nothing;\n`;
writeFileSync(resolve(root, "supabase/seed.sql"), sql);
process.stdout.write(`${ids.size} identificadores do acervo preparados.\n`);
