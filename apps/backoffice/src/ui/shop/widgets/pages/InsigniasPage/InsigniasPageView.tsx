import { InsigniasTable } from './InsigniasTable'

export const InsigniasPageView = () => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-zinc-100'>Insígnias</h1>
        <p className='text-sm text-zinc-400'>
          Gerencie todas as insígnias disponíveis na loja
        </p>
      </div>
      <InsigniasTable />
    </div>
  )
}
