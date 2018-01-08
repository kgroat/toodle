
import {
  AsyncMutator,
  ReaderMutator,
  Mutators,
  Mutator,
  DeepReadonly,
} from './types'

export function mutator<S, O> (mutate: (state: DeepReadonly<S>, options: O) => DeepReadonly<S>, defaultOptions?: O): Mutator<S, O> {
  return {
    mutate,
    defaultOptions,
  }
}

export function asyncMutator<S, O, M extends Mutators<S>> (mutate: (mutators: ReaderMutator<S, M>, options: O) => void, defaultOptions?: O): AsyncMutator<S, O, ReaderMutator<S, M>> {
  return {
    mutate,
    defaultOptions,
  }
}
