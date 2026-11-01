import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { test } from 'node:test'

import { reviewInputSchema } from '../../apps/crew/src/mastra/agents/pr-reviewer/schemas/review-input-schema.ts'

import {
  buildReviewInput,
  filterDiffHunks,
  listReviewedShas,
  runCrewReview,
  selectApplicableWorkflows,
  validateReview,
} from '../run-crew-pr-review.mjs'

const BASE = 'a'.repeat(40)
const HEAD = 'b'.repeat(40)
const RUN_ID = '00000000-0000-4000-8000-000000000001'
const REPOSITORY = 'JohnPetros/stardust'
const PR = {
  number: 1,
  draft: false,
  state: 'open',
  base: { sha: BASE, ref: 'main' },
  head: { sha: HEAD, repo: { full_name: REPOSITORY } },
}
const FINDING = {
  path: 'apps/crew/example.ts',
  line: 2,
  area: 'security',
  severity: 'P2',
  title: 'Valide a entrada',
  body: 'A entrada precisa de validação antes do uso.',
}

function readWorkflow(file) {
  try {
    return readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function makeOutput(overrides = {}) {
  return {
    scope: 'repository',
    head_sha: HEAD,
    review_status: 'complete',
    summary: 'Revisão concluída.',
    findings: [FINDING],
    ...overrides,
  }
}

function createFixture(options = {}) {
  const requests = []
  const publications = []
  const gitCalls = []
  const ciCalls = []
  let pollsCount = 0
  const changedPath = options.changedPath ?? FINDING.path
  const runGit = (...args) => {
    gitCalls.push(args)
    if (args[0] === 'fetch') return ''
    if (args[0] === 'rev-parse') return HEAD
    if (args[0] === 'merge-base') return BASE
    if (args[0] === 'ls-tree')
      return readdirSync(new URL('../../.github/workflows', import.meta.url)).join('\n')
    if (args[0] === 'show') {
      if (args[1].endsWith(':AGENTS.md')) return 'Trusted base instructions'
      if (args[1].endsWith(':documentation/rules/pr-review-rules.md'))
        return 'Trusted base policy'
      const file = args[1].slice(41)
      return readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8')
    }
    if (args.includes('--name-only'))
      return args.includes('--diff-filter=D') ? '' : `${changedPath}\0`
    return `diff --git a/${changedPath} b/${changedPath}\n--- a/${changedPath}\n+++ b/${changedPath}\n@@ -1 +1,2 @@\n first\n+second\n`
  }
  const api = async (path, body) => {
    if (body) {
      publications.push(body)
      return { id: 123 }
    }
    if (path.includes('/actions/runs?')) {
      ciCalls.push(path)
      const names = [
        'core-package',
        'server-app',
        'web-app',
        'studio-app',
        'backoffice-app',
        'crew-app',
      ]
      const runs = names.map((name, index) => ({
        id: index + 1,
        run_attempt: 1,
        head_sha: HEAD,
        path: `.github/workflows/${name}-ci.yaml`,
        status: 'completed',
        conclusion: 'success',
        pull_requests: [{ number: 1 }],
      }))
      return { workflow_runs: options.runs ? options.runs(runs, ciCalls.length) : runs }
    }
    if (path.includes('/reviews?')) return options.reviews ?? []
    if (path.includes('/comments?')) return options.comments ?? []
    return options.currentPr?.() ?? PR
  }
  const request = async (url, config) => {
    requests.push({ url, config })
    if (options.httpError) return { ok: false, status: options.httpError }
    const body =
      config.method === 'POST'
        ? { run_id: options.runId ?? RUN_ID, status: 'started' }
        : {
            run_id: RUN_ID,
            status: options.status ?? (pollsCount++ === 0 ? 'running' : 'completed'),
            output: options.output ?? makeOutput(),
          }
    return { ok: true, json: async () => body }
  }
  return {
    requests,
    publications,
    gitCalls,
    ciCalls,
    args: {
      event: { repository: { full_name: REPOSITORY }, pull_request: structuredClone(PR) },
      env: {
        CREW_API_URL: 'https://crew.example.test',
        PR_REVIEWER_API_KEY: 'fixture-only-key',
        GITHUB_RUN_ID: '100',
        GITHUB_RUN_ATTEMPT: '2',
      },
      api,
      runGit,
      request,
      pause: async () => {},
      log: () => {},
      ciAttempts: 2,
      reviewAttempts: 3,
    },
  }
}

test('calls Crew with the strict input and publishes RIGHT-side findings on the reviewed SHA', async () => {
  const fixture = createFixture()
  await runCrewReview(fixture.args)
  const { url, config } = fixture.requests[0]
  assert.equal(url, 'https://crew.example.test/pr-reviewer/v1/runs')
  assert.equal(config.redirect, 'error')
  assert.equal(config.headers.Authorization, 'Bearer fixture-only-key')
  assert.equal(config.headers['Idempotency-Key'], `crew:pr:1:${BASE}:${HEAD}:100:2`)
  const input = JSON.parse(config.body)
  assert.equal(reviewInputSchema.safeParse(input).success, true)
  assert.equal(input.repository, REPOSITORY)
  assert.equal(input.review_mode, 'full')
  assert.equal(input.agents_md, 'Trusted base instructions')
  assert.equal(input.review_md, 'Trusted base policy')
  assert.deepEqual(input.changed_lines, [{ path: FINDING.path, line: 2 }])
  assert.deepEqual(input.regression_facts, { deleted_files: [], changed_migrations: [] })
  assert.equal(fixture.requests.length, 3)
  assert.equal(fixture.publications.length, 1)
  const review = fixture.publications[0]
  assert.equal(review.commit_id, HEAD)
  assert.equal(review.event, 'COMMENT')
  assert.match(review.body, /Estado: \*\*Completa\*\*/)
  assert.equal(review.comments[0].side, 'RIGHT')
  assert.equal(review.comments[0].line, 2)
  assert.match(review.comments[0].body, /!\[P2\].*\*\*Valide a entrada\*\*/)
  assert.ok(fixture.gitCalls.every((args) => args[0] !== 'checkout'))
})

test('waits for Crew CI and refuses a failing Crew check before requesting a paid review', async () => {
  const pending = createFixture({
    runs: (runs, attempt) =>
      runs.map((run) =>
        run.path.endsWith('crew-app-ci.yaml') && attempt === 1
          ? { ...run, status: 'in_progress' }
          : run,
      ),
  })
  await runCrewReview(pending.args)
  assert.equal(pending.ciCalls.length, 2)
  const failed = createFixture({
    runs: (runs) =>
      runs.map((run) =>
        run.path.endsWith('crew-app-ci.yaml') ? { ...run, conclusion: 'failure' } : run,
      ),
  })
  await assert.rejects(runCrewReview(failed.args), /CI failed: crew-app-ci/)
  assert.equal(failed.requests.length, 0)
})

test('does not wait for path-filtered CI on documentation-only PRs', async () => {
  const fixture = createFixture({
    changedPath: 'documentation/example.md',
    output: makeOutput({ findings: [] }),
    runs: () => {
      throw new Error('CI should not be queried')
    },
  })
  await runCrewReview(fixture.args)
  assert.equal(fixture.publications[0].comments, undefined)
})

test('times out when an applicable CI has not started; ignores runs from other PRs', async () => {
  const fixture = createFixture({
    runs: (runs) => runs.map((run) => ({ ...run, pull_requests: [{ number: 2 }] })),
  })
  await assert.rejects(runCrewReview(fixture.args), /Timed out waiting/)
  assert.equal(fixture.requests.length, 0)
})

test('uses current CI path filters, including shared packages, workflow changes and renames', () => {
  assert.deepEqual(selectApplicableWorkflows(readWorkflow, ['apps/crew/a.ts']), [
    'crew-app-ci.yaml',
  ])
  assert.equal(selectApplicableWorkflows(readWorkflow, ['packages/core/a.ts']).length, 5)
  assert.equal(
    selectApplicableWorkflows(readWorkflow, ['.github/workflows/crew-pr-review.yaml'])
      .length,
    4,
  )
  assert.deepEqual(
    selectApplicableWorkflows(readWorkflow, [
      'apps/web/deleted.ts',
      'documentation/new.md',
    ]),
    ['web-app-ci.yaml'],
  )
  assert.deepEqual(selectApplicableWorkflows(readWorkflow, ['documentation/a.md']), [])
  assert.throws(
    () => selectApplicableWorkflows(() => '  pull_request:\n    paths: ["**"]', ['a']),
    /Unsupported/,
  )
})

test('recognizes both Studio and Backoffice CI during the administrative app rename', () => {
  for (const file of ['studio-app-ci.yaml', 'backoffice-app-ci.yaml']) {
    const source = '  pull_request:\n    paths:\n      - "apps/admin/**"\n'
    assert.deepEqual(
      selectApplicableWorkflows(
        (path) => (path.endsWith(file) ? source : null),
        ['apps/admin/example.ts'],
      ),
      [file],
    )
  }
})

test('skips forks, drafts and PRs outside main without touching credentials or APIs', async () => {
  for (const mutate of [
    (pr) => {
      pr.draft = true
    },
    (pr) => {
      pr.head.repo.full_name = 'external/fork'
    },
    (pr) => {
      pr.base.ref = 'production'
    },
  ]) {
    const fixture = createFixture()
    mutate(fixture.args.event.pull_request)
    fixture.args.api = () => {
      throw new Error('Must not access GitHub')
    }
    fixture.args.env = {}
    await runCrewReview(fixture.args)
    assert.equal(fixture.requests.length, 0)
  }
})

test('guards completed reviews only when authored by the Actions bot for this commit', async () => {
  const review = {
    state: 'COMMENTED',
    commit_id: HEAD,
    user: { login: 'github-actions[bot]' },
    body: `<!-- crew-code-review:${HEAD}:complete -->\nComplete`,
  }
  const completed = createFixture({ reviews: [review] })
  await runCrewReview(completed.args)
  assert.equal(completed.requests.length, 0)
  for (const change of [
    { user: { login: 'somebody' } },
    { state: 'PENDING' },
    { commit_id: BASE },
  ]) {
    const fixture = createFixture({ reviews: [{ ...review, ...change }] })
    await runCrewReview(fixture.args)
    assert.equal(fixture.publications.length, 1)
  }
})

test('validates credentials and forbids insecure URLs before sending any request', async () => {
  for (const env of [
    {},
    { CREW_API_URL: 'http://crew.example.test', PR_REVIEWER_API_KEY: 'fixture' },
  ]) {
    const fixture = createFixture()
    fixture.args.env = env
    await assert.rejects(runCrewReview(fixture.args), /GitHub secrets|HTTPS/)
    assert.equal(fixture.requests.length, 0)
  }
})

test('rejects stale, closed or newly drafted PRs before spending or posting', async () => {
  for (const current of [
    { ...PR, state: 'closed' },
    { ...PR, draft: true },
    { ...PR, head: { ...PR.head, sha: BASE } },
  ]) {
    const fixture = createFixture({ currentPr: () => current })
    await assert.rejects(runCrewReview(fixture.args), /refusing stale/)
    assert.equal(fixture.requests.length, 0)
  }
  const fixture = createFixture({
    currentPr: () => (fixture.requests.length ? { ...PR, state: 'closed' } : PR),
  })
  await assert.rejects(runCrewReview(fixture.args), /refusing stale/)
  assert.equal(fixture.publications.length, 0)
})

test('rejects malformed, stale and out-of-scope model findings without publishing them', async () => {
  const input = {
    head_sha: HEAD,
    changed_files: [FINDING.path],
    changed_lines: [{ path: FINDING.path, line: 2 }],
  }
  for (const output of [
    makeOutput({ head_sha: BASE }),
    makeOutput({ review_status: 'unknown' }),
    makeOutput({ findings: [{ ...FINDING, path: 'outside.ts' }] }),
    makeOutput({ findings: [{ ...FINDING, line: 1 }] }),
    makeOutput({ findings: [{ ...FINDING, line: 2.5 }] }),
    makeOutput({ findings: [{ ...FINDING, severity: 'P0' }] }),
    makeOutput({ findings: [{ ...FINDING, body: '' }] }),
  ]) {
    assert.throws(() => validateReview(output, input), /Invalid Crew/)
    const fixture = createFixture({ output })
    await assert.rejects(runCrewReview(fixture.args), /Invalid Crew/)
    assert.equal(fixture.publications.length, 0)
  }
})

test('publishes explicit partial/blocked outcomes and fails instead of claiming a clean review', async () => {
  for (const status of ['partial', 'blocked']) {
    const fixture = createFixture({
      output: makeOutput({ review_status: status, findings: [] }),
    })
    await assert.rejects(runCrewReview(fixture.args), /incomplete/)
    assert.match(fixture.publications[0].body, /não foi concluída integralmente/)
    assert.ok(!fixture.publications[0].body.includes(`:${HEAD}:complete -->`))
  }
})

test('fails safely on HTTP failures, invalid run IDs, failed runs and polling timeouts', async () => {
  for (const options of [
    { httpError: 401 },
    { runId: '../other-endpoint' },
    { status: 'failed' },
    { status: 'running' },
  ]) {
    const fixture = createFixture(options)
    await assert.rejects(
      runCrewReview(fixture.args),
      /HTTP 401|invalid run ID|review failed|timed out/,
    )
    assert.equal(fixture.publications.length, 0)
  }
})

test('deduplicates inline comments across a partial retry and within one result', async () => {
  const first = createFixture()
  await runCrewReview(first.args)
  const body = first.publications[0].comments[0].body
  const fixture = createFixture({
    output: makeOutput({ findings: [FINDING, FINDING] }),
    comments: [{ path: FINDING.path, line: 2, body }],
  })
  await runCrewReview(fixture.args)
  assert.equal(fixture.publications[0].comments, undefined)
  const duplicate = createFixture({
    output: makeOutput({ findings: [FINDING, FINDING] }),
  })
  await runCrewReview(duplicate.args)
  assert.equal(duplicate.publications[0].comments.length, 1)
})

test('paginates GitHub reviews before deciding to spend on another run', async () => {
  const fixture = createFixture()
  fixture.args.api = (path) => {
    if (path.includes('&page=1'))
      return Array.from({ length: 100 }, () => ({ body: 'unrelated' }))
    assert.match(path, /page=2/)
    return [
      {
        state: 'COMMENTED',
        commit_id: HEAD,
        user: { login: 'github-actions[bot]' },
        body: `<!-- crew-code-review:${HEAD}:complete -->`,
      },
    ]
  }
  await runCrewReview(fixture.args)
  assert.equal(fixture.requests.length, 0)
})

test('builds real git context for Unicode filenames, deletions, migrations and oversized diffs', () => {
  const directory = mkdtempSync(join(tmpdir(), 'crew-review-context-'))
  const runGit = (...args) =>
    execFileSync(
      'git',
      [
        '-c',
        'core.quotePath=false',
        '-c',
        'user.name=Crew Test',
        '-c',
        'user.email=crew-test@example.test',
        ...args,
      ],
      { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    )
  const write = (path, content) => {
    mkdirSync(dirname(join(directory, path)), { recursive: true })
    writeFileSync(join(directory, path), content)
  }
  try {
    runGit('init', '--quiet')
    write('AGENTS.md', 'Trusted instructions')
    write('documentation/rules/pr-review-rules.md', 'Trusted rules')
    write('deleted.txt', 'old\n')
    write('espaço-ação.txt', 'before\n')
    runGit('add', '.')
    runGit('commit', '--quiet', '-m', 'base')
    const base = runGit('rev-parse', 'HEAD').trim()
    rmSync(join(directory, 'deleted.txt'))
    write('AGENTS.md', 'UNTRUSTED PR INSTRUCTIONS')
    write('espaço-ação.txt', 'after\n')
    write('apps/crew/migrations/0001.sql', 'SELECT 1;\n')
    write('large.txt', `${'á'.repeat(100_000)}\n`)
    runGit('add', '.')
    runGit('commit', '--quiet', '-m', 'head')
    const head = runGit('rev-parse', 'HEAD').trim()
    const input = buildReviewInput(
      { ...PR, base: { sha: base }, head: { sha: head } },
      (...args) => {
        if (args[0] === 'fetch') return ''
        if (args[0] === 'rev-parse' && args[1] === 'FETCH_HEAD') return head
        return runGit(...args)
      },
    )
    assert.equal(input.agents_md, 'Trusted instructions')
    assert.equal(input.review_md, 'Trusted rules')
    assert.deepEqual(input.regression_facts.deleted_files, ['deleted.txt'])
    assert.deepEqual(input.regression_facts.changed_migrations, [
      'apps/crew/migrations/0001.sql',
    ])
    assert.ok(
      input.changed_lines.some(
        (line) => line.path === 'espaço-ação.txt' && line.line === 1,
      ),
    )
    assert.ok(!input.changed_lines.some((line) => line.path === 'deleted.txt'))
    assert.ok(Buffer.byteLength(input.diff) <= 180_000)
    assert.match(input.diff, /DIFF TRUNCATED/)
    assert.ok(!input.diff.includes('\uFFFD'))
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('rejects a force-pushed head while preparing the context', () => {
  const fixture = createFixture()
  assert.throws(
    () =>
      buildReviewInput(PR, (...args) =>
        args[0] === 'rev-parse' ? BASE : fixture.args.runGit(...args),
      ),
    /head changed while fetching/,
  )
})

const REVIEWED = 'c'.repeat(40)
const OLDER = 'd'.repeat(40)
const botReview = (sha, overrides = {}) => ({
  state: 'COMMENTED',
  commit_id: sha,
  user: { login: 'github-actions[bot]' },
  body: `<!-- crew-code-review:${sha}:complete -->\nComplete`,
  ...overrides,
})

test('lists reviewed SHAs most recent first, trusting only complete bot reviews on their own commit', () => {
  const reviews = [
    botReview(OLDER),
    botReview(REVIEWED),
    botReview(HEAD),
    botReview(BASE, { user: { login: 'somebody' } }),
    botReview(BASE, { state: 'PENDING' }),
    botReview(BASE, { commit_id: OLDER }),
    botReview(BASE, { body: `<!-- crew-code-review:${BASE}:partial -->` }),
  ]
  assert.deepEqual(listReviewedShas(reviews, HEAD), [REVIEWED, OLDER])
  assert.deepEqual(listReviewedShas([], HEAD), [])
})

function createRangeGit({
  prFiles,
  incrementalFiles,
  lines,
  rejectAncestors = [],
  missingCommits = [],
  deletions = { pr: [], incremental: [] },
  diff = 'diff',
}) {
  const calls = []
  const runGit = (...args) => {
    calls.push(args)
    const range = args.find((arg) => /^[0-9a-f]{40}\.\.[0-9a-f]{40}$/.test(arg))
    const isIncremental = range?.startsWith(REVIEWED)
    if (args[0] === 'fetch') return ''
    if (args[0] === 'rev-parse') return HEAD
    if (args[0] === 'cat-file') {
      if (missingCommits.includes(args[2].replace('^{commit}', '')))
        throw new Error('unknown commit')
      return ''
    }
    if (args.includes('--is-ancestor')) {
      if (rejectAncestors.includes(args[2])) throw new Error('not an ancestor')
      return ''
    }
    if (args[0] === 'merge-base') return BASE
    if (args[0] === 'show') return 'trusted'
    if (args.includes('--diff-filter=D'))
      return `${(isIncremental ? deletions.incremental : deletions.pr).join('\0')}\0`
    if (args.includes('--name-only'))
      return `${(isIncremental ? incrementalFiles : prFiles).join('\0')}\0`
    if (args.includes('--unified=0')) {
      const path = args.at(-1)
      const added = lines[isIncremental ? 'incremental' : 'pr'][path] ?? []
      return added.map((line) => `@@ -1,0 +${line} @@\n+x`).join('\n')
    }
    return diff
  }
  return { runGit, calls }
}

test('builds an incremental input from the last reviewed commit, scoped to the PR itself', () => {
  const { runGit, calls } = createRangeGit({
    prFiles: ['a.ts'],
    incrementalFiles: ['a.ts', 'from-main.ts'],
    lines: {
      pr: { 'a.ts': [2, 7] },
      incremental: { 'a.ts': [7, 9], 'from-main.ts': [1] },
    },
  })
  const input = buildReviewInput(PR, runGit, { reviewedShas: [REVIEWED, OLDER] })
  assert.equal(input.review_mode, 'incremental')
  assert.equal(input.range_base_sha, REVIEWED)
  assert.equal(input.base_sha, BASE)
  assert.deepEqual(input.changed_files, ['a.ts'])
  assert.deepEqual(input.changed_lines, [{ path: 'a.ts', line: 7 }])
  assert.equal(reviewInputSchema.safeParse(input).success, true)
  const diffCall = calls.find((args) => args.includes('--unified=40'))
  assert.ok(diffCall.includes(`${REVIEWED}..${HEAD}`))
  assert.deepEqual(diffCall.slice(diffCall.indexOf('--')), ['--', 'a.ts'])
})

test('falls back to the next reviewed commit, then to a full review, when history was rewritten', () => {
  const git = () =>
    createRangeGit({
      prFiles: ['a.ts'],
      incrementalFiles: ['a.ts'],
      lines: { pr: { 'a.ts': [2] }, incremental: { 'a.ts': [2] } },
      rejectAncestors: [REVIEWED],
    }).runGit
  const next = buildReviewInput(PR, git(), { reviewedShas: [REVIEWED, OLDER] })
  assert.equal(next.review_mode, 'incremental')
  assert.equal(next.range_base_sha, OLDER)
  const full = buildReviewInput(PR, git(), { reviewedShas: [REVIEWED] })
  assert.equal(full.review_mode, 'full')
  assert.equal(full.range_base_sha, BASE)
  assert.equal(buildReviewInput(PR, git()).review_mode, 'full')
})

test('publishes an incremental review while selecting CI by the whole PR', async () => {
  const fixture = createFixture({ reviews: [botReview(OLDER), botReview(REVIEWED)] })
  await runCrewReview(fixture.args)
  const input = JSON.parse(fixture.requests[0].config.body)
  assert.equal(input.review_mode, 'incremental')
  assert.equal(input.range_base_sha, REVIEWED)
  assert.equal(reviewInputSchema.safeParse(input).success, true)
  const ciRangeCall = fixture.gitCalls.find((args) => args.includes('--no-renames'))
  assert.equal(ciRangeCall.at(-1), `${BASE}..${HEAD}`)
  const review = fixture.publications[0]
  assert.match(review.body, /Escopo: \*\*Incremental\*\*.*`c{40}`/)
  assert.ok(review.body.startsWith(`<!-- crew-code-review:${HEAD}:complete -->`))
})

const MIXED_DIFF = [
  'diff --git a/a.ts b/a.ts',
  '--- a/a.ts',
  '+++ b/a.ts',
  '@@ -1,2 +1,3 @@',
  ' first',
  '+from the PR',
  ' last',
  '@@ -40,2 +41,3 @@',
  ' tail',
  '+from main',
  ' end',
  'diff --git a/from-main.ts b/from-main.ts',
  '--- a/from-main.ts',
  '+++ b/from-main.ts',
  '@@ -1 +1,2 @@',
  ' x',
  '+only main',
  'diff --git a/gone.ts b/gone.ts',
  'deleted file mode 100644',
  '--- a/gone.ts',
  '+++ /dev/null',
  '@@ -1 +0,0 @@',
  '-bye',
  '',
].join('\n')

test('keeps only the hunks that add commentable lines and files deleted by the PR', () => {
  const filtered = filterDiffHunks(MIXED_DIFF, [{ path: 'a.ts', line: 2 }])
  assert.match(filtered, /\+from the PR/)
  assert.doesNotMatch(filtered, /from main/)
  assert.doesNotMatch(filtered, /from-main\.ts/)
  assert.match(filtered, /diff --git a\/gone\.ts/)
  assert.ok(filtered.startsWith('diff --git a/a.ts b/a.ts\n--- a/a.ts'))
  assert.equal(filterDiffHunks('plain text', []), 'plain text')
})

test('sends only PR hunks of an incremental review to Crew', () => {
  const { runGit } = createRangeGit({
    prFiles: ['a.ts'],
    incrementalFiles: ['a.ts', 'from-main.ts'],
    lines: { pr: { 'a.ts': [2, 42] }, incremental: { 'a.ts': [2, 42], 'from-main.ts': [2] } },
    diff: MIXED_DIFF,
  })
  const input = buildReviewInput(PR, runGit, { reviewedShas: [REVIEWED] })
  assert.deepEqual(input.changed_lines, [
    { path: 'a.ts', line: 2 },
    { path: 'a.ts', line: 42 },
  ])
  assert.match(input.diff, /\+from the PR/)
  assert.match(input.diff, /\+from main/)
  assert.doesNotMatch(input.diff, /only main/)
})

test('falls back when the last reviewed commit is unknown locally', () => {
  const git = (missingCommits) =>
    createRangeGit({
      prFiles: ['a.ts'],
      incrementalFiles: ['a.ts'],
      lines: { pr: { 'a.ts': [2] }, incremental: { 'a.ts': [2] } },
      missingCommits,
    }).runGit
  const next = buildReviewInput(PR, git([REVIEWED]), { reviewedShas: [REVIEWED, OLDER] })
  assert.equal(next.review_mode, 'incremental')
  assert.equal(next.range_base_sha, OLDER)
  const full = buildReviewInput(PR, git([REVIEWED, OLDER]), {
    reviewedShas: [REVIEWED, OLDER],
  })
  assert.equal(full.review_mode, 'full')
  assert.equal(full.range_base_sha, BASE)
})

test('reports only deletions that belong to the PR in an incremental review', () => {
  const { runGit } = createRangeGit({
    prFiles: ['a.ts', 'removed-by-pr.ts'],
    incrementalFiles: ['a.ts', 'removed-by-pr.ts', 'removed-by-main.ts'],
    lines: { pr: {}, incremental: {} },
    deletions: {
      pr: ['removed-by-pr.ts'],
      incremental: ['removed-by-pr.ts', 'removed-by-main.ts'],
    },
  })
  const input = buildReviewInput(PR, runGit, { reviewedShas: [REVIEWED] })
  assert.deepEqual(input.regression_facts.deleted_files, ['removed-by-pr.ts'])
  assert.equal(
    buildReviewInput(PR, runGit).regression_facts.deleted_files.join(),
    'removed-by-pr.ts',
  )
})
