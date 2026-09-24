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
        '💾 db',
        '🚧 wip',
        '🤖 ai',
        '📟 rpc',
        '✨ use case',
        '📑 interface',
        '🏷️ type',
        '📚 docs',
        '🐛 fix',
        '♻️ refactor',
        '🧪 test',
        '⚙️ config',
        '🗃️ ftree',
        '🧰 provision',
        '📤 response',
        '🎨 design',
        '📜 cert',
        '📮 validation',
        '🚑 hotfix',
        '🚚 cd',
        '🏎️ ci',
        '🔖 release',
        '📦 deps',
        '🐳 docker',
      ],
    ],

    'type-empty': [2, 'never'],

    'header-max-length': [2, 'always', 150],

    'subject-empty': [2, 'never'],

    'subject-full-stop': [2, 'never', '.'],
  },
}
