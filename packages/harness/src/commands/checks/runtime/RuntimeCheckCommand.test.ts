import assert from 'node:assert/strict'
import http from 'node:http'
import test from 'node:test'

import { RuntimeCheckCommand } from './RuntimeCheckCommand'

test('runtime-smoke polls an existing HTTP server', async () => {
  const server = http.createServer((_request, response) => {
    response.writeHead(204).end()
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  assert.ok(address && typeof address !== 'string')

  try {
    const result = await new RuntimeCheckCommand().execute({
      url: `http://127.0.0.1:${address.port}`,
      expectedStatus: 204,
      timeoutMs: 1_000,
      intervalMs: 50,
    })
    assert.equal(result.passed, true)
  } finally {
    server.close()
  }
})
