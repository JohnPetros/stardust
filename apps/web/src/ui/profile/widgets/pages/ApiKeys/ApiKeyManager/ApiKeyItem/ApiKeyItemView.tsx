import { Button } from '@/ui/global/widgets/components/Button'
import { RenameApiKeyDialog } from '../RenameApiKeyDialog'
import { RevokeApiKeyDialog } from '../RevokeApiKeyDialog'

type Props = {
  apiKeyId: string
  name: string
  keyPreview: string
  createdAt: string
  variant: 'table' | 'card'
  isRenaming: boolean
  isRevoking: boolean
  onRenameApiKey: (apiKeyId: string, name: string) => Promise<boolean>
  onRevokeApiKey: (apiKeyId: string) => Promise<boolean>
}

export const ApiKeyItemView = ({
  apiKeyId,
  name,
  keyPreview,
  createdAt,
  variant,
  isRenaming,
  isRevoking,
  onRenameApiKey,
  onRevokeApiKey,
}: Props) => {
  const revokeButton = (
    <RevokeApiKeyDialog
      apiKeyName={name}
      isRevoking={isRevoking}
      onRevokeApiKey={async () => await onRevokeApiKey(apiKeyId)}
    >
      <Button className='h-auto w-max rounded-none bg-transparent px-0 py-0 text-xs text-[#00f58a] hover:bg-transparent hover:brightness-125'>
        Revogar
      </Button>
    </RevokeApiKeyDialog>
  )

  const renameButton = (
    <RenameApiKeyDialog
      apiKeyId={apiKeyId}
      defaultName={name}
      isRenaming={isRenaming}
      onRenameApiKey={onRenameApiKey}
    >
      <Button className='h-auto w-max rounded-none bg-transparent px-0 py-0 text-xs text-[#00f58a] hover:bg-transparent hover:brightness-125'>
        Renomear
      </Button>
    </RenameApiKeyDialog>
  )

  if (variant === 'card') {
    return (
      <li className='rounded-md border border-[#1e2a2c] bg-[#070d0f] p-4'>
        <div className='flex items-start justify-between gap-3'>
          <strong className='text-sm text-[#d9f8ea]'>{name}</strong>
          <span className='shrink-0 text-[11px] text-[#9cb1aa]'>{createdAt}</span>
        </div>
        <span className='mt-2 inline-block rounded border border-[#1e2a2c] bg-[#050a0b] px-2 py-0.5 font-mono text-[11px] text-[#bde7d3]'>
          {keyPreview}
        </span>
        <div className='mt-3 flex items-center gap-4'>
          {revokeButton}
          {renameButton}
        </div>
      </li>
    )
  }

  return (
    <tr className='border-b border-[#182326] last:border-b-0'>
      <td className='px-4 py-3 text-[#d9f8ea]'>{name}</td>
      <td className='px-4 py-3'>
        <span className='rounded border border-[#1e2a2c] bg-[#050a0b] px-2 py-0.5 font-mono text-[11px] text-[#bde7d3]'>
          {keyPreview}
        </span>
      </td>
      <td className='px-4 py-3 text-xs text-[#9cb1aa]'>{createdAt}</td>
      <td className='px-4 py-3'>
        <div className='flex items-center gap-2'>
          {revokeButton}
          {renameButton}
        </div>
      </td>
    </tr>
  )
}
