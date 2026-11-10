import {
  ArrowRight,
  BookOpenCheck,
  Search,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";
import { WorkspacePage } from "@/components/layout/WorkspacePage";

import styles from "./AboutPage.module.css";
import { isOnlineMode } from "@/lib/backend/config";

const questions = [
  {
    question: "Para quem a plataforma foi criada?",
    answer:
      "Para professores que trabalham conteúdos de Computação do 4º ao 9º ano do Ensino Fundamental. A plataforma reúne opções para diferentes conhecimentos prévios e condições de infraestrutura, incluindo atividades com e sem computador.",
  },
  {
    question: "Como encontro um material adequado?",
    answer:
      "Em Buscar Materiais, pesquise por nome, assunto ou habilidade e refine os resultados por ano escolar, assunto, habilidade da BNCC, tipo e formato. Abra a ficha para consultar o objetivo, a proposta de atividade, a familiaridade indicada, os recursos necessários e o link de acesso.",
  },
  {
    question: "Como os materiais se relacionam com a BNCC Computação?",
    answer:
      "As fichas identificam habilidades da BNCC Computação relacionadas à proposta de uso de cada material, com código, descrição e ano escolar. Essas relações orientam a busca e o planejamento. As Trilhas Prontas são organizadas pelos três eixos: Pensamento Computacional, Mundo Digital e Cultura Digital.",
  },
  {
    question: "Preciso de computadores ou internet para usar os materiais?",
    answer:
      "Depende da atividade. Há materiais plugados, que usam dispositivos digitais, e desplugados, que podem envolver papel, cartões, jogos e dinâmicas. O filtro Formato ajuda a encontrar essas opções. Confira na ficha a necessidade de internet, impressão, equipamentos ou preparação prévia; mesmo uma atividade desplugada pode exigir baixar o material antes da aula.",
  },
  {
    question: "O que significam os níveis Básico, Intermediário e Avançado?",
    answer:
      "Eles indicam a familiaridade recomendada para usar o material, avaliada separadamente para aluno e professor. Para o aluno, Básico introduz o assunto; Intermediário pressupõe contato com as ideias principais; Avançado envolve conceitos ou estratégias mais complexas. Para o professor, Básico permite conduzir a proposta com as orientações do material; Intermediário pede familiaridade com o tema para explicar e adaptar a atividade; Avançado exige conhecimento mais aprofundado. A classificação é uma orientação da curadoria sobre a proposta apresentada, não uma medida da capacidade de cada pessoa nem um equivalente ao ano escolar. Em coleções, o nível considera a atividade inicial e pode variar nas seguintes.",
  },
  {
    question: "O que são as Trilhas Prontas?",
    answer:
      "São sequências pedagógicas preparadas com materiais do acervo, organizadas por eixo da BNCC Computação, ano escolar e objetivo de aprendizagem. Você pode consultar as etapas e adicionar uma cópia a Minhas Trilhas para alterar o nome, o objetivo, os materiais, a ordem e a duração. A trilha pronta original continua disponível.",
  },
  {
    question: "Como crio uma trilha de ensino?",
    answer:
      "Acesse Minhas Trilhas e selecione Criar trilha. Escolha os materiais, informe um nome e um objetivo e salve a sequência. Depois, você pode incluir ou remover materiais, reorganizar etapas e ajustar a duração de cada uma entre uma, duas ou três aulas de 50 minutos. Em Buscar Materiais, também é possível adicionar um recurso a uma trilha que você já criou.",
  },
  {
    question: "Como compartilho materiais e trilhas com uma turma?",
    answer:
      "Crie uma turma em Minhas Turmas. Dentro dela, adicione materiais do acervo ou uma trilha de Minhas Trilhas. Também há atalhos Adicionar à turma na ficha do material e em Minhas Trilhas. Você pode organizar os itens, incluir orientações e controlar o que fica visível para os alunos.",
  },
  {
    question: "As alterações em uma trilha aparecem automaticamente na turma?",
    answer:
      "A turma recebe uma cópia da trilha no momento do compartilhamento. Se você editar a original em Minhas Trilhas, use Atualizar cópia na turma para aplicar as mudanças. Assim, é possível preparar alterações antes de disponibilizá-las aos alunos.",
  },
  {
    question: "Os alunos precisam criar uma conta?",
    answer:
      "Não. Eles abrem Acessar turma e digitam o código informado pelo professor para consultar os materiais e as trilhas visíveis. Arquivar a turma interrompe esse acesso; desarquivá-la reativa o mesmo código. Excluir a turma encerra o acesso definitivamente. Alguns materiais levam a sites externos, que podem ter requisitos próprios.",
  },
  {
    question: "Onde ficam salvas minhas turmas e trilhas?",
    answer: isOnlineMode
      ? "Suas turmas e trilhas ficam vinculadas à conta usada para entrar na Área do professor. Você pode continuar o planejamento em outro dispositivo ao entrar com a mesma conta."
      : "Nesta demonstração, suas turmas e trilhas ficam salvas apenas neste navegador. Elas não são transferidas para outro dispositivo nem para uma conta online. O acesso compartilhado entre dispositivos está disponível na versão conectada à conta do professor.",
  },
  {
    question: "A plataforma usa inteligência artificial para gerar trilhas?",
    answer:
      "A plataforma não gera conteúdo por IA durante o uso. A IA generativa foi utilizada na preparação do projeto para apoiar a seleção e a organização de informações dos materiais e a elaboração das Trilhas Prontas, com revisão antes da inclusão. Na interface, você trabalha com o acervo disponível para criar e editar suas sequências.",
  },
  {
    question: "Posso incluir novos materiais na plataforma?",
    answer:
      "Não nesta versão. Os materiais disponíveis são selecionados previamente. Você pode consultá-los, combiná-los em trilhas e compartilhá-los com suas turmas, mas ainda não há cadastro de materiais próprios.",
  },
] as const;

export function AboutPage() {
  return (
    <WorkspacePage as="article" title="Sobre o Explora Computação" eyebrow="Conheça o projeto" titleId="about-page-title" contentClassName={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.lead}>
            Um espaço para ajudar você a ensinar Computação na escola. Aqui, você
            encontra materiais, descobre como usá-los e organiza atividades em uma
            sequência de aprendizagem para a sua turma.
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
      </div>

      <section className={styles.purpose} aria-labelledby="purpose-title">
        <div>
          <p className={styles.sectionLabel}>Propósito</p>
          <h2 id="purpose-title">Da descoberta à aplicação em sala de aula</h2>
        </div>
        <div className={styles.purposeCopy}>
          <p>
            O Explora Computação é um protótipo desenvolvido por Augusto Lunardi como
            Trabalho de Conclusão de Curso, em colaboração com o Núcleo de Tecnologia
            Educacional Municipal de Santa Maria (NTEM). O projeto busca facilitar a
            descoberta, a compreensão e a organização de materiais para o ensino de
            Computação no Ensino Fundamental.
          </p>
          <p>
            Cada ficha reúne várias informações para ajudar você a conhecer o material
            e entender como ele pode contribuir com suas aulas.
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
            As Trilhas Prontas são sequências de atividades que conectam materiais em
            torno de um tema e de um objetivo de aprendizagem. Elas oferecem um ponto
            de partida para o planejamento e mostram como diferentes recursos podem
            se complementar ao longo das aulas.
          </p>
          <p>
            Já as trilhas personalizadas reúnem os materiais que você escolhe em um
            percurso pensado para a sua turma. Elas ajudam a organizar o que será
            trabalhado, em que ordem e por quanto tempo, de acordo com os objetivos
            das aulas.
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
    </WorkspacePage>
  );
}
