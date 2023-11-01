import { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Achievement } from '../Achievement'

import { achievementsMock } from '@/__tests__/mocks/achievementsMock'
import {
  AchivementsContext,
  AchivementsContextValue,
} from '@/contexts/AchievementsContext'

const achievementMock = achievementsMock[0]

const rescueAchivementMock = jest.fn()
const handleRescuedAchievementsAlertCloseMock = jest.fn()

jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation()

const wrapper = ({ children }: { children: ReactNode }) => (
  <AchivementsContext.Provider
    value={
      {
        rescueAchivement: rescueAchivementMock,
        handleRescuedAchievementsAlertClose:
          handleRescuedAchievementsAlertCloseMock,
      } as unknown as AchivementsContextValue
    }
  >
    {children}
  </AchivementsContext.Provider>
)

describe('Achievement component', () => {
  it('should render lock icon when is not unlocked', () => {
    render(
      <Achievement
        data={achievementMock}
        isUnlocked={false}
        isRescuable={false}
      />,
      { wrapper }
    )
    expect(screen.getByAltText(/Conquista bloqueada/i)).toBeInTheDocument()
    expect(screen.getByText(achievementMock.name)).toBeInTheDocument()
    expect(screen.getByText(achievementMock.description)).toBeInTheDocument()
  })

  it('should render progress bar when is not unlocked', () => {
    const currentProgress = 3
    const requireAmount = 10

    render(
      <Achievement
        data={{
          ...achievementMock,
          required_amount: requireAmount,
          currentProgress,
        }}
        isUnlocked={false}
        isRescuable={false}
      />,
      { wrapper }
    )

    expect(
      screen.getByText(`${currentProgress}/${requireAmount}`)
    ).toBeInTheDocument()
  })

  it('should render data correctly when is unlocked', () => {
    render(
      <Achievement
        data={achievementMock}
        isUnlocked={true}
        isRescuable={false}
      />,
      { wrapper }
    )

    expect(screen.getByAltText(/Conquista desbloqueada/i)).toBeInTheDocument()
    expect(screen.getByText(achievementMock.name)).toBeInTheDocument()
    expect(screen.getByText(achievementMock.description)).toBeInTheDocument()
  })

  it('should rescue achievement when is rescuable', async () => {
    render(
      <Achievement
        data={achievementMock}
        isUnlocked={true}
        isRescuable={true}
      />,
      { wrapper }
    )

    await userEvent.click(screen.getByText(/Resgatar/i))

    expect(rescueAchivementMock).toHaveBeenCalledWith(
      achievementMock.id,
      achievementMock.reward
    )
  })

  it('should open rescuable achievement dialog when is rescued', async () => {
    render(
      <Achievement
        data={achievementMock}
        isUnlocked={true}
        isRescuable={true}
      />,
      { wrapper }
    )

    await userEvent.click(screen.getByText(/Resgatar/i))

    expect(screen.getByRole('alertdialog')).toBeVisible()
  })

  it('should call a function when rescuable achievement dialog is closed', async () => {
    render(
      <Achievement
        data={achievementMock}
        isUnlocked={true}
        isRescuable={true}
      />,
      { wrapper }
    )

    await userEvent.click(screen.getByText(/Resgatar/i))

    await userEvent.click(screen.getByText(/Entendido/i))

    expect(handleRescuedAchievementsAlertCloseMock).toHaveBeenCalled()
  })
})
