---
title: MCP Server para Gerenciamento de Desafios
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/26
last_updated_at: 2026-08-01
---

# PRD — MCP Server para Gerenciamento de Desafios

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

**MCP Server para Gerenciamento de Desafios** entrega uma integracao do Stardust com o protocolo MCP para que engenheiros autenticados por API key consigam consultar instrucoes oficiais, listar desafios, criar rascunhos, atualizar desafios proprios e excluir desafios proprios a partir do cliente MCP de sua preferencia.

**Problema que resolve:** Gerenciar desafios fora da interface web exige repetir operacoes manuais e conhecer detalhes estruturais do dominio. O MCP reduz esse atrito com um contrato autenticado, guiado por tools e alinhado aos use cases existentes do sistema.

**Objetivo principal:** Permitir que engenheiros com permissao de gerenciamento conectem a IA de sua escolha ao Stardust e operem o ciclo de criacao e manutencao de desafios com seguranca, ownership correto e validacao consistente.

**Valor entregue:**
- Integracao com clientes MCP externos usando um endpoint HTTP unico em `/mcp`
- Autenticacao por API key com hash SHA-256 e validacao de insignia de Engenheiro
- Tool oficial com instrucoes completas para criacao de desafios validos
- Criacao sempre como rascunho com autoria preservada da conta autenticada
- Listagem, atualizacao e exclusao restritas ao autor autenticado

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/26 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Conectar ao Stardust via MCP

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Conectar ao Stardust via MCP.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O engenheiro consegue conectar seu cliente MCP ao Stardust informando a URL do servidor e sua API key.

##### Regras de Negocio
- **Autenticacao obrigatoria:** Apenas usuarios com insignia de Engenheiro podem se conectar.
- **API key:** O engenheiro gera sua API key no fluxo ja existente do produto e a informa no cliente MCP.
- **Formato da key:** `sk_<random_base62_32chars>` — exibida uma unica vez na geracao e armazenada como SHA-256 no banco.
- **Gerenciamento:** O engenheiro pode gerar, visualizar e revogar suas keys pelos fluxos existentes do sistema.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Obter instrucoes de criacao de desafio

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Obter instrucoes de criacao de desafio.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** A IA consegue buscar as regras, estrutura esperada e exemplos para gerar um desafio valido no Stardust.

##### Regras de Negocio
- **Contexto completo:** As instrucoes retornam campos obrigatorios, formatos aceitos e exemplos de casos de teste validos.
- **Base para geracao:** A IA usa essas instrucoes antes do fluxo de publicacao ou edicao.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Publicar desafio como rascunho

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Publicar desafio como rascunho.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Apos revisar o desafio gerado pela IA, o engenheiro pode publica-lo na plataforma como rascunho.

##### Regras de Negocio
- **Rascunho por padrao:** O desafio e salvo como rascunho — nao fica visivel para outros usuarios ate publicacao manual.
- **Validacao dos dados:** O sistema rejeita a publicacao se campos obrigatorios estiverem ausentes ou invalidos.
- **Autoria preservada:** O desafio e associado a conta do engenheiro autenticado via API key.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-04 — Listar desafios pelo MCP

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listar desafios pelo MCP.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** A IA consegue listar desafios usando filtros e paginacao para apoiar criacao, revisao e manutencao.

##### Regras de Negocio
- **Catalogo publico:** A listagem retorna o catalogo publico no fluxo MCP.
- **Contexto do usuario:** Quando houver conta autenticada, a resposta pode ser enriquecida com status de conclusao.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-05 — Atualizar desafio criado pelo engenheiro

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Atualizar desafio criado pelo engenheiro.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** A IA consegue atualizar os dados de um desafio criado pelo engenheiro autenticado apos revisao ou solicitacao de ajuste.

##### Regras de Negocio
- **Restricao de autoria:** O engenheiro so pode atualizar desafios criados por ele mesmo.
- **Validacao dos dados:** O sistema rejeita a atualizacao se campos obrigatorios estiverem ausentes ou invalidos.
- **Controle de estado:** O fluxo preserva o autor e permite alterar `isPublic` apenas quando a conta autenticada for a autora.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-06 — Excluir desafio criado pelo engenheiro

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Excluir desafio criado pelo engenheiro.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** A IA consegue excluir um desafio criado pelo engenheiro autenticado mediante confirmacao explicita.

##### Regras de Negocio
- **Restricao de autoria:** O engenheiro so pode excluir desafios criados por ele mesmo.
- **Confirmacao obrigatoria:** A exclusao exige `confirmacao: true` no payload.
- **Resposta segura:** O sistema responde como nao encontrado quando o desafio nao existir ou nao pertencer a conta autenticada.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuario

**Conectar o cliente MCP ao Stardust:**

1. O engenheiro gera ou reutiliza uma API key valida.
2. Configura o cliente MCP com a URL do servidor e a API key.
3. O endpoint `/mcp` autentica a key, valida a insignia e libera as tools do dominio `challenging`.

---

**Criar e gerenciar um desafio:**

1. O engenheiro pede a IA para criar ou ajustar um desafio.
2. A IA busca as instrucoes oficiais de criacao do Stardust.
3. A IA gera o desafio completo na conversa.
4. O engenheiro revisa e solicita ajustes se necessario.
5. Quando satisfeito, publica o desafio como rascunho.
6. Depois disso, pode listar, atualizar ou excluir desafios proprios pelo mesmo fluxo MCP.
7. O engenheiro acessa a plataforma web para revisao final e publicacao manual quando necessario.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Publicacao automatica obrigatoria como publico no momento da criacao. |
| Escopo | Criacao de desafios por usuarios sem insignia de Engenheiro. |
| Escopo | Visualizacao, edicao ou exclusao de desafios privados de outros engenheiros. |
| Escopo | Exposicao via MCP de outros dominios como `lesson`, `manual` ou `space`. |
| Escopo | Substituicao do pipeline HTTP atual do `HonoApp` por outro adapter. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
