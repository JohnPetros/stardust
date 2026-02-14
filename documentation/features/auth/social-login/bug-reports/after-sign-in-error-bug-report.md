---
title: After sign in error bug report
status: open
last_updated: 06/02/2026
---

# Problema Identificado

## 🐛 Bug Report: Erro de validação numérica ao abrir Space após login social

**Problema Identificado:**
Após autenticar com Google no fluxo de social login, a navegação para a tela Space quebra no cliente com `ValidationError` durante a montagem dos planetas. O erro interrompe a renderização da página e impede o usuário de continuar a jornada.

**Causas:**
- Campos de contagem (`completionCount`, `userCount`, `unlockCount`) estão chegando com tipo incompatível (texto/valor não numérico) no DTO consumido pela UI.
- Ausência de normalização/coerção dos campos numéricos no mapeamento de dados da camada Supabase para DTO de domínio.
- Validação estrita de `Integer.create(...)` no Core dispara erro em tempo de execução quando recebe valor não numérico.
- `SpaceProvider` cria entidades diretamente em `render` com `planetsDto.map(Planet.create)`, sem fallback para payload inválido.
- O `UserSocialAccountAlreadyInUseError` observado no fluxo de login social é comportamento esperado para conta já existente e não a causa da quebra da tela Space.

**Contexto e Análise:**

### Camada UI

- Arquivo: `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts`
- Diagnóstico: O fluxo de confirmação social direciona para `ROUTES.space` após sucesso de autenticação, tornando a tela Space o primeiro ponto de falha percebido pelo usuário.

- Arquivo: `apps/web/src/app/(home)/space/page.tsx`
- Diagnóstico: A página busca `spaceService.fetchPlanets()` e injeta a resposta diretamente no `SpaceProvider`, sem validação estrutural do payload recebido.

- Arquivo: `apps/web/src/ui/space/contexts/SpaceContext/index.tsx`
- Diagnóstico: O provider executa `planetsDto.map(Planet.create)` no ciclo de renderização. Se um item vier com tipo inválido, a exceção derruba a árvore React.

---

### Camada Core

- Arquivo: `packages/core/src/space/domain/entities/Planet.ts`
- Diagnóstico: `Planet.create` exige `completionCount` e `userCount` numéricos via `Integer.create`; qualquer string ou valor inválido lança `ValidationError` com a mensagem observada no log.

- Arquivo: `packages/core/src/space/domain/entities/Star.ts`
- Diagnóstico: O mesmo padrão estrito é aplicado para `userCount` e `unlockCount`, expondo risco adicional de quebra para dados de estrelas.

- Arquivo: `packages/core/src/global/domain/structures/Integer.ts`
- Diagnóstico: A estrutura assume contrato numérico estrito (sem coerção), portanto o Core funciona como guardião correto do domínio; o problema está no contrato de entrada.

- Arquivo: `packages/core/src/profile/use-cases/VerifyUserSocialAccountUseCase.ts`
- Diagnóstico: O use case lança `UserSocialAccountAlreadyInUseError` quando o usuário social já existe. Esse lançamento é intencional para evitar recriação de usuário e não explica o `ValidationError` de planeta.

---

### Camada RPC/REST

- Arquivo: `apps/server/src/rest/controllers/profile/users/VerifyUserSocialAccountController.ts`
- Diagnóstico: O controller executa a verificação de conta social no middleware do endpoint de sign-up social; em caso de conta existente, a requisição falha por conflito por design.

- Arquivo: `apps/web/src/rpc/actions/auth/SignUpWithSocialAccountAction.ts`
- Diagnóstico: A action já trata a falha de sign-up social e retorna `isNewAccount: false` com `signUpResponse`. Portanto, a mensagem `Conta social já em uso` é um estado de negócio esperado e paralelo ao erro que derruba a Space.

---

### Camada Drivers

