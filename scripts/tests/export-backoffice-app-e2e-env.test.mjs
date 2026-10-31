import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('backoffice environment exporter has valid syntax', () =>
  assertScriptSyntax('export-backoffice-app-e2e-env.mjs'))
