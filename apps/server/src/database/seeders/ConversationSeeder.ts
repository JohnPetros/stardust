import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class ConversationSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['chats', 'chat_messages'])
  }
}
