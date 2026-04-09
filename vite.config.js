import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/fitness_club/',
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
});
