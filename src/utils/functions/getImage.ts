export function getImage(folder: string, resource: string) {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${folder}/${resource}`
}
