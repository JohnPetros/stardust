import { Icon } from '@/ui/global/widgets/components/Icon'
import { useChatInput } from './useChatInput'
import { twMerge } from 'tailwind-merge'

type Props = {
  isDisabled: boolean
  onSendMessage: (message: string) => void
}

export const ChatInputView = ({ isDisabled, onSendMessage }: Props) => {
  const { textareaRef, message, handleMessageChange, handleKeyDown, handleSendMessage } =
    useChatInput({ onSendMessage })

  return (
    <div
      className={twMerge(
        'relative flex items-end bg-[#1A1A1A] border border-[#333] rounded-xl p-3 transition-colors focus-within:border-[#555]',
        isDisabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <textarea
        ref={textareaRef}
        name='message'
        id='message-input'
        className='flex-grow bg-transparent border-none text-[#E0E0E0] text-[0.95rem] leading-normal resize-none min-h-[24px] max-h-[200px] p-0 mr-12 outline-none placeholder-[#666]'
        placeholder='Pressione Shift + Enter para quebrar linha'
        autoFocus
        value={message}
        disabled={isDisabled}
        readOnly={isDisabled}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type='button'
        className='absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 border-none rounded-full bg-[#333] text-white cursor-pointer transition-all hover:enabled:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={handleSendMessage}
        disabled={!message.trim()}
      >
        <div className='w-4 h-4 flex items-center justify-center'>
          <Icon name='arrow-right' />
        </div>
      </button>
    </div>
  )
}
