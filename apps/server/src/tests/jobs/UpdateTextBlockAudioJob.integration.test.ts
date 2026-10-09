import { asc, eq } from 'drizzle-orm'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { TextBlockAudioGeneratedEvent } from '@stardust/core/lesson/events'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { DrizzleTextBlocksRepository } from '@/database/drizzle/repositories'
import { starModel } from '@/database/drizzle/schema'
import { NoStepAmqp } from '@/queue/inngest/NoStepAmqp'
import { UpdateTextBlockAudioJob } from '@/queue/jobs/lesson/UpdateTextBlockAudioJob'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('UpdateTextBlockAudioJob real persistence for already-generated audio', () => {
  const fixture = new SupabaseFixture()
  const database = fixture.database
  const space = new SpaceFixture(fixture.supabase)
  const stars: CreatedStar[] = []
  beforeEach(async () => {
    await fixture.clearDatabase()
    stars.length = 0
    stars.push(await space.createStar())
  })
  afterEach(async () => {
    await space.cleanupCreatedStars(stars)
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  it('should replace only target pending audio with the generated filename and voice', async () => {
    const blocks: TextBlockDto[] = [
      {
        type: 'default',
        content: 'Generated narration',
        title: 'Narration title',
        picture: 'narration.jpg',
        isRunnable: false,
        audio: { fileName: '', voice: 'panda', status: 'pending' },
      },
      {
        type: 'quote',
        content: 'Unrelated narration',
        isRunnable: false,
        audio: { fileName: '', voice: 'shark', status: 'error' },
      },
      { type: 'code', content: 'escreva(1)', isRunnable: true },
    ]
    await database
      .update(starModel)
      .set({ texts: blocks })
      .where(eq(starModel.id, stars[0].id))
    const before = await database.select().from(starModel).orderBy(asc(starModel.id))
    const event = new TextBlockAudioGeneratedEvent({
      starId: stars[0].id,
      blockIndex: 0,
      voice: 'panda',
      fileName: 'already-generated-audio.mp3',
    })
    const job = new UpdateTextBlockAudioJob(
      new DrizzleTextBlocksRepository(database, { kind: 'system' }),
    )
    await job.handle(new NoStepAmqp(event.payload))
    const expected = blocks.map((block, index) =>
      index === 0
        ? {
            ...block,
            audio: { fileName: event.payload.fileName, voice: 'panda', status: 'done' },
          }
        : block,
    )
    expect(await database.select().from(starModel).orderBy(asc(starModel.id))).toEqual(
      before.map((row) => (row.id === stars[0].id ? { ...row, texts: expected } : row)),
    )
  })
})
