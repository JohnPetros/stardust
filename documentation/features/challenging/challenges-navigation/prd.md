---
title: Challenges Navigation — PRD
status: draft
source:
  - type: direct-request
    ref: documentation/features/challenging/challenges-navigation/prd.md
last_updated_at: 2026-09-15
---

# PRD — Challenges Navigation — PRD

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O fluxo de **Challenges Navigation** organiza como o estudante navega entre desafios livres dentro da experiencia de execucao. O objetivo e reduzir atrito entre tentativas, facilitar descoberta de novos desafios e preservar contexto sem obrigar o usuario a voltar para a listagem principal.

**Objetivo:** permitir navegacao sequencial e navegacao exploratoria na pagina de desafio, mantendo consistencia com a ordem global dos desafios livres e exibindo progresso do usuario autenticado quando aplicavel.

**Problema resolvido:** antes da consolidacao desta feature, a pagina de desafio dependia de saidas manuais para a listagem, aumentando friccao para comparar, continuar ou trocar rapidamente de desafio.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | documentation/features/challenging/challenges-navigation/prd.md | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Navegacao sequencial entre desafios livres

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Navegacao sequencial entre desafios livres.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** o usuario consegue navegar para o desafio anterior ou seguinte sem sair da pagina atual, seguindo a ordem global dos desafios livres.

#### Regras de negocio

- A navegacao sequencial considera apenas desafios livres (`star_id = null`).
- Os controles usam a ordem global por criacao para resolver anterior e proximo.
- O fluxo preserva o guard de dirty state antes de trocar de desafio.
- Desafios vinculados a estrela nao entram neste fluxo.

##### Regras de Experiência

- Os botoes ficam desabilitados quando nao houver desafio anterior ou proximo.
- Tooltips explicam que a navegacao ignora filtros e segue a ordem global.

---

#### RP-02 — Sidebar lateral de navegacao de desafios

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Sidebar lateral de navegacao de desafios.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** o usuario consegue abrir uma sidebar lateral a partir do controle `Desafios` no header da pagina para buscar, filtrar e trocar rapidamente de desafio.

#### Regras de negocio

- A sidebar abre por overlay sem alterar a rota atual ate a selecao de um item.
- A listagem reutiliza o endpoint paginado de desafios livres e carrega 20 itens por pagina.
- A busca por titulo e case-insensitive e reinicia a paginacao ao mudar o termo.
- Os filtros permitem status de completude, dificuldade e categorias.
- O filtro de status e o contador `X/Y Resolvidos` aparecem apenas para usuarios autenticados.
- O contador de progresso usa o mesmo universo de desafios livres exibidos pela sidebar.
- Ao selecionar um desafio, a navegacao ocorre imediatamente.

##### Regras de Experiência

- O trigger principal da sidebar e o segmento clicavel `Desafios` do widget de navegacao.
- O carregamento inicial e sob demanda e usa skeletons em vez de spinner central.
- A sidebar fecha por overlay, botao dedicado e tecla `Esc`.
- O desafio atualmente aberto fica destacado na lista.
- O botao de filtros exibe badge com a quantidade de filtros ativos.
- A listagem exibe estado vazio amigavel e CTA de retry em caso de erro.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuario

### Navegacao sequencial

1. O usuario abre um desafio livre.
2. O sistema hidrata os slugs de anterior e proximo.
3. O usuario clica em `Anterior` ou `Proximo`.
4. Se houver dirty state, o sistema pede confirmacao antes de navegar.
5. Se nao houver bloqueio, o usuario e levado ao desafio adjacente.

### Navegacao exploratoria pela sidebar

1. O usuario clica em `Desafios` no header.
2. A sidebar abre e carrega a listagem, categorias e progresso sob demanda.
3. O usuario busca ou aplica filtros.
4. O sistema atualiza a listagem paginada e mantem destaque do desafio atual.
5. O usuario escolhe um item da lista.
6. A sidebar fecha e a pagina navega imediatamente para o novo desafio.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Navegacao aleatoria. |
| Escopo | Inclusao de desafios de estrela na sidebar. |
| Escopo | SSR da listagem da sidebar no payload inicial da pagina. |
| Escopo | Redesenho dos controles sequenciais alem do trigger da sidebar. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
