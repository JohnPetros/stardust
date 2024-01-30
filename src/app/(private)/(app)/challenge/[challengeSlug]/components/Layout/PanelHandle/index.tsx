import {
  PanelResizeHandle,
  PanelResizeHandleProps,
} from 'react-resizable-panels'

type PanelHandleProps = {
  direction: 'horizontal' | 'vertical'
}

export function PanelHandle({
  direction = 'horizontal',
  ...panelHandleProps
}: PanelHandleProps & PanelResizeHandleProps) {
  return (
    <PanelResizeHandle
      className="grid h-full w-2 place-content-center rounded-md bg-gray-900 transition-all duration-100 hover:opacity-40"
      {...panelHandleProps}
    >
      <span className="block h-4 w-1 rounded-md bg-gray-300" />
    </PanelResizeHandle>
  )
}
