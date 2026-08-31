# PRD — Code Playback para Blocos de Código

- **Módulo:** `lesson`
- **Milestone:** [#38 — Code Playback para Blocos de Código](https://github.com/JohnPetros/stardust/milestone/38)
- **Status:** open
- **Atualizado em:** 2026-07-16T17:47:15Z

## Definição do produto

### 1. Visão Geral

O **Code Playback** é um componente educacional para blocos de texto do tipo `code`. Ele permite que o estudante acompanhe a execução de um código passo a passo, visualizando a linha atual, os valores das variáveis, estruturas de dados, ponteiros, resultados parciais e uma explicação textual para cada etapa.

**Objetivo:** tornar a execução de algoritmos mais clara, visual e didática, especialmente em conteúdos de aula onde apenas ler o código não é suficiente para entender o raciocínio.

**Problema resolvido:** blocos de código estáticos ou apenas executáveis mostram o resultado, mas não mostram o processo mental da execução. O estudante precisa imaginar sozinho como arrays, strings, mapas, índices e variáveis mudam ao longo do algoritmo. O playback transforma esse processo em uma sequência visual controlada.

**Valor entregue:** melhora a compreensão de algoritmos, reduz a carga cognitiva do estudante e permite que o conteúdo explique casos como loops aninhados, dois ponteiros, hash maps, sets, matrizes, strings e resultados intermediários de forma visual.

---

### 2. Requisitos

#### REQ-01 Controles de Playback

- [ ] **Controles de Playback**

**Descrição:** O estudante deve controlar a navegação entre os passos da execução.

##### Regras de Negócio

- **Play/Pause:** inicia ou pausa a reprodução automática dos passos.
- **Avançar:** move para o próximo passo.
- **Voltar:** retorna para o passo anterior.
- **Timeline:** permite visualizar o progresso e navegar para um ponto específico.
- **Velocidade:** permite alternar entre velocidades como `0.5x`, `1x` e `2x`.
- **Expandir visualização:** permite alternar entre o layout padrão vertical e o layout expandido lado a lado.
- **Limites:** ao chegar no primeiro ou último passo, ações inválidas devem ser desabilitadas ou ignoradas.
- **Fim da execução:** ao chegar no último passo durante reprodução automática, o playback deve parar.

##### Regras de UI/UX

- **Indicador de progresso:** deve mostrar algo como `Step 3 / 14`.
- **Estado atual claro:** a timeline deve indicar visualmente o passo atual.
- **Controle manual sempre disponível:** mesmo durante autoplay, o estudante deve poder pausar, avançar ou voltar.
- **Botões reconhecíveis:** os controles devem usar ícones familiares para reprodução, avanço, retorno e expansão.
- **Botão de expandir:** o controle de expansão deve ficar junto dos controles principais do componente e deixar claro quando o playback está no modo expandido.

---

#### REQ-02 Estado por Passo

- [ ] **Estado por Passo**

**Descrição:** Cada passo do playback representa um snapshot completo da execução naquele momento.

##### Regras de Negócio

- **Linha ativa:** cada passo pode indicar uma ou mais linhas de código ativas.
- **Explicação:** cada passo deve ter uma explicação própria.
- **Painéis de estado:** cada passo pode exibir diferentes painéis, como arrays, strings, variáveis, mapas, sets, grids ou resultados.
- **Ordem editorial:** a ordem dos painéis deve seguir o que o autor definiu para aquele passo.
- **Retrocesso determinístico:** voltar para um passo anterior deve restaurar exatamente o estado visual daquele passo.
- **Sem efeitos colaterais:** navegar no playback não deve alterar o código nem executar lógica real.

##### Regras de UI/UX

- **Mudança coordenada:** ao trocar de passo, linha ativa, painéis, ponteiros, destaques e explicação devem mudar juntos.
- **Consistência visual:** elementos semelhantes devem manter o mesmo padrão entre passos.
- **Clareza do snapshot:** cada passo deve ser compreensível mesmo se o estudante parar nele isoladamente.

---

#### REQ-03 Destaque da Linha de Código

- [ ] **Destaque da Linha de Código**

**Descrição:** O código exibido deve destacar a linha correspondente ao passo atual.

##### Regras de Negócio

- **Linha única:** passos simples podem destacar uma linha.
- **Múltiplas linhas:** passos compostos podem destacar mais de uma linha.
- **Atualização bidirecional:** ao avançar ou voltar, o destaque deve acompanhar o passo atual.
- **Código somente leitura:** o playback tem foco em leitura e explicação, não em edição.

##### Regras de UI/UX

- **Destaque visível:** a linha ativa deve ter contraste suficiente em relação ao restante do código.
- **Preservação do contexto:** o estudante deve conseguir ver linhas próximas à linha ativa.
- **Rolagem automática:** quando a linha ativa estiver fora da área visível, o código deve trazê-la para a visualização.
- **Sem poluição visual:** o destaque não deve dificultar a leitura da sintaxe.

---

#### REQ-04 Painel de Input

- [ ] **Painel de Input**

**Descrição:** O playback deve exibir os dados de entrada usados no exemplo.

##### Regras de Negócio

- **Input textual:** o input pode ser mostrado como texto formatado.
- **Inputs curtos:** exemplos simples devem aparecer em uma linha ou poucas linhas.
- **Inputs longos:** exemplos grandes, como matrizes de Sudoku, devem permanecer legíveis sem quebrar o layout.
- **Múltiplos valores:** deve suportar casos como `nums=[2, 7, 11, 15]`, `target=9`, `s="anagram"` e `t="nagaram"`.

##### Regras de UI/UX

- **Área fixa e legível:** o input deve ter uma área visual distinta.
- **Preservação de formatação:** quebras de linha e espaçamento relevantes devem ser mantidos.
- **Tratamento de overflow:** inputs longos devem usar scroll, quebra controlada ou expansão visual adequada.

---

#### REQ-05 Painéis de Estruturas de Dados

- [ ] **Painéis de Estruturas de Dados**

**Descrição:** O playback deve representar visualmente diferentes tipos de estado usados em algoritmos.

##### Regras de Negócio

- **Sequências:** deve suportar arrays, strings e listas, com valores e índices.
- **Ponteiros:** deve suportar um ou mais ponteiros por sequência, como `i`, `j`, `l`, `r`, `num` ou `sz`.
- **Destaques:** deve suportar células ativas, múltiplos destaques e intervalos relevantes.
- **Escalares:** deve suportar valores simples como `target`, `k`, `n`, `prod`, `result`, `i`, `j`.
- **Mapas:** deve suportar pares `chave -> valor`, incluindo valores numéricos, booleanos, strings e listas.
- **Sets:** deve suportar coleções de valores únicos, inclusive estado vazio.
- **Grids:** deve suportar matrizes, como tabuleiros de Sudoku, com linhas, colunas e células destacadas.
- **Resultados:** deve suportar estados finais ou parciais com indicação visual de sucesso, erro ou valor neutro.

##### Regras de UI/UX

- **Labels claras:** cada painel deve ter um nome visível, como `NUMS`, `COUNT`, `RES`, `SUDOKU BOARD`.
- **Índices visíveis:** sequências e grids devem exibir índices quando isso ajudar o entendimento.
- **Estado vazio:** mapas, sets ou listas vazias devem mostrar uma mensagem como `Empty`.
- **Valores longos:** valores extensos devem ser exibidos de forma legível, sem quebrar o layout.
- **Agrupamento visual:** cada estrutura deve aparecer em um bloco separado, facilitando comparação entre estados.

---

#### REQ-06 Explicação por Passo

- [ ] **Explicação por Passo**

**Descrição:** Cada passo deve exibir uma explicação textual específica sobre o que está acontecendo.

##### Regras de Negócio

- **Explicação obrigatória:** todo passo deve ter uma explicação.
- **Texto contextual:** a explicação deve descrever a ação do passo e, quando necessário, o motivo.
- **Atualização sincronizada:** ao mudar de passo, a explicação deve mudar junto com o estado visual.
- **Resultado final:** passos finais devem deixar claro quando o algoritmo retorna ou conclui algo.

##### Regras de UI/UX

- **Posição previsível:** a explicação deve aparecer sempre no mesmo local.
- **Texto escaneável:** deve ser curta o suficiente para leitura rápida, mas completa o suficiente para ensinar.
- **Ênfase de resultado:** resultados como `true`, `false`, erro ou sucesso podem receber tratamento visual diferenciado.

---

#### REQ-07 Layout Padrão e Expandido

- [ ] **Layout Padrão e Expandido**

**Descrição:** O playback deve ter dois modos de visualização: um estado padrão vertical, otimizado para leitura dentro do fluxo da página, e um estado expandido, otimizado para comparação simultânea entre estado da execução e código.

##### Regras de Negócio

- **Estado padrão:** ao abrir o componente, o playback deve exibir os controles e o estado da execução acima, com o código abaixo.
- **Estado expandido:** ao clicar em expandir, o componente deve reorganizar o conteúdo para exibir o estado da execução e o código lado a lado.
- **Alternância reversível:** o usuário deve conseguir sair do modo expandido e voltar ao estado padrão.
- **Sincronização preservada:** a troca de layout não deve alterar o passo atual, pausar indevidamente a execução, perder highlights ou resetar a timeline.
- **Mesmo conteúdo:** os dois modos devem apresentar os mesmos dados de execução, código, linha ativa, explicação e controles; apenas a disposição visual muda.

##### Regras de UI/UX

- **Composição padrão:** no modo padrão, os controles ficam no topo do componente, o painel de execução aparece abaixo dos controles e o código aparece abaixo do painel de execução.
- **Composição expandida:** no modo expandido, o painel de execução fica à esquerda e o código fica à direita em telas com largura suficiente.
- **Separação visual:** no modo expandido, deve haver separação clara entre o painel de execução e o código, preservando leitura independente dos dois lados.
- **Aproveitamento de espaço:** no modo expandido, o código deve ganhar altura e largura suficientes para leitura confortável da linha ativa e do contexto próximo.
- **Estado visual do botão:** o botão de expandir deve indicar quando a visualização expandida está ativa.
- **Fallback responsivo:** em telas estreitas, o modo expandido pode manter composição vertical ou adaptar a disposição para evitar sobreposição.

---

#### REQ-08 Responsividade e Acessibilidade

- [ ] **Responsividade e Acessibilidade**

**Descrição:** O playback deve funcionar bem em diferentes tamanhos de tela e modos de navegação.

##### Regras de Negócio

- **Desktop:** deve aproveitar o espaço para exibir código e estado de forma confortável.
- **Mobile:** deve reorganizar os painéis para leitura vertical.
- **Navegação por teclado:** controles principais devem ser acessíveis por teclado.
- **Leitores de tela:** controles devem ter nomes compreensíveis.

##### Regras de UI/UX

- **Sem sobreposição:** controles, timeline, código, painéis e explicação não podem se sobrepor.
- **Texto legível:** labels, índices e valores devem permanecer legíveis em telas menores.
- **Área rolável:** conteúdos grandes devem rolar dentro de regiões previsíveis.
- **Contraste adequado:** destaques, valores e estados devem manter contraste suficiente.

---

### 3. Fluxo de Usuário

**Fluxo A — Estudante acompanha um playback**

1. O estudante chega a um bloco de código com playback.
2. O sistema exibe o código, o input, os controles e o primeiro passo.
3. O estudante lê a explicação inicial.
4. O estudante clica em avançar ou play.
5. O sistema atualiza a linha ativa, os painéis de estado, ponteiros, destaques e explicação.
6. O estudante pode pausar, voltar, avançar ou alterar a velocidade.
7. Ao chegar ao último passo, o sistema exibe o estado final e interrompe a reprodução automática.

**Fluxo B — Estudante revisa um passo anterior**

1. O estudante percebe que não entendeu uma mudança.
2. O estudante clica em voltar ou seleciona um ponto anterior na timeline.
3. O sistema restaura o snapshot daquele passo.
4. O estudante compara o estado anterior com os próximos passos usando avanço manual.

**Fluxo C — Bloco de código sem playback**

1. O estudante chega a um bloco de código comum.
2. O sistema renderiza o bloco no comportamento atual.
3. Nenhum controle de playback é exibido.

**Fluxo D — Bloco executável com playback**

1. O estudante visualiza o playback para entender a execução.
2. O estudante também pode executar o código, quando o bloco permitir execução.
3. O playback continua sendo uma explicação estática e não depende da execução real.

**Fluxo E — Estudante alterna entre layout padrão e expandido**

1. O estudante abre um playback no estado padrão.
2. O sistema exibe controles e estado da execução acima, com o código abaixo.
3. O estudante clica no botão de expandir.
4. O sistema reorganiza o componente para exibir estado da execução e código lado a lado.
5. O estudante continua avançando, voltando ou reproduzindo os passos sem perder o passo atual.
6. O estudante clica novamente no controle de expansão ou fechamento.
7. O sistema retorna ao layout padrão preservando o mesmo passo e os mesmos destaques.

---

### 4. Fora do Escopo

- Geração automática de passos a partir do código.
- Debugger real com inspeção dinâmica de runtime.
- Execução linha a linha do código real.
- Edição de código dentro do modo playback.
- Alteração manual de variáveis pelo estudante.
- Suporte inicial a múltiplas linguagens além do conteúdo já usado na plataforma.
- Persistência do progresso do playback entre sessões.
- Colaboração em tempo real.
- Criação automática de explicações por IA.
- Validação automática de que os passos cadastrados correspondem exatamente ao código.
