// commitlint.config.js
module.exports = {
  extends: ['git-commit-emoji'],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        '🌐 domain',
        '📶 api',
        '🖥️ ui',
        '💾 database',
        '🎞️ queue',
        '🧰 provision',
        '📟 server',
        '✨ use case',
        '📑 interface',
        '🏷️ type',
        '📚 docs',
        '🐛 fix',
        '♻️ refactor',
        '⚙️ config',
        '📦 deps',
        '🎴 assets',
        '🔀 merge',
        '⏪ revert',
        '🗃️ ftree',
        '📜 cert',
        '🚧 wip',
        '🚑 hotfix',
        '🚚 cd',
        '🏎️ ci',
        '🔖 release',
        '🐳 docker',
      ],
    ],

    'type-case': [2, 'always', 'lower-case'],

    'type-empty': [2, 'never'],

    'header-max-length': [2, 'always', 100],

    'subject-empty': [2, 'never'],

    'subject-full-stop': [2, 'never', '.'],

    'subject-case': [2, 'always', 'lower-case'],

  },
};