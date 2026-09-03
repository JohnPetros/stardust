import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('web environment exporter has valid syntax', () =>
  assertScriptSyntax('export-web-app-e2e-env.mjs'))
