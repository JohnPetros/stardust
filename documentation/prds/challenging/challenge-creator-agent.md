---
title: Agente criador de desafios
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/3
last_updated_at: 2026-02-28
---

# PRD — Agente criador de desafios

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O **Agente Criador de Desafios** é uma funcionalidade de backend automatizada projetada para manter o catálogo de desafios do StarDust dinâmico e engajador. Através de Jobs agendados e Inteligência Artificial, o sistema gerará novos exercícios de programação diariamente, garantindo que usuários recorrentes sempre encontrem conteúdo inédito para praticar.

**Objetivo Principal:** Eliminar a percepção de estagnação do catálogo e reduzir a dependência de curadoria manual.
**Valor Entregue:** Aumento do engajamento exploratório e oferta contínua de material de estudo prático.

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/3 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Geração Automática de Desafios

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Geração Automática de Desafios.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Mecanismo autônomo para criação e persistência de novos desafios de programação.

##### Regras de Negócio
- **Agendamento da Geração (Cron):** O sistema deve executar um Job de geração **diariamente** (uma vez a cada 24 horas).
- **Volume de Geração:** A cada execução, deve ser gerado **1 (um) único desafio**.
- **Integração com IA:** O Job deve solicitar o conteúdo ao módulo centralizado `ai` (utilizando Vercel AI SDK), fornecendo um prompt que instrua a criação de: Enunciado, Dificuldade (Fácil/Médio/Difícil), Restrições e Critérios de Validação (Testes).
- **Marcação de Novidade:** Todo desafio gerado automaticamente deve ser persistido no banco de dados com a flag `isNew` definida como `true`.
- **Persistência:** O desafio deve ser salvo no módulo `challenging` com todos os campos obrigatórios preenchidos pela resposta da IA.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Gestão do Ciclo de Vida da Novidade

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Gestão do Ciclo de Vida da Novidade.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Controle temporal da flag que indica se um desafio é considerado lançamento.

##### Regras de Negócio
- **Agendamento de Limpeza (Cron):** O sistema deve executar um Job de verificação diariamente (pode ser o mesmo job de geração ou um dedicado).
- **Regra de Expiração:** O sistema deve identificar desafios onde a data de criação (`createdAt`) exceda **3 dias** e atualizar a flag `isNew` para `false`.
- **Imutabilidade Histórica:** A remoção da flag `isNew` não deve alterar ou remover o desafio do catálogo, apenas mudar seu estado visual.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Visualização de Novos Desafios

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Visualização de Novos Desafios.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descrição:** Indicação visual para o usuário de que existem desafios frescos disponíveis.

##### Regras de Experiência

- **Badge "Novo":** Na listagem de desafios, os cards que possuírem `isNew: true` devem exibir um badge ou etiqueta visual com o texto "Novo" (ou ícone correspondente).
- **Destaque Visual:** O badge deve utilizar uma cor de destaque (ex: cor primária ou de atenção) para diferenciar-se dos demais elementos do card.
- **Sem Notificação Ativa ao Usuário Final:** Não deve ser enviada notificação por push, e-mail ou central de notificações para usuários finais; a descoberta é passiva ao navegar pela lista.

---

#### RP-04 — Notificação Operacional

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Notificação Operacional.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Notificação interna para monitoramento da publicação automática de desafios.

##### Regras de Negócio
- **Notificação no Discord:** Após a criação automática de um desafio, o sistema deve enviar uma mensagem para o canal de monitoramento no Discord com título, autor e link do desafio.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

### 3. Fluxo de Usuário (User Flow)

#### JN-01 — Descoberta de Novo Desafio

1. O usuário acessa a página de **Desafios** (`/challenges`).
2. O sistema carrega a lista de desafios disponíveis.
3. O usuário visualiza cards de desafios.
4. O sistema valida a propriedade `isNew`:
   - **Verdadeiro:** O card exibe o badge "Novo" em destaque.
   - **Falso:** O card é exibido normalmente, sem destaque.
5. O usuário clica no card para iniciar o desafio.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | **Personalização:** Geração de desafios baseada no nível ou histórico específico do usuário. |
| Escopo | **Streak/Gamificação Extra:** Integração da geração com sistemas de ofensiva ou recompensas especiais (além do XP padrão). |
| Escopo | **Notificações Ativas ao Usuário Final:** Envio de e-mails, push notifications ou central de notificações avisando sobre o novo desafio. |
| Escopo | **Revisão Humana:** Interface para aprovação manual dos desafios antes da publicação. |
| Escopo | **Edição de IA:** Capacidade de regenerar um desafio específico se ele for "ruim". |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
