#!/usr/bin/env node
// Checks the stardust Penpot file against the design rules: contrast, tokens,
// typography, spacing and radius, and file hygiene. The file is read through
// the Penpot REST API with PENPOT_ACCESS_TOKEN (process env or root .env.local)
// or from a saved JSON with --file.
//
// Usage: node scripts/check-design.mjs [--page <name>] [--board <name>]
//   [--rule <rule|category>] [--all] [--json] [--file <path>] [--save <path>]
//   [--update-baseline] [--digest]
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONFIG_PATH = path.join(ROOT_DIRECTORY, '.design-check.json')
const BASELINE_PATH = path.join(ROOT_DIRECTORY, '.design-check-baseline.json')
const ROOT_SHAPE_ID = '00000000-0000-0000-0000-000000000000'
const DEFAULT_PAGE_BACKGROUND = '#E8E9EA'

const RULE_CATEGORIES = {
  contrast: 'contrast',
  'icon-contrast': 'contrast',
  'color-unbound': 'tokens',
  'color-near-token': 'tokens',
  'color-off-palette': 'tokens',
  'token-stale': 'tokens',
  'token-missing': 'tokens',
  'type-min-size': 'typography',
  'type-scale': 'typography',
  'type-family': 'typography',
  'type-weight': 'typography',
  'text-overflow': 'typography',
  'text-clipped': 'typography',
  spacing: 'spacing',
  radius: 'spacing',
  'section-overlap': 'hygiene',
  'root-stray': 'hygiene',
  'default-name': 'hygiene',
  'empty-frame': 'hygiene',
  'hidden-layer': 'hygiene',
  'broken-component': 'hygiene',
}

const DEFAULT_LAYER_NAME =
  /^(board|rectangle|ellipse|group|path|text|frame|image|prancheta|retângulo|elipse|grupo|caminho|texto|imagem)( \d+)?$/i

// ---------------------------------------------------------------- colors

function parseHex(value) {
  let hex = String(value ?? '')
    .trim()
    .replace(/^#/, '')
  if (hex.length === 3) hex = [...hex].map((char) => char + char).join('')
  if (hex.length === 8) hex = hex.slice(0, 6)
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null
  return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16))
}

