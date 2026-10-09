# Arquitetura do StarDust

## Visão Geral

O StarDust usa uma arquitetura **Hexagonal (Ports and Adapters)** onde o pacote `@stardust/core` atua como núcleo agnóstico a frameworks, e as aplicações (`web`, `server`, `studio`) atuam como adaptadores. É um monorepo gerenciado pelo TurboRepo com frontend em Next.js e backend em Hono/Node.js.

## Apps e Pacotes

- **Web (`apps/web/`)**: Frontend principal em Next.js 15 com React Server Components. UI organizada por domínio seguindo o padrão Widget (View + Hook + Index).
- **Server (`apps/server/`)**: API REST em Hono/Node.js. Processa requisições HTTP, expõe um endpoint MCP autenticado em `/mcp` e executa jobs assíncronos via Inngest.
- **Studio (`apps/studio/`)**: Aplicação administrativa interna em React Router v7.
- **Core (`packages/core/`)**: Regras de negócio puras com DDD tático. Sem dependência de frameworks. Contém Entities, Structures, Aggregates, Use Cases e Interfaces.
- **Validation (`packages/validation/`)**: Schemas de validação com Zod, compartilhados entre as apps.
- **Email (`packages/email/`)**: Templates de e-mail construidos com React Email para envio de e-mails.
- **LSP (`packages/lsp/`)**: Implementação da Linguagem de Programação Delegua para análise, execução, autocomplete e configuração de editor.

## Fluxo de Dados (resumo)

**RPC**: Route/Controller → Action.execute(call) → Use Case → call.redirect() ou call.json()

**REST**: Service → RestClient (Axios/Fetch) → API externa → RestResponse\<T\>

**MCP**: Hono `/mcp` → API key auth + verificação de insignia → Toolkit/Tool → Use Case

**Rate limiting transversal**: CORS → limite por IP → Supabase/autenticação → limite por conta → rota REST ou MCP. O Core expõe somente o port `RateLimiterProvider`; o Server usa um adapter ioredis dedicado com janela fixa, política geral/sensível, fail-open e circuit breaker local. O IP e a conta são dimensões independentes e a identidade usada nas chaves é SHA-256 opaca.

**Queue**: Event Dispatcher → Inngest → Job.handle(amqp) → Use Case

**Product analytics**: Use cases confirmam fatos de negócio → publicam eventos de domínio → Inngest `AnalyticsFunctions` normaliza payloads e usa `context.event.id` como `$insert_id` → `TrackAnalyticsEventJob` executa `ServerAnalyticsProvider.trackEvent(...)` dentro de `amqp.run(...)` → PostHog. No browser, `ClientProviders` inicializa PostHog com bootstrap da conta autenticada, captura pageviews/session recording e `AuthContextProvider` identifica login/cadastro social ou reseta no logout.

**Web integration tests**: Playwright → app web local em `MODE=testing` → route test-only `/api/tests/server` registra respostas fake HTTP consumidas por SSR e browser → `ClientProviders` injeta `ProfileChannelMock` no `RealtimeContextProvider` → rota real `/auth/sign-up` valida requests, estados de UI e eventos realtime sem depender do backend real nem do Supabase realtime.

**Daily active users report**: Studio `DailyActiveUsersChart` → Server `GET /profile/users/daily-active-users-report?days=N` → `GetDailyActiveUsersReportUseCase` → `AnalyticsReportingProvider` → PostHog Query API → `DailyActiveUsersDto [{ date, web, mobile }]`

**Lesson audio generation/removal**: REST `/lesson/text-blocks` → use cases do modulo `lesson` → eventos Inngest (`requested`, `batch requested`, `generated`, `cancelled`, `audio-file.removed`) → jobs de fan-out, TTS/upload, limpeza fisica de arquivo e persistencia final do `audio` em `stars.texts[blockIndex].audio`

**Challenge code executions**: Web `ChallengeCodeEditorSlot` → Server `POST /challenging/challenges/:challengeId/code-executions` autenticado → `RunChallengeCodeUseCase` executa Delegua via `LspProvider`, classifica o status e persiste `challenge_code_executions` no Supabase → aba `Execucoes` lista historico paginado por usuario/desafio → recompensa de challenge/star challenge valida ultima execucao aceita e contagem de erros no server, sem confiar em contadores do browser.

