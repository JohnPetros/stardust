---
title: Challenges Management With MCP
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/26
last_updated_at: 2026-04-21
---

# PRD — Challenges Management With MCP

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Entregar um ponto unico de integracao MCP no `server` para que engenheiros consigam criar, listar, atualizar e excluir desafios do StarDust com autenticacao por API key, sem depender da interface web e sem abrir acesso administrativo amplo a outros modulos.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/26

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/26 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

- Permitir integracao externa autenticada para gestao de desafios pelo protocolo MCP.
- Garantir que apenas usuarios com insignia de Engenheiro consigam operar o fluxo.
- Manter criacao e edicao de desafios consistentes com as regras ja existentes do dominio `challenging`.
- Reduzir risco operacional forcando criacao inicial como rascunho e mantendo ownership por autor.

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

#### RP-01 — Expor um endpoint MCP HTTP unico em `/mcp`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Expor um endpoint MCP HTTP unico em `/mcp`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Autenticar o MCP com API key enviada em `X-Api-Key`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Autenticar o MCP com API key enviada em `X-Api-Key`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Restringir o acesso a usuarios com insignia de Engenheiro.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Restringir o acesso a usuarios com insignia de Engenheiro..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-04 — Disponibilizar instrucoes oficiais de criacao antes do fluxo de mutacao.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Disponibilizar instrucoes oficiais de criacao antes do fluxo de mutacao..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-05 — Permitir listar desafios com filtros e paginacao no catalogo publico.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir listar desafios com filtros e paginacao no catalogo publico..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-06 — Permitir criar desafio sempre como rascunho e com autoria da conta autenticada.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir criar desafio sempre como rascunho e com autoria da conta autenticada..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-07 — Permitir consultar o problema de desafio em cache para apoiar criacao e edicao.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir consultar o problema de desafio em cache para apoiar criacao e edicao..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-08 — Permitir atualizar apenas desafios do proprio autor, incluindo mudanca de `isPublic`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir atualizar apenas desafios do proprio autor, incluindo mudanca de `isPublic`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-09 — Permitir excluir apenas desafios do proprio autor com confirmacao explicita.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir excluir apenas desafios do proprio autor com confirmacao explicita..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-10 — Server: endpoint MCP HTTP unico em `/mcp` dentro do `HonoApp`, protegido por `X-Api-Key`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Server: endpoint MCP HTTP unico em `/mcp` dentro do `HonoApp`, protegido por `X-Api-Key`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-11 — Server/Core: autenticacao de API key por hash SHA-256, com bloqueio para chaves invalidas ou revogadas.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Server/Core: autenticacao de API key por hash SHA-256, com bloqueio para chaves invalidas ou revogadas..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-12 — Server: validacao adicional de insignia de Engenheiro antes de liberar o MCP.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Server: validacao adicional de insignia de Engenheiro antes de liberar o MCP..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-13 — AI/Server: toolkit MCP do dominio `challenging` com tools para instrucoes de criacao, listagem, criacao em rascunho, atualizacao, exclusao, categorias e problema em cache.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: AI/Server: toolkit MCP do dominio `challenging` com tools para instrucoes de criacao, listagem, criacao em rascunho, atualizacao, exclusao, categorias e problema em cache..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-14 — Core/Database: reutilizacao dos use cases e contratos existentes com novo lookup de API key por hash.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Core/Database: reutilizacao dos use cases e contratos existentes com novo lookup de API key por hash..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-15 — Produto: desafios criados via MCP passam a nascer privados e vinculados ao engenheiro autenticado.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Produto: desafios criados via MCP passam a nascer privados e vinculados ao engenheiro autenticado..

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

- A autenticacao da API key ficou no modulo `auth`, enquanto a verificacao de insignia permaneceu na borda do `server`, preservando os limites entre dominio e aplicacao.
- O MCP reutiliza os use cases e repositorios existentes para evitar duplicacao de regra de negocio e manter o contrato alinhado ao REST.
- A criacao continua privada por padrao para reduzir risco de publicacao acidental durante fluxos assistidos por IA.
