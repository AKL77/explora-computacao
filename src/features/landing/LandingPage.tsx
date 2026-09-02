import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import {
  ArrowDown,
  BookOpenCheck,
  CheckCircle2,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useSessionStore } from "@/store/useSessionStore";
import { publicAsset } from "@/lib/publicAsset";

import styles from "./LandingPage.module.css";

const HERO_IMAGE_URL = publicAsset("images/hero-ufsm-campus-santa-maria.jpg");
const RESOURCE_PLACEHOLDER_URL = publicAsset("branding/resource-placeholder.svg");

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  image.onerror = null;
  image.alt = "";
  image.src = RESOURCE_PLACEHOLDER_URL;
}

export function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileNavButtonRef = useRef<HTMLButtonElement>(null);
  const signIn = useSessionStore((state) => state.signIn);

  const scrollToSection = (sectionId: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView();
    });
  };

  const handleSectionLink =
    (sectionId: string, closeMobileNav = false) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (closeMobileNav) setMobileNavOpen(false);
      scrollToSection(sectionId);
    };

  const handleMobileNavKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    setMobileNavOpen(false);
    mobileNavButtonRef.current?.focus();
  };

  return (
    <div className={styles.page} id="topo">
      <a className={styles.skipLink} href="#conteudo-principal">
        Pular para o conteúdo
      </a>

      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <Link className={styles.brand} to="/" aria-label="Informática Explorer — início">
            <img
              className={styles.brandMark}
              src={publicAsset("branding/informatica-explorer-logo.png")}
              alt=""
              width="48"
              height="48"
            />
            <span className={styles.brandName}>Informática Explorer</span>
          </Link>

          <nav className={styles.siteNav} aria-label="Navegação principal">
            <a href="#projeto" onClick={handleSectionLink("projeto")}>O projeto</a>
            <a href="#acervo" onClick={handleSectionLink("acervo")}>Acervo</a>
            <a
              href="#trilhas-de-ensino"
              onClick={handleSectionLink("trilhas-de-ensino")}
            >
              Trilhas de ensino
            </a>
          </nav>

          <Link className={styles.signInLink} to="/app/acervo" onClick={signIn}>
            Entrar
          </Link>

          <button
            ref={mobileNavButtonRef}
            className={styles.mobileNavButton}
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="landing-mobile-navigation"
            aria-label={mobileNavOpen ? "Fechar navegação" : "Abrir navegação"}
            onClick={() => setMobileNavOpen((current) => !current)}
          >
            {mobileNavOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          {mobileNavOpen ? (
            <nav
              className={styles.mobileNav}
              id="landing-mobile-navigation"
              aria-label="Navegação principal em telas pequenas"
              onKeyDown={handleMobileNavKeyDown}
            >
              <a
                href="#projeto"
                onClick={handleSectionLink("projeto", true)}
              >
                O projeto
              </a>
              <a
                href="#acervo"
                onClick={handleSectionLink("acervo", true)}
              >
                Acervo
              </a>
              <a
                href="#trilhas-de-ensino"
                onClick={handleSectionLink("trilhas-de-ensino", true)}
              >
                Trilhas de ensino
              </a>
            </nav>
          ) : null}
        </div>
      </header>

      <main id="conteudo-principal">
        <section className={styles.hero} aria-labelledby="titulo-principal">
          <img
            className={styles.heroImage}
            src={HERO_IMAGE_URL}
            alt="Vista do campus da UFSM em Santa Maria, com prédios, áreas verdes e morros ao fundo"
            width="1920"
            height="1280"
            fetchPriority="high"
            onError={handleImageError}
          />
          <div className={styles.heroOverlay} aria-hidden="true" />

          <div className={`${styles.container} ${styles.heroContent}`}>
            <h1 id="titulo-principal">Explore. Planeje. Ensine.</h1>
            <p className={styles.heroDescription}>
              O Informática Explorer organiza recursos e apoia a criação de trilhas de ensino
              fundamentadas na BNCC Computação e em materiais curados do Acervo.
            </p>
            <a
              className={styles.heroCta}
              href="#projeto"
              onClick={handleSectionLink("projeto")}
            >
              Conheça o projeto
              <ArrowDown aria-hidden="true" size={19} strokeWidth={2.2} />
            </a>
          </div>
        </section>

        <section
          className={styles.problemSection}
          id="projeto"
          aria-labelledby="titulo-problema"
        >
          <div className={`${styles.container} ${styles.problemContent}`}>
            <p className={styles.sectionKicker}>Por que o Informática Explorer?</p>
            <h2 id="titulo-problema">Direcionamento e praticidade</h2>
            <p>
              Recursos para o ensino de Computação estão espalhados por diferentes sites e
              descritos de formas pouco consistentes. Existem plataformas que buscam agrupar esses
              conteúdos, contudo nem sempre é fácil saber para qual contexto um material é adequado
              e como utilizá-lo em sala de aula. O Informática Explorer propõe uma forma de buscar
              recursos e combiná-los em trilhas de ensino contextualizadas, apoiando a decisão do
              docente sem substituí-la.
            </p>
          </div>
        </section>

        <section className={styles.catalogSection} id="acervo" aria-labelledby="titulo-acervo">
          <div className={`${styles.container} ${styles.splitLayout}`}>
            <figure className={styles.catalogMockup}>
              <figcaption className={styles.visuallyHidden}>
                Ilustração de um recurso organizado no acervo por turma e habilidade.
              </figcaption>
              <div className={styles.mockupToolbar} aria-hidden="true">
                <span />
                <span />
                <span />
                <div>Acervo</div>
              </div>
              <div className={styles.mockupBody} aria-hidden="true">
                <div className={styles.mockupSearch}>
                  <Search size={18} />
                  <span>Buscar recursos</span>
                </div>
                <div className={styles.mockupFilters}>
                  <span>Turma: 7º ano</span>
                  <span>Habilidade: EF07CO09</span>
                </div>
                <article className={styles.mockupCard}>
                  <img src={RESOURCE_PLACEHOLDER_URL} alt="" width="640" height="360" />
                  <div>
                    <span className={styles.mockupType}>Jogo educativo</span>
                    <strong>Cyberbullying</strong>
                    <small>Cultura Digital · 7º ano</small>
                  </div>
                </article>
              </div>
            </figure>

            <div className={styles.catalogCopy}>
              <h2 id="titulo-acervo">Recursos em um só lugar, com contexto para usar</h2>
              <p>
                Mais do que reunir referências, a plataforma organiza informações que ajudam o
                docente a avaliar quando e como cada recurso pode contribuir com a aula.
              </p>
              <ul className={styles.featureList}>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Referências externas e materiais autorizados centralizados.
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Organização e filtragem por habilidade, competência, eixo e ano.
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Direcionamento para abordagem de aula de forma contextualizada.
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Pastas de organização para manutenção de materiais e trilhas futuras.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className={styles.futureSection}
          id="trilhas-de-ensino"
          aria-labelledby="titulo-trilhas"
        >
          <div className={`${styles.container} ${styles.futureLayout}`}>
            <div className={styles.futureVisual} aria-hidden="true">
              <div className={styles.orbit} />
              <div className={styles.futureCore}>
                <BookOpenCheck size={38} strokeWidth={1.7} />
                <strong>Trilha de ensino</strong>
                <span>com base curada</span>
              </div>
              <span className={`${styles.contextNode} ${styles.contextNodeTop}`}>
                Objetivo
              </span>
              <span className={`${styles.contextNode} ${styles.contextNodeRight}`}>Materiais</span>
              <span className={`${styles.contextNode} ${styles.contextNodeBottom}`}>
                Ações
              </span>
              <span className={`${styles.contextNode} ${styles.contextNodeLeft}`}>
                Ano escolar
              </span>
            </div>

            <div className={styles.futureCopy}>
              <h2 id="titulo-trilhas">Trilhas construídas a partir do Acervo</h2>
              <p>
                O docente informa o ano e o que deseja ensinar, conhece o objetivo de cada
                recurso, o que os estudantes efetivamente farão e os materiais necessários.
                Depois, seleciona os recursos que contribuam para o objetivo e acompanha a
                trilha em criação, preservando sua decisão pedagógica.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div className={styles.footerIntro}>
            <div className={styles.footerBrand}>
              <img
                src={publicAsset("branding/informatica-explorer-logo.png")}
                alt=""
                width="42"
                height="42"
              />
              <strong>Informática Explorer</strong>
            </div>
            <p>Recursos e planejamento contextualizado para o ensino de Computação.</p>
          </div>

          <nav className={styles.footerNav} aria-label="Navegação do rodapé">
            <a href="#projeto" onClick={handleSectionLink("projeto")}>O projeto</a>
            <a href="#acervo" onClick={handleSectionLink("acervo")}>Acervo</a>
            <Link to="/app/acervo" onClick={signIn}>Entrar</Link>
          </nav>

          <div className={styles.footerMeta}>
            <p>Protótipo desenvolvido como Trabalho de Conclusão de Curso.</p>
            <p className={styles.photoCredit}>
              Foto do campus da UFSM por{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:UFSM.2014.034.017.Campus-Santa-Maria-Filippe-Richardt.jpg"
              >
                Fillipe Richardt
              </a>{" "}
              ·{" "}
              <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br" rel="license">
                CC0 1.0
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