**Studio signed upload**: Studio `ImageInput` → `StorageService.createSignedUploadUrl(...)` → Server `POST /storage/signed-upload-url` → `CreateSignedUploadUrl` → provider de armazenamento selecionado no Server → browser envia o arquivo diretamente à URL assinada.

**Upload local e produção**: Studio `ImageInput` → Server `POST /storage/signed-upload-url` → `StorageMiddleware` compõe o provider por ambiente → MinIO via `S3FileStorageProvider` em development ou Cloudflare R2 em production → browser envia o arquivo diretamente à URL assinada. Os providers concretos ficam separados por provedor em `apps/server/src/provision/storage/s3/` e `dropbox/`; o contrato `FileStorageProvider` permanece no Core.

**Infraestrutura local de desenvolvimento**: `docker-compose.yml` inicia o PostgreSQL Supabase, GoTrue, PostgREST, Realtime, Envoy, Mailpit, MinIO, Redis e Inngest. Envoy encaminha Auth, REST e Realtime e traduz a chave publishable opaca para a credencial interna; credenciais internas ficam somente no `.env.local` raiz e não são passadas aos apps. Server e Web usam `SUPABASE_PUBLISHABLE_KEY` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. O Mailpit captura o SMTP e expõe a API local; o serviço separado `supabase-templates` serve os templates versionados de confirmação e recuperação. O Server mantém PostgREST para os repositories atuais (`supabase.from(...)`) e usa `DATABASE_URL` apenas para operações administrativas de feedback após autorização de God Account; a futura adoção de Drizzle e a retirada ampla de RLS ficam para task separada. `npm run db:test -w @stardust/server` aplica o reset e as migrations versionadas sem seed; os testes de rota confirmam contas efêmeras pelo link/token hash extraído da mensagem no Mailpit. Somente PostgreSQL e MinIO persistem sob `docker/volumes/`; os demais serviços locais são descartáveis. Portas host são configuráveis na `.env.local` raiz, limitadas a loopback pelos guards das aplicações.

**Feedback history and conversations**: authenticated Web `FeedbackLayout` → `ReportingService` → Server `mine` controllers with the request JWT → Core user-history use cases → Supabase repositories/RLS filtered by `auth.uid()`; initial and message attachments use contextual signed-upload endpoints and upload directly to storage before report/message persistence. God Account feedback administration authenticates in Server and uses its direct PostgreSQL connection, without a Supabase service-role API key. User replies publish the existing idempotent feedback event for the Inngest Discord job, while the UI re-queries history, detail and unread count instead of opening a realtime channel.

## Padrões Principais

- **Widget** na UI para separar View (renderização), Hook (lógica/estado) e Index (integração).
- **Action/RPC** para conectar rotas ao domínio sem acoplar o framework ao Core.
- **MCP Toolkit** no server para compor tools com `inputSchema`/`outputSchema` na borda e delegar comportamento ao Core.
- **RestClient** como adapter sobre Axios/Fetch para chamadas HTTP externas.
- **Providers de Analytics** para isolar SDKs/APIs externas como PostHog atrás de contratos do Core (`ServerAnalyticsProvider`, `ClientAnalyticsProvider`, `AnalyticsReportingProvider`).
- **RateLimiterProvider** no Core, implementado por `IORedisRateLimiterProvider` no Server; o middleware Hono aplica IP antes da autenticação e conta após identidade REST/API key verificada.
- **ProvisionContext no Studio** para resolver providers client-side de infraestrutura, como o upload direto por URL assinada, sem misturar essa responsabilidade no dominio nem no widget.
- **Job** para tarefas assíncronas, agendadas ou falháveis (e-mail, relatórios).
- **Factory Functions** no lugar de `new Class()` para Serviços e Controllers.

## Decisões Arquiteturais

