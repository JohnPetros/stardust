# Endpoints de incrementar de contagem de mensagens de assistente

## Objetivo

É necessário verificar se o usuário tem excedido o limite de mensagens de
assistente. Se ele já exceder o limite, deve-se retornar um erro.

status: Concluído

## Core

- `IncrementAssistantChatMessageCountUseCase`, use case
- `CacheProvider`, interface para lidar com o cache

## Camada REST

### IncrementAssistantChatMessageCountController

- Crie o controller e use o use case IncrementAssistantChatMessageCountUseCase
- Retorne o response do use case com status code 204 `statusNoContent()`

- Pegue o id do usuário com `getAccount` do `http`

### ChatsRouter

- O caminho da rota deve ser `/conversation/chats/assistant`
- O método deve ser `PATCH`
- Use a implementação do Upstash como cache provider
