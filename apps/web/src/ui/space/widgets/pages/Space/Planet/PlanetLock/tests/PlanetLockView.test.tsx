import { render, screen } from '@testing-library/react'

import { type Props, PlanetLockView } from '../PlanetLockView'

jest.mock('@/ui/global/widgets/components/Animation', () => ({
  Animation: ({ name, isStatic, hasLoop }: any) => (
    <div
      data-testid='animation'
      data-name={name}
      data-static={String(Boolean(isStatic))}
      data-loop={String(hasLoop)}
    />
  ),
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}))

describe('PlanetLockView', () => {
  const View = (props?: Partial<Props>) => {
    return render(
      <PlanetLockView
        phase='static'
        hasLoadFailed={false}
        onLoadError={jest.fn()}
        {...props}
      />,
    )
  }

  it('should render nothing when hidden', () => {
    const { container } = View({ phase: 'hidden' })

    expect(container).toBeEmptyDOMElement()
  })

  it('should render the stopped animation when static', () => {
    View({ phase: 'static' })

    expect(screen.getByTestId('animation')).toHaveAttribute('data-static', 'true')
  })

  it('should render the stopped animation inside the loop wrapper when looping', () => {
    View({ phase: 'loop' })

    expect(screen.getByTestId('animation')).toHaveAttribute('data-static', 'true')
  })

  it('should play the animation once when opening', () => {
    View({ phase: 'opening' })

    const animation = screen.getByTestId('animation')
    expect(animation).toHaveAttribute('data-static', 'false')
    expect(animation).toHaveAttribute('data-loop', 'false')
  })

  it('should render the fading fallback lock when fading', () => {
    View({ phase: 'fade' })

    expect(screen.getByTestId('icon-lock')).toBeInTheDocument()
    expect(screen.queryByTestId('animation')).not.toBeInTheDocument()
  })

  it('should render the fallback lock when the animation failed to load', () => {
    View({ phase: 'static', hasLoadFailed: true })

    expect(screen.getByTestId('icon-lock')).toBeInTheDocument()
    expect(screen.queryByTestId('animation')).not.toBeInTheDocument()
  })
})
