import { readFileSync } from 'node:fs'

import { upsertReportComment } from './upsert-report-comment.mjs'

// Keeps one coverage comment per workspace. The report already starts with the
// marker that write-coverage-report.mjs adds.
export function commentCoverageReport({ github, context, workspace, reportPath }) {
  return upsertReportComment({
    github,
    context,
    marker: `<!-- coverage-report:${workspace} -->`,
    body: readFileSync(reportPath, 'utf8'),
  })
}
