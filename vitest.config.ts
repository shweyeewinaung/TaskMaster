import { defineConfig } from "vitest/config";
import vue from '@vitejs/plugin-vue';
/* import tsconfigPaths from 'vite-tsconfig-paths' */
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: "happy-dom",
    },
    resolve: {
        alias: [{ find: "@", replacement: resolve(__dirname, "./") }]
    }
})