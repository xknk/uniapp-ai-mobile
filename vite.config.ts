/*
 * @Author: Leo
 * @Date: 2022-11-07 18:27:24
 * @LastEditTime: 2025-04-03 11:38:28
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: uniapp\插件模板\前端页面模板\uniapp-ai-mobile\vite.config.ts
 *  Copyright (c) 2025 樊小肆. All rights reserved.
 */
import { loadEnv, ConfigEnv, UserConfig } from 'vite'
import uni from "@dcloudio/vite-plugin-uni";
import WindiCSS from 'vite-plugin-windicss';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path'
import { wrapperEnv } from './build/utils'

function pathResolve(dir: string) {
    return resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {

    const root = process.cwd()
    const env = loadEnv(mode, root)
    const viteEnv = wrapperEnv(env);
    const { VITE_PUBLIC_PATH } = viteEnv;

    return {
        base: VITE_PUBLIC_PATH,
        build: {
            rollupOptions: {
                external: ['@DatatracCorporation/markdown - it - mermaid']
            }
        },
        plugins: [
            uni(),
            Components({
                resolvers: [VantResolver()],
            }),
            WindiCSS({
                scan: {
                    dirs: ['.'],
                    fileExtensions: ['vue', 'js', 'ts'],
                },
            }),
            vueSetupExtend()
        ],
        resolve: {
            alias: [
                {
                    find: /@\//,
                    replacement: pathResolve('src') + '/'
                },
                {
                    find: /#\//,
                    replacement: pathResolve('types') + '/'
                }
            ],
            extensions: ['.ts', '.js', '.mjs', '.jsx', '.tsx', '.json'],
        },
        server: {
            host: true,
            port: 9999,
            proxy: {
                '/api': {
                    target: 'http://test.com/api',
                    changeOrigin: true,
                    rewrite: path => path.replace(new RegExp(`^/lgwms`), ''),
                    ws: true,
                    secure: false
                }
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "src/styles/index.scss" as *;`
                }
            }
        },
    }
}
