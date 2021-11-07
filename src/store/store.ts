import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { userItem } from '@/models/user'
import { ROLES } from '@/constant'

export interface State {
    isVisible: boolean,
    isLogin: boolean,
    showRegist: boolean,
    isRoot: boolean,
    user: userItem
}

export const key: InjectionKey<Store<State>> = Symbol()
export const store = createStore<State>({
    state: {
        isVisible: false,
        isLogin: false,
        showRegist: false,
        isRoot: false,
        user: {}
    },
    mutations: {
        showModel(state: State, payload: boolean): void {
            state.isVisible = payload
        },
        isLogin(state: State, payload: boolean): void {
            state.isLogin = payload
        },
        showRegist(state: State, payload: boolean): void {
            state.showRegist = payload
        },
        checkRoot(state: State, payload: string): void {
            state.isRoot = payload === ROLES.admin ? true : false
        },
        getUserInfo(state: State, payload: userItem): void {
            state.user = payload
            state.isRoot = payload.role === ROLES.admin ? true : false
        },
        clearUserInfo(state: State): void {
            state.user = {}
        }
    }
})

export function useStore(): Store<State> {
    return baseUseStore(key)
}
