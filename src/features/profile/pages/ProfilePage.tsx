import { BookOpenCheck, Search, ShieldCheck, UserRound, Waypoints } from "lucide-react";
import { Link } from "react-router-dom";

import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import styles from "./ProfilePage.module.css";

export function ProfilePage() {
  const savedPathsCount = useTeachingPathsStore((state) => state.paths.length);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Sua área</p>
        <h1>Meu perfil</h1>
        <p>Consulte sua sessão e acesse rapidamente as principais áreas de trabalho.</p>
      </header>

      <section className={styles.profileCard} aria-labelledby="profile-name">
        <div className={styles.avatar} aria-hidden="true">
          <UserRound size={34} />
        </div>
        <div className={styles.identity}>
          <span>Perfil de demonstração</span>
          <h2 id="profile-name">Usuário demo</h2>
          <p>Área do docente · Sessão armazenada neste navegador</p>
        </div>
        <div className={styles.privacyNote}>
          <ShieldCheck size={20} aria-hidden="true" />
          <p>
            Esta versão não solicita dados pessoais. Nome, e-mail e escola poderão ser
            configurados quando a autenticação estiver disponível.
          </p>
        </div>
      </section>

      <section className={styles.workspace} aria-labelledby="workspace-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Visão geral</p>
            <h2 id="workspace-title">Meu espaço de trabalho</h2>
          </div>
          <span className={styles.pathCount}>
            <strong>{savedPathsCount}</strong>
            {savedPathsCount === 1 ? "trilha salva" : "trilhas salvas"}
          </span>
        </div>

        <div className={styles.shortcuts}>
          <Link to="/app/trilha-de-ensino">
            <span className={styles.shortcutIcon} aria-hidden="true"><Search size={22} /></span>
            <span><strong>Buscar Materiais</strong><small>Encontre conteúdos e monte uma sequência.</small></span>
          </Link>
          <Link to="/app/trilhas-prontas">
            <span className={styles.shortcutIcon} aria-hidden="true"><BookOpenCheck size={22} /></span>
            <span><strong>Trilhas Prontas</strong><small>Explore sequências organizadas por conteúdo.</small></span>
          </Link>
          <Link to="/app/minhas-trilhas">
            <span className={styles.shortcutIcon} aria-hidden="true"><Waypoints size={22} /></span>
            <span><strong>Minhas Trilhas</strong><small>Continue e organize suas trilhas salvas.</small></span>
          </Link>
        </div>
      </section>
    </div>
  );
}
