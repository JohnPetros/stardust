import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('command synchronizer has valid syntax', () =>
  assertScriptSyntax('sync-commands.mjs'))
