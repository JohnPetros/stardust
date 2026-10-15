import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class ReportingSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, [
      'feedback_reports',
      'feedback_messages',
      'feedback_message_attachments',
    ])
  }
}
