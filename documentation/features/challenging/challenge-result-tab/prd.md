### 1. Visão Geral

A **Challenge Result Tab** é a aba de resultados exibida na página de desafios
da plataforma StarDust. Após o usuário executar seu código contra os casos de
teste de um desafio, esta aba apresenta visualmente o resultado de cada caso de
teste — comparando a saída produzida pelo código do usuário com a saída
esperada — e permite a verificação formal da resposta.

**Problema resolvido:** Sem uma tela de resultados estruturada, o usuário não
teria visibilidade sobre quais casos de teste passaram ou falharam, dificultando
a identificação de erros lógicos e o aprendizado iterativo.

**Valor entregue:** Feedback visual imediato e detalhado por caso de teste, com
fluxo claro de verificação, conclusão e recompensa, incentivando a prática
deliberada e a progressão gamificada.

---

### 2. Requisitos

#### REQ-01 Exibição de Casos de Teste

- [x] **Exibição de Casos de Teste**

**Descrição:** Cada caso de teste do desafio é apresentado como um card
individual na aba de resultados, com indicação visual de aprovação ou
reprovação.

##### Regras de Negócio

- **Identificação por posição:** Cada card é identificado pela posição do caso
  de teste (ex: "Teste de caso #1", "Teste de caso #2").
- **Indicador de resultado:** Cada card exibe um ícone de check (verde) se o
  teste passou, ou um ícone de X (vermelho) se falhou.
- **Test cases bloqueados:** Test cases marcados como `isLocked` são aqueles em
  que o usuário não conhece o output correto. Eles são exibidos com opacidade
  reduzida e não podem ser expandidos — o botão de expansão é substituído por um
  ícone de cadeado.
- **Exceção ao bloqueio:** Se um test case bloqueado for resolvido corretamente,
  ele é desbloqueado e pode ser expandido normalmente.

##### Regras de UI/UX

- **Responsividade:** Em desktop, os cards são dispostos verticalmente em um
  painel lateral ao editor de código. Em mobile, a aba é apresentada como slide
  no carrossel de abas.
- **Feedback:** Não há mensagem de erro explícita para a listagem. Se não
  houver nenhum resultado disponível, a aba simplesmente não renderiza conteúdo.

---

#### REQ-02 Detalhes do Caso de Teste

- [x] **Detalhes do Caso de Teste**

**Descrição:** Ao expandir um caso de teste, o usuário visualiza os dados de
entrada, sua saída e a saída esperada, traduzidos para a linguagem de
programação do desafio (Delegua) via LSP.

##### Regras de Negócio

- **Campos exibidos:** Cada caso de teste expandido mostra três campos:
  - **Entrada:** Valores de entrada fornecidos ao código, traduzidos via
    `LspProvider.translateToLsp()`. Se não houver entradas, exibe "sem entrada".
  - **Seu resultado:** Saída produzida pelo código do usuário, traduzida via
    LSP. Se não houver saída, exibe "sem resultado".
  - **Resultado esperado:** Saída correta esperada pelo desafio, traduzida via
    LSP.
- **Tradução assíncrona:** Todos os valores (inputs, user output, expected
  output) são traduzidos assincronamente do formato JavaScript interno para a
  representação na linguagem Delegua.
- **Expansão automática:** Casos de teste que possuem resultado disponível (não
  bloqueados, ou corretos) são expandidos automaticamente ao carregar.
- **Toggle manual:** O usuário pode expandir/colapsar manualmente casos de teste
  não bloqueados clicando no botão de seta.

##### Regras de UI/UX

- **Destaque visual do output do usuário:** O campo "Seu resultado" possui
  fundo diferenciado (mais claro) para facilitar a comparação visual com o
  resultado esperado.
- **Animação:** A expansão e o colapso dos detalhes são animados com transição
  suave de altura. A seta indicadora de estado (aberto/fechado) também é
  animada.

---

