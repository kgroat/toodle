
import {
  Getter,
  DeepReadonly,
} from './types'

export function getter<S, V, O = {}> (get: (state: DeepReadonly<S>, opts: O) => V, defaultOptions?: O): Getter<S, O, V> {
  return {
    get,
    defaultOptions,
  }
}
