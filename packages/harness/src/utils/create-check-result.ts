export type CheckFinding = {
  code: string
  message: string
  path?: string
  file?: string
  detail?: string
}

type BaseCheckResult = {
  check: string
  passed: boolean
  findings: CheckFinding[]
  evidence?: Record<string, unknown>
}

export type CheckResult = BaseCheckResult & {
  details?: unknown
}

export type DetailedCheckResult<T> = BaseCheckResult & {
  details: T
}

export function createResult<T>(
  check: string,
  findings: CheckFinding[],
  details: T,
): DetailedCheckResult<T> {
  return {
    check,
    passed: findings.length === 0,
    findings,
    details,
  }
}

export function errorResult(check: string, error: unknown): CheckResult {
  return {
    check,
    passed: false,
    findings: [
      {
        code: 'CHECK_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    ],
  }
}
