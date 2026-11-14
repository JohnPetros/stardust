import assert from 'node:assert/strict'
import test from 'node:test'
import {
  analyzeFile,
  classifyFindings,
  contrastRatio,
  createBaseline,
  digestBoards,
  normalizeConfig,
  parseArguments,
  parseFile,
  parseHex,
  resolvePenpotUrl,
  resolveTokens,
} from '../check-design.mjs'

const ROOT = '00000000-0000-0000-0000-000000000000'

const TOKENS_LIB = {
  Primitives: {
    color: {
      neutral: {
        300: { $value: '#ADB8BA', $type: 'color' },
        800: { $value: '#1E2626', $type: 'color' },
        900: { $value: '#141A1B', $type: 'color' },
      },
    },
  },
  Semantic: {
    color: {
      background: { $value: '{color.neutral.900}', $type: 'color' },
      surface: { $value: '{color.neutral.800}', $type: 'color' },
      'text-secondary': { $value: '{color.neutral.300}', $type: 'color' },
    },
  },
  Geometry: {
    space: {
      2: { $value: '8', $type: 'spacing' },
      4: { $value: '16', $type: 'spacing' },
    },
    radius: { default: { $value: '8', $type: 'borderRadius' } },
  },
  $themes: [
    {
      name: 'Dark',
      selectedTokenSets: {
        Primitives: 'enabled',
        Semantic: 'enabled',
        Geometry: 'enabled',
      },
    },
  ],
  $metadata: { tokenSetOrder: ['Primitives', 'Semantic', 'Geometry'] },
}

function box(x, y, width, height) {
  return { x, y, width, height, selrect: { x1: x, y1: y, x2: x + width, y2: y + height } }
}

function text(id, parentId, characters, options = {}) {
  const run = {
    text: characters,
    fontSize: String(options.fontSize ?? 14),
    fontWeight: String(options.fontWeight ?? 400),
    fontFamily: options.fontFamily ?? 'Poppins',
    fills: [{ fillColor: options.color ?? '#adb8ba', fillOpacity: options.alpha ?? 1 }],
  }
  return {
    id,
    parentId,
    type: 'text',
    name: options.name ?? characters,
    growType: options.growType ?? 'auto-width',
    ...box(...(options.box ?? [20, 20, 100, 20])),
    appliedTokens: options.token ? { fill: options.token } : undefined,
    content: {
      type: 'root',
      children: [
        { type: 'paragraph-set', children: [{ type: 'paragraph', children: [run] }] },
      ],
    },
    positionData: options.positionData,
  }
}

function frame(id, parentId, shapes, options = {}) {
  return {
    id,
    parentId,
    type: 'frame',
    name: options.name ?? id,
    shapes,
    fills: options.fill ? [{ fillColor: options.fill, fillOpacity: 1 }] : [],
    strokes: [],
    appliedTokens: options.token ? { fill: options.token } : undefined,
    showContent: options.showContent,
    r1: options.radius ?? 0,
    r2: options.radius ?? 0,
    r3: options.radius ?? 0,
    r4: options.radius ?? 0,
    ...box(...(options.box ?? [0, 0, 400, 400])),
    ...options.extra,
  }
}

// A page with one section holding one screen, which holds the given shapes.
function createFile(screenChildren, options = {}) {
  const objects = {
    [ROOT]: {
      id: ROOT,
      parentId: ROOT,
      type: 'frame',
      name: 'Root',
      shapes: ['section', ...(options.rootExtra ?? []).map((shape) => shape.id)],
    },
    section: frame('section', ROOT, ['screen'], {
      name: 'Perfil · Perfil',
      box: [0, 0, 1000, 1000],
    }),
    screen: frame(
      'screen',
      'section',
      screenChildren
        .filter((shape) => shape.parentId === 'screen')
        .map((shape) => shape.id),
      {
        name: 'Perfil / Desktop / Perfil',
        fill: '#141a1b',
        token: 'color.background',
        box: [0, 0, 400, 400],
      },
    ),
  }
  for (const shape of [...screenChildren, ...(options.rootExtra ?? [])])
    objects[shape.id] = shape
  return {
    id: 'file',
    name: 'stardust',
    revn: 1,
    data: {
      pages: ['page'],
      pagesIndex: { page: { id: 'page', name: '🖥️ Desktop', objects } },
      tokensLib: TOKENS_LIB,
      components: {},
    },
  }
}

