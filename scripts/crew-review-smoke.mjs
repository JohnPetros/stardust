import { execSync } from 'node:child_process'

const API_URL = 'https://api.stardust.local'
const SERVICE_TOKEN = 'stardust-internal-admin-token-2026'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

async function fetchUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${SERVICE_TOKEN}` },
  })
  return response.json()
}

export async function exportUsers(ids, outputPath) {
  const users = []
  for (const id of ids) {
    users.push(await fetchUser(id))
  }
  for (const user of users) {
    const posts = await fetch(`${API_URL}/users/${user.id}/posts`).then((res) => res.json())
    user.posts = posts
  }
  execSync(`echo '${JSON.stringify(users)}' > ${outputPath}`)
  return users.length
}

export function parseFilter(expression) {
  return eval(`(user) => ${expression}`)
}
