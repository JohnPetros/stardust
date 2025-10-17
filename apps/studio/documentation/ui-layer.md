# UI Layer - Presentation and User Interaction

The UI layer is responsible for presenting the application to the user and
handling all user interactions. It is built with **React** and organized by
domain modules, similar to the `core` package, ensuring a clean and scalable
architecture.

## 🏗️ Module Structure

The UI layer is divided into modules that correspond to the application's
domains. Each module is located in the `/home/petros/stardust/apps/web/src/ui`
directory.

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

Each module contains the following directories:

- **contexts**: For React Context providers that manage state shared across a
  module.
- **stores**: For more complex state management, using libraries like Zustand.
- **widgets**: For the UI components, which are the building blocks of the user
  interface.

## 🖥️ Widgets

A widget is like a small, independent, and reusable building block that forms
the user interface of a React application. In React projects, think of it as a
JavaScript function that returns React elements, describing what should appear
on the screen.

In this project, React components must always be created as
[functional components](https://www.robinwieruch.de/react-function-component),
declared using an arrow function.

```tsx
export const Checkbox = () => {
  return (
    // ..
  )
}
```

If the widget receives properties, a type must be declared above the arrow
function and always be named `Props`.

```tsx
type Props = {
  isChecked: boolean
  onChange: (isChecked: boolean) => void
}

export const Checkbox = ({ isChecked, onChange }: Props) => { // Always try to destructure the props object
  return (
    // ..
  )
}
```

A widget is generally composed of three files: view, hook, and index.

### View

The View is the user interface. It's the part that renders HTML (or JSX, which
is transformed into HTML using React) and reacts to user interactions. The View
should be as "dumb" as possible, meaning it only displays data and dispatches
events.

```tsx
const CheckboxView = ({ isChecked, onChange }: Props) => { // The view's name will always end with the View suffix
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

A hook is a function that exposes data in a way the View can easily consume, and
also exposes commands (functions) that the View can call to update the Model.
The hook abstracts the logic from the View and prepares it for display. In
React, a hook always starts with the `use` prefix.

```tsx
function useCheckbox() {
  const [isChecked, setIsChecked] = useState(false); // A hook can call and use other hooks (either from React itself or custom ones)

  function handleChange() {
    setIsChecked((isChecked) => !isChecked);
  }

  return { // The hook exposes its data by returning an object
    isChecked,
    handleChange,
  };
}
```

Being a function, a hook can naturally receive parameters to use internally or
to apply dependency inversion when receiving interfaces.

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

### The index.tsx File

The `index.tsx` file is the widget's entry point and is responsible for
orchestrating the integration between the View and the Hook, as well as exposing
the component's public API.

**Key characteristics:**

- **Integration**: Connects the hook with the view, passing the necessary data
  and functions.
- **Type exports**: It only exports the main arrow function, never the view,
  hook, or internal types.
- **Composition**: Combines received props with data from the hook before
  passing them to the view.

**Naming conventions:**

- The main component must have the same name as the file (without the `View`
  suffix).
- Re-exports important types using `export type`.
- Uses `Omit` to remove conflicting properties when necessary.

#### index.tsx file for a widget without a hook

For simple widgets that do not have complex state logic or do not require custom
hooks, the `index.tsx` file can simply re-export the View directly. This pattern
is used when the widget is purely presentational and all necessary logic is
contained within the View itself.

```tsx
import { InputView } from "./input-view";

export const Input = InputView;
```

#### index.tsx file for a widget with forwardRef

A widget can use the `forwardRef` pattern when it needs to expose imperative
methods to its parent component. However, these exported methods must be located
in the index.tsx file.

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
        isOpen={isOpen}
        open={open}
        close={close}
        isAnimating={isAnimating}
      />
    );
  },
);
```

### Event Handler Functions

These are functions executed in response to a user interaction or a specific
event that occurs in the interface. They are always declared with the `function`
keyword, and their names are prefixed with `handle`, such as `handleClick`,
`handleSubmit`, `handleChange`, `handleKeyDown`, `handleKeyUp`, etc.

> [!NOTE]\
> If a React component prop is an interface event handler function, the prop in
> question will have an `on` prefix.

### Example: `LessonPage`

Let's look at the `LessonPage` component, located in
`/home/petros/stardust/apps/web/src/ui/lesson/widgets/pages/Lesson`.

```
Lesson/
├── LessonHeader/
├── QuizStage/
├── StoryStage/
├── index.tsx
├── LessonPageView.tsx
└── useLessonPage.ts
```

- **`LessonPageView.tsx`**: This component renders the layout of the lesson
  page. It receives props like `title`, `stages`, `currentStage`, etc., and
  renders them.
- **`useLessonPage.ts`**: This hook fetches the lesson data, manages the current
  stage of the lesson, and provides the necessary functions to navigate between
  stages.
- **`index.tsx`**: This file calls the `useLessonPage` hook and passes the
  returned values as props to the `LessonPageView` component.

```typescript
// index.tsx
import { useLessonPage } from "./useLessonPage";
import { LessonPageView } from "./LessonPageView";

export const LessonPage = () => {
  const { prop1, prop2, prop3 } = useLessonPage();
  return <LessonPageView prop1={prop1} prop2={prop2} prop3={prop3} />;
};
```

This pattern ensures that the view is completely decoupled from the business
logic, making it easy to change the UI without affecting the underlying logic,
and vice-versa.
