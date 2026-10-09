---
title: Persistência com Drizzle e confirmação de perfil via SSE
status: superseded
revision: 20
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/602
  - type: prd
    ref: documentation/prds/auth/sign-up.md
    requirements: [RP1, RP2, RP3, RP4, RP5, RP6, RP7, RP8]
  - type: prd
    ref: documentation/prds/auth/account-confirmation.md
    requirements: [RP1, RP2, RP3, RP4, RP5, RP6]
  - type: prd
    ref: documentation/prds/auth/social-account-confirmation.md
    requirements: [RP1, RP2, RP3, RP4, RP5, RP6]
    journeys: [JN1]
  - type: prd
    ref: documentation/prds/profile/user-creation.md
    requirements: [RP1, RP2, RP3, RP4, RP5]
    journeys: [JN1]
  - type: direct-request
    ref: Decisões de grilling e confirmação explícita nesta task
  - type: direct-request
    ref: Estrutura Drizzle de Scoops adaptada aos domínios StarDust, solicitada nesta task
scope:
  - apps/server
  - apps/web
  - packages/core/auth
  - docker/supabase
  - scripts
  - .github/workflows
  - documentation
  - design/handoff.md
last_updated_at: 2026-10-06
---

# Context and scope

> **Superseded in revision 20 by explicit user decision.** The remaining delivery scope was cancelled. RF-01–RF-12, CA-01–CA-22, EV/VM entries, and the technical/path contracts below are retained as historical traceability only; none is an active acceptance requirement, and this status does not claim that the implementation or cutover was completed. C2 is retained only for cancellation closeout and handoff.

A Issue #602 pede retirar Supabase da persistência relacional e do realtime da aplicação, mantendo Supabase Auth no Server. Esta é uma Spec completa: a troca alcança 25 repositories, composição REST/MCP/jobs, migrations, fixtures, CI/CD e os três fluxos de onboarding da Web. Não há PRD associado na Issue; os quatro PRDs acima são fontes explícitas de preservação, consultadas por causa dos comportamentos alcançados, não uma associação presumida da Issue.

## Fontes, pesquisa e lacunas verificadas

| Lane | Evidência local e resultado | Limite |
| --- | --- | --- |
| Persistência | CodeGraph: ports Core, Supabase repositories/mappers, Postgres feedback, Hono routers/middlewares, toolkits e funções Inngest. Persistência hoje via PostgREST; feedback administrativo já tem pool PostgreSQL separado. | Nenhum repository/interface de domínio deve ser redesenhado. |
| Schema/operação | 24 migrations ativas em apps/server/supabase/migrations; SQL legado avulso dentro de src/database/supabase não é runner ativo. Pipeline atual migra antes de acionar deploy Server; Web tem workflow independente. | Supabase Dev não respondeu ao catálogo; Prod desconectado. Stack local não estava rodando. Nenhuma parity, restauração ou implantação foi validada nesta autoria. |
| Onboarding Web | CodeGraph: ProfileChannel, cadastro, confirmação email/social, RestContext e realtime. Cadastro espera INSERT de users antes do login; eventos gerais são filtrados por email no browser. | AuthService.requestSignUp não pode mudar seu AccountDto público para carregar credencial. |
| Design | design/stardust.pen existe, mas Pencil falhou ao enumerar nodes. Implementação atual, componentes e tokens são a referência de preservação aprovada. | Nenhum Node ID, frame ou screenshot Pencil foi validado. Ausência aprovada; não inventar nodes ou redesenhar UI. |
| Estrutura de referência | Scoops apps/server: CodeGraph verificou DrizzleClient, userModel, DrizzleUser e DrizzleUserMapper; schema.ts exporta models dos módulos e drizzle.config.ts aponta out para migrations dentro do adapter. | Referência de organização, não dependência de outro checkout; adaptar à camada Database e às convenções StarDust. Não importar NestJS, Better Auth, listeners ou domínios Scoops. |
| Autoridades | Architecture, Rules, SDD, Tooling, Modules e Design lidos. documentation/overview.md listado em AGENTS não existe. | Não criar overview nem preencher jornadas que os PRDs deixam indefinidas. |

PRDs sem campo revision: cadastro atualizado em 2026-06-17; confirmação email em 2026-06-28; confirmação social em 2026-06-15; criação de usuário em 2026-03-10. A versão de fonte é identificada por esses documentos/datas, sem fabricar número de revisão. RP1–RP8 do cadastro mapeiam a RF-06/RF-07/RF-11; RP1–RP6 das confirmações a RF-06/RF-08/RF-11; RP1–RP5/JN1 de criação de usuário a RF-01/RF-06. JN1 do cadastro/email não tem fluxo suficientemente definido e não é usada como contrato. O comportamento legado sem token/sessão nas confirmações continua conforme RP6; esta refatoração não redesenha essa jornada.

## Escopo e preservação

Toda leitura/escrita relacional de aplicação no Server, incluindo feedback administrativo, passa a Drizzle/PostgreSQL. Supabase SDK permanece para Auth no Server e na fixture de Auth. S3/MinIO/R2, upload assinado, backups pg_dump, contratos Core existentes, eventos e steps Inngest, API keys, rate limiting, OAuth, login/refresh/reset de senha e contratos HTTP existentes são preservados. PostgreSQL/Supabase hospedado permanece; não trocar provedor, tabelas de Auth ou motor de banco.

Remover policies próprias de aplicação em public e storage.objects; desabilitar RLS das tabelas public da aplicação e revogar acesso direto via Data API. Políticas cron e infraestrutura administrada pelo Supabase permanecem. Serviços PostgREST/Realtime locais podem continuar presentes como infraestrutura, sem consumo da aplicação nem grants que reabram seus dados. Nenhum reset remoto, reestruturação de conteúdo, seed global, Redis pub/sub, release gradual, implementação, deploy, commit ou PR faz parte da autoria desta Spec.

## Decisões aprovadas

| Decisão | Evidência, alternativa e consequência |
| --- | --- |
| D-01: Server possui persistência/autorização | Architecture/Issue e acesso direto já existente. Alternativa manter RLS/SDK rejeitada pelo escopo. Remover RLS exige preservar filtros de ownership/roles e testar duas contas, não confiar no pool privilegiado. |
| D-02: comprovante temporário antes do login | Cadastro atual não possui sessão. Aprovado preservar espera SSE, em vez de mostrar sucesso imediatamente após API. Credencial só autoriza consultar prontidão da tentativa, nunca login. |
| D-03: consulta imediata e periódica | Aprovado SELECT indexado por conta ao conectar e a cada segundo enquanto aguarda. Alternativa Redis/notificação rejeitada pela simplicidade. Até cerca de um segundo de atraso; custo proporcional a esperas ativas. |
| D-04: saída/retorno | Aprovado fechar stream/consultas sem cancelar criação/email; cookie HttpOnly curto permite retomar na mesma origem/browser. Outra máquina/browser depende do link de confirmação, não de recuperação por email arbitrário. |
| D-05: transição completa | Aprovada única janela coordenada. Alternativa releases compatíveis rejeitada. Tráfego e writers pausados antes de grants/migrations; rollback ensaiado e versões Server/Web coordenadas antes da reabertura. |
| D-06: design/autoridades | Aprovada preservação da UI atual na ausência de nodes Pencil verificáveis e alinhamento Architecture/Rules/Tooling com destino explicitamente planejado. Remoto indisponível é precondição de implantação, não prova de parity. |
| D-11: resolução dos gates | Por solicitação explícita do usuário para resolver os bloqueios, preservar thresholds; usar as rotas reais de S2 para exercitar os adapters Drizzle; combinar projetos Jest `server` e `server-integration` no relatório de coverage; e aplicar CI-09/CI-10 globais no gate integrado C2. A baseline de complexity foi atualizada pela decisão D-12. A action social usará fetch sem cache para retornar a classificação atual do Server. |
| D-12: baseline global de complexity | A pedido explícito do usuário em 2026-10-05, atualizar `.code-multivitals-baseline.json` para aceitar os findings presentes no código atual. Os thresholds permanecem inalterados. CI-09 exige zero findings acima dessa baseline no C2; findings já registrados são dívida aceita, não declarações de que foram corrigidos. Não atualizar a baseline novamente durante o gate C2. |
| D-07: validação manual e Mailpit | Solicitação expressa do usuário na revisão 2: retirar cadastro/confirmação social do smoke manual, preservando sua cobertura automatizada. Exceção delimitada à exigência geral de smoke frontend; a instrução do usuário prevalece nesta entrega. Explicitar Mailpit no smoke de confirmação email e nas fixtures de Auth dos testes Server, conforme Tooling e Server Routes Rules. |

| D-08: estrutura Drizzle de Scoops | Pedido explícito do usuário na revisão 4. Adotar models, types/entities, mappers, repositories, schema agregador e migrations dentro do adapter. Scoops distribui adapters por módulos; StarDust preserva sua camada apps/server/src/database/drizzle e agrupa os models/mappers/repositories/tipos pelos próprios domínios. PascalCase para classes/tipos e kebab-case para constantes de model, conforme Code Conventions. Alternativa anterior de schema monolítico/tipos planos/migrations fora do adapter substituída; contratos, dados e 25 ports permanecem. |

| D-09: prontidão via repository existente | Pedido explícito do usuário: Reader pode ser repository. Reutilizar UsersRepository.findById e DrizzleUsersRepository de S1; não criar ProfileCreationReader, adapter paralelo ou nova assinatura no Core. Carrega User segundo contrato existente, mas resume/stream expõem apenas a presença e os quatro campos já autorizados. Alternativa de reader especializado retirada; polling/cancelamento/isolamento permanecem. |

| D-10: nome do actor de usuário | Sugestão aceita explicitamente pelo usuário na revisão 6: substituir kind account por user em DatabaseAccess. accountId continua identificando a conta de Auth, inclusive antes de existir perfil. A alteração é nominal; verificação da identidade, ownership e acessos public/God/system permanecem. |

# Implementation Contract

## Requisitos

| RF | Resultado contratado |
| --- | --- |
| RF-01 | Os 25 ports de persistência recebem implementação Drizzle preservando assinaturas, entidades, filtros, paginação, ordenação, contagens, nulls, relações e efeitos. |
| RF-02 | Identidade verificada, autorização God/insignia/API key e ownership são preservados no Server, inclusive rotas públicas com personalização opcional e MCP. |
| RF-03 | Schema final e dados existentes são preservados; baseline Drizzle admite banco vazio e adoção segura dos bancos existentes. |
| RF-04 | RLS próprio de aplicação é retirado com negação de acesso direto anon/authenticated/PUBLIC, inclusive RPCs/functions/views e default privileges. |
| RF-05 | Migrations, fixtures, scripts e CI/CD usam Drizzle e Supabase local para validação; primeira implantação ocorre numa única manutenção com rollback. |
| RF-06 | Server entrega criação de perfil apenas à conta/tentativa autorizada, consultando estado persistido; provisionamento assíncrono e contratos UserCreatedEvent permanecem. |
| RF-07 | Cadastro email recebe comprovante restrito via cookie HttpOnly, mantém sucesso após perfil persistido e retoma após saída/reload enquanto válido. |
| RF-08 | Confirmações email/social usam sessão verificada, recuperam perfil pré-existente, reconsultam usuário antes de concluir e mantêm retry/CTA/animações atuais. |
| RF-09 | SSE tem cancelamento, limites de duração, expiração, reconexão, deduplicação terminal e consulta não sobreposta; não cria consumidores/jobs permanentes. |
| RF-10 | Web retira SDK/env/tipos Supabase; Core, UI e mappers mantêm as fronteiras hexagonais. |
| RF-11 | Estrutura visual atual e comportamento dos três fluxos são preservados, com estado de retomada usando componente pendente existente. Cadastro email/confirmação mantêm smoke real obrigatório; social tem cobertura automatizada conforme D-07. |
| RF-12 | Regressões são cobertas nas fronteiras permitidas, incluindo persistência real, isolamento de conta, streams BFF e navegadores com mocks determinísticos. |

## Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| CA-01 | RF-01 | Dados representativos dos 25 ports | REST, MCP e jobs executam operações atuais | Mesmo domínio, payload, count/ordem/paginação/null e efeitos persistidos; nenhum .from/.rpc relacional no runtime | Testes integrados focados nos fluxos incluídos nas fases ativas; sem inventário exaustivo de cada operação como gate separado |
| CA-02 | RF-01 | Relações, feedback com anexos e blocos JSON concorrentes | Replace, mutação de conversa e update/clear audio | Transação não deixa relações parciais; anexos/status consistentes; atualização JSON não perde blocos concorrentes; marcador de leitura não retrocede | Testes de integração nos cenários de transação/concorrência contratados para a entrega |
| CA-03 | RF-02 | Conta A, B, visitante, God, API key válida/revogada e JWT forjado | Operações públicas/privadas/administrativas/personalizadas/MCP | Mesmo alcance legítimo e erros públicos; B/visitante/forjado não lê nem altera conteúdo privado de A; ausência de identidade não vira system | Testes nos boundaries de autorização relevantes; sem matriz ator × endpoint completa como gate separado |
| CA-04 | RF-03 | Banco local vazio | Migrate duas vezes | Schema final correto incluindo custom SQL; segunda execução sem alteração; sem seed/backfill; constraints/FKs/defaults/índices preservados | EV-03: scripts e catálogo local |
| CA-05 | RF-03 | Restauração do legado com 24 migrations e dados | Preflight e adoção | Baseline/objects registrados atomicamente sem replay DDL sobre dados, sem perda de linhas; migration de acesso ainda pendente | EV-03: restauração isolada e comparações de catálogo/contagens |
| CA-06 | RF-03 | Schema/histórico divergente ou adoção concorrente | Adopt ou preflight | Falha antes de marcar migrations/aplicar segurança; ledger permanece íntegro; lock serializa concorrência; relatório sem dados/segredos | EV-03: cenários de script |
| CA-07 | RF-04 | Migração de acesso aplicada | Anon e authenticated tentam SELECT/DML/views/RPC, inclusive funções SECURITY DEFINER | Acesso direto negado e HTTP Server legítimo funciona; grants herdados de PUBLIC/default privileges não reabrem acesso | EV-04: SQL privileges e requisições Data API locais |
| CA-08 | RF-04 | Policies do projeto e de infraestrutura | Migração de acesso e inversa em clone | Policies próprias retiradas e public RLS desligado; cron/infrastrutura preservados; rollback restaura policies/grants/flags anteriores exatamente | EV-04: catálogo e ensaio de rollback |
| CA-09 | RF-05 | Artefatos do mesmo release e backup ensaiado | Janela de transição | Writers/tráfego pausados antes da migração; Server/Web atualizados; SHA implantado e smoke aprovados antes de reabrir; falha mantém manutenção e permite rollback | EV-05: runbook de corte/rollback |
| CA-10 | RF-06 | Conta/tentativa autorizada sem perfil | Perfil é persistido pelo fluxo assíncrono | SSE emite somente UserCreatedEvent dessa identidade, sem broadcast/email selector; provisioning inicial email/social permanece | EV-06: GET profile/events e jobs |
| CA-11 | RF-06 | Perfil criado antes de abrir stream ou durante queda | Conectar/reconectar em qualquer réplica | SELECT inicial encontra perfil e emite terminal; não depende de evento passado/processo que criou o usuário | EV-06: rotas stream e reconexão |
| CA-12 | RF-07 | Cadastro sem sessão | POST signup passa pelo BFF | Body/status atuais preservados; cookie curto HttpOnly, SameSite=Lax e Secure em produção; receipt/header não é exposto ao JS; não autoriza endpoints autenticados | EV-07: controller + rota Web + browser |
| CA-13 | RF-07 | Receipt ausente, adulterado, expirado ou signup de email já existente | Resume/stream/endpoints protegidos | Sem acesso a perfil alheio, sem sessão e sem estender validade; cookie inválido/expirado removido; nenhum sucesso falso por re-registro | EV-06/EV-07: casos de autorização e privacidade |
| CA-14 | RF-07 | Tentativa ativa | Sair, aguardar criação e retornar/recarregar na mesma origem | Stream antigo cancelado, jobs/email continuam; retorno recupera email/name e prontidão sem senha, sem novo signup, mostra pendente ou sucesso existente | EV-07: saída/reload e retomada automatizados; VM-01 cobre o cadastro feliz |
| CA-15 | RF-07 | Receipt expirado | Retornar à página | Formulário atual disponível; expiração não apaga/cancela a conta nem o email; link de confirmação continua válido segundo Auth | EV-07: hook/browser; sem exploração manual de erro |
| CA-16 | RF-08 | Confirmação autenticada email/social | Perfil é encontrado ou chega terminal | Refetch conclui perfil da conta verificada antes de sucesso; retry após 7s preservado e sucesso do retry ainda espera persistência | EV-08: hooks/browser automatizados email e social; VM-02: confirmação email real via Mailpit |
| CA-17 | RF-08 | Social com perfil existente ou tokens ausentes | Montagem e navegação | Tokens tratados uma vez; perfil existente mantém animação/redirect com a classificação atual retornada pelo request sem cache; ausência mantém RP6; nenhuma assinatura com identidade indefinida | EV-08: social browser e hooks |
| CA-18 | RF-09 | Stream sem perfil, abort/shutdown/expiração | Executar espera/fechar aba/cancelar BFF | Uma chamada findById inicial; intervalo 1s após cada chamada, sem sobreposição; heartbeat 15s; stream ≤60s; zero novas consultas após abort/terminal/expiry | EV-06/EV-09: relógio controlado nas fronteiras de rota |
| CA-19 | RF-09 | Reentrega/reconexão ou erro de DB após headers | Consumidor processa frames | Terminal deduplicado, EventSource fechado; erro não vira JSON dentro SSE; recursos liberados e reconnect limitado pela credencial | EV-06/EV-09: rota e hook, sem teste dedicado do adapter |
| CA-20 | RF-10 | Build/import graph final | Executar sensores e inventário | Layout Drizzle conforme D-08, models como fonte única de schema/tipos e migrations no out canônico; nenhum Supabase SDK/tipo/env na Web; Server SDK limitado Auth/test Auth; Core sem HTTP framework/Drizzle/SDK; pool único encerrado no shutdown | EV-10: code/types/architecture/build e inventário |
| CA-21 | RF-11 | Cadastro, email e social em 390×844 e 1440×900 | Caminho feliz e estado de retomada | Mesma composição/tokens/assets/CTA, sem overflow; pendente reutiliza componente atual; sucesso/rota protegida observáveis e essenciais 2xx | VM-01/VM-02 e EV-11: evidência manual email; EV-07: retomada/renderização automatizadas; EV-08: renderização/transições e screenshots automatizados social, sem smoke manual; ausência Pencil aprovada em handoff |
| CA-22 | RF-12 | Stack/mocks isolados | Executar suítes e sensores | Testes reais Server preparados por db:test; Web testing 127.0.0.1:3100; um arquivo por rota; nenhum novo teste de repo/mapper/provider/fixture/service | EV-12: sensores e integridade de testes |

