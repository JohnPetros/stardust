/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'server-does-not-import-frontends',
      severity: 'error',
      from: { path: '^src' },
      to: { path: '^\\.\\./\\.\\./apps/(web|studio)(/|$)' },
    },
  ],
  options: {
    combinedDependencies: true,
    doNotFollow: {
      path: ['node_modules', '^\\.\\.\\/'],
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
