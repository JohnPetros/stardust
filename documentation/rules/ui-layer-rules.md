# UI Layer Rules

## Overview

The **UI** layer implements the interface (Web and Backoffice) with a focus on usability, accessibility and visual consistency. The main pattern is the `Widget Pattern`.

| Item | Definition |
| --- | --- |
| **Goal** | Render UI and orchestrate interface state/effects without pulling in business rules. |
| **Responsibilities** | Define `widgets` (View/Hook/Entry Point); centralize reusable components; maintain UI `contexts`/`hooks`/`stores`; integrate with RPC/REST at the correct boundary. |
| **Does not do** | Business rules; direct access to server-side infrastructure (db/queue). |

## Directory Structure

| App | Path | Purpose |
| --- | --- | --- |
| Web | `apps/web/src/ui/` | Next.js UI. |
| Web | `apps/web/src/ui/global/widgets/` | Widgets (e.g.: `components`, `layouts`, `pages`). |
| Web | `apps/web/src/ui/global/contexts/` | Contexts and their consumption hooks. |
| Web | `apps/web/src/ui/global/hooks/` | Reusable UI hooks. |
| Web | `apps/web/src/ui/global/styles/global.css` | Global styles. |
| Backoffice | `apps/backoffice/src/ui/` | Backoffice UI. |
| Backoffice | `apps/backoffice/src/ui/shadcn/` | Backoffice component base. |
| Backoffice | `apps/backoffice/src/ui/global/stores/` | Stores + facade (when applicable). |

## Widget Pattern

- **View**: rendering only.
- **Hook**: state, UI effects and handlers.
- **Entry Point** (`index.tsx`): composition (connects Hook + View) and integrations (RPC/REST/context).
- **Structural rule**: every widget must have an `Entry Point` in `index.tsx` and an explicit `View` with the `View` suffix. Even simple widgets or dialog/empty-state wrappers must not concentrate rendering directly in `index.tsx`.
- **Directory rule**: an internal component, widget and subwidget with their own logic
  must have their own directory, with `index.tsx` as the only public export.
- **Entry Point rule**: `index.tsx` connects dependencies, calls the hook and
  delegates rendering to the View. It must not declare interface state, effects or
  handlers, nor reproduce the widget's visual tree.
- **Entry Point as a View alias**: when the widget has no hook, context,
  service or integration to connect, `index.tsx` may export the View with the
  widget's public name and the same props, for example
  `export const AnimatedForm = AnimatedFormView`. This is valid and is not a
  violation of the Widget Pattern: `index.tsx` remains the only public
  export and the `View` remains explicit. Do not create a component that merely
  forwards props to the View. When the widget comes to need a hook, context
  or integration, the alias becomes an Entry Point with composition.
- **View rule**: `*View.tsx` receives ready props and renders. It does not access
  context/provider, does not call service/RPC and has no `useEffect` or orchestration
  logic.
- **Hook rule**: widget hooks concentrate UI state, effects and handlers,
  receive dependencies through parameters and do not access contexts/providers
  directly.

> 💡 Practical rule: integrations and dependency resolution happen in the **Entry Point**.

## Rules

- **Typing**: props and returns explicitly typed.
- **Exports**: prefer named exports (`export const`); avoid `export default`.
- **Integration at the edge**: dependencies (services, providers, contexts) resolved in the Entry Point and passed via props/params.
- **Base components**: in the Backoffice, prioritize the existing shadcn components;
  create new primitives only when the catalog does not meet the contract.
- **Navigation**: use `useNavigation` for imperative navigation; do not access
  `window.history`, `window.location` or ad hoc wrappers in widgets.

> ⚠️ Forbidden:
> - Hook calling context/service hooks directly.
> - View containing `useEffect` or service calls.
> - UI importing `apps/server/**`.
> - Entry Point concentrating state, effects or the widget's entire visual tree.
>   The `export const X = XView` alias is not covered by this prohibition, since it declares
>   nothing: it merely re-exports the View.
> - Internal component scattered directly in the `index.tsx` of another widget
>   when it has its own logic, state or reusable contract.

### Anti-pattern: Declaring a hook with `const` instead of `function`

**What was done:**
A widget hook was created using a `const` expression, for example:

```ts
export const useTiptapEditorField = ({ value, disabled = false, onChange }: Params) => {
  // ...
}
```

**Why it is wrong:**
In the StarDust UI layer, hooks must follow the `function` declaration convention to stay consistent with the Widget Pattern, improve readability and standardize maintenance across widgets.

**What should be done:**
Always declare hooks with `function`, keeping the `use` prefix:

```ts
export function useTiptapEditorField({
  value,
  disabled = false,
  onChange,
}: Params) {
  // ...
}
```

