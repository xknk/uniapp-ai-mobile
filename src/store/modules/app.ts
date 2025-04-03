/*
 * @Author: yiuhai
 * @Date: 2022-09-03 11:17:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-04-03 10:53:01
 * @FilePath:\uniapp\插件模板\前端页面模板\uniapp-ai-mobile\src\store\modules\app.ts
 * @Description:1
 */
import { defineStore } from 'pinia'
import { store } from '@/store'

export const useUserStore = defineStore({
    id: 'app-user',
    state: () => ({
        appPrefixCls: 'INTDNA',
        // 用户信息
        userInfo: null,
        // token
        token: '', // undefined,
        accountUid: '',
    }),
    getters: {
        getUserInfo() {
            return this.userInfo
        },
        getToken() {
            return this.token || (uni.getStorageSync('token') as string)
        },
    },
    actions: {
        setToken(token) {
            this.token = token ? token : ''
            uni.setStorageSync('token', token)
        },
        setUserInfo(info) {
            this.userInfo = info
        },
        async buildUserInfo(token: string | null | undefined, type?: any, userInfo: any = undefined) {
        },
    },
})

export function useUserStoreWithOut() {
    return useUserStore(store)
}
