import type { ReviewArea } from '@/mastra/agents/pr-reviewer/types/review-area'
import type { ReviewOutput } from '@/mastra/agents/pr-reviewer/types/review-output'

export class ReviewOutputFaker {
  fake(findings: Array<[path: string, line: number, area?: ReviewArea]>): ReviewOutput {
    return {
      scope: 'repository',
      head_sha: 'a'.repeat(40),
      review_status: 'complete',
      summary: 'Revisão concluída.',
      findings: findings.map(([path, line, area = 'security']) => ({
        path,
        line,
        severity: 'P2',
        area,
        title: 'Título',
        body: 'Corpo',
      })),
    }
  }
}
