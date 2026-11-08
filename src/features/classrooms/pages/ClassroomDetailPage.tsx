import { useState, type CSSProperties, type FormEvent } from "react";
import { Archive, ArchiveRestore, ArrowDown, ArrowLeft, ArrowUp, Copy, Eye, EyeOff, MessageSquare, Pencil, Plus, Waypoints, Trash2, UsersRound, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { classroomColor, formatClassroomCode } from "@/domain/classroom";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { formatResourceTypes } from "@/features/catalog/components/resourcePresentation";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { ClassroomFormDialog } from "../components/ClassroomFormDialog";
import { ClassroomMaterialPicker } from "../components/ClassroomMaterialPicker";
import styles from "../Classrooms.module.css";
import { ShareTeachingPathDialog } from "../components/ShareTeachingPathDialog";
import { SharedTeachingPathCard } from "../components/SharedTeachingPathCard";
import { classroomPathNeedsUpdate } from "@/domain/classroomTeachingPath";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { isOnlineMode } from "@/lib/backend/config";

export function ClassroomDetailPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const classrooms = useClassroomsStore((state) => state.classrooms);
  const { archiveClassroom, unarchiveClassroom, deleteClassroom, updateMaterial, removeMaterial, moveMaterial, setTeachingPathVisibility, removeTeachingPath, moveTeachingPath, updateSharedTeachingPath } = useClassroomsStore();
  const savedPaths = useTeachingPathsStore((state) => state.paths);
  const classroom = classrooms.find((item) => item.id === classroomId);
  const { resources, status } = useCatalogResources();
  const [dialog, setDialog] = useState<"edit" | "code" | "add" | "share" | "archive" | "delete" | null>(null);
  const [instructionResourceId, setInstructionResourceId] = useState<string | null>(null);
  const [instruction, setInstruction] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState<{ classroomId: string; kind: "material" | "path"; id: string; name: string } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const byId = new Map(resources.map((resource) => [resource.id, resource]));

  if (!classroom) return <WorkspacePage title="Turma não encontrada" eyebrow="Minhas Turmas" contentClassName={styles.empty}><UsersRound size={40} aria-hidden="true" /><p>Esta turma pode ter sido excluída.</p><Link className={styles.primary} to="/app/minhas-turmas">Voltar para Minhas Turmas</Link></WorkspacePage>;

  const accessUrl = new URL(window.location.href);
  accessUrl.hash = "/alunos";
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(classroom.code);
      setCopyMessage("Código copiado.");
    } catch {
      setCopyMessage("Selecione o código acima e copie para compartilhar.");
    }
  };
  const saveInstruction = async (event: FormEvent) => {
    event.preventDefault();
    if (!instructionResourceId) return;
    if (!await updateMaterial(classroom.id, instructionResourceId, { instruction })) return;
    setInstructionResourceId(null);
    setAnnouncement("Orientação atualizada.");
  };
  const confirmRemoval = async () => {
    if (!pendingRemoval || isRemoving || classroom.archived || pendingRemoval.classroomId !== classroom.id) return;
    setIsRemoving(true);
    try {
      const removed = pendingRemoval.kind === "path"
        ? await removeTeachingPath(classroom.id, pendingRemoval.id)
        : await removeMaterial(classroom.id, pendingRemoval.id);
      if (!removed) return;
      setAnnouncement(pendingRemoval.kind === "path"
        ? "Trilha removida desta turma. A original permanece em Minhas Trilhas."
        : `${pendingRemoval.name} removido da turma.`);
      setPendingRemoval(null);
    } finally { setIsRemoving(false); }
  };

  return (
    <WorkspacePage title={classroom.name} eyebrow={`${classroom.grade}º ano · ${classroom.schoolYear}${classroom.archived ? " · Arquivada" : ""}`} contentClassName={styles.page} masked style={{ "--classroom-accent": classroomColor(classroom.color) } as CSSProperties} headerActions={!classroom.archived && (
      <div className={styles.headerCode}>
        <div className={styles.codeSummary}><span>Código da turma</span><strong className={styles.smallCode}>{formatClassroomCode(classroom.code)}</strong></div>
        <button className={styles.primary} type="button" onClick={() => { setCopyMessage(""); setDialog("code"); }}><UsersRound size={18} aria-hidden="true" /> Mostrar código</button>
      </div>
    )}>
      <Link className={styles.breadcrumb} to="/app/minhas-turmas"><ArrowLeft size={16} aria-hidden="true" /> Minhas Turmas</Link>
      <header className={styles.heading}>
        {classroom.school && <p>{classroom.school}</p>}
        <div className={styles.actions}>
          {!classroom.archived && <button className={styles.secondary} type="button" onClick={() => setDialog("edit")}><Pencil size={17} aria-hidden="true" /> Editar turma</button>}
          <button className={classroom.archived ? styles.primary : styles.secondary} type="button" onClick={async () => {
            if (!classroom.archived) { setDialog("archive"); return; }
            if (await unarchiveClassroom(classroom.id)) setAnnouncement("Turma desarquivada. O acesso dos alunos pelo mesmo código foi reativado.");
          }}>{classroom.archived ? <ArchiveRestore size={17} aria-hidden="true" /> : <Archive size={17} aria-hidden="true" />}{classroom.archived ? "Desarquivar turma" : "Arquivar"}</button>
          <button className={styles.danger} type="button" onClick={() => setDialog("delete")}><Trash2 size={17} aria-hidden="true" /> Excluir turma</button>
        </div>
      </header>
      <section className={styles.page} aria-labelledby="classroom-materials-title">
        <div className={styles.sectionHeading}>
          <h2 id="classroom-materials-title">Materiais da turma</h2>
          {!classroom.archived && <div className={styles.actions}>
            {(!isOnlineMode || classroom.sharedPaths !== undefined) && <button className={styles.secondary} type="button" disabled={status !== "success"} onClick={() => setDialog("share")}><Waypoints size={17} aria-hidden="true" /> Adicionar trilha</button>}
            <button className={styles.primary} type="button" disabled={status !== "success"} onClick={() => setDialog("add")}><Plus size={18} aria-hidden="true" /> Adicionar material</button>
          </div>}
        </div>
        <p className={styles.announcement} role="status">{announcement}</p>
        {(classroom.sharedPaths?.length ?? 0) > 0 && <div className={styles.sharedPathList}>
          {classroom.sharedPaths!.map((path, index) => {
            const source = savedPaths.find((item) => item.id === path.id);
            return <SharedTeachingPathCard key={path.id} path={path} resources={resources} teacher classroomUrl={`/app/minhas-turmas/${classroom.id}`} controls={classroom.archived ? undefined : {
              canMoveUp: index > 0, canMoveDown: index < classroom.sharedPaths!.length - 1,
              outdated: Boolean(source && classroomPathNeedsUpdate(path, source)),
              onVisibility: async () => { if (await setTeachingPathVisibility(classroom.id, path.id, !path.visible)) setAnnouncement(`${path.name}: ${path.visible ? "oculta" : "visível"} para os alunos.`); },
              onRemove: () => setPendingRemoval({ classroomId: classroom.id, kind: "path", id: path.id, name: path.name }),
              onMove: (direction) => { void moveTeachingPath(classroom.id, path.id, direction); },
              onUpdate: async () => { if (await updateSharedTeachingPath(classroom.id, path.id)) setAnnouncement("Cópia da trilha atualizada nesta turma."); },
            }} />;
          })}
        </div>}
        {status === "loading" ? <CatalogStatus busy title="Carregando materiais" message="Estamos preparando os materiais da turma." /> : status === "error" ? <CatalogStatus title="Não foi possível carregar os materiais" message="Recarregue a página para tentar novamente." /> : classroom.materials.length === 0 && !classroom.sharedPaths?.length ? <div className={styles.empty}>
          <UsersRound size={36} aria-hidden="true" /><h2>Nenhum material nesta turma</h2><p>{classroom.archived ? "Esta turma foi arquivada sem materiais." : "Adicione jogos, vídeos e atividades. Eles já ficam visíveis para os alunos e você pode ocultá-los quando quiser."}</p>
        </div> : <ol className={styles.materialList}>
          {classroom.materials.map((material, index) => {
            const resource = byId.get(material.resourceId);
            const title = resource?.title ?? "Material indisponível";
            return <li key={material.resourceId} className={`${styles.materialRow} ${!material.visible ? styles.hiddenRow : ""}`}>
              <span className={styles.position} aria-hidden="true">{index + 1}</span>
              <div className={styles.materialInfo}>
                <h3>{resource ? <Link to={`/app/materiais/${resource.slug}`} state={{ from: `/app/minhas-turmas/${classroom.id}` }}>{title}</Link> : title}</h3>
                <small>{resource ? `${formatResourceTypes(resource)} · ${resource.provider}` : "Este material não está mais no acervo."}</small>
                {material.instruction && <p className={styles.instruction}>{material.instruction}</p>}
              </div>
              {!classroom.archived && <div className={styles.rowActions}>
                <button className={styles.visibility} type="button" role="switch" aria-checked={material.visible} aria-label={`Visível para alunos: ${title}`} onClick={async () => { if (!await updateMaterial(classroom.id, material.resourceId, { visible: !material.visible })) return; setAnnouncement(`${title}: ${material.visible ? "oculto" : "visível"} para os alunos.`); }}>{material.visible ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}{material.visible ? "Visível" : "Oculto"}</button>
                <button className={styles.iconButton} type="button" aria-label={`Editar orientação de ${title}`} title="Orientação para os alunos" onClick={() => { setInstructionResourceId(material.resourceId); setInstruction(material.instruction); }}><MessageSquare size={17} aria-hidden="true" /></button>
                <button className={styles.iconButton} type="button" disabled={index === 0} aria-label={`Mover ${title} para cima`} onClick={() => void moveMaterial(classroom.id, material.resourceId, -1)}><ArrowUp size={17} aria-hidden="true" /></button>
                <button className={styles.iconButton} type="button" disabled={index === classroom.materials.length - 1} aria-label={`Mover ${title} para baixo`} onClick={() => void moveMaterial(classroom.id, material.resourceId, 1)}><ArrowDown size={17} aria-hidden="true" /></button>
                <button className={styles.iconButton} type="button" aria-label={`Remover ${title} da turma`} title="Remover da turma" onClick={() => setPendingRemoval({ classroomId: classroom.id, kind: "material", id: material.resourceId, name: title })}><X size={17} aria-hidden="true" /></button>
              </div>}
            </li>;
          })}
        </ol>}
      </section>
      {pendingRemoval?.classroomId === classroom.id && !classroom.archived && <AccessibleDialog
        open
        title={pendingRemoval.kind === "path" ? "Remover trilha da turma?" : "Remover material da turma?"}
        size="small"
        onClose={() => { if (!isRemoving) setPendingRemoval(null); }}
      >
        <div className={styles.form}>
          <p>Tem certeza de que deseja remover <strong>{pendingRemoval.name}</strong> desta turma?</p>
          {pendingRemoval.kind === "path" && <p className={styles.muted}>Os alunos deixarão de acessar esta trilha pela turma. A original permanece em Minhas Trilhas.</p>}
          <div className={styles.formFooter}>
            <button className={styles.secondary} type="button" disabled={isRemoving} onClick={() => setPendingRemoval(null)}>Cancelar</button>
            <button className={styles.danger} type="button" disabled={isRemoving} onClick={() => void confirmRemoval()}>{isRemoving ? "Removendo…" : pendingRemoval.kind === "path" ? "Remover trilha" : "Remover material"}</button>
          </div>
        </div>
      </AccessibleDialog>}
      {dialog === "edit" && !classroom.archived && <ClassroomFormDialog classroom={classroom} onClose={() => setDialog(null)} onSaved={() => { setDialog(null); setAnnouncement("Informações da turma atualizadas."); }} />}
      {dialog === "share" && !classroom.archived && <ShareTeachingPathDialog classroom={classroom} onClose={() => setDialog(null)} onShared={(_target, path) => { setDialog(null); setAnnouncement(`A trilha “${path.name}” foi adicionada à turma.`); }} />}
      {dialog === "add" && !classroom.archived && <ClassroomMaterialPicker classroom={classroom} resources={resources} onClose={() => setDialog(null)} onAdded={(count) => { setDialog(null); setAnnouncement(`${count} ${count === 1 ? "material adicionado e visível" : "materiais adicionados e visíveis"} para os alunos.`); }} />}
      {dialog === "code" && !classroom.archived && <AccessibleDialog open title={`Código de ${classroom.name}`} onClose={() => setDialog(null)}>
        <div className={styles.projection}>
          <p>Abra o Explora Computação, clique em <strong>Acessar turma</strong> e digite:</p>
          <output className={styles.bigCode} aria-label="Código da turma">{formatClassroomCode(classroom.code)}</output>
          <button className={styles.primary} type="button" onClick={() => void copyCode()}><Copy size={18} aria-hidden="true" /> Copiar código</button>
          <p role="status">{copyMessage}</p>
          <label className={styles.field}><span className="sr-only">Endereço de acesso dos alunos</span><input className={`${styles.input} ${styles.accessUrl}`} readOnly value={accessUrl.toString()} onFocus={(event) => event.target.select()} /></label>
        </div>
      </AccessibleDialog>}
      {(dialog === "archive" || dialog === "delete") && <AccessibleDialog open title={dialog === "archive" ? "Arquivar turma?" : "Excluir turma?"} onClose={() => setDialog(null)} size="small">
        <div className={styles.form}>
          <p className={styles.muted}>{dialog === "archive" ? `A turma ${classroom.name} ficará guardada em Arquivadas. Os alunos não poderão mais acessar pelo código.` : `A turma ${classroom.name} e sua seleção de materiais serão excluídas. O código deixará de funcionar. Essa ação não pode ser desfeita.`}</p>
          <div className={styles.formFooter}>
            <button className={styles.secondary} type="button" onClick={() => setDialog(null)}>Cancelar</button>
            <button className={dialog === "delete" ? styles.danger : styles.primary} type="button" onClick={async () => {
              if (dialog === "archive") { if (!await archiveClassroom(classroom.id)) return; setDialog(null); setAnnouncement("Turma arquivada. O acesso dos alunos foi encerrado."); }
              else { if (!await deleteClassroom(classroom.id)) return; navigate("/app/minhas-turmas", { replace: true }); }
            }}>{dialog === "archive" ? "Arquivar turma" : "Excluir turma"}</button>
          </div>
        </div>
      </AccessibleDialog>}
      {instructionResourceId && !classroom.archived && <AccessibleDialog open title="Orientação para os alunos" description={byId.get(instructionResourceId)?.title} onClose={() => setInstructionResourceId(null)}>
        <form className={styles.form} onSubmit={saveInstruction}>
          <label className={styles.field}>Orientação (opcional)<textarea className={styles.textarea} maxLength={500} rows={4} value={instruction} placeholder="Ex.: Em duplas, resolvam os cinco primeiros desafios." onChange={(event) => setInstruction(event.target.value)} /><small>{instruction.length}/500 caracteres. Esta orientação aparece junto ao material.</small></label>
          <div className={styles.formFooter}><button className={styles.secondary} type="button" onClick={() => setInstructionResourceId(null)}>Cancelar</button><button className={styles.primary} type="submit">Salvar orientação</button></div>
        </form>
      </AccessibleDialog>}
    </WorkspacePage>
  );
}
