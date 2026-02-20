import ExcelJS from 'exceljs'

import { Datetime } from '@stardust/core/global/libs'
import type { XlsxProvider } from '@stardust/core/global/interfaces'
import type { User } from '@stardust/core/profile/entities'

export class ExcelJsXlsxProvider implements XlsxProvider {
  async generateUsersFile(users: User[]): Promise<File> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Usuarios')
    const usersOrderedByCreationDate = [...users].sort(
      (firstUser, secondUser) =>
        secondUser.createdAt.getTime() - firstUser.createdAt.getTime(),
    )

    worksheet.columns = [
      { header: 'userId', key: 'userId', width: 36 },
      { header: 'Nome', key: 'name', width: 28 },
      { header: 'Nível', key: 'level', width: 10 },
      { header: 'XP Semanal', key: 'weeklyXp', width: 14 },
      { header: 'Estrelas Desbloqueadas', key: 'unlockedStars', width: 22 },
      {
        header: 'Conquistas Desbloqueadas',
        key: 'unlockedAchievements',
        width: 26,
      },
      {
        header: 'Desafios Completados',
        key: 'completedChallenges',
        width: 22,
      },
      { header: 'Status do Espaço', key: 'spaceStatus', width: 18 },
      { header: 'Insígnias', key: 'insignias', width: 30 },
      { header: 'Data de Criação', key: 'createdAt', width: 22 },
    ]

    for (const user of usersOrderedByCreationDate) {
      const userDto = user.dto

      worksheet.addRow({
        userId: user.id.value,
        name: user.name.value,
        level: user.level.value.number.value,
        weeklyXp: user.weeklyXp.value,
        unlockedStars: user.unlockedStarsCount.value,
        unlockedAchievements: user.unlockedAchievementsCount.value,
        completedChallenges: user.completedChallengesCount.value,
        spaceStatus: user.hasCompletedSpace.isTrue ? 'Completo' : 'Em progresso',
        insignias: userDto.insigniaRoles?.join(', ') || '-',
        createdAt: new Datetime(user.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      })
    }

    const fileDate = new Datetime().format('YYYY-MM-DD')
    const fileName = `users-export-${fileDate}.xlsx`
    const fileBuffer = await workbook.xlsx.writeBuffer()

    return new File([fileBuffer], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      lastModified: Date.now(),
    })
  }
}
