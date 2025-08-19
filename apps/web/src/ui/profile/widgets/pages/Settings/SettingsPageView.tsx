import type { UserDto } from '@stardust/core/profile/entities/dtos'

import { AvatarSelect } from './AvatarSelect'
import { NameInput } from './NameInput'
import { EmailInput } from './EmailInput'
import { PasswordInput } from './PasswordInput'
import { Setting } from './Setting'

type Props = {
  userDto: UserDto
}

export const SettingsPageView = ({ userDto }: Props) => {
  return (
    <main className='mx-auto max-w-sm px-6 pb-32 pt-8 md:max-w-5xl md:pb-12'>
      <div className='w-max mx-auto -translate-x-6'>
        <AvatarSelect defaultValue={userDto.avatar} />
      </div>

      <div className='mt-6'>
        <NameInput defaultValue={userDto.name} />
      </div>

      <div className='mt-6'>
        <EmailInput value={userDto.email} />
      </div>

      <div className='mt-6'>
        <PasswordInput />
      </div>

      <h2 className='mt-12 text-lg font-medium text-gray-100'>Preferências</h2>

      <div className='mt-6'>
        <Setting label='Efeitos sonoros' onCheck={() => {}} className='rounded-b-none' />
        <Setting label='Notificações' onCheck={() => {}} className='rounded-t-none' />
      </div>
    </main>
  )
}
