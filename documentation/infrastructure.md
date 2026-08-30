## Visão geral

O Stardust é hospedado em uma VPS Hostinger (KVM 2 — 2 vCPU, 8 GB RAM, 100 GB NVMe) com **Coolify v4** como plataforma de deploy. O Coolify gerencia o build, deploy e certificados SSL de todas as aplicações via Docker.

**Decisões-chave:**
- Variáveis de ambiente centralizadas no Coolify (sem Infisical)
- Deploy via Dockerfiles multi-stage com `turbo prune`
- CI no GitHub Actions, CD via webhook do Coolify
- DNS gerenciado no Cloudflare
- Studio migrado da Vercel para o Coolify

---

## Serviços

| Serviço | App | Tipo | Porta | Domínio |
|---|---|---|---|---|
| `stardust-web` | `apps/web` | Next.js SSR (standalone) | 3000 | `stardust-app.com.br`, `www.stardust-app.com.br` |
| `stardust-web-staging` | `apps/web` | Next.js SSR (standalone) | 3000 | `staging.stardust-app.com.br` |
| `stardust-server` | `apps/server` | Hono API (Node.js) | 3333 | `api.stardust-app.com.br` |
| `stardust-studio` | `apps/studio` | React Router v7 SPA (Nginx) | 80 | `studio.stardust-app.com.br` |

---

## VPS

- **Provedor:** Hostinger
- **Plano:** KVM 2
- **Recursos:** 2 vCPU / 8 GB RAM / 100 GB NVMe SSD
- **SO:** Ubuntu 24.04 LTS
- **IP:** `2.25.181.108`
- **Swap:** 4 GB configurado para absorver picos de build
- **Localização:** EUA (slots Brasil indisponíveis no momento da contratação)

---

## Coolify

- **URL:** `https://coolify.stardust-app.com.br`
- **Versão:** v4.x
- **Timezone:** `America/Sao_Paulo`
- **Proxy:** Traefik (gerenciado pelo Coolify)
- **SSL:** Let's Encrypt (automático)

### Configuração dos serviços

Cada serviço usa **Build Pack: Dockerfile** com os seguintes Dockerfiles na raiz do repositório:

| Serviço | Dockerfile | Base Directory |
|---|---|---|
| web / web-staging | `Dockerfile.web` | `/` |
| server | `Dockerfile.server` | `/` |
| studio | `Dockerfile.studio` | `/` |

### Variáveis de ambiente

As variáveis são configuradas diretamente no Coolify, separadas por escopo:

