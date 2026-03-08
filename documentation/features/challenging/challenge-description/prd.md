# Challenge Description — PRD

## 1. Visão Geral

O **Challenge Description** é o painel principal de apresentação de um desafio na plataforma StarDust. Ele exibe o enunciado completo do desafio (em formato MDX), metadados relevantes (dificuldade, autor, estatísticas), e agrupa funcionalidades de interação como votação, controle administrativo e seleção de texto para o assistente de IA.

**Objetivo:** Fornecer ao estudante todas as informações necessárias para compreender e resolver um desafio de lógica de programação, além de permitir interações sociais (votação) e administrativas (gerenciamento do desafio) em um único painel coeso.

**Problema resolvido:** Sem uma tela estruturada de descrição, o usuário não teria clareza sobre o que o desafio exige, como deve formatar sua resposta (função vs. entrada), nem teria meios de avaliar ou gerenciar o desafio.

---

## 2. Requisitos

### REQ-01 Exibição da Descrição do Desafio

- [x] **Exibição da Descrição do Desafio**

**Descrição:** Renderização do enunciado completo do desafio em formato MDX, com alerta contextual que orienta o usuário sobre o formato esperado de resposta.

#### Regras de Negócio

- **Renderização MDX:** A descrição do desafio é renderizada como conteúdo MDX (Markdown estendido), suportando formatação rica, blocos de código, tabelas e componentes customizados.
- **Alerta contextual baseado no tipo de desafio:** Ao final da descrição, um componente `<Alert>` é adicionado automaticamente com instruções específicas:
  - **Desafio baseado em função:** O alerta orienta o usuário a retornar a resposta utilizando a função já presente no código inicial.
  - **Desafio baseado em entrada (`leia()`):** O alerta orienta o usuário a não remover nenhum comando `leia()` do código.
- **Detecção do tipo de desafio:** A distinção entre desafio baseado em função e desafio baseado em entrada é feita pelo LSP Provider, que analisa o código inicial do desafio para verificar a presença de uma função nomeada.
- **Cache de MDX:** O conteúdo MDX gerado (descrição + alerta) é armazenado no store para evitar reprocessamento ao navegar entre abas.

#### Regras de UI/UX

- **Loading:** Um componente de carregamento (spinner) é exibido enquanto o desafio não estiver disponível no store ou o MDX não tiver sido gerado.
- **Seleção de texto:** O conteúdo da descrição permite seleção de texto nativa (`select-text`), diferente do comportamento padrão da plataforma.
- **Responsividade:**
  - **Desktop:** A descrição é exibida em uma aba de conteúdo dentro de um sistema de painéis redimensionáveis.
  - **Mobile:** A descrição é exibida como o primeiro slide de um carrossel (Swiper) com 4 slides: Descrição, Código, Resultado e Assistente.

---

### REQ-02 Metadados e Estatísticas do Desafio

- [x] **Metadados e Estatísticas do Desafio**

**Descrição:** Barra informativa que exibe dados resumidos do desafio para ajudar o usuário a avaliar dificuldade e popularidade antes de resolver.

#### Regras de Negócio

- **Badge de dificuldade:** Exibe o nível de dificuldade do desafio (`easy`, `medium` ou `hard`) como um badge visual.
- **Nome do autor:** Exibe o nome do autor do desafio como um link navegável para o perfil público do autor.
- **Taxa de aceitação:** Calcula e exibe a porcentagem de votos positivos sobre o total de votos (`upvotes / (upvotes + downvotes)`).
- **Contagem de conclusões:** Exibe o número total de usuários que resolveram o desafio com sucesso.
- **Status de conclusão:** Exibe um indicador visual (checkmark ou X) informando se o usuário atual já completou o desafio. A verificação considera tanto `user.hasCompletedChallenge(challengeId)` quanto `challenge.isCompleted`.

#### Regras de UI/UX