function toHex(rgb) {
  return `#${rgb
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(first, second) {
  const a = relativeLuminance(first)
  const b = relativeLuminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

function blend(top, alpha, bottom) {
  return top.map((channel, index) => channel * alpha + bottom[index] * (1 - alpha))
}

function toLab(rgb) {
  const linear = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  const x = (linear[0] * 0.4124 + linear[1] * 0.3576 + linear[2] * 0.1805) / 0.95047
  const y = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
  const z = (linear[0] * 0.0193 + linear[1] * 0.1192 + linear[2] * 0.9505) / 1.08883
  const f = (value) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116)
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))]
}

function deltaE(first, second) {
  const a = toLab(first)
  const b = toLab(second)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

function isSolidFill(fill) {
  return Boolean(fill?.fillColor) && !fill.fillImage && !fill.fillColorGradient
}

// ---------------------------------------------------------------- tokens

function flattenTokens(node, prefix, output) {
  for (const [key, value] of Object.entries(node ?? {})) {
    if (!value || typeof value !== 'object') continue
    const name = [...prefix, key].join('.')
    if ('$value' in value) output.set(name, { type: value.$type, value: value.$value })
    else flattenTokens(value, [...prefix, key], output)
  }
}

export function resolveTokens(tokensLib, themeName) {
  const library = tokensLib ?? {}
  const setNames =
    library.$metadata?.tokenSetOrder ??
    Object.keys(library).filter((key) => !key.startsWith('$'))
  const theme = (library.$themes ?? []).find((candidate) => candidate.name === themeName)
  const enabledSets = theme
    ? setNames.filter((name) => theme.selectedTokenSets?.[name] === 'enabled')
    : setNames
  const raw = new Map()
  for (const setName of enabledSets) flattenTokens(library[setName], [], raw)

  const resolved = new Map()
  const resolve = (name, seen = new Set()) => {
    if (resolved.has(name)) return resolved.get(name)
    const token = raw.get(name)
    if (!token || seen.has(name)) return null
    seen.add(name)
    let value = String(token.value)
    const reference = value.match(/^\{([^}]+)\}$/)
    if (reference) value = resolve(reference[1], seen)?.value ?? null
    const result = value === null ? null : { type: token.type, value }
    resolved.set(name, result)
    return result
  }
  for (const name of raw.keys()) resolve(name)

  const colors = new Map()
  const colorsByHex = new Map()
  const numbersByType = new Map()
  for (const [name, token] of resolved) {
    if (!token) continue
    if (token.type === 'color') {
      const rgb = parseHex(token.value)
      if (!rgb) continue
      const hex = toHex(rgb)
      colors.set(name, { hex, rgb })
      colorsByHex.set(hex, [...(colorsByHex.get(hex) ?? []), name])
    } else {
      const number = Number(token.value)
      if (Number.isFinite(number)) {
        numbersByType.set(
          token.type,
          new Set([...(numbersByType.get(token.type) ?? []), number]),
        )
      }
    }
  }
  return { colors, colorsByHex, numbersByType }
}

// ---------------------------------------------------------------- pages

function indexPage(page) {
  const objects = page.objects ?? {}
  const paintOrder = []
  const visit = (id) => {
    const shape = objects[id]
    if (!shape) return
    if (id !== ROOT_SHAPE_ID) paintOrder.push(id)
    for (const childId of shape.shapes ?? []) visit(childId)
  }
  visit(ROOT_SHAPE_ID)
  const paintIndex = new Map(paintOrder.map((id, index) => [id, index]))

  const hiddenCache = new Map()
  const isHidden = (id) => {
    if (!id || id === ROOT_SHAPE_ID) return false
    if (hiddenCache.has(id)) return hiddenCache.get(id)
    const shape = objects[id]
    const hidden = !shape || shape.hidden === true || isHidden(shape.parentId)
    hiddenCache.set(id, hidden)
    return hidden
  }

  const opacityCache = new Map()
  const opacityOf = (id) => {
    if (!id || id === ROOT_SHAPE_ID) return 1
    if (opacityCache.has(id)) return opacityCache.get(id)
    const shape = objects[id]
    const opacity = (shape?.opacity ?? 1) * opacityOf(shape?.parentId)
    opacityCache.set(id, opacity)
    return opacity
  }

  const ancestorsOf = (id) => {
    const ancestors = []
    let current = objects[id]?.parentId
    while (current && current !== ROOT_SHAPE_ID && objects[current]) {
      ancestors.unshift(objects[current])
      current = objects[current].parentId
    }
    return ancestors
  }

  return { page, objects, paintOrder, paintIndex, isHidden, opacityOf, ancestorsOf }
}

function boxOf(shape) {
  const rect = shape.selrect ?? {
    x1: shape.x,
    y1: shape.y,
    x2: shape.x + shape.width,
    y2: shape.y + shape.height,
  }
  return { x1: rect.x1, y1: rect.y1, x2: rect.x2, y2: rect.y2 }
}

function contains(outer, inner, tolerance = 0.5) {
  return (
    inner.x1 >= outer.x1 - tolerance &&
    inner.y1 >= outer.y1 - tolerance &&
    inner.x2 <= outer.x2 + tolerance &&
    inner.y2 <= outer.y2 + tolerance
  )
}

function intersects(first, second) {
  return (
    first.x1 < second.x2 &&
    second.x1 < first.x2 &&
    first.y1 < second.y2 &&
    second.y1 < first.y2
  )
}

function locate(context, shape) {
  const ancestors = context.ancestorsOf(shape.id)
  const section = ancestors[0] ?? shape
  const screen = ancestors[1] ?? (ancestors.length === 1 ? shape : section)
  const layerPath = [...ancestors.slice(2), shape].map((item) => item.name).join(' › ')
  return {
    page: context.page.name,
    section: section.name,
    screen: screen.name,
    layer: layerPath || shape.name,
    shapeId: shape.id,
  }
}

function isInCopy(shape) {
  return Boolean(shape.shapeRef)
}

function isTouched(shape, ...groups) {
  return groups.some((group) =>
    (shape.touched ?? []).some((item) => item === group || item.startsWith(group)),
  )
}

function textRuns(shape) {
  const runs = []
  const walk = (node) => {
    if (!node) return
    if (typeof node.text === 'string') {
      runs.push({
        text: node.text,
        fontSize: Number(node.fontSize),
        fontWeight: Number(node.fontWeight),
        fontFamily: node.fontFamily,
        fills: node.fills ?? [],
      })
      return
    }
    for (const child of node.children ?? []) walk(child)
  }
  walk(shape.content)
  return runs.filter((run) => run.text.trim().length > 0)
}

function backgroundBehind(context, shape) {
  const target = boxOf(shape)
  const limit = context.paintIndex.get(shape.id) ?? 0
  let color = parseHex(context.page.background) ?? parseHex(DEFAULT_PAGE_BACKGROUND)
  let unknown = false
  for (let index = 0; index < limit; index++) {
    const candidate = context.objects[context.paintOrder[index]]
    if (!candidate || candidate.type === 'text' || context.isHidden(candidate.id))
      continue
    if (!contains(boxOf(candidate), target)) continue
    const opacity = context.opacityOf(candidate.id)
    for (const fill of [...(candidate.fills ?? [])].reverse()) {
      if (fill.fillImage || fill.fillColorGradient) {
        unknown = true
        continue
      }
      const rgb = parseHex(fill.fillColor)
      if (!rgb) continue
      const alpha = (fill.fillOpacity ?? 1) * opacity
      color = blend(rgb, alpha, color)
      if (alpha >= 1) unknown = false
    }
  }
  return { rgb: color, unknown }
}

// ---------------------------------------------------------------- rules

function finding(rule, severity, location, message, key = '') {
  return {
    rule,
    category: RULE_CATEGORIES[rule],
    severity,
    ...location,
    message,
    fingerprint: `${rule}:${location.shapeId}${key ? `:${key}` : ''}`,
  }
}

function formatPercent(alpha) {
  return alpha < 0.995 ? ` at ${Math.round(alpha * 100)}%` : ''
}

function checkTextContrast(context, shape, report, stats) {
  const runs = textRuns(shape)
  if (runs.length === 0) return
  const background = backgroundBehind(context, shape)
  if (background.unknown) {
    stats.unknownBackgrounds++
    return
  }
  let worst = null
  for (const run of runs) {
    const fill = run.fills.find(isSolidFill)
    const rgb = parseHex(fill?.fillColor)
    if (!rgb) continue
    const alpha = (fill.fillOpacity ?? 1) * context.opacityOf(shape.id)
    const foreground = blend(rgb, alpha, background.rgb)
    const ratio = contrastRatio(foreground, background.rgb)
    const large = run.fontSize >= 24 || (run.fontSize >= 18.66 && run.fontWeight >= 700)
    const required = large ? 3 : 4.5
    if (ratio < required && (!worst || ratio / required < worst.ratio / worst.required)) {
      worst = { ratio, required, run, color: toHex(rgb), alpha }
    }
  }
  if (!worst) return
  report(
    finding(
      'contrast',
      'error',
      locate(context, shape),
      `${worst.ratio.toFixed(2)}:1 < ${worst.required}:1 · "${worst.run.text.slice(0, 32)}" ${worst.run.fontSize}px ${worst.color}${formatPercent(worst.alpha)} on ${toHex(background.rgb)}`,
    ),
  )
}

function iconContainerOf(context, shape, pattern) {
  return [...context.ancestorsOf(shape.id), shape].find((item) =>
    pattern.test(item.name ?? ''),
  )
}

function checkIconContrast(context, shape, config, seenIcons) {
  if (!['path', 'circle', 'rect', 'bool'].includes(shape.type)) return
  const icon = iconContainerOf(context, shape, config.iconPattern)
  if (!icon || icon.id === shape.id) return
  const isInsideIcon = (candidate) => {
    let current = candidate
    while (current && current.id !== ROOT_SHAPE_ID) {
      if (current.id === icon.id) return true
      current = context.objects[current.parentId]
    }
    return false
  }
  // A filled piece that holds later pieces is the icon's own chip, not a glyph.
  const index = context.paintIndex.get(shape.id) ?? 0
  const box = boxOf(shape)
  if ((shape.fills ?? []).some(isSolidFill)) {
    // Paint order is depth-first, so the icon's later pieces follow contiguously.
    for (let next = index + 1; next < context.paintOrder.length; next++) {
      const later = context.objects[context.paintOrder[next]]
      if (!later || !isInsideIcon(later)) break
      if (!context.isHidden(later.id) && contains(box, boxOf(later))) return
    }
  }
  const stroke = (shape.strokes ?? []).find(
    (item) => item.strokeColor && (item.strokeWidth ?? 1) > 0,
  )
  const fill = (shape.fills ?? []).find(isSolidFill)
  const paint = stroke
    ? { color: stroke.strokeColor, opacity: stroke.strokeOpacity ?? 1 }
    : fill
      ? { color: fill.fillColor, opacity: fill.fillOpacity ?? 1 }
      : null
  const rgb = parseHex(paint?.color)
  if (!rgb) return
  const background = backgroundBehind(context, shape)
  if (background.unknown) return
  const alpha = paint.opacity * context.opacityOf(shape.id)
  const ratio = contrastRatio(blend(rgb, alpha, background.rgb), background.rgb)
  if (ratio >= 3) return
  const previous = seenIcons.get(icon.id)
  if (previous && previous.ratio <= ratio) return
  seenIcons.set(icon.id, {
    ratio,
    finding: finding(
      'icon-contrast',
      'warning',
      locate(context, icon),
      `${ratio.toFixed(2)}:1 < 3:1 · ${toHex(rgb)}${formatPercent(alpha)} on ${toHex(background.rgb)}`,
    ),
  })
}

function classifyColor(hex, tokens, config) {
  const rgb = parseHex(hex)
  if (!rgb) return null
  const exact = tokens.colorsByHex.get(toHex(rgb))
  if (exact) return { rule: 'color-unbound', severity: 'warning', tokens: exact }
  let nearest = null
  for (const [name, token] of tokens.colors) {
    const distance = deltaE(rgb, token.rgb)
    if (!nearest || distance < nearest.distance)
      nearest = { name, distance, hex: token.hex }
  }
  if (nearest && nearest.distance <= config.nearTokenDeltaE) {
    return { rule: 'color-near-token', severity: 'error', nearest }
  }
  return { rule: 'color-off-palette', severity: 'error', nearest }
}

function checkColorBinding(context, shape, tokens, config, report) {
  // Page-root sections are canvas scaffolding, not product UI.
  if (shape.parentId === ROOT_SHAPE_ID) return
  const isIconPart = Boolean(iconContainerOf(context, shape, config.iconPattern))
  // Paths and imported SVG elements are artwork unless they belong to an icon.
  if ((shape.type === 'path' || /^svg-/.test(shape.name ?? '')) && !isIconPart) return
  if (['group', 'svg-raw', 'image'].includes(shape.type)) return
  const inCopy = isInCopy(shape)
  const slots = []
  if (shape.type === 'text') {
    if (!inCopy || isTouched(shape, 'content-group', 'text-content', 'fill-group')) {
      const colors = textRuns(shape)
        .flatMap((run) => run.fills)
        .filter(isSolidFill)
        .map((fill) => fill.fillColor)
      slots.push({ key: 'fill', label: 'text', colors })
    }
  } else {
    if (!inCopy || isTouched(shape, 'fill-group')) {
      slots.push({
        key: 'fill',
        label: 'fill',
        colors: (shape.fills ?? []).filter(isSolidFill).map((fill) => fill.fillColor),
      })
    }
    // Penpot draws its own dashed outline around variant sets.
    if (!shape.isVariantContainer && (!inCopy || isTouched(shape, 'stroke-group'))) {
      slots.push({
        key: 'strokeColor',
        label: 'stroke',
        colors: (shape.strokes ?? [])
          .filter((stroke) => stroke.strokeColor && (stroke.strokeWidth ?? 1) > 0)
          .map((stroke) => stroke.strokeColor),
      })
    }
  }
  for (const slot of slots) {
    const colors = [
      ...new Set(slot.colors.map((color) => toHex(parseHex(color) ?? [0, 0, 0]))),
    ]
    if (colors.length === 0) continue
    const location = locate(context, shape)
    const boundName = shape.appliedTokens?.[slot.key]
    if (boundName) {
      const token = tokens.colors.get(boundName)
      if (!token) {
        report(
          finding(
            'token-missing',
            'error',
            location,
            `${slot.label} is bound to unknown token ${boundName}`,
            slot.key,
          ),
        )
        continue
      }
      const drifted = colors.find((hex) => deltaE(parseHex(hex), token.rgb) > 1)
      if (drifted) {
        report(
          finding(
            'token-stale',
            'error',
            location,
            `${slot.label} ${drifted} differs from its token ${boundName} (${token.hex}); reapply the token`,
            slot.key,
          ),
        )
      }
      continue
    }
    const results = colors.map((hex) => ({
      hex,
      result: classifyColor(hex, tokens, config),
    }))
    const order = { 'color-off-palette': 0, 'color-near-token': 1, 'color-unbound': 2 }
    const worst = results
      .filter((item) => item.result)
      .sort((a, b) => order[a.result.rule] - order[b.result.rule])[0]
    if (!worst) continue
    const { hex, result } = worst
    const message =
      result.rule === 'color-unbound'
        ? `${slot.label} ${hex} matches ${result.tokens.slice(0, 2).join(' / ')}; bind the token`
        : result.rule === 'color-near-token'
          ? `${slot.label} ${hex} is almost ${result.nearest.name} (${result.nearest.hex}, ΔE ${result.nearest.distance.toFixed(1)})`
          : `${slot.label} ${hex} is not a token color${result.nearest ? ` (closest ${result.nearest.name} ${result.nearest.hex})` : ''}`
    report(finding(result.rule, result.severity, location, message, slot.key))
  }
}

function checkTypography(context, shape, config, report) {
  const location = locate(context, shape)
  const typography = config.typography
  if (
    !isInCopy(shape) ||
    isTouched(shape, 'content-group', 'text-content', 'text-font-group')
  ) {
    const runs = textRuns(shape)
    const sizes = [...new Set(runs.map((run) => run.fontSize))]
    const families = [...new Set(runs.map((run) => run.fontFamily))]
    const weights = [...new Set(runs.map((run) => run.fontWeight))]
    const small = sizes.filter((size) => size < typography.minSize)
    if (small.length > 0) {
      report(
        finding(
          'type-min-size',
          'error',
          location,
          `${small.join(', ')}px is below the ${typography.minSize}px minimum`,
        ),
      )
    }
    const offScale = sizes.filter(
      (size) => size >= typography.minSize && !typography.sizes.includes(size),
    )
    if (offScale.length > 0) {
      report(
        finding(
          'type-scale',
          'warning',
          location,
          `${offScale.join(', ')}px is not on the type scale (${typography.sizes.join(', ')})`,
        ),
      )
    }
    const badFamilies = families.filter((family) => !typography.families.includes(family))
    if (badFamilies.length > 0) {
      report(
        finding(
          'type-family',
          'error',
          location,
          `font ${badFamilies.join(', ')} is not allowed (${typography.families.join(', ')})`,
        ),
      )
    }
    const badWeights = weights.filter((weight) => !typography.weights.includes(weight))
    if (badWeights.length > 0) {
      report(
        finding(
          'type-weight',
          'warning',
          location,
          `weight ${badWeights.join(', ')} is not allowed (${typography.weights.join(', ')})`,
        ),
      )
    }
  }

  const box = boxOf(shape)
  if (shape.growType === 'fixed' && Array.isArray(shape.positionData)) {
    const overflow = shape.positionData.some(
      (run) => run.y > box.y2 + 1 || run.x + run.width > box.x2 + 1,
    )
    if (overflow)
      report(
        finding(
          'text-overflow',
          'error',
          location,
          'text does not fit its fixed-size box',
        ),
      )
  }

  const clip = [...context.ancestorsOf(shape.id)]
    .reverse()
    .find((ancestor) => ancestor.type === 'frame' && ancestor.showContent !== true)
  if (clip && !contains(boxOf(clip), box, 1)) {
    report(
      finding(
        'text-clipped',
        'error',
        location,
        `text is cut off by "${clip.name}", which clips its content`,
      ),
    )
  }
}

function usedGaps(shape) {
  const childCount = (shape.shapes ?? []).length
  if (childCount < 2) return []
  const gap = shape.layoutGap ?? {}
  if (shape.layout === 'grid') return [gap.rowGap, gap.columnGap]
  const wraps = shape.layoutWrapType === 'wrap'
  const isRow = String(shape.layoutFlexDir ?? 'row').startsWith('row')
  if (isRow) return wraps ? [gap.columnGap, gap.rowGap] : [gap.columnGap]
  return wraps ? [gap.rowGap, gap.columnGap] : [gap.rowGap]
}

function checkSpacingAndRadius(context, shape, tokens, config, report) {
  if (isInCopy(shape) || shape.parentId === ROOT_SHAPE_ID) return
  const location = locate(context, shape)
  const spacing = new Set([
    0,
    ...(tokens.numbersByType.get('spacing') ?? []),
    ...config.spacing.extra,
  ])
  if (shape.type === 'frame' && shape.layout) {
    const values = [...usedGaps(shape), ...Object.values(shape.layoutPadding ?? {})]
      .filter((value) => typeof value === 'number')
      .map((value) => Math.round(value * 100) / 100)
    const offScale = [...new Set(values.filter((value) => !spacing.has(value)))]
    if (offScale.length > 0) {
      report(
        finding(
          'spacing',
          'warning',
          location,
          `gap/padding ${offScale.join(', ')}px is not on the spacing scale (${[...spacing].sort((a, b) => a - b).join(', ')})`,
        ),
      )
    }
  }
  if (!['frame', 'rect'].includes(shape.type)) return
  if (iconContainerOf(context, shape, config.iconPattern)) return
  if (['r1', 'r2', 'r3', 'r4'].some((key) => shape.appliedTokens?.[key])) return
  const radii = new Set([
    0,
    ...(tokens.numbersByType.get('borderRadius') ?? []),
    ...config.radius.extra,
  ])
  const full = Math.min(shape.width, shape.height) / 2
  const offScale = [...new Set([shape.r1, shape.r2, shape.r3, shape.r4])]
    .filter((value) => typeof value === 'number')
    .filter((value) => !radii.has(value) && value < full - 0.5)
  if (offScale.length > 0) {
    report(
      finding(
        'radius',
        'warning',
        location,
        `radius ${offScale.join(', ')}px is not allowed (${[...radii]
          .filter((value) => value < 9999)
          .sort((a, b) => a - b)
          .join(', ')} or fully round)`,
      ),
    )
  }
}

function checkHygiene(context, shape, file, report) {
  const location = locate(context, shape)
  if (shape.parentId === ROOT_SHAPE_ID && shape.type !== 'frame') {
    report(
      finding(
        'root-stray',
        'error',
        location,
        `${shape.type} sits at the page root, outside any section`,
      ),
    )
  }
  if (!isInCopy(shape) && DEFAULT_LAYER_NAME.test(shape.name ?? '')) {
    report(
      finding(
        'default-name',
        'warning',
        location,
        `layer still has the default name "${shape.name}"`,
      ),
    )
  }
  if (
    shape.type === 'frame' &&
    (shape.shapes ?? []).length === 0 &&
    !context.objects[shape.parentId]?.layout &&
    !(shape.fills ?? []).length &&
    !(shape.strokes ?? []).length
  ) {
    report(
      finding(
        'empty-frame',
        'warning',
        location,
        'board is empty and has no fill or stroke',
      ),
    )
  }
  if (shape.componentRoot && shape.componentId && shape.componentFile === file.id) {
    const component = file.data.components?.[shape.componentId]
    if (!component || component.deleted) {
      report(
        finding(
          'broken-component',
          'error',
          location,
          'copy points to a component that no longer exists',
        ),
      )
    }
  }
}

function checkHiddenLayer(context, shape, report) {
  if (shape.hidden !== true || isInCopy(shape)) return
  if (context.isHidden(shape.parentId)) return
  report(
    finding(
      'hidden-layer',
      'warning',
      locate(context, shape),
      'hidden layer; remove it or show it',
    ),
  )
}

function checkSectionOverlap(context, report) {
  const sections = (context.objects[ROOT_SHAPE_ID]?.shapes ?? [])
    .map((id) => context.objects[id])
    .filter((shape) => shape && shape.type === 'frame' && !shape.hidden)
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      if (!intersects(boxOf(sections[i]), boxOf(sections[j]))) continue
      const [first, second] = [sections[i], sections[j]].sort((a, b) =>
        a.id.localeCompare(b.id),
      )
      report(
        finding(
          'section-overlap',
          'error',
          locate(context, first),
          `section "${first.name}" overlaps "${second.name}"`,
          second.id,
        ),
      )
    }
  }
}

// ---------------------------------------------------------------- runner

export function analyzeFile(file, config, filters = {}) {
  const tokens = resolveTokens(file.data.tokensLib, config.theme)
  const findings = []
  const stats = { pages: 0, layers: 0, unknownBackgrounds: 0 }
  const pageFilter = filters.page?.toLowerCase()
  const boardFilter = filters.board?.toLowerCase()
  for (const pageId of file.data.pages ?? Object.keys(file.data.pagesIndex)) {
    const page = file.data.pagesIndex[pageId]
    if (!page || config.excludePages.includes(page.name)) continue
    if (pageFilter && !page.name.toLowerCase().includes(pageFilter)) continue
    const context = indexPage(page)
    stats.pages++
    const report = (item) => {
      if (
        boardFilter &&
        !`${item.section} ${item.screen}`.toLowerCase().includes(boardFilter)
      )
        return
      findings.push(item)
    }
    if (!boardFilter) checkSectionOverlap(context, report)
    const seenIcons = new Map()
    for (const id of context.paintOrder) {
      const shape = context.objects[id]
      checkHiddenLayer(context, shape, report)
      if (context.isHidden(id)) continue
      stats.layers++
      checkHygiene(context, shape, file, report)
      checkColorBinding(context, shape, tokens, config, report)
      checkSpacingAndRadius(context, shape, tokens, config, report)
      if (shape.type === 'text') {
        checkTextContrast(context, shape, report, stats)
        checkTypography(context, shape, config, report)
      } else {
        checkIconContrast(context, shape, config, seenIcons)
      }
    }
    for (const { finding: item } of seenIcons.values()) report(item)
  }
  const ruleFilter = filters.rule
  const selected = ruleFilter
    ? findings.filter((item) => item.rule === ruleFilter || item.category === ruleFilter)
    : findings
  return { findings: selected, stats }
}

export function normalizeConfig(raw = {}) {
  const ignore = raw.ignore ?? []
  for (const entry of ignore) {
    if (!entry.reason || !String(entry.reason).trim()) {
      throw new Error(`Every ignore entry needs a reason: ${JSON.stringify(entry)}`)
    }
    if (!entry.shapeId && !entry.layer) {
      throw new Error(
        `Every ignore entry needs a shapeId or a layer: ${JSON.stringify(entry)}`,
      )
    }
  }
  return {
    fileId: raw.fileId,
    penpotUrl: raw.penpotUrl ?? 'https://design.penpot.app',
    theme: raw.theme ?? 'Dark',
    excludePages: raw.excludePages ?? [],
    nearTokenDeltaE: raw.nearTokenDeltaE ?? 5,
    iconPattern: new RegExp(raw.iconPattern ?? '^(lucide:|ícone|icone|icon)', 'i'),
    typography: {
      minSize: raw.typography?.minSize ?? 12,
      sizes: raw.typography?.sizes ?? [12, 14, 16, 18, 20, 24, 28, 32, 36],
      families: raw.typography?.families ?? ['Poppins', 'Roboto Mono'],
      weights: raw.typography?.weights ?? [400, 500, 600, 700],
    },
    spacing: { extra: raw.spacing?.extra ?? [] },
    radius: { extra: raw.radius?.extra ?? [] },
    ignore,
  }
}

function matchesIgnore(item, entry) {
  if (entry.rule && entry.rule !== item.rule && entry.rule !== item.category) return false
  if (entry.shapeId) return entry.shapeId === item.shapeId
  if (entry.screen && !item.screen.includes(entry.screen)) return false
  return item.layer === entry.layer || item.layer.endsWith(` › ${entry.layer}`)
}

export function classifyFindings(findings, config, baseline) {
  const known = new Set(baseline?.findings ?? [])
  const current = new Set(findings.map((item) => item.fingerprint))
  const classified = findings.map((item) => {
    const ignored = config.ignore.find((entry) => matchesIgnore(item, entry))
    if (ignored) return { ...item, status: 'ignored', reason: ignored.reason }
    return { ...item, status: known.has(item.fingerprint) ? 'baseline' : 'new' }
  })
  const resolved = [...known].filter((fingerprint) => !current.has(fingerprint)).length
  return { findings: classified, resolved }
}

export function createBaseline(classifiedFindings, file) {
  const findings = [
    ...new Set(
      classifiedFindings
        .filter((item) => item.status !== 'ignored')
        .map((item) => item.fingerprint),
    ),
  ].sort()
  return { file: file.name, revn: file.revn, findings }
}

function shortenLayer(layer) {
  const parts = layer.split(' › ')
  return parts.length > 3 ? `… › ${parts.slice(-3).join(' › ')}` : layer
}

function formatReport(result, file, options) {
  const lines = []
  const visible = result.findings.filter((item) => options.all || item.status === 'new')
  lines.push(
    `check:design · ${file.name} rev ${file.revn} · ${result.stats.pages} pages · ${result.stats.layers} layers`,
  )
  const groups = new Map()
  for (const item of visible) {
    const key = `${item.page} › ${item.screen}`
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  for (const [key, items] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push('', key)
    for (const item of items.sort(
      (a, b) => a.severity.localeCompare(b.severity) || a.rule.localeCompare(b.rule),
    )) {
      const mark = item.severity === 'error' ? 'error' : 'warn '
      const status = item.status === 'new' ? '' : ` [${item.status}]`
      lines.push(`  ${mark} ${item.rule.padEnd(18)} ${shortenLayer(item.layer)}${status}`)
      lines.push(`        ${item.message}`)
    }
  }
  const count = (status, severity) =>
    result.findings.filter((item) => item.status === status && item.severity === severity)
      .length
  lines.push(
    '',
    `New: ${count('new', 'error')} errors, ${count('new', 'warning')} warnings. ` +
      `Baseline: ${count('baseline', 'error') + count('baseline', 'warning')}. ` +
      `Ignored: ${result.findings.filter((item) => item.status === 'ignored').length}.`,
  )
  if (result.resolved > 0) {
    lines.push(
      `${result.resolved} baseline findings are fixed; run pnpm run update:design-baseline to drop them.`,
    )
  }
  if (result.stats.unknownBackgrounds > 0) {
    lines.push(
      `${result.stats.unknownBackgrounds} texts sit on an image or gradient; their contrast was not checked.`,
    )
  }
  return lines.join('\n')
}

// ---------------------------------------------------------------- I/O

function readEnvValue(content, key) {
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 0 || trimmed.slice(0, separator).trim() !== key) continue
    const value = trimmed.slice(separator + 1).trim()
    return value ? value.replace(/^(['"])(.*)\1$/, '$2') : null
  }
  return null
}

function readAccessToken() {
  if (process.env.PENPOT_ACCESS_TOKEN) return process.env.PENPOT_ACCESS_TOKEN
  const envFile = path.join(ROOT_DIRECTORY, '.env.local')
  const token = existsSync(envFile)
    ? readEnvValue(readFileSync(envFile, 'utf8'), 'PENPOT_ACCESS_TOKEN')
    : null
  if (!token) {
    throw new Error(
      'PENPOT_ACCESS_TOKEN is missing. Create one in Penpot (Your account → Access tokens) and add it to the root .env.local.',
    )
  }
  return token
}

async function fetchFile(config) {
  if (!config.fileId) throw new Error(`Set "fileId" in ${path.basename(CONFIG_PATH)}.`)
  const response = await fetch(`${config.penpotUrl}/api/rpc/command/get-file`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${readAccessToken()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ id: config.fileId }),
  })
  if (response.status === 401 || response.status === 403) {
    throw new Error(
      `Penpot rejected the access token (${response.status}). It may have expired; create a new one.`,
    )
  }
  if (!response.ok) throw new Error(`Penpot returned ${response.status} for get-file.`)
  return response.text()
}

export function parseFile(text) {
  const file = JSON.parse(text)
  if (!file?.data?.pagesIndex) {
    throw new Error('Unexpected Penpot file format: data.pagesIndex is missing.')
  }
  for (const page of Object.values(file.data.pagesIndex)) {
    if (
      !page?.objects ||
      typeof page.objects !== 'object' ||
      !page.objects[ROOT_SHAPE_ID]
    ) {
      throw new Error(
        `Unexpected Penpot file format on page "${page?.name}": objects are not inline. The file may use a newer storage format.`,
      )
    }
  }
  return file
}

// Keys that only describe where a shape sits on the canvas or how it was
// rendered; moving a board must not change its digest.
const VOLATILE_KEYS = new Set([
  'points',
  'selrect',
  'transform',
  'transformInverse',
  'positionData',
])

function relativeShape(shape, origin) {
  const entries = Object.entries(shape)
    .filter(([key]) => !VOLATILE_KEYS.has(key))
    .map(([key, value]) => {
      if (key === 'x') return [key, Math.round((value - origin.x) * 100) / 100]
      if (key === 'y') return [key, Math.round((value - origin.y) * 100) / 100]
      if (key === 'parentId' || key === 'frameId')
        return [key, value === origin.parentId ? null : value]
      return [key, value]
    })
    .sort(([a], [b]) => a.localeCompare(b))
  return Object.fromEntries(entries)
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value ?? null)
}

// A digest per screen board (a board directly inside a page section), computed
// from the board and its descendants with coordinates relative to the board.
export function digestBoards(file, config, filters = {}) {
  const digests = []
  const pageFilter = filters.page?.toLowerCase()
  const boardFilter = filters.board?.toLowerCase()
  for (const pageId of file.data.pages ?? Object.keys(file.data.pagesIndex)) {
    const page = file.data.pagesIndex[pageId]
    if (!page || config.excludePages.includes(page.name)) continue
    if (pageFilter && !page.name.toLowerCase().includes(pageFilter)) continue
    const objects = page.objects
    for (const sectionId of objects[ROOT_SHAPE_ID]?.shapes ?? []) {
      const section = objects[sectionId]
      if (section?.type !== 'frame') continue
      for (const boardId of section.shapes ?? []) {
        const board = objects[boardId]
        if (board?.type !== 'frame') continue
        if (
          boardFilter &&
          !`${section.name} ${board.name}`.toLowerCase().includes(boardFilter)
        )
          continue
        const origin = { x: board.x, y: board.y, parentId: board.parentId }
        const shapes = []
        const visit = (id) => {
          const shape = objects[id]
          if (!shape) return
          shapes.push(relativeShape(shape, origin))
          for (const childId of shape.shapes ?? []) visit(childId)
        }
        visit(boardId)
        const digest = createHash('sha256')
          .update(stableStringify(shapes))
          .digest('hex')
          .slice(0, 16)
        digests.push({
          page: page.name,
          section: section.name,
          board: board.name,
          digest,
        })
      }
    }
  }
  return digests
}

function readOption(args, name) {
  const index = args.indexOf(name)
  if (index < 0) return undefined
  const value = args[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${name} needs a value.`)
  return value
}

