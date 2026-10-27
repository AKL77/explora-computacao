import { useEffect, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";
import {
  getAnalyticsConsent,
  isClarityConfigured,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
} from "@/lib/clarity";
import styles from "./PrivacyPage.module.css";

export function PrivacyPage() {
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, getAnalyticsConsent);
  const configured = isClarityConfigured();

  useEffect(() => {
    document.title = "Privacidade | Explora Computação";
    document.getElementById("privacy-title")?.focus();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Brand to="/" />
        <Link to="/">Voltar ao início</Link>
      </header>
      <main className={styles.content}>
        <h1 id="privacy-title" tabIndex={-1}>Privacidade e preferências</h1>
        <p>
          O Explora Computação é um protótipo acadêmico desenvolvido por Augusto Lunardi
          para apoiar o planejamento de docentes. O uso da plataforma não exige cadastro real.
        </p>
        <h2>O que fica neste navegador</h2>
        <p>
          A sessão demonstrativa, as trilhas criadas e sua escolha sobre análise de uso
          ficam armazenadas neste navegador. Limpar os dados do site apaga essas informações.
          Não solicitamos nome, e-mail, senha ou dados de estudantes.
        </p>
        <h2>Análise de uso com Microsoft Clarity</h2>
        <p>
          Com sua aceitação, o Clarity recebe dados de navegação, cliques, rolagem,
          características do navegador e do dispositivo e informações técnicas da conexão.
          Esses dados são processados pela Microsoft para produzir mapas de calor,
          reconstituições da navegação e indicadores que ajudam a melhorar a plataforma.
          As reconstituições representam as interações dentro do site, sem câmera ou microfone.
        </p>
        <p>
          Cookies permitem associar as interações a um identificador do navegador, sem login.
          Campos digitados e os nomes e objetivos de suas trilhas são ocultados nas
          reconstituições. Os eventos personalizados registram apenas tipos de ação, sem
          enviar o texto das buscas ou o conteúdo das trilhas. Não habilitamos consentimento
          para cookies de publicidade nesta integração.
        </p>
        <p>
          O Clarity só é carregado depois da aceitação. Recusar mantém a plataforma
          disponível. Ao revogar uma aceitação anterior, a página é recarregada para
          interromper a análise. As trilhas salvas permanecem neste navegador; alterações
          ainda não salvas podem ser perdidas. Os dados já enviados permanecem sujeitos às
          regras da Microsoft. Sites de materiais externos possuem políticas próprias.
        </p>
        <p>
          Consulte a{" "}
          <a href="https://clarity.microsoft.com/privacy">privacidade do Microsoft Clarity</a>
          {" "}e a{" "}
          <a href="https://privacy.microsoft.com/pt-br/privacystatement">
            declaração de privacidade da Microsoft
          </a>.
        </p>
        <section className={styles.preferences} aria-labelledby="privacy-preferences-title">
          <h2 id="privacy-preferences-title">Sua escolha</h2>
          {configured ? (
            <>
              <p role="status">
                {consent === "granted"
                  ? "Análise de uso permitida neste navegador."
                  : consent === "denied"
                    ? "Análise de uso recusada neste navegador."
                    : "A análise de uso aguarda sua escolha e ainda não foi iniciada."}
              </p>
              <div className={styles.actions}>
                <button type="button" disabled={consent === "denied"} onClick={() => setAnalyticsConsent("denied")}>
                  Recusar análise
                </button>
                <button type="button" disabled={consent === "granted"} onClick={() => setAnalyticsConsent("granted")}>
                  Aceitar análise
                </button>
              </div>
              <p>Você pode voltar a esta página para mudar sua escolha a qualquer momento.</p>
            </>
          ) : (
            <p>A análise de uso está desativada nesta versão do site.</p>
          )}
        </section>
      </main>
    </div>
  );
}
