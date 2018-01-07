
import { ReadonlyFlatMap } from './FlatMap'
import { DeepReadonly } from './DeepReadonly'

export interface Mutator<S, O> {
  mutate: (prev: DeepReadonly<S>, options: O) => DeepReadonly<S>
  defaultOptions?: O
}

export interface Mutators<S> extends ReadonlyFlatMap<Mutator<S, any>> {}

export interface AsyncMutator<S, O, M extends ReaderMutator<S, any>> {
  mutate: (mutators: M, options: O) => void
  defaultOptions?: O
}

export interface AsyncMutators<S, M extends Mutators<S>> extends ReadonlyFlatMap<AsyncMutator<S, any, ReaderMutator<S, M>>> {}

export type ReaderMutator<S, M extends Mutators<S>> = {
  [P in keyof M]: (opts: M[P]['defaultOptions']) => void
}

export type ReaderAsyncMutator<S, A extends AsyncMutators<S, M>, M extends Mutators<S>> = {
  [P in keyof A]: (opts: A[P]['defaultOptions']) => void
}