# Technical Contract

## Fluxo e ownership

```mermaid
sequenceDiagram
    participant UI as Web UI
    participant BFF as Next same-origin
    participant API as Server Hono
    participant Auth as Supabase Auth
    participant Jobs as Inngest
    participant DB as PostgreSQL Drizzle
    UI->>BFF: POST /api/auth/sign-up
    BFF->>API: POST /auth/sign-up (contrato atual)
    API->>Auth: signUp
    Auth-->>API: accountId sem sessão
    API->>Jobs: AccountSignedUpEvent existente
    API-->>BFF: AccountDto + headers internos de receipt/expiração
    BFF-->>UI: AccountDto + Set-Cookie HttpOnly
    UI->>BFF: GET /api/auth/profile-events
    BFF->>API: GET /profile/events + receipt ou sessão
    API->>API: Verificar credencial e resolver accountId
    loop Enquanto aguarda (consulta inicial, depois 1s)
        API->>DB: SELECT perfil da conta autorizada
    end
    Jobs->>DB: Provisionar e persistir usuário via repositories
    API-->>BFF: event user.created (terminal)
    BFF-->>UI: UserCreatedEvent compatível
    UI->>UI: Cleanup; confirmação refetch ou sucesso signup
```

BFF é transporte e cookies, sem imports cross-app e sem acesso SQL. Conta e autorização são resolvidas pelo Server; query/body nunca escolhem accountId/email para SSE. Jobs continuam independentes da conexão. Fechar aba aborta fetch/stream/consulta seguinte, não jobs.

## S1 — Database, contexto e repositories

### Organização adaptada de Scoops

A referência local verificada é /home/petros/projects/scoops/apps/server: src/shared/database/drizzle/schema.ts agrega modelos dos módulos, drizzle.config.ts usa migrations dentro do adapter, e os módulos têm models, types/entities, mappers e repositories. Esta Spec contém o contrato offline completo; a implementação não depende do checkout Scoops estar presente. O pedido do usuário resolve a mudança de organização (D-08); não há nova decisão de produto ou transporte.

StarDust conserva sua organização por camadas e usa uma única raiz Database. Domínios de models: auth, challenging, conversation, forum, lesson, manual, playground, profile, ranking, reporting, shop e space. Mappers/repositories continuam nos domínios atuais. Rows/projeções ficam em types/entities/<domínio>; types/index.ts reexporta entities e o alias escalar DrizzleInsigniaRole. DrizzleRepository passa à raiz do adapter, junto ao client. Não copiar módulos NestJS, Better Auth, listeners, outbox, seeds ou contextos transacionais de Scoops para esta entrega.

```text
apps/server/
├── drizzle.config.ts
└── src/database/drizzle/
    ├── DatabaseAccess.ts
    ├── DrizzleClient.ts
    ├── DrizzleRepository.ts
    ├── schema.ts
    ├── index.ts
    ├── errors/
    ├── models/                 # domínio → constantes pgTable/pgEnum + barrel
    ├── types/
    │   ├── entities/           # domínio → tipos inferidos/projeções + barrel
    │   ├── DrizzleInsigniaRole.ts
    │   └── index.ts
    ├── mappers/                # domínio → Drizzle<X>Mapper + barrel
    ├── repositories/           # domínio → Drizzle<X>Repository + barrel
    ├── migrations/
    │   ├── 0000_baseline.sql
    │   ├── 0001_application_objects.sql
    │   ├── 0002_server_owned_access.sql
    │   └── meta/               # journal e snapshots gerados
    ├── legacy-schema-manifest.json
    └── rollback/
        └── 0002_server_owned_access.sql
```

Models: uma constante <entidade>Model por tabela física, exportada do arquivo <entidade>-model.ts; uma constante <enum>Model por pgEnum, com nome/valores/ordem SQL preservados. O mapa declara os 39 models de tabelas finais e sete enums ativos do replay legado. Cada model mantém integralmente colunas/tipos/null/default, constraints/FKs/ON DELETE/UPDATE e índices de sua tabela no manifest; propriedades TypeScript usam camelCase e apontam para os nomes SQL legados, sem renomear colunas. Mappers adaptam essas propriedades sem alterar DTOs/domínio. Tabelas de relação users_* ficam em profile; challenges_categories em challenging; challenges_comments/solutions_comments em forum. FKs importam o model alvo diretamente, inclusive entre domínios dentro desta camada; barrels não podem gerar ciclos de inicialização. Models não importam repositories/mappers/Core use cases.

Questions: a tabela física questions continua modelada em lesson para parity do schema, mesmo que a leitura atual do port use JSON de stars; não confundir questionModel com QuestionDto/DrizzleQuestionMapper, nem mudar o armazenamento de perguntas. TextBlocks e Stories continuam campos JSON/texto de stars, sem novas tabelas. Types de rows usam InferSelectModel<typeof model> (ou $inferSelect), e inserts InferInsertModel<typeof model> (ou $inferInsert), sempre derivados do model; joins agregam tipos inferidos, não um Database.ts manual/gerado separado. DrizzleInsigniaRole deriva de insigniaRoleModel.enumValues. Todos os símbolos de models/projeções são internos à camada Database.

schema.ts somente reexporta models/index.ts; models/index.ts agrega os barrels de domínio. DrizzleClient e Drizzle Kit usam esse mesmo módulo. drizzle.config.ts na raiz de apps/server define dialect postgresql, schema ./src/database/drizzle/schema.ts, out ./src/database/drizzle/migrations e o ledger já contratado. O runner e os scripts root resolvem esse diretório pela raiz do workspace/repositório, sem depender do cwd da chamada. Manifest/inversa ficam fora do out, não entram no journal e não são migrations forward. Não manter apps/server/drizzle como segunda fonte, nem declarar tabelas novamente em schema.ts.

Usar drizzle-orm **0.45.3**, drizzle-kit **0.31.11** (dev dependency) e o driver postgres já existente; versões resolvidas no package-lock gerado por npm install. Um pool por processo reutiliza SUPABASE_DATABASE_URL, max=10 e timeouts atuais; close no SIGINT/SIGTERM sem pool paralelo de feedback. URL fica apenas no Server/pipeline; nenhum service-role API key novo.

`DrizzleClient.create(databaseUrl: string): DrizzleDatabase`; `DrizzleClient.getInstance(): DrizzleDatabase`; `DrizzleClient.close(): Promise<void>`. DrizzleDatabase é tipo interno de conexão tipada pelo schema, não port Core. `DatabaseAccess` é união server-only: `{kind:'public'}`, `{kind:'user',accountId:Id}`, `{kind:'god',accountId:Id}`, `{kind:'system'}`. Não adicionar defaults de system nos constructors.

Cada classe `Drizzle<X>Repository` recebe `(database: DrizzleDatabase, access: DatabaseAccess)` e implementa exatamente o port `<X>Repository` na tabela de assinaturas abaixo. Dados públicos são consultáveis com public; dados privados filtrados por actor verificado, com God/system apenas nos usos administrativos/jobs já autorizados. Contexto system é composto exclusivamente nas bordas jobs e fixtures locais; MCP deriva conta da API key validada. O bootstrap de API key preserva AuthenticateApiKeyUseCase: AuthMiddleware/MCP compõem DrizzleApiKeysRepository com public exclusivamente para findByHash(keyHash:Text), após hashing pela implementação atual de ApiKeySecretProvider. Essa consulta parametrizada não lista chaves nem aceita userId do client, e seu resultado não sai da borda de autenticação. Chave ausente/revogada mantém o erro atual; só depois da validação se compõem repositories de negócio com accountId verificado. Todas as outras operações de ApiKeysRepository negam public; nunca usar system para resolver esse bootstrap. SupabaseAuthService passa a receber `SupabaseClient` de Auth, sem depender dos tipos de database removidos. Suas operações Auth do Core e respostas permanecem intactos.

Preservar permissões por família: notas/snippets/chats/mensagens/execuções/API keys e feedback mine pertencem ao actor; soluções/votos/comentários mantêm author/insignia e visibilidade atual; desafios privados só aparecem para autor/administrador legitimamente autorizado; challenge/star e conteúdo público mantêm filtros atuais; mutations de usuários/loja/space respeitam os middlewares e use cases existentes. GET público personalizado trata bearer inválido como identidade ausente, nunca como claim confiável; rotas protegidas continuam 401. Verificar optional identity com Auth antes de gerar account context e rate limit; remover jwtDecode como autoridade de identidade. Não transformar endpoints públicos em protegidos.

Para mappers de entidades persistidas, `Drizzle<X>Mapper.toEntity(row:Drizzle<X>):<X>` e `toPersistence(entity:<X>):DrizzleInsert<X>` preservam os domínios dos pares legados. Exceções obrigatórias: `DrizzleQuestionMapper.toEntity(dto:QuestionDto):Question` é conversão do JSON de stars, sem tabela Question nem toPersistence novo; `DrizzleTextBlockMapper.toEntity(dto:TextBlockDto):TextBlock` e `toPersistence(block:TextBlock):TextBlockDto` convertem o JSON embarcado; `DrizzleRankerMapper.toEntity(row:DrizzleRankingUser):RankingUser` e `toDto(row:DrizzleRankingUser):RankingUserDto` preservam a projeção users/tier/position, sem entidade Ranker nem toPersistence fictício. User/RankingUser e Star/TextBlock mantêm suas projeções/join shapes explícitos. Cada model fornece `$inferSelect`/`$inferInsert` para sua tabela; DrizzleInsert<X> é alias interno de $inferInsert da tabela correspondente, declarado no mesmo arquivo de tipo Drizzle<X>. Projeções agregadas/join são tipos internos explícitos que acrescentam os campos esperados pelo mapper, sem inventar tabelas; tipos de JSON usam QuestionDto/TextBlockDto existentes. A projeção DrizzleRankingUser contém id, tierId, xp, position e user com name/slug/avatar, preservando o shape do mapper legado. Null/default, bigint→Integer, timestamps, JSON e arrays são normalizados sem mudar DTOs. Barrels exportam apenas os adapters necessários à composição. Erro SQL vira AppError/erro de domínio existente; ausência legítima retorna null, não erro PostgREST artificial; conflitos preservam status/mensagem pública sem SQL.

`DrizzleRepository` é base interna para `(database,access)`, `protected handleQueryError(error: unknown): never` e `protected calculateQueryRange(page: number, itemsPerPage: number): {offset:number;limit:number}`; offset=(page−1)×itemsPerPage após validação já existente. Não inferir paginação por cursor onde o port usa página.

Consultas substituem RPCs da aplicação com SQL parametrizado/Drizzle: list_challenges mantém todos os filtros, joins de categorias/votos/completions, contagem total e navegação; áudio em stars.texts usa atualização atômica do caminho JSON pelo índice, sem read-modify-write do documento inteiro; reporting mantém transações, anexos, mudança condicional de status, ordenação, unread e read marker monotônico. Replacements de relações delete+insert são atômicos. Eventos/efeitos externos continuam depois da persistência conforme handlers/jobs atuais, sem prometer transação distribuída ou introduzir outbox.

### Assinaturas preservadas dos 25 ports

Os nomes de tipos abaixo são os tipos Core já importados em cada port citado. Esses arquivos são dependências inalteradas, não linhas do mapa. Cada assinatura é obrigatória para o repository Drizzle correspondente; não acrescentar/remover operações de port para viabilizar a migração. A declaração duplicada idêntica de replace em ChallengeSourcesRepository é apresentada uma vez; o arquivo Core permanece inalterado.

