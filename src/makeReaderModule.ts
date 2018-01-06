
import {
  DeepReadonly,
  Module,
  StateCallback,
  Mutators,
  Getters,
  ReaderModule,
  ReaderMutator,
  ReaderGetter,
} from './types'

export function makeReaderModule<S, M extends Mutators<S>, G extends Getters<S>> (mod: Module<S, M, G>): ReaderModule<S, M, G> {
  const mutators = {} as ReaderMutator<S, M>
  const getters = {} as ReaderGetter<S, G>
  const callbacks = {} as Map<StateCallback<S>, StateCallback<S>>
  let state = mod.state as any as DeepReadonly<S>

  Object.keys(mod.mutators).forEach(key => {
    const mutator = mod.mutators[key]
    mutators[key] = (opts = mutator.defaultOptions) => {
      state = mutator.mutate(state, opts)
      callbacks.forEach(cb => cb(state))
    }
  })

  Object.keys(mod.getters).forEach(key => {
    const getter = mod.getters[key]
    getters[key] = () => getter.get(state)
  })

  function onChange (cb: StateCallback<S>) {
    callbacks.set(cb, cb)
  }

  function offChange (cb: StateCallback<S>) {
    callbacks.delete(cb)
  }

  return {
    mutators,
    getters,
    getState: () => state,
    onChange,
    offChange,
  }
}
