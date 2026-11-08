import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { BnccAxis, Grade, SkillReference } from "@/domain/curriculum";
import type { Resource } from "@/domain/resource";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { MaterialFilterField } from "./MaterialFilterField";
import styles from "../pages/TeachingPathPage.module.css";

const axes: BnccAxis[] = ["Pensamento Computacional", "Mundo Digital", "Cultura Digital"];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();

interface SkillOption {
  skill: SkillReference;
  axis: BnccAxis;
  grades: Grade[];
}

export function BnccSkillFilter({ resources, selected, onChange }: {
  resources: readonly Resource[];
  selected: readonly string[];
  onChange: (codes: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const id = useId();
  const options = useMemo(() => {
    const byCode = new Map<string, SkillOption>();
    for (const resource of resources) {
      for (const { skill, axis, grade } of resource.curriculum.alignments) {
        const option = byCode.get(skill.code);
        if (!option) byCode.set(skill.code, { skill, axis, grades: [grade] });
        else if (!option.grades.includes(grade)) option.grades.push(grade);
      }
    }
    return [...byCode.values()].map((option) => ({ ...option, grades: option.grades.sort((a, b) => a - b) }))
      .sort((a, b) => a.skill.code.localeCompare(b.skill.code, "pt-BR", { numeric: true }));
  }, [resources]);
  const search = normalize(query);
  const groups = axes.map((axis) => ({ axis, options: options.filter((option) => option.axis === axis
    && normalize([option.skill.code, option.skill.officialText, axis, ...option.grades.map((grade) => `${grade}º ano`)].join(" ")).includes(search)) }))
    .filter((group) => group.options.length > 0);

  return <div className={styles.tagGroup}>
    <MaterialFilterField
      label="Habilidades da BNCC"
      ariaLabel="Ver opções de habilidades da BNCC"
      value={selected.length === 0 ? "Todas" : selected.length === 1 ? selected[0] : `${selected.length} habilidades`}
      description={selected.join(", ") || "Todas"}
      active={selected.length > 0}
      onClick={() => { setQuery(""); setOpen(true); }}
    />
    <span className="sr-only" aria-live="polite">{selected.length === 0 ? "Nenhuma habilidade selecionada" : `${selected.length} ${selected.length === 1 ? "habilidade selecionada" : "habilidades selecionadas"}`}</span>
    <AccessibleDialog open={open} title="Selecionar habilidades da BNCC" onClose={() => setOpen(false)} size="wide">
      {open && <div className={styles.keywordDialogContent}>
        <div className={styles.keywordSearchControl}>
          <label className={styles.keywordSearchLabel} htmlFor={`${id}-query`}>Buscar habilidade</label>
          <div className={styles.keywordSearch}>
            <Search size={18} aria-hidden="true" />
            <input id={`${id}-query`} type="search" placeholder="Digite o código ou a descrição" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <div className={styles.keywordGroups}>
          {groups.map((group, index) => <section className={styles.keywordGroup} key={group.axis} aria-labelledby={`${id}-axis-${index}`}>
            <h3 className={styles.keywordGroupTitle} id={`${id}-axis-${index}`}>{group.axis}</h3>
            <div className={styles.bnccSkillOptions}>
              {group.options.map(({ skill, grades }) => <button className={`${styles.filterTag} ${styles.bnccSkillOption}`} type="button" key={skill.code} aria-pressed={selected.includes(skill.code)} onClick={() => onChange(selected.includes(skill.code) ? selected.filter((code) => code !== skill.code) : [...selected, skill.code])}>
                <span className={styles.bnccSkillHeading}><strong>{skill.code}</strong><small>{grades.map((grade) => `${grade}º ano`).join(" · ")}</small></span>
                <span>{skill.officialText}</span>
              </button>)}
            </div>
          </section>)}
          {groups.length === 0 && <p className={styles.keywordEmpty}>Nenhuma habilidade corresponde à busca.</p>}
        </div>
        <div className={styles.keywordDialogActions}>
          <button type="button" disabled={selected.length === 0} onClick={() => onChange([])}>Limpar habilidades</button>
          <button type="button" onClick={() => setOpen(false)}>Concluir</button>
        </div>
      </div>}
    </AccessibleDialog>
  </div>;
}