**Web (Build + Runtime):** `NEXT_PUBLIC_WEB_APP_URL`, `NEXT_PUBLIC_SERVER_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `NEXT_PUBLIC_CDN_URL`, `NEXT_PUBLIC_DISCORD_CHANNEL_URL`, `GOOGLE_ANALYTICS_ID`

**Web (só Runtime):** `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`

**Server (só Runtime):** `MODE`, `PORT`, `BASE_URL`, `STARDUST_WEB_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`, `SUPABASE_DATABASE_URL`, `SUPABASE_DATABASE_PASSWORD`, `S3_ACCOUNT_ID`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `DROPBOX_REFRESH_TOKEN`, `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DISCORD_WEBHOOK_URL`, `SENTRY_DSN`

**Studio:** variáveis `VITE_*`, incluindo `VITE_CDN_URL`, como Build Variables (se aplicável).

> As variáveis `NEXT_PUBLIC_*` e `VITE_*` precisam estar marcadas como **Available at Buildtime** no Coolify, pois são embutidas no bundle durante o build.

### Auto-deploy

| Serviço | Auto-deploy | Trigger real |
|---|---|---|
| web prod | Desabilitado | GitHub Actions workflow em `release: published` aciona webhook do Coolify |
| web staging | Habilitado | Push em `main` (paths: `apps/web/**`, `packages/core/**`, `packages/validation/**`, `packages/lsp/**`) |
| server | Depende da preferência | Push em `main` (paths: `apps/server/**`, `packages/core/**`, `packages/validation/**`) via workflow |
| studio | Habilitado | Push em `main` (paths: `apps/studio/**`) |

---

## DNS (Cloudflare)

**Nameservers:** `gabe.ns.cloudflare.com`, `sneh.ns.cloudflare.com`

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| A | `@` | `2.25.181.108` | DNS only |
| A | `www` | `2.25.181.108` | DNS only |
| A | `api` | `2.25.181.108` | DNS only |
| A | `staging` | `2.25.181.108` | DNS only |
| A | `studio` | `2.25.181.108` | DNS only |
| A | `coolify` | `2.25.181.108` | DNS only |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | DNS only |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | DNS only |
| TXT | `resend._domainkey` | (chave DKIM do Resend) | DNS only |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | DNS only |
| TXT | `@` | Google Site Verification (×2) | DNS only |

> O proxy do Cloudflare (nuvem laranja) está **desligado** para permitir que o Let's Encrypt valide os domínios via HTTP challenge. Pode ser habilitado depois com SSL mode **Full (Strict)** no Cloudflare.

---

## CI/CD

### Workflows

| Workflow | Trigger | O que faz |
|---|---|---|
| `server-app-ci.yaml` | PR → `main` (paths server) | Codecheck, typecheck, testes, build |
| `server-app-cd-coolify.yml` | Push → `main` (paths server) | Migra banco (Supabase CLI) → aciona webhook Coolify |
| `web-app-ci.yaml` | PR → `main` (paths web) | Codecheck, typecheck, testes, build |
| `web-app-cd-coolify.yaml` | Release published | Aciona webhook Coolify → notifica Discord |
| `web-app-staging-cd-coolify.yaml` | Push → `main` (paths web) | Aciona webhook Coolify → notifica Discord |
| `hermes-code-review.yaml` | PR → `main` | Aguarda os CIs aplicáveis, executa revisões técnicas paralelas e publica os resultados no PR |
| `hermes-e2e-testing.yaml` | PR de `main` → `production` | Implanta o SHA em staging e valida os PRDs/milestones afetados com Playwright MCP |
| `create-release.yaml` | Merge do PR de release | Confirma o E2E do Hermes, cria a tag e publica a GitHub Release |

### Workflows E2E do GitHub Actions

O `hermes-e2e-testing.yaml` é executado para PRs de release de `main` para
`production`. O fluxo:

1. identifica os PRDs e milestones afetados pelo PR;
2. implanta o SHA do PR na Web App de staging;
3. inicia uma execução do perfil E2E do Hermes para cada milestone, em paralelo;
4. usa Playwright MCP para validar o comportamento observável da aplicação;
5. publica uma conclusão consolidada no PR.

O workflow `create-release.yaml` verifica a execução E2E correspondente antes de
criar a tag e publicar a GitHub Release. A publicação da release dispara o
deploy da Web App de produção via workflow de CD.

Os resultados textuais da validação são publicados no PR. Evidências binárias
geradas pelo Hermes permanecem no ambiente local do agente quando a Runs API não
oferece transferência para o GitHub Actions.

### Fluxo de release

Uma release é promovida por um Pull Request da branch `main` para
`production`. O PR deve ser aberto no próprio repositório, não pode ser draft e
deve usar o título exato `Release vX.Y.Z`, seguindo o formato de versão
semântica.

#### 1. Preparação do E2E

O `hermes-e2e-testing.yaml` é acionado quando o PR é aberto, atualizado,
reaberto, marcado como pronto para revisão ou editado. O job `prepare`:

- confirma a direção `main` → `production` e valida o título da release;
- lê a seção `## PRDs afetados` do corpo do PR;
- extrai os links de milestones do Stardust e consulta seus metadados no GitHub;
- gera o manifesto da release com o SHA esperado e os milestones afetados;
- publica o manifesto como artefato por 14 dias.

Se nenhum milestone for declarado, o deploy em staging ainda é validado, mas
nenhuma sessão de navegador é iniciada.

#### 2. Deploy e validação em staging

O job `deploy-staging` aciona o webhook do Coolify para a Web App de staging e
aguarda o término do deployment. Em seguida, verifica que o commit implantado
corresponde ao SHA do head do PR e aguarda o health check de
`https://web-staging.stardust-app.com.br/`.

Depois do deploy, o job `e2e` cria uma execução por milestone em uma matriz
paralela. Cada execução do perfil `e2e-tester` do Hermes:

1. recebe o milestone, o SHA esperado e o manifesto de instruções confiáveis;
2. consulta somente os requisitos `REQ-*` explicitamente associados ao
   milestone;
3. usa Playwright MCP na Web App de staging com a sessão autenticada fornecida
   pelo bootstrap;
4. valida o fluxo observável completo e coleta screenshots, erros de console,
   erros de página e falhas de rede;
5. retorna um JSON em pt-BR com o resultado de cada requisito.

O workflow aceita somente os estados `passou` e `não_aplicável`. Estados
`falhou` ou `bloqueado`, resposta inválida, timeout ou falha do Hermes tornam o
job malsucedido. Cada resultado válido é publicado como artefato por 14 dias.

#### 3. Conclusão do E2E

O job `conclusion` consolida os resultados da matriz em um comentário no PR,
incluindo o SHA, o ambiente, o estado do deploy, a quantidade de requisitos e o
resumo por milestone. O comentário é atualizado em execuções repetidas usando
um marcador estável, evitando duplicação.

#### 4. Merge e criação da release

Após a aprovação e o merge do PR em `production`, o `create-release.yaml` é
acionado. O job só continua quando o PR foi realmente merged, veio de `main`,
pertence ao mesmo repositório e tem `production` como destino. Ele então:

1. faz checkout do commit de merge com histórico completo;
2. valida novamente o título `Release vX.Y.Z`;
3. compara as árvores Git do SHA validado em staging e do commit incorporado em
   `production`, bloqueando a release se forem diferentes;
4. procura a execução mais recente de `Hermes release E2E testing` para o SHA e
   PR exatos e exige status `completed` com conclusão `success`;
5. cria ou valida uma tag anotada `vX.Y.Z` apontando para o commit de merge;
6. cria ou valida a GitHub Release correspondente, usando o corpo do PR como
   release notes;
7. publica no PR os links para a tag, a GitHub Release e os deploys.

Uma GitHub Release publicada dispara o `web-app-production-cd.yaml`, que chama o
webhook de produção do Coolify. O deploy da Web App pode ser acompanhado pelos
workflows do GitHub Actions e pelo painel do Coolify.

### GitHub Secrets necessários

| Secret | Uso |
|---|---|
| `COOLIFY_API_TOKEN` | Autenticação na API do Coolify |
| `COOLIFY_WEBHOOK_SERVER_PROD` | Webhook do serviço stardust-server |
| `COOLIFY_WEBHOOK_WEB_PROD` | Webhook do serviço stardust-web |
| `COOLIFY_WEBHOOK_WEB_STG` | Webhook do serviço stardust-web-staging |
| `SERVER_TEST_ENV` | Conteúdo do `.env.testing` do server (para CI) |
| `WEB_DEV_ENV` | Conteúdo do `.env` de dev do web (para CI) |
| `WEB_TEST_ENV` | Conteúdo do `.env.test` do web (para CI) |
| `SUPABASE_ACCESS_TOKEN` | Token de acesso Supabase CLI (para migrations) |
| `SUPABASE_DB_PASSWORD` | Senha do banco Supabase (para migrations) |
| `DISCORD_WEBHOOK_URL` | Notificações de deploy no Discord |
| `HERMES_API_URL` | Endpoint da Runs API do Hermes |
| `HERMES_API_KEY` | Autenticação do perfil E2E do Hermes |
| `HERMES_CODE_REVIEWER_API_KEY` | Chave alternativa usada pelo E2E quando `HERMES_API_KEY` não está definida |
| `HERMES_GITHUB_APP_ID` | ID da GitHub App usada para publicar a conclusão do E2E |
| `HERMES_GITHUB_APP_PRIVATE_KEY` | Chave privada da GitHub App usada para publicar a conclusão do E2E |

---

## Dockerfiles

### Dockerfile.server

Multi-stage: `builder` (turbo prune) → `installer` (npm install + build) → `runner` (Node.js 22 Alpine). Variáveis de ambiente injetadas pelo Coolify em runtime via `process.env`. Não usa arquivo `.env`.

### Dockerfile.web

Multi-stage: `builder` (turbo prune) → `installer` (npm install + Next.js build com `output: 'standalone'`) → `runner` (Node.js 22 Alpine). Variáveis `NEXT_PUBLIC_*` precisam estar disponíveis em tempo de build.

### Dockerfile.studio

Multi-stage: `builder` (turbo prune) → `installer` (npm install + Vite build) → `runner` (Nginx Alpine servindo arquivos estáticos). Config do Nginx com `try_files` para fallback SPA.

---

## Migrations

As migrations do banco de dados rodam **antes** do deploy, no job `migrate-database` do workflow `server-app-cd-coolify.yml`:

```
supabase link --project-ref <project-id>
supabase db push
```

O container do server **não** contém a Supabase CLI nem o `postgresql-client`. Migrations são responsabilidade exclusiva do CI/CD.

---

## Serviços externos

| Serviço | Uso | Gerenciado por |
|---|---|---|
| Supabase | Banco de dados, autenticação, storage | Supabase Cloud |
| Inngest | Filas e jobs assíncronos | Inngest Cloud |
| Resend / Amazon SES | Envio de emails transacionais | SaaS |
| Dropbox | Armazenamento de backups | Dropbox API |
| Sentry | Monitoramento de erros | Sentry Cloud |
| Discord | Notificações de deploy | Discord Webhooks |
| Cloudflare | DNS e (futuro) CDN/DDoS protection | Cloudflare |

---

## Notas operacionais

- **Builds paralelos:** evitar na VPS KVM 2 (2 vCPU). Configurar concurrency nos workflows e no Coolify para serializar.
- **Swap:** 4 GB de swap configurado (`/swapfile`) para absorver picos de memória durante builds Docker.
- **Renovação VPS:** o preço promocional do KVM 2 (R$ 43,99/mês) renova a R$ 77,99/mês. Avaliar upgrade para KVM 4 se os builds ficarem lentos.
- **Proxy Cloudflare:** pode ser habilitado (nuvem laranja) após confirmar que todos os certificados Let's Encrypt foram gerados. Requer configurar SSL mode como **Full (Strict)** no Cloudflare.
- **Inngest:** após migração completa, atualizar as URLs de callback no painel do Inngest Cloud para os novos domínios.
