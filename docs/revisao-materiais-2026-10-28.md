# Revisão dos textos e da consistência dos materiais

Revisão solicitada pelo autor em 28 de outubro de 2026. A autorização foi
encurtar **O que farão e como** e **Materiais**; os outros problemas devem
ser informados, sem correção automática.

## Ajuste realizado

Foram comparados os 48 cadastros e seus metadados usados na busca e nas
trilhas. As atividades antigas geralmente tinham entre 25 e 45 palavras;
a playlist nova tinha 104. As listas novas ainda repetiam equipamentos,
pois juntavam materiais didáticos, dispositivos e acesso à Internet.

Foram preparadas apresentações breves para os dez cadastros recentes,
além de encurtar a atividade do jogo Cyberbullying/ALT+INOVARE e a lista
de materiais de Crachá. São 12 apresentações alteradas. Não há corte
automático de frases nem ocultação por reticências.

| Exemplo | O que farão e como, antes → depois | Materiais, antes → depois |
|---|---|---|
| Playlist NIC.br | 652 → 199 caracteres | 5 → 3 itens |
| Tecnologia e vida humana | 532 → 218 caracteres | 4 → 3 itens |
| Vídeo sobre memória | 532 → 177 caracteres | 4 → 2 itens |
| As fake news | 469 → 198 caracteres | 6 → 3 itens |
| Compute It | 454 → 254 caracteres | 2 → 1 item |

Os textos curtos descrevem a ação dos estudantes e a forma de trabalho.
Os materiais mantêm o preparo necessário, as opções de impressão e os
componentes indispensáveis, sem repetir a explicação da ficha. A nota de
que Ada Lovelace foi colaboradora de Babbage foi preservada na apresentação
de Evolução da Computação.

A comparação de snapshots antes/depois confirmou que **os 48 objetos
originais dos recursos ficaram idênticos**. Nos metadados de apresentação,
mudaram somente `studentActivity` e `materials`. Objetivos, anos, formatos,
classificações, fontes, licenças, idiomas, habilidades, complementos e
roteiros completos não foram alterados.

## Correções autorizadas após a revisão

O autor autorizou corrigir somente os itens 1 e 3 abaixo e pediu manter os
demais como estão. A busca e as propostas agora usam os anos do cadastro:
Blockly Games no 4º e 5º; Vinte Palpites no 4º, 5º e 8º, preservando a
indicação de extensão para o 8º. A lista duplicada de anos do piloto foi
removida. A abordagem combinada de Sertão.bit agora corresponde à seleção
de ativa, expositiva ou ambas. As descrições abaixo registram o diagnóstico
original; os demais problemas continuam sem alteração.

## Problemas encontrados na revisão

### 1. Anos diferentes na ficha e na busca — corrigido

- **Blockly Games:** o cadastro e a ficha informam 4º e 5º anos, mas a camada
  usada pela busca e pelas propostas mantém somente 5º. Com o filtro de 4º
  ano, o jogo deixa de aparecer.
