---

## description: Prompt para conduzir revisão de segurança no projeto StarDust, retornando um relatório com findings classificados por severidade, evidências concretas, cenários de exploração e recomendações alinhadas às convenções arquiteturais do projeto.

# Prompt: Criar Relatório de Segurança

## Objetivo

Conduzir uma revisão de segurança orientada à arquitetura do **StarDust**, identificando vulnerabilidades, más práticas e riscos em todas as camadas do sistema:

* UI / Widgets
* RPC / Actions
* REST / Controllers
* Core / Use Cases
* Database / Repositories
* Provision / Providers
* Queue / Jobs

O resultado deve ser um relatório técnico com findings classificados por severidade, evidências em código, nível de confiança, cenário de exploração e recomendações de correção alinhadas às convenções do projeto.

---

## Entradas

* Aplicação alvo `{APP}`
  Exemplo: `web`, `server`, `studio`

* Escopo da revisão `{ESCOPO}`
  Exemplo: módulo `auth`, camada `rest`, feature `challenging`, ou `full`

* Arquivos ou caminhos alvo `{ALVOS}`
  Exemplo: `apps/server/src/rest/controllers/auth/`, `packages/core/src/auth/`

* Contexto do que foi alterado recentemente `{CONTEXTO_MUDANCA}`
  Exemplo: `nova feature de social login`, `refatoração do authActionClient`

* Critérios prioritários `{FOCO}`
  Exemplo: autenticação, autorização, exposição de dados, validação de inputs

* Data da revisão `{DATA}`
  Exemplo: `2026-07-06`

---

## Princípios da Revisão

* Não invente caminhos, métodos, contratos, arquivos, permissões ou comportamentos sem evidência concreta na codebase.
* Separe claramente **fato**, **hipótese** e **pendência**.
* Crie findings apenas quando houver evidência localizada em arquivo e linha.
* Não classifique uma suspeita como vulnerabilidade confirmada sem caminho de exploração plausível.
* Recomendações devem respeitar os contratos entre camadas definidos em `documentation/rules/`.
* Não proponha correções que violem a arquitetura do StarDust.
* Leia apenas os arquivos necessários para sustentar a análise.
* Os exemplos do checklist são referências prioritárias, mas não limitam a revisão. Identifique também riscos equivalentes em outros módulos e camadas.

---

## Mapa de Camadas para Revisão

Antes de iniciar, consulte os documentos de regras das camadas envolvidas no escopo.

| Camada                      | Arquivo de Regras                              | Riscos Típicos                                                                                      |
| --------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **UI / Widgets**            | `documentation/rules/ui-layer-rules.md`        | Exposição de dados sensíveis no estado, lógica de autorização apenas no cliente                     |
| **RPC / Actions**           | `documentation/rules/rpc-layer-rules.md`       | Ausência de validação Zod no composition root, lógica de negócio em actions                         |
| **REST / Controllers**      | `documentation/rules/rest-layer-rules.md`      | Falta de middleware de auth, ausência de verificação de `accountId`, respostas que vazam informação |
| **Core / Use Cases**        | `documentation/rules/core-package-rules.md`    | Autorização ausente no domínio, entidades sem validação de contrato                                 |
| **Database / Repositories** | `documentation/rules/database-rules.md`        | Queries sem escopo de `accountId`, mappers que não normalizam tipos antes do domínio                |
| **Provision / Providers**   | `documentation/rules/provision-layer-rules.md` | Segredos hardcoded, erros de SDK expostos, tipos externos vazando da camada                         |
| **Queue / Jobs**            | `documentation/rules/queue-layer-rules.md`     | Jobs sem idempotência, ausência de validação de payload, falhas críticas silenciosas                |

---

## Checklist de Revisão por Tema

### 🔐 Autenticação e Autorização

* [ ] Middleware de auth está aplicado em todas as rotas protegidas no Hono, como `verifyAuthentication` e `verifyGodAccount`.
* [ ] `VerifyAuthRoutesController` só chama `fetchAccount()` após confirmar que a rota não é pública.
* [ ] `authActionClient` não realiza chamadas desnecessárias para rotas que não exigem usuário autenticado.
* [ ] Rotas administrativas, como `GET /profile/users/xlsx`, aplicam `verifyGodAccount` além de `verifyAuthentication`.
* [ ] Permissões de editor/god em `challenging` seguem o padrão esperado pelo domínio, como `author || god`, se esse for o contrato real da codebase.
* [ ] `InsigniaRole` ou papel equivalente é validado no domínio, não apenas na UI.
* [ ] Recursos privados retornam 404 quando revelar a existência do recurso for um risco.
* [ ] Erros administrativos ou globais podem retornar 403 quando a existência do recurso não for sensível.
* [ ] Nenhum fluxo permite bypass de autenticação por rota pública, middleware ausente ou validação condicional incorreta.

