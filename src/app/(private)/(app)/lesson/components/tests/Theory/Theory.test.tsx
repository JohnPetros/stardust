import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Theory } from '../../Theory'

import { fetchMock } from '@/__tests__/fetchMock'
import { textsMock } from '@/__tests__/mocks/lesson/planets/planet1/star1/texts'
import { usersMock } from '@/__tests__/mocks/usersMock'
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext/hooks/useAuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { LessonStoreProps, useLessonStore } from '@/stores/lessonStore'

jest.mock('next-mdx-remote', () => ({
  MDXRemote: <div />,
}))

jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation()

const incrementRenderedTextsAmountMock = jest.fn()
const showQuizMock = jest.fn()

const initialLessonStoreState = useLessonStore.getState()

const starMock = {
  title: 'star title mock',
  number: 42,
}

function renderTheory() {
  render(
    <SupabaseProvider>
      <AuthContext.Provider
        value={
          {
            user: usersMock[0],
          } as unknown as AuthContextValue
        }
      >
        <Theory title={starMock.title} number={starMock.number} />
      </AuthContext.Provider>
    </SupabaseProvider>
  )
}

describe('Lesson Theory component', () => {
  beforeEach(() => {
    incrementRenderedTextsAmountMock.mockClear()
    showQuizMock.mockClear()
    useLessonStore.setState(initialLessonStoreState)
  })

  it('should render star mock meta data', async () => {
    fetchMock()

    renderTheory()

    expect(screen.getByText(starMock.title)).toBeVisible()
    expect(screen.getByText(starMock.number)).toBeVisible()
  })

  it('should increment rendered texts amount', async () => {
    fetchMock()

    useLessonStore.setState({
      state: {
        texts: textsMock,
        renderedTextsAmount: 0,
      },
      actions: {
        incrementRenderedTextsAmount: incrementRenderedTextsAmountMock,
      },
    } as unknown as LessonStoreProps)

    renderTheory()

    const button = screen.getByText(/continuar/i)

    await userEvent.click(button)

    expect(incrementRenderedTextsAmountMock).toHaveBeenCalled()
  })

  it('should not increment rendered texts when there are not more texts to render', async () => {
    fetchMock()

    useLessonStore.setState({
      state: {
        texts: textsMock.slice(0, 1),
        renderedTextsAmount: textsMock.length,
      },
      actions: {
        incrementRenderedTextsAmount: incrementRenderedTextsAmountMock,
        showQuiz: showQuizMock,
      },
    } as unknown as LessonStoreProps)

    renderTheory()

    const button = screen.getByText(/continuar/i)

    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(incrementRenderedTextsAmountMock).not.toHaveBeenCalledTimes(2)
  })

  it('should open alert dialog on reach Theory end', async () => {
    fetchMock()

    useLessonStore.setState({
      state: {
        texts: textsMock.slice(0, 1),
        renderedTextsAmount: textsMock.length,
      },
      actions: {
        incrementRenderedTextsAmount: incrementRenderedTextsAmountMock,
        showQuiz: showQuizMock,
      },
    } as unknown as LessonStoreProps)

    renderTheory()

    const button = screen.getByText(/continuar/i)
    await userEvent.click(button)

    const alertDialog = screen.getByRole('alertdialog')

    expect(alertDialog).toBeVisible()
  })

  it('should show quiz', async () => {
    fetchMock()

    useLessonStore.setState({
      state: {
        texts: textsMock.slice(0, 1),
        renderedTextsAmount: textsMock.length,
      },
      actions: {
        incrementRenderedTextsAmount: incrementRenderedTextsAmountMock,
        showQuiz: showQuizMock,
      },
    } as unknown as LessonStoreProps)

    renderTheory()

    const button = screen.getByText(/continuar/i)
    await userEvent.click(button)

    await userEvent.click(screen.getByText(/Bora!/))

    expect(showQuizMock).toHaveBeenCalled()
  })
})