function rulesOf(result) {
  return result.findings.map((item) => item.rule).sort()
}

const config = normalizeConfig({ theme: 'Dark' })

test('computes WCAG contrast ratios', () => {
  assert.equal(contrastRatio(parseHex('#000000'), parseHex('#ffffff')).toFixed(1), '21.0')
  assert.equal(contrastRatio(parseHex('#adb8ba'), parseHex('#1e2626')).toFixed(2), '7.60')
})

test('resolves token references for the selected theme', () => {
  const tokens = resolveTokens(TOKENS_LIB, 'Dark')
  assert.equal(tokens.colors.get('color.background').hex, '#141A1B')
  assert.deepEqual(tokens.colorsByHex.get('#141A1B'), [
    'color.neutral.900',
    'color.background',
  ])
  assert.deepEqual([...tokens.numbersByType.get('spacing')], [8, 16])
})

test('flags faded text against the composited background and passes readable text', () => {
  const file = createFile([
    text('faded', 'screen', '13', { alpha: 0.4, token: 'color.text-secondary' }),
    text('readable', 'screen', 'Sequência', {
      token: 'color.text-secondary',
      box: [20, 60, 100, 20],
    }),
  ])
  const result = analyzeFile(file, config)
  const contrast = result.findings.filter((item) => item.rule === 'contrast')
  assert.equal(contrast.length, 1)
  assert.equal(contrast[0].shapeId, 'faded')
  assert.match(contrast[0].message, /^2\.\d+:1 < 4\.5:1/)
})

test('uses a sibling surface painted underneath as the text background', () => {
  const card = {
    ...frame('card', 'screen', [], {
      fill: '#adb8ba',
      token: 'color.text-secondary',
      box: [10, 10, 200, 100],
    }),
  }
  const file = createFile([
    card,
    text('label', 'screen', 'Rótulo', { token: 'color.text-secondary' }),
  ])
  file.data.pagesIndex.page.objects.screen.shapes = ['card', 'label']
  const result = analyzeFile(file, config)
  assert.deepEqual(
    result.findings
      .filter((item) => item.rule === 'contrast')
      .map((item) => item.shapeId),
    ['label'],
  )
})

function labelOverCard(order, cardOptions = {}) {
  const card = {
    ...frame('card', 'screen', [], {
      fill: '#adb8ba',
      token: 'color.text-secondary',
      box: [10, 10, 200, 100],
    }),
    ...cardOptions,
  }
  const file = createFile([
    card,
    text('label', 'screen', 'Rótulo', { token: 'color.text-secondary' }),
  ])
  file.data.pagesIndex.page.objects.screen.shapes = order
  const result = analyzeFile(file, config)
  return {
    contrast: result.findings
      .filter((item) => item.rule === 'contrast')
      .map((item) => item.shapeId),
    unknownBackgrounds: result.stats.unknownBackgrounds,
  }
}

test('ignores a surface painted above the text', () => {
  assert.deepEqual(labelOverCard(['label', 'card']), {
    contrast: [],
    unknownBackgrounds: 0,
  })
})

test('ignores a hidden surface underneath the text', () => {
  assert.deepEqual(labelOverCard(['card', 'label'], { hidden: true }), {
    contrast: [],
    unknownBackgrounds: 0,
  })
})

test('treats image and gradient fills underneath the text as an unknown background', () => {
  for (const fill of [
    { fillImage: { id: 'image' }, fillOpacity: 1 },
    { fillColorGradient: { stops: [] }, fillOpacity: 1 },
  ]) {
    assert.deepEqual(labelOverCard(['card', 'label'], { fills: [fill] }), {
      contrast: [],
      unknownBackgrounds: 1,
    })
  }
})

