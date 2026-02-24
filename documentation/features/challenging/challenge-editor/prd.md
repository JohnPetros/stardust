# PRD - God User Permission for Challenge Editor

## Contexto
Permitir que usuarios com insignia `god` gerenciem desafios de terceiros no Challenge Editor e na Challenge Page, mantendo a regra de mascaramento de acesso (`404`) para nao autorizados.

## Objetivos
- Permitir gerenciamento de desafio por `autor OU god`.
- Evitar vazamento de existencia de desafio para usuarios sem permissao.
- Manter autoria original ao editar como administrador.
- Exibir contexto administrativo na UI ao gerenciar desafio de terceiro.

## Escopo entregue
- Backend (Hono/REST): middlewares e controller de permissao para `POST/PUT/DELETE`.
- Frontend RPC: actions ajustadas para permitir `god` onde aplicavel.
- Frontend UI: estados e mensagens de contexto administrativo.
- Core: helpers de role para checks sem duplicacao.
- Testes: cobertura do novo controller de permissao.

## Checklist de requisitos
- [x] `POST /challenging/challenges` aceita `engineer OU god`.
- [x] `PUT/DELETE /challenging/challenges/:challengeId` validam `autor OU god` antes do controller final.
- [x] Nao autorizado recebe erro mascarado (404) sem vazar existencia.
- [x] `AccessChallengeEditorPageAction` permite `isAuthor || isGod`.
- [x] `AccessChallengePageAction` permite `god` em desafio privado de terceiros.
- [x] UI exibe controles de gerenciamento quando `canManageChallenge`.
- [x] UI sinaliza contexto administrativo quando `god` gerencia desafio de terceiro.
- [x] Update por admin preserva `author.id` original.
- [x] Testes do controller de permissao criados e passando.

## Validacao final
- [x] `npm run codecheck` na raiz.
- [x] `npm run test` na raiz.

## Status
**Concluido**

## Ultima atualizacao
2026-02-24
