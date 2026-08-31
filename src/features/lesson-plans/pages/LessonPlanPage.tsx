import { ClipboardList, Download, Save } from "lucide-react";
import {
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { SUPPORTED_GRADES, type Grade } from "@/domain/curriculum";
import type {
  ComposeLessonPlanResult,
  ComposedLessonPlan,
  LessonCount,
  LessonMaterial,
  MethodologyProfile,
} from "@/domain/lessonPlan";
import { composeLessonPlan } from "@/domain/lessonPlanComposer";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import {
  getPlanSkillOptions,
  toLessonResourceCandidate,
} from "@/features/lesson-plans/lib/lessonPlanCatalog";
import { downloadLessonPlanPdf } from "@/features/lesson-plans/lib/lessonPlanPdf";
import { useLessonPlansStore } from "@/store/useLessonPlansStore";

import styles from "./LessonPlanPage.module.css";

type PlanView = "blocks" | "detailed";
type SuccessfulComposition = Extract<ComposeLessonPlanResult, { ok: true }>;

const grades: readonly Grade[] = SUPPORTED_GRADES;
const lessonCounts: readonly LessonCount[] = [1, 2, 3];

const methodologyLabels: Record<MethodologyProfile, string> = {
  expository: "Expositiva dialogada",
  active: "Ativa/prática",
  combined: "Combinada",
};

const methodologyOrder = Object.keys(
  methodologyLabels,
) as MethodologyProfile[];

function lessonCountLabel(count: LessonCount): string {
  return count === 1 ? "1 aula" : `${count} aulas`;
}

function uniqueMaterials(plan: ComposedLessonPlan): LessonMaterial[] {
  const materialsByContent = new Map<string, LessonMaterial>();

  for (const session of plan.sessions) {
    for (const material of session.centralActivity.materials) {
      const key = [
        material.label.trim().toLocaleLowerCase("pt-BR"),
        material.details?.trim().toLocaleLowerCase("pt-BR") ?? "",
        material.href?.trim() ?? "",
      ].join("|");

      if (!materialsByContent.has(key)) materialsByContent.set(key, material);
    }
  }

  return [...materialsByContent.values()];
}

function MaterialsList({ materials }: { materials: readonly LessonMaterial[] }) {
  if (materials.length === 0) return <p>Nenhum material informado.</p>;

  return (
    <ul className={styles.materialList}>
      {materials.map((material) => (
        <li key={material.id}>
          {material.href ? (
            <a href={material.href} target="_blank" rel="noopener noreferrer">
              {material.label}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ) : (
            material.label
          )}
          {material.details ? ` — ${material.details}` : ""}
        </li>
      ))}
    </ul>
  );
}

function BnccReference({ plan }: { plan: ComposedLessonPlan }) {
  return (
    <p className={styles.bnccReference}>
      <strong>{plan.skill.code}</strong> — {plan.skill.officialText}
    </p>
  );
}

function BlockPlanView({ plan }: { plan: ComposedLessonPlan }) {
  return (
    <div className={styles.blockPlan} aria-label="Visualização em blocos do plano">
      <header className={styles.blockPlanHeading}>
        <span className={styles.geometricShapeOne} aria-hidden="true" />
        <span className={styles.geometricShapeTwo} aria-hidden="true" />
        <span className={styles.geometricShapeThree} aria-hidden="true" />
        <div>
          <p>Plano de aula</p>
          <h3>{plan.theme}</h3>
          <span>
            {plan.grade}º ano · {lessonCountLabel(plan.lessonCount)} · {plan.totalDurationMinutes} minutos
          </span>
        </div>
      </header>

      <div className={styles.blockGrid}>
        <section className={`${styles.planBlock} ${styles.bnccBlock}`}>
          <h3>BNCC</h3>
          <BnccReference plan={plan} />
        </section>

        <section className={`${styles.planBlock} ${styles.objectiveBlock}`}>
          <h3>Objetivo</h3>
          <p>{plan.objective}</p>
        </section>

        <section className={`${styles.planBlock} ${styles.materialsBlock}`}>
          <h3>Materiais</h3>
          <MaterialsList materials={uniqueMaterials(plan)} />
        </section>

        <section className={`${styles.planBlock} ${styles.methodologyBlock}`}>
          <h3>Metodologia</h3>
          <p>{plan.sessions[0]?.centralActivity.description}</p>
        </section>

        <section className={`${styles.planBlock} ${styles.evaluationBlock}`}>
          <h3>Avaliação</h3>
          <p>{plan.evaluation?.description ?? "Não prevista para este plano."}</p>
        </section>
      </div>

      <div className={styles.blockPlanFooter} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function DetailedPlanView({ plan }: { plan: ComposedLessonPlan }) {
  return (
    <div className={styles.detailedView} aria-label="Visualização descritiva do plano">
      <section className={styles.detailedSection}>
        <h3>Referência da BNCC</h3>
        <BnccReference plan={plan} />
      </section>

      <section className={styles.detailedSection}>
        <h3>Objetivo geral</h3>
        <p>{plan.objective}</p>
      </section>

      <section className={styles.detailedSection}>
        <h3>Desenvolvimento das aulas</h3>
        <div className={styles.lessonNarratives}>
          {plan.sessions.map((session) => {
            const sessionEvaluation =
              plan.evaluation?.sessionNumber === session.number
                ? plan.evaluation
                : undefined;

            return (
              <article key={session.number} className={styles.lessonNarrative}>
                <header>
                  <h4>Aula {session.number}</h4>
                  <p>Duração: {session.durationMinutes} minutos.</p>
                </header>

                <section>
                  <h5>Metodologia</h5>
                  <p>{session.centralActivity.description}</p>
                </section>

                <section>
                  <h5>Materiais</h5>
                  <MaterialsList materials={session.centralActivity.materials} />
                </section>

                {sessionEvaluation ? (
                  <section>
                    <h5>Avaliação</h5>
                    <p>{sessionEvaluation.description}</p>
                  </section>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      {!plan.evaluation ? (
        <section className={styles.detailedSection}>
          <h3>Avaliação</h3>
          <p>Não prevista para este plano.</p>
        </section>
      ) : null}
    </div>
  );
}

function LessonPlanEditor({ planId }: { planId?: string }) {
  const navigate = useNavigate();
  const plans = useLessonPlansStore((state) => state.plans);
  const createPlan = useLessonPlansStore((state) => state.createPlan);
  const updatePlan = useLessonPlansStore((state) => state.updatePlan);
  const savedPlan = useMemo(
    () => (planId ? plans.find((item) => item.id === planId) : undefined),
    [planId, plans],
  );
  const initialPlan = savedPlan?.plan;
  const { resources, status } = useCatalogResources();
  const [theme, setTheme] = useState(initialPlan?.theme ?? "");
  const [grade, setGrade] = useState<Grade | "">(initialPlan?.grade ?? "");
  const [lessonCount, setLessonCount] = useState<LessonCount>(
    initialPlan?.lessonCount ?? 1,
  );
  const [skillCode, setSkillCode] = useState(initialPlan?.skill.code ?? "");
  const [selectedResourceId, setSelectedResourceId] = useState(
    initialPlan?.sessions[0]?.centralActivity.resourceUse.resourceId ?? "",
  );
  const [objective, setObjective] = useState(initialPlan?.objective ?? "");
  const [methodologyProfile, setMethodologyProfile] =
    useState<MethodologyProfile>(initialPlan?.methodologyProfile ?? "combined");
  const [includeEvaluation, setIncludeEvaluation] = useState(
    Boolean(initialPlan?.evaluation),
  );
  const [composition, setComposition] = useState<SuccessfulComposition | null>(
    initialPlan ? { ok: true, plan: initialPlan, warnings: [] } : null,
  );
  const [compositionError, setCompositionError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isOutdated, setIsOutdated] = useState(false);
  const [planView, setPlanView] = useState<PlanView>("blocks");
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);

  const skillOptions = useMemo(
    () => (grade ? getPlanSkillOptions(resources, grade) : []),
    [grade, resources],
  );
  const selectedSkill = skillOptions.find((option) => option.code === skillCode);
  const selectedResource = selectedSkill?.resources.find(
    (resource) => resource.id === selectedResourceId,
  );
  const selectedCandidate = selectedResource
    ? toLessonResourceCandidate(selectedResource)
    : null;
  const candidateMethodologyProfiles = selectedCandidate?.methodologyProfiles ?? [];
  const availableMethodologyProfiles = methodologyOrder.filter((profile) =>
    candidateMethodologyProfiles.includes(profile),
  );

  if (planId && !savedPlan) {
    return (
      <section className={styles.page} aria-labelledby="lesson-plan-not-found-title">
        <div className={styles.notFoundCard}>
          <p className={styles.eyebrow}>Planejamento docente</p>
          <h1 id="lesson-plan-not-found-title">Plano não encontrado</h1>
          <p>Esse plano não está mais disponível neste navegador.</p>
          <Link to="/app/planos">Voltar para Meus Planos de Aula</Link>
        </div>
      </section>
    );
  }

  const markOutdated = () => {
    setCompositionError("");
    setSaveStatus("");
    if (composition) setIsOutdated(true);
  };

  const handleGradeChange = (value: string) => {
    const nextGrade = value ? (Number(value) as Grade) : "";
    setGrade(nextGrade);
    setSkillCode("");
    setSelectedResourceId("");
    setObjective("");
    setIncludeEvaluation(false);
    markOutdated();
  };

  const handleSkillChange = (value: string) => {
    setSkillCode(value);
    setSelectedResourceId("");
    setObjective("");
    setIncludeEvaluation(false);
    markOutdated();
  };

  const handleResourceChange = (value: string) => {
    const resource = selectedSkill?.resources.find((item) => item.id === value);
    const candidate = resource ? toLessonResourceCandidate(resource) : null;
    const profiles = candidate?.methodologyProfiles ?? [];
    const nextMethodology = profiles.includes(methodologyProfile)
      ? methodologyProfile
      : profiles.includes("combined")
        ? "combined"
        : methodologyOrder.find((profile) => profiles.includes(profile)) ??
          "combined";

    setSelectedResourceId(value);
    setObjective(resource?.pedagogy.learningObjective?.trim() ?? "");
    setMethodologyProfile(nextMethodology);
    setIncludeEvaluation(false);
    markOutdated();
  };

  const canCompose =
    status === "success" &&
    Boolean(
      theme.trim() &&
        grade &&
        selectedSkill &&
        selectedResource &&
        selectedCandidate &&
        objective.trim() &&
        availableMethodologyProfiles.includes(methodologyProfile),
    );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCompositionError("");
    setSaveStatus("");

    if (!grade || !selectedSkill || !selectedCandidate) {
      setCompositionError("Selecione o ano, a habilidade e um material do Acervo.");
      return;
    }

    const result = composeLessonPlan({
      theme,
      grade,
      lessonCount,
      skill: {
        code: selectedSkill.code,
        officialText: selectedSkill.officialText,
        axis: selectedSkill.axis,
        relatedCompetencies: selectedSkill.relatedCompetencies,
      },
      objective,
      methodologyProfile,
      resources: [selectedCandidate],
      includeEvaluation,
    });

    if (!result.ok) {
      setComposition(null);
      setCompositionError(result.error.message);
      return;
    }

    setComposition(result);
    setIsOutdated(false);
    setPlanView("blocks");
    window.requestAnimationFrame(() => previewHeadingRef.current?.focus());
  };

  const handleSave = () => {
    if (!composition || isOutdated) return;

    if (planId) {
      const updated = updatePlan(planId, composition.plan);
      if (!updated) {
        setSaveStatus("Não foi possível salvar as alterações.");
        return;
      }
      setSaveStatus("Alterações salvas em Meus Planos de Aula.");
      return;
    }

    const created = createPlan(composition.plan);
    setSaveStatus("Plano salvo em Meus Planos de Aula.");
    navigate(`/app/planos/${created.id}/editar`, { replace: true });
  };

  const handleDownload = () => {
    if (!composition || isOutdated) return;
    downloadLessonPlanPdf(composition.plan);
    setSaveStatus("Download do PDF iniciado.");
  };

  return (
    <section className={styles.page} aria-labelledby="lesson-plan-page-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Planejamento docente</p>
        <h1 id="lesson-plan-page-title">
          {planId ? "Editar Plano de Aula" : "Criar Plano de Aula"}
        </h1>
      </header>

      <div className={styles.builderGrid}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formIntro}>
            <h2>Dados do plano</h2>
          </div>

          <div className={styles.field}>
            <label htmlFor="lesson-theme">
              Tema <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
              id="lesson-theme"
              value={theme}
              maxLength={120}
              required
              onChange={(event) => {
                setTheme(event.target.value);
                markOutdated();
              }}
              placeholder="Ex.: Cyberbullying e responsabilidade digital"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lesson-grade">
              Ano escolar <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <select
              id="lesson-grade"
              value={grade}
              required
              disabled={status !== "success"}
              onChange={(event) => handleGradeChange(event.target.value)}
            >
              <option value="">Selecione o ano</option>
              {grades.map((item) => (
                <option key={item} value={item}>{item}º ano</option>
              ))}
            </select>
            {status === "loading" ? <p className={styles.helper}>Carregando o Acervo…</p> : null}
            {status === "error" ? (
              <p className={styles.errorMessage} role="alert">
                Não foi possível consultar os conteúdos do Acervo.
              </p>
            ) : null}
          </div>

          <fieldset className={styles.fieldGroup}>
            <legend>Duração do plano</legend>
            <div className={styles.durationOptions}>
              {lessonCounts.map((count) => (
                <label key={count} className={styles.durationOption}>
                  <input
                    type="radio"
                    name="lesson-count"
                    value={count}
                    checked={lessonCount === count}
                    onChange={() => {
                      setLessonCount(count);
                      setIncludeEvaluation(false);
                      markOutdated();
                    }}
                  />
                  <strong>{lessonCountLabel(count)}</strong>
                  <small>{count * 50} minutos no total</small>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="lesson-skill">
              Habilidade <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <select
              id="lesson-skill"
              value={skillCode}
              required
              disabled={!grade || skillOptions.length === 0}
              aria-describedby={
                grade && status === "success" && skillOptions.length === 0
                  ? "lesson-skill-availability"
                  : undefined
              }
              onChange={(event) => handleSkillChange(event.target.value)}
            >
              <option value="">
                {!grade
                  ? "Selecione o ano primeiro"
                  : skillOptions.length === 0
                    ? "Nenhum material alinhado"
                    : "Selecione a habilidade"}
              </option>
              {skillOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} — {option.officialText}
                </option>
              ))}
            </select>
            {grade && status === "success" && skillOptions.length === 0 ? (
              <p
                id="lesson-skill-availability"
                className={styles.availability}
                role="status"
                aria-live="polite"
              >
                O Acervo ainda não possui material alinhado ao {grade}º ano.
              </p>
            ) : null}
          </div>

          {selectedSkill ? (
            <dl className={styles.curriculumCard} aria-label="Alinhamento curricular automático">
              <div>
                <dt>Eixo</dt>
                <dd>{selectedSkill.axis}</dd>
              </div>
              <div>
                <dt>Competências relacionadas</dt>
                <dd>
                  {selectedSkill.relatedCompetencies.length > 0
                    ? selectedSkill.relatedCompetencies.join("; ")
                    : "Ainda não cadastradas para esta habilidade."}
                </dd>
              </div>
            </dl>
          ) : null}

          <div className={styles.field}>
            <label htmlFor="lesson-resource">
              Material do Acervo <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <select
              id="lesson-resource"
              value={selectedResourceId}
              required
              disabled={!selectedSkill || selectedSkill.resources.length === 0}
              onChange={(event) => handleResourceChange(event.target.value)}
            >
              <option value="">
                {selectedSkill ? "Selecione o material" : "Selecione a habilidade primeiro"}
              </option>
              {selectedSkill?.resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="lesson-objective">
              Objetivo <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <textarea
              id="lesson-objective"
              value={objective}
              maxLength={500}
              required
              disabled={!selectedResource}
              onChange={(event) => {
                setObjective(event.target.value);
                markOutdated();
              }}
              placeholder="Descreva o que os estudantes devem aprender."
            />
            {selectedResource?.pedagogy.learningObjective?.trim() ? (
              <p className={styles.helper}>
                A sugestão inicial veio do objetivo de aprendizagem cadastrado no material “{selectedResource.title}”. Você pode editá-la.
              </p>
            ) : selectedResource ? (
              <p className={styles.helper}>
                Este material não possui objetivo sugerido. Escreva o objetivo do plano.
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="lesson-methodology">Tipo de metodologia</label>
            <select
              id="lesson-methodology"
              value={methodologyProfile}
              disabled={!selectedResource}
              onChange={(event) => {
                setMethodologyProfile(event.target.value as MethodologyProfile);
                setIncludeEvaluation(false);
                markOutdated();
              }}
            >
              {(selectedResource
                ? availableMethodologyProfiles
                : [methodologyProfile]
              ).map((profile) => (
                <option key={profile} value={profile}>
                  {methodologyLabels[profile]}
                </option>
              ))}
            </select>
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={includeEvaluation}
              disabled={!selectedResource}
              onChange={(event) => {
                setIncludeEvaluation(event.target.checked);
                markOutdated();
              }}
            />
            <span>
              <strong>Incluir avaliação</strong>
              <small>Por enquanto, o plano exibirá um texto provisório de avaliação.</small>
            </span>
          </label>

          {compositionError ? (
            <p className={styles.errorMessage} role="alert">{compositionError}</p>
          ) : null}

          <button className={styles.submitButton} type="submit" disabled={!canCompose}>
            {composition ? "Atualizar plano" : "Montar plano"}
          </button>
        </form>

        <article
          className={`${styles.preview} ${composition && planView === "blocks" ? styles.previewBlocks : ""}`}
          aria-label="Prévia do plano de aula"
        >
          {!composition ? (
            <div className={styles.emptyPreview}>
              <span className={styles.emptyIcon} aria-hidden="true">
                <ClipboardList size={34} strokeWidth={1.8} />
              </span>
              <h2>Seu plano aparecerá aqui</h2>
            </div>
          ) : (
            <div className={styles.previewContent}>
              <header className={styles.previewHeader}>
                <div>
                  <p className={styles.eyebrow}>Plano de aula</p>
                  <h2 ref={previewHeadingRef} tabIndex={-1}>{composition.plan.theme}</h2>
                  <p>
                    {composition.plan.grade}º ano · {lessonCountLabel(composition.plan.lessonCount)} · {composition.plan.totalDurationMinutes} minutos
                  </p>
                </div>
                <div
                  className={styles.viewToggle}
                  role="group"
                  aria-label="Formato de visualização"
                >
                  <button
                    type="button"
                    aria-pressed={planView === "blocks"}
                    aria-controls="lesson-plan-view"
                    onClick={() => setPlanView("blocks")}
                  >
                    Em Blocos
                  </button>
                  <button
                    type="button"
                    aria-pressed={planView === "detailed"}
                    aria-controls="lesson-plan-view"
                    onClick={() => setPlanView("detailed")}
                  >
                    Descritivo
                  </button>
                </div>
              </header>

              {isOutdated ? (
                <p className={styles.availability} aria-live="polite">
                  Os dados do formulário mudaram. Selecione <strong>Atualizar plano</strong> antes de salvar ou baixar.
                </p>
              ) : null}

              <div className={styles.planActions}>
                <button type="button" onClick={handleSave} disabled={isOutdated}>
                  <Save aria-hidden="true" size={18} />
                  {planId ? "Salvar alterações" : "Salvar plano"}
                </button>
                <button type="button" onClick={handleDownload} disabled={isOutdated}>
                  <Download aria-hidden="true" size={18} />
                  Baixar PDF
                </button>
              </div>

              <p className={styles.actionStatus} role="status" aria-live="polite">
                {saveStatus}
              </p>

              <div id="lesson-plan-view" className={styles.planView}>
                {planView === "blocks" ? (
                  <BlockPlanView plan={composition.plan} />
                ) : (
                  <DetailedPlanView plan={composition.plan} />
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

export function LessonPlanPage() {
  const { planId } = useParams<{ planId?: string }>();

  return <LessonPlanEditor key={planId ?? "new-plan"} planId={planId} />;
}
