export function checkIncludedArray(array1: unknown[], array2: unknown[]) {
  return array1.every((value) => array2.includes(value))
}
