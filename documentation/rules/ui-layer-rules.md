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

> 💡 Regra pratica: integracoes e resolucao de dependencias acontecem no **Entry Point**.

## Regras

- **Tipagem**: props e retornos explicitamente tipados.
- **Exports**: preferir named exports (`export const`); evitar `export default`.
- **Integracao na borda**: dependencies (services, providers, contexts) resolvidas no Entry Point e passadas via props/params.

> ⚠️ Proibido:
> - Hook chamar hooks de context/service diretamente.
> - View conter `useEffect` ou chamadas de service.
> - UI importar `apps/server/**`.

## Organizacao e Nomeacao

- Pasta do widget: PascalCase.
- Entry Point: `index.tsx` (unico ponto de export publico do widget).
- View: sufixo `View` (ex: `ButtonView.tsx`).
- Hook: prefixo `use` (ex: `useButton.ts`).
- Tipos: `types/` quando a tipagem nao for trivial.

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
- Hook nao acessa contexts/providers; recebe dependencias via params.
- Integracao com dados acontece via RPC/REST.
- Props tipadas; exports sao named.

## Notas

- Arquitetura do Widget Pattern: `documentation/architecture.md`.
- Testes de widgets: `documentation/rules/widget-tests-rules.md`.
- Tooling: `documentation/tooling.md`.
