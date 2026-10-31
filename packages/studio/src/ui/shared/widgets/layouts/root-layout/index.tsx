import { Outlet } from '@tanstack/react-router'
import { useCanvasHost } from '@/ui/shared/hooks/use-canvas'

export const RootLayout = () => {
  // The only host of the canvas: wires the shared renderer to it and the route.
  const { canvasRef } = useCanvasHost()

  return (
    <div className='relative h-screen w-screen bg-canvas'>
      <canvas ref={canvasRef} id='main-canvas' className='block h-full w-full' />
      <Outlet />
    </div>
  )
}
