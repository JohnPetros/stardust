# Tooling

Execute os scripts na raiz para aproveitar o Turbo e o cache. Durante a
implementação, use `--filter` ou `-w` para limitar o feedback ao workspace
alterado; antes do PR, valide o escopo integrado.

## Scripts de qualidade

| Script | Ferramenta | Comportamento |
| --- | --- | --- |
| `npm run format` | Biome | formata e escreve arquivos |
| `npm run check:code` | Biome | lint/check read-only |
| `npm run check:types` | TypeScript | typecheck sem emissão |
| `npm run check:architecture` | dependency-cruiser | valida dependências entre camadas/apps |
| `npm run test:unit` | Jest/Vitest | executa testes unitários por workspace |
| `npm run test:integration` | Jest/Playwright | executa integrações declaradas pelos workspaces |

Exemplos de ciclo curto:

```bash
npm run format -- --filter=@stardust/core
npm run check:code -- --filter=@stardust/core
npm run check:types -- --filter=@stardust/core
npm run test:unit -- --filter=@stardust/core
```

Os limites do dependency-cruiser ficam em `.dependency-cruiser.cjs`. Altere essa
configuração somente para representar limites legítimos, nunca para ocultar uma
regressão.

## Ordem recomendada

1. `format`, `check:code`, `check:types` e `test:unit` durante o ciclo curto.
2. `check:architecture` quando a estrutura/imports estabilizarem.
3. `test:integration` para mudanças de integração ou antes da conclusão quando
   declarado na Spec.
4. Preflight local com todos os sensores aplicáveis antes do PR.
5. Quality Gate no CI, repetindo os checks do preflight.
6. build apenas no CI, depois do Quality Gate.

O Quality Gate do PR é a composição dos checks normais. Não existe baseline ou
quality ratchet próprio.

`check:dead-code` não faz parte dos sensores oficiais. Playwright MCP pode
inspecionar fluxos reais, mas não substitui `test:integration` automatizado.
