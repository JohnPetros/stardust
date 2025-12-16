# Criação de avatar

## Objetivo

Implementar funcionalidade de criação de avatar no sistema na página de gestão
de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- Interface `ShopService` possui o método `createAvatar` para criar um avatar.
- `AvatarDto` é usado para representar um avatar.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- Implemente o método `createAvatar` no service `ShopService`.

### Camada UI

- Crie widget de formulário `AvatarForm` para criar um avatar.
- O formulário deve ser exibido em um dialog ao apertar o botão de
  `Criar avatar`, que deve ficar acima da tabela de avatars.
- O formulário deve conter os campos:
  - Nome (TextInput)
  - Imagem (ImageInput)
  - Preço (NumberInput) que tem mín. 0 e é um número inteiro
  - Checkbox para definir se é um avatar adquirido pelo usuário por padrão
    quando ele cria a sua conta na plataforma
  - Checkbox para definir se é um avatar já é o primeiro selecionado pelo
    usuário por padrão quando ele cria a sua conta na plataforma
- Use o react hook form para criar o formulário.
- Use zod para validação dos dados.
- Use o service `ShopService` para criar o avatar no hook do `AvatarsTable`.
- Inspire-se no widget `AchievementForm`.
- Use o `ToastProvider` para exibir mensagens de sucesso ou erro ao criar o
  avatar no hook do `AvatarsTable`.
- Exiba loading na tabela enquanto o avatar é criado.
- Obs. adicione as colunas na tabela `AvatarsTable` para exibir se o avatar é
  adquirido por padrão e se é o primeiro selecionado por padrão. (Exiba como
  Badge)
- Faça o refetch dos dados da tabela ao criar o avatar.
