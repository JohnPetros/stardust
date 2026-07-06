import JSZip from 'jszip'

import { Datetime } from '@stardust/core/global/libs'
import type { XlsxProvider } from '@stardust/core/global/interfaces'
import type { User } from '@stardust/core/profile/entities'

type CellValue = string | number

export class ExcelJsXlsxProvider implements XlsxProvider {
  async generateUsersFile(users: User[]): Promise<File> {
    const usersOrderedByCreationDate = [...users].sort(
      (firstUser, secondUser) =>
        secondUser.createdAt.getTime() - firstUser.createdAt.getTime(),
    )

    const rows: CellValue[][] = [
      [
        'userId',
        'Nome',
        'Nível',
        'XP Semanal',
        'Estrelas Desbloqueadas',
        'Conquistas Desbloqueadas',
        'Desafios Completados',
        'Status do Espaço',
        'Insígnias',
        'Data de Criação',
      ],
    ]

    for (const user of usersOrderedByCreationDate) {
      const userDto = user.dto

      rows.push([
        user.id.value,
        user.name.value,
        user.level.value.number.value,
        user.weeklyXp.value,
        user.unlockedStarsCount.value,
        user.unlockedAchievementsCount.value,
        user.completedChallengesCount.value,
        user.hasCompletedSpace.isTrue ? 'Completo' : 'Em progresso',
        userDto.insigniaRoles?.join(', ') || '-',
        new Datetime(user.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      ])
    }

    const fileDate = new Datetime().format('YYYY-MM-DD')
    const fileName = `users-export-${fileDate}.xlsx`
    const fileBuffer = await this.generateWorkbook(rows)

    return new File([fileBuffer], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      lastModified: Date.now(),
    })
  }

  private async generateWorkbook(rows: CellValue[][]): Promise<Uint8Array> {
    const zip = new JSZip()

    zip.file('[Content_Types].xml', this.getContentTypesXml())
    zip.file('_rels/.rels', this.getRootRelationshipsXml())
    zip.file('xl/workbook.xml', this.getWorkbookXml())
    zip.file('xl/_rels/workbook.xml.rels', this.getWorkbookRelationshipsXml())
    zip.file('xl/worksheets/sheet1.xml', this.getSheetXml(rows))

    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })
  }

  private getSheetXml(rows: CellValue[][]) {
    const sheetRows = rows
      .map((row, rowIndex) => {
        const cells = row
          .map((value, columnIndex) => {
            const cellReference = `${this.getColumnName(columnIndex)}${rowIndex + 1}`
            if (typeof value === 'number') {
              return `<c r="${cellReference}"><v>${value}</v></c>`
            }

            return `<c r="${cellReference}" t="inlineStr"><is><t>${this.escapeXml(value)}</t></is></c>`
          })
          .join('')

        return `<row r="${rowIndex + 1}">${cells}</row>`
      })
      .join('')

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`
  }

  private getColumnName(index: number) {
    let columnName = ''
    let columnNumber = index + 1

    while (columnNumber > 0) {
      const remainder = (columnNumber - 1) % 26
      columnName = String.fromCharCode(65 + remainder) + columnName
      columnNumber = Math.floor((columnNumber - 1) / 26)
    }

    return columnName
  }

  private escapeXml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  private getContentTypesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`
  }

  private getRootRelationshipsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`
  }

  private getWorkbookXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Usuarios" sheetId="1" r:id="rId1"/></sheets></workbook>`
  }

  private getWorkbookRelationshipsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`
  }
}
