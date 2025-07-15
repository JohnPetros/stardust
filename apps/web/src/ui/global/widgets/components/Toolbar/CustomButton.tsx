import type { ReactNode } from 'react'
import * as Toolbar from '@radix-ui/react-toolbar'

type CustomButtonProps = {
  children: ReactNode
}

export function CustomButton({ children }: CustomButtonProps) {
  return <Toolbar.Button asChild>{children as JSX.Element}</Toolbar.Button>
}
