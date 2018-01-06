
import { Observable } from 'rxjs/Observable'

import { ReadonlyFlatMap } from './FlatMap'
import { DeepReadonly } from './DeepReadonly'

export interface Getter<S, O> {
  get: (val: DeepReadonly<S>) => O
  defaultVal?: O
}

export type Getters<S> = ReadonlyFlatMap<Getter<S, any>>

export type ReaderGetter<S, G extends ReadonlyFlatMap<Getter<S, any>>> = {
  [P in keyof G]: () => G[P]['defaultVal']
}

export type ObserverGetter<S, G extends ReadonlyFlatMap<Getter<S, any>>> = {
  [P in keyof G]: Observable<G[P]['defaultVal']>
}