#### REQ-03 Verificação da Resposta

- [x] **Verificação da Resposta**

**Descrição:** O usuário verifica formalmente sua solução através de um botão
fixo na parte inferior da aba. A verificação compara todas as saídas do usuário
com as saídas esperadas.

##### Regras de Negócio

- **Lógica de verificação:** A verificação é delegada à entidade `Challenge` do
  domínio. A resposta é considerada correta somente se **todos** os resultados
  dos casos de teste forem `true`.
- **Estados do botão:**
  - **Não respondido** (`hasAnswer = false`): Botão desabilitado com label
    "Verificar".
  - **Verificado e incorreto** (`isVerified = true`, `isCorrect = false`):
    Botão com label "Tentar novamente", feedback visual de erro.
  - **Verificado e correto** (`isVerified = true`, `isCorrect = true`): Botão
    com label "Continuar", feedback visual de sucesso.
- **Feedback sonoro:** Sons de sucesso (`success.wav`) ou falha (`fail.wav`)
  são reproduzidos no momento da verificação.
- **Contagem de erros:** Cada verificação incorreta incrementa o contador
  `incorrectAnswersCount` na entidade `Challenge`. Essa métrica impacta
  diretamente o cálculo de recompensa — quanto mais erros em relação ao máximo
  permitido (`testCases.length * 10`), menor a recompensa.
- **Redirecionamento mobile:** Quando a resposta é incorreta e verificada em
  dispositivo mobile, o sistema automaticamente navega para a aba de código
  para facilitar a correção.

##### Regras de UI/UX

- **Posição fixa:** O botão de verificação é sticky na parte inferior da aba,
  sempre visível durante a rolagem.
- **Feedback:** Painel animado que desliza com mensagem "Correto, parabéns!" ou
  "Oops, tente de novo!" ao verificar.

---

#### REQ-04 Fluxo de Conclusão e Recompensas

- [x] **Fluxo de Conclusão e Recompensas**

**Descrição:** Após verificação correta, o desafio é marcado como concluído e o
usuário é direcionado à tela de recompensas (ou de volta à navegação, caso já
tenha completado).

##### Regras de Negócio

- **Conclusão do desafio:** Quando a verificação é correta, o desafio é marcado
  como `isCompleted = true` e todos os crafts (painel de código) ficam visíveis.
- **Payload de recompensa:** O sistema monta um payload com métricas de
  desempenho:
  - `secondsCount`: tempo gasto (armazenado em `localStorage`).
  - `incorrectAnswersCount`: total de respostas incorretas acumuladas.
  - `maximumIncorrectAnswersCount`: limite máximo de erros (`testCases * 10`).
  - `challengeId`: identificador do desafio.
  - `starId` (apenas para Star Challenges): identificador da estrela vinculada.
- **Armazenamento do payload:** O payload é persistido em cookie antes da
  navegação para a página de recompensas.
- **Rota de recompensa — Star Challenge:** Desafios vinculados a uma estrela
  (`isStarChallenge = true`) redirecionam para `/rewarding/star-challenge`.
- **Rota de recompensa — Challenge livre:** Desafios não vinculados a estrelas
  redirecionam para `/rewarding/challenge`.
- **Bypass de recompensa (Star Challenge):** Se o usuário é "god" ou já
  completou o Star Challenge anteriormente, é redirecionado diretamente para a
  página do espaço (`/space`) — sem passar pela tela de recompensa.
- **Bypass de recompensa (Challenge livre):** Se o usuário já completou o
  desafio anteriormente ou é o autor do desafio, é redirecionado para a lista
  de desafios (`/challenging/challenges`) — sem recompensa duplicada.

---

#### REQ-05 Controle de Autenticação

- [x] **Controle de Autenticação**

**Descrição:** Usuários não autenticados são impedidos de completar desafios
livres, sendo solicitados a fazer login.

##### Regras de Negócio

