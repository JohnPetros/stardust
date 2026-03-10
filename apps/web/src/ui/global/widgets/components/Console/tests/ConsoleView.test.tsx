import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'

jest.mock('../AnimatedPanel', () => ({
  AnimatedPanel: ({ children, className }: any) => (
    <div data-testid='animated-panel' className={className}>
      {children}
    </div>
  ),
}))

jest.mock('../../Tooltip', () => ({
  Tooltip: ({ children }: any) => <>{children}</>,
}))

jest.mock('../../Icon', () => ({
  Icon: () => <span data-testid='console-icon' />,
}))

const { ConsoleView } = require('../ConsoleView')

describe('ConsoleView', () => {
  const View = (props?: Partial<ComponentProps<typeof ConsoleView>>) => {
    render(
      <ConsoleView
        outputs={[]}
        isOpen={true}
        panelHeight='20rem'
        onDragDown={jest.fn()}
        onClose={jest.fn()}
        positionMode='absolute'
        {...props}
      />,
    )
  }

  it('should render empty state when there is no output', () => {
    View()

    expect(screen.getByText('Sem saída')).toBeInTheDocument()
  })

  it('should render repeated outputs preserving all lines', () => {
    View({ outputs: ['linha repetida', 'linha repetida'] })

    expect(screen.getAllByText('linha repetida')).toHaveLength(2)
  })

  it('should render fixed positioning mode when requested', () => {
    View({ positionMode: 'fixed' })

    expect(screen.getByTestId('animated-panel')).toHaveClass('fixed')
    expect(screen.getByTestId('animated-panel')).toHaveClass('z-50')
  })
})
