
import { Observable } from 'rxjs/Observable'

import { DeepReadonly } from './DeepReadonly'
import { Mutators, ReaderMutator, AsyncMutators, ReaderAsyncMutator } from './Mutator'
import { Getters, ReaderGetter, ObserverGetter } from './Getter'

export interface Module<S, M extends Mutators<S> = {}, G extends Getters<S> = {}, A extends AsyncMutators<S, M> = {}> {
  readonly state: S
  readonly mutators: M
  readonly getters?: G
  readonly async?: A
}

export interface StateCallback<S> {
  (state: DeepReadonly<S>): void
}

export type ReaderModule<S, M extends Mutators<S>, G extends Getters<S>, A extends AsyncMutators<S, M>> = {
  readonly getState: () => DeepReadonly<S>
  readonly getters: ReaderGetter<S, G>
  readonly mutators: ReaderMutator<S, M>
  readonly async: ReaderAsyncMutator<S, A, M>
  readonly onChange: (state: StateCallback<S>) => void
  readonly offChange: (state: StateCallback<S>) => void
}

export type ObserverModule<S, M extends Mutators<S>, G extends Getters<S>, A extends AsyncMutators<S, M>> = {
  readonly state: Observable<DeepReadonly<S>>
  readonly getters: ObserverGetter<S, G>
  readonly mutators: ReaderMutator<S, M>
  readonly async: ReaderAsyncMutator<S, A, M>
}