import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('project setup script has valid syntax', () =>
  assertScriptSyntax('setup-project.mjs'))