| Port Core inalterado | Operações (entrada → retorno exatos) |
| --- | --- |
| `packages/core/src/auth/interfaces/ApiKeysRepository.ts` | `findById(apiKeyId: Id): Promise<ApiKey \| null>`; `findByHash(keyHash: Text): Promise<ApiKey \| null>`; `findManyByUserId(userId: Id): Promise<ApiKey[]>`; `add(apiKey: ApiKey): Promise<void>`; `replace(apiKey: ApiKey): Promise<void>`; `revoke(apiKeyId: Id, revokedAt: Date): Promise<void>` |
| `packages/core/src/challenging/interfaces/ChallengeCodeExecutionsRepository.ts` | `add(userId: Id, challengeId: Id, execution: ChallengeCodeExecution): Promise<void>`; `findManyByUserAndChallenge( params: ChallengeCodeExecutionsListParams, ): Promise<ManyItems<ChallengeCodeExecution>>`; `findLatestByUserAndChallenge( userId: Id, challengeId: Id, ): Promise<ChallengeCodeExecution \| null>`; `countIncorrectByUserAndChallenge(userId: Id, challengeId: Id): Promise<Integer>` |
| `packages/core/src/challenging/interfaces/ChallengeSourcesRepository.ts` | `findById(challengeSourceId: Id): Promise<ChallengeSource \| null>`; `findNextNotUsed(): Promise<ChallengeSource \| null>`; `findByChallengeId(challengeId: Id): Promise<ChallengeSource \| null>`; `findMany(params: ChallengeSourcesListParams): Promise<ManyItems<ChallengeSource>>`; `add(challengeSource: ChallengeSource): Promise<void>`; `findAll(): Promise<ChallengeSource[]>`; `replace(challengeSource: ChallengeSource): Promise<void>`; `replaceMany(challengeSources: ChallengeSource[]): Promise<void>`; `remove(challengeSourceId: Id): Promise<void>` |
| `packages/core/src/challenging/interfaces/ChallengesRepository.ts` | `findById(challengeId: Id): Promise<Challenge \| null>`; `findBySlug(challengeSlug: Slug): Promise<Challenge \| null>`; `findByStar(starId: Id): Promise<Challenge \| null>`; `findChallengeNavigationBySlug(challengeSlug: Slug): Promise<ChallengeNavigation \| null>`; `findAllByNotAuthor(authorId: Id): Promise<Challenge[]>`; `findMany( params: ChallengesListParams & { accountId: Id \| null; completedChallengesIds: IdsList }, ): Promise<ManyItems<Challenge>>`; `countPublicChallenges(): Promise<Integer>`; `findAllCategories(): Promise<ChallengeCategory[]>`; `findVoteByChallengeAndUser(challengeId: Id, userId: Id): Promise<ChallengeVote>`; `add(challenge: Challenge): Promise<void>`; `addVote(challengeId: Id, userId: Id, challengeVote: ChallengeVote): Promise<void>`; `replace(challenge: Challenge): Promise<void>`; `remove(challenge: Challenge): Promise<void>`; `removeVote(challengeId: Id, userId: Id): Promise<void>`; `replaceVote(challengeId: Id, userId: Id, challengeVote: ChallengeVote): Promise<void>`; `countAll(): Promise<Integer>`; `countByMonth(month: Month): Promise<Integer>`; `expireNewChallengesOlderThanOneWeek(): Promise<void>` |
| `packages/core/src/challenging/interfaces/SolutionsRepository.ts` | `findById(solutionId: Id): Promise<Solution \| null>`; `findBySlug(solutionSlug: Slug): Promise<Solution \| null>`; `findMany(params: SolutionsListingParams): Promise<ManyItems<Solution>>`; `add(solution: Solution): Promise<void>`; `replace(solution: Solution): Promise<void>`; `remove(solutionId: Id): Promise<void>`; `addSolutionUpvote(solutionId: Id, userId: Id): Promise<void>`; `removeSolutionUpvote(solutionId: Id, userId: Id): Promise<void>` |
| `packages/core/src/conversation/interfaces/ChatMessagesRepository.ts` | `findAllByChat(chatId: Id): Promise<ChatMessage[]>`; `add(chatId: Id, chatMessage: ChatMessage): Promise<void>` |
| `packages/core/src/conversation/interfaces/ChatsRepository.ts` | `findById(chatId: Id): Promise<Chat \| null>`; `findManyByUser(params: ChatsListingParams): Promise<ManyItems<Chat>>`; `findLastCreatedByUser(userId: Id): Promise<Chat \| null>`; `add(chat: Chat, userId: Id): Promise<void>`; `replace(chat: Chat): Promise<void>`; `remove(chatId: Id): Promise<void>` |
| `packages/core/src/forum/interfaces/CommentsRepository.ts` | `addByChallenge(comment: Comment, challengeId: Id): Promise<void>`; `addBySolution(comment: Comment, solutionId: Id): Promise<void>`; `addReply(reply: Comment, commentId: Id): Promise<void>`; `findById(commentId: Id): Promise<Comment \| null>`; `findManyByChallenge( challengeId: Id, params: CommentsListParams, ): Promise<ManyItems<Comment>>`; `findManyBySolution( solutionId: Id, params: CommentsListParams, ): Promise<ManyItems<Comment>>`; `findAllRepliesByComment(commentId: Id): Promise<Comment[]>`; `replace(comment: Comment): Promise<void>`; `remove(commentId: Id): Promise<void>` |
| `packages/core/src/lesson/interfaces/QuestionsRepository.ts` | `findAllByStar(starId: Id): Promise<Question[]>`; `updateMany(questions: Question[], starId: Id): Promise<void>` |
| `packages/core/src/lesson/interfaces/StoriesRepository.ts` | `findByStar(starId: Id): Promise<Text \| null>`; `update(story: Text, starId: Id): Promise<void>` |
| `packages/core/src/lesson/interfaces/TextBlocksRepository.ts` | `findAllByStar(starId: Id): Promise<TextBlock[]>`; `updateMany(textBlocks: TextBlock[], starId: Id): Promise<void>`; `updateAudio(starId: Id, blockIndex: Integer, audio: TextBlockAudio): Promise<void>`; `clearAudio(starId: Id, blockIndex: Integer): Promise<void>` |
| `packages/core/src/manual/interfaces/GuidesRepository.ts` | `findById(id: Id): Promise<Guide \| null>`; `findAll(): Promise<Guide[]>`; `findAllByCategory(category: GuideCategory): Promise<Guide[]>`; `findLastByPositionAndCategory(category: GuideCategory): Promise<Guide \| null>`; `add(guide: Guide): Promise<void>`; `replace(guide: Guide): Promise<void>`; `replaceMany(guides: Guide[]): Promise<void>`; `remove(guide: Guide): Promise<void>` |
| `packages/core/src/playground/interfaces/SnippetsRepository.ts` | `findById(snippetId: Id): Promise<Snippet \| null>`; `findManySnippets(params: SnippetsListParams): Promise<ManyItems<Snippet>>`; `add(snippet: Snippet): Promise<void>`; `replace(snippet: Snippet): Promise<void>`; `remove(snippetId: Id): Promise<void>` |
| `packages/core/src/profile/interfaces/AchievementsRepository.ts` | `findById(achievementId: Id): Promise<Achievement \| null>`; `findLastByPosition(): Promise<Achievement \| null>`; `findAll(): Promise<Achievement[]>`; `findAllUnlockedByUser(userId: Id): Promise<Achievement[]>`; `add(achievement: Achievement): Promise<void>`; `addMany(achievements: Achievement[]): Promise<void>`; `replace(achievement: Achievement): Promise<void>`; `replaceMany(achievements: Achievement[]): Promise<void>`; `remove(achievement: Achievement): Promise<void>` |
| `packages/core/src/profile/interfaces/NotesRepository.ts` | `findById(noteId: Id): Promise<Note \| null>`; `findManyByUser(params: { userId: Id; page: OrdinalNumber; itemsPerPage: OrdinalNumber; search: Text }): Promise<ManyItems<Note>>`; `add(note: Note): Promise<void>`; `replace(note: Note): Promise<void>`; `remove(noteId: Id): Promise<void>` |
| `packages/core/src/profile/interfaces/UsersRepository.ts` | `findById(id: Id): Promise<User \| null>`; `findByIdsList(idsList: IdsList): Promise<User[]>`; `findBySlug(slug: Slug): Promise<User \| null>`; `findByName(name: Name): Promise<User \| null>`; `findByEmail(email: Email): Promise<User \| null>`; `findByGoogleAccountId(googleAccountId: Id): Promise<User \| null>`; `findByGithubAccountId(githubAccountId: Id): Promise<User \| null>`; `findByTierOrderedByXp(tierId: Id): Promise<User[]>`; `findMany(params: UsersListingParams): Promise<ManyItems<User>>`; `findUnlockedStars(userId: Id): Promise<IdsList>`; `findRecentlyUnlockedStars(userId: Id): Promise<IdsList>`; `containsWithEmail(email: Email): Promise<Logical>`; `containsWithName(name: Name): Promise<Logical>`; `findAll(): Promise<User[]>`; `add(user: User): Promise<void>`; `addMany(users: User[]): Promise<void>`; `addAcquiredAvatar(avatarId: Id, userId: Id): Promise<void>`; `addAcquiredRocket(rocketId: Id, userId: Id): Promise<void>`; `addAcquiredInsignia(insigniaRole: InsigniaRole, userId: Id): Promise<void>`; `addUnlockedStar(starId: Id, userId: Id): Promise<void>`; `addRecentlyUnlockedStar(starId: Id, userId: Id): Promise<void>`; `removeRecentlyUnlockedStar(starId: Id, userId: Id): Promise<void>`; `addUpvotedComment(commentId: Id, userId: Id): Promise<void>`; `removeUpvotedComment(commentId: Id, userId: Id): Promise<void>`; `addUnlockedAchievement(achievementId: Id, userId: Id): Promise<void>`; `addRescuableAchievement(achievementId: Id, userId: Id): Promise<void>`; `removeRescuableAchievement(achievementId: Id, userId: Id): Promise<void>`; `addCompletedChallenge(challengeId: Id, userId: Id): Promise<void>`; `countCompletedChallengesByMonth(month: Month): Promise<Integer>`; `countAllCompletedChallenges(): Promise<Integer>`; `countAllUnlockedStars(): Promise<Integer>`; `countUnlockedStarsByMonth(month: Month): Promise<Integer>`; `replace(user: User): Promise<void>`; `replaceMany(users: User[]): Promise<void>`; `countByMonth(month: Month): Promise<Integer>`; `countAll(): Promise<Integer>` |
| `packages/core/src/ranking/interfaces/RankersRepository.ts` | `findAllByTier(tierId: Id): Promise<RankingUser[]>`; `findAllByTierOrderedByXp(tierId: Id): Promise<RankingUser[]>`; `addWinners(rankingWinners: RankingUser[], tierId: Id): Promise<void>`; `addLosers(rankingLosers: RankingUser[], tierId: Id): Promise<void>`; `removeAll(): Promise<void>` |
| `packages/core/src/ranking/interfaces/TiersRepository.ts` | `findAll(): Promise<Tier[]>`; `findById(id: Id): Promise<Tier \| null>`; `findByPosition(position: OrdinalNumber): Promise<Tier \| null>` |
| `packages/core/src/reporting/interfaces/FeedbackMessagesRepository.ts` | `add(message: FeedbackMessage): Promise<FeedbackMessage>`; `addAttachments(message: FeedbackMessage): Promise<void>`; `findById(messageId: Id): Promise<FeedbackMessage \| null>`; `listByReport(feedbackReportId: Id): Promise<FeedbackMessage[]>` |
| `packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts` | `add(report: FeedbackReport): Promise<void>`; `findById(feedbackReportId: Id): Promise<FeedbackReport \| null>`; `findByIdAndAuthor(feedbackReportId: Id, authorId: Id): Promise<FeedbackReport \| null>`; `findAuthorEmail(feedbackReportId: Id): Promise<Email \| null>`; `list(params: FeedbackReportsListingParams): Promise<FeedbackReportsPageDto>`; `findMany(params: FeedbackReportsListingParams): Promise<{ items: FeedbackReport[]; count: number }>`; `save(report: FeedbackReport): Promise<void>`; `changeStatus( report: FeedbackReport, expectedStatus: FeedbackReportStatus, ): Promise<FeedbackReport>`; `listByAuthor(input: { authorId: Id; status?: FeedbackReportStatus; page: import('../../global/domain/structures/OrdinalNumber').OrdinalNumber; itemsPerPage: import('../../global/domain/structures/OrdinalNumber').OrdinalNumber }): Promise<{ items: FeedbackReport[]; total: number }>`; `countUnreadByAuthor(authorId: Id): Promise<number>`; `markAsRead(input: { feedbackReportId: Id; participant: 'author' \| 'studio'; lastSeenMessageAt: Date; authorId?: Id }): Promise<void>` |
| `packages/core/src/shop/interfaces/AvatarsRepository.ts` | `findById(id: Id): Promise<Avatar \| null>`; `findSelectedByDefault(): Promise<Avatar \| null>`; `findMany(params: ShopItemsListingParams): Promise<ManyItems<Avatar>>`; `findAllByPrice(price: Integer): Promise<Avatar[]>`; `add(avatar: Avatar): Promise<void>`; `replace(avatar: Avatar): Promise<void>`; `remove(id: Id): Promise<void>` |
| `packages/core/src/shop/interfaces/InsigniasRepository.ts` | `findById(insigniaId: Id): Promise<Insignia \| null>`; `findAll(): Promise<Insignia[]>`; `findAllPurchasable(): Promise<Insignia[]>`; `findByRole(role: InsigniaRole): Promise<Insignia \| null>`; `add(insignia: Insignia): Promise<void>`; `replace(insignia: Insignia): Promise<void>`; `remove(insigniaId: Id): Promise<void>` |
| `packages/core/src/shop/interfaces/RocketsRepository.ts` | `findById(id: Id): Promise<Rocket \| null>`; `findSelectedByDefault(): Promise<Rocket \| null>`; `findMany(params: ShopItemsListingParams): Promise<ManyItems<Rocket>>`; `findAllByPrice(price: Integer): Promise<Rocket[]>`; `add(rocket: Rocket): Promise<void>`; `replace(rocket: Rocket): Promise<void>`; `remove(id: Id): Promise<void>` |
| `packages/core/src/space/interfaces/PlanetsRepository.ts` | `add(planet: Planet): Promise<void>`; `findAll(): Promise<Planet[]>`; `findById(id: Id): Promise<Planet \| null>`; `findByPosition(position: OrdinalNumber): Promise<Planet \| null>`; `findByStar(starId: Id): Promise<Planet \| null>`; `findLastPlanet(): Promise<Planet \| null>`; `replace(planet: Planet): Promise<void>`; `replaceMany(planets: Planet[]): Promise<void>`; `remove(planetId: Id): Promise<void>` |
| `packages/core/src/space/interfaces/StarsRepository.ts` | `findAllOrdered(): Promise<Star[]>`; `findById(starId: Id): Promise<Star \| null>`; `findBySlug(starSlug: Slug): Promise<Star \| null>`; `findByNumber(position: OrdinalNumber): Promise<Star \| null>`; `add(star: Star, planetId: Id): Promise<void>`; `replace(star: Star): Promise<void>`; `replaceMany(stars: Star[]): Promise<void>`; `remove(starId: Id): Promise<void>` |
| `packages/core/src/auth/interfaces/AuthService.ts` | `fetchAccount(): Promise<RestResponse<AccountDto>>`; `fetchSocialAccount(): Promise<RestResponse<AccountDto>>`; `signIn(email: Email, password: Password): Promise<RestResponse<SessionDto>>`; `signInGodAccount(email: Email, password: Password): Promise<RestResponse<SessionDto>>`; `signUp(email: Email, password: Password): Promise<RestResponse<AccountDto>>`; `signInWithGoogleAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>`; `signInWithGithubAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>`; `signUpWithSocialAccount( socialAccount: Account, ): Promise<RestResponse<{ isNewAccount: boolean }>>`; `signOut(): Promise<RestResponse>`; `resendSignUpEmail(email: Email): Promise<RestResponse>`; `requestSignUp(email: Email, password: Password, name: Name): Promise<RestResponse>`; `requestPasswordReset(email: Email): Promise<RestResponse>`; `resetPassword( newPassword: Password, accessToken: Text, refreshToken: Text, ): Promise<RestResponse>`; `confirmEmail(token: Text): Promise<RestResponse<SessionDto>>`; `disconnectGithubAccount(): Promise<RestResponse>`; `confirmPasswordReset(token: Text): Promise<RestResponse<SessionDto>>`; `refreshSession(refreshToken: Text): Promise<RestResponse<SessionDto>>`; `connectGithubAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>`; `connectGoogleAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>`; `disconnectGoogleAccount(): Promise<RestResponse>`; `fetchGithubAccountConnection(): Promise<RestResponse<{ isConnected: boolean }>>`; `fetchGoogleAccountConnection(): Promise<RestResponse<{ isConnected: boolean }>>`; `listApiKeys(): Promise<RestResponse<ListResponse<ApiKeyData>>>`; `createApiKey(name: Name): Promise<RestResponse<ApiKeyData & { key: string }>>`; `renameApiKey(apiKeyId: Id, name: Name): Promise<RestResponse<ApiKeyData>>`; `revokeApiKey(apiKeyId: Id): Promise<RestResponse>`; `retryUserCreation(): Promise<RestResponse>` |


### Assinaturas internas de composição preservadas

HonoHttp mantém `getSupabase():SupabaseClient` exclusivamente para Auth e acrescenta `getDatabase():DrizzleDatabase`, `getDatabaseAccess():DatabaseAccess`; `sendResponse(response:RestResponse):Response` propaga headers permitidos e conserva 204/stream. HonoApp mantém setup/rotas e compõe singleton/policies sem conceder identidade de JWT decodificado. Nos grupos Profile/Space/Shop/Ranking/Challenging/Storage/Lesson de Inngest, `getFunctions(database:DrizzleDatabase):InngestFunction.Any[]` substitui somente parâmetro SDK de persistência; constructors Inngest e funções/job keys/steps/retry continuam. ManualFunctions, sem persistência efetiva, passa a `getFunctions():InngestFunction.Any[]`; Analytics/Notification continuam inalterados. Toolkits continuam retornando tools atuais, com repositories Drizzle e actor verificado injetados na montagem. Não adicionar tipos de ORM ao Core Http/Amqp/Mcp.

Operações públicas das fixtures existentes preservam entradas/retornos; apenas detalhes de preparação/cleanup relacional mudam. SupabaseFixture mantém supabase Auth e expõe `database:DrizzleDatabase` para as fixtures de domínio; `clearDatabase():Promise<void>` limpa a stack local. Helpers SQL são parametrizados. Novos scripts operacionais compartilham o tipo `TransitionOptions={environment:'local'|'dev'|'prod';manifestPath:string;phase:'legacy'|'adopted'|'server-owned'}`. Exportam `checkTransition(options:TransitionOptions):Promise<{compatible:boolean;differences:string[]}>` e `adoptBaseline(options:TransitionOptions):Promise<{adopted:boolean}>`. A conexão vem exclusivamente de SUPABASE_DATABASE_URL carregada no processo, não de URLs/IDs fixos selecionados pelo label environment; esse label identifica o alvo e ativa os guards locais. Cada comando fecha seu client. SupabaseFixture acrescenta `setAuthMetadata(accountId:Id,input:{userMetadata:Record<string,unknown>;identities:Array<{provider:'google'|'github';identityData:Record<string,unknown>;createdAt:Date;lastSignInAt:Date|null}>}):Promise<void>` exclusivamente local para preparar os casos legados de projeção Auth em GET /auth/account. Os demais operações públicos da fixture conservam entradas/retornos; esse helper usa SQL parametrizado, sem simular SDK ou prover credenciais remotas. Os scripts não criam contrato de domínio.

## S2 — Schema, baseline e segurança

A fonte do schema de destino é o estado final obtido pelo replay ordenado das **24 migrations ativas do commit 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9**, não o SQL avulso antigo de src. Capturar no manifest esse commit, os 24 nomes/hashes SQL em ordem e nomes/definições normalizados de tabelas, colunas/tipos/null/default, PK/unique/check/FK e ON DELETE/UPDATE, índices (inclusive parciais/expressões), enums/sequences, views, funções e triggers próprios, flags RLS e grants/policies legados. Manifest não contém dados de usuários nem credenciais. Auth/storage/realtime/cron administrados não são remodelados no schema Drizzle; preservar FKs/triggers/efeitos necessários da aplicação nesses limites via SQL customizado e verificação do catálogo.

`schema.ts` agrega e reexporta os models que representam a estrutura final de public; conserva os identificadores SQL e relações, sem concentrar definições de tabelas nesse barrel. Não há rename, backfill, alteração de tipo, exclusão de registros ou nova tabela de domínio. Índice/PK existente de users.id sustenta SELECT de prontidão; não criar índice redundante de email para o stream. SQL gerado **0000_baseline.sql** e snapshots/journal vêm de `npm run db:generate -w @stardust/server -- --name baseline` (prefix=index); objetos não modelados são **0001_application_objects.sql**, migration custom criada por Drizzle Kit com --custom --name application_objects e preenchida com definições finais do manifest. **0002_server_owned_access.sql** usa --custom --name server_owned_access e contém segurança. Executar nessa ordem com drizzle-kit 0.31.11 e prefix=index; essa versão produz os três snapshots e o journal indexado declarados no mapa, sem adotar o layout de versões posteriores. `_journal.json` e snapshots são gerados pela ferramenta e não editados à mão. Não usar drizzle-kit push em remoto nem depender de pull --init possivelmente disponível apenas em outra versão da ferramenta.

Em banco vazio/local, executar 0000→0001→0002. Manifest preserva separadamente estrutura invariável, catálogo de acesso legado e transformação exata esperada de 0002. `db:preflight` é somente leitura e usa --phase legacy/adopted/server-owned; phase e ledger precisam concordar. legacy exige ledger vazio, catálogo legado e as 24 entradas Supabase exatas; adopted exige apenas 0000/0001 com hashes/timestamps exatos e catálogo legado; server-owned exige as três entradas e catálogo final de acesso. Histórico Supabase fica arquivado intacto em bancos adotados, sem ser exigido no banco novo criado por Drizzle. Não comparar grants/policies finais com o manifest legado após 0002 nem assumir que o catálogo legacy autoriza replay de DDL.

`db:adopt` usa transação e advisory lock PostgreSQL estável, lê migrations pela API pública `readMigrationFiles` da versão fixada e registra somente hashes/timestamps de 0000/0001 como aplicadas no ledger `drizzle.__drizzle_migrations`, configurado explicitamente igual ao runner. Dentro do lock reconsulta catálogo/histórico/ledger: preflight anterior não elimina essa verificação. Em legacy compatível registra as duas entradas atomicamente sem DDL; em adopted ou server-owned compatível é no-op e não modifica grants/ledger. Estado parcial, phase inconsistente ou drift falha sem escrita. 0002 continua pendente após adoção e é aplicada pelo runner. Nunca resetar um banco por ter journal vazio.

Migrate, adopt e rollback compartilham a mesma chave advisory lock e a mesma conexão dedicada durante toda a operação; todas as DDL/ledger usam essa sessão. Migrate valida o estado sob lock, aceita apenas banco vazio sem objetos de aplicação ou estados adopted/server-owned compatíveis; banco legado sem ledger exige adopt, e objeto inesperado impede execução. Não executar o migrator num pool/conexão diferente do lock. Liberação é garantida no finally/shutdown; timeout de lock falha sem alterações. Reexecução após 0002 valida catálogo final e é no-op. A inversa e a remoção da entrada 0002 são uma única transação sob o mesmo lock, preservando 0000/0001; um rollback sem 0002 só é no-op se catálogo e ledger corresponderem exatamente a adopted.

0002, numa transação, revoga privilégios de anon/authenticated e os herdados de PUBLIC sobre todas as tabelas/views/sequences/funções próprias da aplicação, e default privileges dos owners reais; remove policies próprias em public e storage.objects, desliga RLS public e impede execute público de funções SECURITY DEFINER que leem/escrevem dados. Funções preservadas continuam acessíveis aos atores DB internos necessários, especialmente triggers de Auth; não revogar grants de infraestrutura indiscriminadamente, nem remover cron policies. Também verificar views security-definer, funções de outros schemas que expõem dados e memberships que concedam acesso transitivo. Caso catálogo revele objetos não representados no manifest, falhar preflight e produzir amendment antes de prosseguir, nunca limpar dinamicamente objetos desconhecidos.

`rollback/0002_server_owned_access.sql` é inversa versionada, construída do manifest legado: restaura policies, flags e grants anteriores, preservando tabelas/dados/baseline adotada. O runbook trata a entrada 0002 do ledger sob lock e valida hash exato antes de reaplicar a inversa; remover somente essa entrada depois da inversa bem-sucedida, para permitir novo migrate controlado. Não há rollback de schema com drop de tabelas, nem repair manual genérico. Backup/restauração isolada e teste versão antiga Server/Web com permissões restauradas são obrigatórios antes do primeiro corte remoto.

## S3 — Repository de usuários, comprovante e serviços

