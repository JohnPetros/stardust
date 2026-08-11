# Regras da Camada UI

## Visao Geral

A camada **UI** implementa a interface (Web e Studio) com foco em usabilidade, acessibilidade e consistencia visual. O padrao principal e o `Widget Pattern`.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Renderizar UI e orquestrar estado/efeitos de interface sem puxar regra de negocio. |
| **Responsabilidades** | Definir `widgets` (View/Hook/Entry Point); centralizar componentes reutilizaveis; manter `contexts`/`hooks`/`stores` de UI; integrar com RPC/REST na borda correta. |
| **Nao faz** | Regra de negocio; acesso direto a infraestrutura server-side (db/queue). |

## Estrutura de Diretorios

| App | Caminho | Finalidade |
| --- | --- | --- |
| Web | `apps/web/src/ui/` | UI do Next.js. |
| Web | `apps/web/src/ui/global/widgets/` | Widgets (ex: `components`, `layouts`, `pages`). |
| Web | `apps/web/src/ui/global/contexts/` | Contexts e seus hooks de consumo. |
| Web | `apps/web/src/ui/global/hooks/` | Hooks reutilizaveis de UI. |
| Web | `apps/web/src/ui/global/styles/global.css` | Estilos globais. |
| Studio | `apps/studio/src/ui/` | UI do Studio. |
| Studio | `apps/studio/src/ui/shadcn/` | Base de componentes do Studio. |
| Studio | `apps/studio/src/ui/global/stores/` | Stores + facade (quando aplicavel). |

## Widget Pattern

- **View**: apenas renderizacao.
- **Hook**: estado, efeitos de UI e handlers.
- **Entry Point** (`index.tsx`): composicao (conecta Hook + View) e integracoes (RPC/REST/context).
- **Regra estrutural**: todo widget deve ter um `Entry Point` em `index.tsx` e uma `View` explicita com sufixo `View`. Mesmo widgets simples ou wrappers de dialog/estado vazio nao devem concentrar renderizacao diretamente no `index.tsx`.
- **Regra de diretório**: componente interno, widget e subwidget com lógica própria
  devem possuir diretório próprio, com `index.tsx` como único export público.
- **Regra do Entry Point**: `index.tsx` conecta dependências, chama o hook e
  delega a renderização para a View. Não deve declarar estado, efeitos ou
  handlers de interface, nem reproduzir a árvore visual do widget.
- **Regra da View**: `*View.tsx` recebe props prontas e renderiza. Não acessa
  context/provider, não chama service/RPC e não possui `useEffect` ou lógica de
  orquestração.
- **Regra do Hook**: hooks de widget concentram estado, efeitos e handlers de
  UI, recebem dependências por parâmetros e não acessam contexts/providers
  diretamente.

> 💡 Regra pratica: integracoes e resolucao de dependencias acontecem no **Entry Point**.

## Regras

- **Tipagem**: props e retornos explicitamente tipados.
- **Exports**: preferir named exports (`export const`); evitar `export default`.
- **Integracao na borda**: dependencies (services, providers, contexts) resolvidas no Entry Point e passadas via props/params.
- **Componentes base**: no Studio, priorizar os componentes shadcn existentes;
  criar primitives novas somente quando o catálogo não atender ao contrato.
- **Navegação**: usar `useNavigation` para navegação imperativa; não acessar
  `window.history`, `window.location` ou wrappers ad hoc em widgets.

> ⚠️ Proibido:
> - Hook chamar hooks de context/service diretamente.
> - View conter `useEffect` ou chamadas de service.
> - UI importar `apps/server/**`.
> - Entry Point concentrar estado, efeitos ou a árvore visual inteira do widget.
> - Componente interno espalhado diretamente em um `index.tsx` de outro widget
>   quando ele possui lógica, estado ou contrato reutilizável próprio.

### Anti-padrão: Declarar hook com `const` em vez de `function`

**O que foi feito:**
Foi criado um hook de widget usando expressao com `const`, por exemplo:

```ts
export const useTiptapEditorField = ({ value, disabled = false, onChange }: Params) => {
  // ...
}
```

**Por que está errado:**
Na camada UI do StarDust, hooks devem seguir a convencao de declaracao com `function` para manter consistencia com o Widget Pattern, melhorar legibilidade e padronizar manutencao entre widgets.

**O que deve ser feito:**
Declarar hooks sempre com `function`, mantendo o prefixo `use`:

```ts
export function useTiptapEditorField({
  value,
  disabled = false,
  onChange,
}: Params) {
  // ...
}
```

## Organizacao e Nomeacao

