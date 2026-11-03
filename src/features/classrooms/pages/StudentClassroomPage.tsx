import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, UsersRound } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { classroomColor, normalizeClassroomCode, type Classroom } from "@/domain/classroom";
import { isOnlineMode } from "@/lib/backend/config";
import { fetchStudentClassroom, StudentAccessError } from "@/repositories/StudentClassroomRepository";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { formatResourceTypes } from "@/features/catalog/components/resourcePresentation";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import styles from "../Classrooms.module.css";

export function StudentClassroomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const classrooms = useClassroomsStore((state) => state.classrooms);
  const findByCode = useClassroomsStore((state) => state.findByCode);
  // A turma escolhida existe só nesta página. Nunca é salva como sessão do aluno.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [previousPath, setPreviousPath] = useState(location.pathname);
  const [remoteClassroom, setRemoteClassroom] = useState<Classroom | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [fetching, setFetching] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const enterRequest = useRef<AbortController | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const { resources, status } = useCatalogResources();
  const viewingMaterials = location.pathname === "/alunos/atividades";
  const activeId = viewingMaterials ? selectedId : null;
  const classroom = isOnlineMode ? remoteClassroom : classrooms.find((item) => item.id === activeId && !item.archived);
  const byId = new Map(resources.map((resource) => [resource.id, resource]));
  const visibleMaterials = classroom?.materials.filter((material) => material.visible && byId.has(material.resourceId)) ?? [];

  useEffect(() => {
    document.title = `${classroom ? classroom.name : "Acessar turma"} | Explora Computação`;
  }, [classroom]);

  useEffect(() => {
    if (activeId) mainRef.current?.focus({ preventScroll: true });
  }, [activeId]);

  useEffect(() => () => enterRequest.current?.abort(), []);

  useEffect(() => {
    if (!isOnlineMode || !activeId || !accessCode) return;
    let active = true;
    let busy = false;
    let request: AbortController | null = null;
    const refresh = async () => {
      if (document.hidden || busy) return;
      busy = true;
      request = new AbortController();
      try {
        const updated = await fetchStudentClassroom(accessCode, request.signal);
        if (active) { setRemoteClassroom(updated); setRefreshError(""); }
      } catch (failure) {
        if (active) {
          setRemoteClassroom(null);
          setRefreshError(failure instanceof StudentAccessError && failure.reason === "unavailable" ? "" : "Não foi possível atualizar a turma. Confira a conexão ou entre novamente com o código.");
        }
      } finally { busy = false; }
    };
    const interval = window.setInterval(() => void refresh(), 20_000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => { active = false; request?.abort(); window.clearInterval(interval); window.removeEventListener("focus", onFocus); document.removeEventListener("visibilitychange", onFocus); };
  }, [activeId, accessCode]);

  const enter = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeClassroomCode(code);
    if (!/^\d{6}$/.test(normalized)) { setError("Digite os 6 números do código informado pelo professor."); return; }
    enterRequest.current?.abort();
    const request = new AbortController();
    enterRequest.current = request;
    setFetching(true);
    try {
      const found = isOnlineMode ? await fetchStudentClassroom(normalized, request.signal) : findByCode(normalized);
      if (request.signal.aborted) return;
      if (!found) { setError("Turma indisponível. Confira o código com o professor e tente novamente."); return; }
      setError(""); setRefreshError(""); setCode(""); setAccessCode(normalized);
      setRemoteClassroom(isOnlineMode ? found : null);
      setSelectedId(found.id);
      navigate("/alunos/atividades");
    } catch (failure) {
      if (!request.signal.aborted) setError(failure instanceof StudentAccessError ? failure.message : "Não foi possível acessar a turma. Tente novamente.");
    } finally { if (!request.signal.aborted) setFetching(false); }
  };
  const switchClassroom = () => { enterRequest.current?.abort(); setFetching(false); setSelectedId(null); setAccessCode(""); setRemoteClassroom(null); setCode(""); setError(""); setRefreshError(""); navigate("/alunos", { replace: true }); };

  // Voltar pelo favorito também limpa a seleção, sem depender de sair da turma.
  if (previousPath !== location.pathname) {
    setPreviousPath(location.pathname);
    if (location.pathname === "/alunos") {
      setSelectedId(null);
      setAccessCode(""); setRemoteClassroom(null); setRefreshError("");
      setCode("");
      setError("");
    }
  }

  if (location.pathname !== "/alunos" && (!viewingMaterials || !selectedId)) return <Navigate to="/alunos" replace />;

  return (
    <div className={styles.publicPage}>
      <a className="skip-link" href="#student-content">Pular para o conteúdo</a>
      <header className={styles.publicHeader}>
        <Brand to="/" />
        {activeId ? <button className={styles.secondary} type="button" onClick={switchClassroom}>Trocar turma</button> : <Link className={styles.textButton} to={isOnlineMode ? "/entrar" : "/"}>Área do professor</Link>}
      </header>
      <main ref={mainRef} id="student-content" className={styles.publicMain} tabIndex={-1} data-clarity-mask="true">
        {!activeId ? <section className={styles.entry} aria-labelledby="student-entry-title">
          <span className={styles.classIcon}><UsersRound size={29} aria-hidden="true" /></span>
          <div><h1 id="student-entry-title">Acessar turma</h1><p>Digite o código que seu professor compartilhou para abrir os materiais da aula.</p></div>
          <form className={styles.form} onSubmit={enter} noValidate>
            <label className={styles.field}>
              Código da turma
              <input className={`${styles.input} ${styles.codeInput}`} type="text" inputMode="numeric" autoComplete="off" spellCheck={false} maxLength={12} placeholder="000 000" value={code} onChange={(event) => { setCode(event.target.value); if (error) setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "classroom-code-error" : undefined} />
            </label>
            {error && <p className={styles.error} id="classroom-code-error" role="alert">{error}</p>}
            <button className={styles.primary} type="submit" disabled={fetching}>{fetching ? "Buscando turma…" : "Acessar turma"} <ArrowRight size={18} aria-hidden="true" /></button>
          </form>
        </section> : !classroom ? <section className={styles.empty} role="status">
          <UsersRound size={40} aria-hidden="true" /><h1>{refreshError ? "Não foi possível atualizar a turma" : "Turma indisponível"}</h1><p>{refreshError || "O acesso a esta turma foi encerrado. Peça ao professor um código de uma turma ativa."}</p><button className={styles.primary} type="button" onClick={switchClassroom}>Digitar outro código</button>
        </section> : <section style={{ "--classroom-accent": classroomColor(classroom.color) } as CSSProperties} aria-labelledby="student-classroom-title">
          <header className={styles.heading}>
            <div className={styles.classHeader}><span className={styles.classIcon}><UsersRound size={25} aria-hidden="true" /></span><div><span className={styles.eyebrow}>{classroom.grade}º ano · {classroom.schoolYear}</span><h1 id="student-classroom-title">{classroom.name}</h1>{classroom.school && <p>{classroom.school}</p>}</div></div>
          </header>
          <p className={styles.muted}>Escolha um material para começar. Ele abrirá em outra aba.</p>
          {status === "loading" ? <CatalogStatus busy title="Carregando materiais" message="Estamos preparando as atividades da turma." /> : status === "error" ? <CatalogStatus title="Não foi possível carregar os materiais" message="Recarregue a página e entre novamente com o código." /> : visibleMaterials.length ? <ul className={styles.studentList}>
            {visibleMaterials.map((material) => {
              const resource = byId.get(material.resourceId)!;
              return <li key={resource.id}>
                <a className={styles.studentCard} href={resource.canonicalUrl ?? resource.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <div><span className={styles.badge}>{formatResourceTypes(resource)}</span><h2>{resource.title}</h2><small>{resource.provider} · Site externo</small>{material.instruction && <p className={styles.instruction}>{material.instruction}</p>}</div>
                  <ArrowUpRight size={24} aria-hidden="true" />
                </a>
              </li>;
            })}
          </ul> : <div className={styles.empty} style={{ marginTop: "1.5rem" }}><UsersRound size={36} aria-hidden="true" /><h2>Os materiais vão aparecer aqui</h2><p>Seu professor ainda não deixou materiais visíveis para esta turma.</p></div>}
        </section>}
        <footer className={styles.studentFooter}><Link to="/privacidade">Privacidade e preferências</Link></footer>
      </main>
    </div>
  );
}
