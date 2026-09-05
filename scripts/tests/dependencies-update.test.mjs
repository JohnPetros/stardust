import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('dependencies update script has valid syntax', () =>
  assertScriptSyntax('dependencies-update.mjs'))
