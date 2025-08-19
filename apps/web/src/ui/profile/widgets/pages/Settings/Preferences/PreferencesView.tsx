import { Preference } from './Preference'

type Props = {
  isAudioDisabled: boolean
  handleCanPlayAudioChange: () => void
}

export const PreferencesView = ({ isAudioDisabled, handleCanPlayAudioChange }: Props) => {
  return (
    <div>
      <h2 className='mt-12 text-lg font-medium text-gray-100'>Preferências</h2>

      <div className='mt-6'>
        <Preference
          label='Efeitos sonoros'
          defaultChecked={!isAudioDisabled}
          onCheck={handleCanPlayAudioChange}
          className='rounded-b-none'
        />
        <Preference
          label='Notificações'
          defaultChecked={false}
          onCheck={() => {}}
          className='rounded-t-none'
        />
      </div>
    </div>
  )
}
