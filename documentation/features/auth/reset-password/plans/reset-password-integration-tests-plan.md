spec: specs/reset-password-integration-tests-spec.md

## Pendencias (quando aplicavel)

Sem pendencias.


## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Confirmar o reuso dos contratos existentes de `core` e `validation` sem criar ou modificar artefatos nessas camadas | - | - |
| F3 | Implementar a suite Playwright de reset password no `web` e os ajustes minimos de UI necessarios para locators estaveis | F1 | - |

> **Estratégia de paralelismo:** sempre comece pelo core (domínio, structures e use cases). Nesta spec, F1 apenas consolida o contrato ja existente (`SessionDto`, `emailSchema`, `passwordSchema` e contratos REST atuais), sem gerar novos artefatos. Com isso validado, F3 executa toda a implementacao no `web`.


## Tabela de Dependencias de Tarefas

| Tarefa | Depende de | Libera | Camada |
| --- | --- | --- | --- |
| T3.1 | - | T3.2, T3.3 | web |
| T3.2 | T3.1 | T3.2t, T3.3 | ui |
| T3.2t | T3.2 | - | ui |
| T3.3 | T3.1, T3.2 | T3.4, T3.5 | web |
| T3.4 | T3.3 | T3.4t, T3.5 | ui |
| T3.4t | T3.4 | - | ui |
| T3.5 | T3.3, T3.4 | - | web |


## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Validar que a jornada reutiliza contratos existentes de dominio e validacao (`SessionDto`, `emailSchema`, `passwordSchema`) sem exigir novos artefatos em `packages/core` ou `packages/validation`. Essa fase formaliza que o contrato consumido pela suite Playwright ja existe e desbloqueia a implementacao integral em `web`.

### Tarefas

- [x] Nenhuma tarefa de implementacao nesta fase. A spec declara explicitamente que nao ha criacao, modificacao ou remocao de artefatos em `core`, `validation` ou `server`.


## F3 — Web: UI e Integração

**Objetivo:** Implementar a cobertura Playwright da jornada publicada de reset password no `web`, reutilizando `ServerMock(page)` e a infraestrutura test-only existente, e introduzir somente os ajustes minimos de UI necessarios para locators estaveis.

### Tarefas

- [x] **T3.1** — criar a base da suite Playwright com helpers locais e cenarios da solicitacao de e-mail
  - **Ref:** spec §5 — App Web (Testes de Rotas Playwright) e spec §5 — App Web (Playwright Cookie Helpers)
  - **Tipo:** `criar`
  - **Arquivo:** `apps/web/src/app/tests/auth/reset-password.test.ts` (novo)
  - **Depende de:** -
  - **Resultado observavel:** `reset-password.test.ts` registra defaults em `/api/tests/server`, navega para `/auth/reset-password` sem permissao temporaria e verifica formulario inicial, validacao de e-mail invalido sem request e `POST /auth/request-password-reset` com payload `{ email }`
  - **Camada:** `web`
  - **Rules:** `documentation/rules/web-app-routes-testing-rules.md`

- [x] **T3.2** — adicionar seletores estaveis ao estado inicial da pagina de reset password
  - **Ref:** spec §6 — `ResetPasswordPageView.tsx`
  - **Tipo:** `modificar`
  - **Arquivo:** `apps/web/src/ui/auth/widgets/pages/ResetPassword/ResetPasswordPageView.tsx`
  - **Depende de:** T3.1
  - **Resultado observavel:** `ResetPasswordPageView` expõe `testId` para formulario inicial, input de e-mail, CTA de envio e link de login, permitindo distinguir os elementos publicos exigidos pela suite
  - **Camada:** `ui`

- [x] **T3.2t** — testar os seletores e links do estado inicial de reset password
  - **Depende de:** T3.2
  - **Resultado observavel:** testes de `ResetPasswordPageView` passando, cobrindo renderizacao do formulario inicial, exposicao dos `testId` esperados e link `Já tem uma conta? Faça login` apontando para `/auth/sign-in`
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.3** — expandir a suite Playwright para confirmacao de token e acesso autorizado por cookies temporarios
  - **Ref:** spec §5 — App Web (Testes de Rotas Playwright) e spec §5 — App Web (Playwright Cookie Helpers)
  - **Tipo:** `modificar`
  - **Arquivo:** `apps/web/src/app/tests/auth/reset-password.test.ts`
  - **Depende de:** T3.1, T3.2
  - **Resultado observavel:** `reset-password.test.ts` chama `POST /auth/confirm-password-reset` com `{ token }`, verifica criacao e limpeza dos cookies temporarios via `BrowserContext`, valida redirects para `/auth/reset-password` e `/auth/sign-in?error=<slug>` e renderiza o estado autorizado com abertura do dialog de nova senha
  - **Camada:** `web`
  - **Rules:** `documentation/rules/web-app-routes-testing-rules.md`

- [x] **T3.4** — adicionar seletores estaveis ao dialog de nova senha e ao submit interno
  - **Ref:** spec §6 — `ResetPasswordFormDialog/index.tsx`
  - **Tipo:** `modificar`
  - **Arquivo:** `apps/web/src/ui/auth/widgets/pages/ResetPassword/ResetPasswordFormDialog/index.tsx`
  - **Depende de:** T3.3
  - **Resultado observavel:** `ResetPasswordFormDialog` expõe `testId` opcionais para campo `Nova senha`, campo `Confirme sua nova senha` e botao de submit do dialog, diferenciando o CTA que abre o modal do CTA que envia a redefinicao
  - **Camada:** `ui`

- [x] **T3.4t** — testar os seletores e a abertura do dialog de redefinicao
  - **Depende de:** T3.4
  - **Resultado observavel:** testes de `ResetPasswordFormDialog` passando, cobrindo abertura do dialog `Insira sua nova senha`, exposicao dos `testId` dos campos de senha e presenca do botao interno `Redefinir senha`
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.5** — concluir a suite Playwright com cenarios de redefinicao, sucesso final e falha
  - **Ref:** spec §5 — App Web (Testes de Rotas Playwright) e spec §3.1 — Funcionais
  - **Tipo:** `modificar`
  - **Arquivo:** `apps/web/src/app/tests/auth/reset-password.test.ts`
  - **Depende de:** T3.3, T3.4
  - **Resultado observavel:** `reset-password.test.ts` valida politica minima e confirmacao divergente no dialog, envia `PATCH /auth/reset-password` com `{ newPassword, accessToken, refreshToken }`, confirma `DELETE /auth/sign-out`, verifica mensagem de sucesso com retorno para `/auth/sign-in` por botao, `Escape` e clique fora, e mantem o fluxo autorizado com erro `Erro de redefinição, escolha outra senha` quando o reset falha
  - **Camada:** `web`
  - **Rules:** `documentation/rules/web-app-routes-testing-rules.md`
