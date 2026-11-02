import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { supabase } from "@/lib/backend/client";
import { backendConfig } from "@/lib/backend/config";
import { useSessionStore } from "@/store/useSessionStore";
import styles from "@/features/classrooms/Classrooms.module.css";

export function LoginPage() {
  const authenticated = useSessionStore((state) => state.isAuthenticated);
  const authError = useSessionStore((state) => state.error);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const signInDemo = useSessionStore((state) => state.signIn);
  useEffect(() => { document.title = "Entrar | Explora Computação"; }, []);
  if (authenticated) return <Navigate to="/app/trilha-de-ensino" replace />;
  const enter = async () => {
    if (backendConfig.mode === "demo") { signInDemo(); return; }
    if (!supabase) return;
    setBusy(true); setError("");
    const redirectTo = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
    try {
      const { error: failure } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo, queryParams: { prompt: "select_account" } } });
      if (failure) throw failure;
    } catch { setError("Não foi possível abrir a entrada com Google. Tente novamente."); setBusy(false); }
  };
  return <div className={styles.publicPage}>
    <header className={styles.publicHeader}><Brand /><Link className={styles.secondary} to="/alunos">Acessar turma</Link></header>
    <main className={styles.publicMain}>
      <section className={styles.entry} aria-labelledby="teacher-login-title">
        <div><span className={styles.eyebrow}>Área do professor</span><h1 id="teacher-login-title">Seu espaço de ensino</h1><p>Entre para organizar suas turmas e encontrar suas trilhas em qualquer computador.</p></div>
        <button className={styles.primary} type="button" disabled={busy || backendConfig.mode === "invalid"} onClick={() => void enter()}>{busy ? "Abrindo Google…" : backendConfig.mode === "demo" ? "Continuar na demonstração" : "Entrar com Google"}</button>
        {(error || authError) && <p className={styles.error} role="alert">{error || authError}</p>}
        <p className={styles.entryFootnote}>No primeiro acesso, sua conta é criada automaticamente. Em computadores compartilhados, use Sair ao terminar.</p>
        <Link className={styles.textButton} to="/alunos">Sou aluno: acessar com código</Link>
        <Link className={styles.textButton} to="/privacidade">Privacidade e preferências</Link>
      </section>
    </main>
  </div>;
}
