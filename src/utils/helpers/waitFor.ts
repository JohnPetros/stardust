export async function waitFor(timeout = 1000) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timeout)
  })
}
