import { useId, type CSSProperties, type ReactNode } from "react";
import styles from "./WorkspacePage.module.css";

type WorkspacePageProps = {
  title: string;
  eyebrow: string;
  titleId?: string;
  as?: "section" | "article" | "div";
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  masked?: boolean;
  maskTitle?: boolean;
  headerActions?: ReactNode;
  children: ReactNode;
};

export function WorkspacePage({
  title,
  eyebrow,
  titleId,
  as: Element = "section",
  className,
  contentClassName,
  style,
  masked = false,
  maskTitle = false,
  headerActions,
  children,
}: WorkspacePageProps) {
  const generatedTitleId = useId();
  const headingId = titleId ?? generatedTitleId;

  return (
    <Element className={`${styles.page} ${className ?? ""}`} style={style} aria-labelledby={headingId} data-clarity-mask={masked ? "true" : undefined}>
      <header className={styles.header}>
        <div className={`${styles.headerContent} ${headerActions ? styles.withActions : ""}`}>
          <div className={styles.headerTitle}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 id={headingId} data-clarity-mask={masked || maskTitle ? "true" : undefined}>{title}</h1>
          </div>
          {headerActions ? <div className={styles.headerActions}>{headerActions}</div> : null}
        </div>
      </header>
      <div className={`${styles.content} ${contentClassName ?? ""}`}>{children}</div>
    </Element>
  );
}
