import { act } from 'react-dom/test-utils'
import { ToastProvider } from '@radix-ui/react-toast'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AchievementsList } from '../AchievementsList'

import { achievementsMock } from '@/__tests__/mocks/achievementsMock'
import { usersMock } from '@/__tests__/mocks/usersMock'
import { AchivementsContext } from '@/contexts/AchievementsContext'
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'

const rescueAchivementMock = jest.fn()
const handleRescuedAchievementsAlertCloseMock = jest.fn()

jest.useFakeTimers()

function renderAchievementsList() {
  act(() => {
    jest.runOnlyPendingTimers()
  })

  render(
    <SupabaseProvider>
      <ToastProvider>
        <AuthContext.Provider
          value={
            {
              user: usersMock,
            } as unknown as AuthContextValue
          }
        >
          <AchivementsContext.Provider
            value={{
              achievements: achievementsMock,
              rescueAchivement: rescueAchivementMock,
              handleRescuedAchievementsAlertClose:
                handleRescuedAchievementsAlertCloseMock,
              rescueableAchievementsAmount: 0,
            }}
          >
            <AchievementsList />
          </AchivementsContext.Provider>
        </AuthContext.Provider>
      </ToastProvider>
    </SupabaseProvider>
  )
}

jest.useFakeTimers()

describe('AchievementsList component', () => {
  it('should render a loading when achivements are not loaded yet', async () => {
    renderAchievementsList()

    expect(screen.getByTestId('loading')).toBeVisible()
  })
  it.each(achievementsMock)('should render $name achievement', ({ name }) => {
    renderAchievementsList()

    expect(screen.getByText(name)).toBeInTheDocument()
  })
})
