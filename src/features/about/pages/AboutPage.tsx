import {
  ArrowRight,
  BookOpenCheck,
  Search,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./AboutPage.module.css";

const questions = [
  {
    question: "O que é o Explora Computação?",
    answer:
      "É uma plataforma de apoio a docentes que organiza referências e materiais para o ensino de Computação na Educação Básica. O objetivo é facilitar a descoberta, a compreensão e a organização de recursos relacionados à BNCC Computação.",
  },
  {
    question: "Para quem a plataforma foi criada?",
    answer:
      "O público principal são docentes que trabalham conteúdos de Computação do 4º ao 9º ano do Ensino Fundamental. As informações apresentadas devem apoiar a análise do professor, que continua responsável por adaptar cada proposta à sua turma.",
  },
  {
    question: "Como encontro um material adequado?",
    answer:
      "Acesse Buscar Materiais para pesquisar por nome, tema ou habilidade. Use os filtros para reduzir os resultados e abra um cartão para consultar as informações pedagógicas e operacionais.",
  },
  {
    question: "O que significam os níveis Básico, Intermediário e Avançado?",
    answer:
      "Eles indicam a familiaridade recomendada para usar o material, avaliada separadamente para aluno e professor. Para o aluno, Básico significa que a atividade introduz o assunto; Intermediário, que ajuda já conhecer as ideias principais; Avançado, que a atividade trabalha conceitos ou estratégias mais complexas. Para o professor, Básico significa que pode conduzir a proposta com as orientações do material; Intermediário, que convém ter familiaridade com o tema para explicar e adaptar a atividade; Avançado, que a mediação exige domínio mais aprofundado. Os níveis são uma avaliação da curadoria sobre o uso apresentado no catálogo, não equivalem ao ano escolar nem medem a capacidade de cada pessoa. Em coleções com várias atividades, o nível considera a proposta inicial e pode variar nas etapas seguintes.",
  },
  {
    question: "O que são as Trilhas Prontas?",
    answer:
      "São percursos previamente organizados por conteúdo, ano escolar e objetivo de aprendizagem. Elas apresentam uma sequência pedagógica sugerida e permanecem separadas das trilhas criadas pelo docente.",
  },
  {
    question: "Onde ficam as trilhas que eu crio?",
    answer:
      "As sequências criadas em Buscar Materiais ficam em Minhas Trilhas. Nessa área é possível reorganizar etapas e ajustar a duração de cada material.",
  },
  {
    question: "Como crio uma trilha de ensino?",
    answer:
      "Em Buscar Materiais, pesquise uma área, assunto ou habilidade e refine os resultados com tags. Cada cartão mostra um objetivo breve, o que os estudantes farão e os materiais usados. Adicione os materiais a uma nova trilha e informe um nome para salvá-la.",
  },
  {
    question: "Posso incluir novos materiais na plataforma?",
    answer:
      "Não nesta versão. Os materiais disponíveis são selecionados previamente, e o docente pode consultá-los e usá-los para montar suas trilhas.",
  },
] as const;

export function AboutPage() {
  return (
    <article className={styles.page} aria-labelledby="about-page-title">
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Conheça o projeto</p>
          <h1 id="about-page-title">Sobre o Explora Computação</h1>
          <p className={styles.lead}>
            Uma plataforma para aproximar recursos educacionais, currículo e realidade escolar,
            facilitando o ensino de Computação sem retirar do docente a decisão pedagógica.
          </p>
          <Link className={styles.primaryLink} to="/app/trilha-de-ensino">
            Buscar Materiais
            <ArrowRight aria-hidden="true" size={19} />
          </Link>
        </div>

        <div className={styles.heroIllustration} aria-hidden="true">
          <span className={styles.illustrationBook}>
            <BookOpenCheck />
          </span>
          <span className={styles.illustrationHeart}>
            <Search />
          </span>
          <span className={styles.illustrationFolder}>
            <Waypoints />
          </span>
          <span className={styles.illustrationPath} />
        </div>
      </header>

      <section className={styles.purpose} aria-labelledby="purpose-title">
        <div>
          <p className={styles.sectionLabel}>Propósito</p>
          <h2 id="purpose-title">Da descoberta à aplicação em sala de aula</h2>
        </div>
        <div className={styles.purposeCopy}>
          <p>
            Recursos para o ensino de Computação estão distribuídos em diferentes sites e nem
            sempre apresentam informações suficientes para orientar sua escolha. O Explora
            Computação reúne referências externas e materiais autorizados, relacionando-os a
            informações curriculares, pedagógicas e práticas.
          </p>
          <p>
            A proposta é ajudar o docente a encontrar materiais e compreender como eles podem
            contribuir para determinada habilidade da BNCC Computação. Cada recurso deve ser
            analisado e adaptado conforme os objetivos, os conhecimentos da turma, o tempo e a
            infraestrutura disponível na escola.
          </p>
        </div>
      </section>

      <section className={styles.organize} aria-labelledby="organize-title">
        <div className={styles.organizeIcon} aria-hidden="true">
          <Waypoints size={42} />
        </div>
        <div className={styles.organizeContent}>
          <p className={styles.sectionLabel}>Duas formas de planejar</p>
          <h2 id="organize-title">Explore uma proposta pronta ou construa a sua</h2>
          <p>
            Trilhas Prontas reúne percursos organizados por conteúdo. Em Buscar Materiais, você
            escolhe os recursos e monta uma sequência própria, que permanece disponível em Minhas
            Trilhas para continuar o planejamento.
          </p>
          <Link className={styles.secondaryLink} to="/app/trilhas-prontas">
            Explorar Trilhas Prontas
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Dúvidas frequentes</p>
          <h2 id="faq-title">Perguntas e respostas</h2>
        </div>

        <div className={styles.questionList}>
          {questions.map(({ question, answer }) => (
            <details className={styles.question} key={question}>
              <summary>
                <span>{question}</span>
                <span className={styles.questionToggle} aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
