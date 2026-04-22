# PRD - Challenges Management With MCP

## Contexto
Entregar um ponto unico de integracao MCP no `server` para que engenheiros consigam criar, listar, atualizar e excluir desafios do StarDust com autenticacao por API key, sem depender da interface web e sem abrir acesso administrativo amplo a outros modulos.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/26

## Objetivos
- Permitir integracao externa autenticada para gestao de desafios pelo protocolo MCP.
- Garantir que apenas usuarios com insignia de Engenheiro consigam operar o fluxo.
- Manter criacao e edicao de desafios consistentes com as regras ja existentes do dominio `challenging`.
- Reduzir risco operacional forcando criacao inicial como rascunho e mantendo ownership por autor.

## Escopo entregue
- Server: endpoint MCP HTTP unico em `/mcp` dentro do `HonoApp`, protegido por `X-Api-Key`.
- Server/Core: autenticacao de API key por hash SHA-256, com bloqueio para chaves invalidas ou revogadas.
- Server: validacao adicional de insignia de Engenheiro antes de liberar o MCP.
- AI/Server: toolkit MCP do dominio `challenging` com tools para instrucoes de criacao, listagem, criacao em rascunho, atualizacao, exclusao, categorias e problema em cache.
- Core/Database: reutilizacao dos use cases e contratos existentes com novo lookup de API key por hash.
- Produto: desafios criados via MCP passam a nascer privados e vinculados ao engenheiro autenticado.

## Checklist de requisitos
- [x] Expor um endpoint MCP HTTP unico em `/mcp`.
- [x] Autenticar o MCP com API key enviada em `X-Api-Key`.
- [x] Restringir o acesso a usuarios com insignia de Engenheiro.
- [x] Disponibilizar instrucoes oficiais de criacao antes do fluxo de mutacao.
- [x] Permitir listar desafios com filtros e paginacao no catalogo publico.
- [x] Permitir criar desafio sempre como rascunho e com autoria da conta autenticada.
- [x] Permitir consultar o problema de desafio em cache para apoiar criacao e edicao.
- [x] Permitir atualizar apenas desafios do proprio autor, incluindo mudanca de `isPublic`.
- [x] Permitir excluir apenas desafios do proprio autor com confirmacao explicita.

## Decisoes finais de implementacao
- A autenticacao da API key ficou no modulo `auth`, enquanto a verificacao de insignia permaneceu na borda do `server`, preservando os limites entre dominio e aplicacao.
- O MCP reutiliza os use cases e repositorios existentes para evitar duplicacao de regra de negocio e manter o contrato alinhado ao REST.
- A criacao continua privada por padrao para reduzir risco de publicacao acidental durante fluxos assistidos por IA.

## Validacao final
- [x] `npm run codecheck` na raiz.
- [x] `npm run typecheck` na raiz.
- [x] `npm run test` na raiz.

## Status
**Concluido**

## Ultima atualizacao
2026-04-21