O caminho de prontidão reutiliza o port UsersRepository e o adapter DrizzleUsersRepository já existentes no escopo. Não acrescentar interfaces/exports ao Core profile. A borda verifica primeiro a sessão ou receipt e compõe o repository com DatabaseAccess user da identidade verificada; receipt não preenche AccountDto autenticado, não chama getAccountId como se fosse uma sessão e não autoriza outras rotas/mutations. Em GET /profile/onboarding-attempt, a rota verifica receipt e injeta a tentativa verificada no controller juntamente com o repository da mesma conta. Em GET /profile/events, OnboardingMiddleware resolve a autorização antes da composição.

Cada ciclo chama findById uma vez com accountId verificado, nunca busca por email. null mantém espera; User com id diferente é rejeitado sem frame. Ao encontrar User, o stream projeta user.id.value, user.name.value, user.email.value e user.slug.value nos quatro campos contratados e encerra; não publica novamente o evento no broker, não serializa user.dto ou estado privado. O resume retorna somente isUserCreated e dados da tentativa assinada. Esperas sem perfil usam a busca indexada users.id sem carregar relações inexistentes; ao existir, o repository preserva o agregado e seus joins normais, sem N+1. O intervalo de 1s é contado após terminar a chamada inteira do repository; abort/expiry/terminal impedem chamada seguinte. Testes de rota verificam isolamento e formato, sem criar teste dedicado de repository.

| Declaration | Entrada | Retorno e erros |
| --- | --- | --- |
| `UsersRepository.findById` (port Core existente) | `id:Id` derivado exclusivamente de credencial verificada na borda | `Promise<User \| null>`; null significa perfil ainda ausente. Stream converte somente id/name/email/slug do User no payload UserCreatedEvent, sem retornar UserDto completo. |
| `DrizzleUsersRepository` (adapter já contratado em S1) | Constructor `(database:DrizzleDatabase,access:DatabaseAccess)` com accountId previamente verificado | Implementa UsersRepository sem nova assinatura; findById restringe a conta consultada ao contexto de acesso, usa users.id indexado e preserva User/null e erros públicos. Não criar repository paralelo de prontidão. |
| `OnboardingReceiptProvider.issue` (novo port Core auth) | `(accountId: Id, email: Email, name: Name)` após Auth signup bem-sucedido | `Promise<{receipt:Text;expiresAt:Date}>`; nenhum efeito de login. |
| `OnboardingReceiptProvider.verify` | `(receipt: Text)` | `Promise<{accountId:Id;email:Email;name:Name;expiresAt:Date}>`; adulterado/expirado/escopo incorreto → AuthError/401. |
| `NodeOnboardingReceiptProvider` | Constructor `(secret: string)` exclusivamente de ENV | Implementa issue/verify com HMAC-SHA256, comparação timing-safe, nonce aleatório, versão/audience fixa profile-onboarding e iat/exp. Secret mínimo 32 bytes e configuração inválida impede boot. Validade 15min, sem renovação por consulta. |
| `OnboardingService.fetchAttempt` (novo port Core auth) | Sem argumento; credencial vem do cookie na borda | `Promise<RestResponse<{account:{id:string;email:string;name:string};expiresAt:string;isUserCreated:boolean} \| null>>`. expiresAt é ISO UTC; null sem tentativa válida. |
| `OnboardingService` (factory Web) | `(restClient: RestClient): IOnboardingService` | GET same-origin /auth/onboarding-attempt; implementa fetchAttempt acima; sem conhecer cookie/SDK. |
| `AuthService` (factory Web) | `(restClient: RestClient, signUpRestClient: RestClient = restClient): IAuthService` | Apenas requestSignUp(email:Email,password:Password,name:Name) usa signUpRestClient; todas as operações do IAuthService atual preservados. |
| `SignUpController` | Constructor AuthService/Broker atuais + OnboardingReceiptProvider; `handle(http: Http<{body:{email:string;password:string;name:string}}>): Promise<RestResponse>` | Body/status originais; só no sucesso elegível emite X-Onboarding-Receipt e X-Onboarding-Expires-At para BFF. Não publicar accountId inventado/vazio nem emitir receipt para identidade de perfil alheio. |
| `FetchOnboardingAttemptController` | Constructor `(usersRepository:UsersRepository,attempt:{accountId:Id;email:Email;name:Name;expiresAt:Date})`, com attempt verificada pelo receipt provider na borda antes da composição; `handle(http:Http): Promise<RestResponse<{account:{id:string;email:string;name:string};expiresAt:string;isUserCreated:boolean}>>` | Consulta usersRepository.findById(attempt.accountId) e deriva isUserCreated da presença de User; 200 attempt. A borda lê X-Onboarding-Receipt e verifica antes de construir o controller/repository; inválido/ausente resulta em 401 sem consulta. Web traduz 401 para 200 null e apaga cookie. Não retornar senha/tokens/session. |

Formato assinado de credencial, headers/cookies e classes SDK permanecem nos adapters; os ports Core usam somente Text, estruturas de domínio e payloads abstratos declarados acima. O receipt usa accountId retornado pelo Auth, não lookup arbitrário por email; resposta de cadastro duplicado não dá acesso à conta existente, mesmo que Auth devolva resposta antienumeração. Nome/email são os da tentativa assinada; SSE só divulga prontidão ligada a esse id. Elegibilidade concreta de CA-13: SupabaseAuthService.signUp gera nonce criptográfico por chamada, envia-o somente como metadata interna onboarding_attempt_nonce em options.data e verifica no retorno id/email, identidade email presente e user_metadata.onboarding_attempt_nonce idêntico. Na versão Auth local v2.193.0, signup repetido de conta não confirmada não atualiza user_metadata; retorno antienumeração confirmado não tem identities. Portanto, checar apenas id não basta. O adapter comunica elegibilidade por header interno X-Onboarding-SignUp-Eligible no RestResponse, sem mudar AccountDto/port Core. SignUpController consome e remove esse header; só em elegibilidade comprovada publica AccountSignedUpEvent e emite receipt, nunca por nonce recebido do client. BFF apaga cookie anterior se resposta de sucesso não trouxer receipt elegível; a UI trata tentativa ausente após signup pelo caminho de falha já existente, sem sucesso falso ou espera infinita. Não retornar nem logar o nonce/metadata; integração cobre novo cadastro, repetição confirmada/não confirmada e duas chamadas concorrentes. Parity de configuração/versão Auth Dev/Prod deve comprovar essa propriedade antes do corte; comportamento divergente exige amendment, sem fallback permissivo. Não registrar receipt, cookie, bearer, senha ou URL DB em logs/evaluation. Secret comum entre réplicas; rotação invalida tentativas antigas sem cancelar contas.

## S4 — Rotas e SSE

| Produtor → consumidor | Operação/path | Request, autorização e resposta |
| --- | --- | --- |
| Browser → Next → Server | POST /api/auth/sign-up → POST /auth/sign-up | Mesmo email/password/name, validação existente e rate limit sensível. BFF repassa resposta atual, grava cookie e remove headers internos; nenhuma sessão emitida. |
| Browser → Next → Server | GET /api/auth/onboarding-attempt → GET /profile/onboarding-attempt | Sem accountId/email/body. Web envia receipt do cookie no header interno. 200 attempt/null no browser, no-store. Server 200 attempt ou401; falha infraestrutura não vira sucesso/null. |
| EventSource → Next → Server | GET /api/auth/profile-events → GET /profile/events | Sem selectors. Sessão verificada tem precedência; se bearer presente inválido, 401 sem fallback de receipt. Sem sessão, receipt verificado. Sem ambos, BFF204 para não abrir espera anônima. |

Cookie `@stardust:onboarding-attempt`, HttpOnly, SameSite=Lax, Secure em produção, sem Domain, Path=/api/auth, expiry/max-age limitado a15min e à expiração enviada pelo Server. Não usa localStorage/sessionStorage nem URL query. POST BFF exige Origin igual à origem da Web para mitigar emissão cross-origin; validação/error mapping conforme rotas existentes. A Web não precisa do secret de assinatura. Entre os headers de onboarding, HonoHttp propaga apenas receipt/expiração produzidos pelo controller, preservando os demais headers legítimos já existentes; X-Onboarding-SignUp-Eligible é consumido antes do transporte e não entra em Access-Control-Expose-Headers. Os headers de receipt não são expostos via CORS ao JS. Uma resposta de falha não conserva receipt de outra tentativa. NextRestClient.post preserva headers no RestResponse para uso server-side do BFF, usando chaves HTTP em lowercase; BFF lê x-onboarding-receipt e x-onboarding-expires-at com essa normalização; não expõe os headers internos no body. Não encaminhar cookies gerais da Web ao Server; apenas Authorization e receipt apropriados.

`ProfileEventsRouter.registerRoutes(): Hono` monta GET /events no ProfileRouter; `authorizeProfileStream(context:Context,next:Next):Promise<void>` de OnboardingMiddleware resolve `{accountId:Id,expiresAt:Date|null}` em contexto Hono server-only: Auth verificado ou receipt. O middleware mantém rate limiting de IP e, com sessão, conta; receipt não cria conta autenticada no contexto. `FetchOnboardingAttemptController` não importa database/Hono. Streaming usa helper Hono streamSSE na borda, UsersRepository Core injetado e nenhuma política UI no adapter.

`createProfileCreationStream(context: Context, usersRepository: UsersRepository, authorization: {accountId:Id;expiresAt:Date|null}): Response` abre stream com Content-Type=text/event-stream; Cache-Control=no-store,no-transform; X-Accel-Buffering=no. Primeira chamada usersRepository.findById imediata, depois no máximo uma chamada por segundo por espera (1s após query terminar, sem overlap), heartbeat comentário a15s, `retry:1000`, conexão máximo60s ou expiração do receipt, o que ocorrer primeiro. Revalidar sessão em toda reconexão, limitar duração também à expiração conhecida do access token; assinatura decodificada não serve para conceder identidade. Abort request/shutdown/terminal/expiry cancela timers e impede próxima consulta; query em curso pode terminar mas nenhum frame/query subsequente é produzido.

Terminal: `event: user.created`, `id: profile:<userId>`, `data: JSON.stringify({userId,userName,userEmail,userSlug})`. Nenhum timestamp, row completo ou conta B. O adapter reconstrói UserCreatedEvent canônico; user.created é apenas o nome do frame SSE, enquanto UserCreatedEvent._NAME continua profile/user.created nos produtores/consumidores de domínio e Inngest. Após emitir terminal, Server encerra; client fecha EventSource para impedir reconexão automática. Last-Event-ID não seleciona perfil nem substitui consulta inicial. Expiração emite `event:onboarding.expired`/`data:{}` e fecha; adapter encerra sem evento de criação. Limite60s fecha e permite reconnect enquanto credencial válida. Erro DB após headers encerra stream, telemetria sanitizada e reconnect; não tentar JSON HTTP através do error handler depois do início. Falha autenticação antes dos headers é401. BFF propaga status, frames/headers e request.signal; não bufferiza response.text nem transforma frames em JSON. Runtime Next nodejs, rota dinâmica e no-store. O middleware global da Web deixa passar, antes dos controllers de autenticação/rewards, somente os paths exatos /api/auth/sign-up, /api/auth/onboarding-attempt e /api/auth/profile-events: suas rotas/Server aplicam a autorização descrita, incluindo Origin no POST. Não usar um bypass abrangente de /api/auth, pois confirm-email e rotas existentes preservam suas políticas. A suíte Playwright de cadastro valida a passagem real pelo middleware sem cookie de sessão, além dos testes isolados das rotas.

`SseProfileChannel(createEventSource: (url:string)=>EventSource): ProfileChannel` implementa `onCreateUser(listener:(event:UserCreatedEvent)=>void):()=>void` unchanged. Cada assinatura abre fonte somente quando habilitada pela UI, valida frame, deduplica terminal por id e fecha explicitamente; callback não recebe dados inválidos. Cleanup idempotente. Em onerror, readyState=CONNECTING mantém o retry nativo; readyState=CLOSED libera listeners e não cria outra fonte automaticamente. EventSource não fornece status HTTP ao callback: o canal não deduz 401/204 por status invisível. Falhas 401/204 param a conexão; EOF por limite60s/erro DB permite retry nativo conforme SSE. O canal não entrega evento de criação em expiry/error. O Hook de signup usa expiresAt da tentativa para cancelar no prazo e reconsultar attempt; nenhuma falha de transporte prolonga essa validade. Não introduzir service REST dentro do canal; endereço same-origin constante. `useProfileSocket(onCreateUser:listener, options?:{enabled:boolean;subscriptionKey:string}):void` assina/limpa quando enabled/key mudam, defaults preservam consumidores antigos. StrictMode/remount não deixa conexão órfã; não compartilhar streams entre identidades.

## S5 — UI, composição e referências visuais

Preservar View/Hook/Entry Point das três páginas. RestContext compõe OnboardingService e segundo NextRestClient com base /api para signup/resume, mantendo demais services no Server configurado. No ambiente testing, upstream BFF continua /api/tests/server, sem loop para o próprio proxy. RealtimeContext compõe SseProfileChannel por useMemo; TestingRealtimeContext continua injetando ProfileChannelMock.

SignUpPageView acrescenta a prop `isResumingAttempt:boolean`; true renderiza Loading + UserCreationPendingMessage no shell antes do sucesso, false preserva o formulário atual. Props existentes permanecem intactas. O Hook expõe a prop e `{enabled:boolean;subscriptionKey:string}` para o Entry Point montar useProfileSocket. Cadastro: Hook recebe authService, onboardingService e toastProvider por injeção do Entry Point; não lê ToastContext internamente. Na montagem, fetchAttempt; sem válida apresenta formulário atual. Tentativa pendente restaurada renderiza UserCreationPendingMessage existente no shell atual; não restaura senha, não reposta cadastro nem inventa texto/arte nova. Perfil já pronto mostra o mesmo estado inline de sucesso de SignUpPageView (sign-up-success-message). Signup novo mantém formulário/spinner atuais; após requestSignUp bem-sucedido consulta fetchAttempt para obter o id assinado e só então habilita assinatura, com receipt já no cookie. subscriptionKey é account.id da tentativa válida; email continua filtro defensivo, nunca fronteira de autorização. Expiração em memória encerra assinatura, limpa tentativa por fetchAttempt e retorna formulário; nenhuma conclusão de sucesso por timeout.

Confirmações: habilitar SSE somente após sessão resolvida e conta conhecida. Ao terminal, comparar id com account.id e email defensivamente, aguardar refetch concluir User da mesma conta antes de flags/animação/sucesso; refetch falho mantém pendente/retry existentes. Perfil já presente social mantém caminho direto. Listener, timers de7s, animações e Stream são limpos no unmount. RetryUserCreation mantém contrato, não cria receipt autenticado nem mostra sucesso com mera resposta do POST.

### Matriz de auditoria estrutural

| Widget/context alterado | Entry Point | View | Hook | Regra e mudança |
| --- | --- | --- | --- | --- |
| SignUpPage | ui/auth/widgets/pages/SignUp/index.tsx | SignUp/SignUpPageView.tsx | SignUp/useSignUpPage.ts | UI Widget: injetar Auth/Onboarding/Toast; View recebe estado de retomada e componente pendente existente. SignUpForm permanece inalterado. |
| AccountConfirmationPage | AccountConfirmation/index.tsx | AccountConfirmation/AccountConfirmationPageView.tsx (inalterada) | AccountConfirmation/useAccountConfirmationPage.ts | UI Widget: sessão/assinatura/refetch; composição e JSX preservados. |
| SocialAccountConfirmationPage | SocialAccountConfirmation/index.tsx | SocialAccountConfirmation/SocialAccountConfirmationPageView.tsx (inalterada) | SocialAccountConfirmation/useSocialAccountConfirmationPage.ts | UI Widget: tokens uma vez, perfil persistido antes de concluir, redirect existente. |
| RealtimeContext | ui/global/contexts/RealtimeContext/index.tsx (inalterado) | Sem View visual (contexto) | RealtimeContext/useRealtimeContextProvider.ts | Composition root injeta port Core por factory memoizada. |
| RestContext | ui/global/contexts/RestContext/index.tsx (inalterado) | Sem View visual (contexto) | RestContext/useRestContextProvider.ts | Services/factories por injeção, sem política de cookie na UI. |

Paths abreviados nessa matriz são relativos a apps/web/src; os paths afetados exatos aparecem apenas uma vez no mapa abaixo. Views declaradas inalteradas não entram no mapa.

### Matriz de referências visuais

Fonte: `design/stardust.pen` presente mas não inspecionável; nenhum node validado. Referência substituta de preservação aprovada: implementação atual e tokens, detalhada em `design/handoff.md`. Não exigir comparação com nodes inexistentes/verificados nem inventar dimensões de frames. Dimensões abaixo são viewports de browser contratados.

| Referência/node | Viewport | Estado/rota | Pencil | Web/evidência, anchors e comparação | RF/CA/VM |
| --- | --- | --- | --- | --- | --- |
| Sem node validado: SignUpPage atual | 390×844 /1440×900 | Formulário, pending novo/retomado, sucesso /auth/sign-up | Indisponível; ausência aprovada D-06 | Shell escuro/fundo/assets, largura responsiva/form progressivo e sucesso atuais; pendente existente reutilizado. Screenshots browser do caminho feliz e evidência automatizada da retomada, sem overflow e com foco/labels preservados. | RF-07/RF-11; CA-14/CA-21; VM-01 |
| Sem node validado: AccountConfirmation atual | 390×844 /1440×900 | Espera e welcome/CTA /auth/account-confirmation | Indisponível; ausência aprovada D-06 | Mesma animação/CTA, resultado observado e navegação para /space. Screenshot ao sucesso; loading/retry/erro somente automatizados. | RF-08/RF-11; CA-16/CA-21; VM-02 |
| Sem node validado: SocialAccountConfirmation atual | 390×844 /1440×900 | Nova conta welcome e existente redirect /auth/social-account-confirmation | Indisponível; ausência aprovada D-06 | Mesmo pending/rocket/welcome; teste Playwright automatizado com ServerMock observa transição e /space, captura screenshot do sucesso novo e URL do existente. Sem smoke manual conforme D-07. | RF-08/RF-11; CA-17/CA-21; EV-08 |

## S6 — Migrations, CI/CD, scripts e corte completo

Retirar scripts CLI db:prod/dev/pull/push/types/revert, configuração/schemas Supabase inativos e migrations antigas após baseline/manifest capturados e validados. Gerar lockfile com npm install; manter SDK Server Auth e retirar os três pacotes Supabase da Web após confirmar não haver outro import legítimo. CLIENT_ENV e CI Web deixam de exigir URL/key Supabase. Não mudar nem versionar .env.local; apps/server/.env.example declara ONBOARDING_RECEIPT_SECRET sem valor real e CI/testing usa segredo sintético determinístico apenas de testes.

