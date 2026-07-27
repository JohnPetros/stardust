import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { temporaryDirectory } from '../../../utils/create-temporary-directory'
import { MigrationCheckCommand } from './MigrationCheckCommand'

test('migration-check validates names, duplicates and empty files', () => {
  const directory = temporaryDirectory()
  fs.writeFileSync(path.join(directory, '20260723120000_valid_name.sql'), 'select 1;\n')
  fs.writeFileSync(path.join(directory, 'invalid.sql'), '')

  const result = new MigrationCheckCommand().execute({ directories: [directory] })

  assert.equal(result.passed, false)
  assert.deepEqual(
    result.findings.map((finding) => finding.code),
    ['INVALID_MIGRATION_NAME'],
  )
})