test('classifies unbound, near-token, off-palette and stale colors', () => {
  const file = createFile([
    text('unbound', 'screen', 'a', { color: '#adb8ba' }),
    text('near', 'screen', 'b', { color: '#aeb9bb', box: [20, 60, 100, 20] }),
    text('off', 'screen', 'c', { color: '#ff00ff', box: [20, 100, 100, 20] }),
    text('stale', 'screen', 'd', {
      color: '#f2f5f4',
      token: 'color.text-secondary',
      box: [20, 140, 100, 20],
    }),
  ])
  const result = analyzeFile(file, config, { rule: 'tokens' })
  const byShape = Object.fromEntries(
    result.findings.map((item) => [item.shapeId, item.rule]),
  )
  assert.deepEqual(byShape, {
    unbound: 'color-unbound',
    near: 'color-near-token',
    off: 'color-off-palette',
    stale: 'token-stale',
  })
})

test('checks font size, scale, family, overflow and clipping', () => {
  const clip = frame('clip', 'screen', ['clipped'], {
    box: [0, 0, 50, 50],
    showContent: false,
    fill: '#141a1b',
    token: 'color.background',
  })
  const file = createFile([
    text('tiny', 'screen', 'x', { fontSize: 11, token: 'color.text-secondary' }),
    text('odd', 'screen', 'y', {
      fontSize: 13,
      fontFamily: 'Arial',
      token: 'color.text-secondary',
      box: [20, 60, 100, 20],
    }),
    text('overflow', 'screen', 'z', {
      growType: 'fixed',
      token: 'color.text-secondary',
      box: [20, 100, 40, 20],
      positionData: [{ x: 20, y: 160, width: 30, height: 18 }],
    }),
    clip,
    text('clipped', 'clip', 'cortado', {
      token: 'color.text-secondary',
      box: [10, 10, 100, 20],
    }),
  ])
  file.data.pagesIndex.page.objects.screen.shapes = ['tiny', 'odd', 'overflow', 'clip']
  const result = analyzeFile(file, config, { rule: 'typography' })
  assert.deepEqual(rulesOf(result), [
    'text-clipped',
    'text-overflow',
    'type-family',
    'type-min-size',
    'type-scale',
  ])
})

test('checks the gaps a flex layout uses and the radius scale', () => {
  const list = frame('list', 'screen', ['a', 'b'], {
    radius: 6,
    extra: {
      layout: 'flex',
      layoutFlexDir: 'column',
      layoutGap: { rowGap: 10, columnGap: 99 },
      layoutPadding: { p1: 16, p2: 16, p3: 16, p4: 16 },
    },
  })
  const pill = frame('pill', 'screen', [], {
    radius: 12,
    box: [0, 0, 80, 24],
    fill: '#1e2626',
  })
  const file = createFile([list, frame('a', 'list', []), frame('b', 'list', []), pill])
  file.data.pagesIndex.page.objects.screen.shapes = ['list', 'pill']
  const result = analyzeFile(file, config, { rule: 'spacing' })
  assert.deepEqual(
    result.findings.map(
      (item) => `${item.rule}:${item.shapeId}:${item.message.split(' is')[0]}`,
    ),
    ['spacing:list:gap/padding 10px', 'radius:list:radius 6px'],
  )
})

test('reports overlapping sections, root strays, default names and hidden layers', () => {
  const overlapping = frame('other', ROOT, [], {
    name: 'Loja · Loja',
    box: [500, 500, 900, 900],
    fill: '#141a1b',
  })
  const stray = {
    ...frame('stray', ROOT, []),
    type: 'rect',
    name: 'Rectangle 3',
    fills: [{ fillColor: '#141a1b' }],
    ...box(2000, 0, 10, 10),
  }
  const hidden = {
    ...text('hidden', 'screen', 'oculto', { token: 'color.text-secondary' }),
    hidden: true,
  }
  const file = createFile([hidden], { rootExtra: [overlapping, stray] })
  const result = analyzeFile(file, config, { rule: 'hygiene' })
  assert.deepEqual(rulesOf(result), [
    'default-name',
    'hidden-layer',
    'root-stray',
    'section-overlap',
  ])
})

