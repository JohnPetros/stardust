# PRD — Explicação de bloco de código por IA

- **Módulo:** `lesson`
- **Milestone:** [#25 — Explicação de bloco de código por IA](https://github.com/JohnPetros/stardust/milestone/25)
- **Status:** open
- **Atualizado em:** 2026-04-15T17:14:28Z

## Definição do produto

# Botão de Explicação por IA no Bloco de Código da Lesson Page

## 1. Visão Geral

O bloco de código da Lesson Page (presente na Story e no Quiz) não oferece suporte pedagógico
contextual ao aluno quando ele não entende o código exibido. Isso gera abandono silencioso e
reduz o aproveitamento do conteúdo.

O objetivo desta feature é adicionar um botão de IA ao componente `CodeBlock` que abre um
dialog com o código à esquerda e uma explicação gerada por IA à direita, com cache local por
índice do bloco e controle de uso diário limitado a 10 por usuário via Redis.

## 2. Requisitos

### [ ] Botão de IA no CodeBlock

**Descrição:** Exibir botão de IA no componente `CodeBlock`, disponível tanto na Story quanto
no Quiz, como ponto de entrada para a explicação gerada.

#### Regras de Negócio

- **Visibilidade:** O botão de IA deve aparecer ao lado dos botões existentes (Resetar, Copiar,
  Executar) em todo bloco de código com `type: 'code'`.
- **Escopo:** O botão está disponível na Story (blocos narrativos) e no Quiz (conteúdo
  condicional de questão).

#### Regras de UI/UX

- **Consistência visual:** O botão deve seguir o mesmo padrão visual dos botões existentes
  no `CodeBlock`.
- **Acessibilidade:** O botão deve ser acionável por teclado e ter label descritivo para
  leitores de tela.

---

### [ ] Cache Local de Explicações

**Descrição:** Evitar consumo desnecessário de usos diários para blocos de código já explicados
anteriormente, armazenando a explicação no localStorage por índice do bloco.

#### Regras de Negócio

- **Chave de cache:** `lesson:code-explanation:{chunkIndex}`, onde `chunkIndex` é a posição
  do bloco em `story.chunks[]` (começando do zero).
- **Cache HIT:** Se a explicação já existe no localStorage, o `CodeExplanationDialog` abre
  diretamente, sem AlertDialog e sem consumir uso do contador.
- **Cache MISS:** Prosseguir para verificação de saldo no servidor.
- **Atualização:** Após geração bem-sucedida (incluindo Retry), a explicação é salva/substituída
  no localStorage.

#### Regras de UI/UX

- **Abertura imediata:** No cache HIT, o Dialog abre sem nenhuma fricção intermediária.

---

### [ ] Verificação de Saldo Diário

**Descrição:** Controlar o uso diário da feature por usuário via Redis, consultando o saldo
somente quando o usuário demonstra intenção de uso (clique no botão) e não há cache local.

#### Regras de Negócio

- **Chave Redis:** `profile:{userId}:code-explanation-remaining-uses`.
- **Saldo inicial:** Chave ausente no Redis equivale a saldo cheio (10 usos). A chave é criada
  automaticamente no primeiro uso do dia. ⚠️ Confirmar TTL: meia-noite (dia calendário) vs. 24h
  a partir do primeiro uso.
- **Consulta sob demanda:** O saldo é buscado apenas no momento do clique no botão AI (sem cache).
- **Saldo > 0:** Exibir AlertDialog de aviso antes de prosseguir.
- **Saldo = 0:** Exibir AlertDialog de bloqueio diretamente, sem permitir geração.
- **Decremento:** Cada geração nova (sem cache) decrementa o contador diário no Redis.

#### Regras de UI/UX

- **AlertDialog de aviso:** Mensagem "Você usará 1 de N usos restantes hoje. Deseja continuar?",
  com ações de confirmar e cancelar.
- **AlertDialog de bloqueio:** Mensagem informando esgotamento do limite diário, sem ação de
  prosseguir.
- **Acessibilidade:** Ambos os dialogs devem permitir navegação por teclado e foco inicial
  previsível.

---

### [ ] Dialog de Explicação

**Descrição:** Exibir o código do bloco e a explicação gerada pela IA em um dialog de duas
colunas, com opção de regenerar a explicação.

#### Regras de Negócio

- **Conteúdo:** Código do bloco (read-only) à esquerda e explicação gerada à direita.
- **Retry:** O botão de Retry permite regenerar a explicação, consumindo mais 1 uso diário.
- **Retry com aviso:** Antes de regenerar, exibir AlertDialog: "Isso consumirá mais 1 de seus
  N usos restantes. Deseja continuar?" O valor de N vem do retorno do último POST bem-sucedido,
  mantido em estado local.
- **Retry bloqueado:** Se ao confirmar o Retry o servidor retornar 403, fechar o Dialog e exibir
  AlertDialog de bloqueio.
- **Atualização pós-Retry:** Explicação atualizada substitui o valor anterior no localStorage.

#### Regras de UI/UX

- **Layout:** Duas colunas — código à esquerda, explicação à direita.
- **Estado de loading:** Exibir indicador de carregamento enquanto a explicação é gerada.
- **Botão de Retry:** Visível no Dialog após a explicação ser exibida.
- **Acessibilidade:** Dialog deve permitir fechamento por teclado (Esc) e foco inicial previsível.

---

### [ ] Geração de Explicação via IA (Server)

**Descrição:** Processar a requisição de explicação no servidor via workflow Mastra, integrando
LLM e controle de saldo Redis.

#### Regras de Negócio

- **Entrada:** `{ code: string, userId: string }`.
- **Validação de saldo:** Antes de acionar o LLM, verificar saldo Redis. Retornar 403 se
  `remainingUses = 0`.
- **Geração:** Acionar `MastraExplainCodeWorkflow` com o código do bloco.
- **Decremento:** Após geração bem-sucedida, decrementar `profile:{userId}:code-explanation-remaining-uses`
  no Redis (criando a chave com TTL se ausente).
- **Retorno:** `{ explanation: string, remainingUses: number }`.

#### Regras de UI/UX

- **Confiabilidade:** Em caso de falha na geração, não exibir explicação parcial; retornar erro
  tratável pelo widget.

## 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Explicação com cache local.

1. O usuário clica no botão de IA em um `CodeBlock`.
2. O sistema verifica o localStorage pela chave `lesson:code-explanation:{chunkIndex}`.
3. O sistema valida se há cache:
   - **Sucesso:** Abre o `CodeExplanationDialog` diretamente com a explicação salva.
   - **Falha:** Prossegue para verificação de saldo.

**Nome do fluxo:** Explicação sem cache — saldo disponível.

1. O sistema consulta `GET /lesson/code-explanation/remaining-uses`.
2. O sistema valida o saldo:
   - **Saldo = 0:** Exibe AlertDialog de bloqueio. Fim do fluxo.
   - **Saldo > 0:** Exibe AlertDialog de aviso com N usos restantes.
3. O usuário valida a intenção:
   - **Cancela:** Fecha o AlertDialog.
   - **Confirma:** Dispara `POST /lesson/code-explanation`.
4. O sistema valida o retorno:
   - **403:** Exibe AlertDialog de bloqueio.
   - **200:** Salva explicação no localStorage e abre `CodeExplanationDialog`.

**Nome do fluxo:** Retry de explicação.

1. O usuário clica em "Retry" no `CodeExplanationDialog`.
2. O sistema exibe AlertDialog: "Isso consumirá mais 1 de seus N usos restantes. Deseja continuar?"
3. O usuário valida a intenção:
   - **Cancela:** Retorna ao Dialog com a explicação atual.
   - **Confirma:** Dispara `POST /lesson/code-explanation`.
4. O sistema valida o retorno:
   - **403:** Fecha o Dialog e exibe AlertDialog de bloqueio.
   - **200:** Atualiza localStorage e atualiza a explicação no Dialog.

## 4. Requisitos Técnicos

**PRD:** `documentation/features/lesson/lesson-page/prd.md`
**Branch:** `feature/lesson-code-block-ai-explanation`
**Camadas impactadas:** `core` · `server/ai` · `server/rest` · `ui` · `providers`

**Fluxo de dados:**

```
CodeBlockWidget (ui)
  → clique no botão AI
  → verifica localStorage["lesson:code-explanation:{chunkIndex}"]

[cache HIT]
  → abre CodeExplanationDialog diretamente

[cache MISS]
  → GET /lesson/code-explanation/remaining-uses
  → LessonController.getRemainingCodeExplanations(userId)
  → UpstashCacheProvider.get("profile:{userId}:code-explanation-remaining-uses") ?? 10
  → retorna { remainingUses: number }

  [remainingUses = 0] → AlertDialog de bloqueio

  [remainingUses > 0]
    → AlertDialog de aviso → cancela → fecha
    → confirma → POST /lesson/code-explanation { code, userId }
      → [403] → AlertDialog de bloqueio
      → [200] → salva localStorage["lesson:code-explanation:{chunkIndex}"]
              → abre CodeExplanationDialog

[Retry no CodeExplanationDialog]
  → AlertDialog de aviso → cancela → volta ao Dialog
  → confirma → POST /lesson/code-explanation { code, userId }
    → [403] → fecha Dialog → AlertDialog de bloqueio
    → [200] → atualiza localStorage["lesson:code-explanation:{chunkIndex}"]
            → atualiza explicação no Dialog
```

**Contratos esperados:**

- `MastraExplainCodeWorkflow.execute({ code: string }) -> { explanation: string }` —
  workflow Mastra que aciona o LLM e retorna a explicação.
- `ExplainCodeTool.handle(mcp: Mcp<{ code: string }>) -> string` — tool com única
  responsabilidade: chamar o LLM e retornar a explicação textual.
- `EXPLAIN_CODE_INSTRUCTION` em `apps/server/src/ai/constants/agents-instructions.ts` —
  instrução do modelo; deve declarar formato de saída, idioma (pt-BR) e restrições de conteúdo.
- `LessonController.getRemainingCodeExplanations(call: RpcCall) -> RpcResponse` — lê o saldo
  via `UpstashCacheProvider.get(key) ?? 10`; chave ausente equivale a saldo cheio.
- `LessonController.explainCode(call: RpcCall) -> RpcResponse` — injeta
  `MastraExplainCodeWorkflow` + `UpstashCacheProvider`; retorna 403 se saldo = 0, caso
  contrário executa workflow, decrementa saldo e retorna `{ explanation: string, remainingUses: number }`.
- `CodeBlockWidget` — controla `alertDialogMode: 'warning' | 'blocked' | null`,
  `isExplanationOpen: boolean`, lê/escreve cache via localStorage usando `chunkIndex` como chave.

## 5. Referências na Codebase

- **`apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`** — padrão de
  workflow Mastra a seguir para `MastraExplainCodeWorkflow`.
- **`apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`** — padrão de composition root
  com `UpstashCacheProvider` injetado.
- **`apps/web/src/ai/constants/manual-prompts.ts`** — padrão de centralização de prompts;
  `EXPLAIN_CODE_INSTRUCTION` deve seguir o mesmo padrão no server.
- **`packages/core/src/global/interfaces/ai/Tool.ts`** — interface `Tool<Input, Output>` que
  `ExplainCodeTool` deve implementar.
- **`packages/core/src/lesson/domain/structures/Story.ts`** — `story.chunks[]` é a fonte do
  `chunkIndex` usado como chave no localStorage.

## 6. Fora do Escopo

- Configuração de limite de usos por plano/perfil de usuário.
- Histórico de explicações geradas.
- Explicação de código fora da Lesson Page.
- Alteração do contrato atual de rewarding.
- Explicação da resposta montada pelo aluno em questões drag-and-drop.
