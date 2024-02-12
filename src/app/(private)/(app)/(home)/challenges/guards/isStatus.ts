import type { Status } from '../types/Status'

export function isStatus(status: Status): status is Status {
  const possibleStatus: Status[] = ['all', 'completed', 'not-completed']

  return possibleStatus.includes(status)
}
