
import { Observable } from 'rxjs/Observable'

import { DeepReadonly } from './DeepReadonly'
import { Mutators, ReaderMutator } from './Mutator'
import { Getters, ReaderGetter, ObserverGetter } from './Getter'

export interface Module<S, M extends Mutators<S> = {}, G extends Getters<S> = {}> {
  readonly state: S
  readonly mutators: M
  readonly getters: G
}

export interface StateCallback<S> {
  (state: DeepReadonly<S>): void
}

export type ReaderModule<S, M extends Mutators<S>, G extends Getters<S>> = {
  readonly mutators: ReaderMutator<S, M>
  readonly getters: ReaderGetter<S, G>
  readonly getState: () => DeepReadonly<S>
  readonly onChange: (state: StateCallback<S>) => void
  readonly offChange: (state: StateCallback<S>) => void
}

export type ObserverModule<S, M extends Mutators<S>, G extends Getters<S>> = {
  readonly mutators: ReaderMutator<S, M>
  readonly getters: ObserverGetter<S, G>
  readonly state: Observable<DeepReadonly<S>>
}