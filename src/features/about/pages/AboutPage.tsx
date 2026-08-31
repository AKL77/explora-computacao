import {
  ArrowRight,
  BookOpenCheck,
  FolderHeart,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./AboutPage.module.css";

const questions = [
  {
    question: "O que é o Informática Explorer?",
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
      "Acesse o Acervo para pesquisar pelo nome ou tema do recurso. Quando precisar reduzir os resultados, aplique os filtros disponíveis. Abra um card para consultar informações pedagógicas e operacionais antes de utilizar o material.",
  },
  {
    question: "Como funcionam os favoritos?",
    answer:
      "Clique no coração de um recurso para marcá-lo como favorito. O coração preenchido indica que ele foi salvo. Todos os itens marcados ficam reunidos automaticamente em Favoritos, dentro de Meus Materiais.",
  },
  {
    question: "Para que servem os Meus Materiais?",
    answer:
      "Essa área permite separar recursos em coleções próprias — por exemplo, por turma, escola, tema ou sequência de aulas. Assim, materiais úteis podem ser reencontrados sem refazer toda a busca no Acervo.",
  },
  {
    question: "Como crio um plano de aula?",
    answer:
      "Em Criar Plano de Aula, informe o tema, o ano escolar, a quantidade de aulas e a habilidade. Depois, escolha um material alinhado do Acervo e revise o objetivo. A proposta pode ser lida nas visualizações Em Blocos ou Descritivo, salva em Meus Planos de Aula e baixada como PDF. Nesta versão, não há IA nem geração de alternativas.",
  },
  {
    question: "Posso incluir novos recursos no Acervo?",
    answer:
      "Não. Os usuários podem consultar, favoritar e organizar os materiais disponíveis.",
  },
] as const;

export function AboutPage() {
  return (
    <article className={styles.page} aria-labelledby="about-page-title">
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Conheça o projeto</p>
          <h1 id="about-page-title">Sobre o Informática Explorer</h1>
          <p className={styles.lead}>
            Uma plataforma para aproximar recursos educacionais, currículo e realidade escolar,
            facilitando o ensino de Computação sem retirar do docente a decisão pedagógica.
          </p>
          <Link className={styles.primaryLink} to="/app/acervo">
            Explorar o Acervo
            <ArrowRight aria-hidden="true" size={19} />
          </Link>
        </div>

        <div className={styles.heroIllustration} aria-hidden="true">
          <span className={styles.illustrationBook}>
            <BookOpenCheck />
          </span>
          <span className={styles.illustrationHeart}>
            <Heart />
          </span>
          <span className={styles.illustrationFolder}>
            <FolderHeart />
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
            sempre apresentam informações suficientes para orientar sua escolha. O Informática
            Explorer reúne referências externas e materiais autorizados, relacionando-os a
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
          <FolderHeart size={42} />
        </div>
        <div className={styles.organizeContent}>
          <p className={styles.sectionLabel}>Favoritos e coleções</p>
          <h2 id="organize-title">Guarde o que faz sentido para o seu contexto</h2>
          <p>
            Use o coração para reunir rapidamente os recursos que chamaram sua atenção. Em Meus
            Materiais, crie coleções para organizar esses itens por turma, escola, tema ou
            planejamento futuro. Favoritar não altera o Acervo: apenas cria um atalho pessoal para
            você reencontrar o material.
          </p>
          <Link className={styles.secondaryLink} to="/app/pastas">
            Acessar Meus Materiais
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Dúvidas frequentes</p>
          <h2 id="faq-title">Perguntas e respostas</h2>
          <p>Orientações rápidas para aproveitar os recursos disponíveis nesta versão.</p>
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