## Organization and Naming

- Widget folder: PascalCase.
- Entry Point: `index.tsx` (the widget's only public export point).
- View: `View` suffix (e.g.: `ButtonView.tsx`).
- Every widget must have its own `View`, including dialogs, empty states and widgets without a hook.
- Hook: `use` prefix (e.g.: `useButton.ts`).
- Types: `types/` when the typing is not trivial.

### Anti-pattern: rendering the entire widget in `index.tsx`

**What to avoid:**
Creating widgets whose rendering lives entirely inside `index.tsx`, without a dedicated `*View.tsx` file.

**Why it is wrong:**
This breaks the consistency of the Widget Pattern, makes reading harder, reduces structural predictability and makes it more costly to evolve simple widgets into widgets with more states or composition.

**How to do it:**
Even when the widget has no hook of its own, `index.tsx` must work as an entry point and delegate rendering to a `View`.

Correct example:

```tsx
// index.tsx
import { EmptyStateView } from './EmptyStateView'

type Props = {
  title: string
}

export const EmptyState = ({ title }: Props) => {
  return <EmptyStateView title={title} />
}

// EmptyStateView.tsx
type EmptyStateViewProps = {
  title: string
}

export const EmptyStateView = ({ title }: EmptyStateViewProps) => {
  return <div>{title}</div>
}
```

### Anti-pattern: Using the `icon` prop on the Backoffice `Icon` component

**What was done:**
The Backoffice UI's `Icon` component was used with the wrong `icon` prop, for example:

```tsx
<Icon icon='audio' className='mr-2 h-4 w-4' />
```

**Why it is wrong:**
In the Backoffice, the `Icon` contract (`LucideIconView`) receives `name` (type `IconName`), not `icon`. Using `icon` breaks the typing, causes a compilation error and makes the use of the UI's global components inconsistent.

**What should be done:**
Always use the `name` prop with a value that exists in `IconName`:

```tsx
<Icon name='audio' className='mr-2 h-4 w-4' />
```

## Example

```tsx
// View (rendering)
export const ButtonView = ({ title, onClick }: { title: string; onClick: () => void }) => (
  <button onClick={onClick}>{title}</button>
)

// Hook (UI logic)
export function useButton({ onAction }: { onAction: () => void }) {
  function handleClick() {
    onAction()
  }

  return { handleClick }
}

// Entry Point (composition)
export const Button = ({ title, onAction }: { title: string; onAction: () => void }) => {
  const { handleClick } = useButton({ onAction })
  return <ButtonView title={title} onClick={handleClick} />
}
```

## Integration with Other Layers

- **Allowed**
  - UI depending on `@stardust/core/**` (types, entities, `responses`).
  - UI calling the app's own layers: `apps/web/src/rpc/**`, `apps/web/src/rest/**`.
  - Backoffice preferring base components in `apps/backoffice/src/ui/shadcn`.
- **Forbidden**
  - UI importing `apps/server/**`.
  - UI accessing `apps/server/src/database/**` or any direct db/queue access.

## Checklist (before the PR)

- Widget follows View/Hook/Entry Point.
- Every widget has `index.tsx` and `*View.tsx`, even without a hook.
- Hook does not access contexts/providers; receives dependencies via params.
- Data integration happens via RPC/REST.
- Props typed; exports are named.
- Internal components with logic are in their own directories.
- Imperative navigation uses `useNavigation`.
- Backoffice components reuse shadcn primitives when available.

## Mandatory UI audit

Every frontend change must record an audit of the Rule in
`evaluation.md`. The audit must list each changed widget and report:

| Widget | Entry Point | View | Hook | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| `ExampleWidget` | `index.tsx:10-18` | `ExampleWidgetView.tsx:5-30` | `useExampleWidget.ts:8-42` | passed | diff/test |

For each widget, explicitly confirm:

1. `index.tsx` only resolves dependencies, connects Hook + View and composes the
   contract; in a widget without a hook, context or integration, the alias
   `export const X = XView` with the same props is accepted;
2. `*View.tsx` only renders and contains no effects, services or contexts;
3. the Hook uses a `function` declaration, receives dependencies through parameters and
   concentrates the UI logic;
4. the widget and its internal components are in their own directories;
5. navigation uses `useNavigation` and the available base components were
   reused.

`pnpm run check:architecture` does not replace this audit: the sensor validates
dependency boundaries and does not detect violations of the Widget Pattern.

## Notes

- Widget Pattern architecture: `documentation/architecture.md`.
- Widget tests: `documentation/rules/widget-tests-rules.md`.
- Tooling: `documentation/tooling.md`.
