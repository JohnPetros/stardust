# PRD - API Keys Manager

## Contexto
Entregar um gerenciador de API keys dentro do perfil do usuario para permitir integracoes externas com o StarDust sem depender de credenciais de uso humano, mantendo controle de acesso, revogacao e exibicao segura do segredo.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/27

## Objetivos
- Permitir que usuarios com insignia de Engenheiro gerem credenciais para scripts, CLIs e integracoes externas.
- Garantir que o segredo completo seja exibido apenas uma vez, reduzindo risco operacional e de seguranca.
- Dar autonomia para renomear e revogar chaves sem suporte manual.
- Centralizar o acesso ao recurso dentro da area privada do perfil.

## Escopo entregue
- Web: nova pagina privada em `/profile/[userSlug]/api-keys` com acesso restrito ao proprio usuario engenheiro.
- Web: gerenciador com estados de carregamento, lista, vazio, criacao com exibicao unica do segredo, renomeacao e revogacao sem recarregar a pagina.
- Web: novo atalho no perfil para abrir o gerenciador de API keys.
- Server: endpoints autenticados em `/auth/api-keys` para listar, criar, renomear e revogar chaves.
- Core e banco: modelo de API key com persistencia segura usando hash e preview mascarado, sem armazenar o segredo completo.

## Checklist de requisitos
- [x] Disponibilizar uma pagina dedicada para gerenciamento de API keys no perfil.
- [x] Restringir o acesso da pagina ao proprio usuario autenticado com insignia de Engenheiro.
- [x] Permitir criar API keys informando apenas um nome.
- [x] Exibir o segredo completo apenas na resposta de criacao.
- [x] Persistir somente hash e preview da chave no backend.
- [x] Listar apenas API keys ativas do usuario, em ordem decrescente de criacao.
- [x] Permitir renomear apenas chaves do proprio usuario.
- [x] Permitir revogar apenas chaves do proprio usuario com remocao imediata da listagem ativa.
- [x] Exibir atalho de acesso ao gerenciador na area de links do perfil.

## Decisoes finais de implementacao
- O consumo no web foi mantido no `AuthService`, evitando fragmentar a fronteira REST do modulo `auth`.
- A listagem publica exposta ao frontend foi limitada aos dados seguros da chave, preservando apenas identificacao, preview e data de criacao.
- A revogacao foi mantida como soft delete para impedir reexibicao em listagens sem perder rastreabilidade no banco.

## Validacao final
- [x] `npm run codecheck` na raiz.
- [x] `npm run typecheck` na raiz.
- [x] `npm run test` na raiz.

## Status
**Concluido**

## Ultima atualizacao
2026-04-18