- **Alerta de login:** Quando um usuário não autenticado tenta completar um
  desafio livre (não vinculado a estrela) após verificação correta, um dialog
  de alerta é exibido solicitando que acesse sua conta antes de continuar.
- **Escopo:** Esta restrição se aplica apenas a desafios livres
  (`isStarChallenge = false`). Star Challenges pressupõem que o usuário já está
  autenticado (pois fazem parte da trilha de aprendizado).

---

#### REQ-06 Restauração de Estado

- [x] **Restauração de Estado**

**Descrição:** Ao recarregar a página na rota de resultado, o estado da
verificação é restaurado automaticamente se o desafio já foi concluído.

##### Regras de Negócio

- **Condições de restauração:** Se o usuário está na rota `/result`, a resposta
  ainda não foi verificada (`isVerified = false`), o desafio está completado
  (`isCompleted = true`) e possui resposta (`hasAnswer = true`), e a página
  não está em transição — o sistema automaticamente marca a resposta como
  correta e verificada.
- **Objetivo:** Evitar que o usuário perca o estado visual de "completado" ao
  recarregar a página, garantindo consistência na experiência.

---

### 3. Fluxo de Usuário (User Flow)

**Fluxo principal — Verificação e conclusão do desafio:**

1. O usuário escreve código no editor e executa contra os casos de teste
   (ação externa a esta feature).
2. O usuário navega para a aba "Resultado" para visualizar os resultados.
3. O sistema exibe os cards de cada caso de teste com indicador visual
   (passou/falhou).
4. Casos de teste não bloqueados com resultado disponível são expandidos
   automaticamente, exibindo entrada, saída do usuário e saída esperada.
5. O usuário clica no botão "Verificar" (fixo na parte inferior).
6. O sistema verifica se todos os casos de teste passaram:
   - **Sucesso:** Feedback visual verde ("Correto, parabéns!"), som de sucesso.
     O botão muda para "Continuar".
   - **Falha:** Feedback visual vermelho ("Oops, tente de novo!"), som de
     falha. O botão muda para "Tentar novamente". Em mobile, o sistema navega
     automaticamente para a aba de código.
7. Se incorreto, o usuário corrige o código, re-executa e retorna à aba de
   resultado (volta ao passo 2).
8. Se correto, o usuário clica em "Continuar".
9. O sistema avalia o tipo de desafio e o histórico do usuário:
   - **Star Challenge (novo):** Monta payload de recompensa e navega para
     `/rewarding/star-challenge`.
   - **Star Challenge (já completado / user god):** Navega diretamente para
     `/space`.
   - **Challenge livre (novo):** Verifica autenticação. Se autenticado, monta
     payload e navega para `/rewarding/challenge`. Se não autenticado, exibe
     alerta de login.
   - **Challenge livre (já completado / autor):** Navega diretamente para
     `/challenging/challenges`.

---

### 4. Fora do Escopo (Out of Scope)

- Execução do código contra os casos de teste (responsabilidade do editor de
  código / feature separada).
- Cálculo efetivo da recompensa (XP, starcoins) — responsabilidade da página
  de rewarding.
- Exibição da aba de comentários ou soluções do desafio.
- Persistência server-side do estado de conclusão do desafio.
- Tratamento de falha de rede ao salvar cookie de rewarding (cenário
  identificado como não coberto e necessário — 🚧 Em construção).

#### Descartado durante a implementação

- **Diff visual de outputs:** Comparação lado a lado entre a saída do usuário e
  a esperada, com destaque de diferenças. Descartado por escopo/tempo limitado.
- **Re-run parcial de test cases:** Possibilidade de re-executar apenas os
  casos de teste que falharam, sem re-executar todos. Descartado por
  escopo/tempo limitado.
- **Contador de tentativas:** Exibição do número de tentativas realizadas e/ou
  penalidade progressiva visível para o usuário. Descartado por escopo/tempo
  limitado.
