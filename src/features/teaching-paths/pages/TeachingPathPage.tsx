import { useMemo, useState } from "react";
import { Check, ListChecks, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackClarityEvent } from "@/lib/clarity";
import { WorkspacePage } from "@/components/layout/WorkspacePage";

import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import {
  DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
  DEFAULT_TEACHING_PATH_ICON,
  TEACHING_PATH_BACKGROUND_COLORS,
  TEACHING_PATH_ICONS,
  type TeachingPathBackgroundColor,
  type TeachingPathIcon,
} from "@/domain/savedTeachingPath";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import {
  TeachingPathIconGlyph,
} from "../components/TeachingPathAppearance";
import {
  teachingPathColorLabels,
  teachingPathIconLabels,
} from "../components/teachingPathAppearanceOptions";
import {
  getTeachingResourceMetadata,
} from "../data/pilotTeachingResources";
import styles from "./TeachingPathPage.module.css";
import { TeachingMaterialBrowser, type TeachingResourceView } from "../components/TeachingMaterialBrowser";

const colorOptionClassNames: Record<TeachingPathBackgroundColor, string> = {
  turquoise: "colorTurquoise",
  blue: "colorBlue",
  green: "colorGreen",
  indigo: "colorIndigo",
  violet: "colorViolet",
  amber: "colorAmber",
  coral: "colorCoral",
};

