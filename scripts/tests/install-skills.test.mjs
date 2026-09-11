import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('skills installer has valid syntax', () => assertScriptSyntax('install-skills.mjs'))
