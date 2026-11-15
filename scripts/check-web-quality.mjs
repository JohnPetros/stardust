#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_CONFIG = path.join(ROOT, 'scripts', 'web-quality.config.json')
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']
const METRIC_AUDITS = {
  lcp: 'largest-contentful-paint',
  tbt: 'total-blocking-time',
  cls: 'cumulative-layout-shift',
}
const USAGE = `Usage: node scripts/check-web-quality.mjs [options]

Measures running pages with Lighthouse and checks each metric against the minimums
declared in the config. It does not build or start the application.

Options:
  --base <url>      Application URL (default: http://localhost:3000)
  --config <path>   Thresholds file (default: scripts/web-quality.config.json)
  --route <name>    Check only the route with this name (repeatable)
  --runs <n>        Lighthouse runs per route and preset (default: 3; the median is checked)
  --json <path>     Write the full result as JSON
  --help            Show this message

Authenticated routes sign in with WEB_APP_E2E_EMAIL and WEB_APP_E2E_PASSWORD
(load them with: eval "$(node scripts/export-web-app-e2e-env.mjs --seed)").`

export function median(values) {
  if (values.length === 0) throw new Error('median requires at least one value')
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

export function extractMetrics(report) {
  const metrics = {}
  for (const category of CATEGORIES) {
    const score = report.categories?.[category]?.score
    if (typeof score === 'number') metrics[category] = Math.round(score * 100)
  }
  for (const [name, auditId] of Object.entries(METRIC_AUDITS)) {
    const value = report.audits?.[auditId]?.numericValue
    if (typeof value === 'number') metrics[name] = value
  }
  return metrics
}

export function medianMetrics(runs) {
  const names = new Set(runs.flatMap((metrics) => Object.keys(metrics)))
  const result = {}
  for (const name of names) {
    const values = runs.map((metrics) => metrics[name]).filter(Number.isFinite)
    if (values.length > 0) result[name] = median(values)
  }
  return result
}

/**
 * Compares measured metrics with thresholds. Category thresholds are minimum scores
 * (`{ "min": 90 }`); `lcp`, `tbt` and `cls` thresholds are upper limits (`{ "max": 2500 }`).
 */
export function evaluate(metrics, thresholds) {
  const failures = []
  for (const [name, rule] of Object.entries(thresholds)) {
    const value = metrics[name]
    if (!Number.isFinite(value)) {
      failures.push({ metric: name, reason: 'missing', value: null, rule })
      continue
    }
    if (rule.min !== undefined && value < rule.min)
      failures.push({ metric: name, reason: 'below-minimum', value, rule })
    if (rule.max !== undefined && value > rule.max)
      failures.push({ metric: name, reason: 'above-maximum', value, rule })
  }
  return failures
}

export function validateConfig(config) {
  const errors = []
  if (!config || !Array.isArray(config.routes) || config.routes.length === 0)
    return ['config.routes must be a non-empty array']
  const known = new Set([...CATEGORIES, ...Object.keys(METRIC_AUDITS)])
  for (const route of config.routes) {
    const label = route?.name ?? '(unnamed route)'
    if (!route?.name || !route?.path?.startsWith('/'))
      errors.push(`${label}: name and a path starting with "/" are required`)
    if (!route?.presets || Object.keys(route.presets).length === 0)
      errors.push(`${label}: at least one preset (mobile or desktop) is required`)
    for (const [preset, thresholds] of Object.entries(route?.presets ?? {})) {
      if (!['mobile', 'desktop'].includes(preset))
        errors.push(`${label}: unknown preset "${preset}"`)
      for (const [metric, rule] of Object.entries(thresholds)) {
        if (!known.has(metric))
          errors.push(`${label}/${preset}: unknown metric "${metric}"`)
        else if (rule.min === undefined && rule.max === undefined)
          errors.push(`${label}/${preset}/${metric}: "min" or "max" is required`)
      }
    }
  }
  return errors
}

export function parseArguments(argv) {
  const options = {
    base: 'http://localhost:3000',
    config: DEFAULT_CONFIG,
    routes: [],
    runs: 3,
    json: null,
    help: false,
  }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    const next = () => {
      const value = argv[(index += 1)]
      if (value === undefined) throw new Error(`${argument} requires a value`)
      return value
    }
    if (argument === '--help') options.help = true
    else if (argument === '--base') options.base = next().replace(/\/+$/, '')
    else if (argument === '--config') options.config = path.resolve(next())
    else if (argument === '--route') options.routes.push(next())
    else if (argument === '--json') options.json = path.resolve(next())
    else if (argument === '--runs') {
      options.runs = Number(next())
      if (!Number.isInteger(options.runs) || options.runs < 1)
        throw new Error('--runs must be a positive integer')
    } else throw new Error(`Unknown option: ${argument}`)
  }
  return options
}

function formatValue(metric, value) {
  if (!Number.isFinite(value)) return 'n/a'
  if (metric === 'cls') return value.toFixed(3)
  if (metric === 'lcp' || metric === 'tbt') return `${Math.round(value)} ms`
  return String(Math.round(value))
}

function formatRule(rule) {
  return rule.min !== undefined ? `>= ${rule.min}` : `<= ${rule.max}`
}

async function loadPlaywright() {
  const require = createRequire(path.join(ROOT, 'apps/web/package.json'))
  return require('playwright')
}

