# Link para desafio de uma estrela

## Objetivo

- [x] Criar um link funcional que levará para a página de desafio de uma estrela na aplicação web.

## Core

- [x] Use `Star` entidade que representa uma estrela
- [x] Atualizar `NavigationProvider`, interface responsável em lidar com navigação para incluir `openExternal(url: string)`

## Camada UI 

### `StarItem`

- [x] Crie um botão que no hook `useStarItem` fará a busca do desafio da estrela via `challengingService.fetchChallengeByStarId`.
- [x] Caso de sucesso (desafio existe), leve o usuário para a página edição de desafio: `${ENV.webAppUrl}/challenging/challenge/<challengeSlug>`.
- [x] Caso de fracasso, leve para página de criação de desafio: `${ENV.webAppUrl}/challenging/challenge`.
- [x] Lembre-se que os links citados levam para a aplicação web (usando o recém adicionado `ENV.webAppUrl`) e não para a aplicação de studio.

### `useNavigationProvider`

- [x] Assegure que o provider consiga lidar com aplicações externas via `openExternal`.
- [x] Implementar em ambas aplicações (`studio` e `web`).

## Fluxo de usuário

1. [x] Acessa a página de planetas
2. [x] Abre a aba de estrelas de um planeta
3. [x] Vê se a estrela é um desafio ou não
4. [x] Se for um desafio e o desafio de fato existe, abre a página de edição de desafio na aplicação web
5. [x] Se for um desafio e o desafio de fato não existe, abre a página de criação de desafio na aplicação web