- **Layout:** Os metadados são dispostos horizontalmente em uma barra com `flex-wrap`, permitindo quebra de linha em telas menores.
- **Centralização:** A barra é centralizada horizontalmente com largura ajustada ao conteúdo.

---

### REQ-03 Votação do Desafio

- [x] **Votação do Desafio**

**Descrição:** Sistema de votação (upvote/downvote) que permite aos usuários avaliarem a qualidade de um desafio.

#### Regras de Negócio

- **Tipos de voto:** O usuário pode votar positivamente (upvote), negativamente (downvote) ou remover seu voto (none).
- **Toggle de voto:** Clicar no mesmo botão de voto novamente remove o voto (retorna ao estado `none`).
- **Restrição de autoria:** O autor do desafio não pode votar no próprio desafio. Os botões são desabilitados para o autor.
- **Restrição de autenticação:** Usuários não autenticados não podem votar. Ao clicar no botão, um diálogo solicita que o usuário faça login.
- **Votação otimista:** A contagem de votos é atualizada imediatamente na UI antes da confirmação do servidor. Em caso de falha na API, o estado é revertido ao valor anterior e um toast de erro é exibido.
- **Persistência:** O voto é persistido via endpoint REST de votação do desafio.

#### Regras de UI/UX

- **Estados visuais dos botões:**
  - Upvote ativo: botão com cor verde.
  - Downvote ativo: botão com cor vermelha.
  - Sem voto: botões em cinza.
- **Contagem de upvotes:** Exibida ao lado do botão de upvote.
- **Feedback de erro:** Toast com mensagem de erro caso a votação falhe no servidor.

---

### REQ-04 Controle Administrativo do Desafio

- [x] **Controle Administrativo do Desafio**

**Descrição:** Painel de gerenciamento visível apenas para o autor do desafio ou administradores (usuários com insígnia God), permitindo editar, publicar/despublicar e excluir o desafio.

#### Regras de Negócio

- **Visibilidade condicional:** O painel só é exibido quando o usuário atual é o autor do desafio **ou** possui a insígnia God (administrador).
- **Contexto de gerenciamento:** O sistema distingue entre dois contextos:
  - **Autor gerenciando:** O banner informa que o desafio pertence ao autor.
  - **Admin gerenciando:** O banner informa que o usuário está gerenciando como administrador um desafio de outro autor.
- **Editar desafio:** Um link direciona para a página do editor de desafios.
- **Excluir desafio:** Um botão abre um diálogo de confirmação. Ao confirmar, o desafio é excluído e o usuário é redirecionado para a lista de desafios.
- **Publicar/Despublicar:** Um toggle alterna a visibilidade pública do desafio.

#### Regras de UI/UX

- **Banner de aviso:** Fundo amarelo com borda tracejada, informando o contexto de gerenciamento.
- **Confirmação de exclusão:** Diálogo modal com título, descrição e botões de cancelar/confirmar para evitar exclusão acidental.

---

### REQ-05 Seleção de Texto para Assistente IA

- [x] **Seleção de Texto para Assistente IA**

**Descrição:** Quando o assistente de IA está ativo, o usuário pode selecionar trechos da descrição do desafio e adicioná-los como contexto para o chatbot.

#### Regras de Negócio

- **Condição de ativação:** A funcionalidade só está disponível quando o assistente de IA está habilitado. O assistente requer autenticação.
- **Seleção de texto:** O usuário seleciona texto dentro da área da descrição do desafio usando interações nativas do navegador (mouse ou teclado).
- **Preview com limite:** O texto selecionado é encapsulado em uma estrutura `TextSelection` com preview limitado a 500 caracteres.
- **Armazenamento:** A seleção é armazenada no store do desafio para ser consumida pelo chatbot do assistente.

#### Regras de UI/UX

