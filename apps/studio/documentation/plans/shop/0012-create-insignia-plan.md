# Criação de Insígnia

## Objetivo

Implementar funcionalidade de criação de insígnia no sistema na página de gestão
de loja.

módulo: `shop`

## Status: Em andamento

### Camada Core

- Interface `ShopService` possui o método `createRocket` para criar um insígnia.
- `RocketDto` é usado para representar um insígnia.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- Implemente o método `createRocket` no service `ShopService`.

### Camada UI

- Crie widget de formulário `RocketForm` para criar um insígnia.
- O formulário deve ser exibido em um dialog ao apertar o botão de `Criar insígnia`, que deve ficar acima da tabela de insígnias. 
- O botão de abrir o dialog deve ficar acima da tabela de insígnias.
- O formulário deve conter os campos:
  - Nome (TextInput)
  - Imagem (ImageInput)
  - Preço (NumberInput) que tem mín. 0 e é um número inteiro
  - Papel (SelectInput) que tem como opções: `engineer` (Engenheiro espacial) e `god` (Deus)
- Use o react hook form para criar o formulário.
- Use zod para validação dos dados.
- Use o service `ShopService` para criar a insígnia no hook do `InsigniasTable`.
- Use o `ToastProvider` para exibir mensagens de sucesso ou erro ao criar a insígnia no hook do `InsigniasTable`.
- Exiba loading na tabela enquanto a insígnia é criada.
- Obs. adicione as colunas na tabela `InsigniasTable` para exibir se o insígnia é adquirido por padrão e se é o primeiro selecionado por padrão. (Exiba como Badge)
- Use o `RocketsTable` como inspiração

## Fluxo de alto nível

- Acessar página de loja
- Apertar botão de criar insígnia
- Prencher o formulário corretamente
- Clicar em confirmar
- Tabela atualiza
- É exibido o toast de sucesso ou de erro
