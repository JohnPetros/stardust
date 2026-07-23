import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { ConclusionGateCommand } from './conclusion/ConclusionGateCommand'
import { DefinitionGateCommand } from './definition/DefinitionGateCommand'
import { ImplementationGateCommand } from './implementation/ImplementationGateCommand'

describe('harness gate runner', () => {
  it('compõe o Definition Gate somente com spec-check', () => {
    const steps = new DefinitionGateCommand().buildSteps({
      spec: 'documentation/features/example/specs/example-spec.md',
    })

    assert.deepEqual(
      steps.map((step) => step.name),
      ['spec-check'],
    )
  })

  it('compõe checks obrigatórios do Implementation Gate', () => {
    const steps = new ImplementationGateCommand().buildSteps({
      spec: 'documentation/features/example/specs/example-spec.md',
      base: 'HEAD',
      allowedPath: ['apps/server/**'],
      workspace: ['server'],
      runtimeTimeoutMs: '30000',
      extraCommandJson: [],
    })

    assert.deepEqual(
      steps.map((step) => step.name),
      [
        'scope-check',
        'codecheck',
        'typecheck',
        'test:unit',
        'quality-ratchet:server',
        'architecture-check',
        'migration-check',
        'contract-check',
      ],
    )
  })

  it('exige paths permitidos nos gates de código', () => {
    assert.throws(
      () =>
        new ConclusionGateCommand().buildSteps({
          spec: 'documentation/features/example/specs/example-spec.md',
          base: 'HEAD',
          allowedPath: [],
          workspace: [],
          runtimeTimeoutMs: '30000',
          extraCommandJson: [],
        }),
      /allowed-path/,
    )
  })
})
