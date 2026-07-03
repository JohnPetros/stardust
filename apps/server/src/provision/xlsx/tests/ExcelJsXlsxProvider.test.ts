import JSZip from 'jszip'

import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { ExcelJsXlsxProvider } from '../ExcelJsXlsxProvider'

const createIds = (length: number) =>
  Array.from(
    { length },
    (_, index) => `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  )

describe('ExcelJsXlsxProvider', () => {
  let provider: ExcelJsXlsxProvider

  beforeEach(() => {
    provider = new ExcelJsXlsxProvider()
  })

  it('should keep numeric cells typed as numbers in the generated worksheet', async () => {
    const user = UsersFaker.fake({
      level: 10,
      weeklyXp: 2500,
      unlockedStarsIds: createIds(8),
      unlockedAchievementsIds: createIds(3),
      completedChallengesIds: createIds(12),
    })

    const file = await provider.generateUsersFile([user])
    const zip = await JSZip.loadAsync(await file.arrayBuffer())
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml')?.async('string')

    expect(sheetXml).toContain('<c r="C2"><v>10</v></c>')
    expect(sheetXml).toContain('<c r="D2"><v>2500</v></c>')
    expect(sheetXml).toContain('<c r="E2"><v>7</v></c>')
    expect(sheetXml).toContain('<c r="F2"><v>3</v></c>')
    expect(sheetXml).toContain('<c r="G2"><v>12</v></c>')
    expect(sheetXml).toContain('<c r="B2" t="inlineStr">')
  })
})
