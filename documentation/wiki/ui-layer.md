---
globs: src/ui/**
alwaysApply: false
---

# 🖥️ Camada de Interface de Usuário (ui)

A camada ui é a responsável por fornecer a interface gráfica e a lógica de
interação com o usuário, seja em uma página web ou em uma tela mobile. Ela é
diferente das demais porque não possui handlers nem protocols, mas sim widgets —
blocos reutilizáveis que combinam visual com lógica de interface.

## Widgets

Um widget é como um pequeno bloco de construção independente e reutilizável que
forma a interface de usuário de uma aplicação React. Em projetos React, pense
nele como uma função JavaScript que retorna elementos React, descrevendo o que
deve aparecer na tela.

No projeto, componentes React sempre deverão ser criados como
[functional components](https://www.robinwieruch.de/react-function-component),
sendo declaradas por meio de uma arrow function.

```tsx
export const Checkbox = () => {
  return (
    // ..
  )
}
```

Caso o widget receba propriedades, um type deve ser declarado em cima da arrow
function e sempre nomeado como `Props`.

```tsx
type Props = {
  isChecked: boolean
  onChange: (isChecked: boolean) => void
}

export const Checkbox = ({ isChecked, onChange }: Props) => { // Procure desestruturar o objeto props
  return (
    // ..
  )
}
```

Um widget é geralmente composto por três arquivos: view, hook e index

### View

View: É a interface do usuário. É a parte que renderiza o HTML (ou JSX, que é
transformado em HTML utilizando React) e reage às interações do usuário. A View
deve ser o mais "burra" possível, ou seja, ela apenas exibe dados e dispara
eventos.

```tsx
const CheckboxView = ({ isChecked, onChange }: Props) => { // O nome da view sempre vai terminar com sufixo View
  return (
    <Input
      isChecked={isChecked}
      onChange={onChange}
    >
      <AnimatedIndicator>
        <Icon name="check" size={14} className="text-green-900" weight="bold" />
      </AnimatedIndicator>
    </Input>
  );
};
```

### Hook

É uma função que expõe dados de uma forma que a View possa consumir facilmente,
e também expõe comandos (funções) que a View pode chamar para atualizar o Model.
O hook abstrai a lógica da View e a prepara para ser exibida. No React, o hook
sempre começa com prefixo `use`.

```tsx
function useCheckbox() {
  const [isChecked, setIsChecked] = useState(false); // Um hook pode chamar e usar outros hooks (seja do próprio React ou customizados)

  function handleChange() {
    setIsChecked((isChecked) => !isChecked);
  }

  return { // O hook exões seus dados retornado um objeto
    isDisable,
    handleChange,
  };
}
```

Sendo uma função, naturalmente, o hook pode receber parâmentros para usá-los
internamente ou aplicar inversão de independência no caso de receber interfaces.

```tsx
function useCheckbox(profileService: ProfileService) {
  const [isChecked, setIsChecked] = useState(false);

  const updateUser = useCallback(async (dto: UserDto) => {
    await profileService.updateUser(dto);
  }, []);

  async function handleChange() {
    setIsChecked((isChecked) => !isChecked);
  }

  return {
    isDisable,
    handleChange,
  };
}
```

No exemplo de código acima, é possível perceber outro padrão utilizado: um hook
pode expor dois tipos de função.

### Arquivo index.tsx

O arquivo `index.tsx` é o ponto de entrada do widget e tem como responsabilidade
orquestrar a integração entre a View e o Hook, além de expor a API pública do
componente.

**Características principais:**

- **Integração**: Conecta o hook com a view, passando os dados e funções necessárias
- **Exportação de tipos**: Ele apenas exporta o a arrow function principal, nunca a view, hook ou tipos
- **Composição**: Combina props recebidas com dados do hook antes de passar para a view

**Padrões de nomenclatura:**
- O componente principal deve ter o mesmo nome do arquivo (sem o sufixo `View`)
- Re-exporta tipos importantes com `export type`
- Usa `Omit` para remover propriedades conflitantes quando necessário

#### Arquivo index.tsx de widget sem hook

Para widgets simples que não possuem lógica de estado complexa ou não precisam de
hooks customizados, o arquivo `index.tsx` pode simplesmente re-exportar a View
diretamente. Este padrão é usado quando o widget é puramente apresentacional e
toda a lógica necessária está contida na própria View.

```tsx
import { InputView } from './input-view'

export const Input = InputView
```

**Características principais:**

- **Simplicidade**: Apenas re-exporta a View como componente principal
- **Sem lógica adicional**: Não há necessidade de orquestração entre hook e view
- **Componente puramente apresentacional**: A View já contém toda a lógica necessária
- **Menos arquivos**: Não requer arquivo de hook separado

**Quando usar este padrão:**
- Widgets que apenas renderizam dados recebidos via props
- Componentes que usam apenas hooks nativos do React (como `useId`, `useState` simples)
- Widgets sem estado complexo ou lógica de negócio
- Componentes de apresentação que não precisam de métodos imperativos

**Exemplo de View compatível:**
```tsx
export const InputView = ({
  label,
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  icon?: React.ReactNode
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const id = useId()
  return (
    <div className='*:not-first:mt-2'>
      <Label htmlFor={id}>{label}</Label>
      <div className='relative'>
        <Input
          id={id}
          className={icon ? 'peer ps-9' : 'peer'}
          placeholder={placeholder}
          type='text'
          value={value}
          onChange={onChange}
        />
        {icon && (
          <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
```


#### Arquivo index.tsx de widget com forward ref

 Se um widget pode utilizar o padrão `forwardRef` quando o widget precisa expor
métodos imperativos para o componente pai. Contudo, esses métodos exportados deve estar no arquivo index.tsx

```tsx
import { forwardRef, useImperativeHandle } from 'react'
import { DialogView, type DialogViewProps } from './dialog-view'
import { useDialog } from './use-dialog'
import type { DialogRef } from './dialog-ref'

export type { DialogRef } from './dialog-ref'
export type { DialogSize, DialogViewProps } from './dialog-view'

export const Dialog = forwardRef<DialogRef, Omit<DialogViewProps, 'ref'>>(
  (props, ref) => {
    const { isOpen, open, close, isAnimating } = useDialog(props.onOpen, props.onClose)

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
      }),
      [open, close],
    )

    return (
      <DialogView
        {...props}
        isOpen={isOpen}
        open={open}
        close={close}
        isAnimating={isAnimating}
      />
    )
  },
)
```

#### Funções manipuladoras de evento

Funções executadas em resposta a uma interação do usuário ou a um evento
específico que ocorre na interface. São sempre declaradas com a palavra
`function` e seu nome é prefixado com `handle`, como `handleClick`,
`handleSubmit`, `handleChange`, `handleKeyDown`, `handleKeyUp` etc.

> [!NOTE]\
> Caso uma proprieade de um componente react seja uma função manipuladora de
> evento de interface, a propriedade em questão terá `on` como prefixo.