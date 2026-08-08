import { SupabaseFeedbackReportMapper } from '../SupabaseFeedbackReportMapper'
import type { SupabaseFeedbackReport } from '../../../types/SupabaseFeedbackReport'

describe('SupabaseFeedbackReportMapper', () => {
  it('maps author-owned RPC rows without administrative user metadata', () => {
    const row = {
      id: '00000000-0000-4000-8000-000000000001',
      content: 'Feedback content',
      intent: 'bug',
      screenshot: null,
      user_id: '00000000-0000-4000-8000-000000000002',
      title: 'Feedback title',
      status: 'open',
      created_at: '2026-08-06T00:00:00.000Z',
      last_activity_at: '2026-08-06T00:00:00.000Z',
      last_user_message_at: null,
      studio_read_at: null,
      last_admin_message_at: null,
      author_read_at: null,
      admin_message_count: 0,
      is_unread: false,
      preview: 'Feedback content',
      users: { name: 'A', slug: 'a', avatar: null },
    } as unknown as SupabaseFeedbackReport

    const dto = SupabaseFeedbackReportMapper.toEntity(row).dto

    expect(dto.author.entity).toEqual(
      expect.objectContaining({ name: 'Você', slug: 'voce' }),
    )
    expect(dto.author.entity?.avatar.name).toBe('Você')
    expect(dto.author.entity?.avatar.image).toBe('/images/profile.svg')
  })
})
