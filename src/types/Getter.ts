
import { Observable } from 'rxjs/Observable'

import { ReadonlyFlatMap } from './FlatMap'
import { DeepReadonly } from './DeepReadonly'

export interface Getter<S, O, V> {
  get: (val: DeepReadonly<S>, opts: O) => V
  defaultOptions?: O
  defaultVal?: V
}

export interface Getters<S> extends ReadonlyFlatMap<Getter<S, any, any>> {}

export type ObserverGetter<S, G extends ReadonlyFlatMap<Getter<S, any, any>>> = {
  [P in keyof G]: (opts?: G[P]['defaultOptions']) => Observable<DeepReadonly<G[P]['defaultVal']>>
}
