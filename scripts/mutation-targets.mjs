// Core use cases are the only mutation targets. Paths are relative to packages/core.
const USE_CASE = /^src\/([^/]+)\/use-cases\/(?!index\.ts$)([^/]+)\.ts$/

export function getUseCaseModule(path) {
  const [, module, name] = path.match(USE_CASE) ?? []
  if (!module || /\.(d|test|spec)$/.test(name)) return null
  return module
}
