import type monaco from 'monaco-editor'

export function getDeleguaLanguageTokens(): monaco.languages.IMonarchLanguage {
  return {
    defaultToken: 'invalid',
    tokenPostfix: '.delegua',

    keywords: [
      'cada',
      'caso',
      'classe',
      'const',
      'constante',
      'continua',
      'de',
      'em',
      'enquanto',
      'escolha',
      'falhar',
      'fazer',
      'finalmente',
      'fixo',
      'funcao',
      'função',
      'herda',
      'importar',
      'inteiro[]',
      'isto',
      'leia',
      'nulo',
      'padrão',
      'padrao',
      'para',
      'para',
      'pegue',
      'qualquer',
      'qualquer[]',
      'real[]',
      'retorna',
      'se',
      'senão se',
      'senão',
      'senao se',
      'senao',
      'sustar',
      'tente',
      'texto[]',
      'tipo',
      'variavel',
      'variável',
      'vetor',

      /* funções nativas texto*/
      'dividir',
      'fatiar',
      'inclui',
      'maiusculo',
      'minusculo',
      'texto',
      'substituir',
      'subtexto',

      /* funções nativas vetor*/
      'adicionar',
      'concatenar',
      'empilhar',
      'fatiar',
      'inclui',
      'inverter',
      'juntar',
      'mapear',
      'ordenar',
      'remover',
      'removerPrimeiro',
      'removerUltimo',
      'somar',

      /* funções nativas gerais*/
      'aleatorio',
      'aleatorioEntre',
      'algum',
      'encontrarIndice',
      'encontrarUltimoIndice',
      'encontrarUltimo',
      'encontrar',
      'escreva',
      'filtrarPor',
      'incluido',
      'inteiro',
      'paraCada',
      'primeiroEmCondicao',
      'real',
      'reduzir',
      'tamanho',
      'todos',
      'todosEmCondicao',
    ],

    operators: [
      'e',
      'ou',
      '<=',
      '>=',
      '==',
      '!=',
      '=>',
      '+',
      '-',
      '**',
      '*',
      '/',
      '%',
      '++',
      '--',
      '<<',
      '>>',
      '^',
      '!',
      '~',
      '=',
      '+=',
      '-=',
      '*=',
      '**=',
      '/=',
      '%=',
    ],

    booleans: ['verdadeiro', 'falso', 'vazio', 'nulo'],

    typeKeywords: ['var'],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes:
      /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc:
      /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],

      common: [
        // identifiers and keywords
        [
          /[a-z_$][çã\w$]*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@booleans': 'boolean',
              '@typeKeywords': 'typeKeyword',
              '@default': 'identifier',
            },
          },
        ],
        [/[A-Z][\w\$]*/, 'type.identifier'], // to show class names nicely
        // [/[A-Z][\w\$]*/, 'identifier'],

        // whitespace
        { include: '@whitespace' },

        // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
        [
          /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
          { token: 'regexp', bracket: '@open', next: '@regexp' },
        ],

        // delimiters and operators
        [/[()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/!(?=([^=]|$))/, 'delimiter'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'delimiter',
              '@default': '',
            },
          },
        ],

        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
        [/0[xX](@hexdigits)n?/, 'number.hex'],
        [/0[oO]?(@octaldigits)n?/, 'number.octal'],
        [/0[bB](@binarydigits)n?/, 'number.binary'],
        [/(@digits)n?/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],

      jsdoc: [
        [/[^\/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc'],
      ],

      // We match regular expression quite precisely
      regexp: [
        [
          /(\{)(\d+(?:,\d*)?)(\})/,
          [
            'regexp.escape.control',
            'regexp.escape.control',
            'regexp.escape.control',
          ],
        ],
        [
          /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
          [
            'regexp.escape.control',
            { token: 'regexp.escape.control', next: '@regexrange' },
          ],
        ],
        [
          /(\()(\?:|\?=|\?!)/,
          ['regexp.escape.control', 'regexp.escape.control'],
        ],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'],
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [
          /(\/)([dgimsuy]*)/,
          [
            { token: 'regexp', bracket: '@close', next: '@pop' },
            'keyword.other',
          ],
        ],
      ],

      regexrange: [
        [/-/, 'regexp.escape.control'],
        [/\^/, 'regexp.invalid'],
        [/@regexpesc/, 'regexp.escape'],
        [/[^\]]/, 'regexp'],
        [
          /\]/,
          {
            token: 'regexp.escape.control',
            next: '@pop',
            bracket: '@close',
          },
        ],
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop'],
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop'],
      ],

      string_backtick: [
        [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
        [/[^\\`$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop'],
      ],

      bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'common' },
      ],
    },
  }
}
