import { ChallengeNavigationFaker } from '../fakers'

describe('ChallengeNavigation Structure', () => {
  it('should be created with the provided previous and next challenge slugs', () => {
    const challengeNavigation = ChallengeNavigationFaker.fake({
      previousChallengeSlug: 'previous-challenge',
      nextChallengeSlug: 'next-challenge',
    })

    expect(challengeNavigation.previousChallengeSlug).toBe('previous-challenge')
    expect(challengeNavigation.nextChallengeSlug).toBe('next-challenge')
  })

  it('should allow null slugs when a previous or next challenge does not exist', () => {
    const challengeNavigation = ChallengeNavigationFaker.fake({
      previousChallengeSlug: null,
      nextChallengeSlug: null,
    })

    expect(challengeNavigation.previousChallengeSlug).toBeNull()
    expect(challengeNavigation.nextChallengeSlug).toBeNull()
  })

  it('should return its dto representation with the current navigation values', () => {
    const challengeNavigation = ChallengeNavigationFaker.fake({
      previousChallengeSlug: 'previous-challenge',
      nextChallengeSlug: null,
    })

    expect(challengeNavigation.dto).toEqual({
      previousChallengeSlug: 'previous-challenge',
      nextChallengeSlug: null,
    })
  })
})