export function TeachingPathPage() {
  const { resources, status } = useCatalogResources();
  const navigate = useNavigate();
  const savedPaths = useTeachingPathsStore((state) => state.paths);
  const createPath = useTeachingPathsStore((state) => state.createPath);
  const addResourceToPath = useTeachingPathsStore((state) => state.addResourceToPath);
  const [trailIds, setTrailIds] = useState<string[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [pathName, setPathName] = useState("");
  const [pathObjective, setPathObjective] = useState("");
  const [pathBackgroundColor, setPathBackgroundColor] = useState<TeachingPathBackgroundColor>(
    DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
  );
  const [pathIcon, setPathIcon] = useState<TeachingPathIcon>(DEFAULT_TEACHING_PATH_ICON);
  const [resourceToAddToExisting, setResourceToAddToExisting] = useState<string | null>(null);
  const [existingPathId, setExistingPathId] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const teachingResources = useMemo(() => resources.map((resource) => ({ resource, teaching: getTeachingResourceMetadata(resource) })), [resources]);
  const teachingById = useMemo(
    () => new Map(teachingResources.map((item) => [item.resource.id, item])),
    [teachingResources],
  );

  const trail = trailIds.flatMap((id) => {
    const item = teachingById.get(id);
    return item ? [item] : [];
  });
  const addToTrail = (item: TeachingResourceView) => {
    if (trailIds.includes(item.resource.id)) return;

    setTrailIds((current) => [...current, item.resource.id]);
    trackClarityEvent("material_selecionado");
    setAnnouncement(`${item.resource.title} foi adicionado à trilha em criação.`);
  };

  const removeFromTrail = (item: TeachingResourceView) => {
    setTrailIds((current) => current.filter((id) => id !== item.resource.id));
    setAnnouncement(`${item.resource.title} foi removido da trilha em criação.`);
  };

  const savePath = async () => {
    const path = await createPath(pathName, trailIds, {
      objective: pathObjective,
      backgroundColor: pathBackgroundColor,
      icon: pathIcon,
    });
    if (!path) return;

    trackClarityEvent("trilha_criada");
    setAnnouncement(`A trilha “${path.name}” foi salva em Minhas Trilhas.`);
    setTrailIds([]);
    setPathName("");
    setPathObjective("");
    setPathBackgroundColor(DEFAULT_TEACHING_PATH_BACKGROUND_COLOR);
    setPathIcon(DEFAULT_TEACHING_PATH_ICON);
    setIsSaveDialogOpen(false);
    navigate("/app/minhas-trilhas");
  };

  const openExistingPathDialog = (resourceId: string) => {
    const availablePaths = savedPaths.filter((path) => !path.resourceIds.includes(resourceId));
    if (availablePaths.length === 0) return;

    setResourceToAddToExisting(resourceId);
    setExistingPathId(availablePaths[0].id);
  };

  const addToExistingPath = async () => {
    if (!resourceToAddToExisting || !existingPathId) return;
    const resource = teachingById.get(resourceToAddToExisting)?.resource;
    const path = savedPaths.find((item) => item.id === existingPathId);
    if (!resource || !path || !await addResourceToPath(path.id, resource.id)) return;

    trackClarityEvent("material_adicionado_trilha");
    setAnnouncement(`${resource.title} foi adicionado à trilha “${path.name}”.`);
    setResourceToAddToExisting(null);
    setExistingPathId("");
  };

  if (status === "loading") {
    return (
      <CatalogStatus
        busy
        title="Preparando os materiais"
        message="Estamos organizando os recursos para a criação da trilha."
      />
    );
  }

  if (status === "error") {
    return (
      <CatalogStatus
        title="Não foi possível carregar os materiais"
        message="Tente abrir esta página novamente. Sua trilha ainda não foi iniciada."
      />
    );
  }

  return (
    <WorkspacePage title="Buscar Materiais" eyebrow="Planejamento por materiais" contentClassName={styles.page}>
      <TeachingMaterialBrowser resources={resources} renderActions={(item) => {
        const { resource } = item;
        const isAdded = trailIds.includes(resource.id);
        const availableExistingPaths = savedPaths.filter((path) => !path.resourceIds.includes(resource.id));
        return <>
          <span className={styles.actionLabel}>Adicionar a</span>
          <button
            className={styles.newTrailButton}
            type="button"
            disabled={isAdded}
            aria-label={
              isAdded
                ? `${resource.title} já foi adicionado à nova trilha`
                : `Adicionar ${resource.title} a uma nova trilha`
            }
            onClick={() => addToTrail(item)}
          >
            {isAdded ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
            {isAdded ? "Na nova trilha" : "Nova trilha"}
          </button>
          <button
            className={styles.existingTrailButton}
            type="button"
            disabled={availableExistingPaths.length === 0}
            aria-label={
              availableExistingPaths.length === 0
                ? `Não há trilha existente disponível para adicionar ${resource.title}`
                : `Adicionar ${resource.title} a uma trilha existente`
            }
            title={
              availableExistingPaths.length === 0
                ? "Salve uma trilha para usar esta opção."
                : undefined
            }
            onClick={() => openExistingPathDialog(resource.id)}
          >
            Trilha existente
          </button>
        </>;
      }}>
      {trail.length > 0 ? (
        <section className={styles.trailSummary} aria-labelledby="trail-title">
          <div className={styles.trailHeading}>
            <span className={styles.trailIcon} aria-hidden="true">
              <ListChecks size={20} />
            </span>
            <div>
              <h2 id="trail-title">Nova trilha em criação</h2>
              <p>{trail.length} {trail.length === 1 ? "material selecionado" : "materiais selecionados"}.</p>
            </div>
            <button
              className={styles.saveButton}
              type="button"
              onClick={() => setIsSaveDialogOpen(true)}
            >
              Salvar trilha
            </button>
          </div>

          <ul className={styles.selectedMaterials} aria-label="Materiais selecionados">
            {trail.map((item) => (
              <li key={item.resource.id}>
                <span>{item.resource.title}</span>
                <button
                  type="button"
                  aria-label={`Remover ${item.resource.title} da trilha`}
                  title={`Remover ${item.resource.title}`}
                  onClick={() => removeFromTrail(item)}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      </TeachingMaterialBrowser>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true" data-clarity-mask="true">
        {announcement}
      </p>

      <AccessibleDialog
        open={isSaveDialogOpen}
        title="Salvar trilha"
        onClose={() => setIsSaveDialogOpen(false)}
        size="small"
      >
        <form
          className={styles.dialogForm}
          onSubmit={(event) => {
            event.preventDefault();
            savePath();
          }}
        >
          <label htmlFor="teaching-path-name">Nome da trilha</label>
          <input
            id="teaching-path-name"
            value={pathName}
            onChange={(event) => setPathName(event.target.value)}
            autoFocus
          />
          <label htmlFor="teaching-path-objective">Objetivo da trilha</label>
          <textarea
            id="teaching-path-objective"
            value={pathObjective}
            onChange={(event) => setPathObjective(event.target.value)}
            maxLength={500}
            required
          />
          <fieldset className={styles.appearanceFieldset}>
            <legend>Cor de fundo</legend>
            <div className={styles.colorOptions}>
              {TEACHING_PATH_BACKGROUND_COLORS.map((color) => (
                <button
                  className={`${styles.colorOption} ${styles[colorOptionClassNames[color]]}`}
                  type="button"
                  key={color}
                  aria-pressed={pathBackgroundColor === color}
                  onClick={() => setPathBackgroundColor(color)}
                >
                  <span aria-hidden="true" />
                  {teachingPathColorLabels[color]}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.appearanceFieldset}>
            <legend>Ícone da trilha</legend>
            <div className={styles.iconOptions}>
              {TEACHING_PATH_ICONS.map((icon) => (
                <button
                  className={styles.iconOption}
                  type="button"
                  key={icon}
                  aria-pressed={pathIcon === icon}
                  aria-label={`Usar ícone ${teachingPathIconLabels[icon]}`}
                  title={teachingPathIconLabels[icon]}
                  onClick={() => setPathIcon(icon)}
                >
                  <TeachingPathIconGlyph icon={icon} size={20} aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
          <div className={styles.dialogActions}>
            <button type="button" onClick={() => setIsSaveDialogOpen(false)}>Cancelar</button>
            <button type="submit" disabled={pathName.trim().length === 0 || pathObjective.trim().length === 0}>Salvar trilha</button>
          </div>
        </form>
      </AccessibleDialog>

      <AccessibleDialog
        open={resourceToAddToExisting !== null}
        title="Adicionar a uma trilha existente"
        description="Escolha a trilha que receberá este material."
        onClose={() => {
          setResourceToAddToExisting(null);
          setExistingPathId("");
        }}
        size="small"
      >
        <form
          className={styles.dialogForm}
          onSubmit={(event) => {
            event.preventDefault();
            addToExistingPath();
          }}
        >
          <label htmlFor="existing-teaching-path">Trilha existente</label>
          <select
            id="existing-teaching-path"
            value={existingPathId}
            onChange={(event) => setExistingPathId(event.target.value)}
          >
            {savedPaths
              .filter((path) => !path.resourceIds.includes(resourceToAddToExisting ?? ""))
              .map((path) => (
                <option key={path.id} value={path.id}>{path.name}</option>
              ))}
          </select>
          <div className={styles.dialogActions}>
            <button
              type="button"
              onClick={() => {
                setResourceToAddToExisting(null);
                setExistingPathId("");
              }}
            >
              Cancelar
            </button>
            <button type="submit" disabled={!existingPathId}>Adicionar material</button>
          </div>
        </form>
      </AccessibleDialog>
    </WorkspacePage>
  );
}
