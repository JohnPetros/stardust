---
title: API Keys Manager
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/27
last_updated_at: 2026-04-18
---

# PRD — API Keys Manager

Disponibiliza para: auth; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Entregar um gerenciador de API keys dentro do perfil do usuario para permitir integracoes externas com o StarDust sem depender de credenciais de uso humano, mantendo controle de acesso, revogacao e exibicao segura do segredo.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/27

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/27 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

- Permitir que usuarios com insignia de Engenheiro gerem credenciais para scripts, CLIs e integracoes externas.
- Garantir que o segredo completo seja exibido apenas uma vez, reduzindo risco operacional e de seguranca.
- Dar autonomia para renomear e revogar chaves sem suporte manual.
- Centralizar o acesso ao recurso dentro da area privada do perfil.

### Evidências legadas de validação

- [x] `npm run check:code` na raiz.
- [x] `npm run check:types` na raiz.
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

#### RP-01 — Disponibilizar uma pagina dedicada para gerenciamento de API keys no perfil.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Disponibilizar uma pagina dedicada para gerenciamento de API keys no perfil..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Restringir o acesso da pagina ao proprio usuario autenticado com insignia de Engenheiro.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Restringir o acesso da pagina ao proprio usuario autenticado com insignia de Engenheiro..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Permitir criar API keys informando apenas um nome.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir criar API keys informando apenas um nome..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-04 — Exibir o segredo completo apenas na resposta de criacao.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Exibir o segredo completo apenas na resposta de criacao..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-05 — Persistir somente hash e preview da chave no backend.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Persistir somente hash e preview da chave no backend..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-06 — Listar apenas API keys ativas do usuario, em ordem decrescente de criacao.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listar apenas API keys ativas do usuario, em ordem decrescente de criacao..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-07 — Permitir renomear apenas chaves do proprio usuario.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir renomear apenas chaves do proprio usuario..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-08 — Permitir revogar apenas chaves do proprio usuario com remocao imediata da listagem ativa.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir revogar apenas chaves do proprio usuario com remocao imediata da listagem ativa..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-09 — Exibir atalho de acesso ao gerenciador na area de links do perfil.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Exibir atalho de acesso ao gerenciador na area de links do perfil..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-10 — Web: nova pagina privada em `/profile/[userSlug]/api-keys` com acesso restrito ao proprio usuario engenheiro.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Web: nova pagina privada em `/profile/[userSlug]/api-keys` com acesso restrito ao proprio usuario engenheiro..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-11 — Web: gerenciador com estados de carregamento, lista, vazio, criacao com exibicao unica do segredo, renomeacao e revogacao sem recarregar a pagina.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Web: gerenciador com estados de carregamento, lista, vazio, criacao com exibicao unica do segredo, renomeacao e revogacao sem recarregar a pagina..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-12 — Web: novo atalho no perfil para abrir o gerenciador de API keys.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Web: novo atalho no perfil para abrir o gerenciador de API keys..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-13 — Server: endpoints autenticados em `/auth/api-keys` para listar, criar, renomear e revogar chaves.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Server: endpoints autenticados em `/auth/api-keys` para listar, criar, renomear e revogar chaves..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-14 — Core e banco: modelo de API key com persistencia segura usando hash e preview mascarado, sem armazenar o segredo completo.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Core e banco: modelo de API key com persistencia segura usando hash e preview mascarado, sem armazenar o segredo completo..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| auth | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada não registrada no legado

1. 🚧 Em construção — o fluxo não está documentado no PRD legado.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo não registrado | 🚧 Em construção — nenhuma exclusão explícita foi localizada no documento legado. |

### Decisões descartadas durante a definição

- O consumo no web foi mantido no `AuthService`, evitando fragmentar a fronteira REST do modulo `auth`.
- A listagem publica exposta ao frontend foi limitada aos dados seguros da chave, preservando apenas identificacao, preview e data de criacao.
- A revogacao foi mantida como soft delete para impedir reexibicao em listagens sem perder rastreabilidade no banco.
