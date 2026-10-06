import { pgEnum } from 'drizzle-orm/pg-core'

export const insigniaRoleModel = pgEnum('insignia_role', ['engineer', 'god'])
