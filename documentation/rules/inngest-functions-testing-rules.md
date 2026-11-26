# Regras de Teste de Inngest Functions do Server

Esta documentação define os padrões para escrever testes de integração das
Inngest Functions em `apps/server`, com base em
`apps/server/src/tests/inngest/functions` e em `InngestFixture`.

## 1. Visão Geral

Um teste de Inngest Function atravessa o caminho real da fila:

```text
evento -> Inngest Dev Server -> HonoApp (/inngest) -> Function -> Job -> use case -> repository -> banco
```

Ele existe para provar o que os testes unitários de jobs não provam: o registro
da Function, a validação do evento, a serialização entre steps e a persistência
real. Os testes de jobs em `apps/server/src/queue/jobs/**/tests` continuam sendo
unitários, com mocks (veja `handlers-testing-rules.md`).

Não chame `job.handle(...)`, o handler da Function nem `step.run` diretamente, e
não use `NoStepAmqp` nestes testes. Uma chamada direta pula a serialização dos
steps e esconde falhas que só aparecem na execução real.

## 2. Localização e Nomenclatura

- **Localização:** `apps/server/src/tests/inngest/functions/<dominio>/`
- **Nomenclatura:** `[NomeDaFunction]Function.test.ts`, como
  `profile/CreateUserFunction.test.ts`.
- **Granularidade:** exatamente **um arquivo por Inngest Function** (um evento de
  entrada e uma Function registrada). Não agrupe várias Functions de uma classe
  `*Functions` no mesmo arquivo.
- **Domínio:** espelhe o módulo da Function em `apps/server/src/queue/inngest/functions`.

O `describe` de topo escreve o nome da Function com palavras separadas e inclui o
`KEY` do job entre colchetes:

```ts
describe(`Create User Function [${CreateUserJob.KEY}]`, () => {
  // ...
})
```

Use `Job.KEY` para o identificador da Function e as constantes ou `_NAME` dos
eventos para o nome do evento. Não repita esses literais no teste.

## 3. Stack e Ferramentas

- Runner de testes: Jest, projeto `inngest` de `apps/server/jest.config.ts`.
- Aplicação sob teste: `HonoApp`, servida por `InngestFixture`.
- Fila: Inngest Dev Server do `docker-compose.yml`.
- Banco para preparação e verificação: `SupabaseFixture` e fixtures de domínio.
- Autenticação, quando o evento depender de uma conta: `AuthFixture`.

## 4. Pré-Requisitos de Execução

```bash
pnpm --filter @stardust/server run db:test
pnpm --filter @stardust/server run test:inngest
```

- O container `inngest` do `docker-compose.yml` precisa estar de pé. Ele chama o
  Server de volta em `host.docker.internal:3334`.
- A porta **3334** é fixa. Pare o Server local (`apps/server`) antes de executar,
  ou a fixture falha com a mensagem `Port 3334 is in use`.
- O script define `INNGEST_DEV` e `INNGEST_BASE_URL`; não os defina no teste.
- `test:integration` executa os projetos `hono` e `inngest`; use `test:inngest`
  para rodar só este.

## 5. Estrutura Base do Teste

Todo arquivo repete três pontos de configuração.

1. **Client Inngest em modo dev.** O client do app só é criado com `isDev` quando
   `ENV.mode === 'development'`; em `test` ele exigiria assinatura, que o Dev
   Server não envia. O teste substitui apenas o client:

   ```ts
   jest.mock('@/queue/inngest/inngest', () => {
     const { Inngest } = jest.requireActual('inngest')
     return { inngest: new Inngest({ id: 'StarDust Queue', isDev: true }) }
   })
   ```

2. **Timeout maior.** O `jest.setup.js` fixa 30 segundos e sobrescreve o
   `testTimeout` da configuração. Declare no arquivo:

   ```ts
   jest.setTimeout(120_000)
   ```

3. **Ciclo da fixture.** `setup` recebe os IDs das Functions sob teste e espera o
   Dev Server registrá-las; `teardown` fecha a porta.

```ts
describe(`Create User Function [${CreateUserJob.KEY}]`, () => {
  const inngestFixture = new InngestFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await inngestFixture.setup([CreateUserJob.KEY])
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterAll(async () => {
    await inngestFixture.teardown()
    await DrizzleClient.close()
  })
})
```

