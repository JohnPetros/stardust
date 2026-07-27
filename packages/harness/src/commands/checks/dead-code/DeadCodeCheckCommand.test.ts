import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { temporaryDirectory } from '../../../utils/create-temporary-directory'
import { DeadCodeCheckCommand } from './DeadCodeCheckCommand'

test('dead-code-check only reports files unreachable from explicit entrypoints', () => {
  const directory = temporaryDirectory()
  const source = path.join(directory, 'src')
  fs.mkdirSync(source)
  fs.writeFileSync(path.join(source, 'index.ts'), "export { value } from './used'\n")
  fs.writeFileSync(path.join(source, 'used.ts'), 'export const value = 1\n')
  fs.writeFileSync(path.join(source, 'orphan.ts'), 'export const orphan = 1\n')

  const result = new DeadCodeCheckCommand().execute({
    roots: [source],
    entrypoints: [path.join(source, 'index.ts')],
  })

  assert.equal(result.passed, false)
  assert.deepEqual(
    result.findings.map((finding) => path.basename(finding.file ?? '')),
    ['orphan.ts'],
  )
})
