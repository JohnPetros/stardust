import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'
import { ChallengeSourceForm } from '..'
import { useFetch } from '@/ui/global/hooks/useFetch'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

jest.mock('@/ui/global/hooks/useRestContext', () => ({
  useRestContext: jest.fn(),
}))

jest.mock('@/ui/global/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value: string) => value),
}))

jest.mock('@/ui/global/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}))

jest.mock('@/ui/global/widgets/components/Pagination', () => ({
  Pagination: () => <div data-testid='pagination' />,
}))

describe('ChallengeSourceForm', () => {
  let challengingService: Mock<ChallengingService>
  let onSubmit: jest.MockedFunction<
    (url: string, challengeId: string) => Promise<string | null>
  >

  const mockedUseRestContext = jest.mocked(useRestContext)
  const mockedUseFetch = jest.mocked(useFetch)

  const challenges = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Desafio de Lacos',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Desafio de Condicionais',
    },
  ]

  const Widget = () => render(<ChallengeSourceForm onSubmit={onSubmit} />)

  const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('button', { name: 'Adicionar fonte' }))
  }

  beforeEach(() => {
    jest.clearAllMocks()

    challengingService = mock<ChallengingService>()
    onSubmit = jest.fn()

    mockedUseRestContext.mockReturnValue({
      challengingService,
    } as unknown as ReturnType<typeof useRestContext>)

    mockedUseFetch.mockReturnValue({
      data: {
        items: challenges,
        totalItemsCount: challenges.length,
      },
      isLoading: false,
      isRefetching: false,
    } as ReturnType<typeof useFetch>)
  })

  it('should open the dialog when trigger is clicked', async () => {
    const user = userEvent.setup()
    Widget()

    await openDialog(user)

    expect(screen.getByText('Adicionar fonte de desafio')).toBeInTheDocument()
  })

  it('should validate required fields before submit', async () => {
    const user = userEvent.setup()
    Widget()

    await openDialog(user)
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.getByText(/invalid url/i)).toBeInTheDocument()
      expect(screen.getByText(/uuid/i)).toBeInTheDocument()
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should select a challenge from the list', async () => {
    const user = userEvent.setup()
    Widget()

    await openDialog(user)
    await user.click(screen.getByRole('button', { name: 'Desafio de Lacos' }))

    expect(screen.getByText('Desafio selecionado:', { exact: false })).toBeInTheDocument()
    expect(
      screen.getByText('Desafio de Lacos', { selector: 'strong' }),
    ).toBeInTheDocument()
  })

  it('should submit successfully with correct values', async () => {
    const user = userEvent.setup()
    const url = 'https://example.com/artigo'
    onSubmit.mockResolvedValue(null)

    Widget()
    await openDialog(user)

    await user.type(screen.getByPlaceholderText('https://exemplo.com/artigo'), url)
    await user.click(screen.getByRole('button', { name: 'Desafio de Lacos' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(url, challenges[0].id)
    })
  })

  it('should show submit error when submission fails', async () => {
    const user = userEvent.setup()
    const submitError = 'Falha ao adicionar fonte'
    onSubmit.mockResolvedValue(submitError)

    Widget()
    await openDialog(user)

    await user.type(
      screen.getByPlaceholderText('https://exemplo.com/artigo'),
      'https://example.com/artigo',
    )
    await user.click(screen.getByRole('button', { name: 'Desafio de Condicionais' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.getByText(submitError)).toBeInTheDocument()
    })

    expect(onSubmit).toHaveBeenCalledWith('https://example.com/artigo', challenges[1].id)
  })
})