## 6. `InngestFixture`

Fica em `apps/server/src/tests/fixtures/InngestFixture.ts` e não recebe testes
próprios.

| Método                              | Uso                                                                  |
| ----------------------------------- | -------------------------------------------------------------------- |
| `setup(functionIds)`                | Sobe o `HonoApp` na porta 3334 e espera cada Function ser registrada |
| `send(name, data)`                  | Envia o evento e devolve o `eventId`                                 |
| `waitForRun(eventId, options?)`     | Espera a run terminar e devolve `{ status, output }`                 |
| `teardown()`                        | Fecha o servidor                                                     |

`waitForRun` falha com a mensagem do último status quando a run não termina no
prazo (60 segundos por padrão). Não use `setTimeout` nem laços de espera próprios.

## 7. Padrões de Asserção

Cada teste faz, nesta ordem:

1. Prepara o estado no banco com fixtures.
2. Envia **um** evento com `inngestFixture.send`.
3. Espera a run e afirma `run.status` igual a `'Completed'`.
4. Lê o estado final no banco e afirma o efeito persistido.

```ts
const eventId = await inngestFixture.send(ShopItemsAcquiredByDefaultEvent._NAME, payload)
const run = await inngestFixture.waitForRun(eventId)

expect(run.status).toBe('Completed')
```

Cubra, por Function: o caminho feliz com o efeito persistido; o payload inválido
rejeitado pelo schema do evento quando houver regra de negócio nele; e os ramos
que o job decide por conta própria (por exemplo, um item já cancelado).

Afirme o banco, não os logs. Para falhas esperadas, afirme `run.status` igual a
`'Failed'` e que o banco ficou intacto.

## 8. Limitações Conhecidas

- **Serialização entre steps.** O Inngest serializa a saída de cada step em JSON.
  Um objeto de classe retornado por um step chega ao seguinte como objeto simples,
  sem métodos nem getters. Se o teste falhar com `... is not a function` dentro de
  um job, o job está passando uma entidade ou structure entre steps; corrija o job,
  não o teste.
- **Functions encadeadas.** Eventos publicados pela Function sob teste disparam as
  Functions seguintes no mesmo Dev Server. Elas podem falhar depois do teste (por
  exemplo, notificação e analytics com credenciais de teste). Afirme apenas o efeito
  da Function sob teste.
- **Estado do Dev Server.** Registros e runs de execuções anteriores permanecem no
  container. Use dados com identificadores novos em cada teste e não dependa de
  runs antigas.
- **Funções com cron.** Functions só com `cron` não têm evento de entrada e ainda
  não têm teste de integração.

## 9. O Que Evitar

- Chamar `job.handle`, `step.run` ou `NoStepAmqp` em vez de enviar um evento.
- Mockar repositories, providers de banco ou o Inngest além do client descrito na
  seção 5.
- Afirmar sem esperar a run terminar, ou esperar com `setTimeout`.
- Reutilizar `eventId` ou IDs de entidades entre testes.
- Um arquivo de teste com mais de uma Function.
- Escrever credenciais, tokens ou o corpo de e-mails no teste ou nos logs.

## 10. Checklist

1. O arquivo está em `apps/server/src/tests/inngest/functions/<dominio>/` e termina
   em `Function.test.ts`.
2. O `describe` usa o nome da Function e `Job.KEY`.
3. O client Inngest é substituído por um em modo dev e `jest.setTimeout` está
   declarado.
4. `setup` recebe o ID da Function e `teardown` roda em `afterAll`.
5. O evento é enviado por `inngestFixture.send` e a run é esperada por
   `waitForRun`.
6. `run.status` e o efeito persistido foram afirmados.
7. Nenhum teste chama o job ou o step diretamente.

## Tooling

- Workspace server: `pnpm --filter @stardust/server run db:test` antes de
  `pnpm --filter @stardust/server run test:inngest`
- Qualidade antes de abrir PR: `pnpm --filter @stardust/server run check:types` e
  `pnpm --filter @stardust/server run check:code`
- Referência geral: `documentation/tooling.md`
