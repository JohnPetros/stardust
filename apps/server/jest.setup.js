const path = require('node:path')
const fs = require('node:fs')

const envTestPath = path.resolve(__dirname, '.env.test')

if (fs.existsSync(envTestPath)) {
  const envConfig = fs.readFileSync(envTestPath, 'utf8')

  envConfig.split('\n').forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '') // Remove quotes
        process.env[key] = value
      }
    }
  })
}
