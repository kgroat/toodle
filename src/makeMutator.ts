
import {
  AsyncMutator,
  ReaderMutator,
  Mutator,
  DeepReadonly,
} from './types'

export function mutator<S, O> (mutate: (state: DeepReadonly<S>, options: O) => DeepReadonly<S>, defaultOptions?: O): Mutator<S, O> {
  return {
    mutate,
    defaultOptions,
  }
}

export function asyncMutator<S, O, M extends ReaderMutator<S, any>> (mutate: (mutators: M, options: O) => void, defaultOptions?: O): AsyncMutator<S, O, M> {
  return {
    mutate,
    defaultOptions,
  }
}
