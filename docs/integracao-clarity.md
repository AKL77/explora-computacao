# Integração com Microsoft Clarity

**Referência:** 27 de outubro de 2026.

**Estado:** integração incluída na versão 0.2.0, com autorização explícita do
autor e ID público `z4honwtjtg`. A publicação do conjunto das alterações foi
solicitada pelo autor em 27 de outubro de 2026. A coleta depende da aceitação de
cada visitante; a chegada de dados e o mascaramento no painel precisam ser
conferidos no projeto do Clarity após a publicação.

## Finalidade no Explora Computação

Observar a navegação dos docentes para avaliar a usabilidade da busca, da
consulta aos materiais e da criação de trilhas. Mapas de calor mostram padrões
de cliques e rolagem. As reconstituições de sessão representam interações na
página; não usam câmera ou microfone. Esses indicadores não medem aprendizagem
nem substituem uma avaliação com participantes.

## Funcionamento sem autenticação

O Clarity pode associar interações a identificadores pseudônimos do navegador
armazenados em cookies. A sessão local demonstrativa do Explora permanece
independente desses identificadores. O visitante não precisa de conta.

Navegadores e dispositivos diferentes podem aparecer como visitantes distintos.
Limpar ou bloquear cookies limita a continuidade das sessões. O responsável
pelo site precisa de uma conta no painel do Clarity para consultar relatórios.

## Dados e destino da integração

| Categoria | Uso previsto |
|---|---|
| Cliques, rolagem e navegação | Mapas de calor e reconstituições de uso |
| Estrutura e conteúdo visível da página | Reconstrução das telas, com mascaramento dos conteúdos pessoais |
| Dados técnicos do navegador, dispositivo e conexão | Contexto técnico das sessões processadas pela Microsoft |
| Eventos personalizados | Tipos de ação, sem texto livre ou identificação pessoal |

O destino é o serviço Microsoft Clarity. O carregador oficial usa
`https://www.clarity.ms/tag/z4honwtjtg`; a coleta usa infraestrutura da
Microsoft. Dados já enviados seguem as regras de retenção e privacidade do
serviço, mesmo após uma recusa posterior.

## Comportamento implementado

1. Ativar a integração somente em builds de produção com ID de projeto válido.
   Não inserir ID fictício nem carregar o serviço durante o desenvolvimento.
2. Exibir uma escolha clara entre **Aceitar análise** e **Recusar análise**.
   Antes da aceitação, não baixar o rastreador nem enviar interações ao Clarity.
3. Armazenar a escolha neste navegador e oferecer uma página pública de
   **Privacidade e preferências**, acessível também sem sessão demonstrativa.
4. Enviar o consentimento de análise pela API `consentv2`, mantendo negado o
   consentimento para armazenamento de publicidade.
5. Ao revogar, comunicar a recusa e recarregar a página para interromper também
   scripts pendentes ou reinícios do SDK. A mudança é sincronizada com outras
   abas. Trilhas salvas permanecem; rascunhos ainda não salvos podem ser perdidos.
   Se uma aceitação antiga não puder ser sobrescrita, `analytics=off` na URL
   conserva a recusa após o recarregamento. Uma nova aceitação remove essa marca.
6. Mascarar nomes e objetivos de trilhas, mensagens que repetem esses textos e
   campos digitados. Não enviar nomes, e-mails, buscas ou conteúdo de trilhas
   em eventos personalizados.
7. Etiquetar as áreas visitadas com valores fixos, pois a aplicação usa
   `HashRouter`. Não tratar eventos dessas áreas como visualizações nativas
   separadas de página sem verificar o comportamento no painel.
8. Usar o projeto `z4honwtjtg` por padrão no build, inclusive no GitHub Pages.
   `VITE_CLARITY_PROJECT_ID` permite substituí-lo; um valor vazio ou inválido
   desativa a análise. A página `/privacidade` explica a coleta e suas preferências.

Eventos implementados: `material_selecionado`, `trilha_criada`,
`material_adicionado_trilha`, `trilha_atualizada`, `trilha_pronta_adicionada` e
`fonte_material_aberta`. Os eventos de salvamento e cópia são emitidos somente
após sucesso. Visitas usam a tag `pagina` e eventos `pagina_<area>` com valores
fixos, sem identificação pessoal, consultas ou nomes de trilhas.

## Publicação e verificação

- O projeto no painel já foi criado para a URL publicada do Explora.
- Configurar o modo de consentimento e o mascaramento no painel; o público
  desta integração é o de docentes adultos.
- O ID de instalação já está no código e é público; não é uma senha.
- Verificar que não há carregamento ou coleta antes da aceitação e após recusa.
- Verificar aceitação persistida, revogação, mudanças em outra aba e navegação
  pelas rotas com `#`, sem duplicar a instalação.
- Conferir no painel a chegada de sessões e o mascaramento antes de considerar
  a integração validada em produção.

Os testes automatizados de interface interceptam as solicitações ao serviço,
evitando enviar navegação de testes para o projeto real.

## Referências oficiais

- [Visão geral do Clarity](https://clarity.microsoft.com/)
- [Perguntas frequentes e reconstituições](https://learn.microsoft.com/en-us/clarity/faq/)
- [Cookies e identificadores](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies)
- [Instalação e público permitido](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)
- [Consentimento V2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2)
- [Mascaramento](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)
- [Privacidade do serviço](https://clarity.microsoft.com/privacy)
