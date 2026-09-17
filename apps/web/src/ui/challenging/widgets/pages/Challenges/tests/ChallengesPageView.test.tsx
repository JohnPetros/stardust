import { render, screen } from '@testing-library/react'

import { ChallengesPageView } from '../ChallengesPageView'

jest.mock('../ChallengesFilters', () => ({ ChallengesFilters: () => <div /> }))
jest.mock('../ChallengesList', () => ({ ChallengesList: () => <div /> }))
jest.mock('../WarningMessage', () => ({ WarningMessage: () => <div /> }))
jest.mock('../PostChallengeLink', () => ({ PostChallengeLink: () => <div /> }))
jest.mock('../BackPageLink', () => ({ BackPageLink: () => <div /> }))

describe('ChallengesPageView', () => {
  it('includes the roadmap/catalog switch', () => {
    render(<ChallengesPageView categoriesDto={[]} />)
    expect(screen.getByRole('link', { name: 'Roadmap' })).toBeInTheDocument()
  })
})
