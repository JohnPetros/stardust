import Page from '../page'

const fetchChallengeRoadmap = jest.fn()

jest.mock('@/rest/next/NextRestClient', () => ({
  NextRestClient: jest.fn(() => ({ setBaseUrl: jest.fn() })),
}))

jest.mock('@/rest/services/ChallengingService', () => ({
  ChallengingService: jest.fn(() => ({ fetchChallengeRoadmap })),
}))

jest.mock('@/ui/challenging/widgets/pages/ChallengeRoadmap', () => ({
  ChallengeRoadmap: (props: unknown) => props,
}))

describe('Challenge roadmap page', () => {
  beforeEach(() => jest.clearAllMocks())

  it('fetches the uncached snapshot and composes the roadmap widget', async () => {
    fetchChallengeRoadmap.mockResolvedValue({
      isFailure: false,
      body: { revision: { key: 'v1', version: 1 }, nodes: [], edges: [] },
    })

    const result = await Page()

    expect(fetchChallengeRoadmap).toHaveBeenCalledTimes(1)
    expect(result).toEqual(
      expect.objectContaining({ props: { initialRoadmap: expect.anything() } }),
    )
  })

  it('exposes a recoverable page error instead of rendering a partial graph', async () => {
    fetchChallengeRoadmap.mockResolvedValue({
      isFailure: true,
      errorMessage: 'Roadmap unavailable',
    })

    await expect(Page()).resolves.toEqual(
      expect.objectContaining({ props: { initialError: 'Roadmap unavailable' } }),
    )
  })

  it('converts a rejected snapshot request into a recoverable page error', async () => {
    fetchChallengeRoadmap.mockRejectedValueOnce(new Error('offline'))

    await expect(Page()).resolves.toEqual(
      expect.objectContaining({ props: { initialError: 'offline' } }),
    )
  })
})
