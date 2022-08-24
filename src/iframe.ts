import { handleActions } from 'typed-worker';
import { toPng } from 'dom-to-image-retina';
import { createApp } from 'petite-vue';
import { Config, defaultConfig } from './lib/config';

const root = document.getElementById('root')!;
const unoCSS = document.getElementById('uno-css')!;

const download = async () => {
	const dataUrl = await toPng(root);
	const a = document.createElement('a');
	a.href = dataUrl;
	a.download = 'preview.png';
	a.click();
};

let app: ReturnType<typeof createApp> | undefined;

const render = (payload: { data: any; template: string; css: string; config: Config }) => {
	if (app) {
		app.unmount();
		root.innerHTML = payload.template;
	}
	unoCSS.innerHTML = payload.css;
	root.style.height = `${payload.config.height || defaultConfig.height}px`;
	root.style.width = `${payload.config.width || defaultConfig.width}px`;
	app = createApp(payload.data).mount(root);
};

const actions = {
	download,
	render
};

handleActions(actions);

export type Actions = typeof actions;
