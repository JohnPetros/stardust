# Regras de Teste de Rotas do Server

Esta documentação define os padrões e práticas para escrever testes de rotas
HTTP em `apps/server`, com base nos testes existentes em
`apps/server/src/tests/routes`.

## 1. Visão Geral

Os testes de rota do server são testes de integração da borda HTTP. Eles devem
validar a aplicação montada com Hono, exercitando autenticação, validação,
autorização, mapeamento de erros e efeitos persistidos no banco.

Diferente dos testes de handlers e use cases, aqui o foco não é mockar
dependências internas. O teste deve atravessar a stack real da rota sempre que
possível.

## 2. Localização e Nomenclatura

- **Localização:** `apps/server/src/tests/routes/<dominio>/...`
- **Nomenclatura:** `[NomeDaRota].test.ts`
- **Organização:** espelhe o domínio e o recurso testado, como em
  `profile/achievements`.
- **Granularidade:** crie exatamente **um arquivo de teste por rota HTTP**.
  Não agrupe múltiplas rotas diferentes no mesmo arquivo, mesmo que pertençam
  ao mesmo resource ou router.

Exemplos:

- `apps/server/src/tests/routes/profile/achievements/CreateAchievementRoute.test.ts`
- `apps/server/src/tests/routes/profile/achievements/FetchAchievementsRoute.test.ts`

## 3. Stack e Ferramentas

- Runner de testes: Jest.
- Cliente HTTP: `supertest`.
- Servidor sob teste: `HonoFixture`.
- Banco para preparação e limpeza: `SupabaseFixture`.
- Autenticação real para cenários protegidos: `AuthFixture`.
- Seed e leitura de dados auxiliares: fixtures de domínio, como `ProfileFixture`.

## 4. Pré-Requisitos de Execução

Antes de rodar os testes de integração da app server, prepare o Supabase local
com o script de teste do workspace:

```bash
npm run db:test -w @stardust/server
npm run test:integration -w @stardust/server
```

O `db:test` executa `supabase start` e `supabase db reset --local --yes`,
garantindo que o stack local esteja de pé e que o schema esteja reconstruído a
partir das migrations.

Os testes em `apps/server/src/tests/routes/**` dependem do Supabase local mesmo
quando executados pelo projeto Jest `server`, pois usam `SupabaseFixture`,
`AuthFixture`, repositories reais e validação de efeitos persistidos.

## 5. Estrutura Base do Teste

O padrão observado é:

1. Instanciar as fixtures uma vez no escopo do `describe`.
2. Executar `honoFixture.setup()` em `beforeAll` para registrar middlewares,
   rotas e tratamento de erro.
3. Limpar o banco em `beforeEach`.
4. Criar uma conta autenticável em `beforeEach` quando a rota exige sessão.
5. Resetar estado global mutável, como `ENV.godAccountIds`, quando o fluxo usar
   autorização especial.

```ts
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/achievements', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })
})
```

## 6. Fixtures Compartilhadas

### 6.1. `HonoFixture`

Use para subir a aplicação Hono real e expor `honoFixture.server` ao
`supertest`.

### 6.2. `SupabaseFixture`

Use para limpar o estado persistido entre testes. Cada `it` deve começar com o
banco isolado.

### 6.3. `AuthFixture`

Use para criar uma conta real no Supabase Auth e obter o header de autorização:

```ts
.set(authFixture.getAuthorizationHeader())
```

Também use `authFixture.getAccountId()` quando o cenário depender do id da
conta autenticada.

### 6.4. Fixtures de domínio

Use fixtures específicas para preparar dados de suporte ou verificar efeitos
colaterais, como:

- `ProfileFixture` para criar conquistas, usuários e consultar estado final.
- Repositórios reais quando o cenário exigir preparar relações específicas,
  como `SupabaseUsersRepository`.

### 6.5. Fixtures de módulo

Quando a preparação de dados de um módulo começar a se repetir entre testes de
rotas do mesmo domínio, prefira extrair essa lógica para uma fixture dedicada em
`apps/server/src/tests/fixtures/`.

Use uma fixture de módulo quando houver necessidade de:

- criar entidades relacionadas do mesmo domínio de forma recorrente;
- encapsular cleanup de dados criados durante o teste;
- centralizar leitura do estado persistido para assertions de integração;
- evitar helpers locais duplicados em múltiplos arquivos de teste.

Exemplo de naming esperado:

- `ProfileFixture`
- `SpaceFixture`

Regras para essas fixtures:

1. A fixture deve representar um módulo ou agregado funcional, não uma rota
   específica.
2. Prefira métodos de alto nível, como `createStar()`, `createAccountUser()` ou
   `getUserCoins()`.
3. Se a lógica passar a ser usada por mais de um arquivo de teste, mova helpers
   locais para a fixture compartilhada.
4. Evite criar fixture nova se `HonoFixture`, `SupabaseFixture`, `AuthFixture`
   e fixtures já existentes já resolverem o caso com clareza.

## 7. Padrões de Cobertura

Cada rota deve cobrir, quando aplicável:

