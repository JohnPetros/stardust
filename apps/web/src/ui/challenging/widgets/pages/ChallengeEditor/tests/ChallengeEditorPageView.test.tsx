import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('../useChallengeEditorPage', () => ({
  useChallengeEditorPage: jest.fn(),
}))

jest.mock('../ChallengeTitleField', () => ({
  ChallengeTitleField: () => <div>Título</div>,
}))

jest.mock('../ChallengeFunctionField', () => ({
  ChallengeFunctionField: () => <div>Metadados da função</div>,
}))

jest.mock('../ChallengeTestCasesField', () => ({
  ChallengeTestCasesField: () => <div>Casos de teste</div>,
}))

jest.mock('../ChallengeDescriptionField', () => ({
  ChallengeDescriptionField: () => <div>Descrição</div>,
}))

jest.mock('../ChallengeDifficultyLevelField', () => ({
  ChallengeDifficultyLevelField: () => <div>Dificuldade</div>,
}))

jest.mock('../ChallengeCategoriesField', () => ({
  ChallengeCategoriesField: () => <div>Categorias</div>,
}))

jest.mock('@/ui/global/widgets/components/ActionButton', () => ({
  ActionButton: ({ isDisabled }: any) => (
    <button type='submit' disabled={isDisabled}>
      postar
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/AlertDialog', () => ({
  AlertDialog: ({ children }: any) => <>{children}</>,
}))

jest.mock('@/ui/global/widgets/components/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span />,
}))

jest.mock('@/ui/global/widgets/components/Switch', () => ({
  Switch: ({ label, defaultCheck, onCheck }: any) => (
    <button type='button' onClick={() => onCheck(!defaultCheck)}>
      {label}
    </button>
  ),
}))

const { ChallengeEditorPageView } = require('../ChallengeEditorPageView')
const { useChallengeEditorPage } = require('../useChallengeEditorPage')

describe('ChallengeEditorPageView', () => {
  const setValue = jest.fn()

  function View(isEvaluatedByFunction: boolean) {
    jest.mocked(useChallengeEditorPage).mockReturnValue({
      form: {
        watch: jest.fn((field?: string) =>
          field === 'isEvaluatedByFunction' ? isEvaluatedByFunction : {},
        ),
        setValue,
        formState: {},
      },
      canSubmitForm: true,
      errorMessages: [],
      shouldEditChallenge: null,
      isFormSubmitting: false,
      isActionSuccess: false,
      isActionFailure: false,
      handleFormSubmit: jest.fn((event) => event.preventDefault()),
      handleBackButtonClick: jest.fn(),
      handleDeleteChallengeButtonClick: jest.fn(),
    })

    render(
      <ChallengeEditorPageView
        currentChallenge={null}
        challengeCategories={[]}
        isEditingAsAdmin={false}
        navigationProvider={{} as any}
        toastProvider={{} as any}
        service={{} as any}
        userId={{ value: 'user-id' } as any}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render function metadata field when challenge is evaluated by function', () => {
    View(true)

    expect(screen.getByText('Avaliar pelo retorno da função')).toBeInTheDocument()
    expect(screen.getByText('Metadados da função')).toBeInTheDocument()
  })

  it('should hide function metadata field and update form mode when evaluated by output', async () => {
    const user = userEvent.setup()

    View(false)

    expect(screen.getByText('Avaliar pela saída do console')).toBeInTheDocument()
    expect(screen.queryByText('Metadados da função')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Avaliar pela saída do console' }),
    )

    expect(setValue).toHaveBeenCalledWith('isEvaluatedByFunction', true, {
      shouldDirty: true,
      shouldValidate: true,
    })
  })
})
