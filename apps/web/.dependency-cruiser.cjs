/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'web-does-not-import-other-apps',
      severity: 'error',
      from: { path: '^src' },
      to: { path: '^\\.\\./\\.\\./apps/(server|studio)(/|$)' },
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
