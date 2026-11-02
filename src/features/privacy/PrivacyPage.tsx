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
import { isOnlineMode } from "@/lib/backend/config";

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
          para apoiar o planejamento de docentes. {isOnlineMode ? "Professores entram com Google para organizar seu trabalho. Alunos acessam por código, sem cadastro." : "Esta demonstração não exige cadastro real."}
        </p>
        <h2>{isOnlineMode ? "Conta e dados salvos" : "O que fica neste navegador"}</h2>
        <p>
          {isOnlineMode ? "O Google fornece nome, e-mail e identificador da conta do professor ao Supabase, responsável pela autenticação e pelo armazenamento das turmas e trilhas. A plataforma não recebe a senha do Google. Esses registros ficam vinculados à conta, em um projeto na região de São Paulo. A sessão docente fica na aba do navegador; use Sair ao terminar em um computador compartilhado. Limpar os dados do navegador não exclui seus registros online." : "A sessão demonstrativa, as trilhas e as turmas ficam neste navegador. Limpar os dados do site apaga essas informações."}
          {" "}Sua escolha sobre análise de uso fica neste navegador. Não solicitamos dados de estudantes.
          O código digitado e a turma acessada pelo aluno não são salvos como sessão;
          ao abrir novamente a página de acesso, é necessário informar o código.
        </p>
        {isOnlineMode && <p>Quem conhece o código pode consultar os materiais visíveis e as informações exibidas da turma. Evite incluir dados pessoais dos alunos em nomes e orientações. O serviço recebe informações técnicas da conexão e usa um identificador derivado do endereço de rede para limitar tentativas, sem criar contas de alunos. Contadores antigos são removidos periodicamente durante o uso; registros técnicos do provedor seguem suas próprias regras. Consulte a <a href="https://supabase.com/privacy">política de privacidade do Supabase</a>.</p>}
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
          interromper a análise. As trilhas salvas permanecem {isOnlineMode ? "na sua conta" : "neste navegador"}; alterações
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
