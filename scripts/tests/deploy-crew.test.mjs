import assert from 'node:assert/strict'
import { test } from 'node:test'

import { deployCrew } from '../deploy-crew.mjs'

const SHA = 'a'.repeat(40)

function createFixture(options = {}) {
  const calls = []
  const pauses = []
  const logs = []
  let pollCount = 0
  let healthCount = 0
  const env = {
    COOLIFY_API_TOKEN: 'fixture-only-token',
    COOLIFY_WEBHOOK_CREW_PROD:
      'https://coolify.example.test/api/v1/deploy?uuid=crew-1&force=false',
    CREW_API_URL: 'https://crew.example.test',
    GITHUB_SHA: SHA,
    ...options.env,
  }
  const request = async (url, config) => {
    calls.push({ url, config })
    if (url.endsWith('/health')) {
      healthCount += 1
      if (options.healthThrows) throw new Error('private HTTP failure')
      const status = options.healthStatus ?? (healthCount === 1 ? 503 : 200)
      return { status, json: async () => ({ status: options.healthBody ?? 'ok' }) }
    }
    if (options.httpError) return { ok: false, status: options.httpError }
    const body =
      config.method === 'POST'
        ? (options.created ?? {
            deployments: [{ deployment_uuid: 'deployment-1', resource_uuid: 'crew-1' }],
          })
        : {
            status: options.status ?? (pollCount++ === 0 ? 'queued' : 'finished'),
            commit: options.commit ?? SHA,
          }
    return { ok: true, json: async () => body }
  }
  return {
    calls,
    pauses,
    logs,
    args: {
      env,
      request,
      pause: async (delay) => pauses.push(delay),
      log: (message) => logs.push(message),
      deploymentAttempts: 3,
      healthAttempts: 3,
    },
  }
}

test('requests one deployment, verifies its commit and waits for healthy Crew', async () => {
  const fixture = createFixture()
  await deployCrew(fixture.args)
  assert.equal(fixture.calls[0].config.method, 'POST')
  assert.equal(fixture.calls[0].url, fixture.args.env.COOLIFY_WEBHOOK_CREW_PROD)
  assert.equal(fixture.calls[0].config.headers.Authorization, 'Bearer fixture-only-token')
  assert.equal(fixture.calls[0].config.redirect, 'error')
  assert.equal(
    fixture.calls[1].url,
    'https://coolify.example.test/api/v1/deployments/deployment-1',
  )
  const healthCalls = fixture.calls.filter((call) => call.url.endsWith('/health'))
  assert.equal(healthCalls.length, 2)
  assert.equal(healthCalls[0].config.headers, undefined)
  assert.deepEqual(fixture.pauses, [10_000, 5_000])
  assert.match(fixture.logs.at(-1), /health returned HTTP 200/)
  assert.ok(!fixture.logs.join('\n').includes('fixture-only-token'))
  assert.ok(!fixture.logs.join('\n').includes('uuid='))
})

test('accepts the legacy single deployment response and successful status', async () => {
  const fixture = createFixture({
    created: { deployment_uuid: 'deployment-1' },
    status: 'successful',
    healthStatus: 200,
  })
  await deployCrew(fixture.args)
  assert.equal(fixture.calls.length, 3)
})

test('requires the API token, deployment webhook, Crew URL and expected SHA before any call', async () => {
  for (const name of [
    'COOLIFY_API_TOKEN',
    'COOLIFY_WEBHOOK_CREW_PROD',
    'CREW_API_URL',
    'GITHUB_SHA',
  ]) {
    const fixture = createFixture({ env: { [name]: '' } })
    await assert.rejects(deployCrew(fixture.args), /Configure|GITHUB_SHA/)
    assert.equal(fixture.calls.length, 0)
  }
})

test('rejects insecure URLs, embedded credentials and ambiguous deployment targets', async () => {
  const invalidWebhooks = [
    'http://coolify.example.test/api/v1/deploy?uuid=crew-1',
    'https://user:private@coolify.example.test/api/v1/deploy?uuid=crew-1',
    'https://coolify.example.test/api/v1/deploy?uuid=crew-1,other',
    'https://coolify.example.test/api/v1/deploy?uuid=crew-1&uuid=other',
    'https://coolify.example.test/api/v1/deploy?tag=production',
    'https://coolify.example.test/api/v1/deploy?uuid=crew-1&pr=123',
    'https://coolify.example.test/api/v1/other?uuid=crew-1',
  ]
  for (const webhook of invalidWebhooks) {
    const fixture = createFixture({ env: { COOLIFY_WEBHOOK_CREW_PROD: webhook } })
    await assert.rejects(deployCrew(fixture.args), /HTTPS|exactly one/)
    assert.equal(fixture.calls.length, 0)
  }
  const fixture = createFixture({
    env: { CREW_API_URL: 'https://crew.example.test?private=query' },
  })
  await assert.rejects(deployCrew(fixture.args), /must not include a query/)
  assert.equal(fixture.calls.length, 0)
})

test('fails on an HTTP error instead of logging response bodies or retrying a deploy POST', async () => {
  const fixture = createFixture({ httpError: 401 })
  await assert.rejects(deployCrew(fixture.args), /HTTP 401/)
  assert.equal(fixture.calls.length, 1)
})

test('rejects missing, multiple, invalid and mismatched deployment results', async () => {
  for (const created of [
    {},
    { deployments: [] },
    { deployments: [{}, {}] },
    { deployments: [{ deployment_uuid: '../other' }] },
    { deployments: [{ deployment_uuid: 'deployment-1', resource_uuid: 'another-app' }] },
  ]) {
    const fixture = createFixture({ created })
    await assert.rejects(
      deployCrew(fixture.args),
      /exactly one|invalid deployment|different application/,
    )
    assert.equal(fixture.calls.length, 1)
  }
})

test('rejects failed or cancelled deployments without treating an old healthy app as success', async () => {
  for (const status of ['failed', 'cancelled', 'cancelled-by-user', 'unknown']) {
    const fixture = createFixture({ status, healthStatus: 200 })
    await assert.rejects(deployCrew(fixture.args), /failed, was cancelled/)
    assert.ok(!fixture.calls.some((call) => call.url.endsWith('/health')))
  }
})

test('times out when Coolify never finishes the deployment', async () => {
  const fixture = createFixture({ status: 'in_progress' })
  await assert.rejects(deployCrew(fixture.args), /Timed out waiting/)
  assert.equal(fixture.calls.length, 4)
  assert.ok(!fixture.calls.some((call) => call.url.endsWith('/health')))
})

test('refuses a successful deployment of the wrong commit before checking health', async () => {
  const fixture = createFixture({
    status: 'finished',
    commit: 'b'.repeat(40),
    healthStatus: 200,
  })
  await assert.rejects(deployCrew(fixture.args), /different commit/)
  assert.ok(!fixture.calls.some((call) => call.url.endsWith('/health')))
})

test('requires HTTP 200 and the Crew health payload, allowing bounded network and proxy recovery', async () => {
  for (const options of [
    { healthStatus: 503 },
    { healthStatus: 200, healthBody: 'unavailable' },
    { healthThrows: true },
  ]) {
    const fixture = createFixture(options)
    await assert.rejects(deployCrew(fixture.args), /Crew health did not return HTTP 200/)
    assert.equal(fixture.calls.filter((call) => call.url.endsWith('/health')).length, 3)
    assert.ok(!fixture.logs.some((line) => line.includes('verified')))
  }
})
