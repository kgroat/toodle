
import {
  Mutator,
  DeepReadonly,
} from './types'

export function mutator<S, O> (mutate: (state: DeepReadonly<S>, options: O) => DeepReadonly<S>, defaultOptions?: O): Mutator<S, O> {
  return {
    mutate,
    defaultOptions,
  }
}
