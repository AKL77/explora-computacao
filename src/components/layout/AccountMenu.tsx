import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronUp, LogOut, ShieldCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSessionStore } from "@/store/useSessionStore";
import styles from "./AccountMenu.module.css";

interface AccountMenuProps {
  onNavigate: () => void;
  onSignOut: () => void;
}

export function AccountMenu({ onNavigate, onSignOut }: AccountMenuProps) {
  const user = useSessionStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const name = user?.name || "Usuário demo";

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (open && event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  };

  return (
    <div ref={containerRef} className={styles.account} data-clarity-mask="true" onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <button ref={triggerRef} className={styles.trigger} type="button" aria-label="Minha conta"
        aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-panel` : undefined}
        onClick={() => setOpen((value) => !value)}>
        <span className={styles.avatar} aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
        <span className={styles.triggerText}><strong>{name}</strong><small>Minha conta</small></span>
        <ChevronUp className={open ? styles.expanded : undefined} size={18} aria-hidden="true" />
      </button>

      {open && <div ref={panelRef} id={`${id}-panel`} className={styles.panel} role="dialog" tabIndex={-1}
        aria-labelledby={`${id}-title`} aria-describedby={`${id}-identity`}>
        <header className={styles.header}>
          <h2 id={`${id}-title`}>Minha conta</h2>
          <button className={styles.close} type="button" aria-label="Fechar Minha conta" onClick={close}><X size={18} aria-hidden="true" /></button>
        </header>
        <div id={`${id}-identity`} className={styles.identity}>
          <p className={styles.provider}>{user ? "Conectada com Google" : "Sessão de demonstração"}</p>
          <dl>
            <div><dt>Nome</dt><dd>{name}</dd></div>
            {user?.email && <div><dt>E-mail</dt><dd>{user.email}</dd></div>}
          </dl>
        </div>
        <div className={styles.actions}>
          <Link className={styles.action} to="/privacidade" onClick={() => { setOpen(false); onNavigate(); }}>
            <ShieldCheck size={19} aria-hidden="true" /><span>Privacidade e preferências</span>
          </Link>
          <button className={styles.action} type="button" onClick={() => { setOpen(false); onSignOut(); }}>
            <LogOut size={19} aria-hidden="true" /><span>Sair</span>
          </button>
        </div>
      </div>}
    </div>
  );
}
