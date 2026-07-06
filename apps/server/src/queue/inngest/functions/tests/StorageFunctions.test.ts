import { mock, type Mock } from 'ts-jest-mocker'

import type { SupabaseClient } from '@supabase/supabase-js'

import { InngestAmqp } from '../../InngestAmqp'
import { StorageFunctions } from '../StorageFunctions'

jest.mock('@/queue/jobs/storage', () => ({
  BackupDatabaseJob: jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue('backup-result'),
  })),
  GenerateTextBlockAudioJob: jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue('audio-result'),
  })),
  RemoveTextBlockAudioFileJob: jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue('remove-result'),
  })),
}))

jest.mock('@/provision/database', () => ({
  SupabaseDatabaseProvider: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@/provision/storage', () => ({
  DropboxStorageProvider: jest.fn().mockImplementation(() => ({})),
  SupabaseFileStorageProvider: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@/provision/tts', () => ({
  OpenAITtsProvider: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@/rest/axios/AxiosRestClient', () => ({
  AxiosRestClient: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@/database', () => ({
  SupabaseTextBlocksRepository: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('../../InngestAmqp', () => ({
  InngestAmqp: jest.fn().mockImplementation((context) => ({ context })),
}))

jest.mock('../../InngestBroker', () => ({
  InngestBroker: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('../../createMarkTextBlockAudioAsErrorOnFailure', () => ({
  createMarkTextBlockAudioAsErrorOnFailure: jest.fn().mockReturnValue(jest.fn()),
}))

describe('StorageFunctions', () => {
  let createFunction: jest.SpyInstance
  let supabase: Mock<SupabaseClient>

  beforeEach(() => {
    jest.clearAllMocks()
    supabase = mock<SupabaseClient>()
    createFunction = jest
      .spyOn(StorageFunctions.prototype as never, 'createFunction' as never)
      .mockImplementation(
        (options: unknown, handler: unknown) => ({ options, handler }) as never,
      )
  })

  afterEach(() => {
    createFunction.mockRestore()
  })

  it('should register backup and audio jobs only', async () => {
    const functions = new StorageFunctions({} as never)

    const registered = functions.getFunctions(supabase)

    expect(registered).toHaveLength(3)
    expect(createFunction).toHaveBeenCalledTimes(3)
  })

  it('should execute the backup handler with concrete providers', async () => {
    const functions = new StorageFunctions({} as never)
    const [backupFunction] = functions.getFunctions(supabase) as unknown as Array<{
      handler: () => Promise<unknown>
    }>

    await expect(backupFunction.handler()).resolves.toBe('backup-result')
  })

  it('should execute the text block audio handler with an amqp context', async () => {
    const functions = new StorageFunctions({} as never)
    const [, generateAudioFunction] = functions.getFunctions(
      supabase,
    ) as unknown as Array<{
      handler: (context: unknown) => Promise<unknown>
    }>
    const context = { event: { data: { starId: 'star-1' } } }

    await expect(generateAudioFunction.handler(context)).resolves.toBe('audio-result')
    expect(InngestAmqp).toHaveBeenCalledWith(context)
  })

  it('should execute the remove file handler with an amqp context', async () => {
    const functions = new StorageFunctions({} as never)
    const [, , removeFileFunction] = functions.getFunctions(
      supabase,
    ) as unknown as Array<{
      handler: (context: unknown) => Promise<unknown>
    }>
    const context = { event: { data: { fileName: 'audio.mp3' } } }

    await expect(removeFileFunction.handler(context)).resolves.toBe('remove-result')
    expect(InngestAmqp).toHaveBeenCalledWith(context)
  })
})
