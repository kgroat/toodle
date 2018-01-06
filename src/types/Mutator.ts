
import { ReadonlyFlatMap } from './FlatMap'
import { DeepReadonly } from './DeepReadonly'

export interface Mutator<S, O> {
  mutate: (prev: DeepReadonly<S>, options: O) => DeepReadonly<S>
  defaultOptions?: O
}

export interface Mutators<S> extends ReadonlyFlatMap<Mutator<S, any>> {}

export type ReaderMutator<S, M extends ReadonlyFlatMap<Mutator<S, any>>> = {
  [P in keyof M]: (opts: M[P]['defaultOptions']) => void
}
