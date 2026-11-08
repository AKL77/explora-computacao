import { useState, type FormEvent } from "react";
import { Check, Plus, UsersRound } from "lucide-react";
import type { Resource } from "@/domain/resource";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { ClassroomFormDialog } from "./ClassroomFormDialog";
import styles from "../Classrooms.module.css";

export function AddToClassroomButton({ resource, className }: { resource: Resource; className?: string }) {
  const classrooms = useClassroomsStore((state) => state.classrooms);
  const addMaterials = useClassroomsStore((state) => state.addMaterials);
  const [mode, setMode] = useState<"pick" | "create" | null>(null);
  const [selected, setSelected] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const active = classrooms.filter((classroom) => !classroom.archived);
  const selectedClass = active.find((classroom) => classroom.id === selected);
  const canAdd = selectedClass && !selectedClass.materials.some((material) => material.resourceId === resource.id);

  const add = async (event: FormEvent) => {
    event.preventDefault();
    if (!canAdd || !await addMaterials(selected, [resource.id])) return;
    setAnnouncement(`Material adicionado à turma ${selectedClass.name}. Já está visível para os alunos.`);
    setMode(null);
  };

  return (
    <>
      <button className={className ?? styles.secondary} type="button" onClick={() => { setSelected(""); setAnnouncement(""); setMode("pick"); }}>
        <UsersRound size={18} aria-hidden="true" /> Adicionar à turma
      </button>
      <p className={styles.announcement} role="status" data-clarity-mask="true">{announcement}</p>
      {mode === "pick" && (
        <AccessibleDialog open title="Adicionar à turma" description={resource.title} onClose={() => setMode(null)}>
          <form className={styles.form} onSubmit={add}>
            {active.length > 0 ? (
              <>
                <p className={styles.muted}>Escolha a turma. O material será adicionado já visível para os alunos.</p>
                <div className={styles.picker} role="group" aria-label="Suas turmas" data-clarity-mask="true">
                  {active.map((classroom) => {
                    const added = classroom.materials.some((material) => material.resourceId === resource.id);
                    return (
                      <label key={classroom.id} className={styles.pickOption}>
                        <input type="radio" name="target-classroom" value={classroom.id} checked={selected === classroom.id} disabled={added} onChange={() => setSelected(classroom.id)} />
                        <span><strong>{classroom.name}</strong><small>{[classroom.school, classroom.schoolYear].filter(Boolean).join(" · ")}{added ? " · Já adicionado" : ""}</small></span>
                        {added && <Check size={18} aria-hidden="true" />}
                      </label>
                    );
                  })}
                </div>
              </>
            ) : <p className={styles.muted}>Crie sua primeira turma para disponibilizar este material aos alunos.</p>}
            <div className={`${styles.formFooter} ${styles.classroomPickerFooter}`}>
              {active.length > 0 && <button className={styles.secondary} type="button" onClick={() => setMode("create")}><Plus size={17} aria-hidden="true" /> Criar turma</button>}
              <div className={styles.actions}>
                <button className={styles.secondary} type="button" onClick={() => setMode(null)}>Cancelar</button>
                {active.length > 0 ? <button className={styles.primary} type="submit" disabled={!canAdd}>Adicionar material</button> : <button className={styles.primary} type="button" onClick={() => setMode("create")}><Plus size={17} aria-hidden="true" /> Criar turma</button>}
              </div>
            </div>
          </form>
        </AccessibleDialog>
      )}
      {mode === "create" && <ClassroomFormDialog onClose={() => setMode(null)} onSaved={async (classroom) => {
        if (!await addMaterials(classroom.id, [resource.id])) { setSelected(classroom.id); setMode("pick"); return; }
        setAnnouncement(`Turma ${classroom.name} criada. O material já está visível para os alunos.`);
        setMode(null);
      }} />}
    </>
  );
}
