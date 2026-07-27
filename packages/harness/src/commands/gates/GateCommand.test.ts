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
      package: ['@stardust/server'],
      testPath: [],
      runtimeTimeoutMs: '30000',
      extraCommandJson: [],
    })

    assert.deepEqual(
      steps.map((step) => step.name),
      [
        'scope-check',
        'codecheck:@stardust/server',
        'typecheck:@stardust/server',
        'test:unit:@stardust/server',
        'architecture-check',
        'migration-check',
        'contract-check',
      ],
    )
  })

  it('direciona codecheck, typecheck e testes para o pacote informado', () => {
    const steps = new ImplementationGateCommand().buildSteps({
      spec: 'documentation/features/example/specs/example-spec.md',
      base: 'HEAD',
      allowedPath: ['apps/web/**'],
      package: ['@stardust/web'],
      testPath: ['src/example/tests/example.test.ts'],
      runtimeTimeoutMs: '30000',
      extraCommandJson: [],
    })

    assert.deepEqual(
      steps.slice(1, 4).map((step) => step.command),
      [
        ['npm', 'run', 'codecheck', '--workspace', '@stardust/web'],
        ['npm', 'run', 'typecheck', '--workspace', '@stardust/web'],
        [
          'npm',
          'run',
          'test:unit',
          '--workspace',
          '@stardust/web',
          '--',
          '--runTestsByPath',
          'src/example/tests/example.test.ts',
        ],
      ],
    )
  })

  it('exige pacote quando recebe teste direcionado', () => {
    assert.throws(
      () =>
        new ImplementationGateCommand().buildSteps({
          spec: 'documentation/features/example/specs/example-spec.md',
          base: 'HEAD',
          allowedPath: ['apps/web/**'],
          package: [],
          testPath: ['src/example.test.ts'],
          runtimeTimeoutMs: '30000',
          extraCommandJson: [],
        }),
      /--package/,
    )
  })

  it('exige pacote em qualquer Implementation Gate', () => {
    assert.throws(
      () =>
        new ImplementationGateCommand().buildSteps({
          spec: 'documentation/features/example/specs/example-spec.md',
          base: 'HEAD',
          allowedPath: ['apps/server/**'],
          package: [],
          testPath: [],
          runtimeTimeoutMs: '30000',
          extraCommandJson: [],
        }),
      /Implementation Gate exige ao menos um --package/,
    )
  })

  it('exige paths permitidos nos gates de código', () => {
    assert.throws(
      () =>
        new ConclusionGateCommand().buildSteps({
          spec: 'documentation/features/example/specs/example-spec.md',
          base: 'HEAD',
          allowedPath: [],
          package: [],
          testPath: [],
          runtimeTimeoutMs: '30000',
          extraCommandJson: [],
        }),
      /allowed-path/,
    )
  })
})
