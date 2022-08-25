import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { compile } from 'tempura';

export default defineConfig({
	plugins: [
		vue(),
		{
			name: 'html',
			async transformIndexHtml(html, ctx) {
				const render = compile(html);
				return render({ prod: !ctx.server });
			}
		}
	],
	build: {
		rollupOptions: {
			input: {
				index: path.resolve('index.html'),
				iframe: path.resolve('iframe.html')
			}
		},
		sourcemap: true
	}
});
