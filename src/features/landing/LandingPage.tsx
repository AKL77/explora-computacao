import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import {
  ArrowDown,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useSessionStore } from "@/store/useSessionStore";
import { isOnlineMode } from "@/lib/backend/config";
import { publicAsset } from "@/lib/publicAsset";

import styles from "./LandingPage.module.css";

const HERO_IMAGE_URL = publicAsset("images/hero-ufsm-campus-santa-maria.jpg");
const RESOURCE_PLACEHOLDER_URL = publicAsset("branding/resource-placeholder-explora.svg");
const SEARCH_MATERIALS_PREVIEW_URL = publicAsset("images/interface/buscar-materiais.png");
const READY_TRAILS_PREVIEW_URL = publicAsset("images/interface/trilhas-prontas.png");
const CLASSROOMS_PREVIEW_URL = publicAsset("images/interface/minhas-turmas.png");

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  image.onerror = null;
  image.alt = "";
  image.src = RESOURCE_PLACEHOLDER_URL;
}

interface InterfacePreviewProps {
  className: string;
  title: string;
  src: string;
  alt: string;
}

function InterfacePreview({ className, title, src, alt }: InterfacePreviewProps) {
  return (
    <figure className={className}>
      <div className={styles.previewToolbar} aria-hidden="true">
        <span />
        <span />
        <span />
        <strong>{title}</strong>
      </div>
      <img
        className={styles.interfaceScreenshot}
        src={src}
        alt={alt}
        width="1440"
        height="960"
        loading="lazy"
        onError={handleImageError}
      />
    </figure>
  );
}

export function LandingPage() {
  useEffect(() => {
    document.title = "Explora Computação";
  }, []);
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
          <Link className={styles.brand} to="/" aria-label="Explora Computação — início">
            <img
              className={styles.brandMark}
              src={publicAsset("branding/explora-computacao-symbol.svg")}
              alt=""
              width="48"
              height="48"
            />
            <span className={styles.brandName}>Explora Computação</span>
          </Link>

          <nav className={styles.siteNav} aria-label="Navegação principal">
            <a href="#projeto" onClick={handleSectionLink("projeto")}>O projeto</a>
            <a href="#materiais" onClick={handleSectionLink("materiais")}>Materiais</a>
            <a
              href="#trilhas-de-ensino"
              onClick={handleSectionLink("trilhas-de-ensino")}
            >
              Trilhas de ensino
            </a>
            <a href="#turmas" onClick={handleSectionLink("turmas")}>Turmas</a>
          </nav>

          <div className={styles.accessActions}>
            <Link className={styles.studentAccessLink} to="/alunos">Acessar turma</Link>
            <Link className={styles.signInLink} to={isOnlineMode ? "/entrar" : "/app/trilha-de-ensino"} onClick={isOnlineMode ? undefined : signIn} aria-label="Área do professor">
              <span className={styles.teacherLabel}>Área do professor</span>
              <span className={styles.teacherLabelCompact}>Professor</span>
            </Link>
          </div>

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
                href="#materiais"
                onClick={handleSectionLink("materiais", true)}
              >
                Materiais
              </a>
              <a
                href="#trilhas-de-ensino"
                onClick={handleSectionLink("trilhas-de-ensino", true)}
              >
                Trilhas de ensino
              </a>
              <a href="#turmas" onClick={handleSectionLink("turmas", true)}>Turmas</a>
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
              Um espaço para encontrar ideias e preparar aulas de Computação do 4º ao
              9º ano. Explore os materiais e reúna atividades em uma sequência pensada
              para a sua turma.
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
            <p className={styles.sectionKicker}>Por que o Explora Computação?</p>
            <h2 id="titulo-problema">Materiais e trilhas para o seu planejamento</h2>
            <p>
              Encontrar um material é apenas uma parte do planejamento. Também é preciso
              conhecer o que ele ensina, como pode ser usado e o que a escola precisa para
              realizar a atividade. O Explora Computação reúne essas informações e relaciona
              os materiais às habilidades da BNCC Computação, facilitando a escolha e a
              organização de sequências de ensino.
            </p>
          </div>
        </section>

        <section className={styles.catalogSection} id="materiais" aria-labelledby="titulo-materiais">
          <div className={`${styles.container} ${styles.splitLayout}`}>
            <InterfacePreview
              className={styles.catalogMockup}
              title="Buscar Materiais"
              src={SEARCH_MATERIALS_PREVIEW_URL}
              alt="Prévia da tela Buscar Materiais, com busca, filtros e materiais disponíveis."
            />

            <div className={styles.catalogCopy}>
              <h2 id="titulo-materiais">Encontre materiais e conheça suas possibilidades</h2>
              <p>
                Cada ficha reúne várias informações para você conhecer o material e
                entender como ele pode contribuir com suas aulas.
              </p>
              <ul className={styles.featureList}>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Filtros por ano escolar, assunto, habilidade da BNCC, tipo e formato.
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Jogos, atividades, vídeos, textos e guias para diferentes abordagens.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className={`${styles.showcaseSection} ${styles.trailsSection}`}
          id="trilhas-de-ensino"
          aria-labelledby="titulo-trilhas"
        >
          <div className={`${styles.container} ${styles.showcaseLayout}`}>
            <InterfacePreview
              className={styles.showcaseVisual}
              title="Trilhas Prontas"
              src={READY_TRAILS_PREVIEW_URL}
              alt="Prévia da tela Trilhas Prontas, com filtros por eixo e percursos disponíveis."
            />

            <div className={styles.showcaseCopy}>
              <h2 id="titulo-trilhas">Trilhas de ensino</h2>
              <p>
                As Trilhas Prontas reúnem atividades em torno de um tema e mostram como
                diferentes materiais podem se complementar ao longo das aulas. Elas
                oferecem um ponto de partida para o planejamento.
              </p>
              <p>
                Em Minhas Trilhas, você pode adaptar uma proposta pronta ou criar sua
                própria sequência. Escolha os materiais, organize as etapas e ajuste a
                duração de acordo com o que quer ensinar e o tempo disponível.
              </p>
            </div>
          </div>
        </section>

        <section
          className={`${styles.showcaseSection} ${styles.classroomsSection}`}
          id="turmas"
          aria-labelledby="titulo-turmas"
        >
          <div className={`${styles.container} ${styles.showcaseLayout}`}>
            <div className={styles.showcaseCopy}>
              <h2 id="titulo-turmas">Turmas</h2>
              <p>
                Em Minhas Turmas, reúna os materiais de cada turma, acrescente
                orientações e escolha o que os alunos podem ver.
              </p>
            </div>
            <InterfacePreview
              className={styles.showcaseVisual}
              title="Minhas Turmas"
              src={CLASSROOMS_PREVIEW_URL}
              alt="Prévia de uma turma de demonstração, com código de acesso e materiais da aula."
            />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div className={styles.footerIntro}>
            <div className={styles.footerBrand}>
              <img
                src={publicAsset("branding/explora-computacao-symbol.svg")}
                alt=""
                width="42"
                height="42"
              />
              <strong>Explora Computação</strong>
            </div>
            <p>Materiais, trilhas de ensino e turmas para explorar a Computação na escola.</p>
          </div>

          <nav className={styles.footerNav} aria-label="Navegação do rodapé">
            <Link to="/alunos">Acessar turma</Link>
            <Link to={isOnlineMode ? "/entrar" : "/app/trilha-de-ensino"} onClick={isOnlineMode ? undefined : signIn}>Área do professor</Link>
            <Link to="/privacidade">Privacidade e preferências</Link>
          </nav>

          <div className={styles.footerMeta}>
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