- **Vinte Palpites:** o cadastro contempla 4º, 5º e uma extensão curatorial
  no 8º; a busca e as propostas usam somente 5º. As alternativas de 4º e
  8º não aparecem nesse filtro. A indicação original da Unicamp é
  [Anos Iniciais](https://desplugada.ime.unicamp.br/atividade5/index.html),
  e a extensão de 8º já está explicada no cadastro.

Causa localizada: os três registros antigos do piloto substituem todos os
metadados inferidos; dois ainda conservam uma lista restrita de anos. O
ajuste editorial novo substitui somente os dois campos de texto pedidos.

### 2. Recursos com atividade digital classificados como desplugados

- **Cyberbullying — Uma Brincadeira de Mau Gosto:** a própria proposta
  termina com criação de narrativa ou animação no Scratch, e a lista
  prevê computador para a terceira aula. Mesmo assim, a classificação
  calculada é desplugada. [Fonte e sequência didática](https://www.falecomrozelma.com/cyberbullying).
- **Aventuras Digitais:** tanto a descrição local quanto a
  [página da autora](https://www.falecomrozelma.com/aventurasdigitais)
  dizem que há atividades plugadas e desplugadas, mas a busca classifica
  o conjunto apenas como desplugado.
- **Tecnologia e vida humana** aparece também no filtro de desplugados,
  embora o uso expositivo cadastrado peça leitor de PowerPoint e projetor.
  Há uma atividade impressa complementar; é necessário decidir se essa
  alternativa justifica classificar o conjunto como misto.

A classificação atual depende de campos de requisitos, alguns ausentes;
ela não interpreta o texto que menciona o uso de Scratch ou de computador.

### 3. Abordagem combinada desaparece ao filtrar — corrigido

**Sertão.bit** aparece sem filtros e está classificado como abordagem
combinada. Ao selecionar ativa, expositiva ou as duas juntas, a condição
atual da busca exclui os registros combinados. Assim, o material desaparece
mesmo quando o docente seleciona as duas abordagens.

### 4. Termos de busca inconsistentes em materiais do piloto

Os três registros do piloto também substituem a lista de termos de busca.
Por isso, **Vinte Palpites** não acompanha os demais materiais quando se
pesquisa o fornecedor **Unicamp**, e **Blockly Games** não aparece ao
pesquisar **Google**, embora esse seja seu fornecedor cadastrado.

### 5. Botões sobrepostos ao texto em largura intermediária

Na inspeção visual em aproximadamente **1265 pixels de largura**, os botões
Nova trilha/Trilha existente avançam sobre o texto dos cartões. Os mínimos
de largura das colunas de imagem, título e descrição não deixam espaço
suficiente para as ações. A redução editorial não elimina esse problema
de layout; ele foi registrado e o CSS permaneceu inalterado.

### 6. Idioma pouco visível

O campo de idioma existe nos cadastros, mas não é exibido como informação
própria na ficha ou no cartão da busca. Algumas descrições adicionais
explicam o idioma, mas isso exige abrir e ler o texto completo.

Isso importa especialmente para **Lightbot**, cadastrado como inglês,
alemão e francês, sem português; e **IA para os Oceanos**, cujo plano
docente consultado está em inglês. Compute It continua com o acesso
`?lang=pt` preservado. Não se alteraram links ou declarações de idioma.

### 7. Erro histórico já conhecido no arquivo de Evolução da Computação

O PDF original ainda apresenta Ada Lovelace como esposa de Charles Babbage.
Ela foi sua colaboradora; a parceria é descrita pelo
[Computer History Museum](https://computerhistory.org/events/thinking-bigada-lovelace-mathematician-visionary/).
O aviso já existia na ficha e continua no texto breve. Este não é um erro
novo introduzido pelo resumo; é um problema do arquivo original, mantido
externo e sem edição.

## Pontos para avaliação, sem afirmar erro confirmado

- **Formato dos slides:** Guardião Cibernético e Tecnologia e vida humana
  aparecem como Texto, pois o modelo ainda não tem um tipo Apresentação.
  É uma limitação da classificação, não perda dos anexos.
- **Cobertura curricular:** vários materiais são recomendados para mais
  anos do que os que têm vínculos específicos à BNCC. Por exemplo, o vídeo
  Memória aparece para 6º–9º, mas seu vínculo cadastrado é apenas ao 6º e
  parcial: explica armazenamento, sem ensinar todos os procedimentos de
  manipulação e compactação de arquivos. O vídeo de História tem vínculo
  parcial ao 9º, dependente da discussão sobre impactos atuais. Os textos
  já sinalizam esses limites; não se acrescentaram vínculos artificiais.
- **Validação pendente:** os 48 registros ainda têm avaliação de
  acessibilidade pendente, e 11 não têm licença preenchida. Isso não é
  prova de inacessibilidade ou impedimento de acesso; significa que esses
  aspectos não estão integralmente verificados. Não foram preenchidos por
  suposição.

## Limites da revisão

A consistência foi examinada nos 48 cadastros e nas regras de apresentação,
busca e propostas. Foram consultadas fontes primárias selecionadas para os
achados acima, além dos arquivos já preservados na curadoria. Não se trata
de nova leitura integral de todos os livros, vídeos e atividades nem de
revalidação de cada link ou afirmação de todos os materiais.

Nenhum dos problemas desta seção foi corrigido nesta etapa. A alteração
autorizada permanece local, sem commit, envio ou publicação.

## Verificação do ajuste editorial

- Typecheck, lint dos fontes (sem os arquivos temporários de pesquisa) e
  build aprovados.
- Foram cobertos os 84 testes unitários. Na primeira execução, 83 passaram
  e um ainda esperava a frase antiga de Compute It. Essa expectativa
  editorial foi atualizada, e o teste afetado passou na reexecução.
- Os 32 testes de navegação em computador e celular passaram, incluindo
  busca, fichas, complementos e propostas de trilhas salvas.
- A inspeção no navegador confirmou a busca Unicamp com 22 itens, a
  ausência de Blockly no filtro de 4º ano e a ausência de Sertão.bit com
  ambas as abordagens selecionadas. Esses problemas continuam presentes.
- A suíte não detecta a sobreposição visual dos botões: passar nos testes
  de navegação não significa que esse problema de layout foi resolvido.
