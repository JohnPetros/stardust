import { renderHook } from '@testing-library/react'
import { usePathname } from 'next/navigation'

import { useFeedbackLayout } from '../useFeedbackLayout'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('useFeedbackLayout', () => {
  const Hook = (pathname: string, isEnabled = true) => {
    ;(usePathname as jest.Mock).mockReturnValue(pathname)

    return renderHook(() => useFeedbackLayout({ isEnabled }))
  }

  it('should show the dialog on a private route when enabled', () => {
    const { result } = Hook('/space')

    expect(result.current.isDialogVisible).toBe(true)
  })

  it('should not show the dialog on a public route', () => {
    const { result } = Hook('/auth/sign-in')

    expect(result.current.isDialogVisible).toBe(false)
  })

  it('should not show the dialog when disabled', () => {
    const { result } = Hook('/space', false)

    expect(result.current.isDialogVisible).toBe(false)
  })

  it('should keep the page layout untouched when disabled', () => {
    const { result } = Hook('/auth/sign-in', false)

    expect(result.current.classNames).toEqual({
      container: 'contents',
      content: 'contents',
    })
  })

  it('should apply the screen layout when enabled', () => {
    const { result } = Hook('/space')

    expect(result.current.classNames.container).toContain('h-screen')
    expect(result.current.classNames.content).toContain('overflow-auto')
  })
})
