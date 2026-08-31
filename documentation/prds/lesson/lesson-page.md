# PRD — Página de Lição

- **Módulo:** `lesson`
- **Milestone:** [#23 — Página de Lição](https://github.com/JohnPetros/stardust/milestone/23)
- **Status:** open
- **Atualizado em:** 2026-07-06T19:29:14Z

## Definição do produto

### 1. Visão Geral

A **Página de Lição** é a experiência central de aprendizado do StarDust. Ao acessar uma "estrela" (star) da trilha, o aluno percorre uma jornada pedagógica em três estágios sequenciais:

1. **História (Story):** conteúdo narrativo apresentado em blocos, opcionalmente acompanhado de **áudio narrado**.
2. **Quiz:** conjunto de questões interativas de tipos variados, com sistema de vidas.
3. **Rewarding:** tela de recompensa que consolida o desempenho (acertos, erros, tempo).

**Problema que resolve:** oferecer um fluxo de aprendizado guiado e gamificado, unindo leitura de conteúdo, prática por questões e feedback de recompensa numa única sessão contínua.

**Objetivo principal e valor:** garantir uma experiência narrativa consistente entre conteúdo, áudio e progressão, na qual o aluno consome a teoria e, em seguida, valida o aprendizado respondendo questões — recebendo recompensa ao final. A milestone consolidou a construção da história exclusivamente a partir de blocos estruturados (`TextBlocks`) e a reativação do narrador com áudio persistido por bloco.

---

### 2. Requisitos

#### REQ-01 Acesso e carregamento da lição

- [ ] **Acesso e carregamento da lição**

**Descrição:** O aluno acessa a lição de uma estrela específica pela URL (`/lesson/{starSlug}`); o sistema carrega o conteúdo da história e as questões antes de exibir a página.

##### Regras de Negócio

- **Resolução da estrela:** O acesso é feito por *slug* da estrela. O sistema valida que a estrela existe; se não existir, a página não é renderizada.
- **Carregamento de dados:** História (blocos de texto) e questões são carregadas no servidor durante a renderização inicial (SSR), em paralelo.
- **Autenticação:** A lição é acessível apenas por usuário autenticado.
- **Estado inicial:** A lição sempre inicia no estágio **História**.

##### Regras de UI/UX

- **Transição de entrada:** Ao abrir a página, exibe-se uma animação de transição por aproximadamente 1 segundo antes de revelar o conteúdo.
- **Loading:** Enquanto o áudio da história é preparado, o conteúdo correspondente só é exibido após a checagem de disponibilidade dos arquivos.

---

#### REQ-02 Estágio História (Story)

- [ ] **Estágio História (Story)**

**Descrição:** Apresentação do conteúdo teórico da estrela em blocos sequenciais que o aluno avança um a um.

##### Regras de Negócio

- **Origem do conteúdo:** A história é construída **exclusivamente a partir de blocos estruturados (`TextBlocks`)**. Não há mais uso de conteúdo textual legado (`storyContent`) separado por `----`.
- **Tipos de bloco:** Cada bloco tem um tipo (ex.: texto, imagem, código executável) e é renderizado em formato rico (MDX). Blocos de código podem ser executáveis.
- **Progressão por blocos:** O aluno avança clicando em **Continuar**, que revela o próximo bloco. Blocos já lidos permanecem visíveis (histórico da leitura).
- **Conclusão da história:** Ao chegar no último bloco, o botão de avanço dá lugar a uma confirmação ("Parabéns! Agora você pode ir para a próxima etapa 🚀") que leva ao estágio Quiz.
- **Progresso:** O cabeçalho reflete o progresso de leitura (blocos lidos / total).

##### Regras de UI/UX

- **Título:** Exibe o número e o nome da estrela no topo do conteúdo.
- **Animação:** Apenas o bloco recém-revelado é animado; blocos anteriores são apresentados de forma estável.
- **Botão Continuar:** Fixado no rodapé, recebe foco automaticamente para permitir avanço por teclado.
- **Feedback de fim:** Diálogo de confirmação ("Bora!") antes de transicionar para o Quiz.

---

#### REQ-03 Áudio narrado da história (Speaker)

- [ ] **Áudio narrado da história (Speaker)**

**Descrição:** Reprodução de narração em áudio para blocos elegíveis da história, a partir de arquivos previamente gerados e persistidos.

##### Regras de Negócio

- **Áudio persistido, sem TTS em tempo real:** O áudio é reproduzido **a partir de arquivo persistido** no storage. **Não há fallback para geração de TTS em tempo real** durante a lição.
- **Elegibilidade do player:** O controle de áudio só é exibido para blocos elegíveis cujo áudio tenha **status `done`** *e* cujo **arquivo esteja confirmado** no storage (pasta `audios/story`).
- **Confirmação de existência:** Antes de exibir o player, o sistema verifica no storage se o arquivo de áudio realmente existe, evitando renderizar controles para arquivos indisponíveis.
- **Blocos sem áudio:** Blocos sem áudio elegível são apresentados normalmente, apenas sem o controle de narração.

##### Regras de UI/UX

- **Exibição condicional:** Player de áudio aparece somente nos blocos com áudio confirmado; nos demais, permanece oculto.
- **Confiabilidade:** Caso a verificação de existência falhe, o bloco é tratado como sem áudio (não exibe player), em vez de exibir um controle quebrado.

---

#### REQ-04 Estágio Quiz — questões interativas

- [ ] **Estágio Quiz — questões interativas**

**Descrição:** Após a história, o aluno responde a uma sequência de questões de tipos variados para validar o aprendizado.

##### Regras de Negócio

- **Tipos de questão suportados:** Seleção (`selection`), múltipla escolha (`checkbox`), aberta (`open`), ordenação por arrastar (`drag-and-drop-list`) e preenchimento de código por arrastar (`drag-and-drop`).
- **Sequência:** As questões são apresentadas uma por vez, na ordem, avançando conforme o aluno acerta.
- **Verificação em duas etapas:** O aluno primeiro **verifica** a resposta; se estiver correta, um segundo comando avança para a próxima questão. Se estiver incorreta, o aluno pode tentar novamente.
- **Correção por tipo:** Cada tipo tem sua própria regra de acerto (ex.: seleção compara texto sem diferenciar maiúsculas/minúsculas; ordenação exige a sequência exata dos itens).
- **Fim do quiz:** Quando não há próxima questão, a lição transiciona automaticamente para o estágio **Rewarding**.

##### Regras de UI/UX

- **Renderização por tipo:** Cada tipo de questão possui sua própria interface (opções, checkboxes, campo aberto, itens arrastáveis, blocos de código com lacunas).
- **Recursos da questão:** Uma questão pode incluir enunciado, imagem ilustrativa e/ou trecho de código.
- **Botão de verificação:** Estado do botão reflete se a resposta foi respondida, verificada e se está correta.
- **Progresso:** O cabeçalho reflete o avanço nas questões.

---

#### REQ-05 Sistema de vidas

- [ ] **Sistema de vidas**

**Descrição:** Mecânica de gamificação que limita a quantidade de erros permitidos durante o quiz.

##### Regras de Negócio

- **Vidas iniciais:** O aluno começa o quiz com **5 vidas**.
- **Perda de vida:** Ao confirmar uma resposta incorreta (após já tê-la verificado), o aluno perde uma vida e a contagem de respostas incorretas é incrementada.
- **Contagem de erros:** O total de respostas incorretas é registrado para compor a recompensa ao final.
- **Fim por falta de vidas:** Ao zerar as vidas, o aluno não pode continuar a lição.

##### Regras de UI/UX

- **Feedback de fim:** Ao ficar sem vidas, exibe-se um diálogo ("Puxa, parece que você não tem mais vidas!" / "Mais sorte da próxima vez 😢") com ação para **Sair** da lição.

---

#### REQ-06 Cronômetro do quiz

- [ ] **Cronômetro do quiz**

**Descrição:** Medição do tempo gasto pelo aluno para compor a recompensa.

##### Regras de Negócio

- **Escopo da contagem:** O tempo é contado **apenas durante o estágio Quiz** (não durante a história).
- **Reinício:** O contador é zerado ao iniciar/entrar na lição e ao sair.
- **Uso:** O tempo total (em segundos) integra os dados enviados à tela de recompensa.

---

#### REQ-07 Transição para Rewarding

- [ ] **Transição para Rewarding**

**Descrição:** Ao concluir o quiz, o sistema consolida o desempenho e encaminha o aluno para a tela de recompensa.

##### Regras de Negócio

- **Dados consolidados:** Ao final, o sistema reúne número total de questões, quantidade de respostas incorretas, tempo total (segundos) e identificador da estrela.
- **Encaminhamento:** Esses dados são repassados para a tela de recompensa (`/rewarding/star`), que exibe o resultado.
- **Limpeza de estado:** Ao encaminhar, o estado da lição e o cronômetro são reiniciados.

##### Regras de UI/UX

- **Loading de transição:** Durante a passagem para a recompensa, o cabeçalho da lição é ocultado e um indicador de carregamento é exibido.

> **Assunção:** O cálculo e a apresentação final da recompensa (XP, ganhos, animações) pertencem à tela `/rewarding/star` e são tratados como consumidores dos dados aqui produzidos, não como parte deste PRD.

---

#### REQ-08 Sair da lição

- [ ] **Sair da lição**

**Descrição:** O aluno pode abandonar a lição a qualquer momento antes da recompensa.

##### Regras de Negócio

- **Saída:** Ao sair, o estado da lição é reiniciado, o cronômetro é limpo e o aluno é redirecionado para o mapa/espaço (`/space`).

##### Regras de UI/UX

- **Cabeçalho:** Presente nos estágios História e Quiz (oculto no Rewarding), oferece a ação de sair e reflete o progresso do estágio atual.

---

### 3. Fluxo de Usuário (User Flow)

**Fluxo principal — concluir a lição:** Caminho feliz do início ao fim.

1. O usuário acessa a lição de uma estrela por `/lesson/{starSlug}`.
2. O sistema valida a existência da estrela e carrega história + questões.
   - **Sucesso:** A página abre no estágio **História** (após animação de entrada).
   - **Falha:** A página não é renderizada.
3. O usuário lê os blocos da história, avançando em **Continuar**; onde houver áudio elegível confirmado, pode reproduzir a narração.
4. Ao chegar no último bloco, confirma a passagem ("Bora!") e entra no **Quiz**.
5. O usuário responde às questões (verifica → avança). O cronômetro corre durante o quiz.
6. O sistema avalia cada resposta:
   - **Correta:** Avança para a próxima questão.
   - **Incorreta:** Permite nova tentativa; ao reconfirmar erro, perde uma vida.
7. Ao responder a última questão, o sistema consolida desempenho e encaminha para **Rewarding** (`/rewarding/star`).

**Fluxo alternativo — sem vidas:** Interrupção por esgotamento de vidas.

1. Durante o quiz, o usuário perde a 5ª vida ao reconfirmar uma resposta incorreta.
2. O sistema detecta ausência de vidas e exibe o diálogo de fim.
3. O usuário escolhe **Sair** → estado reiniciado e redirecionamento para `/space`.

**Fluxo alternativo — sair no meio:** Abandono voluntário.

1. Em qualquer estágio (História/Quiz), o usuário aciona **Sair** no cabeçalho.
2. O sistema reinicia estado e cronômetro e redireciona para `/space`.

---

### 4. Fora do Escopo (Out of Scope)

- **Autoria no Studio:** Edição de questões e blocos da história, suporte a áudio para blocos de imagem e novas vozes narrativas para a equipe editorial (itens entregues na milestone, porém pertencentes ao fluxo do Studio, não ao consumo pelo aluno).
- **Geração de áudio TTS:** Todo o pipeline de geração/cancelamento/remoção de áudio (jobs assíncronos, provedores TTS) — a lição apenas consome arquivos já persistidos.
- **Explicação de código (code explanation):** Recurso de explicação de trechos de código e seu limite de usos.
- **TTS em tempo real:** Explicitamente descartado — não há fallback de narração gerada na hora.
- **Conteúdo legado da história:** `storyContent` separado por `----` foi descontinuado.
- **Tela de recompensa (`/rewarding/star`):** Cálculo de XP/recompensas e suas animações são consumidores dos dados desta feature, documentados separadamente.

#### Descartado durante a implementação _(Modo Retrospectivo)_

- **Fallback de TTS em tempo real na lição:** Descartado em favor de áudio persistido — reduz risco de latência/indisponibilidade e de exibir controles para arquivos ainda não prontos.
- **Fallback por `storyContent` (`----`):** Descartado ao migrar a história para blocos estruturados (`TextBlocks`), tornando o conteúdo mais consistente e estruturado.
- **Exibir player sem confirmação de arquivo:** Descartado — o player passou a exigir status `done` *e* confirmação da existência do arquivo no storage, evitando controles quebrados.

---

### 5. Divergências entre Milestone e Implementação

A implementação observada está **alinhada** aos requisitos de produto descritos na milestone #23. Os pontos abaixo são fronteiras de escopo, não contradições:

- **Itens de Studio/Server na milestone:** A milestone inclui entregas de Studio (áudio para blocos de imagem, novas vozes) e de Server (validação pública de existência de arquivos e vozes atualizadas). Este PRD cobre o **consumo pelo aluno + áudio da história**; esses itens ficam fora do escopo deste documento, embora façam parte da mesma milestone. Impacto: nenhum sobre o comportamento documentado aqui — a lição consome os arquivos e vozes já persistidos.
- **Sem divergências de comportamento identificadas** entre o que a milestone define para o consumo da lição (história por `TextBlocks`, player condicionado a `audio.status = done` + arquivo confirmado, progressão História → Quiz → Rewarding preservada) e o comportamento observável na codebase.
