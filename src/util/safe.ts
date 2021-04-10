export function safe<T>(t: T | undefined) {
  if (!t) {
    throw new Error('Undefined element.')
  }

  return t
}
