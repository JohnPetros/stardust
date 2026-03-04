# PRD - Gerenciamento de Fontes de Desafios

## Contexto
Disponibilizar no StarDust Studio uma pagina administrativa para gerenciar fontes de desafios, com listagem paginada, busca por titulo do desafio vinculado, criacao, exclusao e reordenacao.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/12

## Objetivos
- Centralizar a gestao de `challenge_sources` no Studio com fluxo CRUD essencial (create/list/delete).
- Garantir vinculo 1:1 entre `challenge` e `challenge_source` com erro de dominio claro para conflitos.
- Permitir reorganizacao da ordem de exibicao das fontes com persistencia no backend.
- Exibir URLs de origem e URL publica do desafio para auditoria e operacao rapida.

## Escopo entregue
- Studio UI: pagina `ChallengeSources` com tabela, busca com debounce, paginacao, criacao via dialog e exclusao com confirmacao.
- Studio REST: metodos de `fetchChallengeSourcesList`, `createChallengeSource`, `deleteChallengeSource` e `reorderChallengeSources`.
- Server Hono: novo `ChallengeSourcesRouter` com rotas de listagem, criacao, exclusao e reordenacao.
- Server REST controllers: handlers dedicados para os quatro fluxos de challenge sources.
- Core: entidade/DTO de `ChallengeSource` alinhados, repositorio dedicado, erros de dominio e use cases de list/create/delete/reorder.
- Database/Supabase: repository, mapper, type e atualizacao de `Database.ts` com `challenge_sources`.
- Validation: novo `challengeSourceSchema` e export nos barrels.

## Checklist de requisitos
- [x] Listagem paginada de fontes no Studio.
- [x] Busca por titulo do desafio vinculado com debounce de 500ms.
- [x] Colunas de URL de origem, URL do desafio, desafio vinculado, status de uso e acoes.
- [x] URL do desafio composta com `ENV.stardustWebAppUrl` + `slug`.
- [x] Estado de loading e estado vazio na listagem.
- [x] Dialog de criacao com campos `url` e `challengeId` obrigatorios.
- [x] Validacao de URL com Zod e validacao de IDs com `idSchema`.
- [x] Regra 1:1 (`challengeId` unico em source) com erro tratavel na UI sem fechar o dialog.
- [x] Exclusao com confirmacao explicita e feedback visual de sucesso/erro.
- [x] Reordenacao com atualizacao otimista e rollback em caso de falha.
- [x] Endpoints protegidos por autenticacao + permissao de conta `god`.
- [x] Pagina registrada em rota dedicada e acessivel via Sidebar em "Desafios de codigo > Fontes".

## Decisoes finais de implementacao
- Reordenacao foi entregue por controles de mover para cima/baixo (sem drag and drop), mantendo endpoint dedicado e persistencia otimista.
- Ordenacao da listagem no backend foi fixada por `position` ascendente para manter previsibilidade da tabela.
- Foram adicionados testes unitarios para core e studio desse fluxo, alem do escopo originalmente previsto.

## Validacao final
- [x] `npm run codecheck` na raiz.
- [x] `npm run test` na raiz.

## Status
**Concluido**

## Ultima atualizacao
2026-03-04
