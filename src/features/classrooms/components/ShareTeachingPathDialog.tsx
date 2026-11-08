import { useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Classroom } from "@/domain/classroom";
import type { SavedTeachingPath } from "@/domain/savedTeachingPath";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { TeachingPathIconGlyph } from "@/features/teaching-paths/components/TeachingPathAppearance";
import { isOnlineMode } from "@/lib/backend/config";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import styles from "../Classrooms.module.css";

export function ShareTeachingPathDialog({ classroom, path, onClose, onShared }: {
  classroom?: Classroom;
  path?: SavedTeachingPath;
  onClose: () => void;
  onShared: (classroom: Classroom, path: SavedTeachingPath) => void;
}) {
  const classrooms = useClassroomsStore((state) => state.classrooms);
  const paths = useTeachingPathsStore((state) => state.paths);
  const share = useClassroomsStore((state) => state.shareTeachingPath);
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const groupId = useId();
  const active = classrooms.filter((item) => !item.archived && (!isOnlineMode || item.sharedPaths !== undefined));
  const targetClassroom = classroom ?? active.find((item) => item.id === selectedId);
  const targetPath = path ?? paths.find((item) => item.id === selectedId);
  const alreadyShared = (target: Classroom, source: SavedTeachingPath) => target.sharedPaths?.some((item) => item.id === source.id) ?? false;
  const canShare = targetClassroom && targetPath && !alreadyShared(targetClassroom, targetPath);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canShare || busy) return;
    setBusy(true); setError("");
    try {
      if (await share(targetClassroom.id, targetPath.id)) onShared(targetClassroom, targetPath);
      else setError("Não foi possível adicionar a trilha. Tente novamente.");
    } finally { setBusy(false); }
  };

  return <AccessibleDialog open title={classroom ? "Adicionar trilha" : "Adicionar à turma"} onClose={() => { if (!busy) onClose(); }}>
    <form className={styles.form} onSubmit={submit}>
      <p className={styles.muted}>Uma cópia da trilha ficará disponível para os alunos. Alterações na original só entram na turma quando você atualizar a cópia.</p>
      {classroom ? paths.length > 0 ? <div className={styles.picker} role="group" aria-label="Minhas Trilhas">
        {paths.map((source) => {
          const added = alreadyShared(classroom, source);
          return <label className={styles.pickOption} key={source.id}>
            <input type="radio" name={groupId} checked={selectedId === source.id} disabled={added || busy} onChange={() => { setSelectedId(source.id); setError(""); }} />
            <TeachingPathIconGlyph icon={source.icon} size={22} aria-hidden="true" />
            <span><strong>{source.name}</strong><small>{source.resourceIds.length} {source.resourceIds.length === 1 ? "etapa" : "etapas"}{added ? " · Já adicionada" : ""}</small></span>
          </label>;
        })}
      </div> : <p className={styles.muted}>Crie uma trilha em <Link to="/app/minhas-trilhas">Minhas Trilhas</Link> para adicionar a esta turma.</p> : active.length > 0 ? <div className={styles.picker} role="group" aria-label="Suas turmas">
        {active.map((target) => {
          const added = path ? alreadyShared(target, path) : false;
          return <label className={styles.pickOption} key={target.id}>
            <input type="radio" name={groupId} checked={selectedId === target.id} disabled={added || busy} onChange={() => { setSelectedId(target.id); setError(""); }} />
            <span><strong>{target.name}</strong><small>{target.grade}º ano · {target.schoolYear}{added ? " · Já adicionada" : ""}</small></span>
          </label>;
        })}
      </div> : <p className={styles.muted}>Crie uma turma em <Link to="/app/minhas-turmas">Minhas Turmas</Link> para adicionar esta trilha.</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.formFooter}>
        <button className={styles.secondary} type="button" disabled={busy} onClick={onClose}>Cancelar</button>
        <button className={styles.primary} type="submit" disabled={!canShare || busy}>{busy ? "Adicionando…" : "Adicionar trilha"}</button>
      </div>
    </form>
  </AccessibleDialog>;
}
