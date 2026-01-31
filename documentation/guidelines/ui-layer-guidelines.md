# Diretrizes de Interface de Usuário (UI)

Este documento define os padrões para desenvolvimento de componentes de interface (Widgets) nas aplicações frontend (`apps/web` e `apps/studio`).

## Visão Geral

A camada de UI é organizada utilizando o padrão **Widget**. Um Widget é uma unidade autossuficiente de interface que encapsula lógica, visualização e tipos.

## Estrutura de Pastas

```text
apps/<app>/src/ui/
├── <dominio>/               # Ex: profile, auth, global
│   └── widgets/
│       ├── components/      # Componentes reutilizáveis
│       ├── layouts/         # Estruturas de página
│       └── pages/           # Páginas completas
```

### Anatomia de um Widget

Um Widget completo segue a divisão de responsabilidades **Container/Presentational** (ou Logic/View):

```text
MeuWidget/
├── index.tsx                # Container (Smart): Conecta Hook e View
├── MeuWidgetView.tsx        # Presentational (Dumb): Apenas renderização
├── useMeuWidget.ts          # Hook: Lógica de estado e efeitos (opcional)
└── types/
    └── MeuWidgetProps.ts    # Definição de Tipos
```

## Padrões de Implementação

### 1. View (`ComponentView.tsx`)
Responsável **apenas** por renderizar a interface.
*   Deve ser uma função pura (sempre que possível).
*   Deve sempre ser declarada como arrow function
*   Não deve conter lógica de negócios ou `useEffect`.
*   Recebe dados e callbacks via props.
*   Utiliza Tailwind CSS para estilização (`className` merged via `twMerge` se necessário).

```tsx
// ButtonView.tsx
export const ButtonView = ({ title, onClick, variant }: Props) => (
  <button className={twMerge('base-class', variant)} onClick={onClick}>
    {title}
  </button>
)
```

### 2. Hook (`useComponent.ts`)
Responsável por toda a lógica do componente.
*   Gerencia estados (`useState`, `useReducer`).
*   Executa efeitos colaterais (`useEffect`).
*   Calcula valores derivados (`useMemo`).
*   Prepara props para a View.
*   funções handlers deve usar a notação function e não arrow function
*   Deve sempre ser declarada como function
*   Todas as funções internas deve declaradas como function


```typescript
// useButton.ts
type Params = {
  isExecuting: boolean;
  onAction: () => void;
}

export function useButton({ onAction, isExecuting }: Params) {
  const variant = useMemo(() => isExecuting ? 'loading' : 'default', [isExecuting])

  function handleClick() {
    onAction()
  }
  
  return {
    variant,
    handleClick
  }
}


```

**Importante:** Nunca use services, providers ou hooks de contexts diretamente no hook, sempre use primeiro no entry point e passe as props para o hook

Exemplo:

```tsx

export const ButtonView = ({ title, onClick, variant }: Props) => (
  const { service } = useRestContext()
  const { user, updateUser } = useAuthContext()
  useButton({  userId: user, service, onClick: updateUser })

  ...
)
```



### 3. Container (`index.tsx`) (Entry Point)
Orquestra a chamada do Hook e renderiza a View.
*   Deve ser o único ponto de exportação do componente para consumo externo.
*   Deve sempre ser declarada como arrow function

```tsx
// index.tsx
export const Button = ({ onAction, isExecuting }: ActionButtonProps) => {
  const { variant, handleClick } = useButton({
    onAction,
    isExecuting
  })
  
  return <ActionButtonView variant={variant} onClick={handleClick} />
}
```

*   Evite usar spread operator nas props na View, como `<ActionButtonView {...props} />`, prefira sempre declarar as props explicitamente.
*   Nunca use hooks de contexts ou de providers diretamente no hook, sempre use primeiro no entry point e passe as props para o hook.

```tsx
// index.tsx
export const Button = (props: ActionButtonProps) => {
  const { user } = useAuthContext()
  const { authService } = useRest()
  const toastProvider = useToast()
  const { variant, handleClick } = useButton({
    userId: user?.id,
    onAction,
    isExecuting: false
  })
  
  return <ActionButtonView variant={variant} onClick={handleClick} />
}
```

### Server components

