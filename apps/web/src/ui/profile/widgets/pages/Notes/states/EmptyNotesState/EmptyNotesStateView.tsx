type Props = {
  title: string
  description: string
}

export const EmptyNotesStateView = ({ title, description }: Props) => {
  return (
    <div className='rounded-xl border border-dashed border-gray-600 bg-gray-900/40 p-5'>
      <h3 className='text-sm font-semibold text-gray-100'>{title}</h3>
      <p className='mt-2 text-sm text-gray-400'>{description}</p>
    </div>
  )
}
