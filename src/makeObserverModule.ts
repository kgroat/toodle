
import { Observable } from 'rxjs/Observable'
import { Subscriber } from 'rxjs/Subscriber'
import * as uuid from 'uuid/v4'

import {
  DeepReadonly,
  FlatMap,
  Module,
  Mutators,
  Getters,
  ObserverModule,
  ReaderMutator,
  ObserverGetter,
} from './types'

import { shallowDiffers } from './shallow'

type GetterVals<S, G extends Getters<S>> = {
  [P in keyof G]: G[P]['defaultVal']
}

type GetterSubscribers<S, G extends Getters<S>> = {
  [P in keyof G]: FlatMap<Subscriber<G[P]['defaultVal']>>
}

export function makeObserverModule<S, M extends Mutators<S>, G extends Getters<S>> (mod: Module<S, M, G>): ObserverModule<S, M, G> {
  const mutators = {} as ReaderMutator<S, M>
  const getters = {} as ObserverGetter<S, G>
  let state = mod.state as any as DeepReadonly<S>

  const previousGetterVals = {} as GetterVals<S, G>
  const getterSubs = {} as GetterSubscribers<S, G>
  const mainSubs = {} as FlatMap<Subscriber<DeepReadonly<S>>>

  Object.keys(mod.mutators).forEach(key => {
    const mutator = mod.mutators[key]
    mutators[key] = (opts = mutator.defaultOptions) => {
      const oldState = state
      state = mutator.mutate(state, opts)

      if (!shallowDiffers(oldState, state)) {
        return
      }

      Object.values(mainSubs).forEach(sub => {
        sub.next(state)
      })
      
      Object.keys(getterSubs).forEach(getterName => {
        const getter = mod.getters[getterName]
        const oldVal = previousGetterVals[getterName]
        const newVal = getter.get(state)
        previousGetterVals[getterName] = newVal

        if (shallowDiffers(oldVal, newVal)) {
          Object.values(getterSubs[getterName]).forEach(sub => {
            sub.next(newVal)
          })
        }
      })
    }
  })

  const getterKeys = Object.keys(mod.getters) as (keyof G)[]
  getterKeys.forEach(key => {
    const getter = mod.getters[key]
    const subs = getterSubs[key] = {} as FlatMap<Subscriber<G[typeof key]['defaultVal']>>
    previousGetterVals[key] = getter.get(state)

    getters[key] = new Observable((sub) => {
      const subId = uuid()
      subs[subId] = sub
      sub.next(getter.get(state))

      return () => {
        delete subs[subId]
      }
    })
  })

  return {
    mutators,
    getters,
    state: new Observable(sub => {
      const subId = uuid()
      mainSubs[subId] = sub
      sub.next(state)

      return () => {
        delete mainSubs[subId]
      }
    }),
  }
}