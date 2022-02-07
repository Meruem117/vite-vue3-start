import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import VuexPersistence from 'vuex-persist'
import type { userItem } from '@/models/user'

export interface State {
    isLogin: boolean,
    user: userItem
}

export const key: InjectionKey<Store<State>> = Symbol()
export const store = createStore<State>({
    state: {
        isLogin: false,
        user: {}
    },
    mutations: {
        isLogin(state: State, payload: boolean): void {
            state.isLogin = payload
        },
        getUser(state: State, payload: userItem): void {
            state.user = payload
        },
        clearUser(state: State): void {
            state.user = {}
        }
    },
    plugins: [new VuexPersistence().plugin]
})

export function useStore(): Store<State> {
    return baseUseStore(key)
}