- Arquivo: `apps/server/src/database/supabase/repositories/space/SupabasePlanetsRepository.ts`
- Diagnóstico: O repositório consulta campos derivados (`count_planet_completions`, `count_users_at_planet`, `count_users_at_star`, `count_star_unlocks`) que podem variar de tipo no retorno do Supabase/Postgres.

- Arquivo: `apps/server/src/database/supabase/mappers/space/SupabasePlanetMapper.ts`
- Diagnóstico: `completion_count` e `user_count` são repassados ao DTO sem normalização explícita, quebrando o contrato `PlanetDto` quando o retorno não vem como `number`.

- Arquivo: `apps/server/src/database/supabase/mappers/space/SupabaseStarMapper.ts`
- Diagnóstico: `user_count` e `unlock_count` também são repassados sem coerção/normalização, repetindo o mesmo risco para estrelas.

- Arquivo: `apps/server/src/database/supabase/mappers/ranking/SupabaseRankerMapper.ts`
- Diagnóstico: Já existe precedente no projeto de normalizar valores numéricos com `Number(...)`; o módulo Space está inconsistente com esse padrão.

---

**Plano de Correção (Spec):**

### 1. O que já existe? (Contexto/Impacto)
Liste recursos existentes da codebase que:
- Estão envolvidos no bug
- Serão reutilizados na correção
- Podem ser impactados indiretamente

- **[Camada Drivers]**
  - `[SupabasePlanetsRepository.findAll]` — Origem da consulta dos campos de contagem usados para construir o payload de planetas.
  - `[SupabasePlanetMapper.toDto]` — Ponto atual de transformação de `SupabasePlanet` para `PlanetDto`.
  - `[SupabaseStarMapper.toDto]` — Ponto atual de transformação de `SupabaseStar` para `StarDto`.

- **[Camada Core]**
  - `[Planet.create]` — Aplica validação de contrato de domínio para contagens de planeta.
  - `[Star.create]` — Aplica validação de contrato de domínio para contagens de estrela.
  - `[Integer.create]` — Regra central de número inteiro usada por todo o domínio.

- **[Camada UI]**
  - `[SpaceProvider]` — Materializa entidades de domínio para uso em estado/contexto.
  - `[Space page]` — Entrada de dados remotos da feature Space após autenticação.

---

### 2. O que deve ser criado?
Descreva novos recursos necessários **apenas se estritamente necessários**.

- **[Camada Drivers]**
  - `[normalizeNumericField util]` — Função utilitária para converter valores numéricos vindos do Supabase (`number | string | null`) para `number` válido com fallback seguro e previsível.

- **[Camada Testes]**
  - `[SupabasePlanetMapper tests]` — Cobertura para cenários com `"0"`, `"12"`, `null` e valores inválidos nos campos de contagem.
  - `[SupabaseStarMapper tests]` — Cobertura equivalente para os campos de contagem de estrelas.

---

### 3. O que deve ser modificado?
Liste mudanças pontuais em código existente, explicando o motivo da alteração.

- **[Camada Drivers]**
  - `[SupabasePlanetMapper.toDto]` — Normalizar `completion_count` e `user_count` antes de preencher `PlanetDto`, garantindo contrato numérico estável para o Core/UI.
  - `[SupabaseStarMapper.toDto]` — Normalizar `user_count` e `unlock_count` para evitar a mesma quebra em `Star.create`.
  - `[SupabasePlanet type / SupabaseStar type]` — Ajustar tipagem para refletir retorno real de dados (`number | string | null`) e evitar falsa sensação de segurança em compilação.

- **[Camada UI]**
  - `[SpaceProvider]` — Adicionar tratamento de falha controlado (telemetria + fallback visual) para não derrubar a aplicação inteira em caso de payload inesperado.

---

### 4. O que deve ser removido?
Liste código redundante, legado ou incorreto que deve ser eliminado como parte da correção.

- **[Camada Core]**
  - `[packages/core/src/space/domain/entities/Planet.ts]` — Remover `console.log(dto)` de depuração em `Planet.create`, pois gera ruído em produção e não agrega diagnóstico estruturado.
