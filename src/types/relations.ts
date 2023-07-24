import { Database } from "./supabase";

export type UserUnlockedStars = Database["public"]["Tables"]["users_unlocked_stars"]["Row"];