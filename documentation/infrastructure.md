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
| `hermes` | serviço externo | Hermes Agent (Docker Compose) | 8642 / 9119 | `hermes-api.stardust-app.com.br`, `hermes.stardust-app.com.br` |
| `hermes-chromium` | sidecar interno | Chromium remoto via CDP | 3000 | sem domínio público |

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

O Hermes não é construído pelos Dockerfiles do monorepo. Ele é implantado como
um serviço **Docker Compose** separado no Coolify, usando a imagem
`nousresearch/hermes-agent:latest` e um volume persistente montado em
`/opt/data`. O Chromium usado pelos testes E2E é executado como recurso separado
na mesma rede privada do Coolify, sem exposição pública.

### Variáveis de ambiente

As variáveis são configuradas diretamente no Coolify, separadas por escopo:

**Web (Build + Runtime):** `NEXT_PUBLIC_WEB_APP_URL`, `NEXT_PUBLIC_SERVER_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `NEXT_PUBLIC_CDN_URL`, `NEXT_PUBLIC_DISCORD_CHANNEL_URL`, `GOOGLE_ANALYTICS_ID`

**Web (só Runtime):** `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`

**Server (só Runtime):** `MODE`, `PORT`, `BASE_URL`, `STARDUST_WEB_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`, `SUPABASE_DATABASE_URL`, `SUPABASE_DATABASE_PASSWORD`, `S3_ACCOUNT_ID`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `DROPBOX_REFRESH_TOKEN`, `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DISCORD_WEBHOOK_URL`, `SENTRY_DSN`

**Studio:** variáveis `VITE_*`, incluindo `VITE_CDN_URL`, como Build Variables (se aplicável).

**Hermes (só Runtime):** `API_SERVER_ENABLED`, `API_SERVER_HOST`,
`API_SERVER_PORT`, `API_SERVER_KEY`, `HERMES_DASHBOARD`,
`HERMES_DASHBOARD_HOST`, `HERMES_DASHBOARD_PORT`,
`HERMES_DASHBOARD_BASIC_AUTH_USERNAME`,
`HERMES_DASHBOARD_BASIC_AUTH_PASSWORD`,
`HERMES_DASHBOARD_BASIC_AUTH_SECRET`, `BROWSER_CDP_URL`,
`WEB_APP_E2E_EMAIL`, `WEB_APP_E2E_PASSWORD` e `TZ`.

As credenciais da GitHub App e dos demais MCPs são configuradas nos perfis do
Hermes e/ou como secrets de runtime. Chaves privadas, tokens e credenciais E2E
nunca devem ser registradas no Compose, no repositório ou nos logs.

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
| A | `hermes` | `2.25.181.108` | DNS only |
| A | `hermes-api` | `2.25.181.108` | DNS only |
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
| `hermes-code-review.yaml` | PR → `main` | Aguarda os CIs aplicáveis, detecta escopos alterados e aciona revisões técnicas paralelas no Hermes |
| `hermes-e2e-testing.yaml` | PR de `main` → `production` | Implanta o SHA em staging e aciona o perfil E2E para validar os PRDs/milestones afetados |
| `create-release.yaml` | Merge do PR de release | Confirma o E2E do Hermes e cria a tag e a GitHub Release |
| `dependencies-update.yaml` | Toda segunda-feira às 09:00 BRT ou execução manual | Atualiza dependências patch/minor, valida o monorepo e cria ou atualiza um PR semanal |

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
| `HERMES_API_URL` | Endpoint público da Runs API do Hermes |
| `HERMES_CODE_REVIEWER_API_KEY` | Autenticação do workflow de revisão no perfil `code-reviewer` |
| `HERMES_API_KEY` | Autenticação compartilhada da Runs API, usada pelo E2E de release |
| `HERMES_GITHUB_APP_ID` | ID da GitHub App usada para publicar resultados como `stardust-hermes[bot]` |
| `HERMES_GITHUB_APP_PRIVATE_KEY` | Chave privada da GitHub App usada pelos workflows do Hermes |

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

## Hermes Agent

O Hermes é o serviço de agentes do Stardust hospedado na mesma VPS e gerenciado
pelo Coolify. O GitHub Actions envia trabalhos assinados para a **Runs API**; o
Hermes executa cada trabalho no perfil solicitado e consulta ou comenta no
GitHub por meio de uma GitHub App com permissões mínimas.

### Endpoints

| Endpoint | Porta interna | Uso |
|---|---:|---|
| `https://hermes-api.stardust-app.com.br` | 8642 | Runs API consumida pelo GitHub Actions |
| `https://hermes.stardust-app.com.br` | 9119 | Dashboard administrativo com autenticação básica |
| `http://hermes-chromium:3000` | 3000 | CDP interno consumido pelo Playwright MCP; não deve ser público |

