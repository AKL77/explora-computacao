# Tipos de material

Referência: 2 de novembro de 2026; catálogo com 48 materiais.

O filtro **Tipo de material** substitui a seleção direta de abordagens em
**Buscar Materiais**. **Ver opções** abre uma janela com seleção múltipla:

| Grupo organizador | Tipos selecionáveis |
| --- | --- |
| Abordagem ativa | Jogos; Atividades e exercícios; Livros e livros-jogo; Tutoriais e projetos |
| Abordagem expositiva | Vídeos; Apresentações e slides; Textos e guias; Cartazes e linhas do tempo |

Os grupos são títulos, não filtros adicionais. Um livro pode integrar uma
proposta de abordagem combinada; selecioná-lo não restringe a busca à abordagem
ativa. O formato plugado/desplugado permanece independente.

Selecionar vários tipos encontra materiais de **qualquer um** deles. Os demais
filtros e a pesquisa restringem esse conjunto. Cada cadastro aparece uma vez,
mesmo quando corresponde a vários tipos. A seleção permanece ao fechar a janela;
**Limpar tipos** remove somente os tipos e **Limpar filtros** remove todos os filtros.

## Critérios e manutenção

`src/domain/materialType.ts` define as opções, os grupos e a compatibilidade com
o tipo anterior. `src/data/materialTypes.ts` registra as classificações
complementares. A composição em `resources.mock.ts` aplica a classificação aos
48 cadastros. Novos materiais podem declarar `materialTypes` diretamente; o
campo `type` permanece por compatibilidade com os metadados pedagógicos existentes.

A classificação descreve componentes efetivamente oferecidos no material,
independentemente da extensão do arquivo. Um PDF pode ser livro, cartaz ou
apresentação. Links de instruções e referências, por si só, não acrescentam tipos.

- **Sertão.bit:** livro-jogo, jogo e atividades; **Aventuras Digitais:** livro e atividades.
- **Lua & Bit-Bit**, **Vinte Palpites**, **Batalha Naval**, **Jogo da Laranja** e
  **Desfragmentação:** atividades com jogos. Os vídeos de instruções da coleção
  Unicamp não tornam cada atividade um material do tipo vídeo.
- **Cyberbullying — Uma Brincadeira de Mau Gosto:** textos ilustrados e atividades.
- **Crachá — micro:bit:** tutorial/projeto e atividade; a existência do simulador
  como meio de execução não transforma a ficha em uma ferramenta separada.
- **Evolução da Computação:** cartaz/linha do tempo.
- **Guardião Cibernético:** apresentação e textos/guias complementares.
- **As fake news:** texto, atividades, apresentação e videoaula.
- **Tecnologia e vida humana:** apresentação, texto e atividades.
- Os demais cadastros mantêm o tipo já descrito na curadoria: jogos, atividades,
  vídeos ou texto/guia. A playlist NIC.br continua sendo um único cadastro.

Os rótulos são compartilhados entre busca, detalhe, trilhas e turmas. IDs,
alinhamentos curriculares, fontes e materiais salvos não mudam. Não é necessária
migração do banco. Os testes verificam a cobertura do catálogo, a integridade
da taxonomia e a busca combinada sem duplicações.
