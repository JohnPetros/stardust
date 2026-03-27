# PRD - Gerenciamento de Fontes de Desafios

## Contexto
Disponibilizar no StarDust Studio uma pagina administrativa para gerenciar fontes de desafios, com listagem paginada, busca por titulo do desafio vinculado, criacao, edicao, exclusao e reordenacao.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/12

## Objetivos
- Centralizar a gestao de `challenge_sources` no Studio com fluxo CRUD essencial (create/read/update/delete).
- Garantir vinculo 1:1 entre `challenge` e `challenge_source` com erro de dominio claro para conflitos.
- Permitir cadastrar fontes sem vinculo obrigatorio de desafio, reduzindo friccao operacional para ingestao inicial.
- Permitir reorganizacao da ordem de exibicao das fontes com persistencia no backend.
- Exibir URLs de origem e URL publica do desafio para auditoria e operacao rapida.

## Escopo entregue
- Studio UI: pagina `ChallengeSources` com tabela, busca com debounce, paginacao, criacao/edicao via dialog reutilizado e exclusao com confirmacao.
- Studio REST: metodos de `fetchChallengeSourcesList`, `createChallengeSource`, `updateChallengeSource`, `deleteChallengeSource` e `reorderChallengeSources`.
- Server Hono: `ChallengeSourcesRouter` com rotas de listagem, criacao, atualizacao, exclusao e reordenacao, todas protegidas por autenticacao e permissao `god`.
- Server REST controllers: handlers dedicados para os cinco fluxos de challenge sources.
- Core: entidade/DTO de `ChallengeSource` com `challenge` opcional, erros de dominio e use cases de list/create/update/delete/reorder.
- Database/Supabase: repository, mapper, type e atualizacao de `Database.ts` com `challenge_sources`.
- Validation: `challengeSourceSchema` atualizado para aceitar `challengeId` opcional/nullable.

## Checklist de requisitos
- [x] Listagem paginada de fontes no Studio.
- [x] Busca por titulo do desafio vinculado com debounce de 500ms.
- [x] Colunas de URL de origem, URL do desafio, desafio vinculado, status de uso e acoes.
- [x] URL do desafio composta com `ENV.stardustWebAppUrl` + `slug`.
- [x] Estado de loading e estado vazio na listagem.
- [x] Dialog unico de criacao/edicao com campos `url` e `challengeId` opcional.
- [x] Acao de editar por linha na tabela de fontes.
- [x] Fallback de exibicao para fontes sem desafio vinculado.
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
**closed**

## Ultima atualizacao
2026-03-05
