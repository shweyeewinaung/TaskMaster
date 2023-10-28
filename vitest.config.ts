import { defineConfig } from "vitest/config";
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: "happy-dom",
        coverage: {
            exclude: ['stores/mocks/**']
        }
    },
    resolve: {
        alias: [{ find: "@", replacement: resolve(__dirname, "./") }]
    }
})