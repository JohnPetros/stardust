export function checkObject<ObjectType extends object>(
  object: ObjectType,
  props: string[]
) {
  for (const prop of props) {
    if (!(prop in object)) return false
  }

  return true
}
