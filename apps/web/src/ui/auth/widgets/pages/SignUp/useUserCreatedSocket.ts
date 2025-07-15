// import { useEffect } from 'react'

// import { UserCreatedEvent } from '@stardust/core/profile/events'

// import { useSupabaseContext } from '@/ui/global/contexts/SupabaseContext/hooks'

// type SupabaseUser = {
//   id: string
//   name: string
//   email: string
// }

// export function useUserCreatedSocket(onCreateUser: (event: UserCreatedEvent) => void) {
//   const { supabase } = useSupabaseContext()

//   useEffect(() => {
//     const channel = supabase
//       .channel('user.created.channel')
//       .on(
//         // @ts-ignore
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'users' },
//         (payload: { new: SupabaseUser }) => {
//           const event = new UserCreatedEvent({
//             userId: payload.new.id,
//             userName: payload.new.name,
//             userEmail: payload.new.email,
//           })
//           onCreateUser(event)
//         },
//       )
//       .subscribe()

//     return () => {
//       channel.unsubscribe()
//     }
//   }, [supabase, onCreateUser])
// }
