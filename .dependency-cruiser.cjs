/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'core-does-not-import-apps',
      severity: 'error',
      from: { path: '^packages/core/src' },
      to: { path: '^apps/(server|web|studio)(/|$)' },
    },
    {
      name: 'server-does-not-import-frontends',
      severity: 'error',
      from: { path: '^apps/server/src' },
      to: { path: '^apps/(web|studio)(/|$)' },
    },
    {
      name: 'web-does-not-import-other-apps',
      severity: 'error',
      from: { path: '^apps/web/src' },
      to: { path: '^apps/(server|studio)(/|$)' },
    },
    {
      name: 'studio-does-not-import-other-apps',
      severity: 'error',
      from: { path: '^apps/studio/src' },
      to: { path: '^apps/(server|web)(/|$)' },
    },
  ],
  options: {
    combinedDependencies: true,
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: [
        '(^|/)node_modules/',
        '(^|/)(build|coverage|\\.next|\\.react-router)/',
        '\\.(test|spec)\\.[cm]?[jt]sx?$',
      ],
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['types', 'import', 'require', 'node', 'default'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
    },
    skipAnalysisNotInRules: true,
  },
}
