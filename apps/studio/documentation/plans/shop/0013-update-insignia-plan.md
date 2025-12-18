# Atualização de insignia

## Objetivo

Implementar funcionalidade de atualização de insignia no sistema na página de
gestão de loja.

módulo: `shop`

## Status: ✅ Concluído

### Camada Core

- ✅ Interface `ShopService` possui o método `updateInsignia` para atualizar um
  insignia.
- ✅ `InsigniaDto` é usado para representar um insignia.
- ✅ `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- ✅ Implementado o método `updateInsignia` no service `ShopService` usando `restClient.put`.

### Camada UI

- ✅ Widget de formulário `InsigniaForm` já suportava `initialValues` para atualizar um insignia.
- ✅ Service `ShopService` é usado para atualizar o insignia no hook do `InsigniasTable`.
- ✅ `ToastProvider` exibe mensagens de sucesso ou erro ao atualizar o insignia.
- ✅ Loading é exibido na tabela enquanto o insignia é atualizado.
- ✅ Refetch dos dados da tabela é feito ao atualizar o insignia.

## Implementação Realizada

### 1. **ShopService (Core)**
   - Adicionado método `updateInsignia(insignia: Insignia): Promise<RestResponse<InsigniaDto>>` à interface.

### 2. **ShopService (REST)**
   - Implementado método `updateInsignia` usando `restClient.put('/shop/insignias/${insignia.id.value}', insignia.dto)`.

### 3. **useInsigniasTable**
   - Renomeado `isCreating` para `isSubmitting` (melhor semântica).
   - Criado `handleUpdateInsignia` que:
     - Define estado de loading
     - Chama `shopService.updateInsignia`
     - Exibe toast de sucesso/erro
     - **Em caso de erro, remove a imagem do storage usando `removeImageFile`**
     - Faz refetch dos dados

### 4. **InsigniasTableView**
   - Adicionado `handleUpdateInsignia` às props.
   - Substituído botão "Editar" estático por `InsigniaFormView` com:
     - `initialValues={insignia}` para preencher o formulário
     - `onSubmit={handleUpdateInsignia}` para salvar as alterações

### 5. **InsigniasTable (index.tsx)**
   - Adicionado `handleUpdateInsignia` ao destructuring do hook.
   - Passado para o componente view.

## Como Testar

1. Acesse a página da loja (Shop)
2. Clique no botão "Editar" de qualquer insígnia
3. O formulário abrirá com os dados atuais preenchidos
4. Modifique o nome, preço ou role
5. Clique em "Salvar"
6. Verifique que:
   - O diálogo fecha
   - Um toast de sucesso aparece
   - A tabela atualiza com os novos dados
