export function fetchMock() {
  window.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => [],
    })
  )
}
