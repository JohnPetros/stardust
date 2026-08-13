import { SupabaseFeedbackReportMapper } from '../SupabaseFeedbackReportMapper'
import type { SupabaseFeedbackReport } from '../../../types/SupabaseFeedbackReport'

describe('SupabaseFeedbackReportMapper', () => {
  it('maps rows with the owning user metadata', () => {
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
      users: {
        name: 'Petros',
        email: 'petros@example.com',
        slug: 'petros',
        avatar: { name: 'Astronaut', image: '/images/astronaut.svg' },
      },
    } as unknown as SupabaseFeedbackReport

    const dto = SupabaseFeedbackReportMapper.toEntity(row).dto

    expect(dto.author.entity).toEqual(
      expect.objectContaining({ name: 'Petros', slug: 'petros' }),
    )
    expect(dto.author.entity?.avatar).toEqual({
      name: 'Astronaut',
      image: '/images/astronaut.svg',
    })
  })
})
