---
description: Prompt para conduzir revisão de segurança no projeto StarDust, retornando um relatório com findings classificados por severidade e recomendações de correção alinhadas às convenções do projeto.
---

# Prompt: Criar Relatorio de Seguranca

## Objetivo

Conduzir uma revisão de segurança orientada à arquitetura do StarDust, identificando vulnerabilidades, más práticas e riscos em todas as camadas do sistema (UI, RPC, REST, Core, Database, Provision, Queue). O resultado deve ser um relatório com findings classificados por severidade e recomendações de correção alinhadas às convenções do projeto.

---

## Entradas

  - Aplicação alvo `{APP}` (ex: `web`, `server`, `studio`)
  - Escopo da revisão `{ESCOPO}` (ex: módulo `auth`, camada `rest`, feature `challenging`, ou `full`)
  - Arquivos ou caminhos alvo `{ALVOS}` (ex: `apps/server/src/rest/controllers/auth/`, `packages/core/src/auth/`)
  - Contexto do que foi alterado recentemente `{CONTEXTO_MUDANCA}` (ex: "nova feature de social login", "refatoração do authActionClient")
  - Critérios prioritários `{FOCO}` (ex: autenticação, autorização, exposição de dados, validação de inputs)

---

## Mapa de Camadas para Revisão

Antes de iniciar, consulte os documentos de regras de cada camada envolvida no escopo:

| Camada | Arquivo de Regras | Riscos Típicos |
|--------|-------------------|----------------|
| **UI / Widgets** | `documentation/rules/ui-layer-rules.md` | Exposição de dados sensíveis no estado, lógica de autorização no cliente |
| **RPC / Actions** | `documentation/rules/rpc-layer-rules.md` | Ausência de validação Zod no composition root, lógica de negócio em actions |
| **REST / Controllers** | `documentation/rules/rest-layer-rules.md` | Falta de middleware de auth, ausência de verificação de `accountId`, status codes que vazam informação |
| **Core / Use Cases** | `documentation/rules/core-package-rules.md` | Regras de autorização ausentes no domínio, entidades sem validação de contrato |
| **Database / Repositories** | `documentation/rules/database-rules.md` | Queries sem escopo de `accountId`, mappers que não normalizam tipos antes do domínio |
| **Provision / Providers** | `documentation/rules/provision-layer-rules.md` | Segredos hardcoded, erros do SDK expostos sem tratamento, tipos do SDK vazando |
| **Queue / Jobs** | `documentation/rules/queue-layer-rules.md` | Jobs sem idempotência, ausência de validação de payload de entrada |

---

## Checklist de Revisão por Camada

### 🔐 Autenticação e Autorização

- [ ] **Middleware de auth** está aplicado em todas as rotas protegidas no Hono (`verifyAuthentication`, `verifyGodAccount`)
- [ ] **`VerifyAuthRoutesController`** só chama `fetchAccount()` após confirmar que a rota não é pública (ver ISSUE-03 do performance report)
- [ ] **`authActionClient`** não realiza chamadas desnecessárias para rotas que não exigem usuário autenticado
- [ ] Rotas administrativas (ex: `GET /profile/users/xlsx`) aplicam `verifyGodAccount` além de `verifyAuthentication`
- [ ] Permissões de editor/god em `challenging` seguem o padrão `autor || god` (ref: `god-user-permission-for-challenge-editor-spec.md`)
- [ ] `InsigniaRole` é verificada pelo domínio, não apenas pela UI
- [ ] Erros de autorização retornam **404** (mascaramento de existência) em vez de 403 onde aplicável

### 🧹 Validação de Inputs

- [ ] Toda **Action (RPC)** possui schema Zod no composition root (`apps/web/src/rpc/next-safe-action/`)
- [ ] **Controllers REST** extraem body/params via `Http` sem confiar em dados não validados
- [ ] **Entidades do Core** rejeitam DTOs com contratos inválidos (ex: `Integer.create` rejeita `string | null`)
- [ ] **Mappers de banco** normalizam tipos antes de repassar ao Core (ex: `Number(value)` em campos numéricos do Supabase — ref: bug `SupabasePlanetMapper`)
- [ ] Nenhum `any` ou cast inseguro (`as unknown as X`) nos pontos de entrada de dados externos

### 🔑 Segredos e Variáveis de Ambiente

- [ ] Nenhuma credencial hardcoded — todas as configs usam `ENV` (ref: `documentation/rules/provision-layer-rules.md`)
- [ ] Providers (`SupabaseStorageProvider`, etc.) não expõem chaves ou clients do SDK externamente
- [ ] Arquivos `.env.example` não contêm valores reais
- [ ] Variáveis de ambiente são validadas via Zod no boot (padrão `envSchema`)

### 🚪 Exposição de Dados