*   Se o widget for um server component, ele não deve conter hook, mas apenas view e entry point
*   No entry point, ele pode executar actions da camada RPC diretamente

```tsx
// index.tsx
export const UserAvatar = (props: Props) => {
  const user = await authActions.getUser()
  
  return <UserAvatarView image={user.avatar} />
}
```

*   No entry point, ele pode executar services diretamente, desde que o rest client do service não dependa do client.

```tsx
// index.tsx
export const UserAvatar = (props: Props) => {
  const restClient = NextServerRestClient()
  const service = AuthService(restClient)
  const user = await service.fetchUser()
  
  return <UserAvatarView image={user.avatar} />
}
```

*   No entry point, o que define se um widget é client ou server é o uso da diretriva `use client`

```tsx
// index.tsx (client widget)
'use client'

export const Button = (props: Props) => {
  ...
}
```

```tsx
// index.tsx (server widget)
export const UserAvatar = (props: Props) => {
  ...
}
```


## Bibliotecas e Ferramentas

### Apps/Web
*   **Tailwind CSS**: Estilização padrão.
*   **Headless UI / Radix**: Acessibilidade (se aplicável).
*   **Framer Motion**: Animações (em `src/ui/global/widgets/components/Animation`).

### Apps/Studio
*   **ShadCN UI**: Componentes base localizados em `src/ui/shadcn`.
    *   Sempre prefira usar/estender componentes do ShadCN para manter consistência visual no painel administrativo.

## Regras Gerais

1.  **Nomenclatura**: Use PascalCase para componentes e diretórios (ex: `UserProfile`).
2.  **Exportação**: Use *Named Exports* (`export const`). Evite *Default Exports*.
3.  **ForwardRef**: Use apenas quando necessário expor a referência do DOM para o pai (comum em inputs ou componentes de animação).
4.  **Tipagem**: Defina props explicitamente em arquivo separado ou no topo do `index.tsx` se for simples.

## Contextos e Gerenciamento de Estado

Além dos Widgets, o gerenciamento de estado compartilhado é organizado em **Contextos** e **Stores**.

### 1. Contextos (React Context API)

Utilizados para estados de escopo médio ou configurações que precisam ser acessadas por uma sub-árvore de componentes (ex: Temas, Autenticação, Toasts).

**Estrutura de Pastas:**
```text
MeuContext/
├── index.tsx                # Definição do Contexto e Provider
├── hooks/                   # Hooks customizados para consumo
└── types/                   # Tipagem (Interfaces de Value)
```

**Padrão de Consumo:**
Sempre crie um hook customizado (`useMeuContext`) que encapsula o `useContext(Context)` e valida se o componente está dentro do Provider.

### 2. Stores (Zustand + Facade)

Para estados globais complexos ou que exigem alta performance/mutabilidade (ex: Editor de Código, Carrinho, Desafios), utilizamos **Zustand** com o middleware **Immer**.

Adotamos o **Facade Pattern** para isolar a biblioteca de gerenciamento de estado da UI.

**Estrutura de Pastas:**
```text
MeuStore/
├── index.ts                 # Facade: Hook público (ex: useMeuStore)
├── constants.ts             # Estado inicial
├── types/                   # Interfaces do Estado e Ações
└── zustand/                 # Implementação interna
    └── useZustandStore.ts   # Store real do Zustand
```

**Benefícios do Facade no Store:**
- A UI consome apenas `useMeuStore()`.
- Facilita a criação de "Slices" (fatias de estado) tipadas.
- Permite trocar a biblioteca de estado (ex: Zustand por Redux ou Recoil) sem alterar os componentes.

```typescript
// Exemplo de Facade Hook
export function useChallengeStore() {
  return {
    getChallengeSlice: () => {
      const challenge = useZustandChallengeStore(s => s.state.challenge)
      const setChallenge = useZustandChallengeStore(s => s.actions.setChallenge)
      return { challenge, setChallenge }
    },
    // ...
  }
}
```

## Quando usar cada um?

- **Props**: Para passar dados entre pai e filho imediato.
- **Contexto**: Para dados "estáticos" ou de configuração que muitos componentes precisam (ex: `AuthContext`, `ToastContext`).
- **Store**: Para fluxos de dados complexos, interações entre componentes distantes ou quando a performance de re-renderização é crítica (Zustand permite seletores granulares).