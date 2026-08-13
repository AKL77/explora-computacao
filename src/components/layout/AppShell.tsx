import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  CircleHelp,
  FolderHeart,
  GraduationCap,
  LibraryBig,
  LogOut,
  Menu,
  NotebookTabs,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { useSessionStore } from "@/store/useSessionStore";
import styles from "./AppShell.module.css";

const navigationItems = [
  { to: "", label: "Meu perfil", icon: UserRound, disabled: true },
  { to: "/app/acervo", label: "Acervo", icon: LibraryBig, future: false },
  { to: "/app/pastas", label: "Meus Materiais", icon: FolderHeart, future: false },
  { to: "", label: "Minhas Turmas", icon: GraduationCap, disabled: true },
  { to: "", label: "Meus Planos de Aula", icon: NotebookTabs, disabled: true },
  { to: "", label: "Criar Plano de Aula", icon: Sparkles, disabled: true },
  { to: "/app/sobre", label: "Sobre", icon: CircleHelp, future: false },
] as const;

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/app/pastas/")) return "Conteúdo da pasta";
  if (pathname === "/app/pastas") return "Meus Materiais";
  if (pathname.startsWith("/app/acervo/")) return "Detalhe do recurso";
  if (pathname === "/app/acervo") return "Acervo";
  if (pathname === "/app/perfil") return "Meu perfil";
  if (pathname === "/app/plano-de-aula") return "Criar Plano de Aula";
  if (pathname === "/app/sobre") return "Sobre";
  return "Informática Explorer";
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useSessionStore((state) => state.signOut);
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    document.title = `${pageTitle} | Informática Explorer`;
    const frame = window.requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, pageTitle]);

  useEffect(() => {
    if (!menuOpen) return;

    const frame = window.requestAnimationFrame(() => {
      sidebarRef.current
        ?.querySelector<HTMLElement>("nav a[href], nav button:not([disabled])")
        ?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [menuOpen]);

  const closeMenu = (restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      sidebarRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
    );
    const first = focusable[0];
    const last = focusable.at(-1);

    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const leave = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>

      <header className={styles.mobileHeader}>
        <Brand compact />
        <span className={styles.mobileTitle}>{getPageTitle(location.pathname)}</span>
        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="app-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      {menuOpen && (
        <button
          className={styles.backdrop}
          type="button"
          aria-label="Fechar menu"
          onClick={() => closeMenu(true)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}
        id="app-navigation"
        onKeyDown={handleMenuKeyDown}
      >
        <div className={styles.brandArea}>
          <Brand inverted to="/app/acervo" />
        </div>

        <nav className={styles.nav} aria-label="Navegação principal">
          {navigationItems.map(({ to, label, icon: Icon, ...item }) =>
            "disabled" in item && item.disabled ? (
              <button
                key={label}
                className={`${styles.navLink} ${styles.disabledNavItem}`}
                type="button"
                disabled
                aria-disabled="true"
              >
                <Icon aria-hidden="true" size={21} />
                <span>{label}</span>
              </button>
            ) : (
              <NavLink
                key={to}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                to={to}
                onClick={() => closeMenu()}
              >
                <Icon aria-hidden="true" size={21} />
                <span>{label}</span>
                {"future" in item && item.future ? (
                  <span className={styles.futureBadge}>Em breve</span>
                ) : null}
              </NavLink>
            ),
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.demoUser}>
            <span className={styles.avatar} aria-hidden="true">D</span>
            <span>
              <strong>Usuário demo</strong>
              <small>Sessão local</small>
            </span>
          </div>
          <button className={styles.signOut} type="button" onClick={leave}>
            <LogOut aria-hidden="true" size={20} />
            Sair
          </button>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.desktopTopbar}>
          <div>
            <span className={styles.eyebrow}>Área do docente</span>
            <strong>{pageTitle}</strong>
          </div>
        </header>
        <span className={styles.routeAnnouncement} aria-live="polite" aria-atomic="true">
          {pageTitle}
        </span>
        <main
          ref={mainRef}
          className={styles.main}
          id="main-content"
          tabIndex={-1}
          aria-label={pageTitle}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
