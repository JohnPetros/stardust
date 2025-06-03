export async function parseResponseJson(response: Response) {
  try {
    return await response.json()
  } catch (error) {
    return null
  }
}