- **Botão flutuante:** Ao selecionar texto, um botão flutuante "Adicionar" com ícone de descrição aparece posicionado próximo à seleção.
- **Posicionamento:** O botão é posicionado absolutamente relativo ao container da descrição, calculado com base nas coordenadas da seleção.
- **Desaparecimento:** O botão desaparece ao clicar fora, ao desmarcar a seleção ou ao clicar no botão (após adicionar).

---

### REQ-06 Navegação de Conteúdo

- [x] **Navegação de Conteúdo**

**Descrição:** Links de navegação para outras seções de conteúdo relacionadas ao desafio (comentários e soluções), acessíveis diretamente a partir da descrição.

#### Regras de Negócio

- **Conteúdos disponíveis:** Os links navegam para as abas de comentários e soluções.
- **Bloqueio de soluções:** O acesso à aba de soluções pode ser bloqueado por um diálogo de restrição, dependendo da configuração de visibilidade do desafio.

---

## 3. Fluxo de Usuário (User Flow)

**Visualizar descrição de um desafio:**

1. O usuário acessa a página de um desafio.
2. O sistema carrega os dados do desafio a partir do store (previamente populado na page load via server action/RPC).
3. Enquanto os dados carregam, o sistema exibe um spinner de loading.
4. O sistema detecta o tipo de desafio (função vs. entrada) via LSP Provider.
5. O sistema concatena a descrição MDX com o alerta contextual apropriado.
6. O sistema renderiza a descrição completa com metadados (dificuldade, autor, estatísticas, status de conclusão).

**Votar em um desafio:**

1. O usuário visualiza os botões de upvote/downvote na barra de metadados.
2. O usuário clica em um dos botões de voto:
   - **Não autenticado:** Um diálogo solicita login.
   - **Autor do desafio:** Os botões estão desabilitados.
   - **Autenticado (não autor):** O voto é registrado imediatamente (otimista).
3. O sistema envia a requisição ao servidor:
   - **Sucesso:** O estado é confirmado com os dados do servidor.
   - **Falha:** O estado é revertido e um toast de erro é exibido.

**Gerenciar desafio (autor/admin):**

1. O autor ou administrador visualiza o banner de controle abaixo dos metadados.
2. O usuário pode:
   - Clicar em "Editar" para navegar ao editor do desafio.
   - Alternar o switch de publicação para tornar o desafio público/privado.
   - Clicar em "Excluir" e confirmar no diálogo modal:
     - **Confirmado:** O desafio é excluído e o usuário é redirecionado para a lista.
     - **Cancelado:** O diálogo fecha sem ação.

**Selecionar texto para o assistente IA:**

1. O usuário ativa o assistente de IA pela toolbar do editor de código.
2. O usuário seleciona um trecho de texto na descrição do desafio.
3. Um botão flutuante "Adicionar" aparece próximo à seleção.
4. O usuário clica no botão:
   - O trecho é armazenado como contexto no assistente IA.
   - O botão desaparece.

---

## 4. Fora do Escopo (Out of Scope)

- Report/denúncia de desafios por conteúdo inadequado.
- Favoritar/bookmark de desafios.
- Compartilhamento de desafio via link ou redes sociais.
- Histórico de edições da descrição (versionamento).
- Internacionalização (i18n) da descrição — o conteúdo é exibido no idioma em que foi escrito pelo autor.
- Renderização server-side do MDX da descrição.

---

## 5. Restrições Conhecidas

- **Ausência de testes:** O widget ChallengeDescriptionSlot e seus sub-componentes (ChallengeControl, ChallengeVoteControl) não possuem testes unitários ou de integração. Este é um débito técnico reconhecido.
- **Geração de MDX no client-side:** O conteúdo MDX (descrição + alerta contextual) é montado no client-side dentro do hook. Isso pode causar re-renders desnecessários e impactar a performance, especialmente com descrições longas. A decisão foi tomada por conveniência de acesso ao LSP Provider no cliente, mas representa uma limitação arquitetural.