- O Core permanece puro: sem Next.js, Hono ou Axios — apenas interfaces e lógica de domínio.
- Dependências apontam sempre para dentro: Apps importam Core, nunca o contrário.
- TurboRepo garante compartilhamento de código e orquestração de scripts entre as apps.
- TypeScript estrito em todo o projeto para máxima segurança de tipos.

## Stack Tecnológica

| Tecnologia | Pacote/Ferramenta | Finalidade |
| :--- | :--- | :--- |
| **Linguagem** | TypeScript 5.8+ | Tipagem estática em todo o projeto |
| **Frontend** | Next.js 15, React 19 | Server Components e UI principal |
| **Backend** | Hono, Node.js | API REST leve e rápida |
| **App Interno** | React Router v7 | Ferramentas administrativas |
| **Banco de Dados** | Supabase (PostgreSQL) | Persistência relacional e BaaS |
| **Fila/Jobs** | Inngest | Background jobs e workflows assíncronos |
| **Estilização** | Tailwind CSS, Radix UI | Utility-first CSS e primitivos acessíveis |
| **Validação** | Zod | Schemas compartilhados entre apps |
| **Monorepo** | TurboRepo, NPM | Orquestração e gerenciamento de dependências |
| **Linter/Formatter** | Biome | Qualidade e padronização de código |
| **Testes** | Jest, Playwright | Testes unitários, de composição e fluxos reais de navegador |

## Estrutura de Diretórios Geral

```
stardust/
├── apps/
│   ├── web/
│   ├── server/
│   └── studio/
└── packages/
    ├── core/
    ├── validation/
    ├── email/
    └── lsp/
```

## Transição aprovada: Drizzle e SSE (Issue #602)

O estado implementado ainda é o descrito acima. O destino aprovado para a Issue #602 é PostgreSQL via Drizzle no Server para toda persistência relacional, mantendo Supabase Auth no Server e S3 para arquivos. A Spec em `documentation/features/global/supabase-replacement-with-drizzle/spec.md` define a transição; este texto não declara a implementação concluída.

A organização Drizzle segue o padrão de models, tipos inferidos em types/entities, mappers, repositories e migrations de Scoops, adaptado à camada Database StarDust: apps/server/src/database/drizzle é a única raiz, agrupada pelos domínios StarDust; schema.ts agrega models e migrations ficam dentro do adapter. Esta referência de organização não introduz módulos ou dependências de Scoops.

No destino, REST, MCP e jobs compõem repositories Drizzle na borda. Os ports do Core continuam agnósticos. Identidade de conta é verificada pelo Auth/API key antes da composição; God Account e ownership permanecem no Server. O bootstrap de API key preserva a consulta interna por hash antes da identidade: contexto public só autoriza findByHash em ApiKeysRepository para validação, sem exposição HTTP de chaves; após validar, a borda compõe os repositories de negócio com a conta resultante. Contexto público, conta, God e sistema são explícitos; ausência de identidade não concede privilégio de sistema. RLS de tabelas públicas da aplicação deixa de ser uma fronteira de autorização e o acesso direto de anon/authenticated às tabelas, views, sequências e funções da aplicação é revogado, incluindo privilégios herdados de PUBLIC. Políticas de infraestrutura cron permanecem.

O browser recebe criação de perfil por SSE do Server, através de uma rota same-origin na Web. Confirmações usam a sessão verificada. O cadastro anterior ao login usa comprovante temporário restrito, guardado pela Web em cookie HttpOnly. O Server consulta a conta autorizada ao conectar e a cada segundo enquanto aguarda; não publica eventos gerais. Fechar a página encerra stream e consultas, mas os jobs continuam. Retornar retoma a tentativa enquanto o comprovante estiver válido.

Migrations Drizzle são aplicadas no pipeline, nunca no boot. A primeira transição exige janela coordenada de manutenção de Server, Web e writers assíncronos, adoção sem reset nos bancos existentes, rollback ensaiado e validação antes da reabertura. O pool PostgreSQL é único por processo. Após a entrega, os trechos anteriores sobre PostgREST, RLS de feedback e variáveis Supabase públicas da Web devem ser substituídos pelo estado verificado.
