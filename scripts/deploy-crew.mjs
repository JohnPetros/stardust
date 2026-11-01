import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const UUID_PATTERN = /^[a-zA-Z0-9_-]+$/
const sleep = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds))

class CrewDeploymentError extends Error {}

function parseHttpsUrl(value, variable) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new CrewDeploymentError(`Configure a valid ${variable}`)
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
    throw new CrewDeploymentError(
      `${variable} must use HTTPS without embedded credentials or fragment`,
    )
  }
  return url
}

export async function deployCrew({
  env = process.env,
  request = fetch,
  pause = sleep,
  log = console.log,
  deploymentAttempts = 180,
  healthAttempts = 24,
} = {}) {
  if (!env.COOLIFY_API_TOKEN?.trim())
    throw new CrewDeploymentError('Configure COOLIFY_API_TOKEN')
  if (!/^[a-f0-9]{40}$/.test(env.GITHUB_SHA ?? ''))
    throw new CrewDeploymentError('Invalid GITHUB_SHA')
  const webhook = parseHttpsUrl(
    env.COOLIFY_WEBHOOK_CREW_PROD,
    'COOLIFY_WEBHOOK_CREW_PROD',
  )
  const crew = parseHttpsUrl(env.CREW_API_URL, 'CREW_API_URL')
  if (crew.search) throw new CrewDeploymentError('CREW_API_URL must not include a query')
  const resourceId = webhook.searchParams.get('uuid')
  if (
    webhook.pathname !== '/api/v1/deploy' ||
    !resourceId ||
    !UUID_PATTERN.test(resourceId) ||
    webhook.searchParams.getAll('uuid').length !== 1 ||
    webhook.searchParams.has('tag') ||
    webhook.searchParams.has('pr') ||
    webhook.searchParams.has('pull_request_id')
  ) {
    throw new CrewDeploymentError(
      'COOLIFY_WEBHOOK_CREW_PROD must target exactly one application UUID',
    )
  }

  async function coolifyApi(url, method = 'GET') {
    const response = await request(url, {
      method,
      headers: {
        Authorization: `Bearer ${env.COOLIFY_API_TOKEN}`,
        Accept: 'application/json',
      },
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok)
      throw new CrewDeploymentError(`Coolify request failed with HTTP ${response.status}`)
    return response.json()
  }

  const created = await coolifyApi(webhook.href, 'POST')
  const deployments = created.deployments ?? [created]
  if (!Array.isArray(deployments) || deployments.length !== 1) {
    throw new CrewDeploymentError('Coolify must return exactly one deployment')
  }
  const deployment = deployments[0]
  if (
    typeof deployment?.deployment_uuid !== 'string' ||
    !UUID_PATTERN.test(deployment.deployment_uuid) ||
    (deployment.resource_uuid && deployment.resource_uuid !== resourceId)
  ) {
    throw new CrewDeploymentError(
      'Coolify returned an invalid deployment or a different application',
    )
  }
  const statusUrl = new URL(
    `/api/v1/deployments/${deployment.deployment_uuid}`,
    webhook.origin,
  )
  let isDeployed = false
  for (let attempt = 0; attempt < deploymentAttempts; attempt += 1) {
    const result = await coolifyApi(statusUrl.href)
    if (['finished', 'successful'].includes(result.status)) {
      if (result.commit !== env.GITHUB_SHA) {
        throw new CrewDeploymentError(
          'Coolify deployed a different commit; refusing to mark this revision successful',
        )
      }
      isDeployed = true
      break
    }
    if (!['queued', 'in_progress', 'running'].includes(result.status)) {
      throw new CrewDeploymentError(
        'Coolify deployment failed, was cancelled, or returned an unexpected status',
      )
    }
    log('Waiting for the Crew deployment in Coolify.')
    await pause(10_000)
  }
  if (!isDeployed)
    throw new CrewDeploymentError('Timed out waiting for the Crew deployment')

  const healthUrl = `${crew.href.replace(/\/$/, '')}/health`
  for (let attempt = 0; attempt < healthAttempts; attempt += 1) {
    try {
      const response = await request(healthUrl, {
        method: 'GET',
        redirect: 'error',
        signal: AbortSignal.timeout(10_000),
      })
      if (response.status === 200 && (await response.json()).status === 'ok') {
        log(
          `Crew deployment verified at commit ${env.GITHUB_SHA}; health returned HTTP 200.`,
        )
        return
      }
    } catch {
      // Allow the proxy and database health to settle without printing response bodies or URLs.
    }
    await pause(5_000)
  }
  throw new CrewDeploymentError(
    'Crew health did not return HTTP 200 with status ok after deployment',
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await deployCrew()
  } catch (error) {
    console.error(
      error instanceof CrewDeploymentError
        ? error.message
        : 'Crew deployment failed; check Coolify logs. Private error details are not logged.',
    )
    process.exitCode = 1
  }
}
