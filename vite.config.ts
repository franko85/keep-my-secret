import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/keep-my-secret/',
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    server: {
        host: true, // Abilita accesso da rete locale per testing mobile
        port: 5173,
    },
    resolve: {
        alias: {
            'graphql': 'graphql/index.js',
        },
    },
    build: {
        rollupOptions: {
            external: [],
        },
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true,
        },
    },
    optimizeDeps: {
        include: ['msw', 'graphql'],
        esbuildOptions: {
            mainFields: ['module', 'main'],
        },
    },
});
