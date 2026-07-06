---
app: web
scope: feature lesson (Lesson Page + fluxo de áudio da Story e reward de conclusão de estrela)
status: open
last_updated_at: 2026-07-06
prd: https://github.com/JohnPetros/stardust/milestone/23
---

# Relatório de Segurança — web

## Resumo Executivo

- **Total de findings:** 3
  - Critical: 0
  - High: 1
  - Medium: 0
  - Low: 2
  - Info: 0
- **Área de maior risco:** Fronteira cliente → RPC no fluxo de reward, onde valores que determinam a recompensa são controlados pelo cliente.
- **Ação imediata recomendada:** Recalcular a recompensa da estrela no servidor a partir do estado real do quiz (não confiar em `questionsCount`/`incorrectAnswersCount` vindos de cookie).
- **Confiança geral da revisão:** média-alta.

> **Nota (2026-07-06):** A listagem de arquivos via `GET /storage/files` sem autenticação foi avaliada e **descartada como finding**: confirmado com o time que os arquivos de storage são **públicos por design** (bucket único `stardust-bucket` servido via CDN pública), portanto enumerar nomes de assets públicos não constitui vazamento. Os backups de banco são enviados ao **Dropbox** (`DropboxStorageProvider`), não ao bucket público do Supabase.

---

## Escopo Revisado

