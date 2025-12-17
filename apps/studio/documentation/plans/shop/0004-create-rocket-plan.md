# Criação de foguete

## Objetivo

Implementar funcionalidade de criação de foguete no sistema na página de gestão
de loja.

módulo: `shop`

## Status: Em andamento

### Camada Core

- Interface `ShopService` possui o método `createRocket` para criar um foguete.
- `RocketDto` é usado para representar um foguete.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- Implemente o método `createRocket` no service `ShopService`.

### Camada UI

- Crie widget de formulário `RocketForm` para criar um foguete.
- O formulário deve ser exibido em um dialog ao apertar o botão de `Criar foguete`, que deve ficar acima da tabela de foguetes. 
- O formulário deve conter os campos:
  - Nome (TextInput)
  - Imagem (ImageInput)
  - Preço (NumberInput) que tem mín. 0 e é um número inteiro
  - Checkbox para definir se é um foguete adquirido pelo usuário por padrão quando ele cria a sua conta na plataforma
  - Checkbox para definir se é um foguete já é o primeiro selecionado pelo usuário por padrão quando ele cria a sua conta na plataforma
- Use o react hook form para criar o formulário.
- Use zod para validação dos dados.
- Use o service `ShopService` para criar o foguete no hook do `RocketsTable`.
- Use o `ToastProvider` para exibir mensagens de sucesso ou erro ao criar o foguete no hook do `RocketsTable`.
- Exiba loading na tabela enquanto o foguete é criado.
- Obs. adicione as colunas na tabela `RocketsTable` para exibir se o foguete é adquirido por padrão e se é o primeiro selecionado por padrão. (Exiba como Badge)
