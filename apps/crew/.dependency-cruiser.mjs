import baseConfiguration from '../../.dependency-cruiser.cjs'

export default {
  forbidden: [
    {
      name: 'crew-does-not-import-product-apps',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '(^|/)apps/(server|web|studio)/' },
    },
    {
      name: 'crew-uses-app-local-schemas',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '(^|/)packages/validation/|@stardust/validation' },
    },
    {
      name: 'drizzle-only-in-database',
      severity: 'error',
      from: { path: '^src/', pathNot: '^src/database/' },
      to: { path: 'node_modules/drizzle-orm|^drizzle-orm' },
    },
  ],
  options: {
    ...baseConfiguration.options,
    tsConfig: { fileName: 'tsconfig.json' },
    skipAnalysisNotInRules: false,
  },
}
