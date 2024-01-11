import { ArrowArcLeft } from '@phosphor-icons/react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Fab } from '../../../../../components/Fab'

const onClickMock = jest.fn()
const labelMock = 'label mock'

function renderFab(isVisible: boolean) {
  render(
    <Fab
      label={labelMock}
      isVisible={isVisible}
      icon={ArrowArcLeft}
      onClick={onClickMock}
    />
  )
}

describe('Fab component', () => {
  it('should not be visible', async () => {
    renderFab(false)

    const fab = screen.queryByLabelText(labelMock)

    await waitFor(() => {
      expect(fab).not.toBeInTheDocument()
    })
  })

  it('should call callback on click', async () => {
    renderFab(true)

    const fab = screen.getByLabelText(labelMock)

    await userEvent.click(fab)

    await waitFor(() => {
      expect(onClickMock).toHaveBeenCalled()
    })
  })
})