### 🧹 Validação de Inputs

* [ ] Toda Action RPC possui schema Zod no composition root, como `apps/web/src/rpc/next-safe-action/`.
* [ ] Controllers REST extraem body, params e query por meio dos helpers/padrões definidos pela camada `Http`.
* [ ] Controllers REST não confiam em dados não validados vindos do cliente.
* [ ] Entidades do Core rejeitam DTOs com contratos inválidos.
* [ ] Value Objects rejeitam tipos inválidos, como `string | null` em campos que exigem número.
* [ ] Mappers de banco normalizam tipos antes de repassar dados ao Core.
* [ ] Nenhum `any`, `as unknown as X` ou cast inseguro aparece em pontos de entrada de dados externos.
* [ ] Payloads externos são validados antes de chegarem ao domínio.

### 🔑 Segredos e Variáveis de Ambiente

* [ ] Nenhuma credencial está hardcoded.
* [ ] Todas as configurações sensíveis usam `ENV`.
* [ ] Providers, como storage, auth, database ou SDKs externos, não expõem chaves, clients ou tokens.
* [ ] Arquivos `.env.example` não contêm valores reais.
* [ ] Variáveis de ambiente são validadas no boot via schema, como `envSchema`.
* [ ] Erros de configuração não expõem valores secretos.

### 🚪 Exposição de Dados

* [ ] Controllers não retornam dados além do necessário.
* [ ] Respostas públicas não fazem dump de entidades completas quando apenas IDs ou DTOs reduzidos são necessários.
* [ ] Erros de domínio, como `AppError`, não expõem stack trace ou detalhes internos para o cliente.
* [ ] Providers mapeiam erros de SDK para erros internos controlados antes de propagar.
* [ ] Nenhum `error.message` bruto de SDK externo é exposto diretamente ao cliente.
* [ ] Não há `console.log`, `console.error` ou logs de debug com dados sensíveis em código de produção.
* [ ] Dados de sessão, tokens, emails, roles, account IDs e permissões não são expostos indevidamente na UI.

### 🏗️ Integridade Arquitetural

* [ ] `@stardust/core` não importa pacotes de `apps/`.
* [ ] Actions RPC não importam `next/*` diretamente quando isso violar a regra da camada.
* [ ] Providers não retornam tipos de SDK externo para fora da camada `provision`.
* [ ] Repositories não vazam modelos ou tipos específicos do banco para o Core.
* [ ] Cookies de sessão são definidos via padrão do projeto, como `call.setCookie`, com expiração explícita, por exemplo `durationInSeconds`.
* [ ] Regras de autorização críticas vivem no domínio ou em use cases, não apenas na UI.

### 🔄 Jobs e Filas

* [ ] Jobs são idempotentes.
* [ ] Reprocessamento não causa efeitos duplicados.
* [ ] Payloads de entrada dos jobs são validados antes da execução.
* [ ] Falhas críticas não são silenciadas.
* [ ] Jobs não executam ações privilegiadas sem contexto de conta, usuário ou permissão.
* [ ] Jobs não confiam cegamente em dados vindos de eventos externos.

### 📦 Dependências e Supply Chain

* [ ] Dependências críticas não possuem vulnerabilidades conhecidas abertas em Dependabot, npm audit ou ferramenta equivalente do projeto.
* [ ] Packages sensíveis de auth, crypto, storage, HTTP, RPC e validação estão atualizados ou possuem justificativa para pinagem.
* [ ] Scripts em `package.json` não executam comandos suspeitos ou perigosos.
* [ ] Dependências novas relacionadas a `{CONTEXTO_MUDANCA}` foram revisadas.
* [ ] Não há pacotes duplicados, abandonados ou desnecessários em áreas sensíveis.
* [ ] Configurações de CI/CD não expõem secrets em logs.

---

## Diretrizes de Execução

### Passo 1: Mapeamento do Escopo

Identifique quais camadas, módulos, rotas, use cases, providers, repositories, actions e jobs estão dentro de `{ESCOPO}`.