| Script | Contrato de execução |
| --- | --- |
| db:generate | drizzle-kit generate com drizzle.config.ts, schema.ts e out apps/server/src/database/drizzle/migrations; baseline com --name baseline e prefix=index; custom migrations geradas em ordem por CLI --custom --name application_objects e --custom --name server_owned_access; nenhum banco remoto alterado. |
| db:migrate | Script runner lê ENV URL explicitamente; migrate com ledger configurado e lock comum de S2 na mesma sessão, validando estado/phase; fecha pool; não reseta e não executa no boot. |
| db:preflight | scripts/check-drizzle-transition.mjs; argumentos --environment local/dev/prod --manifest <versionado> --phase legacy/adopted/server-owned; relatório normalizado sem rows/segredos; exit0 só parity. |
| db:adopt | scripts/adopt-drizzle-baseline.mjs; mesmos argumentos/manifest/phase; usa preflight, readMigrationFiles, transação/lock, idempotência; nenhum --force/repair que ignore drift. |
| db:test | Compose raiz com --env-file .env.local, reset one-shot guardado local, depois runner Drizzle no host via Node/tsx com URL local normalizada pelo export script, sem seed. |

`reset.sh` limpa public/Auth/storage exclusivamente local e também ledger Drizzle local antes do migrate; remove loop de SQL legacy. Compose deixa de montar migrations antigas. Script de exportação de DB local lê .env.local raiz e deriva loopback/ports conforme stack; emite exports ao shell, nunca valores em logs persistentes. Guard reset exige destino do Compose/local e confirmação estrutural host/service conhecido, não um argumento genérico que permita remoto. Suítes mantêm SupabaseFixture.supabase para Auth; cleanup/preparação/leitura usa Drizzle, sem SQL string interpolado por email/id. Nenhum novo teste de fixture.

CI Server troca supabase start/reset/status por Compose local e variáveis efêmeras de teste, db:test, suítes e coverage aplicáveis; sem credenciais Dev/Prod em PR. CI Web remove env Supabase; ServerMockRegistry/handler aceita resposta rawBody string para frames SSE finitos além do JSON atual, mantendo MODE=testing e ProfileChannelMock. Testes BFF não criam proxy recursivo nem precisam Supabase real.

Os arquivos `.env.testing` são gerados localmente/por job e permanecem ignorados pelo Git; o workflow fornece valores sintéticos de teste sem versionar credenciais ou URLs locais. Eles não são paths de implementação no mapa.

Primeiro corte remoto em runbook versionado, executado por operador com controles existentes de Coolify/ingress/Inngest: (1) parity Dev/Prod, catálogo/grants e backup restaurado ensaiado; (2) fixar SHAs/artefatos das duas apps e suas versões anteriores, retirar concorrência dos dois workflows durante a janela; (3) colocar ingress em manutenção, impedir novas entradas de jobs e drenar/pausar writers Inngest e cron da aplicação, mantendo infraestrutura Auth; (4) db:adopt se necessário e migrate0002; (5) acionar deploy Server e Web do release coordenado; (6) confirmar revisão implantada no Coolify, GET /health Server, Web disponível, smoke autenticado/cadastro e Data API negada; (7) reabrir tráfego e retomar jobs somente após sucesso. Aceite de webhook sozinho não autoriza reabertura. Não inventar endpoint/API de manutenção: usar controles operacionais existentes e registrar evidência da pausa/drenagem; indisponibilidade desses controles impede corte.

Um único workflow Server com workflow_dispatch coordena a primeira transição e aciona os dois deploys sob uma única exclusão compartilhada, cancel-in-progress=false durante migration/deploy. O workflow Web compartilha o grupo para impedir deploy concorrente, mas o coordenador não despacha nem espera outro workflow que precise desse mesmo lock: usa os controles/webhooks existentes para ambas as apps e confirma o SHA implantado de cada uma, evitando deadlock. Nenhum deploy Web independente ultrapassa a janela. A primeira transição tem execução explícita workflow_dispatch; push/release comuns não aplicam 0002 automaticamente fora da manutenção. Depois da transição concluída, pipeline normal usa Drizzle e serializa migrations/deploy. Não manter releases intermediários compatíveis em produção. Segredos de conexão entram por environment GitHub/Coolify existente; não adicionar chave service-role ou prints de URL.

Falha em qualquer etapa antes da reabertura mantém manutenção: parar novas versões/writers, executar inversa0002 sob lock, corrigir somente sua entrada ledger, reinstalar artefatos anteriores Server/Web, verificar schema/permissões e smoke legado, depois reabrir. Se uma migration futura alterar schema/dados, ela exige seu próprio contrato; esta entrega não destrói estrutura ou dados. Registrar momento, SHA, comando sem valores sensíveis, status e resultado da restauração no evaluation da implementação, sem confundir ensaio com execução real de produção.

## Mapa canônico de paths afetados

Cada linha herda o contrato S indicado: S1 persistence/composição e CA-01/CA-03; S2 schema/segurança e EV-03/EV-04; S3 repository/receipt e EV-06/EV-07; S4 transporte e EV-06/EV-09; S5 UI e EV-07/EV-08/EV-11; S6 tooling e EV-05/EV-12. `Remove` elimina implementação substituída, não dados. Dependências inalteradas citadas no texto são evidência, não linhas de diff. Paths novos são decisões explícitas derivadas dessas fronteiras e dos similares legados. Nenhum glob serve como path de entrega.

### Infraestrutura / Compose, CI e dependências

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `.github/workflows/server-app-ci.yaml` | Modify | S6: server-app-ci; contratos definidos acima |
| `.github/workflows/server-app-production-cd.yml` | Modify | S6: server-app-production-cd; contratos definidos acima |
| `.github/workflows/web-app-ci.yaml` | Modify | S6: web-app-ci; contratos definidos acima |
| `.github/workflows/web-app-production-cd.yaml` | Modify | S6: web-app-production-cd; contratos definidos acima |
| `docker-compose.yml` | Modify | S6: docker-compose; contratos definidos acima |
| `docker/supabase/reset.sh` | Modify | S6: reset; contratos definidos acima |
| `package-lock.json` | Generate | S1/S6: fonte package.json Server/Web; npm install |

### Server / Migrations e configuração

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/.env.example` | Modify | S6: .env; contratos definidos acima |
| `apps/server/drizzle.config.ts` | Create | S2: drizzle.config; operações/shapes e evidência do contrato |
| `apps/server/src/database/drizzle/migrations/0000_baseline.sql` | Generate | S2: fonte schema.ts agregando models por domínio; npm run db:generate -w @stardust/server -- --name baseline, prefix=index; sem edição manual |
| `apps/server/src/database/drizzle/migrations/0001_application_objects.sql` | Create | S2: 0001_application_objects; operações/shapes e evidência do contrato |
| `apps/server/src/database/drizzle/migrations/0002_server_owned_access.sql` | Create | S2: 0002_server_owned_access; operações/shapes e evidência do contrato |
| `apps/server/src/database/drizzle/legacy-schema-manifest.json` | Create | S2: legacy-schema-manifest; operações/shapes e evidência do contrato |
| `apps/server/src/database/drizzle/migrations/meta/0000_snapshot.json` | Generate | S2: fonte schema.ts/custom migration; db:generate (Drizzle Kit); sem edição manual |
| `apps/server/src/database/drizzle/migrations/meta/0001_snapshot.json` | Generate | S2: fonte schema.ts/custom migration; db:generate (Drizzle Kit); sem edição manual |
| `apps/server/src/database/drizzle/migrations/meta/0002_snapshot.json` | Generate | S2: fonte schema.ts/custom migration; db:generate (Drizzle Kit); sem edição manual |
| `apps/server/src/database/drizzle/migrations/meta/_journal.json` | Generate | S2: fonte schema.ts/custom migration; db:generate (Drizzle Kit); sem edição manual |
| `apps/server/src/database/drizzle/rollback/0002_server_owned_access.sql` | Create | S2: 0002_server_owned_access; operações/shapes e evidência do contrato |
| `apps/server/package.json` | Modify | S6: package; `test:coverage` inclui `server` e `server-integration` no mesmo relatório e ratchet; demais contratos definidos acima |
| `apps/server/scripts/migrate-database.ts` | Create | S2: migrate-database; operações/shapes e evidência do contrato |
| `apps/server/supabase/config.toml` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20251008214302_create_tables.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260506130000_create_insignias_tables.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260508132253_create_notes.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260511182355_remote_schema.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260511184731_remote_schema.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260511210000_remove_next_star_function_and_view.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260514120000_create_update_text_block_audio_function.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260603120000_create_clear_text_block_audio_function.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260611120000_grant_select_on_public_views.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260611130000_drop_users_visits.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260619120000_rename_challenges_code_to_initial_code.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260619123000_update_challenges_view_and_list_function_to_initial_code.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260716120000_add_challenge_is_evaluated_by_function.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260716121000_create_challenge_code_executions.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260723120000_add_challenge_official_solution.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260804120000_create_feedback_conversations.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260804130000_remove_feedback_outbox_events.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260804140000_remove_persist_feedback_message.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260804150000_grant_feedback_reporting_permissions.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260806120000_add_user_feedback_history.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260807000058_revoke_feedback_history_public_execute.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260807000829_enable_feedback_author_insert_rls.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260807000901_enable_feedback_author_update_rls.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/migrations/20260810100000_add_user_metadata_to_feedback_history.sql` | Remove | S2/S6: schema/histórico legados consolidados |
| `apps/server/supabase/schemas/schema.sql` | Remove | S2/S6: schema/histórico legados consolidados |

### Server / ai

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/ai/mastra/toolkits/ChallengingToolkit.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/ai/mastra/toolkits/ProfileToolkit.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |

### Server / app

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/app/hono/HonoApp.ts` | Modify | S1: HonoApp; contratos definidos acima |
| `apps/server/src/app/hono/HonoHttp.ts` | Modify | S1: HonoHttp; contratos definidos acima |
| `apps/server/src/app/hono/middlewares/AuthMiddleware.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/middlewares/ChallengingMiddleware.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/middlewares/OnboardingMiddleware.ts` | Create | S4: OnboardingMiddleware; operações/shapes e evidência do contrato |
| `apps/server/src/app/hono/middlewares/ProfileMiddleware.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/middlewares/SpaceMiddleware.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/middlewares/StorageMiddleware.ts` | Modify | S1: StorageMiddleware; contratos definidos acima |
| `apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/auth/AuthRouter.ts` | Modify | S3: AuthRouter; contratos definidos acima |
| `apps/server/src/app/hono/routers/challenging/ChallengeCodeExecutionsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/challenging/SolutionsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/conversation/ChatsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/forum/CommentsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/lesson/QuestionsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/lesson/StoriesRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/manual/GuidesRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/mcp/tests/McpRateLimitMiddleware.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/auth/tests/AuthRateLimitMiddleware.test.ts` | Modify | S1: preservar a ordem IP → autenticação verificada → limite por conta usando AuthFixture real local; sem mockar Auth nem afrouxar status/assertions |
| `apps/server/src/app/hono/routers/playground/SnippetsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/profile/AchievementsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/profile/NotesRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/profile/ProfileEventsRouter.ts` | Create | S4: ProfileEventsRouter; operações/shapes e evidência do contrato |
| `apps/server/src/app/hono/routers/profile/ProfileRouter.ts` | Modify | S4: ProfileRouter; contratos definidos acima |
| `apps/server/src/app/hono/routers/profile/UsersRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/ranking/RankingRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/ranking/TiersRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/shop/AvatarsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/shop/InsigniasRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/shop/RocketsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/space/PlanetsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/routers/space/StarsRouter.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/app/hono/streaming/createProfileCreationStream.ts` | Create | S4: createProfileCreationStream; operações/shapes e evidência do contrato |

### Server / constants

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/constants/env.ts` | Modify | S3: env; contratos definidos acima |

