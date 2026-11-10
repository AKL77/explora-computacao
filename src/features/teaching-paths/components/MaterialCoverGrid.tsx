import { useEffect, useId, useRef, useState } from "react";
import { Link, type LinkProps } from "react-router-dom";
import type { Resource } from "@/domain/resource";
import {
  getResourceTypeLabels,
  RESOURCE_PLACEHOLDER,
} from "@/features/catalog/components/resourcePresentation";
import styles from "./MaterialCoverGrid.module.css";

type DetailLinkProps = Pick<LinkProps, "to" | "state" | "onClick">;

interface MaterialCoverProps {
  resource: Resource;
  detailLink: DetailLinkProps;
  pinned: boolean;
  onPinChange: (pinned: boolean) => void;
}

function MaterialCover({ resource, detailLink, pinned, onPinChange }: MaterialCoverProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const pointerType = useRef("");
  const previewId = useId();
  const isOpen = hovered || focused || pinned;
  const imageSrc = resource.image?.thumbnailSrc ?? resource.image?.src ?? RESOURCE_PLACEHOLDER;

  useEffect(() => {
    if (!isOpen) return;

    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented ||
        (event.target instanceof Element && event.target.closest("dialog[open]"))) return;

      setHovered(false);
      setFocused(false);
      onPinChange(false);
    };

    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [isOpen, onPinChange]);

  return (
    <article
      className={styles.card}
      data-preview={isOpen}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && window.matchMedia("(any-hover: hover)").matches) {
          setHovered(true);
        }
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <Link
        {...detailLink}
        className={styles.trigger}
        aria-label={`Abrir detalhes de ${resource.title}`}
        aria-expanded={isOpen}
        aria-controls={previewId}
        onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        onPointerDown={(event) => { pointerType.current = event.pointerType; }}
        onClick={(event) => {
          const tapped = pointerType.current === "touch" && event.detail > 0;
          pointerType.current = "";
          if (tapped && !pinned) {
            event.preventDefault();
            onPinChange(true);
            return;
          }
          detailLink.onClick?.(event);
        }}
      >
        <img className={styles.backdrop} src={imageSrc} alt="" loading="lazy" decoding="async" />
        <img className={styles.image} src={imageSrc} alt={resource.image?.alt ?? ""} loading="lazy" decoding="async" />
        <div id={previewId} className={styles.preview} aria-hidden={!isOpen}>
          <p className={styles.type}>{getResourceTypeLabels(resource)[0]}</p>
          <h3>{resource.title}</h3>
        </div>
      </Link>
    </article>
  );
}

export function MaterialCoverGrid({ resources, getDetailLinkProps }: {
  resources: Resource[];
  getDetailLinkProps: (resource: Resource) => DetailLinkProps;
}) {
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  return (
    <div className={styles.grid} aria-label="Resultados da busca em capas">
      {resources.map((resource) => (
        <MaterialCover
          key={resource.id}
          resource={resource}
          detailLink={getDetailLinkProps(resource)}
          pinned={pinnedId === resource.id}
          onPinChange={(pinned) => setPinnedId((current) => pinned
            ? resource.id
            : current === resource.id ? null : current)}
        />
      ))}
    </div>
  );
}
