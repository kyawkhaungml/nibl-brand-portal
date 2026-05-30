function required(name: string, value: string | undefined): string {
  if (!value) {
    if (typeof window === 'undefined') {
      console.warn(`[env] Missing ${name}; using empty string for build.`);
    }
    return '';
  }
  return value;
}

export const env = {
  supabase: {
    url: required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: required(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  },
  useMockData: (process.env.NEXT_PUBLIC_USE_MOCK_DATA ?? 'true') === 'true',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3004',
};

export const serverEnv = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
};
