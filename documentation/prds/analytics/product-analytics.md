# PRD — Analytics de Produto

- **Módulo:** `analytics`
- **Milestone:** [#33 — Analytics de Produto](https://github.com/JohnPetros/stardust/milestone/33)
- **Status:** open
- **Atualizado em:** 2026-06-15T00:16:08Z

## Definição do produto

### 1. Visão Geral

**Analytics de Produto** é a instrumentação da plataforma Stardust para rastreamento do comportamento dos usuários, integrada ao PostHog. A feature cobre dois níveis: eventos de negócio capturados via jobs assíncronos no servidor, e comportamento de sessão (pageviews, gravações, interações) capturado no browser.

**Problema que resolve:** sem instrumentação, decisões de produto são baseadas em intuição — não é possível medir o funil de ativação, taxa de conclusão de lições e desafios, retenção ou impacto de mudanças na plataforma.

**Valor entregue:** visibilidade do comportamento real dos usuários para orientar priorização de produto, identificar atritos no core loop (lição → desafio → progressão) e medir engajamento e retenção ao longo do tempo.

---

### 2. Requisitos

#### Rastreamento de Eventos de Negócio

- [x] **Rastreamento de Eventos de Negócio**

**Descrição:** O sistema registra automaticamente os eventos relevantes do comportamento do usuário na plataforma, enviando-os para o PostHog.

##### Regras de Negócio

- **Cobertura mínima:** Foram instrumentados cadastro de conta, login, criação de perfil, desbloqueio de estrela, conclusão de planeta, conclusão do espaço, recompensa recebida, conclusão de desafio, publicação de desafio, exclusão de desafio, compra de item na loja e envio de feedback.
- **Eventos server-certified:** Eventos críticos são rastreados a partir do servidor após confirmação do domínio e persistência relevante.
- **Sem duplicatas:** Eventos server-side usam o identificador da ocorrência Inngest como `$insert_id`, reduzindo duplicidade em retries.
- **Falha isolada:** O envio acontece em job assíncrono via Inngest; falhas no provider de analytics não interrompem a requisição original do usuário.

---

#### Identificação do Usuário

- [x] **Identificação do Usuário**

**Descrição:** A sessão anônima do browser é associada ao usuário autenticado no PostHog.

##### Regras de Negócio

- **Vínculo após login:** Login e cadastro social identificam o usuário no provider de analytics com `id` e `email`.
- **Disponibilidade imediata:** O browser inicializa PostHog com bootstrap da conta autenticada quando ela já existe no primeiro render.
- **Reset no logout:** Logout desvincula o perfil identificado para evitar herança de sessão por outro usuário.

---

#### Instrumentação do Browser

- [x] **Instrumentação do Browser**

**Descrição:** O browser captura automaticamente navegação e sessão do usuário na aplicação web.

##### Regras de Negócio

- **Pageviews automáticos:** Pageviews são capturados automaticamente pelo SDK client-side.
- **Gravação de sessões:** Session recording foi habilitado com mascaramento de inputs.
- **Feature flags:** A integração client-side com PostHog permite avaliação por usuário identificado.

---

#### Relatório de Usuários Ativos Diários

- [x] **Relatório de Usuários Ativos Diários**

**Descrição:** O painel administrativo exibe DAU consultando o PostHog via server, substituindo a consulta ao banco legado.

##### Regras de Negócio

- **Segmentação por plataforma:** O relatório mantém segmentação por `web` e `mobile`.
- **Período configurável:** O contrato existente com janela de dias foi preservado para o Studio.
- **Remoção do tracking legado:** O fluxo manual de visitas e a tabela `users_visits` foram removidos por migration.

---

### 3. Fluxo de Usuário (User Flow)

**Fluxo 1 — Rastreamento durante uso da plataforma:**

1. O usuário autenticado realiza qualquer ação de negócio relevante (completa uma lição, conclui um desafio, compra um item na loja, etc.).
2. O sistema processa a ação normalmente.
3. O sistema registra o evento correspondente no provider de analytics de forma assíncrona.
   - **Sucesso:** O evento aparece no painel de analytics em até alguns segundos.
   - **Falha no envio:** O fluxo principal do usuário não é afetado; o evento é tratado pelo fluxo de falha do job.

**Fluxo 2 — Identificação após autenticação:**

1. O usuário realiza login ou cadastro.
2. O sistema autentica a sessão e carrega o perfil.
3. O sistema vincula a sessão anônima do browser ao perfil identificado no provider de analytics.
   - **Sucesso:** Eventos subsequentes da sessão ficam associados ao usuário identificado.
   - **Falha:** A sessão permanece anônima; os eventos continuam sendo registrados sem vínculo ao perfil.

**Fluxo 3 — Consulta do relatório de DAU (administrador):**

1. O administrador acessa o painel Studio e navega até o relatório de usuários ativos.
2. O server consulta o PostHog para obter os dados de DAU pelo período selecionado.
3. O Studio exibe o relatório segmentado por plataforma (web e mobile).
   - **Sucesso:** O relatório é exibido com os dados atualizados do provider de analytics.
   - **Falha:** O sistema propaga erro do provider para o fluxo existente de resposta.

**Fluxo 4 — Feature flag por segmento:**

1. O administrador ativa uma feature flag no painel do PostHog para um segmento de usuários.
2. O usuário do segmento acessa a plataforma web.
3. O SDK client-side avalia a flag com base no perfil identificado do usuário.
   - **Flag ativa:** A feature é exibida ou habilitada para o usuário.
   - **Flag inativa:** O comportamento padrão é mantido.

---

### 4. Fora do Escopo (Out of Scope)

- Criação de dashboards ou visualizações de analytics dentro da própria plataforma Stardust — os dados são consumidos diretamente no painel do provider de analytics.
- Rastreamento de eventos no `studio` (painel administrativo) — o foco é o comportamento do usuário final na `web`.
- Rastreamento de eventos do módulo de ranking.
- Rastreamento de ações administrativas como edição e exclusão de guias do manual.
- Rastreamento de eventos de infraestrutura como geração de áudio e operações de storage.
- Conformidade com GDPR, LGPD ou qualquer mecanismo de consentimento de cookies — tratado como iniciativa separada.
- Aplicativo mobile — o escopo implementado captura web; a segmentação `mobile` permanece no contrato do relatório para compatibilidade e dados futuros.
- Testes A/B além do uso de feature flags.
- Exportação ou sincronização de dados do provider de analytics para o banco de dados da plataforma.
- Alertas ou notificações automáticas disparadas com base em métricas de analytics.

---

### 5. Conclusão da Implementação

- Contratos de analytics foram adicionados ao Core sem acoplar SDKs externos ao domínio.
- Eventos de negócio server-certified passaram a ser enviados ao PostHog via Inngest.
- A web inicializa PostHog client-side, identifica usuários autenticados e reseta identificação no logout.
- O relatório DAU do Studio preservou o contrato visual e passou a usar o PostHog Query API pelo server.
- O tracking legado de visitas em banco foi removido por código e migration.

**Divergências/ajustes de produto:** o app mobile permanece fora do escopo de instrumentação; a coluna `mobile` do DAU foi mantida apenas por compatibilidade do contrato e para suportar dados futuros quando houver origem mobile instrumentada.
