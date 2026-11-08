import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, Plus, UsersRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { classroomColor, formatClassroomCode } from "@/domain/classroom";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { ClassroomFormDialog } from "../components/ClassroomFormDialog";
import styles from "../Classrooms.module.css";

export function ClassroomsPage() {
  const classrooms = useClassroomsStore((state) => state.classrooms);
  const navigate = useNavigate();
  const [archived, setArchived] = useState(false);
  const [creating, setCreating] = useState(false);
  const tabsId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const visible = classrooms.filter((classroom) => classroom.archived === archived);
  const activeCount = classrooms.filter((classroom) => !classroom.archived).length;
  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextArchived: boolean;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") nextArchived = !archived;
    else if (event.key === "Home") nextArchived = false;
    else if (event.key === "End") nextArchived = true;
    else return;
    event.preventDefault();
    setArchived(nextArchived);
    tabRefs.current[nextArchived ? 1 : 0]?.focus();
  };

  return (
    <WorkspacePage title="Minhas Turmas" eyebrow="Organize e compartilhe" contentClassName={styles.page} masked headerActions={
        <button className={styles.primary} type="button" onClick={() => setCreating(true)}><Plus size={19} aria-hidden="true" /> Criar turma</button>
      }>
      <div className={styles.tabs} role="tablist" aria-label="Situação das turmas" onKeyDown={handleTabKeyDown}>
        <button ref={(node) => { tabRefs.current[0] = node; }} id={`${tabsId}-active`} className={styles.tab} type="button" role="tab" aria-selected={!archived} aria-controls={`${tabsId}-panel`} tabIndex={archived ? -1 : 0} aria-label={`Ativas (${activeCount})`} onClick={() => setArchived(false)}>Ativas <span className={styles.tabCount}>{activeCount}</span></button>
        <button ref={(node) => { tabRefs.current[1] = node; }} id={`${tabsId}-archived`} className={styles.tab} type="button" role="tab" aria-selected={archived} aria-controls={`${tabsId}-panel`} tabIndex={archived ? 0 : -1} aria-label={`Arquivadas (${classrooms.length - activeCount})`} onClick={() => setArchived(true)}>Arquivadas <span className={styles.tabCount}>{classrooms.length - activeCount}</span></button>
      </div>
      <div role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-${archived ? "archived" : "active"}`} tabIndex={0}>
      {visible.length > 0 ? <div className={styles.grid}>
        {visible.map((classroom) => {
          return (
            <Link key={classroom.id} className={styles.classCard} to={`/app/minhas-turmas/${classroom.id}`} style={{ "--classroom-accent": classroomColor(classroom.color) } as CSSProperties}>
              <div className={styles.cardTop}><span className={styles.classIcon}><UsersRound size={23} aria-hidden="true" /></span><span className={styles.badge}>{classroom.archived ? "Arquivada" : classroom.schoolYear}</span></div>
              <div><h2>{classroom.name}</h2><p>{classroom.grade}º ano{classroom.school ? ` · ${classroom.school}` : ""}</p></div>
              <div className={styles.cardFooter}>
                {classroom.archived ? <span>Ano letivo {classroom.schoolYear}</span> : <span className={styles.cardCode}>Código <strong>{formatClassroomCode(classroom.code)}</strong></span>}
                <ArrowRight size={18} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div> : <section className={styles.empty}>
        <UsersRound size={42} aria-hidden="true" />
        <h2>{archived ? "Nenhuma turma arquivada" : "Sua próxima aula começa aqui"}</h2>
        <p>{archived ? "As turmas arquivadas ficam guardadas aqui, sem acesso para os alunos." : "Crie uma turma, adicione os materiais e entregue um único código aos alunos."}</p>
        {!archived && <button className={styles.primary} type="button" onClick={() => setCreating(true)}><Plus size={18} aria-hidden="true" /> Criar minha primeira turma</button>}
      </section>}
      </div>
      {creating && <ClassroomFormDialog onClose={() => setCreating(false)} onSaved={(classroom) => navigate(`/app/minhas-turmas/${classroom.id}`)} />}
    </WorkspacePage>
  );
}
