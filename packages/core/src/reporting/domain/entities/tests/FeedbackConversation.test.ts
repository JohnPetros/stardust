import { FeedbackMessage } from '../FeedbackMessage'
import { FeedbackMessagesFaker } from '../fakers/FeedbackMessagesFaker'
import { FeedbackReportsFaker } from '../fakers/FeedbackReportsFaker'

describe('feedback conversation domain', () => {
  it('derives a title and tracks user activity/read snapshots monotonically', () => {
    const report = FeedbackReportsFaker.fake({
      content: '  A report with a useful title  ',
    })
    const firstUserMessageAt = new Date('2026-01-01T10:00:00.000Z')
    const laterUserMessageAt = new Date('2026-01-01T11:00:00.000Z')

    expect(report.title.value).toBe('A report with a useful title')
    report.registerMessage('user', firstUserMessageAt)
    report.markStudioRead(firstUserMessageAt)
    report.registerMessage('user', laterUserMessageAt)

    expect(report.isUnread).toBe(true)
    expect(report.studioReadAt).toEqual(firstUserMessageAt)
    expect(() => report.markStudioRead(new Date('2026-01-01T12:00:00.000Z'))).toThrow(
      'O registro de leitura deve referenciar uma mensagem de usuário conhecida',
    )
  })

  it('tracks administrative novelty independently and reads it monotonically', () => {
    const report = FeedbackReportsFaker.fake({
      content: `${'word '.repeat(20)}tail`,
    })
    const firstAdminMessageAt = new Date('2026-01-01T10:00:00.000Z')
    const secondAdminMessageAt = new Date('2026-01-01T11:00:00.000Z')

    report.registerActivity(firstAdminMessageAt, 'admin')
    expect(report.hasUnreadAdminReply).toBe(true)
    report.markAuthorRead(firstAdminMessageAt)
    expect(report.hasUnreadAdminReply).toBe(false)

    report.registerActivity(secondAdminMessageAt, 'admin')
    report.markAuthorRead(firstAdminMessageAt)
    expect(report.authorReadAt).toEqual(firstAdminMessageAt)
    expect(report.hasUnreadAdminReply).toBe(true)
    report.markAuthorRead(secondAdminMessageAt)
    expect(report.authorReadAt).toEqual(secondAdminMessageAt)
    expect(report.title.value.length).toBeLessThanOrEqual(60)
    expect(report.content.value).toContain('tail')
  })

  it('does not accept an administrative message beyond the known activity', () => {
    const report = FeedbackReportsFaker.fake()
    const knownMessageAt = new Date('2026-01-01T10:00:00.000Z')
    report.registerActivity(knownMessageAt, 'admin')

    expect(() => report.markAuthorRead(new Date('2026-01-01T10:00:01.000Z'))).toThrow(
      'mensagem administrativa conhecida',
    )
  })

  it('requires an existing administrative reply before closing', () => {
    const report = FeedbackReportsFaker.fake()

    expect(() => report.close()).toThrow(
      'O relatório de feedback não pode ser fechado sem uma resposta do administrador',
    )
    report.registerMessage('admin')
    report.close()
    expect(report.status.value).toBe('closed')
    expect(() => report.registerMessage('user')).toThrow(
      'O relatório de feedback está fechado',
    )
    report.reopen()
    expect(report.status.value).toBe('open')
  })

  it('trims message text and rejects more than three attachments', () => {
    const dto = FeedbackMessagesFaker.fakeDto({ content: '  reply  ' })
    expect(FeedbackMessage.create(dto).content.value).toBe('reply')
    expect(() =>
      FeedbackMessage.create({
        ...dto,
        attachments: Array.from({ length: 4 }, (_, index) => ({
          id: `00000000-0000-4000-8000-00000000000${index + 2}`,
          storageKey: `key-${index}`,
          originalName: `${index}.png`,
          mimeType: 'image/png',
          size: 1,
        })),
      }),
    ).toThrow('Uma mensagem aceita no máximo três anexos')
  })

  it('rejects attachments outside the image contract', () => {
    const dto = FeedbackMessagesFaker.fakeDto()

    expect(() =>
      FeedbackMessage.create({
        ...dto,
        attachments: [
          {
            id: '00000000-0000-4000-8000-000000000002',
            storageKey: 'images/feedback-messages/file',
            originalName: 'script.svg',
            mimeType: 'image/svg+xml',
            size: 1,
          },
        ],
      }),
    ).toThrow('Os anexos da mensagem devem ser imagens PNG ou JPEG')
  })
})
