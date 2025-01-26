const DEFAULT_SLEEP_TIMEOUT = 1000 // miliseconds

export function useSleep() {
  async function sleep(timeout = DEFAULT_SLEEP_TIMEOUT) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, timeout)
    })
  }

  return {
    sleep,
  }
}