- [ ] Controllers não retornam dados além do necessário (sem dump de entidade inteira quando só o ID é suficiente)
- [ ] Erros de domínio (`AppError`) não expõem stack trace ou detalhes internos para o cliente
- [ ] Providers mapeiam erros do SDK para `AppError` antes de propagar (nenhum `error.message` do Supabase/SDK exposto diretamente)
- [ ] `console.log` de debug não existe em produção (ex: `Planet.create` com `console.log(dto)` — ref: bug report space)

### 🏗️ Integridade Arquitetural (Segurança por Design)

- [ ] `@stardust/core` não importa nenhum pacote de `apps/` (violação da arquitetura hexagonal)
- [ ] Actions RPC não importam `next/*` diretamente (ref: regra da camada RPC)
- [ ] Providers não retornam tipos do SDK externo para fora da camada `provision`
- [ ] Cookies de sessão são definidos via `call.setCookie` com `durationInISSUEods` explícito

### 🔄 Jobs e Filas (Inngest)

- [ ] Jobs são idempotentes (reprocessamento não causa efeitos duplicados)
- [ ] Payloads de entrada dos jobs são validados antes de execução
- [ ] Falhas em jobs não silenciam erros críticos

---

## Diretrizes de Execução

### Passo 1: Mapeamento do Escopo

- Identifique quais camadas e módulos estão no `{ESCOPO}`.
- Consulte `documentation/rules/rules.md` para localizar os arquivos de regra relevantes.
- Se o escopo incluir um domínio de feature, consulte `documentation/features/<dominio>/` para entender o contexto de negócio.

### Passo 2: Coleta de Evidências

- Leia apenas os arquivos necessários para sustentar as evidências — não leia o projeto inteiro.
- Para cada suspeita de vulnerabilidade, localize o arquivo e a linha específica.
- Se houver dúvida sobre comportamento de lib (ex: Supabase, Hono, next-safe-action), consulte a documentação oficial antes de classificar como finding.

### Passo 3: Classificação de Findings

Use a tabela de severidade abaixo:

| Severidade | Critério |
|------------|----------|
| 🔴 **Critical** | Bypass de autenticação/autorização, exposição direta de credenciais, RCE |
| 🟠 **High** | Autorização ausente em rota protegida, dados sensíveis expostos na resposta, validação de input completamente ausente |
| 🟡 **Medium** | Mascaramento de erro insuficiente, mapper sem normalização de tipos quebrando contrato do core, cookie sem expiração |
| 🟢 **Low** | `console.log` em produção, `any` em ponto de entrada, variável de ambiente sem validação de schema |
| ℹ️ **Info** | Sugestão de melhoria defensiva, alinhamento com padrão já existente na codebase |

### Passo 4: Relatório

Produza o relatório seguindo o template abaixo.

---

## Template de Saída (Estrutura Obrigatória)

```
---
app: {APP}
status: open|closed 
last_updated_at: {DATA}
---

## Resumo Executivo

- Total de findings: X (Critical: X | High: X | Medium: X | Low: X | Info: X)
- Área de maior risco: {AREA}
- Ação imediata recomendada: {ACAO_CRITICA}

---

## Findings

### [ISSUE-01] Título do Finding

- **Severidade:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low / ℹ️ Info
- **Camada:** ui | rpc | rest | core | database | provision | queue
- **Arquivo:** `caminho/do/arquivo.ts` (linha X)
- **Descrição:** O que está errado e por quê é um risco.
- **Evidência:**
  ```ts
  // trecho de código problemático
  ```
- **Impacto:** O que pode acontecer se explorado.
- **Recomendação:** Como corrigir, alinhado às regras do StarDust.
- **Referência:** `documentation/rules/<arquivo-relevante>.md`

---

## Recomendações Priorizadas

| # | Ação | Finding(s) | Severidade | Esforço |
|---|------|------------|------------|---------|
| 1 | ... | ISSUE-01 | Critical | S |
| 2 | ... | ISSUE-02 | High | M |

---

## Checklist de Verificação Pós-Correção

- [ ] `npm run codecheck` passa (raiz do monorepo)
- [ ] `npm run typecheck` passa no workspace afetado
- [ ] `npm run test` passa no workspace afetado
- [ ] Nenhuma variável de ambiente real exposta
- [ ] Nenhum `console.log` de debug em código de produção
- [ ] Middleware de auth aplicado em todas as rotas afetadas

---

## Referências

- `documentation/architecture.md`
- `documentation/rules/rules.md`
- `{OUTROS_ARQUIVOS_CONSULTADOS}`
```

---

## Restrições

- **Não invente** caminhos de arquivo, métodos ou contratos sem evidência na codebase.
- Quando faltar informação para classificar um finding, marque como **pendência** com a pergunta objetiva.
- Cite sempre o arquivo e linha do problema — sem findings genéricos sem localização.
- Recomendações devem ser **alinhadas às convenções do projeto** (nomenclatura, padrão de camada, uso de `AppError`, etc.).
- Não proponha correções que violem os contratos entre camadas definidos em `documentation/rules/`.
- Separe fato (evidência encontrada) de hipótese (suspeita sem confirmação de código).