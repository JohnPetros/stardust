const HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/
const FILE_HEADER = 'diff --git '
const GUTTER_WIDTH = 6

export function numberDiffLines(diff: string): string {
  let newLine: number | null = null

  return diff
    .split('\n')
    .map((line) => {
      if (line.startsWith(FILE_HEADER)) {
        newLine = null
        return line
      }

      const hunk = HUNK_HEADER.exec(line)
      if (hunk) {
        newLine = Number(hunk[1])
        return line
      }

      if (newLine === null) return line

      if (line.startsWith('-')) return `${' '.repeat(GUTTER_WIDTH)}${line}`
      if (line.startsWith('+') || line.startsWith(' ')) {
        return `${String(newLine++).padStart(GUTTER_WIDTH)}${line}`
      }

      return line
    })
    .join('\n')
}
