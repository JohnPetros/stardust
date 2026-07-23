import assert from 'node:assert/strict'
import test from 'node:test'

import { ContractCheckCommand } from './ContractCheckCommand'

test('contract-check validates traceability and explicit command evidence', () => {
  const content = `# Spec

## Parte I — Contract

| Critério | Requisito | Evidência |
|---|---|---|
| AC-01 | REQ-01 | automatizada |

<!-- harness:evidence {"criterion":"AC-01","command":["node","--version"]} -->

## Parte II — Especificação Técnica

A implementação referencia AC-01 e pode mencionar AC-99 sem redefinir o Contract.
`
  const inspection = new ContractCheckCommand().execute(content)

  assert.equal(inspection.result.passed, true)
  assert.deepEqual(inspection.evidence[0]?.command, ['node', '--version'])
})
