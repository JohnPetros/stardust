# Página de desafios

## Objetivo

Implementar a página de desafios no sistema para visualização.

## Status: Concluído

## Core

- Use `ChallengingService`, interface do service para o módulo de challenging
- Use `ChallengeDto`, dto usado para criar uma entidade `Challenge`
- Use `Challenge`, entidade que representa um desafio

## Camada App

- Crie e configure a rota (`ChallengesRoute`) que vai renderizar a página de desafios. Não precisa de loader
- Use o caminho `/challenging` para a rota e registre-o na constante `routes` no arquivo `routes.ts` do React Router

## Camada UI

### `ChallengesPage`

- Adicione na constant `ENV` a propriedade `webAppUrl` que deve conter a URL da aplicação web
- Crie o widget que vai renderizar a página de desafios
- Transforme o widhet `ChallengesListTab` em um widget global chamado `ChallengesTable`, mantendo as colunas atuais. Use a tabela para listar os desafios em forma de tabela, tanto na página de desafios quanto na página de dashboard
- Importe e use o widget `ChallengesTable` em `ChallengesRoute`
- Modifique o widget `ChallengesTable`, adicionando a coluna link que deve levar para a página de desafio da aplicação web: `${ENV.webAppUrl}/challenging/challenges/${challenge.slug.value}`
- Coloque filtros:
  - Filtro de search através de um text input
  - Select para filtro de dificuldade
  - Filtro por tags, exbida esse filtro como popover
  - Não coloque botão para fazer o filtro, deve ser automático

## Fluxo de usuário

### Acesso externo à aplicação web

1. O usuário acessa a página de desafios
2. O usuário vê a lista de desafios
3. O usuário clica em um desafio
4. O usuário é redirecionado para a página de desafio na aplicação web

### Filtros

1. O usuário acessa a página de desafios
2. O usuário vê os filtros
3. O usuário seleciona um filtro
4. O usuário vê a lista de desafios filtrados automaticamente
