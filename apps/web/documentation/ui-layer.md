# Camada de UI - Apresentação e Interação com o Usuário

A camada de UI é responsável por apresentar a aplicação ao usuário e lidar com todas as suas interações. Ela é construída com **React** e organizada por módulos de domínio, semelhante ao pacote `core`, garantindo uma arquitetura limpa e escalável.

## 🏗️ Estrutura de Módulos

A camada de UI é dividida em módulos que correspondem aos domínios da aplicação. Cada módulo está localizado no diretório `./apps/web/src/ui`.

```
src/ui/
├── auth/
├── challenging/
├── global/
├── lesson/
├── playground/
├── profile/
├── ranking/
├── shop/
└── space/
```

Cada módulo contém os seguintes diretórios:

- **contexts**: Para provedores de Contexto React que gerenciam o estado compartilhado em um módulo.
- **stores**: Para gerenciamento de estado mais complexo, usando bibliotecas como Zustand.
- **widgets**: Para os componentes de UI, que são os blocos de construção da interface do usuário.

## 🖥️ Widgets

Um widget é como um pequeno bloco de construção independente e reutilizável que forma a interface do usuário de uma aplicação React. Em projetos React, pense nele como uma função JavaScript que retorna elementos React, descrevendo o que deve aparecer na tela.

Neste projeto, os componentes React devem sempre ser criados como [componentes funcionais](https://www.robinwieruch.de/react-function-component), declarados usando uma arrow function.

```tsx
export const Checkbox = () => {
  return (
    // ..
  )
}
```

Se o widget receber propriedades, um tipo deve ser declarado acima da arrow function e sempre ser nomeado `Props`.

```tsx
type Props = {
  isChecked: boolean
  onChange: (isChecked: boolean) => void
}

export const Checkbox = ({ isChecked, onChange }: Props) => { // Sempre tente desestruturar o objeto de props
  return (
    // ..
  )
}
```

Um widget é geralmente composto por três arquivos: view, hook e index.

### View

A View é a interface do usuário. É a parte que renderiza HTML (ou JSX, que é transformado em HTML usando React) e reage às interações do usuário. A View deve ser o mais "burra" possível, o que significa que ela apenas exibe dados e despacha eventos.

```tsx
const CheckboxView = ({ isChecked, onChange }: Props) => { // O nome da view sempre terminará com o sufixo View
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

Um hook é uma função que expõe dados de uma forma que a View pode consumir facilmente, e também expõe comandos (funções) que a View pode chamar para atualizar o Modelo. O hook abstrai a lógica da View e a prepara para exibição. Em React, um hook sempre começa com o prefixo `use`.

```tsx
function useCheckbox() {
  const [isChecked, setIsChecked] = useState(false); // Um hook pode chamar e usar outros hooks (do próprio React ou customizados)

  function handleChange() {
    setIsChecked((isChecked) => !isChecked);
  }

  return { // O hook expõe seus dados retornando um objeto
    isChecked,
    handleChange,
  };
}
```

Sendo uma função, um hook pode naturalmente receber parâmetros para usar internamente ou para aplicar inversão de dependência ao receber interfaces.

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
    isChecked,
    handleChange,
  };
}
```

### O arquivo index.tsx

O arquivo `index.tsx` é o ponto de entrada do widget e é responsável por orquestrar a integração entre a View e o Hook, bem como expor a API pública do componente.

**Características principais:**

- **Integração**: Conecta o hook com a view, passando os dados e funções necessários.
- **Exportações de tipo**: Ele exporta apenas a função de seta principal, nunca a view, o hook ou tipos internos.
- **Composição**: Combina as props recebidas com os dados do hook antes de passá-los para a view.

**Convenções de nomenclatura:**

- O componente principal deve ter o mesmo nome do arquivo (sem o sufixo `View`).
- Re-exporta tipos importantes usando `export type`.
- Usa `Omit` para remover propriedades conflitantes quando necessário.

#### arquivo index.tsx para um widget sem um hook

Para widgets simples que não possuem lógica de estado complexa ou não requerem hooks customizados, o arquivo `index.tsx` pode simplesmente re-exportar a View diretamente. Este padrão é usado quando o widget é puramente presentacional e toda a lógica necessária está contida na própria View.

```tsx
import { InputView } from "./input-view";

export const Input = InputView;
```

#### arquivo index.tsx para um widget com forwardRef

Um widget pode usar o padrão `forwardRef` quando precisa expor métodos imperativos para seu componente pai. No entanto, esses métodos exportados devem estar localizados no arquivo index.tsx.

```tsx
import { forwardRef, useImperativeHandle } from "react";
import { DialogView, type DialogViewProps } from "./dialog-view";
import { useDialog } from "./use-dialog";
import type { DialogRef } from "./dialog-ref";

export type { DialogRef } from "./dialog-ref";
export type { DialogSize, DialogViewProps } from "./dialog-view";

export const Dialog = forwardRef<DialogRef, Omit<DialogViewProps, "ref">>( 
  (props, ref) => {
    const { isOpen, open, close, isAnimating } = useDialog(
      props.onOpen,
      props.onClose,
    );

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
      }),
      [open, close],
    );

    return (
      <DialogView
        {...props}
        isOpen={isOpen}
        open={open}
        close={close}
        isAnimating={isAnimating}
      />
    );
  },
);
```

### Funções de Manipulação de Eventos

Estas são funções executadas em resposta a uma interação do usuário ou a um evento específico que ocorre na interface. Elas são sempre declaradas com a palavra-chave `function`, e seus nomes são prefixados com `handle`, como `handleClick`, `handleSubmit`, `handleChange`, `handleKeyDown`, `handleKeyUp`, etc.

> [!NOTE]
> Se uma prop de componente React for uma função de manipulador de eventos de interface, a prop em questão terá um prefixo `on`.

### Exemplo: `LessonPage`

Vejamos o componente `LessonPage`, localizado em `./apps/web/src/ui/lesson/widgets/pages/Lesson`.

```
Lesson/
├── LessonHeader/
├── QuizStage/
├── StoryStage/
├── index.tsx
├── LessonPageView.tsx
└── useLessonPage.ts
```

- **`LessonPageView.tsx`**: Este componente renderiza o layout da página da lição. Ele recebe props como `title`, `stages`, `currentStage`, etc., e as renderiza.
- **`useLessonPage.ts`**: Este hook busca os dados da lição, gerencia o estágio atual da lição e fornece as funções necessárias para navegar entre os estágios.
- **`index.tsx`**: Este arquivo chama o hook `useLessonPage` e passa os valores retornados como props para o componente `LessonPageView`.

```typescript
// index.tsx
import { useLessonPage } from "./useLessonPage";
import { LessonPageView } from "./LessonPageView";

export const LessonPage = () => {
  const lessonPageProps = useLessonPage();
  return <LessonPageView {...lessonPageProps} />;
};
```

Este padrão garante que a view seja completamente desacoplada da lógica de negócios, facilitando a alteração da UI sem afetar a lógica subjacente e vice-versa.