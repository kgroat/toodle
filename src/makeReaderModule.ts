
import {
  DeepReadonly,
  Module,
  StateCallback,
  Mutators,
  AsyncMutators,
  Getters,
  ReaderModule,
  ReaderMutator,
  ReaderGetter,
  ReaderAsyncMutator,
} from './types'

export function makeReaderModule<S, M extends Mutators<S>, G extends Getters<S>, A extends AsyncMutators<S, M>> (mod: Module<S, M, G, A>): ReaderModule<S, M, G, A> {
  const readerMutators = {} as ReaderMutator<S, M>
  const readerGetters = {} as ReaderGetter<S, G>
  const readerAsync = {} as ReaderAsyncMutator<S, A, M>
  const callbacks = {} as Map<StateCallback<S>, StateCallback<S>>
  let state = mod.state as any as DeepReadonly<S>

  const { getters, mutators = {} as M, async = {} as A } = mod

  Object.keys(mutators).forEach(key => {
    const mutator = mutators[key]
    readerMutators[key] = (opts = mutator.defaultOptions) => {
      state = mutator.mutate(state, opts)
      callbacks.forEach(cb => cb(state))
    }
  })

  Object.keys(async).forEach(key => {
    const asyncMutator = async[key]
    readerAsync[key] = (opts = asyncMutator.defaultOptions) => {
      asyncMutator.mutate(readerMutators, opts)
    }
  })

  Object.keys(getters).forEach(key => {
    const getter = getters[key]
    readerGetters[key] = () => getter.get(state)
  })

  function onChange (cb: StateCallback<S>) {
    callbacks.set(cb, cb)
  }

  function offChange (cb: StateCallback<S>) {
    callbacks.delete(cb)
  }

  return {
    mutators: readerMutators,
    getters: readerGetters,
    async: readerAsync,
    getState: () => state,
    onChange,
    offChange,
  }
}
