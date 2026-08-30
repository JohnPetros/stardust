import type { SupabaseClient } from '@supabase/supabase-js'
import type { Inngest } from 'inngest'

import { AnalyticsFunctions } from '../AnalyticsFunctions'
import { ChallengingFunctions } from '../ChallengingFunctions'
import { eventType, type InngestFunctions } from '../InngestFunctions'
import { LessonFunctions } from '../LessonFunctions'
import { ManualFunctions } from '../ManualFunctions'
import { NotificationFunctions } from '../NotificationFunctions'
import { ProfileFunctions } from '../ProfileFunctions'
import { RankingFunctions } from '../RankingFunctions'
import { ShopFunctions } from '../ShopFunctions'
import { SpaceFunctions } from '../SpaceFunctions'
import { StorageFunctions } from '../StorageFunctions'

jest.mock('@/ai/mastra/workflows/MastraCreateChallengeWorkflow', () => ({
  MastraCreateChallengeWorkflow: jest.fn().mockImplementation(() => ({})),
}))

function createInngestMock() {
  return {
    createFunction: jest.fn(),
  } as unknown as Inngest
}

function stubCreateFunction(instance: InngestFunctions) {
  const createFunction = jest.fn(() => Symbol('function'))

  ;(
    instance as unknown as {
      createFunction: typeof createFunction
    }
  ).createFunction = createFunction

  return createFunction
}

describe('Inngest function assembly', () => {
  const supabase = {} as SupabaseClient

  it('should keep eventType backward compatible', () => {
    expect(eventType('profile/user.created')).toBe('profile/user.created')
  })

  it('should assemble analytics functions', () => {
    const instance = new AnalyticsFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions()

    expect(functions).toHaveLength(16)
    expect(createFunction).toHaveBeenCalledTimes(16)
  })

  it('should assemble challenging functions', () => {
    const instance = new ChallengingFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(2)
    expect(createFunction).toHaveBeenCalledTimes(2)
  })

  it('should assemble lesson functions', () => {
    const instance = new LessonFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(3)
    expect(createFunction).toHaveBeenCalledTimes(3)
  })

  it('should assemble manual functions', () => {
    const instance = new ManualFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(0)
    expect(createFunction).toHaveBeenCalledTimes(0)
  })

  it('should assemble notification functions', () => {
    const instance = new NotificationFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions()

    expect(functions).toHaveLength(7)
    expect(createFunction).toHaveBeenCalledTimes(7)
  })

  it('should assemble profile functions', () => {
    const instance = new ProfileFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(2)
    expect(createFunction).toHaveBeenCalledTimes(2)
  })

  it('should assemble ranking functions', () => {
    const instance = new RankingFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(1)
    expect(createFunction).toHaveBeenCalledTimes(1)
  })

  it('should assemble shop functions', () => {
    const instance = new ShopFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(1)
    expect(createFunction).toHaveBeenCalledTimes(1)
  })

  it('should assemble space functions', () => {
    const instance = new SpaceFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(2)
    expect(createFunction).toHaveBeenCalledTimes(2)
  })

  it('should assemble storage functions', () => {
    const instance = new StorageFunctions(createInngestMock())
    const createFunction = stubCreateFunction(instance)

    const functions = instance.getFunctions(supabase)

    expect(functions).toHaveLength(4)
    expect(createFunction).toHaveBeenCalledTimes(4)
  })
})
