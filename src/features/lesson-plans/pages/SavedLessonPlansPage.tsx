import { Download, FilePenLine, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { downloadLessonPlanPdf } from "@/features/lesson-plans/lib/lessonPlanPdf";
import { useLessonPlansStore } from "@/store/useLessonPlansStore";

import styles from "./SavedLessonPlansPage.module.css";

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

function updatedAtLabel(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SavedLessonPlansPage() {
  const plans = useLessonPlansStore((state) => state.plans);
  const [search, setSearch] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const normalizedSearch = normalizeSearchText(search);
  const visiblePlans = useMemo(
    () =>
      [...plans]
        .sort(
          (left, right) =>
            Date.parse(right.updatedAt) - Date.parse(left.updatedAt),
        )
        .filter((savedPlan) =>
          normalizeSearchText(savedPlan.plan.theme).includes(normalizedSearch),
        ),
    [normalizedSearch, plans],
  );

  const resultLabel =
    visiblePlans.length === 1
      ? "1 plano encontrado"
      : `${visiblePlans.length} planos encontrados`;

  return (
    <section className={styles.page} aria-labelledby="saved-plans-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Planejamento docente</p>
          <h1 id="saved-plans-title">Meus Planos de Aula</h1>
          <p>Consulte, edite e baixe os planos salvos neste navegador.</p>
        </div>
        <Link className={styles.createLink} to="/app/plano-de-aula">
          <Plus aria-hidden="true" size={19} />
          Criar novo plano
        </Link>
      </header>

      {plans.length > 0 ? (
        <div className={styles.searchArea}>
          <label htmlFor="lesson-plan-search">Pesquisar planos pelo nome</label>
          <div className={styles.searchField}>
            <Search aria-hidden="true" size={20} />
            <input
              id="lesson-plan-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite o tema do plano"
            />
          </div>
          <p role="status" aria-live="polite">{resultLabel}</p>
        </div>
      ) : null}

      <p className={styles.downloadStatus} role="status" aria-live="polite">
        {downloadStatus}
      </p>

      {plans.length === 0 ? (
        <div className={styles.emptyState}>
          <FilePenLine aria-hidden="true" size={38} strokeWidth={1.7} />
          <h2>Nenhum plano salvo</h2>
          <p>Crie um plano de aula e selecione “Salvar plano” para encontrá-lo aqui.</p>
          <Link to="/app/plano-de-aula">Criar meu primeiro plano</Link>
        </div>
      ) : visiblePlans.length === 0 ? (
        <div className={styles.emptyState}>
          <Search aria-hidden="true" size={38} strokeWidth={1.7} />
          <h2>Nenhum plano encontrado</h2>
          <p>Tente pesquisar por outro nome ou parte do tema.</p>
        </div>
      ) : (
        <div className={styles.planList}>
          {visiblePlans.map((savedPlan) => (
            <article key={savedPlan.id} className={styles.planCard}>
              <div className={styles.cardAccent} aria-hidden="true" />
              <div className={styles.cardContent}>
                <div>
                  <p className={styles.cardLabel}>Plano de aula</p>
                  <h2>{savedPlan.plan.theme}</h2>
                  <p className={styles.cardMeta}>
                    {savedPlan.plan.grade}º ano · {savedPlan.plan.lessonCount === 1 ? "1 aula" : `${savedPlan.plan.lessonCount} aulas`} · {savedPlan.plan.totalDurationMinutes} minutos
                  </p>
                  <p className={styles.updatedAt}>
                    Atualizado em {updatedAtLabel(savedPlan.updatedAt)}
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <Link to={`/app/planos/${savedPlan.id}/editar`}>
                    <FilePenLine aria-hidden="true" size={18} />
                    Editar plano
                  </Link>
                  <button
                    type="button"
                    aria-label={`Baixar PDF de ${savedPlan.plan.theme}`}
                    onClick={() => {
                      downloadLessonPlanPdf(savedPlan.plan);
                      setDownloadStatus(
                        `Download do plano “${savedPlan.plan.theme}” iniciado.`,
                      );
                    }}
                  >
                    <Download aria-hidden="true" size={18} />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
