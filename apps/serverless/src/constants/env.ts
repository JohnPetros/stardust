const ENV = {
  supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
  supabaseKey: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
}

export { ENV }
