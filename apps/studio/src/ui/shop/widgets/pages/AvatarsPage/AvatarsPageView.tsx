import { AvatarsTable } from './AvatarsTable'

export const AvatarsPageView = () => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-zinc-100'>Avatares</h1>
        <p className='text-sm text-zinc-400'>
          Gerencie todos os avatares disponíveis na loja
        </p>
      </div>
      <AvatarsTable />
    </div>
  )
}
