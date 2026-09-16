---
title: Gerenciamento de Fontes de Desafios
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/12
last_updated_at: 2026-03-25
---

# PRD — Gerenciamento de Fontes de Desafios

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Disponibilizar no StarDust Studio uma pagina administrativa para gerenciar fontes de desafios, com listagem paginada, busca por titulo do desafio vinculado, criacao, edicao, exclusao, reordenacao e configuracao de instrucoes adicionais por fonte.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/12

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/12 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

- Centralizar a gestao de `challenge_sources` no Studio com fluxo CRUD essencial (create/read/update/delete).
- Garantir vinculo 1:1 entre `challenge` e `challenge_source` com erro de dominio claro para conflitos.
- Permitir cadastrar fontes sem vinculo obrigatorio de desafio, reduzindo friccao operacional para ingestao inicial.
- Permitir reorganizacao da ordem de exibicao das fontes com persistencia no backend.
- Exibir URLs de origem e URL publica do desafio para auditoria e operacao rapida.
- Permitir registrar instrucoes adicionais de adaptacao por fonte para orientar melhor a geracao dos desafios.

### Evidências legadas de validação

- [x] `npm run check:code` na raiz.
- [x] `npm run test` na raiz.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Listagem paginada de fontes no Studio.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listagem paginada de fontes no Studio..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Busca por titulo do desafio vinculado com debounce de 500ms.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Busca por titulo do desafio vinculado com debounce de 500ms..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Colunas de URL de origem, URL do desafio, desafio vinculado, status de uso e acoes.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Colunas de URL de origem, URL do desafio, desafio vinculado, status de uso e acoes..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-04 — URL do desafio composta com `ENV.stardustWebAppUrl` + `slug`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: URL do desafio composta com `ENV.stardustWebAppUrl` + `slug`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-05 — Estado de loading e estado vazio na listagem.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Estado de loading e estado vazio na listagem..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-06 — Dialog unico de criacao/edicao com campos `url` e `challengeId` opcional.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Dialog unico de criacao/edicao com campos `url` e `challengeId` opcional..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-07 — Dialog unico de criacao/edicao com campo opcional de instrucoes adicionais por fonte.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Dialog unico de criacao/edicao com campo opcional de instrucoes adicionais por fonte..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-08 — Acao de editar por linha na tabela de fontes.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Acao de editar por linha na tabela de fontes..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-09 — Fallback de exibicao para fontes sem desafio vinculado.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Fallback de exibicao para fontes sem desafio vinculado..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-10 — Coluna de instrucoes adicionais com truncamento e fallback `-`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Coluna de instrucoes adicionais com truncamento e fallback `-`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-11 — Validacao de URL com Zod e validacao de IDs com `idSchema`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Validacao de URL com Zod e validacao de IDs com `idSchema`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-12 — `additionalInstructions` aceito como campo opcional/nulo no contrato compartilhado.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: `additionalInstructions` aceito como campo opcional/nulo no contrato compartilhado..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-13 — Regra 1:1 (`challengeId` unico em source) com erro tratavel na UI sem fechar o dialog.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Regra 1:1 (`challengeId` unico em source) com erro tratavel na UI sem fechar o dialog..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-14 — Exclusao com confirmacao explicita e feedback visual de sucesso/erro.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Exclusao com confirmacao explicita e feedback visual de sucesso/erro..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-15 — Reordenacao com atualizacao otimista e rollback em caso de falha.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Reordenacao com atualizacao otimista e rollback em caso de falha..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-16 — Endpoints protegidos por autenticacao + permissao de conta `god`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Endpoints protegidos por autenticacao + permissao de conta `god`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-17 — Pagina registrada em rota dedicada e acessivel via Sidebar em "Desafios de codigo > Fontes".

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Pagina registrada em rota dedicada e acessivel via Sidebar em "Desafios de codigo > Fontes"..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-18 — Geracao assistida de desafios reaproveita instrucoes adicionais da fonte quando presentes.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Geracao assistida de desafios reaproveita instrucoes adicionais da fonte quando presentes..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-19 — Studio UI: pagina `ChallengeSources` com tabela, busca com debounce, paginacao, criacao/edicao via dialog reutilizado, exibicao truncada de instrucoes adicionais e exclusao com confirmacao.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Studio UI: pagina `ChallengeSources` com tabela, busca com debounce, paginacao, criacao/edicao via dialog reutilizado, exibicao truncada de instrucoes adicionais e exclusao com confirmacao..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-20 — Studio REST: metodos de `fetchChallengeSourcesList`, `createChallengeSource`, `updateChallengeSource`, `deleteChallengeSource` e `reorderChallengeSources`, agora transportando `additionalInstructions`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Studio REST: metodos de `fetchChallengeSourcesList`, `createChallengeSource`, `updateChallengeSource`, `deleteChallengeSource` e `reorderChallengeSources`, agora transportando `additionalInstructions`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-21 — Server Hono: `ChallengeSourcesRouter` com rotas de listagem, criacao, atualizacao, exclusao e reordenacao, todas protegidas por autenticacao e permissao `god`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Server Hono: `ChallengeSourcesRouter` com rotas de listagem, criacao, atualizacao, exclusao e reordenacao, todas protegidas por autenticacao e permissao `god`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-22 — Server REST controllers: handlers dedicados para os cinco fluxos de challenge sources, incluindo leitura e escrita de `additionalInstructions`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Server REST controllers: handlers dedicados para os cinco fluxos de challenge sources, incluindo leitura e escrita de `additionalInstructions`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-23 — Core: entidade/DTO de `ChallengeSource` com `challenge` opcional, `additionalInstructions`, erros de dominio e use cases de list/create/update/delete/reorder.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Core: entidade/DTO de `ChallengeSource` com `challenge` opcional, `additionalInstructions`, erros de dominio e use cases de list/create/update/delete/reorder..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-24 — Database/Supabase: repository, mapper, type e atualizacao de `Database.ts` com `challenge_sources`, incluindo persistencia de `additional_instructions`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Database/Supabase: repository, mapper, type e atualizacao de `Database.ts` com `challenge_sources`, incluindo persistencia de `additional_instructions`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-25 — Validation: `challengeSourceSchema` atualizado para aceitar `challengeId` opcional/nullable e `additionalInstructions` opcional/nullable.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Validation: `challengeSourceSchema` atualizado para aceitar `challengeId` opcional/nullable e `additionalInstructions` opcional/nullable..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-26 — AI: fluxo de geracao assistida passa a receber as instrucoes adicionais da fonte quando disponiveis.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: AI: fluxo de geracao assistida passa a receber as instrucoes adicionais da fonte quando disponiveis..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada não registrada no legado

1. 🚧 Em construção — o fluxo não está documentado no PRD legado.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo não registrado | 🚧 Em construção — nenhuma exclusão explícita foi localizada no documento legado. |

### Decisões descartadas durante a definição

- Reordenacao foi entregue por controles de mover para cima/baixo (sem drag and drop), mantendo endpoint dedicado e persistencia otimista.
- Ordenacao da listagem no backend foi fixada por `position` ascendente para manter previsibilidade da tabela.
- Foram adicionados testes unitarios para core e studio desse fluxo, alem do escopo originalmente previsto.
- As instrucoes adicionais passaram a ser consumidas imediatamente no fluxo de IA de criacao de desafios, reduzindo trabalho manual de adaptacao.
