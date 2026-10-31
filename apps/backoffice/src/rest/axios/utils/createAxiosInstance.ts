import axios from 'axios'

export const createAxiosInstance = (
  baseURL?: string,
  headers?: Record<string, string>,
) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}