test('separates new findings from baseline and ignored ones', () => {
  const findings = [
    {
      rule: 'contrast',
      category: 'contrast',
      shapeId: 'a',
      fingerprint: 'contrast:a',
      screen: 'S',
      layer: 'Dia 13',
      page: 'P',
    },
    {
      rule: 'contrast',
      category: 'contrast',
      shapeId: 'b',
      fingerprint: 'contrast:b',
      screen: 'S',
      layer: 'Selo › Tier',
      page: 'P',
    },
    {
      rule: 'radius',
      category: 'spacing',
      shapeId: 'c',
      fingerprint: 'radius:c',
      screen: 'S',
      layer: 'Card',
      page: 'P',
    },
  ]
  const ignoring = normalizeConfig({
    ignore: [{ rule: 'contrast', layer: 'Tier', reason: 'Decorative' }],
  })
  const baseline = { findings: ['radius:c', 'spacing:gone'] }
  const result = classifyFindings(findings, ignoring, baseline)
  assert.deepEqual(
    result.findings.map((item) => item.status),
    ['new', 'ignored', 'baseline'],
  )
  assert.equal(result.resolved, 1)
  assert.deepEqual(
    createBaseline(result.findings, { name: 'stardust', revn: 3 }).findings,
    ['contrast:a', 'radius:c'],
  )
})

test('rejects ignore entries without a reason', () => {
  assert.throws(
    () => normalizeConfig({ ignore: [{ rule: 'contrast', shapeId: 'a' }] }),
    /needs a reason/,
  )
})

test('does not read the Penpot host from the versioned config', () => {
  assert.throws(
    () => normalizeConfig({ penpotUrl: 'https://attacker.example' }),
    /set PENPOT_URL instead/,
  )
})

test('resolves the Penpot host from the environment only', () => {
  assert.equal(resolvePenpotUrl({}), 'https://design.penpot.app')
  assert.equal(
    resolvePenpotUrl({ PENPOT_URL: 'https://penpot.example.com/path' }),
    'https://penpot.example.com',
  )
  assert.throws(() => resolvePenpotUrl({ PENPOT_URL: 'http://penpot.example.com' }), /https/)
  assert.throws(() => resolvePenpotUrl({ PENPOT_URL: 'not a url' }), /not a valid URL/)
})

test('rejects files whose pages are not stored inline', () => {
  const file = { data: { pagesIndex: { page: { name: 'Desktop', objects: null } } } }
  assert.throws(() => parseFile(JSON.stringify(file)), /objects are not inline/)
  assert.throws(() => parseFile('{"data":{}}'), /pagesIndex is missing/)
})

test('parses command-line options', () => {
  assert.deepEqual(parseArguments(['--page', 'Mobile', '--rule', 'contrast', '--all']), {
    page: 'Mobile',
    board: undefined,
    rule: 'contrast',
    file: undefined,
    save: undefined,
    all: true,
    json: false,
    updateBaseline: false,
    digest: false,
  })
  assert.throws(() => parseArguments(['--page']), /needs a value/)
})

test('digests a board independently of where it sits on the canvas', () => {
  const file = createFile([
    text('label', 'screen', 'Rótulo', { token: 'color.text-secondary' }),
  ])
  const [before] = digestBoards(file, config)
  assert.equal(before.board, 'Perfil / Desktop / Perfil')

  const objects = file.data.pagesIndex.page.objects
  for (const shape of [objects.screen, objects.label]) {
    shape.x += 300
    shape.selrect = {
      ...shape.selrect,
      x1: shape.selrect.x1 + 300,
      x2: shape.selrect.x2 + 300,
    }
  }
  assert.equal(digestBoards(file, config)[0].digest, before.digest)

  objects.label.content.children[0].children[0].children[0].text = 'Outro rótulo'
  assert.notEqual(digestBoards(file, config)[0].digest, before.digest)
  assert.deepEqual(digestBoards(file, config, { board: 'Loja' }), [])
})
