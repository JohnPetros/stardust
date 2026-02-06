import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

jest.mock('swiper/react', () => ({
  Swiper: ({ children, onSwiper }: any) => {
    if (onSwiper) onSwiper({ activeIndex: 0, translate: 0 })

    return <div data-testid='swiper'>{children}</div>
  },
  SwiperSlide: ({ children }: any) => <div data-testid='swiper-slide'>{children}</div>,
}))

jest.mock('motion/react', () => ({
  motion: {
    span: (props: any) => <span {...props} />,
  },
}))

jest.mock('../NavButton', () => ({
  NavButton: ({ children, isActive, onClick }: any) => (
    <button type='button' data-active={String(Boolean(isActive))} onClick={onClick}>
      {children}
    </button>
  ),
}))

jest.mock('@/ui/challenging/widgets/slots/ChallengeCodeEditor', () => ({
  __esModule: true,
  ChallengeCodeEditorSlot: () => <div data-testid='code-editor-slot' />,
}))

jest.mock('@/ui/challenging/widgets/slots/ChallengeResult', () => ({
  __esModule: true,
  ChallengeResultSlot: () => <div data-testid='result-slot' />,
}))

jest.mock('@/ui/challenging/widgets/slots/ChallengeDescription', () => ({
  __esModule: true,
  ChallengeDescriptionSlot: () => <div data-testid='description-slot' />,
}))

jest.mock('@/ui/challenging/widgets/layouts/Challenge/AssistantChatbot', () => ({
  __esModule: true,
  AssistantChatbot: () => <div data-testid='assistant-chatbot' />,
}))

const { ChallengeSliderView } = require('../ChallengeSliderView')

describe('ChallengeSliderView', () => {
  type Props = ComponentProps<typeof ChallengeSliderView>

  const View = (props?: Partial<Props>) => {
    render(
      <ChallengeSliderView
        swiperRef={{ current: null }}
        motionScope={{ current: null }}
        activeSlideIndex={0}
        activeContent='description'
        slidesCount={4}
        handleNavButtonClick={jest.fn()}
        handleSlideChange={jest.fn()}
        {...props}
      >
        <div data-testid='child-slot' />
      </ChallengeSliderView>,
    )
  }

  it('should render nav labels based on active content', () => {
    View({ activeContent: 'comments' })

    expect(screen.getByText('Comentários')).toBeInTheDocument()
    expect(screen.getByText('Código')).toBeInTheDocument()
    expect(screen.getByText('Resultado')).toBeInTheDocument()
    expect(screen.getByText('Assistente')).toBeInTheDocument()
  })

  it('should call handleNavButtonClick when nav button is clicked', async () => {
    const user = userEvent.setup()
    const handleNavButtonClick = jest.fn()

    View({ handleNavButtonClick })

    await user.click(screen.getByText('Código'))

    expect(handleNavButtonClick).toHaveBeenCalledWith(1)
  })

  it('should render children when active content is not result', () => {
    View({ activeContent: 'description' })

    expect(screen.getByTestId('child-slot')).toBeInTheDocument()
    expect(screen.queryByTestId('description-slot')).not.toBeInTheDocument()
  })

  it('should render description slot when active content is result', () => {
    View({ activeContent: 'result' })

    expect(screen.getByTestId('description-slot')).toBeInTheDocument()
    expect(screen.queryByTestId('child-slot')).not.toBeInTheDocument()
  })

  it('should pass swiper instance to handleSlideChange', () => {
    const handleSlideChange = jest.fn()

    View({ handleSlideChange })

    expect(handleSlideChange).toHaveBeenCalledWith(
      expect.objectContaining({ activeIndex: 0, translate: 0 }),
    )
  })
})