- Pasta do widget: PascalCase.
- Entry Point: `index.tsx` (unico ponto de export publico do widget).
- View: sufixo `View` (ex: `ButtonView.tsx`).
- Todo widget deve possuir sua propria `View`, inclusive dialogs, empty states e widgets sem hook.
- Hook: prefixo `use` (ex: `useButton.ts`).
- Tipos: `types/` quando a tipagem nao for trivial.

### Anti-padrao: renderizar widget inteiro no `index.tsx`

**O que evitar:**
Criar widgets cuja renderizacao fica toda dentro do `index.tsx`, sem um arquivo `*View.tsx` dedicado.

**Por que esta errado:**
Isso quebra a consistencia do Widget Pattern, dificulta leitura, reduz previsibilidade estrutural e torna mais custoso evoluir widgets simples para widgets com mais estados ou composicao.

**Como fazer:**
Mesmo quando o widget nao possui hook proprio, o `index.tsx` deve funcionar como entry point e delegar a renderizacao para uma `View`.

Exemplo correto:

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

### Anti-padrão: Usar prop `icon` no componente `Icon` do Studio

**O que foi feito:**
Foi usado o componente `Icon` da UI do Studio com a prop errada `icon`, por exemplo:

```tsx
<Icon icon='audio' className='mr-2 h-4 w-4' />
```

**Por que está errado:**
No Studio, o contrato de `Icon` (`LucideIconView`) recebe `name` (tipo `IconName`), nao `icon`. Usar `icon` quebra a tipagem, gera erro de compilacao e despadroniza o uso dos componentes globais da UI.

**O que deve ser feito:**
Usar sempre a prop `name` com um valor existente em `IconName`:

```tsx
<Icon name='audio' className='mr-2 h-4 w-4' />
```

## Exemplo

```tsx
// View (renderizacao)
export const ButtonView = ({ title, onClick }: { title: string; onClick: () => void }) => (
  <button onClick={onClick}>{title}</button>
)

// Hook (logica de UI)
export function useButton({ onAction }: { onAction: () => void }) {
  function handleClick() {
    onAction()
  }

  return { handleClick }
}

// Entry Point (composicao)
export const Button = ({ title, onAction }: { title: string; onAction: () => void }) => {
  const { handleClick } = useButton({ onAction })
  return <ButtonView title={title} onClick={handleClick} />
}
```

## Integracao com Outras Camadas

- **Permitido**
  - UI depender de `@stardust/core/**` (tipos, entidades, `responses`).
  - UI chamar camadas da propria app: `apps/web/src/rpc/**`, `apps/web/src/rest/**`.
  - Studio preferir componentes base em `apps/studio/src/ui/shadcn`.
- **Proibido**
  - UI importar `apps/server/**`.
  - UI acessar `apps/server/src/database/**` ou qualquer acesso direto a db/queue.

## Checklist (antes do PR)

- Widget segue View/Hook/Entry Point.
- Todo widget possui `index.tsx` e `*View.tsx`, mesmo sem hook.
- Hook nao acessa contexts/providers; recebe dependencias via params.
- Integracao com dados acontece via RPC/REST.
- Props tipadas; exports sao named.
- Componentes internos com lógica estão em diretórios próprios.
- Navegação imperativa usa `useNavigation`.
- Componentes Studio reutilizam primitives shadcn quando disponíveis.

## Auditoria obrigatória de UI

Toda mudança frontend deve registrar uma auditoria da Rule no Plan ou no
`evaluation.md`. A auditoria precisa enumerar cada widget alterado e informar:

| Widget | Entry Point | View | Hook | Resultado | Evidência |
| --- | --- | --- | --- | --- | --- |
| `ExampleWidget` | `index.tsx:10-18` | `ExampleWidgetView.tsx:5-30` | `useExampleWidget.ts:8-42` | passed | diff/test |

Para cada widget, confirme explicitamente:

1. `index.tsx` apenas resolve dependências, conecta Hook + View e compõe o
   contrato;
2. `*View.tsx` apenas renderiza e não contém effects, services ou contexts;
3. o Hook usa declaração `function`, recebe dependências por parâmetros e
   concentra a lógica de UI;
4. o widget e seus componentes internos estão em diretórios próprios;
5. a navegação usa `useNavigation` e os componentes base disponíveis foram
   reutilizados.

`npm run check:architecture` não substitui esta auditoria: o sensor valida
fronteiras de dependência e não detecta violações do Widget Pattern.

## Notas

- Arquitetura do Widget Pattern: `documentation/architecture.md`.
- Testes de widgets: `documentation/rules/widget-tests-rules.md`.
- Tooling: `documentation/tooling.md`.
