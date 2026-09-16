---
title: Explicação de bloco de código por IA
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/25
last_updated_at: 2026-04-15
---

# PRD — Explicação de bloco de código por IA

Disponibiliza para: lesson; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O bloco de código da Lesson Page (presente na Story e no Quiz) não oferece suporte pedagógico
contextual ao aluno quando ele não entende o código exibido. Isso gera abandono silencioso e
reduz o aproveitamento do conteúdo.

O objetivo desta feature é adicionar um botão de IA ao componente `CodeBlock` que abre um
dialog com o código à esquerda e uma explicação gerada por IA à direita, com cache local por
índice do bloco e controle de uso diário limitado a 10 por usuário via Redis.

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/25 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

🚧 Em construção — objetivos e métricas estruturados não estão registrados no documento legado.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Botão de IA no CodeBlock

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Botão de IA no CodeBlock.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Exibir botão de IA no componente `CodeBlock`, disponível tanto na Story quanto
no Quiz, como ponto de entrada para a explicação gerada.

##### Regras de Negócio
- **Visibilidade:** O botão de IA deve aparecer ao lado dos botões existentes (Resetar, Copiar,
  Executar) em todo bloco de código com `type: 'code'`.
- **Escopo:** O botão está disponível na Story (blocos narrativos) e no Quiz (conteúdo
  condicional de questão).

##### Regras de Experiência

- **Consistência visual:** O botão deve seguir o mesmo padrão visual dos botões existentes
  no `CodeBlock`.
- **Acessibilidade:** O botão deve ser acionável por teclado e ter label descritivo para
  leitores de tela.

---

#### RP-02 — Cache Local de Explicações

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Cache Local de Explicações.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Evitar consumo desnecessário de usos diários para blocos de código já explicados
anteriormente, armazenando a explicação no localStorage por índice do bloco.

##### Regras de Negócio
- **Chave de cache:** `lesson:code-explanation:{chunkIndex}`, onde `chunkIndex` é a posição
  do bloco em `story.chunks[]` (começando do zero).
- **Cache HIT:** Se a explicação já existe no localStorage, o `CodeExplanationDialog` abre
  diretamente, sem AlertDialog e sem consumir uso do contador.
- **Cache MISS:** Prosseguir para verificação de saldo no servidor.
- **Atualização:** Após geração bem-sucedida (incluindo Retry), a explicação é salva/substituída
  no localStorage.

##### Regras de Experiência

- **Abertura imediata:** No cache HIT, o Dialog abre sem nenhuma fricção intermediária.

---

#### RP-03 — Verificação de Saldo Diário

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Verificação de Saldo Diário.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Controlar o uso diário da feature por usuário via Redis, consultando o saldo
somente quando o usuário demonstra intenção de uso (clique no botão) e não há cache local.

##### Regras de Negócio
- **Chave Redis:** `profile:{userId}:code-explanation-remaining-uses`.
- **Saldo inicial:** Chave ausente no Redis equivale a saldo cheio (10 usos). A chave é criada
  automaticamente no primeiro uso do dia. ⚠️ Confirmar TTL: meia-noite (dia calendário) vs. 24h
  a partir do primeiro uso.
- **Consulta sob demanda:** O saldo é buscado apenas no momento do clique no botão AI (sem cache).
- **Saldo > 0:** Exibir AlertDialog de aviso antes de prosseguir.
- **Saldo = 0:** Exibir AlertDialog de bloqueio diretamente, sem permitir geração.
- **Decremento:** Cada geração nova (sem cache) decrementa o contador diário no Redis.

##### Regras de Experiência

- **AlertDialog de aviso:** Mensagem "Você usará 1 de N usos restantes hoje. Deseja continuar?",
  com ações de confirmar e cancelar.
- **AlertDialog de bloqueio:** Mensagem informando esgotamento do limite diário, sem ação de
  prosseguir.
- **Acessibilidade:** Ambos os dialogs devem permitir navegação por teclado e foco inicial
  previsível.

---

#### RP-04 — Dialog de Explicação

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Dialog de Explicação.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Exibir o código do bloco e a explicação gerada pela IA em um dialog de duas
colunas, com opção de regenerar a explicação.

##### Regras de Negócio
- **Conteúdo:** Código do bloco (read-only) à esquerda e explicação gerada à direita.
- **Retry:** O botão de Retry permite regenerar a explicação, consumindo mais 1 uso diário.
- **Retry com aviso:** Antes de regenerar, exibir AlertDialog: "Isso consumirá mais 1 de seus
  N usos restantes. Deseja continuar?" O valor de N vem do retorno do último POST bem-sucedido,
  mantido em estado local.
- **Retry bloqueado:** Se ao confirmar o Retry o servidor retornar 403, fechar o Dialog e exibir
  AlertDialog de bloqueio.
- **Atualização pós-Retry:** Explicação atualizada substitui o valor anterior no localStorage.

##### Regras de Experiência

- **Layout:** Duas colunas — código à esquerda, explicação à direita.
- **Estado de loading:** Exibir indicador de carregamento enquanto a explicação é gerada.
- **Botão de Retry:** Visível no Dialog após a explicação ser exibida.
- **Acessibilidade:** Dialog deve permitir fechamento por teclado (Esc) e foco inicial previsível.

---

#### RP-05 — Geração de Explicação via IA (Server)

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Geração de Explicação via IA (Server).

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Processar a requisição de explicação no servidor via workflow Mastra, integrando
LLM e controle de saldo Redis.

##### Regras de Negócio
- **Entrada:** `{ code: string, userId: string }`.
- **Validação de saldo:** Antes de acionar o LLM, verificar saldo Redis. Retornar 403 se
  `remainingUses = 0`.
- **Geração:** Acionar `MastraExplainCodeWorkflow` com o código do bloco.
- **Decremento:** Após geração bem-sucedida, decrementar `profile:{userId}:code-explanation-remaining-uses`
  no Redis (criando a chave com TTL se ausente).
- **Retorno:** `{ explanation: string, remainingUses: number }`.

##### Regras de Experiência

- **Confiabilidade:** Em caso de falha na geração, não exibir explicação parcial; retornar erro
  tratável pelo widget.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| lesson | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuário (User Flow)

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

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Configuração de limite de usos por plano/perfil de usuário. |
| Escopo | Histórico de explicações geradas. |
| Escopo | Explicação de código fora da Lesson Page. |
| Escopo | Alteração do contrato atual de rewarding. |
| Escopo | Explicação da resposta montada pelo aluno em questões drag-and-drop. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
