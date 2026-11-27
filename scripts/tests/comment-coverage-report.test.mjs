import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { commentCoverageReport } from '../comment-coverage-report.mjs'

const MARKER = '<!-- coverage-report:web -->'
const REPORT = `${MARKER}\n## Web test coverage\n`
const REPOSITORY = { owner: 'owner', repo: 'repo' }
const existing = { id: 3, user: { type: 'Bot' }, body: `${MARKER}\nold` }

async function comment(context, comments = []) {
  const directory = mkdtempSync(join(tmpdir(), 'stardust-coverage-comment-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  const reportPath = join(directory, 'coverage-comment.md')
  writeFileSync(reportPath, REPORT)
  const requests = []
  const record = (action) => async (request) => requests.push({ action, ...request })
  const outcome = await commentCoverageReport({
    github: {
      paginate: async () => comments,
      rest: {
        issues: {
          createComment: record('create'),
          updateComment: record('update'),
        },
      },
    },
    context: { repo: REPOSITORY, issue: { number: 7 } },
    workspace: 'web',
    reportPath,
  })
  return { outcome, requests }
}

test('creates the comment with the report as its body', async (context) => {
  const { outcome, requests } = await comment(context)

  assert.equal(outcome, 'created')
  assert.deepEqual(requests, [
    { action: 'create', ...REPOSITORY, issue_number: 7, body: REPORT },
  ])
})

test('updates the existing comment of the workspace', async (context) => {
  const { outcome, requests } = await comment(context, [existing])

  assert.equal(outcome, 'updated')
  assert.deepEqual(requests, [
    { action: 'update', ...REPOSITORY, comment_id: 3, body: REPORT },
  ])
})

test('ignores other workspaces and comments written by people', async (context) => {
  const { outcome } = await comment(context, [
    { ...existing, body: '<!-- coverage-report:core -->' },
    { ...existing, user: { type: 'User' } },
  ])

  assert.equal(outcome, 'created')
})
