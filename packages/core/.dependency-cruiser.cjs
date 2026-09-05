/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'core-does-not-import-apps',
      severity: 'error',
      from: { path: '^src' },
      to: { path: '^\\.\\./\\.\\./apps/(server|web|studio)(/|$)' },
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