async function signIn(chromium, base) {
  const email = process.env.WEB_APP_E2E_EMAIL
  const password = process.env.WEB_APP_E2E_PASSWORD
  if (!email || !password)
    throw new Error(
      'Authenticated routes need WEB_APP_E2E_EMAIL and WEB_APP_E2E_PASSWORD (see --help).',
    )
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.goto(`${base}/auth/sign-in`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    const emailInput = page.getByTestId('email-input')
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await emailInput.fill('')
      await emailInput.fill(email)
      if ((await emailInput.inputValue()) === email) break
      await page.waitForTimeout(1500)
    }
    await page.getByTestId('password-input').fill(password)
    await page.getByTestId('submit-button').click()
    await page.waitForURL((url) => !url.pathname.startsWith('/auth'), {
      timeout: 90000,
    })
    const cookies = await page.context().cookies(base)
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  } finally {
    await browser.close()
  }
}

async function warnIfDevelopmentServer(base) {
  try {
    const html = await (await fetch(`${base}/auth/sign-in`)).text()
    if (/turbopack|webpack-hmr|_next\/static\/development/i.test(html))
      console.warn(
        `warning: ${base} looks like a Next dev server; measure a production build for real numbers.`,
      )
  } catch {
    throw new Error(`Cannot reach ${base}. Start the application first.`)
  }
}

function runLighthouse({ url, preset, cookieHeaderFile, chromePath, outputPath }) {
  const bin = path.join(ROOT, 'node_modules', '.bin', 'lighthouse')
  const args = [
    url,
    '--chrome-flags=--headless=new --no-sandbox',
    '--output=json',
    `--output-path=${outputPath}`,
    `--only-categories=${CATEGORIES.join(',')}`,
    '--quiet',
  ]
  if (preset === 'desktop') args.push('--preset=desktop')
  if (cookieHeaderFile) args.push(`--extra-headers=${cookieHeaderFile}`)
  execFileSync(bin, args, {
    stdio: ['ignore', 'ignore', 'inherit'],
    timeout: 300000,
    env: { ...process.env, CHROME_PATH: chromePath },
  })
  return JSON.parse(readFileSync(outputPath, 'utf8'))
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    console.log(USAGE)
    return 0
  }
  const config = JSON.parse(readFileSync(options.config, 'utf8'))
  const configErrors = validateConfig(config)
  if (configErrors.length > 0) {
    for (const error of configErrors) console.error(`config error: ${error}`)
    return 2
  }
  const routes = config.routes.filter(
    (route) => options.routes.length === 0 || options.routes.includes(route.name),
  )
  if (routes.length === 0) {
    console.error(`No route matches: ${options.routes.join(', ')}`)
    return 2
  }

  await warnIfDevelopmentServer(options.base)
  const { chromium } = await loadPlaywright()
  const chromePath = chromium.executablePath()
  if (!existsSync(chromePath))
    throw new Error(
      'Chromium is missing: run pnpm --filter @stardust/web run test:integration:install',
    )

  const workDirectory = mkdtempSync(path.join(tmpdir(), 'web-quality-'))
  const results = []
  try {
    let cookieHeaderFile = null
    if (routes.some((route) => route.auth)) {
      const cookie = await signIn(chromium, options.base)
      cookieHeaderFile = path.join(workDirectory, 'headers.json')
      writeFileSync(cookieHeaderFile, JSON.stringify({ Cookie: cookie }), {
        mode: 0o600,
      })
    }

    for (const route of routes) {
      for (const [preset, thresholds] of Object.entries(route.presets)) {
        const runs = []
        for (let run = 1; run <= options.runs; run += 1) {
          const report = runLighthouse({
            url: `${options.base}${route.path}`,
            preset,
            cookieHeaderFile: route.auth ? cookieHeaderFile : null,
            chromePath,
            outputPath: path.join(workDirectory, `${route.name}-${preset}-${run}.json`),
          })
          const finalUrl = new URL(report.finalDisplayedUrl)
          if (route.auth && finalUrl.pathname.startsWith('/auth'))
            throw new Error(
              `${route.name}: redirected to ${finalUrl.pathname}; the session was not accepted.`,
            )
          runs.push(extractMetrics(report))
        }
        const metrics = medianMetrics(runs)
        const failures = evaluate(metrics, thresholds)
        results.push({
          route: route.name,
          preset,
          runs: runs.length,
          metrics,
          thresholds,
          failures,
        })
      }
    }
  } finally {
    rmSync(workDirectory, { recursive: true, force: true })
  }

  for (const result of results) {
    console.log(`\n${result.route} (${result.preset}, median of ${result.runs})`)
    for (const [metric, rule] of Object.entries(result.thresholds)) {
      const failed = result.failures.some((failure) => failure.metric === metric)
      console.log(
        `  ${failed ? 'FAIL' : 'ok  '} ${metric.padEnd(15)} ${formatValue(metric, result.metrics[metric]).padStart(9)}  (required ${formatRule(rule)})`,
      )
    }
  }
  if (options.json) writeFileSync(options.json, `${JSON.stringify(results, null, 2)}\n`)

  const failedCount = results.reduce((total, result) => total + result.failures.length, 0)
  console.log(
    failedCount === 0
      ? '\nWeb quality check passed.'
      : `\nWeb quality check failed: ${failedCount} metric(s) below the required level.`,
  )
  return failedCount === 0 ? 0 : 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then(
    (code) => process.exit(code),
    (error) => {
      console.error(error instanceof Error ? error.message : error)
      process.exit(2)
    },
  )
}