export function parseArguments(args) {
  return {
    page: readOption(args, '--page'),
    board: readOption(args, '--board'),
    rule: readOption(args, '--rule'),
    file: readOption(args, '--file'),
    save: readOption(args, '--save'),
    all: args.includes('--all'),
    json: args.includes('--json'),
    updateBaseline: args.includes('--update-baseline'),
    digest: args.includes('--digest'),
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (
    options.rule &&
    !RULE_CATEGORIES[options.rule] &&
    !Object.values(RULE_CATEGORIES).includes(options.rule)
  ) {
    throw new Error(`Unknown rule "${options.rule}".`)
  }
  if (options.updateBaseline && (options.page || options.board || options.rule)) {
    throw new Error(
      'The baseline covers the whole file. Run --update-baseline without --page, --board or --rule.',
    )
  }
  const config = normalizeConfig(
    existsSync(CONFIG_PATH) ? JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) : {},
  )
  const text = options.file
    ? readFileSync(path.resolve(options.file), 'utf8')
    : await fetchFile(config)
  if (options.save) writeFileSync(path.resolve(options.save), text)
  const file = parseFile(text)
  if (options.digest) {
    const digests = digestBoards(file, config, options)
    if (options.json)
      console.log(
        JSON.stringify(
          { file: { name: file.name, revn: file.revn }, boards: digests },
          null,
          2,
        ),
      )
    else
      for (const item of digests)
        console.log(`${item.digest}  ${item.page} › ${item.board}`)
    return 0
  }
  const analysis = analyzeFile(file, config, options)
  const baseline = existsSync(BASELINE_PATH)
    ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
    : null
  const classified = classifyFindings(
    analysis.findings,
    config,
    options.updateBaseline ? null : baseline,
  )

  if (options.updateBaseline) {
    const next = createBaseline(classified.findings, file)
    writeFileSync(BASELINE_PATH, `${JSON.stringify(next, null, 2)}\n`)
    console.log(
      `Design baseline updated with ${next.findings.length} findings (${path.basename(BASELINE_PATH)}).`,
    )
    return 0
  }

  const filtered = options.page || options.board || options.rule
  const result = {
    ...classified,
    resolved: filtered ? 0 : classified.resolved,
    stats: analysis.stats,
  }
  if (options.json) {
    console.log(
      JSON.stringify(
        {
          file: { name: file.name, revn: file.revn },
          stats: result.stats,
          resolved: result.resolved,
          findings: result.findings,
        },
        null,
        2,
      ),
    )
  } else {
    console.log(formatReport(result, file, options))
  }
  return result.findings.some(
    (item) => item.status === 'new' && item.severity === 'error',
  )
    ? 1
    : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .then((code) => {
      process.exitCode = code
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    })
}

export { contrastRatio, deltaE, parseHex }
