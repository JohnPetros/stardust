import JSZip from 'jszip'

import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { ExcelJsXlsxProvider } from '../ExcelJsXlsxProvider'

describe('ExcelJsXlsxProvider', () => {
  it('should keep user metrics as numeric cells in the exported worksheet', async () => {
    const provider = new ExcelJsXlsxProvider()
    const user = UsersFaker.fake()

    const file = await provider.generateUsersFile([user])
    const zip = await JSZip.loadAsync(await file.arrayBuffer())
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml')?.async('string')

    expect(sheetXml).toContain('<c r="C2"><v>')
    expect(sheetXml).toContain('<c r="D2"><v>')
    expect(sheetXml).toContain('<c r="E2"><v>')
    expect(sheetXml).toContain('<c r="F2"><v>')
    expect(sheetXml).toContain('<c r="G2"><v>')
    expect(sheetXml).not.toContain('<c r="C2" t="inlineStr">')
    expect(sheetXml).not.toContain('<c r="D2" t="inlineStr">')
    expect(sheetXml).not.toContain('<c r="E2" t="inlineStr">')
    expect(sheetXml).not.toContain('<c r="F2" t="inlineStr">')
    expect(sheetXml).not.toContain('<c r="G2" t="inlineStr">')
  })
})
