import { useState, type FormEvent } from "react";
import { CLASSROOM_COLORS, type Classroom, type ClassroomColor } from "@/domain/classroom";
import { SUPPORTED_GRADES, type Grade } from "@/domain/curriculum";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import styles from "../Classrooms.module.css";

interface Props {
  classroom?: Classroom;
  onClose: () => void;
  onSaved: (classroom: Classroom) => void | Promise<void>;
}

export function ClassroomFormDialog({ classroom, onClose, onSaved }: Props) {
  const [name, setName] = useState(classroom?.name ?? "");
  const [grade, setGrade] = useState<Grade | "">(classroom?.grade ?? "");
  const [school, setSchool] = useState(classroom?.school ?? "");
  const [schoolYear, setSchoolYear] = useState(String(classroom?.schoolYear ?? new Date().getFullYear()));
  const [color, setColor] = useState<ClassroomColor>(classroom?.color ?? "blue");
  const [error, setError] = useState("");
  const create = useClassroomsStore((state) => state.createClassroom);
  const update = useClassroomsStore((state) => state.updateClassroom);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!grade) return;
    const input = { name, grade, school, schoolYear: Number(schoolYear), color };
    if (classroom) {
      if (await update(classroom.id, input)) await onSaved({ ...classroom, ...input, name: name.trim(), school: school.trim() });
      else setError("Não foi possível salvar. Confira os dados da turma.");
    } else {
      const created = await create(input);
      if (created) await onSaved(created);
      else setError("Não foi possível criar a turma. Confira os dados e tente novamente.");
    }
  };

  return (
    <AccessibleDialog open title={classroom ? "Editar turma" : "Criar turma"} description={classroom ? "Atualize as informações da sua turma." : "Organize os materiais e receba um código para os alunos acessarem."} onClose={onClose}>
      <form className={styles.form} onSubmit={save}>
        <label className={styles.field}>
          Nome da turma
          <input className={styles.input} required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: 6º ano B" autoComplete="off" />
        </label>
        <div className={styles.formColumns}>
          <label className={styles.field}>
            Ano/série
            <select className={styles.select} required value={grade} onChange={(event) => setGrade(event.target.value ? Number(event.target.value) as Grade : "")}>
              <option value="">Selecione o ano</option>
              {SUPPORTED_GRADES.map((value) => <option key={value} value={value}>{value}º ano</option>)}
            </select>
          </label>
          <label className={styles.field}>
            Ano letivo
            <input className={styles.input} required type="number" min={2000} max={2100} value={schoolYear} onChange={(event) => setSchoolYear(event.target.value)} />
          </label>
        </div>
        <label className={styles.field}>
          Escola (opcional)
          <input className={styles.input} maxLength={120} value={school} onChange={(event) => setSchool(event.target.value)} placeholder="Nome da escola" autoComplete="off" />
        </label>
        <fieldset className={styles.colorField}>
          <legend>Cor da turma (opcional)</legend>
          <div className={styles.colors}>
            {CLASSROOM_COLORS.map((option) => (
              <label key={option.value} className={styles.colorOption}>
                <input type="radio" name="classroom-color" aria-label={option.label} value={option.value} checked={color === option.value} onChange={() => setColor(option.value)} style={{ accentColor: option.hex }} />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.formFooter}>
          <button className={styles.secondary} type="button" onClick={onClose}>Cancelar</button>
          <button className={styles.primary} type="submit">{classroom ? "Salvar alterações" : "Criar turma"}</button>
        </div>
      </form>
    </AccessibleDialog>
  );
}
