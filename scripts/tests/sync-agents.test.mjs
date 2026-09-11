import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('agent synchronizer has valid syntax', () => assertScriptSyntax('sync-agents.mjs'))
