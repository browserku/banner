import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [vue()],
	build: {
		rollupOptions: {
			input: {
				index: path.resolve('index.html'),
				iframe: path.resolve('iframe.html')
			}
		}
	}
});
