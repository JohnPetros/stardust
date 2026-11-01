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
