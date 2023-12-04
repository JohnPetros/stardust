export function compareArrays(
  array1: Array<string | number>,
  array2: Array<string | number>
) {
  const isEqual =
    JSON.stringify(array1).toLocaleLowerCase() ===
    JSON.stringify(array2).toLocaleLowerCase()

  return isEqual
}