Consulte:

* `documentation/rules/rules.md`
* Arquivos específicos de regras por camada
* `documentation/architecture.md`
* `documentation/features/<dominio>/`, quando o escopo envolver uma feature específica

Ao final deste passo, liste brevemente:

* Camadas envolvidas
* Arquivos principais revisados
* Fronteiras de confiança relevantes
* Tipos de atores envolvidos

---

### Passo 2: Modelo de Ameaça

Antes de criar findings, descreva o modelo de ameaça aplicável ao escopo.

Identifique:

* **Atores:** usuário anônimo, usuário autenticado, editor, admin/god, job interno, provider externo, atacante com conta válida.
* **Ativos protegidos:** sessão, tokens, dados de conta, dados de perfil, arquivos, permissões, roles, desafios, recursos administrativos.
* **Fronteiras de confiança:** cliente → RPC, cliente → REST, REST/RPC → Core, Core → Database, Core → Providers, Queue → Core.
* **Operações sensíveis:** leitura indevida, escrita indevida, elevação de privilégio, vazamento de dados, duplicidade de efeitos, uso indevido de provider externo.

Use esse modelo para avaliar se uma suspeita representa risco real.

---

### Passo 3: Coleta de Evidências

Para cada suspeita de vulnerabilidade:

1. Localize o arquivo exato.
2. Localize a linha ou intervalo de linhas.
3. Leia o contexto suficiente para entender o fluxo.
4. Verifique se a suspeita é explorável ou se é apenas uma melhoria defensiva.
5. Consulte documentação oficial quando houver dúvida sobre comportamento de biblioteca, como Supabase, Hono, Next.js, Inngest, next-safe-action ou Zod.

Não crie finding sem evidência concreta.

Quando a evidência for insuficiente, registre como pendência.

---

### Passo 4: Critérios para Criar um Finding

Crie um finding apenas quando houver:

1. Evidência concreta em arquivo e linha;
2. Risco de segurança plausível;
3. Caminho de exploração ou mau uso razoável;
4. Impacto compreensível;
5. Recomendação compatível com as regras do StarDust.

Se algum desses pontos faltar, registre como:

* **Pendência**, quando for necessário confirmar algo;
* **Observação**, quando for melhoria defensiva sem risco imediato;
* **Área revisada sem finding**, quando o fluxo estiver correto.

---

## Classificação de Severidade

| Severidade      | Critério                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 **Critical** | Bypass de autenticação/autorização, exposição direta de credenciais, RCE, acesso administrativo indevido                                                |
| 🟠 **High**     | Autorização ausente em rota protegida, dados sensíveis expostos na resposta, validação de input completamente ausente em ponto crítico                  |
| 🟡 **Medium**   | Mascaramento de erro insuficiente, mapper sem normalização quebrando contrato do Core, cookie sem expiração, falha de idempotência com impacto moderado |
| 🟢 **Low**      | `console.log` em produção, `any` em ponto de entrada, variável de ambiente sem validação de schema, melhoria defensiva simples                          |
| ℹ️ **Info**     | Sugestão de melhoria, documentação, hardening, alinhamento com padrão já existente                                                                      |

---

## Nível de Confiança

Classifique cada finding com um nível de confiança:

| Confiança | Critério                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------- |
| **Alta**  | Evidência direta no código, comportamento confirmado e impacto claro                           |
| **Média** | Evidência forte, mas depende de premissa razoável sobre fluxo, configuração ou chamada externa |
| **Baixa** | Suspeita plausível, mas falta confirmação de uso real, configuração ou contrato                |

Findings com confiança baixa devem ser preferencialmente registrados como pendência, não como vulnerabilidade confirmada.

---

## Status da Evidência

Use um dos status abaixo para cada item:

| Status          | Quando usar                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| **Confirmado**  | O problema foi comprovado com evidência em código e caminho de exploração plausível |
| **Suspeita**    | Há indício relevante, mas falta confirmação de contexto, configuração ou chamada    |
| **Pendência**   | Não há informação suficiente para classificar                                       |
| **Não Finding** | Área revisada e considerada adequada                                                |

---

## Template de Saída Obrigatório

````md
---
app: {APP}
scope: {ESCOPO}
status: open|closed
last_updated_at: {DATA}
---

# Relatório de Segurança — {APP}

## Resumo Executivo

- **Total de findings:** X
  - Critical: X
  - High: X
  - Medium: X
  - Low: X
  - Info: X
