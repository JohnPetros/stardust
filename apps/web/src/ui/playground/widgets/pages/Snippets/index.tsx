import { AddSnippetButton } from './AddPlaygroundButton'
import { SnippetPageHero } from './SnippetPageHero'
import { SnippetsList } from './SnippetsList'

export function SnippetsPage() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center gap-4 bg-gray-800 py-8'>
        <SnippetPageHero />
        <AddSnippetButton />
      </div>
      <SnippetsList />
    </div>
  )
}
