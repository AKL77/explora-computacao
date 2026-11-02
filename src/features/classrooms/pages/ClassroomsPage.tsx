import { useState, type CSSProperties } from "react";
import { ArrowRight, Plus, Search, UsersRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { classroomColor, formatClassroomCode } from "@/domain/classroom";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { ClassroomFormDialog } from "../components/ClassroomFormDialog";
import styles from "../Classrooms.module.css";

export function ClassroomsPage() {
  const classrooms = useClassroomsStore((state) => state.classrooms);
  const navigate = useNavigate();
  const [archived, setArchived] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  const visible = classrooms.filter((classroom) => classroom.archived === archived && normalize(`${classroom.name} ${classroom.school} ${classroom.schoolYear} ${classroom.grade}º ano`).includes(normalize(query.trim())));
  const activeCount = classrooms.filter((classroom) => !classroom.archived).length;

  return (
    <div className={styles.page} data-clarity-mask="true">
      <header className={styles.heading}>
        <div><span className={styles.eyebrow}>Organize e compartilhe</span><h1>Minhas Turmas</h1><p>Escolha os materiais de cada turma e compartilhe o código com os alunos.</p></div>
        <button className={styles.primary} type="button" onClick={() => setCreating(true)}><Plus size={19} aria-hidden="true" /> Criar turma</button>
      </header>
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="group" aria-label="Situação das turmas">
          <button className={styles.tab} type="button" aria-pressed={!archived} onClick={() => setArchived(false)}>Ativas ({activeCount})</button>
          <button className={styles.tab} type="button" aria-pressed={archived} onClick={() => setArchived(true)}>Arquivadas ({classrooms.length - activeCount})</button>
        </div>
        <label className={styles.search}><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar turmas</span><input className={styles.input} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por turma ou escola" /></label>
      </div>
      {visible.length > 0 ? <div className={styles.grid}>
        {visible.map((classroom) => {
          const visibleCount = classroom.materials.filter((material) => material.visible).length;
          return (
            <Link key={classroom.id} className={styles.classCard} to={`/app/minhas-turmas/${classroom.id}`} style={{ "--classroom-accent": classroomColor(classroom.color) } as CSSProperties}>
              <div className={styles.cardTop}><span className={styles.classIcon}><UsersRound size={23} aria-hidden="true" /></span><span className={styles.badge}>{classroom.archived ? "Arquivada" : classroom.schoolYear}</span></div>
              <div><h2>{classroom.name}</h2><p>{classroom.grade}º ano{classroom.school ? ` · ${classroom.school}` : ""}</p></div>
              <p>{classroom.materials.length} {classroom.materials.length === 1 ? "material" : "materiais"}{!classroom.archived && ` · ${visibleCount} ${visibleCount === 1 ? "visível" : "visíveis"}`}</p>
              <div className={styles.cardFooter}><span>{classroom.archived ? `Ano letivo ${classroom.schoolYear}` : `Código ${formatClassroomCode(classroom.code)}`}</span><ArrowRight size={18} aria-hidden="true" /></div>
            </Link>
          );
        })}
      </div> : <section className={styles.empty}>
        <UsersRound size={42} aria-hidden="true" />
        <h2>{query ? "Nenhuma turma encontrada" : archived ? "Nenhuma turma arquivada" : "Sua próxima aula começa aqui"}</h2>
        <p>{query ? "Tente outro nome de turma ou escola." : archived ? "As turmas arquivadas ficam guardadas aqui, sem acesso para os alunos." : "Crie uma turma, adicione os materiais e entregue um único código aos alunos."}</p>
        {!archived && !query && <button className={styles.primary} type="button" onClick={() => setCreating(true)}><Plus size={18} aria-hidden="true" /> Criar minha primeira turma</button>}
      </section>}
      {creating && <ClassroomFormDialog onClose={() => setCreating(false)} onSaved={(classroom) => navigate(`/app/minhas-turmas/${classroom.id}`)} />}
    </div>
  );
}
