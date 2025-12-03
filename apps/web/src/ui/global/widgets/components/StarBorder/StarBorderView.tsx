import './StarBorderStyles.css'

type Props<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T
  className?: string
  children?: React.ReactNode
  color?: string
  speed?: React.CSSProperties['animationDuration']
  thickness?: number
}

export const StarBorderView = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = '#38C76D',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: Props<T>) => {
  const Component = as || 'button'

  return (
    <Component
      className={`star-border-container ${className}`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style,
      }}
    >
      <div
        className='border-gradient-bottom'
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className='border-gradient-top'
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className='inner-content'>{children}</div>
    </Component>
  )
}
