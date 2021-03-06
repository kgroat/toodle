
export function shallowDiffers<T> (a: T, b: T) {
  if (a === b) return false
  if (typeof a !== typeof b) return true
  if (typeof a !== 'object') return true
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}
