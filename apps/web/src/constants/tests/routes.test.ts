import { ROUTES } from '../routes'

describe('ROUTES', () => {
  it('builds the static official solution URL', () => {
    expect(
      ROUTES.challenging.challenges.challengeSolutions.official('o-codigo-espelhado'),
    ).toBe('/challenging/challenges/o-codigo-espelhado/challenge/solutions/official')
  })

  it('keeps user solution URLs on the dynamic route and reserves official', () => {
    const challengeSlug = 'o-codigo-espelhado'

    expect(
      ROUTES.challenging.challenges.challengeSolutions.solution(
        challengeSlug,
        'minha-solucao',
      ),
    ).toBe('/challenging/challenges/o-codigo-espelhado/challenge/solutions/minha-solucao')
    expect(
      ROUTES.challenging.challenges.challengeSolutions.official(challengeSlug),
    ).toContain('/solutions/official')
  })
})
