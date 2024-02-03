import { fireEvent, render, screen } from '@testing-library/react'

import { Header } from '../Header'

import { questionsMock } from '@/__tests__/mocks/lesson/planets/planet1/star1/questions'
import { textsMock } from '@/__tests__/mocks/lesson/planets/planet1/star1/texts'
import { usersMock } from '@/__tests__/mocks/usersMock'
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext/hooks/useAuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { LessonStoreProps, useLessonStore } from '@/stores/lessonStore'

const onLeaveLessonMock = jest.fn()
const initialLessonStoreState = useLessonStore.getState()

function renderHeader() {
  render(
    <SupabaseProvider>
      <AuthContext.Provider
        value={
          {
            user: usersMock[0],
          } as unknown as AuthContextValue
        }
      >
        <Header onLeaveLesson={onLeaveLessonMock} />
      </AuthContext.Provider>
    </SupabaseProvider>
  )
}

describe('Lesson Header component', () => {
  beforeEach(() => {
    useLessonStore.setState(initialLessonStoreState)
  })

  it('should render lives amount', async () => {
    const livesAmount = 5

    useLessonStore.setState({
      state: {
        livesAmount,
        texts: textsMock,
        questions: questionsMock,
        currentQuestionIndex: 0,
        renderedTextsAmount: 0,
      },
    } as unknown as LessonStoreProps)

    renderHeader()

    expect(screen.getByText(livesAmount)).toBeVisible()
  })
  it('should open Alert when try to leave Lesson', async () => {
    useLessonStore.setState({
      state: {
        livesAmount: 5,
        texts: textsMock,
        questions: questionsMock,
        currentQuestionIndex: 0,
        renderedTextsAmount: 0,
      },
    } as unknown as LessonStoreProps)

    renderHeader()

    const button = screen.getByLabelText(/Sair da lição/i)

    fireEvent.click(button)

    const alert = screen.getByRole('alertdialog')

    expect(alert).toBeVisible()
  })

  it('should leave lesson', async () => {
    useLessonStore.setState({
      state: {
        livesAmount: 5,
        texts: textsMock,
        questions: questionsMock,
        currentQuestionIndex: 0,
        renderedTextsAmount: 0,
      },
    } as unknown as LessonStoreProps)

    renderHeader()

    const button = screen.getByLabelText(/Sair da lição/i)

    fireEvent.click(button)

    const alertConfirm = screen.getByTestId(/alert-leave-lesson/i)

    fireEvent.click(alertConfirm)

    expect(onLeaveLessonMock).toHaveBeenCalled()
  })

  it('should render lesson progress in 50%', async () => {
    useLessonStore.setState({
      state: {
        livesAmount: 5,
        texts: textsMock.slice(0, 5),
        questions: questionsMock.slice(0, 5),
        renderedTextsAmount: 5,
        currentQuestionIndex: 0,
      },
    } as unknown as LessonStoreProps)

    renderHeader()

    const progress = screen.getByTestId('progress:50%')

    expect(progress).toBeVisible()
  })
})