| Item | Valor |
|------|-------|
| Aplicação | `web` (com apoio de `server` e `core`) |
| Escopo | Feature `lesson` — Lesson Page, áudio persistido da Story (spec speaker-revival) e reward de conclusão de estrela |
| Alvos | `apps/web/src/ui/lesson/`, `apps/web/src/rpc/actions/lesson/`, `apps/web/src/rpc/actions/rewarding/`, `apps/web/src/ui/global/widgets/components/Mdx/`, `apps/web/src/ui/global/widgets/components/Speaker/`, `apps/server/src/app/hono/routers/storage/`, `apps/server/src/app/hono/routers/lesson/`, `packages/core/src/profile/use-cases/` |
| Contexto da mudança | Reativação do Speaker da Story com áudio persistido (`speaker-revival-spec.md`, milestone #23) |
| Foco prioritário | Autenticação, autorização, exposição de dados, validação de inputs no fluxo da Lesson Page |

---

## Modelo de Ameaça

### Atores

- **Usuário anônimo:** sem sessão; alcança rotas REST que não exigem middleware de auth.
- **Usuário autenticado (aluno):** possui sessão válida e controla o cliente (browser, cookies, chamadas de Server Action).
- **Editor/God:** autor de blocos de texto e áudio da Story via `studio`/`server` (rotas protegidas por `verifyGodAccount`).
- **Atacante com conta válida:** aluno legítimo que manipula payloads client-side para obter vantagem.

### Ativos Protegidos

- Saldo de moedas, XP, nível e streak do usuário (economia do jogo).
- Conteúdo renderizado na Story (integridade do HTML exibido ao aluno).

### Fronteiras de Confiança

- Cliente → RPC (Server Actions `next-safe-action`).
- Cliente → REST (Hono no `apps/server`).
- REST → Core (use cases de reward).
- Core → Database/Storage (Supabase com RLS).

### Operações Sensíveis

- Concessão de recompensa (escrita privilegiada na conta do próprio usuário).
- Listagem de arquivos de storage (leitura potencialmente sensível).
- Renderização de conteúdo autorado como HTML.

---

## Findings

### [ISSUE-01] Recompensa da estrela é calculada a partir de payload controlado pelo cliente

- **Severidade:** 🟠 High
- **Status da Evidência:** confirmado
- **Confiança:** alta
- **Camada:** rpc + core
- **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/useLessonPage.ts`, `apps/web/src/rpc/next-safe-action/cookieActions.ts`, `apps/web/src/rpc/actions/rewarding/AccessStarRewardingPageAction.ts`, `packages/core/src/profile/use-cases/CalculateRewardForStarCompletionUseCase.ts`
- **Linha(s):** `useLessonPage.ts` 76-90; `cookieActions.ts` 7-23; `AccessStarRewardingPageAction.ts` 26-34; `CalculateRewardForStarCompletionUseCase.ts` 80-108
- **Descrição:** Ao concluir o quiz, o cliente monta o `StarRewardingPayload` (`questionsCount`, `incorrectAnswersCount`, `secondsCount`, `starId`) e o grava num cookie via a action `setCookie`, que usa o `actionClient` **não autenticado** e apenas valida tipos. A página de rewarding lê esse cookie, faz `JSON.parse` e o repassa ao servidor, que calcula moedas/XP **diretamente** a partir de `questionsCount` e `incorrectAnswersCount`, sem revalidar contra o quiz real da estrela. Um aluno pode forjar o cookie com `questionsCount` alto e `incorrectAnswersCount = 0` para inflar a recompensa.
- **Evidência:**

  ```ts
  // useLessonPage.ts — payload montado no cliente
  const rewardingPayload: StarRewardingPayload = {
    questionsCount: quiz.questionsCount,
    incorrectAnswersCount: quiz.incorrectAnswersCount.value,
    secondsCount: Number(secondsCounter.get()),
    starId,
  }
  await setCookie({ key: COOKIES.keys.rewardingPayload, value: JSON.stringify(rewardingPayload) })
  ```

  ```ts
  // CalculateRewardForStarCompletionUseCase.ts — usa a contagem recebida sem validar
  let increase = questionsCount * CalculateRewardForStarCompletionUseCase.COINS_INCREASE_BASE
  if (isNextStarUnlocked) increase /= 2
  const decrease = (increase / questionsCount) * incorrectAnswersCount
  const coins = increase - decrease
  ```

- **Cenário de Exploração:** Um aluno autenticado seta manualmente o cookie `rewardingPayload` (ou chama a Server Action `accessRewardForStarCompletionPage`) com `questionsCount` arbitrariamente grande e `incorrectAnswersCount = 0`, então acessa `/rewarding/star`. O servidor concede moedas/XP proporcionais ao valor forjado. Como o cookie é reconstituível, o efeito pode ser repetido.
- **Pré-condições:** Conta autenticada válida. Nenhuma permissão especial.
- **Impacto:** Elevação de recompensa/economia: concessão ilimitada de moedas, XP, níveis e streak, corrompendo ranking e progressão.
- **Recomendação:** Derivar `questionsCount` no servidor a partir do número real de perguntas da estrela (`starId`) e validar `incorrectAnswersCount <= questionsCount`. Não confiar em contagens vindas do cliente para cálculo de recompensa. Alternativamente, persistir o resultado do quiz no servidor durante a resolução e usá-lo como fonte de verdade.
- **Referência:** `documentation/rules/rpc-layer-rules.md`, `documentation/rules/core-package-rules.md`

---

### [ISSUE-02] Conteúdo de bloco da Story renderizado via `dangerouslySetInnerHTML` após decodificação

- **Severidade:** 🟢 Low
- **Status da Evidência:** suspeita
- **Confiança:** média
- **Camada:** ui
- **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/Content/ContentView.tsx`, `apps/web/src/ui/global/widgets/components/Mdx/formatSpecialCharacters.ts`, `apps/web/src/ui/global/widgets/components/Mdx/special-characters.ts`
- **Linha(s):** `ContentView.tsx` 47, 61; `special-characters.ts` 1-9
- **Descrição:** O conteúdo textual do bloco é passado por `formatSpecialCharacters(content, 'decode')` — que reconverte `@less-than`/`@greater-than`/`@quote-mark` de volta em `<`, `>`, `"` — e então injetado com `dangerouslySetInnerHTML`. Se o conteúdo autorado contiver HTML, o passo de decode reintroduz a marcação bruta no DOM, configurando um sink de XSS armazenado.
- **Evidência:**

  ```tsx
  const formattedContent = formatSpecialCharacters(String(content), 'decode')
  // ...
  <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
  ```

- **Cenário de Exploração:** Um autor com acesso ao `studio` insere conteúdo com `<img src=x onerror=...>` num bloco da Story; ao ser renderizado na Lesson Page, o handler executa no navegador de qualquer aluno.
- **Pré-condições:** Capacidade de autorar blocos de texto (editor/god). Não é explorável por aluno comum, o que reduz a severidade.
- **Impacto:** XSS armazenado atingindo alunos que abrirem a lição afetada, caso o pipeline de autoria não sanitize HTML.
- **Recomendação:** Sanitizar `formattedContent` antes de injetar (ex.: allowlist de tags ou DOMPurify), ou evitar `dangerouslySetInnerHTML` renderizando apenas os elementos suportados de forma controlada. Este ponto é pré-existente ao speaker-revival, mas permanece no fluxo de renderização da Story.
- **Referência:** `documentation/rules/ui-layer-rules.md`

---

### [ISSUE-03] `audioFileName`/`audioStatus` interpolados na string MDX sem escape

- **Severidade:** 🟢 Low
- **Status da Evidência:** suspeita
- **Confiança:** baixa
- **Camada:** ui
- **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/hooks/useMdx.ts`
- **Linha(s):** 49-56
- **Descrição:** Ao serializar blocos para MDX, `title` é passado por `formatSpecialCharacters(..., 'encode')`, mas `audioFileName` e `audioStatus` são interpolados diretamente entre aspas simples (`audioFileName={'${audioFileName}'}`). Um `fileName` contendo aspas simples ou chaves poderia quebrar o atributo e alterar a árvore MDX processada por `markdown-to-jsx`.
- **Evidência:**

  ```ts
  return `${parsedDefaultProps} audioFileName={'${audioFileName}'} audioStatus={'${audioStatus}'}`.trim()
  ```

- **Cenário de Exploração:** Um nome de arquivo malicioso em `audios/story` (ex.: contendo `'`) seria refletido na string MDX sem escape. O risco é mitigado porque o valor só é incluído quando `audioFiles?.[audioFileName] === true` (arquivo realmente existe no storage) e os nomes são gerados pelo fluxo administrativo de TTS.
- **Pré-condições:** Controle sobre nomes de arquivos persistidos em `audios/story` (fluxo god/editor).
- **Impacto:** Baixo; potencial quebra de renderização/injeção de props MDX em cenário controlado por administrador.
- **Recomendação:** Aplicar o mesmo `formatSpecialCharacters(..., 'encode')` (ou escape equivalente) a `audioFileName` antes da interpolação, mantendo consistência com o tratamento de `title`.
- **Referência:** `documentation/rules/ui-layer-rules.md`

---

## Pendências

| ID      | Pergunta | Arquivo/Área | Por que bloqueia a classificação |
| ------- | -------- | ------------ | -------------------------------- |
| PEND-01 | A rota `PUT /users/:userId/reward/star` valida que `:userId` é o próprio usuário autenticado, ou confia apenas na RLS da tabela `users`? | `apps/server/src/rest/controllers/profile/users/RewardUserForStarCompletionController.ts` (usa `userId` do route param), `apps/server/src/app/hono/routers/profile/UsersRouter.ts` | O `userId` vem do parâmetro de rota, não do account autenticado; o isolamento depende de RLS que não pôde ser confirmada no código. |

---

## Áreas Revisadas Sem Findings

| Área | Arquivos | Observação |
| ---- | -------- | ---------- |
| Actions RPC da lição com schema Zod no composition root | `apps/web/src/rpc/next-safe-action/lessonActions.ts`, `rewardingActions.ts` | Usam `authActionClient` e validam entrada com `idSchema`/`integerSchema`. |
| Rotas administrativas de áudio/text-blocks | `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts` | Escrita/geração/cancelamento de áudio protegidos por `verifyAuthentication` + `verifyGodAccount`. |
| Construção de URL pública do áudio | `apps/web/src/ui/global/hooks/useFileStorage.ts`, `apps/web/src/ui/global/widgets/components/Speaker/index.tsx`, `useSpeaker.ts` | Pasta fixa (`createAsAudiosStory()`), sem pasta dinâmica via MDX; falha de `play()` tratada sem quebrar a Story. |
| Job de geração de áudio | `apps/server/src/queue/jobs/storage/GenerateTextBlockAudioJob.ts` | Verifica cancelamento antes e depois da geração e refaz o fetch do bloco; sem exposição de segredo. |
| Página de rewarding (leitura de cookie no servidor) | `apps/web/src/app/rewarding/star/page.tsx`, `AccessStarRewardingPageAction.ts` | Retorna 404 quando o cookie não existe; problema real é a origem do payload (ver ISSUE-01), não o guard de rota. |

---

## Recomendações Priorizadas

| # | Ação | Finding(s) | Severidade | Esforço |
| - | ---- | ---------- | ---------- | ------- |
| 1 | Recalcular a recompensa da estrela no servidor a partir do quiz real; não confiar em contagens do cookie | ISSUE-01 | High | M |
| 2 | Sanitizar o HTML injetado via `dangerouslySetInnerHTML` no `ContentView` | ISSUE-02 | Low | M |
| 3 | Escapar `audioFileName`/`audioStatus` na serialização MDX | ISSUE-03 | Low | S |
| 4 | Confirmar/ajustar validação de `:userId` no reward | PEND-01 | — | S |

---

## Checklist de Verificação Pós-Correção

- [ ] `npm run codecheck` passa na raiz do monorepo
- [ ] `npm run typecheck` passa no workspace afetado
- [ ] `npm run test` passa no workspace afetado
- [ ] Reward recalculado no servidor com testes cobrindo payload inflado (ISSUE-01)
- [ ] Conteúdo da Story com HTML malicioso é sanitizado antes de renderizar (ISSUE-02)
- [ ] `audioFileName` com caracteres especiais não quebra o MDX (ISSUE-03)
- [ ] Nenhuma variável de ambiente real está exposta
- [ ] Nenhum `console.log` de debug permanece em código de produção
- [ ] Middleware de auth aplicado em todas as rotas afetadas
- [ ] DTOs de resposta retornam apenas os campos necessários

---

## Referências

- `documentation/architecture.md`
- `documentation/rules/rules.md`
- `documentation/rules/ui-layer-rules.md`
- `documentation/rules/rpc-layer-rules.md`
- `documentation/rules/rest-layer-rules.md`
- `documentation/rules/core-package-rules.md`
- `documentation/rules/provision-layer-rules.md`
- `documentation/features/lesson/lesson-page/specs/speaker-revival-spec.md`
