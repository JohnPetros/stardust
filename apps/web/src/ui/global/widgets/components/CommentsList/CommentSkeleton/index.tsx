export function CommentSkeleton() {
  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex space-x-2'>
          <div className='size-10 rounded-full bg-gray-700 animate-pulse' />
          <div className='h-4 w-16 rounded-md bg-gray-700 animate-pulse' />
        </div>
        <div className='flex space-x-2'>
          <div className='h-4 w-16 rounded-md bg-gray-700 animate-pulse' />
          <div className='h-4 w-2 rounded-md bg-gray-700 animate-pulse' />
        </div>
      </div>

      <div className='flex justify-between mt-12'>
        <div className='flex space-x-2'>
          <div className='h-4 w-6 rounded-md bg-gray-700 animate-pulse' />
          <div className='h-4 w-6 rounded-md bg-gray-700 animate-pulse' />
        </div>
        <div className='flex space-x-2'>
          <div className='h-4 w-16 rounded-md bg-gray-700 animate-pulse' />
          <div className='h-4 w-16 rounded-md bg-gray-700 animate-pulse' />
        </div>
      </div>
    </div>
  )
}
