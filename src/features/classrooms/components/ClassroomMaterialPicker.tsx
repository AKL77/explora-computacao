import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { Resource } from "@/domain/resource";
import type { Classroom } from "@/domain/classroom";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { typeLabels } from "@/features/catalog/components/resourcePresentation";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import styles from "../Classrooms.module.css";

export function ClassroomMaterialPicker({ classroom, resources, onClose, onAdded }: {
  classroom: Classroom;
  resources: Resource[];
  onClose: () => void;
  onAdded: (count: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const addMaterials = useClassroomsStore((state) => state.addMaterials);
  const existing = new Set(classroom.materials.map((material) => material.resourceId));
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  const matches = resources.filter((resource) => normalize(`${resource.title} ${resource.topic}`).includes(normalize(query.trim())));

  const add = async (event: FormEvent) => {
    event.preventDefault();
    const ids = selected.filter((id) => !existing.has(id));
    if (ids.length && await addMaterials(classroom.id, ids)) onAdded(ids.length);
  };

  return (
    <AccessibleDialog open title="Adicionar materiais" description={`Selecione os materiais para ${classroom.name}. Eles ficarão visíveis para os alunos.`} onClose={onClose}>
      <form className={styles.form} onSubmit={add}>
        <label className={styles.search}><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar materiais para a turma</span><input className={styles.input} type="search" placeholder="Buscar material ou assunto" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className={styles.picker} role="group" aria-label="Materiais do acervo">
          {matches.map((resource) => <label key={resource.id} className={styles.pickOption}>
            <input type="checkbox" checked={existing.has(resource.id) || selected.includes(resource.id)} disabled={existing.has(resource.id)} onChange={() => setSelected((current) => current.includes(resource.id) ? current.filter((id) => id !== resource.id) : [...current, resource.id])} />
            <span><strong>{resource.title}</strong><small>{typeLabels[resource.type]} · {resource.provider}{existing.has(resource.id) ? " · Já adicionado" : ""}</small></span>
          </label>)}
          {matches.length === 0 && <p className={styles.muted}>Nenhum material encontrado. Tente outro nome ou assunto.</p>}
        </div>
        <div className={styles.formFooter}>
          <button className={styles.secondary} type="button" onClick={onClose}>Cancelar</button>
          <button className={styles.primary} type="submit" disabled={selected.every((id) => existing.has(id))}>Adicionar {selected.filter((id) => !existing.has(id)).length || ""} {selected.length === 1 ? "material" : "materiais"}</button>
        </div>
      </form>
    </AccessibleDialog>
  );
}
