// commitlint.config.js
module.exports = {
  extends: ['git-commit-emoji'],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        '🌐 domain',
        '📶 rest',
        '🖥️ ui',
        '🤖 ai',
        '💾 db',
        '🎞️ queue',
        '🧰 prov',
        '📟 rpc',
        '✨ use case',
        '📑 interface',
        '🏷️ type',
        '📚 docs',
        '🐛 fix',
        '♻️ refactor',
        '🧪 test',
        '⚙️ config',
        '🪨 constants',
        '📦 deps',
        '🎴 assets',
        '🎨 design',
        '🔀 merge',
        '⏪ revert',
        '▶️ cr',
        '📤 response',
        '🗃️ ftree',
        '📜 cert',
        '🚧 wip',
        '📮 validation',
        '🚑 hotfix',
        '🚚 cd',
        '🏎️ ci',
        '🔖 release',
        '🐳 docker',
      ],
    ],

    'type-empty': [2, 'never'],

    'header-max-length': [2, 'always', 150],

    'subject-empty': [2, 'never'],

    'subject-full-stop': [2, 'never', '.'],

    'scope-enum': [
      2,
      'always',
      [
        'web',
        'server',
        'core',
        'studio',
        'lsp',
      ],
    ],
  },
};