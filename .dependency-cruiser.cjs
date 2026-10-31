/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'core-does-not-import-apps',
      severity: 'error',
      from: { path: '^packages/core/src' },
      to: { path: '^apps/(server|web|backoffice|crew)(/|$)' },
    },
    {
      name: 'server-does-not-import-frontends',
      severity: 'error',
      from: { path: '^apps/server/src' },
      to: { path: '^apps/(web|backoffice|crew)(/|$)' },
    },
    {
      name: 'web-does-not-import-other-apps',
      severity: 'error',
      from: { path: '^apps/web/src' },
      to: { path: '^apps/(server|backoffice|crew)(/|$)' },
    },
    {
      name: 'backoffice-does-not-import-other-apps',
      severity: 'error',
      from: { path: '^apps/backoffice/src' },
      to: { path: '^apps/(server|web|crew)(/|$)' },
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
