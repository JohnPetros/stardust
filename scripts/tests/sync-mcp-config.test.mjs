import test from 'node:test'
import { assertScriptSyntax } from './helpers.mjs'

test('MCP synchronizer has valid syntax', () => assertScriptSyntax('sync-mcp-config.mjs'))