1. Falha de autenticação (`401`) quando a rota é protegida.
2. Falha de autorização (`401` ou `403`) quando há regra de permissão.
3. Falha de validação (`400`) para `params`, `query` ou `body` inválidos.
4. Erros de domínio mapeados para HTTP, como `404` e `409`.
5. Caminho de sucesso com validação do payload retornado.
6. Verificação de efeito persistido após mutações, fazendo uma nova leitura ou
   consulta ao banco.

## 8. Padrões de Asserção

### 8.1. Status HTTP

Sempre use `HTTP_STATUS_CODE` em vez de números literais.

```ts
expect(response.status).toBe(HTTP_STATUS_CODE.ok)
```

### 8.2. Corpo de erro

Para erros conhecidos, compare com `expect.objectContaining` e a instância do
erro esperado.

```ts
expect(response.body).toEqual(
  expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
)
```

Para erros de validação, valide os campos relevantes:

```ts
expect(response.body).toEqual(
  expect.objectContaining({
    ...new ValidationError([
      { name: 'achievementId', messages: ['Invalid uuid'] },
    ]),
  }),
)
```

### 8.3. Corpo de sucesso

Prefira comparar a resposta com objetos reais criados por fixtures ou fakers.
Isso deixa o teste mais explícito e evita assertions genéricas como
`expect.any(String)` quando o valor esperado pode ser conhecido.

```ts
const achievement = AchievementsFaker.fakeUniqueDto()

const response = await request(honoFixture.server)
  .post('/profile/achievements')
  .set(authFixture.getAuthorizationHeader())
  .send(achievement)

expect(response.body).toEqual(
  expect.objectContaining({
    ...achievement,
  }),
)
```

Use `expect.any(...)` apenas como fallback para campos realmente não
determinísticos ou derivados em runtime, como um id gerado pela aplicação,
timestamps ou posições calculadas a partir do estado atual.

```ts
expect(response.body).toEqual(
  expect.objectContaining({
    ...achievement,
    id: expect.any(String),
    position: lastPosition + 1,
  }),
)
```

### 8.4. Respostas sem corpo

Para `204 No Content`, valide status e corpo vazio.

```ts
expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
expect(response.text).toBe('')
```

## 9. Preparação de Dados

Use sempre os fakers do domínio para montar payloads e entidades de apoio.

Exemplos observados:

- `AchievementsFaker.fakeUniqueDto()`
- `AchievementsFaker.fakeManyUniqueDto()`
- `Id.create().value` para ids válidos em params

Evite montar objetos manualmente quando já existir faker no core.

## 10. Regras para Rotas Protegidas

Quando a rota exigir autenticação:

1. Tenha um teste sem header `Authorization`.
2. Tenha um teste autenticado para o caminho feliz.
3. Se houver autorização adicional, prepare o estado explicitamente.

Exemplo recorrente:

```ts
ENV.godAccountIds = []
ENV.godAccountIds.push(authFixture.getAccountId())
```

Sempre resete esse tipo de estado no `beforeEach` para evitar vazamento entre
cenários.

## 11. Verificação de Persistência

Em rotas de mutação (`POST`, `PUT`, `PATCH`, `DELETE`), não pare na resposta
imediata. Valide também o efeito final no sistema.

Padrões aceitos:

1. Fazer um `GET` antes e depois da operação.
2. Consultar o banco por meio de uma fixture.
3. Consultar repositórios reais quando necessário.

Exemplos observados:

- Recarregar `/profile/achievements` após criar, atualizar, reordenar ou excluir.
- Ler `coins` do usuário após resgatar uma conquista.
- Confirmar remoção de vínculos em tabelas associativas.

## 12. O Que Evitar

- Não mocke controllers, use cases, middlewares ou repositórios dentro do teste
  de rota, salvo necessidade excepcional.
- Não acople o teste à implementação interna da rota; valide contrato HTTP e
  efeito observável.
- Não agrupe várias rotas em um único arquivo de teste.
- Não compartilhe estado entre testes.
- Não use números mágicos para status code.

## 13. Checklist

Antes de considerar um teste de rota completo, confirme:

1. A rota foi exercitada com `supertest` sobre `honoFixture.server`.
2. O banco foi limpo no `beforeEach`.
3. A autenticação foi preparada com `AuthFixture` quando necessária.
4. Existe apenas um arquivo de teste para a rota coberta.
5. Se houve preparação de dados repetida no módulo, foi avaliado o uso ou a
   criação de uma fixture compartilhada.
6. Foram cobertos cenários de erro relevantes da borda HTTP.
7. O teste validou o corpo retornado.
8. Em mutações, o teste validou o estado persistido após a chamada.

## Tooling

- Workspace server: `npm run test:unit -w @stardust/server`
- Integração server: `npm run db:test -w @stardust/server` antes de
  `npm run test:integration -w @stardust/server`
- Global (Turbo): `npm run test`
- Qualidade antes de abrir PR: `npm run typecheck -w @stardust/server` e
  `npm run codecheck -w @stardust/server`
- Referência geral: `documentation/tooling.md`