### Server / Database

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/database/drizzle/DatabaseAccess.ts` | Create | S1: DatabaseAccess; operações/shapes e evidência do contrato |
| `apps/server/src/database/drizzle/DrizzleClient.ts` | Create | S1: DrizzleClient; operações/shapes e evidência do contrato |
| `apps/server/src/database/drizzle/errors/DrizzleDatabaseError.ts` | Create | S1: DrizzleDatabaseError; operações/shapes e evidência do contrato |
| `apps/server/src/database/drizzle/errors/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/auth/DrizzleApiKeyMapper.ts` | Create | S1: DrizzleApiKeyMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/auth/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeCodeExecutionMapper.ts` | Create | S1: DrizzleChallengeCodeExecutionMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeMapper.ts` | Create | S1: DrizzleChallengeMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeSourceMapper.ts` | Create | S1: DrizzleChallengeSourceMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/challenging/DrizzleSolutionMapper.ts` | Create | S1: DrizzleSolutionMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/challenging/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/conversation/DrizzleChatMapper.ts` | Create | S1: DrizzleChatMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/conversation/DrizzleChatMessageMapper.ts` | Create | S1: DrizzleChatMessageMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/conversation/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/forum/DrizzleCommentMapper.ts` | Create | S1: DrizzleCommentMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/forum/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/lesson/DrizzleQuestionMapper.ts` | Create | S1: DrizzleQuestionMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/lesson/DrizzleTextBlockMapper.ts` | Create | S1: DrizzleTextBlockMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/lesson/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/manual/DrizzleGuideMapper.ts` | Create | S1: DrizzleGuideMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/manual/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/playground/DrizzleSnippetMapper.ts` | Create | S1: DrizzleSnippetMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/playground/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/profile/DrizzleAchievementMapper.ts` | Create | S1: DrizzleAchievementMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/profile/DrizzleNoteMapper.ts` | Create | S1: DrizzleNoteMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts` | Create | S1: DrizzleUserMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/profile/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/ranking/DrizzleRankerMapper.ts` | Create | S1: DrizzleRankerMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/ranking/DrizzleTierMapper.ts` | Create | S1: DrizzleTierMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/ranking/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackMessageMapper.ts` | Create | S1: DrizzleFeedbackMessageMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackReportMapper.ts` | Create | S1: DrizzleFeedbackReportMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/shop/DrizzleAvatarMapper.ts` | Create | S1: DrizzleAvatarMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/shop/DrizzleInsigniaMapper.ts` | Create | S1: DrizzleInsigniaMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/shop/DrizzleRocketMapper.ts` | Create | S1: DrizzleRocketMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/shop/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts` | Create | S1: DrizzlePlanetMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/space/DrizzleStarMapper.ts` | Create | S1: DrizzleStarMapper; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/space/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/DrizzleRepository.ts` | Create | S1: DrizzleRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/auth/DrizzleApiKeysRepository.ts` | Create | S1: DrizzleApiKeysRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/auth/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengeCodeExecutionsRepository.ts` | Create | S1: DrizzleChallengeCodeExecutionsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengeSourcesRepository.ts` | Create | S1: DrizzleChallengeSourcesRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts` | Create | S1: DrizzleChallengesRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/challenging/DrizzleSolutionsRepository.ts` | Create | S1: DrizzleSolutionsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/challenging/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatMessagesRepository.ts` | Create | S1: DrizzleChatMessagesRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatsRepository.ts` | Create | S1: DrizzleChatsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/conversation/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/forum/DrizzleCommentsRepository.ts` | Create | S1: DrizzleCommentsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/forum/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/lesson/DrizzleQuestionsRepository.ts` | Create | S1: DrizzleQuestionsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/lesson/DrizzleStoriesRepository.ts` | Create | S1: DrizzleStoriesRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/lesson/DrizzleTextBlocksRepository.ts` | Create | S1: DrizzleTextBlocksRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/lesson/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/manual/DrizzleGuidesRepository.ts` | Create | S1: DrizzleGuidesRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/manual/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/playground/DrizzleSnippetsRepository.ts` | Create | S1: DrizzleSnippetsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/playground/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/profile/DrizzleAchievementsRepository.ts` | Create | S1: DrizzleAchievementsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/profile/DrizzleNotesRepository.ts` | Create | S1: DrizzleNotesRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts` | Create | S1: DrizzleUsersRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/profile/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/ranking/DrizzleRankersRepository.ts` | Create | S1: DrizzleRankersRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/ranking/DrizzleTiersRepository.ts` | Create | S1: DrizzleTiersRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/ranking/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts` | Create | S1: DrizzleFeedbackMessagesRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts` | Create | S1: DrizzleFeedbackReportsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/reporting/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/shop/DrizzleAvatarsRepository.ts` | Create | S1: DrizzleAvatarsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/shop/DrizzleInsigniasRepository.ts` | Create | S1: DrizzleInsigniasRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/shop/DrizzleRocketsRepository.ts` | Create | S1: DrizzleRocketsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/shop/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/space/DrizzlePlanetsRepository.ts` | Create | S1: DrizzlePlanetsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/space/DrizzleStarsRepository.ts` | Create | S1: DrizzleStarsRepository; contrato do par legado |
| `apps/server/src/database/drizzle/repositories/space/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/drizzle/mappers/index.ts` | Create | S1: barrel de mappers por domínio, sem modelos expostos ao Core; EV-10 |
| `apps/server/src/database/drizzle/mappers/reporting/index.ts` | Create | S1: barrel dos dois mappers reporting; EV-10 |
| `apps/server/src/database/drizzle/models/auth/api-key-model.ts` | Create | S1/S2: apiKeyModel=pgTable('api_keys'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/auth/index.ts` | Create | S1/S2: barrel somente de modelos auth; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/challenging/category-model.ts` | Create | S1/S2: categoryModel=pgTable('categories'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/challenging/challenge-category-model.ts` | Create | S1/S2: challengeCategoryModel=pgTable('challenges_categories'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/challenging/challenge-code-execution-model.ts` | Create | S1/S2: challengeCodeExecutionModel=pgTable('challenge_code_executions'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/challenging/challenge-difficulty-level-model.ts` | Create | S1/S2: challengeDifficultyLevelModel=pgEnum('challenge_difficulty_level'); valores/ordem legados sem alteração; EV-03/04 |
| `apps/server/src/database/drizzle/models/challenging/challenge-model.ts` | Create | S1/S2: challengeModel=pgTable('challenges'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/challenging/challenge-source-model.ts` | Create | S1/S2: challengeSourceModel=pgTable('challenge_sources'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/challenging/challenge-vote-model.ts` | Create | S1/S2: challengeVoteModel=pgEnum('challenge_vote'); valores/ordem legados sem alteração; EV-03/04 |
| `apps/server/src/database/drizzle/models/challenging/index.ts` | Create | S1/S2: barrel somente de modelos challenging; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/challenging/solution-model.ts` | Create | S1/S2: solutionModel=pgTable('solutions'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/conversation/chat-message-model.ts` | Create | S1/S2: chatMessageModel=pgTable('chat_messages'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/conversation/chat-message-sender-model.ts` | Create | S1/S2: chatMessageSenderModel=pgEnum('chat_message_sender'); valores/ordem legados sem alteração; EV-03/04 |
| `apps/server/src/database/drizzle/models/conversation/chat-model.ts` | Create | S1/S2: chatModel=pgTable('chats'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/conversation/index.ts` | Create | S1/S2: barrel somente de modelos conversation; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/forum/challenge-comment-model.ts` | Create | S1/S2: challengeCommentModel=pgTable('challenges_comments'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/forum/comment-model.ts` | Create | S1/S2: commentModel=pgTable('comments'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/forum/index.ts` | Create | S1/S2: barrel somente de modelos forum; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/forum/solution-comment-model.ts` | Create | S1/S2: solutionCommentModel=pgTable('solutions_comments'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/index.ts` | Create | S1/S2: exporta barrels de modelos dos 12 domínios; schema.ts os agrega para client e Drizzle Kit; EV-03/10 |
| `apps/server/src/database/drizzle/models/lesson/index.ts` | Create | S1/S2: barrel somente de modelos lesson; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/lesson/question-model.ts` | Create | S1/S2: questionModel=pgTable('questions'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/manual/guide-category-model.ts` | Create | S1/S2: guideCategoryModel=pgEnum('guide_category'); valores/ordem legados sem alteração; EV-03/04 |
| `apps/server/src/database/drizzle/models/manual/guide-model.ts` | Create | S1/S2: guideModel=pgTable('guides'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/manual/index.ts` | Create | S1/S2: barrel somente de modelos manual; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/playground/index.ts` | Create | S1/S2: barrel somente de modelos playground; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/playground/snippet-model.ts` | Create | S1/S2: snippetModel=pgTable('snippets'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/achievement-model.ts` | Create | S1/S2: achievementModel=pgTable('achievements'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/index.ts` | Create | S1/S2: barrel somente de modelos profile; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/profile/note-model.ts` | Create | S1/S2: noteModel=pgTable('notes'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-acquired-avatar-model.ts` | Create | S1/S2: userAcquiredAvatarModel=pgTable('users_acquired_avatars'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-acquired-insignia-model.ts` | Create | S1/S2: userAcquiredInsigniaModel=pgTable('users_acquired_insignias'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-acquired-rocket-model.ts` | Create | S1/S2: userAcquiredRocketModel=pgTable('users_acquired_rockets'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-challenge-vote-model.ts` | Create | S1/S2: userChallengeVoteModel=pgTable('users_challenge_votes'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-completed-challenge-model.ts` | Create | S1/S2: userCompletedChallengeModel=pgTable('users_completed_challenges'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-model.ts` | Create | S1/S2: userModel=pgTable('users'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-recently-unlocked-star-model.ts` | Create | S1/S2: userRecentlyUnlockedStarModel=pgTable('users_recently_unlocked_stars'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-rescuable-achievement-model.ts` | Create | S1/S2: userRescuableAchievementModel=pgTable('users_rescuable_achievements'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-unlocked-achievement-model.ts` | Create | S1/S2: userUnlockedAchievementModel=pgTable('users_unlocked_achievements'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-unlocked-star-model.ts` | Create | S1/S2: userUnlockedStarModel=pgTable('users_unlocked_stars'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-upvoted-comment-model.ts` | Create | S1/S2: userUpvotedCommentModel=pgTable('users_upvoted_comments'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/profile/user-upvoted-solution-model.ts` | Create | S1/S2: userUpvotedSolutionModel=pgTable('users_upvoted_solutions'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/ranking/index.ts` | Create | S1/S2: barrel somente de modelos ranking; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/ranking/ranking-status-model.ts` | Create | S1/S2: rankingStatusModel=pgEnum('ranking_status'); valores/ordem legados sem alteração; EV-03/04 |
| `apps/server/src/database/drizzle/models/ranking/ranking-user-model.ts` | Create | S1/S2: rankingUserModel=pgTable('ranking_users'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/ranking/tier-model.ts` | Create | S1/S2: tierModel=pgTable('tiers'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/reporting/feedback-intent-model.ts` | Create | S1/S2: feedbackIntentModel=pgEnum('feedback_intent'); valores/ordem legados sem alteração; EV-03/04 |
| `apps/server/src/database/drizzle/models/reporting/feedback-message-attachment-model.ts` | Create | S1/S2: feedbackMessageAttachmentModel=pgTable('feedback_message_attachments'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/reporting/feedback-message-model.ts` | Create | S1/S2: feedbackMessageModel=pgTable('feedback_messages'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/reporting/feedback-report-model.ts` | Create | S1/S2: feedbackReportModel=pgTable('feedback_reports'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/reporting/index.ts` | Create | S1/S2: barrel somente de modelos reporting; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/shop/avatar-model.ts` | Create | S1/S2: avatarModel=pgTable('avatars'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/shop/index.ts` | Create | S1/S2: barrel somente de modelos shop; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/shop/insignia-model.ts` | Create | S1/S2: insigniaModel=pgTable('insignias'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/shop/insignia-role-model.ts` | Create | S1/S2: insigniaRoleModel=pgEnum('insignia_role'); valores/ordem legados sem alteração; EV-03/04 |
| `apps/server/src/database/drizzle/models/shop/rocket-model.ts` | Create | S1/S2: rocketModel=pgTable('rockets'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/space/index.ts` | Create | S1/S2: barrel somente de modelos space; dependências SQL explícitas; schema/EV-03 |
| `apps/server/src/database/drizzle/models/space/planet-model.ts` | Create | S1/S2: planetModel=pgTable('planets'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/models/space/star-model.ts` | Create | S1/S2: starModel=pgTable('stars'); colunas/defaults/FKs/índices do manifest legado; EV-03/EV-04 |
| `apps/server/src/database/drizzle/types/entities/auth/index.ts` | Create | S1: barrel de rows/projeções auth, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/challenging/index.ts` | Create | S1: barrel de rows/projeções challenging, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/conversation/index.ts` | Create | S1: barrel de rows/projeções conversation, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/forum/index.ts` | Create | S1: barrel de rows/projeções forum, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/index.ts` | Create | S1: barrel de rows/projeções por domínio; models são fonte dos tipos; EV-10 |
| `apps/server/src/database/drizzle/types/entities/manual/index.ts` | Create | S1: barrel de rows/projeções manual, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/playground/index.ts` | Create | S1: barrel de rows/projeções playground, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/profile/index.ts` | Create | S1: barrel de rows/projeções profile, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/ranking/index.ts` | Create | S1: barrel de rows/projeções ranking, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/reporting/index.ts` | Create | S1: barrel de rows/projeções reporting, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/shop/index.ts` | Create | S1: barrel de rows/projeções shop, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/types/entities/space/index.ts` | Create | S1: barrel de rows/projeções space, inferidos de models; EV-10 |
| `apps/server/src/database/drizzle/schema.ts` | Create | S1/S2: barrel de models/index.ts, fonte única para DrizzleClient/Kit; sem declarações pgTable/pgEnum duplicadas; EV-03/10 |
| `apps/server/src/database/drizzle/types/entities/profile/DrizzleAchievement.ts` | Create | S1: DrizzleAchievement; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/auth/DrizzleApiKey.ts` | Create | S1: DrizzleApiKey; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/shop/DrizzleAvatar.ts` | Create | S1: DrizzleAvatar; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/challenging/DrizzleCategory.ts` | Create | S1: DrizzleCategory; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallenge.ts` | Create | S1: DrizzleChallenge; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallengeCodeExecution.ts` | Create | S1: DrizzleChallengeCodeExecution; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallengeSource.ts` | Create | S1: DrizzleChallengeSource; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/conversation/DrizzleChat.ts` | Create | S1: DrizzleChat; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/conversation/DrizzleChatMessage.ts` | Create | S1: DrizzleChatMessage; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/forum/DrizzleComment.ts` | Create | S1: DrizzleComment; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/reporting/DrizzleFeedbackMessage.ts` | Create | S1: DrizzleFeedbackMessage; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/reporting/DrizzleFeedbackReport.ts` | Create | S1: DrizzleFeedbackReport; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/manual/DrizzleGuide.ts` | Create | S1: DrizzleGuide; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/shop/DrizzleInsignia.ts` | Create | S1: DrizzleInsignia; contrato do par legado |
| `apps/server/src/database/drizzle/types/DrizzleInsigniaRole.ts` | Create | S1: DrizzleInsigniaRole; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/profile/DrizzleNote.ts` | Create | S1: DrizzleNote; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/space/DrizzlePlanet.ts` | Create | S1: DrizzlePlanet; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/ranking/DrizzleRankingUser.ts` | Create | S1: DrizzleRankingUser; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/shop/DrizzleRocket.ts` | Create | S1: DrizzleRocket; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/playground/DrizzleSnippet.ts` | Create | S1: DrizzleSnippet; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/challenging/DrizzleSolution.ts` | Create | S1: DrizzleSolution; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/space/DrizzleStar.ts` | Create | S1: DrizzleStar; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/ranking/DrizzleTier.ts` | Create | S1: DrizzleTier; contrato do par legado |
| `apps/server/src/database/drizzle/types/entities/profile/DrizzleUser.ts` | Create | S1: DrizzleUser; contrato do par legado |
| `apps/server/src/database/drizzle/types/index.ts` | Create | S1: index; contrato do par legado |
| `apps/server/src/database/index.ts` | Modify | S1: index; contratos definidos acima |
| `apps/server/src/database/postgres/PostgresClient.ts` | Remove | S1: pool/repos substituídos pelo adapter único |
| `apps/server/src/database/postgres/PostgresFeedbackMessagesRepository.ts` | Remove | S1: pool/repos substituídos pelo adapter único |
| `apps/server/src/database/postgres/PostgresFeedbackReportsRepository.ts` | Remove | S1: pool/repos substituídos pelo adapter único |
| `apps/server/src/database/postgres/index.ts` | Remove | S1: pool/repos substituídos pelo adapter único |
| `apps/server/src/database/supabase/errors/SupabasePostgreError.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/errors/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/auth/SupabaseApiKeyMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/auth/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeCodeExecutionMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/challenging/SupabaseSolutionMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/challenging/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/conversation/SupabaseChatMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/conversation/SupabaseChatMessageMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/conversation/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/forum/SupabaseCommentMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/forum/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/lesson/SupabaseQuestionMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/lesson/SupabaseTextBlockMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/lesson/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/manual/SupabaseGuideMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/manual/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/playground/SupabaseSnippetMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/playground/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/profile/SupabaseAchievementMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/profile/SupabaseNoteMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/profile/SupabaseUserMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/profile/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/ranking/SupabaseRankerMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/ranking/SupabaseTierMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/ranking/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackMessageMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackReportMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/reporting/tests/SupabaseFeedbackReportMapper.test.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/shop/SupabaseAvatarMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/shop/SupabaseInsigniaMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/shop/SupabaseRocketMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/shop/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/space/SupabasePlanetMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/space/SupabaseStarMapper.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/mappers/space/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/migrations/20250517205525_remote_schema.sql` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/SupabaseRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/auth/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeCodeExecutionsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/challenging/SupabaseSolutionsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/challenging/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/conversation/SupabaseChatMessagesRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/conversation/SupabaseChatsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/conversation/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/forum/SupabaseCommentsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/forum/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/lesson/SupabaseQuestionsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/lesson/SupabaseStoriesRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/lesson/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/manual/SupabaseGuidesRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/manual/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/playground/SupabaseSnippetsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/playground/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/profile/SupabaseAchievementsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/profile/SupabaseNotesRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/profile/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/ranking/SupabaseRankersRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/ranking/SupabaseTiersRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/ranking/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackMessagesRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/reporting/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/shop/SupabaseAvatarsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/shop/SupabaseInsigniasRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/shop/SupabaseRocketsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/shop/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/space/SupabasePlanetsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/space/SupabaseStarsRepository.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/repositories/space/index.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/supabase.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/Database.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/Supabase.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseAchievement.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseApiKey.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseAvatar.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseCategory.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseChallenge.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseChallengeCodeExecution.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseChallengeSource.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseChat.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseChatMessage.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseComment.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseFeedbackMessage.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseFeedbackReport.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseGuide.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseInsignia.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseInsigniaRole.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseNote.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabasePlanet.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseRankingUser.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseRocket.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseSnippet.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseSolution.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseStar.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseTier.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/SupabaseUser.ts` | Remove | S1/S2: substituir legado |
| `apps/server/src/database/supabase/types/index.ts` | Remove | S1/S2: substituir legado |

### Server / provision

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/provision/auth/NodeOnboardingReceiptProvider.ts` | Create | S3: NodeOnboardingReceiptProvider; operações/shapes e evidência do contrato |

### Server / queue

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/queue/inngest/createMarkTextBlockAudioAsErrorOnFailure.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/ChallengingFunctions.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/LessonFunctions.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/ManualFunctions.ts` | Modify | S1: ManualFunctions; contratos definidos acima |
| `apps/server/src/queue/inngest/functions/ProfileFunctions.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/RankingFunctions.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/ShopFunctions.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/SpaceFunctions.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/StorageFunctions.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/queue/inngest/functions/tests/InngestFunctionsAssembly.test.ts` | Modify | S1: InngestFunctionsAssembly.test; contratos definidos acima |
| `apps/server/src/queue/inngest/functions/tests/StorageFunctions.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |

### Server / rest

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/rest/controllers/auth/SignUpController.ts` | Modify | S3: SignUpController; contratos definidos acima |
| `apps/server/src/rest/controllers/auth/tests/SignUpController.test.ts` | Modify | S3: SignUpController.test; contratos definidos acima |
| `apps/server/src/rest/controllers/profile/FetchOnboardingAttemptController.ts` | Create | S3: FetchOnboardingAttemptController; operações/shapes e evidência do contrato |
| `apps/server/src/rest/controllers/profile/tests/FetchOnboardingAttemptController.test.ts` | Create | S3: FetchOnboardingAttemptController.test; operações/shapes e evidência do contrato |
| `apps/server/src/rest/controllers/reporting/tests/GetFeedbackReportController.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/rest/controllers/reporting/tests/ListFeedbackReportsController.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/rest/services/SupabaseAuthService.ts` | Modify | S1/S3: SDK exclusivamente Auth, tipos independentes do banco; nonce/elegibilidade de receipt somente internos, body/status/port públicos preservados; EV-06/07 |

### Server / Testes de rota e fixtures

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/server/src/tests/database/supabase/FeedbackConversationCascade.test.ts` | Remove | S1/S6: portar cenários observáveis para rotas permitidas |
| `apps/server/src/tests/database/supabase/SupabaseFeedbackReportsRepository.test.ts` | Remove | S1/S6: portar cenários observáveis para rotas permitidas |
| `apps/server/src/tests/fixtures/ChallengingFixture.ts` | Modify | S1: ChallengingFixture; contratos definidos acima |
| `apps/server/src/tests/fixtures/ForumFixture.ts` | Modify | S1: ForumFixture; contratos definidos acima |
| `apps/server/src/tests/fixtures/ProfileFixture.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/fixtures/ReportingFixture.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/fixtures/ShopFixture.ts` | Modify | S1: ShopFixture; contratos definidos acima |
| `apps/server/src/tests/fixtures/SpaceFixture.ts` | Modify | S1: SpaceFixture; contratos definidos acima |
| `apps/server/src/tests/fixtures/SupabaseFixture.ts` | Modify | S1: SupabaseFixture; contratos definidos acima |
| `apps/server/src/tests/rest/services/SupabaseAuthService.test.ts` | Remove | S1/S6: portar cenários observáveis para rotas permitidas |
| `apps/server/src/tests/routes/auth/FetchAccountRoute.test.ts` | Create | S1/Evidence: GET /auth/account real; portar cenários úteis de nome/identidades/metadata da suíte AuthService removida, preparando metadata local por fixture; nenhuma simulação do SDK |
| `apps/server/src/tests/routes/auth/SignUpRoute.test.ts` | Create | S4: SignUpRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/challenging/challenges/CountChallengeCodeExecutionErrorsRoute.test.ts` | Modify | S1: CountChallengeCodeExecutionErrorsRoute.test; contratos definidos acima |
| `apps/server/src/tests/routes/challenging/challenges/ListChallengeCodeExecutionsRoute.test.ts` | Modify | S1: ListChallengeCodeExecutionsRoute.test; contratos definidos acima |
| `apps/server/src/tests/routes/challenging/challenges/RunChallengeCodeRoute.test.ts` | Modify | S1: RunChallengeCodeRoute.test; contratos definidos acima |
| `apps/server/src/tests/routes/conversation/CreateChatRoute.test.ts` | Create | S1/CA-01/CA-03: POST /chats real com Auth/PostgreSQL local; criação persistida quando não há chat anterior e deduplicação do nome padrão quando já existe chat padrão, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/conversation/DeleteChatRoute.test.ts` | Create | S1/CA-01/CA-03: DELETE /chats/:chatId real com Auth/PostgreSQL local; remoção persistida do chat próprio, negação A/B sem alterar estado e preservação do erro público, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/conversation/EditChatNameRoute.test.ts` | Create | S1/CA-01/CA-03: PATCH /chats/:chatId/name real com Auth/PostgreSQL local; alteração persistida do nome próprio, negação A/B sem alterar estado e preservação do erro público, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/conversation/FetchChatsRoute.test.ts` | Create | S1/CA-01/CA-03: GET /chats real com Auth/PostgreSQL local; listagem persistida e isolamento A/B, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/conversation/FetchChatMessagesRoute.test.ts` | Create | S1/CA-01/CA-03: GET /chats/:chatId/messages real com Auth/PostgreSQL local; leitura A/B, negando acesso a chat alheio sem expor rows, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/conversation/SendChatMessageRoute.test.ts` | Create | S1/CA-01/CA-03: POST /chats/:chatId/messages real com Auth/PostgreSQL local; persistência/leitura posterior e negação de escrita em chat alheio sem alterar rows, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/profile/notes/FetchNotesListRoute.test.ts` | Create | S1/CA-01/CA-03: GET /profile/notes real com Auth/PostgreSQL; paginação, busca, persistência e isolamento A/B de notas, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/profile/notes/CreateNoteRoute.test.ts` | Create | S1/CA-01/CA-03: POST /profile/notes real com Auth/PostgreSQL; criação/leitura posterior e ownership da conta, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/profile/notes/UpdateNoteRoute.test.ts` | Create | S1/CA-01/CA-03: PUT /profile/notes/:noteId real; update próprio persistido e negação A/B sem alterar rows, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/profile/notes/DeleteNoteRoute.test.ts` | Create | S1/CA-01/CA-03: DELETE /profile/notes/:noteId real; remoção própria persistida e negação A/B sem alterar rows, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/playground/snippets/FetchSnippetsListRoute.test.ts` | Create | S1/CA-01/CA-03: GET /playground/snippets real com Auth/PostgreSQL; paginação e ownership A/B, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/playground/snippets/FetchSnippetRoute.test.ts` | Create | S1/CA-01/CA-03: GET /playground/snippets/:snippetId real; leitura própria e negação A/B, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/playground/snippets/CreateSnippetRoute.test.ts` | Create | S1/CA-01/CA-03: POST /playground/snippets real; criação persistida/read-after-write e ownership, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/playground/snippets/UpdateSnippetRoute.test.ts` | Create | S1/CA-01/CA-03: PUT /playground/snippets/:snippetId real; update próprio persistido e negação A/B sem alterar rows, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/playground/snippets/EditSnippetTitleRoute.test.ts` | Create | S1/CA-01/CA-03: PATCH /playground/snippets/:snippetId real; rename próprio persistido e negação A/B sem alterar rows, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/playground/snippets/DeleteSnippetRoute.test.ts` | Create | S1/CA-01/CA-03: DELETE /playground/snippets/:snippetId real; remoção própria persistida e negação A/B sem alterar rows, sem mocks de Auth/repositories |
| `apps/server/src/tests/routes/lesson/questions/FetchQuestionsByStarRoute.test.ts` | Create | S1/CA-01/CA-03: GET /lesson/questions/star/:starId real; leitura de questões por estrela e projeção persistida |
| `apps/server/src/tests/routes/lesson/questions/UpdateQuestionsByStarRoute.test.ts` | Create | S1/CA-01/CA-03: PUT /lesson/questions/star/:starId real; updateMany persistido e readback da ordem/conteúdo |
| `apps/server/src/tests/routes/lesson/stories/FetchStoryByStarRoute.test.ts` | Create | S1/CA-01/CA-03: GET /lesson/stories/star/:starId real; leitura de story por estrela |
| `apps/server/src/tests/routes/lesson/stories/UpdateStoryByStarRoute.test.ts` | Create | S1/CA-01/CA-03: PUT /lesson/stories/star/:starId real; update persistido e readback do conteúdo |
| `apps/server/src/tests/routes/manual/guides/FetchGuidesListRoute.test.ts` | Create | S1/CA-01/CA-03: GET /manual/guides real; findAll/category com projeção e ordem contratuais |
| `apps/server/src/tests/routes/manual/guides/FetchGuideRoute.test.ts` | Create | S1/CA-01/CA-03: GET /manual/guides/:guideId real; findById e projeção persistida |
| `apps/server/src/tests/routes/manual/guides/CreateGuideRoute.test.ts` | Create | S1/CA-01/CA-03: POST /manual/guides real; add/findLastByPositionAndCategory e readback |
| `apps/server/src/tests/routes/manual/guides/DeleteGuideRoute.test.ts` | Create | S1/CA-01/CA-03: DELETE /manual/guides/:guideId real; remove persistido e readback |
| `apps/server/src/tests/routes/manual/guides/ReorderGuidesRoute.test.ts` | Create | S1/CA-01/CA-03: POST /manual/guides/reorder real; replaceMany e posições persistidas/readback |
| `apps/server/src/tests/routes/manual/guides/EditGuideTitleRoute.test.ts` | Create | S1/CA-01/CA-03: PATCH /manual/guides/:guideId/title real; replace persistido e readback |
| `apps/server/src/tests/routes/manual/guides/EditGuideContentRoute.test.ts` | Create | S1/CA-01/CA-03: PATCH /manual/guides/:guideId/content real; replace persistido e readback |
| `apps/server/src/tests/routes/lesson/text-blocks/FetchTextBlocksByStarRoute.test.ts` | Create | S1/CA-01/CA-03: GET /lesson/text-blocks/star/:starId real; findAllByStar, projeção JSON/texto e read-only snapshot |
| `apps/server/src/tests/routes/lesson/text-blocks/UpdateTextBlocksByStarRoute.test.ts` | Create | S1/CA-01/CA-03: PUT /lesson/text-blocks/star/:starId real; updateMany persistido e readback do JSON/order |
| `apps/server/src/tests/routes/lesson/text-blocks/RequestTextBlockAudioBatchRoute.test.ts` | Create | S1/CA-01/CA-03: POST /lesson/text-blocks/star/:starId/audio/batch real; God-only, updateAudio concorrente e estados pending persistidos |
| `apps/server/src/tests/routes/lesson/text-blocks/ClearTextBlockAudioFileRoute.test.ts` | Create | S1/CA-01/CA-03: DELETE /lesson/text-blocks/star/:starId/audio/file real; clearAudio persistido sem remoção externa quando fileName ausente |
| `apps/server/src/tests/jobs/UpdateTextBlockAudioJob.integration.test.ts` | Create | S1/CA-01/CA-02/CA-03: job real com PostgreSQL e DrizzleTextBlocksRepository marca o bloco alvo como done com fileName/voice exatos e preserva outros blocos JSON |
| `apps/server/jest.config.ts` | Modify | S1/test projects: excluir `src/tests/**/*.integration.test.ts` do projeto `server` e incluir `src/tests/jobs/**/*.integration.test.ts` no `server-integration`, sem sobreposição nem alteração dos demais testes selecionados |
| `apps/server/src/tests/routes/global/RateLimiterRoute.test.ts` | Modify | S1: RateLimiterRoute.test; contratos definidos acima |
| `apps/server/src/tests/routes/profile/FetchOnboardingAttemptRoute.test.ts` | Create | S4: FetchOnboardingAttemptRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts` | Create | S4: StreamProfileCreationRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/profile/achievements/FetchUnlockedAchievementsRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/achievements/RescueAchievementRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/users/FetchCreatedUsersKpiRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/users/FetchUserByIdRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/users/FetchUserBySlugRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/users/FetchUsersListRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/users/UpdateUserRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/users/VerifyUserEmailInUseRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/profile/users/VerifyUserNameInUseRoute.test.ts` | Modify | S1: composição/imports Drizzle; domínio e resposta preservados |
| `apps/server/src/tests/routes/reporting/ChangeFeedbackReportStatusRoute.test.ts` | Create | S1: ChangeFeedbackReportStatusRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/CountUnreadFeedbackReportsRoute.test.ts` | Create | S1: CountUnreadFeedbackReportsRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/CreateFeedbackMessageAttachmentUploadUrlRoute.test.ts` | Create | S1: CreateFeedbackMessageAttachmentUploadUrlRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/CreateFeedbackReportAttachmentUploadUrlRoute.test.ts` | Create | S1: CreateFeedbackReportAttachmentUploadUrlRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/FeedbackConversationsPersistence.test.ts` | Remove | S1/S6: portar cenários observáveis para rotas permitidas |
| `apps/server/src/tests/routes/reporting/FetchUserFeedbackReportRoute.test.ts` | Create | S1: FetchUserFeedbackReportRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/GetFeedbackReportRoute.test.ts` | Create | S1: GetFeedbackReportRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/ListFeedbackReportsRoute.test.ts` | Create | S1: ListFeedbackReportsRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/ListUserFeedbackReportsRoute.test.ts` | Create | S1: ListUserFeedbackReportsRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/MarkFeedbackReportAsReadRoute.test.ts` | Create | S1: MarkFeedbackReportAsReadRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/MarkUserFeedbackReportAsReadRoute.test.ts` | Create | S1: MarkUserFeedbackReportAsReadRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/SendFeedbackMessageRoute.test.ts` | Create | S1: SendFeedbackMessageRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/SendFeedbackReportRoute.test.ts` | Create | S1: SendFeedbackReportRoute.test; operações/shapes e evidência do contrato |
| `apps/server/src/tests/routes/reporting/UserFeedbackHistoryRoutes.test.ts` | Remove | S1/S6: portar cenários observáveis para rotas permitidas |
| `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts` | Modify | S1: CreatePlanetRoute.test; contratos definidos acima |
| `apps/server/src/tests/routes/space/planets/CreatePlanetStarRoute.test.ts` | Modify | S1: CreatePlanetStarRoute.test; contratos definidos acima |
| `apps/server/src/tests/routes/space/planets/FetchAllPlanetsRoute.test.ts` | Modify | S1: FetchAllPlanetsRoute.test; contratos definidos acima |

### Web / Adapters e configuração

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/web/.env.example` | Modify | S6: .env; contratos definidos acima |
| `apps/web/package.json` | Modify | S6: package; contratos definidos acima |
| `apps/web/src/constants/client-env.ts` | Modify | S6: client-env; contratos definidos acima |
| `apps/web/src/constants/cookies.ts` | Modify | S3: cookies; contratos definidos acima |
| `apps/web/src/realtime/sse/channels/SseProfileChannel.ts` | Create | S4: SseProfileChannel; operações/shapes e evidência do contrato |
| `apps/web/src/realtime/sse/channels/index.ts` | Create | S4: index; operações/shapes e evidência do contrato |
| `apps/web/src/realtime/supabase/channels/SupabaseProfileChannel.ts` | Remove | S4: substituir adapter/tipos/client Supabase |
| `apps/web/src/realtime/supabase/channels/index.ts` | Remove | S4: substituir adapter/tipos/client Supabase |
| `apps/web/src/realtime/supabase/client.ts` | Remove | S4: substituir adapter/tipos/client Supabase |
| `apps/web/src/realtime/supabase/types/SupabaseUser.ts` | Remove | S4: substituir adapter/tipos/client Supabase |
| `apps/web/src/realtime/supabase/types/index.ts` | Remove | S4: substituir adapter/tipos/client Supabase |
| `apps/web/src/rest/next/NextRestClient.ts` | Modify | S3: NextRestClient; contratos definidos acima |
| `apps/web/src/rest/services/AuthService.ts` | Modify | S3: AuthService; contratos definidos acima |
| `apps/web/src/rest/services/OnboardingService.ts` | Create | S3: OnboardingService; operações/shapes e evidência do contrato |
| `apps/web/src/rest/services/index.ts` | Modify | S3: index; contratos definidos acima |
| `apps/web/src/rpc/next-safe-action/authActions.ts` | Modify | S5: `signUpWithSocialAccount` instancia `NextRestClient({ isCacheEnabled: false })`; mantém endpoint, payload, Authorization e retorno do action; EV-08 confirma classificação atual do perfil existente e redirect correto |

### Web / Rotas e testes

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/web/src/middleware.ts` | Modify | S4/EV-07: bypass de três paths exatos antes da política genérica; cadastro Playwright sem sessão comprova passagem real |
| `apps/web/src/app/api/auth/onboarding-attempt/route.ts` | Create | S4: route; operações/shapes e evidência do contrato |
| `apps/web/src/app/api/auth/onboarding-attempt/tests/route.test.ts` | Create | S4: route.test; operações/shapes e evidência do contrato |
| `apps/web/src/app/api/auth/profile-events/route.ts` | Create | S4: route; operações/shapes e evidência do contrato |
| `apps/web/src/app/api/auth/profile-events/tests/route.test.ts` | Create | S4: route.test; operações/shapes e evidência do contrato |
| `apps/web/src/app/api/auth/sign-up/route.ts` | Create | S4: route; operações/shapes e evidência do contrato |
| `apps/web/src/app/api/auth/sign-up/tests/route.test.ts` | Create | S4: route.test; operações/shapes e evidência do contrato |
| `apps/web/src/app/api/tests/server/[...path]/route.ts` | Modify | S6: route; contratos definidos acima |
| `apps/web/src/app/tests/auth/account-confirmation.test.ts` | Modify | S5: account-confirmation.test; contratos definidos acima |
| `apps/web/src/app/tests/auth/sign-up.test.ts` | Modify | S5: sign-up.test; contratos definidos acima |
| `apps/web/src/app/tests/auth/social-account-confirmation.test.ts` | Create | S5: social-account-confirmation.test; operações/shapes e evidência do contrato |
| `apps/web/src/app/tests/shared/mocks/ServerMock.ts` | Modify | S6: ServerMock; contratos definidos acima |
| `apps/web/src/app/tests/shared/mocks/ServerMockRegistry.ts` | Modify | S6: ServerMockRegistry; contratos definidos acima |

### Web / UI

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/index.tsx` | Modify | S5: index; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/tests/useAccountConfirmationPage.test.ts` | Create | S5: useAccountConfirmationPage.test; operações/shapes e evidência do contrato |
| `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts` | Modify | S5: useAccountConfirmationPage; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpPageView.tsx` | Modify | S5: SignUpPageView; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SignUp/index.tsx` | Modify | S5: index; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SignUp/tests/SignUpPageView.test.tsx` | Modify | S5: SignUpPageView.test; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SignUp/tests/useSignUpPage.test.ts` | Modify | S5: useSignUpPage.test; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SignUp/useSignUpPage.ts` | Modify | S5: useSignUpPage; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/index.tsx` | Modify | S5: index; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/tests/useSocialAccountConfirmationPage.test.ts` | Modify | S5: useSocialAccountConfirmationPage.test; contratos definidos acima |
| `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts` | Modify | S5: useSocialAccountConfirmationPage; contratos definidos acima |
| `apps/web/src/ui/global/contexts/RealtimeContext/useRealtimeContextProvider.ts` | Modify | S4: useRealtimeContextProvider; contratos definidos acima |
| `apps/web/src/ui/global/contexts/RestContext/types/RestContextValue.ts` | Modify | S3: RestContextValue; contratos definidos acima |
| `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts` | Modify | S3: useRestContextProvider; contratos definidos acima |
| `apps/web/src/ui/global/hooks/tests/useProfileSocket.test.ts` | Create | S4/EV-09: Hook com SseProfileChannel real/factory EventSource controlada; montagem, frames, estados de erro, cleanup, identidade e StrictMode |
| `apps/web/src/ui/global/hooks/useProfileSocket.ts` | Modify | S4: useProfileSocket; contratos definidos acima |

### Documentação / Autoridades e handoff

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `design/handoff.md` | Create | S6: handoff; operações/shapes e evidência do contrato |
| `documentation/architecture.md` | Modify | S6 docs: architecture; contratos definidos acima |
| `documentation/features/global/supabase-replacement-with-drizzle/cutover-runbook.md` | Create | S6: cutover-runbook; operações/shapes e evidência do contrato |
| `documentation/infrastructure.md` | Modify | S6 docs: infrastructure; contratos definidos acima |
| `documentation/rules/database-rules.md` | Modify | S6 docs: database-rules; contratos definidos acima |
| `documentation/rules/realtime-rules.md` | Modify | S6 docs: realtime-rules; contratos definidos acima |
| `documentation/rules/server-application-rules.md` | Modify | S6 docs: server-application-rules; contratos definidos acima |
| `documentation/rules/server-routes-testing-rules.md` | Modify | S6 docs: server-routes-testing-rules; contratos definidos acima |
| `documentation/tooling.md` | Modify | S6 docs: tooling; contratos definidos acima |

### Core / Ports

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `packages/core/src/auth/interfaces/OnboardingReceiptProvider.ts` | Create | S3: OnboardingReceiptProvider; operações/shapes e evidência do contrato |
| `packages/core/src/auth/interfaces/OnboardingService.ts` | Create | S3: OnboardingService; operações/shapes e evidência do contrato |
| `packages/core/src/auth/interfaces/index.ts` | Modify | S3: index; contratos definidos acima |

### Tooling / Scripts

| Path | Change | Declaration / Contract e evidência |
| --- | --- | --- |
| `scripts/adopt-drizzle-baseline.mjs` | Create | S2: adopt-drizzle-baseline; operações/shapes e evidência do contrato |
| `scripts/check-drizzle-transition.mjs` | Create | S2: check-drizzle-transition; operações/shapes e evidência do contrato |
| `scripts/check-spec-definition.mjs` | Modify | S6 docs: check-spec-definition; contratos definidos acima |
| `scripts/export-local-database-env.mjs` | Create | S6: export-local-database-env; operações/shapes e evidência do contrato |
| `scripts/tests/adopt-drizzle-baseline.test.mjs` | Create | S2: adopt-drizzle-baseline.test; operações/shapes e evidência do contrato |
| `scripts/tests/check-drizzle-transition.test.mjs` | Create | S2: check-drizzle-transition.test; operações/shapes e evidência do contrato |
| `scripts/tests/check-spec-definition.test.mjs` | Modify | S6 docs: check-spec-definition.test; contratos definidos acima |
| `scripts/tests/export-local-database-env.test.mjs` | Create | S6: export-local-database-env.test; operações/shapes e evidência do contrato |

# Validation Contract

## Evidências e camadas responsáveis

| EV | Cobertura e resultado esperado |
| --- | --- |
| EV-03 | Testes de scripts + stack local: banco vazio/migrate/no-op, replay legado→adopt com dados, drift, ledger parcial e concorrência entre adopt/migrate/rollback. Exercitar as três phases, no-op após 0002 e rollback transacional; timeout/liberação de lock e escrita pela sessão protegida. Catálogo/hash/counts comparados, sem expor dados. Parity remota real obrigatória antes do deploy. |
| EV-04 | Catálogo policies/grants/RLS/default privileges, SQL roles e Data API negada; Auth/S3 e HTTP legítimos funcionam; clone de rollback restabelece catálogo e versão antiga. |
| EV-05 | Runbook executado: manutenção/drain/writer pause, hashes e SHAs, backup/restauração/rollback ensaiados, execução coordenada, health e reabertura. Nesta autoria nenhuma etapa remota foi executada. |
| EV-06 | GET /profile/events real com UsersRepository/DB/Auth: próprio/alheio, receipt/bearer inválido, inicial/reconnect, abort, expiry/duração e erro depois de headers. Não mockar domínio/repo na integração de rota. Timers podem ser controlados na fronteira de streaming com caso real equivalente. |
| EV-07 | Controller/signup + rotas Next receipt/resume, widget/hook e Playwright cadastro: contrato body/status, headers/cookie, retomada sem repost/senha, expiração, cancelamento, sucesso somente após perfil. |
| EV-08 | Hook e Playwright automatizados email/social: conta filtrada, refetch antes de sucesso, retry7s, token uma execução, perfil existente/direct redirect, falta sessão RP6 e navegação CTA /space. Social usa ServerMock no ambiente testing; registra renderização e screenshot do sucesso novo nos viewports contratados, sem smoke manual/OAuth real exigido. |
| EV-09 | Rotas Next com upstream mock/raw frames finitos: no buffering, flags de cache/stream, precedência auth, nenhum token em URI/JS, abort propagado e cleanup; eventos inválidos/deduplicação via Hook/widget/rota, não teste dedicado de realtime. useProfileSocket.test monta o Hook com SseProfileChannel real e factory EventSource controlada para frames, erro CONNECTING/CLOSED, terminal, expiração, StrictMode e cleanup; não substitui o próprio canal por ProfileChannelMock nesses casos. A suíte Playwright preserva seu mock padrão e confirma middleware/BFF sem sessão. |
| EV-10 | Sensores e build + inventário de paths/imports: estrutura models/types/entities/mappers/repositories/migrations conforme D-08, nenhuma definição de tabela duplicada em schema.ts; SDK Web removido, Core puro, SDK Server Auth somente, pool singleton/shutdown e nenhum persistência PostgREST/RPC. |
| EV-11 | Browser manual feliz em viewports contratados, screenshots dos estados visíveis alterados e endpoints essenciais sem body sensível; handoff registra indisponibilidade Pencil sem fingir comparação com nodes. |
| EV-12 | Sensores oficiais, cobertura sem redução de coverage-baseline.json, integridade de testes e CI/build de ambos os apps. |

Na integração real do Server, Supabase Auth local envia o email de confirmação para o Mailpit da stack Compose. AuthFixture obtém o link/token hash pela API local do Mailpit para confirmar contas efêmeras antes das rotas protegidas, mantendo a confirmação de email ativa. Não registrar OTP, tokens, link completo ou corpo da mensagem. A integração Web com ServerMock permanece separada desse fluxo real.

Fixtures permanecem infraestrutura; não criar testes dedicados de repositories, mappers, services, providers, constantes ou fixtures. Um arquivo por rota HTTP. Remover suites database legadas e suites reporting agrupadas somente depois de portar seus cenários observáveis para os arquivos por rota especificados no mapa. Testes de migração/operacionais são scripts, não uma nova suite de repositories. Suítes de handlers/jobs preservam nomes/eventos/idempotência, sem mocks de SDK no Core.

## Sensores aplicáveis na implementação

- `format`, `npm run check:code`, `npm run check:types`, `npm run test:unit`.
- `npm run check:architecture`, `npm run check:test-integrity`, `npm run check:complexity`.
- `npm run db:test -w @stardust/server` antes de `npm run test:integration -w @stardust/server` e da cobertura combinada que executa o projeto `server-integration`.
- `npm run test:coverage -w @stardust/server` deve executar os projetos Jest `server` e `server-integration` no mesmo relatório, para que as rotas reais S2 contribuam ao ratchet sem remover caminhos medidos.
- `npm --workspace @stardust/web run test:integration` com Playwright config existente, 127.0.0.1:3100, ServerMock e fixtures determinísticas, sem Server real/produção/STUDIO_APP_E2E.
- `test:coverage` e `check:coverage` para Core, Server e Web, respeitando coverage-baseline.json. Studio sem alteração de código: smoke consumidor real, sem nova exigência de coverage de diff inexistente.
- `npm run check:spec-definition -- documentation/features/global/supabase-replacement-with-drizzle/spec.md` na autoria/amendments e `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md` na implementação/preflight.
- Checks e builds finais no CI. `check:dead-code` não é oficial. Não declarar resultados de implementação nesta Spec.

## Validação manual feliz obrigatória

Usar exclusivamente Playwright CLI, serviços locais separados e .env.local raiz como fonte; export scripts correspondentes, nenhum segredo inline. Não explorar manualmente erros/loading/recovery; esses casos são automatizados. Estados pendentes naturalmente atravessados no caminho feliz podem ser observados, mas não virar matriz manual de falhas. Cadastro/confirmação social ficam exclusivamente na cobertura automatizada por solicitação expressa do usuário (D-07); VM-03 foi retirada e os demais IDs permanecem estáveis.

| VM | App/rota, interação e viewports | Resultado/evidência |
| --- | --- | --- |
| VM-01 | Web3000 + Server3334; /auth/sign-up, preencher cadastro de teste e aguardar sucesso; 390×844 e1440×900 | Sucesso inline atual após perfil; screenshot e POST signup/GET attempt/SSE essenciais2xx. Não registrar payload/email/token. |
| VM-02 | Web3000/Server3334, Supabase Auth e Mailpit locais; após VM-01, abrir no Mailpit a mensagem de confirmação, seguir seu link na Web local e usar CTA /space nos mesmos viewports | Welcome/animação atuais após perfil persistido; /auth/account200 e /space/planets2xx; screenshot sucesso e URL protegida. Email/OTP/token/link completo/corpo da mensagem não entram nos logs ou evidências. |
| VM-04 | Studio local8000 (ou porta livre), Server3334; export-studio-app-e2e-env, login→/dashboard→/profile/users | Login2xx, /auth/account200 e listagem2xx com título Usuários; confirma consumidor legado após trocar persistence. |
| VM-05 | Web real /auth/sign-in→/space; export-web-app-e2e-env, conta real local | Login2xx, /auth/account200, /space/planets2xx e resultado visível. Não usar fixtures de ServerMock ou credenciais Studio. |

Falha inesperada exige diagnóstico console/pageerror/requestfailed/status dos endpoints, sem tokens/cookies/credenciais; depois de correção repetir somente caminho feliz afetado. Screenshots necessários em VM-01/02 por UI; aprovação de disponibilidade do ambiente não equivale a resultado. A futura evaluation contém EV/VM executados, limitações e links das evidências reais.

# Documentation alignment and revision history

## Autoridades e alinhamento

Precedência: fonte/decisões aprovadas → Architecture/Rules vigentes com alinhamento aprovado → Contract desta revisão → referência visual atual/handoff → futuro Plan (somente execução). Esta Spec não enfraquece Rule de testes/fronteiras. Os parágrafos de transição aprovados foram acrescentados à Architecture, Database/Realtime/Server/Server routes Rules, Tooling e Infrastructure, identificando explicitamente destino planejado; trechos históricos só serão substituídos após implementação verificada. `documentation/overview.md` ausente permanece gap documentado.

Rule Pack: rules.md; core-package-rules.md; code-conventions-rules.md; database-rules.md; server-application-rules.md; web-application-rules.md; rest-layer-rules.md; realtime-rules.md; rpc-layer-rules.md; queue-layer-rules.md; provision-layer-rules.md; mcp-rules.md; ui-layer-rules.md; server-routes-testing-rules.md; web-app-routes-testing-rules.md; handlers-testing-rules.md; widget-tests-rules.md. Paths relativos a documentation/rules. AGENTS vigente exige CodeGraph primeiro; pesquisa final utilizou CodeGraph, Context7/documentação oficial, com falhas remotas/Pencil registradas.

Referências técnicas verificadas: [Drizzle migrations](https://orm.drizzle.team/docs/migrations), [schema existente](https://orm.drizzle.team/docs/get-started/postgresql-existing), [generate/custom](https://orm.drizzle.team/docs/drizzle-kit-generate), [configuração do ledger](https://github.com/drizzle-team/drizzle-orm-docs/blob/main/src/content/docs/drizzle-config-file.mdx) e [Hono streaming](https://hono.dev/docs/helpers/streaming), [modelo EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html) e [signup do Supabase Auth v2.193.0](https://github.com/supabase/auth/blob/v2.193.0/internal/api/signup.go). Essas referências sustentam a separação generate/migrate/custom SQL e o tratamento de abort/erro após headers; não provam parity dos bancos da aplicação.

## Integridade e histórico

| Revisão/data | Status e decisões | Revisão arquitetural |
| --- | --- | --- |
| 1 /2026-10-01 | Open após frontier vazia, confirmação explícita, integrity e check:spec-definition aprovados; decisões D-01–D-06. 12 RF, 22 CA e 431 paths exatos; sem implementação/Plan/Evaluation. | Único Spec Reviewer read-only avaliou a revisão 1 draft: clear, sem finding arquitetural ou de Rule bloqueante. Resultado clear válido para a revisão 1; invalidado para a revisão atual pelo amendment da revisão 2. |
| 2 /2026-10-01 | Open: amendment solicitado pelo usuário, sem novas decisões pendentes; D-07 remove social do smoke manual e explicita Mailpit na VM-02/integração Server. RF-11, CA-16/21, EV-08 e matrizes/handoff alinhados; IDs restantes preservados. Integrity/check:spec-definition aprovados. | Mesmo Spec Reviewer reavaliou a revisão 2 draft: clear, sem finding arquitetural ou de Rule bloqueante; resultado válido para revisão 2, invalidado para a atual pelo amendment da revisão 3. |
| 3 /2026-10-01 | Open após integrity/check:spec-definition aprovados; 434 paths exatos, 12 RF e 22 CA. Revisão factual por CodeGraph e fontes oficiais; corrige middleware BFF, bootstrap API key, assinaturas/projeções JSON, elegibilidade de receipt, phases/lock/rollback de migrations, fonte da baseline e coordenação de deploy sem deadlock. Retomada permanece automatizada; Mailpit e exclusão manual social preservados. | Mesmo Spec Reviewer read-only avaliou a revisão 3 draft: clear, sem finding arquitetural ou de Rule bloqueante; verificadas as fronteiras do bootstrap API key, mappers, middleware BFF, receipt e testes de Hook. Resultado válido para revisão 3; invalidado para a atual pelo amendment da revisão 4. |
| 4 /2026-10-01 | Open após integrity/check:spec-definition aprovados; 507 paths únicos, 12 RF e 22 CA. Pedido explícito do usuário (D-08); organização Drizzle baseada em Scoops, adaptada aos 12 domínios StarDust. Models por tabela/enum, tipos inferidos em entities, schema agregador, base repository na raiz e migrations dentro do adapter; autoridades/tooling alinhados. | Mesmo Spec Reviewer read-only avaliou a revisão 4 draft: clear, sem finding arquitetural ou de Rule bloqueante; raiz única, owners/imports de models, tipos inferidos e migrations compatíveis com Architecture/Database Rules. Resultado válido para revisão 4; invalidado para a atual pelo amendment da revisão 5. |
| 5 /2026-10-01 | Open após integrity/check:spec-definition aprovados; 504 paths únicos, 12 RF e 22 CA. Pedido explícito do usuário (D-09); prontidão/resume/SSE reutilizam UsersRepository.findById e DrizzleUsersRepository. Removidos três paths propostos do Reader/adapter/barrel Core profile; ownership, payloads e polling preservados. | Mesmo Spec Reviewer read-only avaliou a revisão 5 draft: clear, sem finding arquitetural ou de Rule bloqueante; composição após autorização, projeção limitada de User e controller com injeção compatíveis com Core/Database Rules. Resultado válido para revisão 5; invalidado para a atual pelo amendment da revisão 6. |

| 6 /2026-10-01 | Open após integrity/check:spec-definition aprovados: D-10 renomeia o discriminante account para user em DatabaseAccess; accountId, autorização e 504 paths preservados. | Mesmo Spec Reviewer read-only avaliou a revisão 6 draft: clear, sem finding arquitetural ou de Rule bloqueante; discriminante user consistente com composição, identidade e ownership preservados. Resultado válido para revisão 6; invalidado pelo amendment da revisão 7. |
| 7 /2026-10-03 | Amendment autorizado pelo pedido explícito “solve all them”: acrescenta a composição `authActions.ts` para impedir resposta social obsoleta; especifica coverage Server combinada; preserva thresholds/baselines e posiciona gates globais no preflight integrado, sem declará-los aprovados antes da execução. `check:spec-definition` aprovado. | Spec Reviewer read-only avaliou a revisão 7: clear, sem finding de Architecture ou Rules; invalidado para revisão8 pelo amendment estrutural abaixo. |
| 8 /2026-10-03 | Corrige o inventário S6: `apps/server/.env.testing` e `apps/web/.env.testing` não existem no commit-base, são ignorados pelo Git e são gerados por job/localmente. Removidos do mapa como falsos `Modify`; seu conteúdo sintético é produzido pelo workflow, sem credenciais versionadas. Demais requisitos e contratos permanecem inalterados. `check:spec-definition` passou. | Spec Reviewer read-only: clear, sem finding de Architecture/Rules; a correção melhora a exatidão dos paths e não altera requisitos/fronteiras. |
| 9 /2026-10-04 | Amendment autorizado pelo usuário (“solve all them”): acrescenta somente `AuthRateLimitMiddleware.test.ts` como `Modify` para corrigir fixture obsoleta identificada em ACH-45. O teste preserva o contrato de ordenação dos limiters, usa AuthFixture/local Auth real e não altera middleware, status esperado ou cobertura de autorização. | Compatibilidade baseada nas Server Routes Testing Rules; check:spec-definition e Plan reconciliado antes da implementação. |
| 10 /2026-10-05 | Amendment autorizado pelo usuário (“increase the baseline”): baseline global de complexity atualizada para aceitar os findings já existentes; thresholds inalterados e CI-09 exige nenhum finding acima da baseline no C2. | Revisão D-12; sem alteração de Rules ou comportamento de produto. |
| 11 /2026-10-05 | Amendment autorizado pelo usuário (“ok”): acrescenta `apps/server/src/tests/routes/conversation/ChatsRoutes.test.ts` como `Create`, somente para evidência de rota real dos ports Chats/ChatMessages e isolamento privado A/B exigidos por CA-01/CA-03 (EV-01/EV-02). Inclui leitura posterior à gravação, negação de chat/mensagem alheia e comparação de estado persistido; não altera comportamento de produto, APIs, assinaturas ou permissões. | Avaliação de compatibilidade com Server Routes Testing Rules, Auth/Database boundaries e contrato existente registrada antes do Builder; revisão da emenda pendente. |
| 12 /2026-10-05 | Atende ACH-01 do Spec Reviewer: divide a evidência aprovada para Chat/ChatMessages em quatro paths Create, um por rota HTTP conforme Server Routes Testing Rules. Mantém cobertura funcional, ownership A/B, Auth/PostgreSQL reais e limites de não alterar produto/API/permissões; substitui o path agrupado da revisão 11. | Regra Server Routes Testing Rules §2: exatamente um arquivo por rota HTTP. Revisão de compatibilidade da revisão 12 pendente. |
| 13 /2026-10-05 | Resolve lacunas method-level identificadas no crosswalk S2: cria testes de rota separados para `PATCH /chats/:chatId/name` e `DELETE /chats/:chatId`, cobrindo `ChatsRepository.replace/remove`, e acrescenta ao teste existente de POST a deduplicação do nome padrão quando já há chat. Somente evidência de comportamento existente/Auth/PostgreSQL, sem mudança de produto/API/permissões. | Revisão agregada S2 observou que as rotas de rename/delete e o ramo de chat anterior não estavam exercitados. Um arquivo por rota conforme Server Routes Testing Rules §2; Spec Reviewer da revisão 13 pendente. |
| 14 /2026-10-05 | Adiciona dez paths de teste, um por cada rota HTTP Notes/Snippets existente, para fechar operações de leitura, criação, atualização/título e remoção com persistência real e A/B ownership; nenhum contrato de produto/API/permissão muda. | Crosswalk EV-01/EV-02 rev13 identificou Notes/Snippets sem evidência real. Paths e operações verificados nos Hono routers existentes; review da revisão 14 pendente. |
| 15 /2026-10-05 | Corrige ACH-01 da revisão 14: URLs incluem os prefixos dos routers pais `/profile` e `/playground`, mantendo os mesmos dez paths de teste e contratos comportamentais. | Spec Reviewer verificou mounts `ProfileRouter` e `PlaygroundRouter`; nova revisão pendente. |
| 16 /2026-10-05 | Adiciona onze testes de rota reais para as operações de Questions, Stories e Guides sem evidência runtime no crosswalk; sem mudança de contratos de produto ou permissão. | Crosswalk EV-01/02 rev15; arquivos separados por endpoint conforme Server Routes Testing Rules §2; revisão concluída clear. |
| 17 /2026-10-05 | Mapeia quatro rotas TextBlocks e um teste real de UpdateTextBlockAudioJob, e inclui esse teste no Jest `server-integration`, para cobrir JSON updates/audio clear, concorrência, pending event path e Drizzle System-job persistence. Sem mudança de API/produto; amendment da configuração Jest pendente review. | Lacunas method-level EV-01/CA-02 no crosswalk S2-50. Hono rotas e LessonFunctions verificadas; one-file-per-route respeitado. |
| 18 /2026-10-05 | Resolve ACH-01 do Spec Reviewer rev17: o job `.integration.test.ts` fica excluído do projeto unit `server` e incluído somente em `server-integration`. | Mantém as demais seleções Jest existentes e elimina execução duplicada com ambiente incorreto; review rev18 pendente. |
| 19 /2026-10-06 | Por solicitação explícita do usuário, remove EV-01 e EV-02 do Validation Contract. RF/CA, contratos de comportamento/autorização, paths existentes e evidências já registradas permanecem; os antigos gates de crosswalk runtime amplo e matriz completa de atores deixam de bloquear a conclusão. Plan reconciliado para retirar esses gates ativos; nenhum outro EV foi removido. `check:spec-definition` passou. | Spec Reviewer revision19 **clear**, sem findings de Architecture/Rules; a revisão 18 foi invalidada por este amendment. |
| 20 /2026-10-06 | Por confirmação explícita do usuário, cancela os resultados ainda não entregues nas fases D2/S2/W2/D3 e supersede esta Spec. RF/CA/EV/VM e paths anteriores ficam preservados somente para auditoria; não são requisitos ativos nem evidência de conclusão. C2 permanece limitado a registrar cancelamento e handoff, sem declarar validação integrada ou cutover aprovados. | Decisão do usuário após inventário dos gates e do diff de trabalho; não é uma revisão de implementação nem um veredito arquitetural. |

Revisão 6 aberta após integrity/checker aprovados e resultado clear do mesmo Spec Reviewer. Esta rodada alterou somente documentação; os resultados de sensores de código a seguir pertencem à autoria da revisão 1. O checker foi ajustado para aceitar o segmento catch-all Next sem aceitar parent traversal; teste de script aprovado (3 casos), assim como check:code, check:types e test:unit globais. Estes resultados validam a autoria/tooling, não a implementação dos critérios desta Spec. Pelo alcance transversal, migrations, segurança, concorrência e múltiplas surfaces, o próximo workflow recomendado é create-plan e depois implement-spec. Nenhum requisito ou assinatura pode ser inferido pelo Plan.
