/** Resolve um ativo da pasta `public` respeitando o caminho-base do deploy. */
export function publicAsset(path: string): string {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}
