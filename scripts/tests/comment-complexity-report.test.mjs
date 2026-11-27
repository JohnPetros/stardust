import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { commentComplexityReport } from '../comment-complexity-report.mjs'

const MARKER = '<!-- complexity-report:web -->'

async function comment(context, { comments = [], hasFindings, report = 'report\n' }) {
  const directory = mkdtempSync(join(tmpdir(), 'stardust-complexity-comment-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  const reportPath = join(directory, 'report.md')
  writeFileSync(reportPath, report)
  const requests = []
  const record = (action) => async (request) => requests.push({ action, ...request })
  const outcome = await commentComplexityReport({
    github: {
      paginate: async () => comments,
      rest: {
        issues: {
          createComment: record('create'),
          updateComment: record('update'),
        },
      },
    },
    context: {
      repo: { owner: 'owner', repo: 'repo' },
      issue: { number: 7 },
      serverUrl: 'https://github.com',
      runId: 42,
    },
    workspace: 'web',
    reportPath,
    hasFindings,
  })
  return { outcome, requests }
}

const existing = { id: 3, user: { type: 'Bot' }, body: `${MARKER}\nold` }

test('creates a comment when there is something to report', async (context) => {
  const { outcome, requests } = await comment(context, { hasFindings: true })

  assert.equal(outcome, 'created')
  assert.deepEqual(requests, [
    {
      action: 'create',
      owner: 'owner',
      repo: 'repo',
      issue_number: 7,
      body: `${MARKER}\nreport\n\n[View the run](https://github.com/owner/repo/actions/runs/42)`,
    },
  ])
})

test('posts nothing for a clean change without a comment', async (context) => {
  const { outcome, requests } = await comment(context, { hasFindings: false })

  assert.equal(outcome, 'skipped')
  assert.deepEqual(requests, [])
})

test('updates the existing comment once the change is clean', async (context) => {
  const { outcome, requests } = await comment(context, {
    comments: [existing],
    hasFindings: false,
  })

  assert.equal(outcome, 'updated')
  assert.equal(requests[0].action, 'update')
  assert.equal(requests[0].comment_id, 3)
})

test('ignores other workspaces and comments written by people', async (context) => {
  const { outcome } = await comment(context, {
    comments: [
      { ...existing, body: '<!-- complexity-report:core -->' },
      { ...existing, user: { type: 'User' } },
    ],
    hasFindings: true,
  })

  assert.equal(outcome, 'created')
})

test('shortens a report that GitHub would reject', async (context) => {
  const report = `<details>\n${'| row |\n'.repeat(10_000)}</details>\n`
  const { requests } = await comment(context, { hasFindings: true, report })
  const [{ body }] = requests

  assert.ok(body.length < 65_536)
  assert.match(body, /\| row \|\n\n<\/details>\n\nShortened\./)
})
