---
title: Sign Up
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/34
last_updated_at: 2026-06-17
---

# PRD — Sign Up

Disponibiliza para: auth; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

A pagina de cadastro do StarDust entrega agora um fluxo guiado e confiavel para criacao de conta no navegador, com validacao progressiva de nome, e-mail e senha, feedback imediato de erro e confirmacao final apenas quando o sistema reconhece a criacao real do usuario.

Tambem foi concluida a cobertura automatizada desse fluxo em navegador real, reduzindo risco de regressao nos pontos mais sensiveis da jornada de cadastro sem depender do backend real nem do realtime real.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/34 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

- Menor risco de regressao no onboarding de novos usuarios.
- Maior confianca de que a experiencia real do navegador respeita o comportamento esperado de cadastro.
- Confirmacao mais segura do estado de sucesso, evitando concluir a jornada apenas pelo aceite HTTP inicial.
- Melhor previsibilidade para manutencoes futuras no fluxo de cadastro, com cobertura automatizada dos cenarios criticos.

---

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Fluxo progressivo de cadastro com revelacao sequencial de nome, e-mail, senha e botao de envio.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Fluxo progressivo de cadastro com revelacao sequencial de nome, e-mail, senha e botao de envio..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Validacoes e mensagens de feedback preservadas para nome, e-mail e senha.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Validacoes e mensagens de feedback preservadas para nome, e-mail e senha..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Submissao do cadastro integrada ao contrato existente de criacao de conta.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Submissao do cadastro integrada ao contrato existente de criacao de conta..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-04 — Sucesso final exibido apenas apos confirmacao do evento de criacao do usuario.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Sucesso final exibido apenas apos confirmacao do evento de criacao do usuario..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-05 — Eventos de outro usuario nao concluem o cadastro indevidamente.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Eventos de outro usuario nao concluem o cadastro indevidamente..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-06 — Reenvio de e-mail de confirmacao com loading e feedback de sucesso/erro.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Reenvio de e-mail de confirmacao com loading e feedback de sucesso/erro..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-07 — Link de navegacao para login mantido durante o formulario.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Link de navegacao para login mantido durante o formulario..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-08 — Suite automatizada de navegador real para a rota `/auth/sign-up`, coexistindo com os testes Jest ja existentes.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Suite automatizada de navegador real para a rota `/auth/sign-up`, coexistindo com os testes Jest ja existentes..

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

- Nenhuma divergencia de produto em relacao ao comportamento esperado da jornada de cadastro.
