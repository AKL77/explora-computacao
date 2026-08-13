import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <main className={styles.page} id="main-content">
      <div className={styles.card}>
        <Compass aria-hidden="true" size={44} />
        <span>Erro 404</span>
        <h1>Essa rota ainda não foi explorada</h1>
        <p>A página que você procurou não existe ou mudou de endereço.</p>
        <Link to="/">
          <ArrowLeft aria-hidden="true" size={18} />
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
