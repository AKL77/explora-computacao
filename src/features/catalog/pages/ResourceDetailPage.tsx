import {
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import type {
  ParticipationMode,
  PedagogicalFunction,
} from "@/domain/resource";
import {
  getResourceAxes,
  getResourceSkills,
} from "@/domain/resourceCurriculum";

import { CatalogStatus } from "../components/CatalogStatus";
import { RequiredFamiliarity } from "../components/RequiredFamiliarity";
import {
  formatRecommendedGrades,
  RESOURCE_PLACEHOLDER,
  typeLabels,
} from "../components/resourcePresentation";
import { useCatalogResource } from "../hooks/useCatalog";
import styles from "./ResourceDetailPage.module.css";

const participationLabels: Record<ParticipationMode, string> = {
  individual: "individual",
  pair: "em duplas",
  group: "em grupos",
  "whole-class": "com a turma inteira",
};

const pedagogicalFunctionLabels: Record<PedagogicalFunction, string> = {
  introduction: "Introdução",
  exposition: "Exposição",
  exploration: "Exploração",
  practice: "Prática",
  consolidation: "Consolidação",
  assessment: "Avaliação",
};

const detailTabs = [
  { id: "description", label: "Descrição" },
  { id: "additional", label: "Informações adicionais" },
  { id: "source", label: "Fonte" },
] as const;

type DetailTabId = (typeof detailTabs)[number]["id"];

function yesNo(value: boolean | undefined): string {
  if (value === undefined) {
    return "Não informado";
  }

  return value ? "Sim" : "Não";
}

function optionalList(values: readonly string[] | undefined): string {
  if (values === undefined) {
    return "Não informado";
  }

  return values.length > 0 ? values.join(", ") : "Nenhum";
}

function formatParticipation(values: readonly ParticipationMode[] | undefined): string {
  if (!values?.length) {
    return "Não informado";
  }

  const labels = values.map((value) => participationLabels[value]);
  const phrase =
    labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(", ")} ou ${labels.at(-1)}`;

  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

function getBackPath(locationState: unknown): string {
  if (!locationState || typeof locationState !== "object") {
    return "/app/trilha-de-ensino";
  }

  const from = (locationState as { from?: unknown }).from;
  return typeof from === "string" && from.startsWith("/app/")
    ? from
    : "/app/trilha-de-ensino";
}

interface DetailItemProps {
  term: string;
  children: ReactNode;
}

function DetailItem({ term, children }: DetailItemProps) {
  return (
    <div className={styles.detailItem}>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { resource, status } = useCatalogResource(slug);
  const backPath = getBackPath(location.state);
  const [activeTab, setActiveTab] = useState<DetailTabId>("description");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectAdjacentTab = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % detailTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + detailTabs.length) % detailTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = detailTabs.length - 1;
    }

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    setActiveTab(detailTabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  if (status === "loading") {
    return (
      <CatalogStatus
        title="Carregando recurso"
        message="Estamos preparando os detalhes deste conteúdo."
        busy
      />
    );
  }

  if (status === "error") {
    return (
      <CatalogStatus
        title="Não foi possível carregar o recurso"
        message="Recarregue a página para tentar novamente."
      />
    );
  }

  if (!resource) {
    return (
      <section className={styles.notFound} aria-labelledby="resource-not-found-title">
        <span aria-hidden="true">◇</span>
        <h1 id="resource-not-found-title">Recurso não encontrado</h1>
        <p>O endereço pode estar incorreto ou o material não está mais disponível.</p>
        <Link to="/app/trilha-de-ensino" className={styles.primaryLink}>
          Voltar para Buscar Materiais
        </Link>
      </section>
    );
  }

  const axes = getResourceAxes(resource);
  const skills = getResourceSkills(resource);
  const externalUrl = resource.canonicalUrl ?? resource.sourceUrl;

  return (
    <article className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
        <Link to={backPath}>Voltar</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{resource.title}</span>
      </nav>

      <header className={styles.hero}>
        <div className={styles.imageWrap}>
          <img
            src={
              resource.image?.thumbnailSrc ??
              resource.image?.src ??
              RESOURCE_PLACEHOLDER
            }
            alt={resource.image?.alt ?? ""}
            decoding="async"
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badges}>
            <span>{typeLabels[resource.type]}</span>
          </div>
          <h1>{resource.title}</h1>
          <p className={styles.provider}>Fornecedor: {resource.provider}</p>
          <dl className={styles.heroMetadata}>
            <DetailItem term="Turma">
              {formatRecommendedGrades(resource.recommendedGrades)}
            </DetailItem>
            <DetailItem term="Eixo">{axes.join(", ")}</DetailItem>
            <DetailItem term="Habilidade">{resource.topic}</DetailItem>
            <DetailItem term="Competências">
              {skills.length > 0
                ? skills.map((skill) => skill.code).join(", ")
                : "Não informado"}
            </DetailItem>
          </dl>

          <p className={styles.externalNotice}>
            O recurso é externo. Ao acessá-lo, você sairá do Informática Explorer.
          </p>
          <div className={styles.actions}>
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryLink}
            >
              Acessar recurso <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      {resource.requiredFamiliarity ? (
        <section className={styles.familiaritySection} aria-labelledby="required-familiarity-title">
          <div>
            <h2 id="required-familiarity-title">Preparação necessária</h2>
            <p>Nível de familiaridade recomendado para usar este material.</p>
          </div>
          <RequiredFamiliarity levels={resource.requiredFamiliarity} />
          <Link to="/app/sobre" className={styles.familiarityHelp}>
            Entenda os níveis
          </Link>
        </section>
      ) : null}

      <section className={styles.tabSection} aria-label="Detalhes do recurso">
        <div className={styles.tabList} role="tablist" aria-label="Informações do recurso">
          {detailTabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`resource-tab-${tab.id}`}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={activeTab === tab.id}
              aria-controls={`resource-panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => selectAdjacentTab(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="resource-panel-description"
          role="tabpanel"
          aria-labelledby="resource-tab-description"
          className={styles.tabPanel}
          tabIndex={0}
          hidden={activeTab !== "description"}
        >
          <p>{resource.summary}</p>
        </div>

        <div
          id="resource-panel-additional"
          role="tabpanel"
          aria-labelledby="resource-tab-additional"
          className={styles.tabPanel}
          tabIndex={0}
          hidden={activeTab !== "additional"}
        >
          <p className={styles.additionalDescription}>
            {resource.additionalInformation}
          </p>
          <dl className={styles.detailGrid}>
            <DetailItem term="Objetivo de aprendizagem">
              {resource.pedagogy.learningObjective ?? "Não informado"}
            </DetailItem>
            <DetailItem term="Duração">
              {resource.pedagogy.estimatedDuration ?? "Não informado"}
            </DetailItem>
            <DetailItem term="Participação">
              {formatParticipation(resource.pedagogy.participation)}
            </DetailItem>
            <DetailItem term="Materiais">
              {optionalList(resource.pedagogy.materials)}
            </DetailItem>
            <DetailItem term="Função pedagógica">
              {resource.pedagogy.pedagogicalFunction
                ? pedagogicalFunctionLabels[resource.pedagogy.pedagogicalFunction]
                : "Não informado"}
            </DetailItem>
            <DetailItem term="Necessita de internet">
              {yesNo(resource.requirements.internet)}
            </DetailItem>
            <DetailItem term="Dispositivos">
              {optionalList(resource.requirements.devices)}
            </DetailItem>
            <DetailItem term="Necessita de cadastro">
              {yesNo(resource.requirements.accountRequired)}
            </DetailItem>
          </dl>
        </div>

        <div
          id="resource-panel-source"
          role="tabpanel"
          aria-labelledby="resource-tab-source"
          className={styles.tabPanel}
          tabIndex={0}
          hidden={activeTab !== "source"}
        >
          <dl className={styles.detailGrid}>
            <DetailItem term="Fonte">
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineLink}
              >
                {resource.provenance.source}
              </a>
            </DetailItem>
            <DetailItem term="Licença">
              {resource.provenance.license ?? "Não informada"}
            </DetailItem>
            <DetailItem term="Materiais complementares">
              {resource.supplementaryLinks?.length ? (
                <ul className={styles.metadataList}>
                  {resource.supplementaryLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.inlineLink}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                "Não informado"
              )}
            </DetailItem>
          </dl>
        </div>
      </section>
    </article>
  );
}
