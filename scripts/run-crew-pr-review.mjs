import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { matchesGlob, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const CI_WORKFLOWS = [
  'core-package-ci.yaml',
  'server-app-ci.yaml',
  'web-app-ci.yaml',
  'studio-app-ci.yaml',
  'backoffice-app-ci.yaml',
  'crew-app-ci.yaml',
]
const MAX_DIFF_BYTES = 180_000
const BOT_LOGIN = 'github-actions[bot]'
const REVIEW_MARKER = /^<!-- crew-code-review:([0-9a-f]{40}):complete -->/
const SEVERITY_COLORS = { P1: 'd73a4a', P2: 'f57c00', P3: 'd4a72c' }
const REVIEW_AREAS = [
  'security',
  'requirements',
  'architecture',
  'regression',
  'performance',
]
const sleep = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds))

class CrewReviewError extends Error {}

function git(...args) {
  return execFileSync('git', ['-c', 'core.quotePath=false', ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function github(path, body) {
  const args = ['api', path]
  if (body) args.push('--method', 'POST', '--input', '-')
  return JSON.parse(
    execFileSync('gh', args, {
      input: body ? JSON.stringify(body) : undefined,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'],
    }),
  )
}

async function listPages(api, path, key) {
  const items = []
  for (let page = 1; ; page += 1) {
    const response = await api(
      `${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`,
    )
    const batch = key ? response[key] : response
    items.push(...batch)
    if (batch.length < 100) return items
  }
}

// CI currently uses quoted block lists. Fail closed if this subset changes,
// rather than silently skipping a newly applicable check. Read the PR's YAML as data.
export function selectApplicableWorkflows(readWorkflow, changedFiles) {
  return CI_WORKFLOWS.filter((file) => {
    const source = readWorkflow(`.github/workflows/${file}`)
    if (!source) return false // Workflow deleted by this PR.
    if (!/^ {2}pull_request:\s*$/m.test(source) || /^ {4}paths-ignore:/m.test(source)) {
      throw new CrewReviewError(`Unsupported CI trigger in ${file}`)
    }
    const lines = source.split('\n')
    const start = lines.findIndex((line) => /^ {4}paths:/.test(line))
    if (start === -1) return true
    if (lines[start].trim() !== 'paths:')
      throw new CrewReviewError(`Unsupported CI paths in ${file}`)
    const patterns = []
    for (const line of lines.slice(start + 1)) {
      if (!line.trim() || line.trim().startsWith('#')) continue
      if (!/^ {6}/.test(line)) break
      const match = /^ {6}- ['"]([^'"\\]+)['"]\s*$/.exec(line)
      if (!match) throw new CrewReviewError(`Unsupported CI path in ${file}`)
      patterns.push(match[1])
    }
    if (!patterns.length) throw new CrewReviewError(`Empty CI paths in ${file}`)
    return changedFiles.some((path) => {
      let isIncluded = false
      for (const pattern of patterns) {
        const isExcluded = pattern.startsWith('!')
        if (matchesGlob(path, isExcluded ? pattern.slice(1) : pattern)) {
          isIncluded = !isExcluded
        }
      }
      return isIncluded
    })
  })
}

// Most recent first. Only complete reviews published by the Actions bot on the
// commit named in their own marker can seed an incremental range.
export function listReviewedShas(reviews, headSha) {
  return reviews
    .filter((review) => review.user?.login === BOT_LOGIN && review.state === 'COMMENTED')
    .map((review) => {
      const sha = REVIEW_MARKER.exec(review.body ?? '')?.[1]
      return sha && sha === review.commit_id && sha !== headSha ? sha : null
    })
    .filter(Boolean)
    .reverse()
}

function isReviewableAncestor(runGit, sha, headSha) {
  try {
    runGit('cat-file', '-e', `${sha}^{commit}`)
    runGit('merge-base', '--is-ancestor', sha, headSha)
    return true
  } catch {
    return false // Unknown commit or force-pushed away: fall back to the next one.
  }
}

function listChangedLines(runGit, diffArgs, range, paths) {
  const changedLines = []
  for (const path of paths) {
    const patch = runGit(...diffArgs, '--unified=0', range, '--', path)
    let lineNumber = null
    for (const line of patch.split('\n')) {
      const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line)
      if (hunk) lineNumber = Number(hunk[1])
      else if (lineNumber !== null && line.startsWith('+')) {
        changedLines.push({ path, line: lineNumber++ })
      } else if (lineNumber !== null && line.startsWith(' ')) lineNumber += 1
    }
  }
  return changedLines
}

export function buildReviewInput(pr, runGit = git, { reviewedShas = [] } = {}) {
  const base = pr.base.sha
  const head = pr.head.sha
  if (![base, head].every((sha) => /^[0-9a-f]{40}$/.test(sha))) {
    throw new CrewReviewError('Invalid PR commit SHA')
  }
  runGit('fetch', '--no-tags', 'origin', `refs/pull/${pr.number}/head`)
  if (runGit('rev-parse', 'FETCH_HEAD').trim() !== head) {
    throw new CrewReviewError('PR head changed while fetching')
  }
  const rangeBase = runGit('merge-base', base, head).trim()
  const prRange = `${rangeBase}..${head}`
  const diffArgs = ['diff', '--no-ext-diff', '--no-textconv', '--find-renames']
  const listPaths = (range, ...extra) =>
    runGit(...diffArgs, '--name-only', ...extra, '-z', range).split('\0').filter(Boolean)
  const prFiles = listPaths(prRange)

  // Incremental reviews cover only what changed since the last complete review, and
  // never anything a merge from main brought in: that is not part of the PR itself.
  const reviewedSha = reviewedShas.find((sha) => isReviewableAncestor(runGit, sha, head))
  const range = reviewedSha ? `${reviewedSha}..${head}` : prRange
  const inPr = new Set(prFiles)
  const changedFiles = reviewedSha ? listPaths(range).filter((p) => inPr.has(p)) : prFiles
  const deletedFiles = (reviewedSha
    ? listPaths(range, '--diff-filter=D')
    : listPaths(prRange, '--diff-filter=D')
  ).filter((path) => !reviewedSha || inPr.has(path))
  let changedLines = listChangedLines(runGit, diffArgs, range, changedFiles)
  if (reviewedSha) {
    const prLines = new Set(
      listChangedLines(runGit, diffArgs, prRange, changedFiles).map(
        ({ path, line }) => `${path}:${line}`,
      ),
    )
    changedLines = changedLines.filter(({ path, line }) => prLines.has(`${path}:${line}`))
  }
  let diff = runGit(
    ...diffArgs,
    '--unified=40',
    range,
    ...(reviewedSha && changedFiles.length ? ['--', ...changedFiles] : []),
  )
  if (Buffer.byteLength(diff) > MAX_DIFF_BYTES) {
    const suffix = '\n[DIFF TRUNCATED BY CI AT 180000 BYTES]\n'
    // Decode with streaming semantics to discard an incomplete final UTF-8 character.
    diff =
      new TextDecoder().decode(
        Buffer.from(diff).subarray(0, MAX_DIFF_BYTES - Buffer.byteLength(suffix)),
        { stream: true },
      ) + suffix
  }
  return {
    repository: 'JohnPetros/stardust',
    pull_number: pr.number,
    base_sha: base,
    head_sha: head,
    range_base_sha: reviewedSha ?? rangeBase,
    review_mode: reviewedSha ? 'incremental' : 'full',
    agents_md: runGit('show', `${base}:AGENTS.md`),
    review_md: runGit('show', `${base}:documentation/rules/pr-review-rules.md`),
    changed_files: changedFiles,
    changed_lines: changedLines,
    diff,
    regression_facts: {
      deleted_files: deletedFiles,
      changed_migrations: changedFiles.filter((path) =>
        /(?:^|\/)migrations\//.test(path),
      ),
    },
  }
}

export function validateReview(output, input) {
  const isText = (text) => typeof text === 'string' && text.trim().length > 0
  if (
    output?.scope !== 'repository' ||
    output.head_sha !== input.head_sha ||
    !['complete', 'partial', 'blocked'].includes(output.review_status) ||
    !isText(output.summary) ||
    !Array.isArray(output.findings) ||
    output.findings.length > 20
  ) {
    throw new CrewReviewError('Invalid Crew review output or mismatched head SHA')
  }
  const allowed = new Set(
    input.changed_lines.map(({ path, line }) => JSON.stringify([path, line])),
  )
  for (const finding of output.findings) {
    if (
      !Object.hasOwn(SEVERITY_COLORS, finding.severity) ||
      !REVIEW_AREAS.includes(finding.area) ||
      !isText(finding.path) ||
      !Number.isSafeInteger(finding.line) ||
      finding.line <= 0 ||
      !isText(finding.title) ||
      !isText(finding.body) ||
      !input.changed_files.includes(finding.path) ||
      !allowed.has(JSON.stringify([finding.path, finding.line]))
    ) {
      throw new CrewReviewError('Invalid Crew finding or location outside added PR lines')
    }
  }
  return output
}

function buildReviewBody(output, commentsCount, input) {
  const labels = { complete: 'Completa', partial: 'Parcial', blocked: 'Bloqueada' }
  const marker = `<!-- crew-code-review:${output.head_sha}:${output.review_status} -->`
  return (
    `${marker}\n## Revisão de código do Crew\n\n` +
    `Commit revisado: \`${output.head_sha}\`\nEstado: **${labels[output.review_status]}**\n` +
    (input.review_mode === 'incremental'
      ? `Escopo: **Incremental**, apenas as alterações desde \`${input.range_base_sha}\`\n`
      : '') +
    `Apontamentos nesta publicação: **${commentsCount}**\n\n${output.summary}\n\n` +
    (output.review_status !== 'complete'
      ? '**A revisão não foi concluída integralmente. Execute novamente após resolver o bloqueio.**'
      : '')
  )
}

export async function runCrewReview({
  event,
  env = process.env,
  api = github,
  runGit = git,
  request = fetch,
  pause = sleep,
  log = console.log,
  ciAttempts = 270,
  reviewAttempts = 150,
}) {
  const pr = event.pull_request
  if (
    event.repository?.full_name !== 'JohnPetros/stardust' ||
    !pr ||
    pr.draft ||
    pr.head.repo?.full_name !== 'JohnPetros/stardust' ||
    pr.base.ref !== 'main'
  ) {
    log('Crew review skipped: PR is draft, external, or outside main.')
    return
  }
  const root = `repos/JohnPetros/stardust/pulls/${pr.number}`
  const marker = `<!-- crew-code-review:${pr.head.sha}:complete -->`
  const reviews = await listPages(api, `${root}/reviews`)
  if (
    reviews.some(
      (review) =>
        review.user?.login === BOT_LOGIN &&
        review.state === 'COMMENTED' &&
        review.commit_id === pr.head.sha &&
        review.body?.startsWith(marker),
    )
  ) {
    log('This commit already has a complete Crew review.')
    return
  }
  if (!env.CREW_API_URL || !env.PR_REVIEWER_API_KEY) {
    throw new CrewReviewError(
      'Configure GitHub secrets CREW_API_URL and PR_REVIEWER_API_KEY',
    )
  }
  const crewUrl = new URL(env.CREW_API_URL)
  if (
    crewUrl.protocol !== 'https:' ||
    crewUrl.username ||
    crewUrl.password ||
    crewUrl.search ||
    crewUrl.hash
  ) {
    throw new CrewReviewError(
      'CREW_API_URL must be an HTTPS base URL without credentials, query or fragment',
    )
  }
  const input = buildReviewInput(pr, runGit, {
    reviewedShas: listReviewedShas(reviews, pr.head.sha),
  })
  if (!input.changed_files.length) {
    log('No changes to review.')
    return
  }
  const changedPaths = runGit(
    'diff',
    '--no-ext-diff',
    '--no-textconv',
    '--no-renames',
    '--name-only',
    '-z',
    // GitHub evaluates CI path filters against the whole PR, not the incremental range.
    `${runGit('merge-base', pr.base.sha, input.head_sha).trim()}..${input.head_sha}`,
  )
    .split('\0')
    .filter(Boolean)
  const workflowFiles = new Set(
    runGit('ls-tree', '--name-only', `${input.head_sha}:.github/workflows`)
      .trim()
      .split('\n'),
  )
  const expected = selectApplicableWorkflows((file) => {
    if (!workflowFiles.has(file.slice('.github/workflows/'.length))) return null
    return runGit('show', `${input.head_sha}:${file}`)
  }, changedPaths)
  const assertCurrentHead = async () => {
    const current = await api(root)
    if (
      current.state !== 'open' ||
      current.draft ||
      current.head.sha !== pr.head.sha ||
      current.base.sha !== pr.base.sha
    )
      throw new CrewReviewError('PR changed or closed; refusing stale review')
  }
  let isReady = expected.length === 0
  for (let attempt = 0; !isReady && attempt < ciAttempts; attempt += 1) {
    const runs = await listPages(
      api,
      `repos/JohnPetros/stardust/actions/runs?head_sha=${pr.head.sha}&event=pull_request`,
      'workflow_runs',
    )
    isReady = expected.every((file) => {
      const candidates = runs.filter(
        (run) =>
          run.path === `.github/workflows/${file}` &&
          run.head_sha === pr.head.sha &&
          run.pull_requests?.some((pull) => pull.number === pr.number),
      )
      const latest = candidates.sort(
        (a, b) => b.id - a.id || b.run_attempt - a.run_attempt,
      )[0]
      if (latest?.status !== 'completed') return false
      if (latest.conclusion !== 'success')
        throw new CrewReviewError(`CI failed: ${file} (${latest.conclusion})`)
      return true
    })
    if (!isReady) {
      await assertCurrentHead()
      log('Waiting for applicable Stardust CI, including Crew when triggered.')
      await pause(10_000)
    }
  }
  if (!isReady) throw new CrewReviewError('Timed out waiting for Stardust CI')
  await assertCurrentHead()

  const runsUrl = `${crewUrl.href.replace(/\/$/, '')}/pr-reviewer/v1/runs`
  async function crewApi(url, body) {
    const response = await request(url, {
      method: body ? 'POST' : 'GET',
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
      headers: {
        Authorization: `Bearer ${env.PR_REVIEWER_API_KEY}`,
        ...(body && {
          'Content-Type': 'application/json',
          'Idempotency-Key': `crew:pr:${pr.number}:${pr.base.sha}:${pr.head.sha}:${env.GITHUB_RUN_ID}:${env.GITHUB_RUN_ATTEMPT}`,
        }),
      },
      ...(body && { body: JSON.stringify(body) }),
    })
    if (!response.ok)
      throw new CrewReviewError(`Crew API failed with HTTP ${response.status}`)
    return response.json()
  }
  const created = await crewApi(runsUrl, input)
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(created.run_id)) {
    throw new CrewReviewError('Crew returned an invalid run ID')
  }
  let output
  for (let attempt = 0; attempt < reviewAttempts; attempt += 1) {
    const run = await crewApi(`${runsUrl}/${created.run_id}`)
    if (run.run_id !== created.run_id)
      throw new CrewReviewError('Crew returned a mismatched run ID')
    if (run.status === 'completed') {
      output = validateReview(run.output, input)
      break
    }
    if (!['started', 'running', 'stopping'].includes(run.status)) {
      throw new CrewReviewError('Crew review failed or returned an unexpected status')
    }
    await pause(10_000)
  }
  if (!output) throw new CrewReviewError('Crew review timed out')
  await assertCurrentHead()
  const existingComments = await listPages(api, `${root}/comments`)
  const comments = []
  for (const finding of output.findings) {
    const badge = `![${finding.severity}](https://img.shields.io/badge/prioridade-${finding.severity}-${SEVERITY_COLORS[finding.severity]}?style=flat)`
    const body = `${badge} **${finding.title}**\n\n${finding.body}`
    if (
      existingComments.some(
        (comment) =>
          comment.path === finding.path &&
          comment.line === finding.line &&
          comment.body === body,
      ) ||
      comments.some(
        (comment) =>
          comment.path === finding.path &&
          comment.line === finding.line &&
          comment.body === body,
      )
    )
      continue
    comments.push({ path: finding.path, line: finding.line, side: 'RIGHT', body })
  }
  await api(`${root}/reviews`, {
    commit_id: pr.head.sha,
    event: 'COMMENT',
    body: buildReviewBody(output, comments.length, input),
    ...(comments.length > 0 && { comments }),
  })
  log(
    `Crew review published: ${output.review_status}, ${comments.length} inline finding(s).`,
  )
  if (output.review_status !== 'complete')
    throw new CrewReviewError('Crew review is incomplete; see PR review')
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await runCrewReview({
      event: JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')),
    })
  } catch (error) {
    // Do not dump subprocess errors, HTTP responses or input containing private data.
    console.error(
      error instanceof CrewReviewError
        ? error.message
        : 'Crew review failed. Check GitHub access and Crew health; no private error details are logged.',
    )
    process.exitCode = 1
  }
}
