
export function nextTick (cb: () => void) {
  setTimeout(cb, 0)
}
