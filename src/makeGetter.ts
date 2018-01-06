
import {
  Getter,
  DeepReadonly,
} from './types'

export function getter<S, O = {}> (get: (state: DeepReadonly<S>) => O, defaultVal?: O): Getter<S, O> {
  return {
    get,
    defaultVal,
  }
}
