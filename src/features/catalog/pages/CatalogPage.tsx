import { CatalogStatus } from "../components/CatalogStatus";
import { CatalogView } from "../components/CatalogView";
import { useCatalogResources } from "../hooks/useCatalog";

export function CatalogPage() {
  const { resources, status } = useCatalogResources();

  if (status === "loading") {
    return (
      <CatalogStatus
        title="Carregando Acervo"
        message="Estamos preparando os recursos curados."
        busy
      />
    );
  }

  if (status === "error") {
    return (
      <CatalogStatus
        title="Não foi possível carregar o Acervo"
        message="Recarregue a página para tentar novamente."
      />
    );
  }

  return (
    <CatalogView
      title="Acervo"
      description="Descubra recursos curados para o ensino de Computação e encontre o que combina com a realidade da sua turma."
      resources={resources}
    />
  );
}
