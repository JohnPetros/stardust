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

**Web (Build + Runtime):** `NEXT_PUBLIC_WEB_APP_URL`, `NEXT_PUBLIC_SERVER_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `NEXT_PUBLIC_SUPABASE_CDN_URL`, `NEXT_PUBLIC_SUPABASE_CDN_HOST`, `NEXT_PUBLIC_SUPABASE_CDN_PATH`, `NEXT_PUBLIC_DISCORD_CHANNEL_URL`, `GOOGLE_ANALYTICS_ID`

**Web (só Runtime):** `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`

**Server (só Runtime):** `MODE`, `PORT`, `BASE_URL`, `STARDUST_WEB_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`, `SUPABASE_DATABASE_URL`, `SUPABASE_DATABASE_PASSWORD`, `DROPBOX_REFRESH_TOKEN`, `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DISCORD_WEBHOOK_URL`, `SENTRY_DSN`

**Studio:** variáveis `VITE_*` como Build Variables (se aplicável).

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

### GitHub Secrets necessários

| Secret | Uso |
|---|---|
| `COOLIFY_API_TOKEN` | Autenticação na API do Coolify |
| `COOLIFY_WEBHOOK_SERVER_PROD` | Webhook do serviço stardust-server |
| `COOLIFY_WEBHOOK_WEB_PROD` | Webhook do serviço stardust-web |
| `COOLIFY_WEBHOOK_WEB_STAGING` | Webhook do serviço stardust-web-staging |
| `SERVER_TEST_ENV` | Conteúdo do `.env.testing` do server (para CI) |
| `WEB_DEV_ENV` | Conteúdo do `.env` de dev do web (para CI) |
| `WEB_TEST_ENV` | Conteúdo do `.env.test` do web (para CI) |
| `SUPABASE_ACCESS_TOKEN` | Token de acesso Supabase CLI (para migrations) |
| `SUPABASE_DB_PASSWORD` | Senha do banco Supabase (para migrations) |
| `DISCORD_WEBHOOK_URL` | Notificações de deploy no Discord |

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