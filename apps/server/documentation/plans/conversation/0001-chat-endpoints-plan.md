# Endpoints de conversação por chat

## Objetivo

Criar controller/rota para listar mensagens de um chat, criar uma mensagem de um
chat, editar o nome de um chat e deletar um chat.

status: Concluído

## Core

- Chat, entidade que representa um chat
- ChatsRepository, repositório de chats
- ChatMessage, entidade que representa uma mensagem de um chat
- ListChatMessagesUseCase, use case que lista as mensagens de um chat
- SendChatMessageUseCase, use case que envia uma mensagem para um chat
  (anteriormente CreateChatMessageUseCase)
- EditChatNameUseCase, use case que edita o nome de um chat
- DeleteChatUseCase, use case que deleta um chat

## Camada REST

### FetchChatMessagesController

- Crie o controller e use o use case ListChatMessagesUseCase
- Retorne o response do use case com status code 200
- O caminho da rota deve ser `/conversation/chats/:chatId/messages`
- O método deve ser `GET`
- Pegue o id do usuário com `getAccount` do `http`

### SendChatMessageController

- Crie o controller e use o use case SendChatMessageUseCase
- Retorne o response do use case com status code 201
- O caminho da rota deve ser `/conversation/chats/:chatId/messages`
- Recupere o dto de mensagem do body
- Recupere o id do chat dos route params
- O método deve ser `POST`

### EditChatNameController

- Crie o controller e use o use case EditChatNameUseCase
- Retorne o response do use case com status code 200
- O caminho da rota deve ser `/conversation/chats/:chatId/name`
- Recupere o id do chat dos route params
- Recupere o novo nome chat do body
- O método deve ser `PATCH`

### DeleteChatController

- Crie o controller e use o use case DeleteChatUseCase
- Retorne o response do use case com status code 200
- O caminho da rota deve ser `/conversation/chats/:chatId`
- Recupere o id do chat dos route params
- O método deve ser `DELETE`

## Camada de banco de dados

- Crie o repositório `SupabaseChatsRepository` que implementa `ChatsRepository`
- Use a tabela `chats` para armazenar os chats
- Use a tabela `chat_messages` para armazenar as mensagens
- Crie o mapper `SupabaseChatMapper` para converter entre entidade e banco
- Crie o mapper `SupabaseChatMessageMapper` para converter entre estrutura e
  banco
- Defina os tipos `SupabaseChat` e `SupabaseChatMessage` baseados no generated
  types do Supabase
