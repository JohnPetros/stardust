import { Database } from "./supabase";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Planet = Database["public"]["Tables"]["planets"]["Row"];
export type Star = Database["public"]["Tables"]["stars"]["Row"];