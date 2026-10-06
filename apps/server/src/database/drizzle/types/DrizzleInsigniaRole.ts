import type { insigniaRoleModel } from '../models/shop/insignia-role-model'

export type DrizzleInsigniaRole = (typeof insigniaRoleModel.enumValues)[number]
