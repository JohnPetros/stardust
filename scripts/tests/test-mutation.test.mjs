import assert from 'node:assert/strict'
import test from 'node:test'

import { getUseCaseModule } from '../mutation-targets.mjs'
import { parseArguments, partitionFiles, selectChangedFiles } from '../test-mutation.mjs'

const CANDIDATES = [
  'src/forum/use-cases/PostCommentUseCase.ts',
  'src/shop/use-cases/BuyRocketUseCase.ts',
  'src/shop/use-cases/ListRocketsUseCase.ts',
]

test('targets only the source files directly inside a use-cases folder', () => {
  assert.equal(getUseCaseModule('src/shop/use-cases/BuyRocketUseCase.ts'), 'shop')
  assert.equal(
    getUseCaseModule('src/storage/use-cases/CreateSignedUploadUrl.ts'),
    'storage',
  )
  for (const path of [
    'src/shop/use-cases/index.ts',
    'src/shop/use-cases/tests/BuyRocketUseCase.test.ts',
    'src/shop/use-cases/BuyRocketUseCase.test.ts',
    'src/shop/use-cases/types.d.ts',
    'src/shop/domain/entities/Rocket.ts',
  ]) {
    assert.equal(getUseCaseModule(path), null, path)
  }
})

test('parses each way of choosing the scope', () => {
  assert.deepEqual(parseArguments(['--all', '--shard', '2/4']), {
    all: true,
    dryRun: false,
    files: [],
    shard: { index: 2, count: 4 },
  })
  assert.deepEqual(parseArguments(['--', '--files', 'a.ts', 'b.ts', '--dry-run']), {
    all: false,
    dryRun: true,
    files: ['a.ts', 'b.ts'],
  })
  assert.equal(parseArguments(['--base', 'HEAD']).base, 'HEAD')
})

test('rejects ambiguous or incomplete arguments', () => {
  for (const argumentsList of [
    ['--all', '--base', 'HEAD'],
    ['--all', '--files', 'a.ts'],
    ['--shard', '1/4'],
    ['--all', '--shard', '5/4'],
    ['--all', '--shard', '0/4'],
    ['--files'],
    ['--base'],
    ['--force'],
  ]) {
    assert.throws(
      () => parseArguments(argumentsList),
      /Usage|--shard/,
      argumentsList.join(' '),
    )
  }
})

test('splits every file into exactly one balanced shard, deterministically', () => {
  const files = [10, 40, 20, 30, 5].map((bytes) => ({ path: `${bytes}.ts`, bytes }))

  const shards = partitionFiles(files, 2)

  assert.deepEqual(shards, [
    ['10.ts', '40.ts', '5.ts'],
    ['20.ts', '30.ts'],
  ])
  assert.deepEqual(partitionFiles([...files].reverse(), 2), shards)
})

test('selects the changed use cases and the module of a changed test', () => {
  assert.deepEqual(
    selectChangedFiles(CANDIDATES, [
      'packages/core/src/forum/use-cases/PostCommentUseCase.ts',
      'packages/core/src/forum/use-cases/DeletedUseCase.ts',
      'apps/web/src/forum/use-cases/OtherUseCase.ts',
    ]),
    ['src/forum/use-cases/PostCommentUseCase.ts'],
  )
  assert.deepEqual(
    selectChangedFiles(CANDIDATES, [
      'packages/core/src/shop/use-cases/tests/BuyRocketUseCase.test.ts',
    ]),
    CANDIDATES.slice(1),
  )
})

test('asks for an explicit scope when a shared input changes', () => {
  assert.throws(
    () => selectChangedFiles(CANDIDATES, ['packages/core/jest.config.ts']),
    /--files or --all/,
  )
})
