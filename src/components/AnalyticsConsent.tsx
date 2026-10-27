import { useEffect, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getAnalyticsConsent,
  isClarityConfigured,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  syncClarityConsent,
  trackClarityPage,
} from "@/lib/clarity";
import styles from "./AnalyticsConsent.module.css";

export function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, getAnalyticsConsent);
  const { pathname } = useLocation();

  useEffect(() => {
    syncClarityConsent();
    trackClarityPage(pathname);
  }, [consent, pathname]);

  if (!isClarityConfigured() || consent !== null || pathname === "/privacidade") return null;

  return (
    <section className={styles.banner} aria-labelledby="analytics-consent-title">
      <div>
        <h2 id="analytics-consent-title">Ajude a melhorar o Explora</h2>
        <p>
          Podemos usar cookies do Microsoft Clarity para analisar cliques, rolagem e navegação?
          Os dados são enviados à Microsoft para mapas de calor e reconstituições de uso.
          Você pode recusar e continuar usando a plataforma.
        </p>
        <Link to="/privacidade">Privacidade e preferências</Link>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => setAnalyticsConsent("denied")}>Recusar análise</button>
        <button type="button" onClick={() => setAnalyticsConsent("granted")}>Aceitar análise</button>
      </div>
    </section>
  );
}