- **Área de maior risco:** {AREA}
- **Ação imediata recomendada:** {ACAO_CRITICA}
- **Confiança geral da revisão:** alta | média | baixa

---

## Escopo Revisado

| Item | Valor |
|------|-------|
| Aplicação | `{APP}` |
| Escopo | `{ESCOPO}` |
| Alvos | `{ALVOS}` |
| Contexto da mudança | `{CONTEXTO_MUDANCA}` |
| Foco prioritário | `{FOCO}` |

---

## Modelo de Ameaça

### Atores

- ...

### Ativos Protegidos

- ...

### Fronteiras de Confiança

- ...

### Operações Sensíveis

- ...

---

## Findings

### [ISSUE-01] Título do Finding

- **Severidade:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low / ℹ️ Info
- **Status da Evidência:** confirmado | suspeita | pendência
- **Confiança:** alta | média | baixa
- **Camada:** ui | rpc | rest | core | database | provision | queue
- **Arquivo:** `caminho/do/arquivo.ts`
- **Linha(s):** X-Y
- **Descrição:** O que está errado e por que isso representa risco.
- **Evidência:**

  ```ts
  // trecho de código problemático
````

* **Cenário de Exploração:** Como um usuário, atacante ou fluxo interno conseguiria acionar o problema.
* **Pré-condições:** Permissão, estado de conta, payload, rota ou contexto necessário.
* **Impacto:** O que pode acontecer se explorado.
* **Recomendação:** Como corrigir, alinhado às regras do StarDust.
* **Referência:** `documentation/rules/<arquivo-relevante>.md`

---

## Pendências

| ID      | Pergunta | Arquivo/Área | Por que bloqueia a classificação |
| ------- | -------- | ------------ | -------------------------------- |
| PEND-01 | ...      | `...`        | ...                              |

---

## Áreas Revisadas Sem Findings

| Área | Arquivos | Observação                                      |
| ---- | -------- | ----------------------------------------------- |
| ...  | `...`    | Fluxo revisado sem evidência de vulnerabilidade |

---

## Recomendações Priorizadas

| # | Ação | Finding(s) | Severidade | Esforço |
| - | ---- | ---------- | ---------- | ------- |
| 1 | ...  | ISSUE-01   | Critical   | S       |
| 2 | ...  | ISSUE-02   | High       | M       |
| 3 | ...  | ISSUE-03   | Medium     | M       |

---

## Checklist de Verificação Pós-Correção

* [ ] `npm run codecheck` passa na raiz do monorepo
* [ ] `npm run typecheck` passa no workspace afetado
* [ ] `npm run test` passa no workspace afetado
* [ ] Testes de autorização cobrem o cenário corrigido
* [ ] Testes de validação cobrem payloads inválidos
* [ ] Nenhuma variável de ambiente real está exposta
* [ ] Nenhum `console.log` de debug permanece em código de produção
* [ ] Middleware de auth está aplicado em todas as rotas afetadas
* [ ] Erros externos são mapeados para erros internos controlados
* [ ] DTOs de resposta retornam apenas os campos necessários
* [ ] Jobs afetados são idempotentes, quando aplicável

---

## Referências

* `documentation/architecture.md`
* `documentation/rules/rules.md`
* `documentation/rules/ui-layer-rules.md`
* `documentation/rules/rpc-layer-rules.md`
* `documentation/rules/rest-layer-rules.md`
* `documentation/rules/core-package-rules.md`
* `documentation/rules/database-rules.md`
* `documentation/rules/provision-layer-rules.md`
* `documentation/rules/queue-layer-rules.md`
* `{OUTROS_ARQUIVOS_CONSULTADOS}`

```

---

## Restrições Finais

- Não invente findings.
- Não invente arquivos.
- Não invente linhas.
- Não invente contratos de domínio.
- Não invente comportamento de bibliotecas externas.
- Não classifique como vulnerabilidade algo que é apenas preferência de estilo.
- Não proponha mover regra de domínio para UI.
- Não proponha expor tipos de SDK fora da camada `provision`.
- Não proponha bypass temporário de middleware, validação ou autorização.
- Não ignore violações arquiteturais quando elas criarem risco de segurança.
- Não duplique findings equivalentes; agrupe evidências semelhantes quando fizer sentido.
- Quando não houver findings, gere um relatório com resumo, áreas revisadas, evidências de conformidade e pendências, se existirem.
```