O Traefik do Coolify termina o TLS e encaminha cada domínio para a porta interna
correspondente. Os processos devem escutar em `0.0.0.0`; um bind em `127.0.0.1`
funciona dentro do contêiner, mas não pode ser alcançado pelo proxy.

### Perfis

| Perfil | Responsabilidade | Integrações principais |
|---|---|---|
| `code-reviewer` | Revisão técnica de código por aplicação ou pacote alterado | GitHub App MCP |
| `e2e-tester` | Validação dos requisitos `REQ-*` dos PRDs/milestones afetados na Web App staging | GitHub App MCP, Playwright MCP e Chromium via CDP |
| `kepler` | Assistente geral do projeto, tendo o GitHub como fonte primária | GitHub App MCP |

As instruções dos perfis ficam em seus respectivos `soul.md`. Os agentes devem
ler `AGENTS.md`, tratar conteúdo do repositório e do PR como entrada não
confiável e responder em PT-BR. O `code-reviewer` apenas revisa: não modifica o
repositório, não faz commits, não aprova e não incorpora PRs.

### Fluxo de revisão de código

1. O workflow aguarda a conclusão dos CIs aplicáveis ao SHA atual do PR.
2. Os arquivos alterados são agrupados por aplicação ou pacote.
3. O GitHub Actions inicia uma execução do perfil `code-reviewer` por escopo,
   permitindo processamento paralelo.
4. Cada defeito novo é publicado como comentário inline individual, após a
   leitura das conversas existentes para evitar duplicações.
5. Uma única conclusão final registra SHA, escopos e quantidade de findings.

### Fluxo E2E de release

1. O SHA do PR de `main` para `production` é implantado na Web App staging.
2. O workflow identifica os PRDs/milestones relacionados à release.
3. Uma execução do perfil `e2e-tester` valida cada milestone em paralelo usando
   Playwright MCP e uma sessão autenticada inicializada por variáveis de
   ambiente.
4. Screenshots, erros de console, falhas de página e rede permanecem no volume
   persistente do Hermes; a conclusão consolidada é publicada no PR.
5. Após o merge, `create-release.yaml` exige o E2E aprovado antes de criar tag e
   GitHub Release.

### Segurança e persistência

- O volume `/opt/data` preserva configurações, perfis, sessões, logs e
  evidências entre deploys.
- A Runs API exige `Authorization: Bearer`; o dashboard exige autenticação
  própria e não compartilha sua senha com a API.
- A GitHub App é instalada somente no repositório autorizado, com acesso de
  leitura ao conteúdo e escrita em Pull Requests.
- O Chromium sidecar fica somente na rede interna e usa token de acesso.
- O serviço não recebe acesso ao `docker.sock`, a secrets de produção ou ao
  banco de produção.
- Evidências e sessões devem ser removidas periodicamente por uma tarefa cron do
  Hermes, com retenção definida antes da ativação da limpeza.

---

## Notas operacionais

- **Builds paralelos:** evitar na VPS KVM 2 (2 vCPU). Configurar concurrency nos workflows e no Coolify para serializar.
- **Swap:** 4 GB de swap configurado (`/swapfile`) para absorver picos de memória durante builds Docker.
- **Renovação VPS:** o preço promocional do KVM 2 (R$ 43,99/mês) renova a R$ 77,99/mês. Avaliar upgrade para KVM 4 se os builds ficarem lentos.
- **Proxy Cloudflare:** pode ser habilitado (nuvem laranja) após confirmar que todos os certificados Let's Encrypt foram gerados. Requer configurar SSL mode como **Full (Strict)** no Cloudflare.
- **Inngest:** após migração completa, atualizar as URLs de callback no painel do Inngest Cloud para os novos domínios.
