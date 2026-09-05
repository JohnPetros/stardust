import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('studio environment exporter has valid syntax', () =>
  assertScriptSyntax('export-studio-app-e2e-env.mjs'))
