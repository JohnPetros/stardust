import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { temporaryDirectory } from '../../../utils/create-temporary-directory'
import { ArchitectureCheckCommand } from './ArchitectureCheckCommand'

test('architecture-check reports a forbidden monorepo import', () => {
  const directory = temporaryDirectory()
  const source = path.join(directory, 'packages/core/src/domain')
  fs.mkdirSync(source, { recursive: true })
  fs.writeFileSync(
    path.join(source, 'entity.ts'),
    "import x from '@stardust/server/database'\n",
  )

  const result = new ArchitectureCheckCommand().execute({
    roots: [directory],
    rules: [
      {
        id: 'CORE_NO_SERVER',
        from: 're:.*packages/core/src/.*',
        disallow: ['@stardust/server*'],
      },
    ],
  })

  assert.equal(result.passed, false)
  assert.equal(result.findings[0]?.code, 'CORE_NO_SERVER')
})
