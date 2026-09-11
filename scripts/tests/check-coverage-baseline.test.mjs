import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('coverage baseline checker has valid syntax', () =>
  assertScriptSyntax('check-coverage-baseline.mjs'))
