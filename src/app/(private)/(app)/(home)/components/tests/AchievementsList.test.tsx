import { act } from 'react-dom/test-utils'
import { ToastProvider } from '@radix-ui/react-toast'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AchievementsList } from '../AchievementsList'

import { achievementsMock } from '@/__tests__/mocks/achievementsMock'
import { usersMock } from '@/__tests__/mocks/usersMock'
import { Achievement } from '@/@types/Achievement'
import { AchivementsContext } from '@/contexts/AchievementsContext'
import {
  AuthContext,
  AuthContextValue,
} from '@/contexts/AuthContext/hooks/useAuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'

const rescueAchivementMock = jest.fn()
const handleRescuedAchievementsAlertCloseMock = jest.fn()

jest.useFakeTimers()

function renderAchievementsList(
  achievements: Achievement[] = achievementsMock
) {
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
              achievements,
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

  act(() => {
    jest.runOnlyPendingTimers()
  })
}

describe('AchievementsList component', () => {
  it('should render a loading when achivements are not loaded yet', async () => {
    renderAchievementsList()

    expect(screen.getByTestId('loading')).toBeVisible()
  })
  it.each(achievementsMock)('should render $name achievement', ({ name }) => {
    renderAchievementsList()

    expect(screen.getByText(name)).toBeInTheDocument()
  })

  it('should filter achievements list by search', async () => {
    const search = 'achievement search mock'
    const user = await userEvent.setup({ delay: null })

    renderAchievementsList([
      ...achievementsMock,
      { ...achievementsMock[0], name: search + '1' },
      { ...achievementsMock[1], name: search + '2' },
    ])

    const input = screen.getByRole('textbox')
    user.type(input, search)

    const filteredAchievements = screen.getAllByText(new RegExp(search, 'i'))

    expect(filteredAchievements.length).toBe(2)
  })

  it('should open popover menu to sort achievements list', async () => {
    const user = await userEvent.setup({ delay: null })
    renderAchievementsList()

    const popoverMenuTrigger = screen.getByLabelText(
      /Abrir menu para ordernar lista conquistas/i
    )

    act(() => {
      user.click(popoverMenuTrigger)
    })

    expect(await screen.findByRole('dialog')).toBeVisible()
  })

  // it.todo('should sort achievements list by locking state', async () => {
  //   const user = await userEvent.setup({ delay: null })

  //   const unlockedAchivement = {
  //     ...achievementsMock[0],
  //     isUnlocked: true,
  //     name: 'unlocked achievement',
  //   }

  //   renderAchievementsList([
  //     { ...achievementsMock[1], isUnlocked: false },
  //     { ...achievementsMock[2], isUnlocked: false },
  //     unlockedAchivement,
  //   ])

  //   const popoverMenuTrigger = screen.getByLabelText(
  //     /Abrir menu para ordernar lista de conquistas/i
  //   )

  //   act(() => {
  //     user.click(popoverMenuTrigger)
  //   })

  //   const sorterButton = await screen.findByRole('button', {
  //     name: 'Desbloqueadas',
  //   })

  //   // act(() => {
  //   //   user.click(sorterButton)
  //   // })

  //   const sortedAchievements = await screen.findAllByTestId(/achievement/i)
  //   const unlockedAchievement = within(sortedAchievements[0]).getByText(
  //     unlockedAchivement.name
  //   )

  //   expect(unlockedAchievement).toBeInTheDocument()
  // })
})
