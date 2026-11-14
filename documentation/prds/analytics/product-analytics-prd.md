---
title: Analytics de Produto
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/33
last_updated_at: 2026-06-15
---

# PRD — Analytics de Produto

Disponibiliza para: analytics; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

**Analytics de Produto** é a instrumentação da plataforma Stardust para rastreamento do comportamento dos usuários, integrada ao PostHog. A feature cobre dois níveis: eventos de negócio capturados via jobs assíncronos no servidor, e comportamento de sessão (pageviews, gravações, interações) capturado no browser.

**Problema que resolve:** sem instrumentação, decisões de produto são baseadas em intuição — não é possível medir o funil de ativação, taxa de conclusão de lições e desafios, retenção ou impacto de mudanças na plataforma.

**Valor entregue:** visibilidade do comportamento real dos usuários para orientar priorização de produto, identificar atritos no core loop (lição → desafio → progressão) e medir engajamento e retenção ao longo do tempo.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/33 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Rastreamento de Eventos de Negócio

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Rastreamento de Eventos de Negócio.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O sistema registra automaticamente os eventos relevantes do comportamento do usuário na plataforma, enviando-os para o PostHog.

##### Regras de Negócio
- **Cobertura mínima:** Foram instrumentados cadastro de conta, login, criação de perfil, desbloqueio de estrela, conclusão de planeta, conclusão do espaço, recompensa recebida, conclusão de desafio, publicação de desafio, exclusão de desafio, compra de item na loja e envio de feedback.
- **Eventos server-certified:** Eventos críticos são rastreados a partir do servidor após confirmação do domínio e persistência relevante.
- **Sem duplicatas:** Eventos server-side usam o identificador da ocorrência Inngest como `$insert_id`, reduzindo duplicidade em retries.
- **Falha isolada:** O envio acontece em job assíncrono via Inngest; falhas no provider de analytics não interrompem a requisição original do usuário.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-02 — Identificação do Usuário

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Identificação do Usuário.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** A sessão anônima do browser é associada ao usuário autenticado no PostHog.

##### Regras de Negócio
- **Vínculo após login:** Login e cadastro social identificam o usuário no provider de analytics com `id` e `email`.
- **Disponibilidade imediata:** O browser inicializa PostHog com bootstrap da conta autenticada quando ela já existe no primeiro render.
- **Reset no logout:** Logout desvincula o perfil identificado para evitar herança de sessão por outro usuário.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-03 — Instrumentação do Browser

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Instrumentação do Browser.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O browser captura automaticamente navegação e sessão do usuário na aplicação web.

##### Regras de Negócio
- **Pageviews automáticos:** Pageviews são capturados automaticamente pelo SDK client-side.
- **Gravação de sessões:** Session recording foi habilitado com mascaramento de inputs.
- **Feature flags:** A integração client-side com PostHog permite avaliação por usuário identificado.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-04 — Relatório de Usuários Ativos Diários

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Relatório de Usuários Ativos Diários.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O painel administrativo exibe DAU consultando o PostHog via server, substituindo a consulta ao banco legado.

##### Regras de Negócio
- **Segmentação por plataforma:** O relatório mantém segmentação por `web` e `mobile`.
- **Período configurável:** O contrato existente com janela de dias foi preservado para o Studio.
- **Remoção do tracking legado:** O fluxo manual de visitas e a tabela `users_visits` foram removidos por migration.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| analytics | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

### 3. Fluxo de Usuário (User Flow)

#### JN-01 — Rastreamento durante uso da plataforma:

1. O usuário autenticado realiza qualquer ação de negócio relevante (completa uma lição, conclui um desafio, compra um item na loja, etc.).
2. O sistema processa a ação normalmente.
3. O sistema registra o evento correspondente no provider de analytics de forma assíncrona.
   - **Sucesso:** O evento aparece no painel de analytics em até alguns segundos.
   - **Falha no envio:** O fluxo principal do usuário não é afetado; o evento é tratado pelo fluxo de falha do job.

#### JN-02 — Identificação após autenticação:

1. O usuário realiza login ou cadastro.
2. O sistema autentica a sessão e carrega o perfil.
3. O sistema vincula a sessão anônima do browser ao perfil identificado no provider de analytics.
   - **Sucesso:** Eventos subsequentes da sessão ficam associados ao usuário identificado.
   - **Falha:** A sessão permanece anônima; os eventos continuam sendo registrados sem vínculo ao perfil.

#### JN-03 — Consulta do relatório de DAU (administrador):

1. O administrador acessa o painel Studio e navega até o relatório de usuários ativos.
2. O server consulta o PostHog para obter os dados de DAU pelo período selecionado.
3. O Studio exibe o relatório segmentado por plataforma (web e mobile).
   - **Sucesso:** O relatório é exibido com os dados atualizados do provider de analytics.
   - **Falha:** O sistema propaga erro do provider para o fluxo existente de resposta.

#### JN-04 — Feature flag por segmento:

1. O administrador ativa uma feature flag no painel do PostHog para um segmento de usuários.
2. O usuário do segmento acessa a plataforma web.
3. O SDK client-side avalia a flag com base no perfil identificado do usuário.
   - **Flag ativa:** A feature é exibida ou habilitada para o usuário.
   - **Flag inativa:** O comportamento padrão é mantido.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Criação de dashboards ou visualizações de analytics dentro da própria plataforma Stardust — os dados são consumidos diretamente no painel do provider de analytics. |
| Escopo | Rastreamento de eventos no `studio` (painel administrativo) — o foco é o comportamento do usuário final na `web`. |
| Escopo | Rastreamento de eventos do módulo de ranking. |
| Escopo | Rastreamento de ações administrativas como edição e exclusão de guias do manual. |
| Escopo | Rastreamento de eventos de infraestrutura como geração de áudio e operações de storage. |
| Escopo | Conformidade com GDPR, LGPD ou qualquer mecanismo de consentimento de cookies — tratado como iniciativa separada. |
| Escopo | Aplicativo mobile — o escopo implementado captura web; a segmentação `mobile` permanece no contrato do relatório para compatibilidade e dados futuros. |
| Escopo | Testes A/B além do uso de feature flags. |
| Escopo | Exportação ou sincronização de dados do provider de analytics para o banco de dados da plataforma. |
| Escopo | Alertas ou notificações automáticas disparadas com base em métricas de analytics. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
