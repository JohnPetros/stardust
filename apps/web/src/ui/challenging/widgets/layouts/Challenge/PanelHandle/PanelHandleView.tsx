import { PanelResizeHandle, type PanelResizeHandleProps } from 'react-resizable-panels'

export const PanelHandleView = (props: PanelResizeHandleProps) => (
  <PanelResizeHandle
    className='grid h-full w-2 place-content-center rounded-md bg-gray-900 transition-all duration-100 hover:opacity-40'
    {...props}
  >
    <span className='block h-4 w-1 rounded-md bg-gray-300' />
  </PanelResizeHandle>
)
