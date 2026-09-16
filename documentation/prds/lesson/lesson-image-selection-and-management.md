---
title: Seleção e Gestão de Imagens de Lição
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/32
last_updated_at: 2026-05-27
---

# PRD — Seleção e Gestão de Imagens de Lição

Disponibiliza para: lesson; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O produto agora concentra o upload de imagens em um fluxo de URL assinada com upload direto ao Supabase Storage. Isso cobre tanto a gestao administrativa de imagens de licao no Studio quanto o envio opcional de screenshots no widget de feedback do Web, reduzindo trafego binario pelo backend e mantendo controles de permissao por contexto.

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/32 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Selecionar imagem existente do acervo `story` em historias e quizzes.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Selecionar imagem existente do acervo `story` em historias e quizzes..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Pesquisar imagens por nome dentro do acervo `story`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Pesquisar imagens por nome dentro do acervo `story`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Paginar o acervo com carga inicial mais leve: `12` imagens por pagina.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Paginar o acervo com carga inicial mais leve: `12` imagens por pagina..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-04 — Pre-carregar thumbnails apos a primeira pagina para melhorar a performance percebida.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Pre-carregar thumbnails apos a primeira pagina para melhorar a performance percebida..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-05 — Enviar nova imagem para o acervo `story` com URL assinada e upload direto ao Supabase Storage.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Enviar nova imagem para o acervo `story` com URL assinada e upload direto ao Supabase Storage..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-06 — Validar `folderPath`, `fileName`, extensao permitida e conflito de nome antes da emissao da URL assinada.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Validar `folderPath`, `fileName`, extensao permitida e conflito de nome antes da emissao da URL assinada..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-07 — Limitar uploads de imagem do Studio a `5 MB`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Limitar uploads de imagem do Studio a `5 MB`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-08 — Atualizar o acervo apos upload e apos remocao.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Atualizar o acervo apos upload e apos remocao..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-09 — Selecionar automaticamente a imagem recem-enviada.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Selecionar automaticamente a imagem recem-enviada..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-10 — Manter `panda.jpg` como fallback quando a imagem obrigatoria estiver ausente ou quando a imagem selecionada for removida.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Manter `panda.jpg` como fallback quando a imagem obrigatoria estiver ausente ou quando a imagem selecionada for removida..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-11 — Permitir remocao de imagens diretamente do acervo com o dialog preservado.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir remocao de imagens diretamente do acervo com o dialog preservado..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-12 — Copiar o nome da imagem a partir do card do acervo.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Copiar o nome da imagem a partir do card do acervo..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-13 — Permitir screenshot opcional no feedback do Web com upload direto ao Supabase Storage antes do envio do formulario.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Permitir screenshot opcional no feedback do Web com upload direto ao Supabase Storage antes do envio do formulario..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-14 — Preservar o texto do feedback quando a emissao da URL assinada ou o upload da screenshot falharem.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Preservar o texto do feedback quando a emissao da URL assinada ou o upload da screenshot falharem..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-15 — Autorizar `POST /storage/signed-upload-url` para usuarios autenticados comuns apenas em `images/feedback-reports`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Autorizar `POST /storage/signed-upload-url` para usuarios autenticados comuns apenas em `images/feedback-reports`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-16 — Manter `god account` obrigatorio para uploads assinados nas demais pastas administrativas.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Manter `god account` obrigatorio para uploads assinados nas demais pastas administrativas..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-17 — Padronizar o Studio para o mesmo fluxo tecnico do Web: service REST emite a URL assinada e provider client-side envia o binario.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Padronizar o Studio para o mesmo fluxo tecnico do Web: service REST emite a URL assinada e provider client-side envia o binario..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-18 — Remover o endpoint legado publico `POST /storage/files/:folder` apos a migracao de Web e Studio.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Remover o endpoint legado publico `POST /storage/files/:folder` apos a migracao de Web e Studio..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-19 — Preservar upload server-side interno para fluxos administrativos e operacionais que ainda dependem de `FileStorageProvider.upload(...)`.

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Preservar upload server-side interno para fluxos administrativos e operacionais que ainda dependem de `FileStorageProvider.upload(...)`..

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

- Comportamento registrado no checklist ou na referência legada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| lesson | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada não registrada no legado

1. 🚧 Em construção — o fluxo não está documentado no PRD legado.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Renomeacao de imagens ja cadastradas. |
| Escopo | Organizacao do acervo por tags, categorias ou novas pastas. |
| Escopo | Bloqueio de remocao para imagens em uso. |
| Escopo | Alterar o fluxo funcional de envio do feedback sem screenshot. |
| Escopo | Alterar bucket, schema, RLS ou estrutura de banco para storage. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
