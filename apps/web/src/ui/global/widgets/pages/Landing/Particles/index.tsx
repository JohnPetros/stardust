import dynamic from 'next/dynamic'

const Canvas = dynamic(
  () => import('@react-three/fiber').then((module) => module.Canvas),
  {
    ssr: false,
  },
)

const Stars = dynamic(() => import('@react-three/drei').then((module) => module.Stars), {
  ssr: false,
})

export function Particles() {
  return (
    <div className='absolute inset-0 z-0'>
      <Canvas>
        <Stars radius={50} count={2500} factor={4} fade speed={2} />
      </Canvas>
    </div>
  )
}
