import assert from 'node:assert/strict'
import test from 'node:test'

import {
  evaluate,
  extractMetrics,
  median,
  medianMetrics,
  parseArguments,
  validateConfig,
} from '../check-web-quality.mjs'

test('median handles odd and even sample sizes', () => {
  assert.equal(median([9, 1, 5]), 5)
  assert.equal(median([4, 1, 3, 2]), 2.5)
  assert.throws(() => median([]))
})

test('extractMetrics converts category scores to points and keeps raw metric values', () => {
  const metrics = extractMetrics({
    categories: { performance: { score: 0.514 }, seo: { score: null } },
    audits: {
      'largest-contentful-paint': { numericValue: 5400 },
      'total-blocking-time': { numericValue: 60 },
      'cumulative-layout-shift': { numericValue: 0.001 },
    },
  })

  assert.deepEqual(metrics, {
    performance: 51,
    lcp: 5400,
    tbt: 60,
    cls: 0.001,
  })
})

test('medianMetrics takes the median of each metric across runs', () => {
  assert.deepEqual(
    medianMetrics([
      { performance: 40, lcp: 9000 },
      { performance: 70, lcp: 5000 },
      { performance: 52, lcp: 7000 },
    ]),
    { performance: 52, lcp: 7000 },
  )
})

test('evaluate treats categories as minimums and timings as maximums', () => {
  const failures = evaluate(
    { performance: 49, accessibility: 95, lcp: 2600, cls: 0.05 },
    {
      performance: { min: 50 },
      accessibility: { min: 90 },
      lcp: { max: 2500 },
      cls: { max: 0.1 },
    },
  )

  assert.deepEqual(
    failures.map((failure) => [failure.metric, failure.reason]),
    [
      ['performance', 'below-minimum'],
      ['lcp', 'above-maximum'],
    ],
  )
})

test('evaluate fails a threshold whose metric was not measured', () => {
  const failures = evaluate({}, { tbt: { max: 200 } })

  assert.equal(failures[0].reason, 'missing')
})

test('validateConfig rejects unknown metrics, presets and rules without bounds', () => {
  const errors = validateConfig({
    routes: [
      {
        name: 'home',
        path: '/',
        presets: { tablet: {}, mobile: { speed: { min: 1 }, lcp: {} } },
      },
    ],
  })

  assert.equal(errors.length, 3)
  assert.match(errors.join('\n'), /unknown preset "tablet"/)
  assert.match(errors.join('\n'), /unknown metric "speed"/)
  assert.match(errors.join('\n'), /"min" or "max" is required/)
})

test('validateConfig accepts the shipped shape', () => {
  assert.deepEqual(
    validateConfig({
      routes: [{ name: 'a', path: '/a', presets: { desktop: { lcp: { max: 1 } } } }],
    }),
    [],
  )
})

test('parseArguments reads options and rejects invalid input', () => {
  const options = parseArguments([
    '--base',
    'http://localhost:3100/',
    '--route',
    'galaxies',
    '--runs',
    '1',
  ])

  assert.equal(options.base, 'http://localhost:3100')
  assert.deepEqual(options.routes, ['galaxies'])
  assert.equal(options.runs, 1)
  assert.throws(() => parseArguments(['--runs', '0']), /positive integer/)
  assert.throws(() => parseArguments(['--nope']), /Unknown option/)
  assert.throws(() => parseArguments(['--base']), /requires a value/)
})
