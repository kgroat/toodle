
import { Observable } from 'rxjs/Observable'
import { Subscriber } from 'rxjs/Subscriber'
import * as uuid from 'uuid/v4'

import {
  DeepReadonly,
  FlatMap,
  Module,
  Getters,
  Mutators,
  AsyncMutators,
  ObserverModule,
  ReaderMutator,
  ReaderAsyncMutator,
  ObserverGetter,
} from './types'

import { shallowDiffers } from './shallow'
import { nextTick } from './nextTick';

interface GetterSubscriber<O, V> {
  sub: Subscriber<V>
  opts: O
  prev: V
}

type GetterSubscribers<S, G extends Getters<S>> = {
  [P in keyof G]: FlatMap<GetterSubscriber<G[P]['defaultOptions'], G[P]['defaultVal']>>
}

export function makeObserverModule<S, M extends Mutators<S>, G extends Getters<S>, A extends AsyncMutators<S, M>> (mod: Module<S, M, G, A>): ObserverModule<S, M, G, A> {
  const observerGetters = {} as ObserverGetter<S, G>
  const readerMutators = {} as ReaderMutator<S, M>
  const readerAsyncMutators = {} as ReaderAsyncMutator<S, A, M>
  let state = mod.state as any as DeepReadonly<S>

  const getterSubs = {} as GetterSubscribers<S, G>
  const mainSubs = {} as FlatMap<Subscriber<DeepReadonly<S>>>

  const { mutators, getters = {} as G, async = {} as A } = mod

  Object.keys(mutators).forEach(key => {
    const mutator = mutators[key]
    readerMutators[key] = (opts = mutator.defaultOptions) => {
      const oldState = state
      const newState = mutator.mutate(state, opts)
      state = newState

      if (!shallowDiffers(oldState, newState)) {
        return
      }

      nextTick(() => {
        Object.values(mainSubs).forEach(sub => {
          sub.next(newState)
        })
        
        Object.keys(getterSubs).forEach(getterName => {
          const getter = getters[getterName]
          
          Object.values(getterSubs[getterName]).forEach(sub => {
            const { prev, opts } = sub
            const newVal = getter.get(newState, opts)
            sub.prev = newVal
    
            if (!shallowDiffers(prev, newVal)) {
              return
            }
            sub.sub.next(newVal)
          })
        })
      })
    }
  })

  const asyncKeys = Object.keys(async) as (keyof A)[]
  asyncKeys.forEach(key => {
    const asyncMutator = async[key]
    readerAsyncMutators[key] = (opts = asyncMutator.defaultOptions) => {
      asyncMutator.mutate(readerMutators, opts)
    }
  })

  const getterKeys = Object.keys(getters) as (keyof G)[]
  getterKeys.forEach(key => {
    const getter = getters[key]
    const subs = getterSubs[key] = {} as FlatMap<GetterSubscriber<G[typeof key]['defaultOptions'], G[typeof key]['defaultVal']>>

    observerGetters[key] = (opts: G[typeof key]['defaultOptions'] = getter.defaultOptions) => new Observable((sub) => {
      const subId = uuid()
      const val = getter.get(state, opts)
      sub.next(val)
      subs[subId] = {
        sub,
        opts,
        prev: val,
      }

      return () => {
        delete subs[subId]
      }
    })
  })

  return {
    getters: observerGetters,
    mutators: readerMutators,
    async: readerAsyncMutators,
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