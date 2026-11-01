import { describe, expect, it } from 'vitest'

import { numberDiffLines } from '@/utils/number-diff-lines'

describe('numberDiffLines', () => {
  const diff = [
    'diff --git a/a.ts b/a.ts',
    '--- a/a.ts',
    '+++ b/a.ts',
    '@@ -10,3 +20,4 @@ function x() {',
    ' context',
    '-removed',
    '+added one',
    '+added two',
    ' tail',
    'diff --git a/b.ts b/b.ts',
    '--- a/b.ts',
    '+++ b/b.ts',
    '@@ -1 +1 @@',
    '-old',
    '+new',
  ].join('\n')

  it('prefixes new-file line numbers on context and added lines', () => {
    const lines = numberDiffLines(diff).split('\n')

    expect(lines[4]).toBe('    20 context')
    expect(lines[6]).toBe('    21+added one')
    expect(lines[7]).toBe('    22+added two')
    expect(lines[8]).toBe('    23 tail')
  })

  it('leaves removed lines without a number and does not advance the counter', () => {
    expect(numberDiffLines(diff).split('\n')[5]).toBe('      -removed')
  })

  it('keeps file and hunk headers untouched and restarts numbering per hunk', () => {
    const lines = numberDiffLines(diff).split('\n')

    expect(lines[0]).toBe('diff --git a/a.ts b/a.ts')
    expect(lines[2]).toBe('+++ b/a.ts')
    expect(lines[3]).toBe('@@ -10,3 +20,4 @@ function x() {')
    expect(lines[14]).toBe('     1+new')
  })

  it('does not treat a removed line that looks like a header as one', () => {
    const tricky = ['@@ -1,2 +5,1 @@', '--- a-dash-line', '+kept'].join('\n')

    expect(numberDiffLines(tricky).split('\n')).toEqual([
      '@@ -1,2 +5,1 @@',
      '      --- a-dash-line',
      '     5+kept',
    ])
  })

  it('passes through text outside hunks, such as the truncation notice', () => {
    expect(numberDiffLines('[DIFF TRUNCATED BY CI AT 180000 BYTES]')).toBe(
      '[DIFF TRUNCATED BY CI AT 180000 BYTES]',
    )
  })
})
