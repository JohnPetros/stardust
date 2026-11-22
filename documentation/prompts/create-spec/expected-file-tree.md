# Expected file tree

Every `Technical Contract` includes the `## Expected file tree` subsection, in compact and
full modes: a `text` block tree **per affected app/package** (`apps/server`, `apps/web`,
`apps/backoffice`, `packages/core`, etc.). A tree only in chat, or only the path map in a
table, does not replace it. The canonical map remains the source verified by
`check:spec-implementation`; the tree shows structure and ownership, and must contain
exactly the same paths as the map.

- Scope: files created, modified, generated, or removed and the directories that contain them.
  Use paths relative to the repository root and align the marker columns.
- Markers: `[N]` (`Create`), `[M]` (`Modify`), `[G]` (`Generate`), `[D]` (`Remove`), and
  `(unchanged)` only for a neighbor that clarifies ownership or composition. Do not list
  unchanged private helpers nor exhaustive catalogs.
- Core/Server layers: entities, structures, use-cases, ports, controllers, routers, jobs,
  repositories, mappers, migrations (never invent migration names), and the allowed tests
  in colocated `tests/`, plus the route group's `.rest` in
  `apps/server/rest-client/`.
- UI: the real ownership hierarchy: page/layout, reused components, child widgets
  nested under the owner, each `index.tsx` (Entry Point), `*View.tsx`, the colocated
  `use-*.ts` hook, and the allowed `tests/`. Do not stop at a top-level page or component when the
  approved composition has children. Components reused by more than one owner live at the
  appropriate module boundary. Explain the shared state and the local interaction
  responsibilities without duplicating state. Do not fabricate hooks or tests for purely
  structural children (View without behavior).
- Domain contexts and hooks: include the affected contexts with concrete file names
  (provider entry, value type, provider hook, consumer hook, and the allowed test of the
  provider hook) and the domain query/action hooks, without a generic hooks directory.
  Explain where the context is mounted, which branches share its state, and the direction between
  provider, operation hooks, and widget hooks; avoid cycles and duplicated state. Query/action
  hooks have no dedicated test files: point to the consumer or route that covers them
  in the `Verification Contract`.
- AI: with AI composition affected, show agent, structured output, workflow, Core port,
  model/provider adapter, and composition that belong to the slice, with the allowed tests,
  separating the included capabilities from the deferred ones.
- Reconcile the tree with the approved names and composition, the declarations, the path map,
  the Design Contract, and the paths of the `Verification Contract` before presenting the Spec. Private
  helpers and ordinary decomposition remain implementation choices: changing them, alone,
  does not require an amendment.

```text
apps/server/
├── rest-client/<module>/<group>.rest                                  [M]
├── src/<layer>/<module>/
│   ├── use-cases/get-example-use-case.ts                              [N]
│   └── tests/get-example-use-case.test.ts                             [N]
apps/web/
└── src/ui/<module>/widgets/pages/Example/
    ├── index.tsx                                                      [M]
    ├── ExamplePageView.tsx                                            [M]
    ├── useExamplePage.ts                                              [M]
    └── ExampleList/
        ├── index.tsx                                                  [N]
        └── ExampleListView.tsx                                        [N]
```
