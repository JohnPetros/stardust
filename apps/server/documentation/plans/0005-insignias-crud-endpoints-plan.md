# Enpoints de CRUD de Insignias

## Objetivo

Implementar a rota/controller para cada operação de criação, atualização e
remoção de insignia.

módulo: `shop`

## Camada Core

- Use o use case `CreateInsigniaUseCase` para criar uma insignia.
- Use o use case `UpdateInsigniaUseCase` para atualizar uma insignia.
- Use o use case `DeleteInsigniaUseCase` para deletar uma insignia.
- Implemente os métodos necessários no repository `InsigniasRepository`
- `InsigniaDto` deve ser usado para criar e atualizar uma insignia, isto é, a entidade `Insignia` deve ser criada com o `InsigniaDto`.


## Camada REST

- Crie o controller para cada use case.
- Crie a rota para cada controller.

## Camada Banco de Dados

- Implemente os métodos necessários no repository `InsigniasRepository` utilizados nos use cases citados acima.

## Camada de validação

- Crie o schema zod para insignia se não existir.
- Use o schema zod para validar os dados da requisição se necessário.
