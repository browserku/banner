<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watchEffect } from 'vue';
import { Config, defaultConfig } from '../lib/config';
import type { Actions } from '../iframe';
import { createWorker } from 'typed-worker';
import stringifyObject from '../lib/stringify-object';
import UrlDialog from './UrlDialog.vue';

const props = defineProps({
	css: {
		type: String,
		required: true
	},
	html: {
		type: String,
		required: true
	},
	templateData: {
		type: Object as PropType<Record<string, any>>,
		required: true
	},
	generatingCSS: {
		type: Boolean
	},
	config: {
		type: Object as PropType<Config>,
		default: {}
	}
});

const isUrlDialogOpen = ref(false);
const el = ref<HTMLIFrameElement | null>(null);

const iframe = ref<ReturnType<typeof createWorker<Actions>> | null>(null);

const wrapTemplate = (html: string) =>
	`<div style="height:${props.config.height || defaultConfig.height}px;width:${
		props.config.width || defaultConfig.width
	}px">${html}</div>`;

const imageUrl = computed(() => {
	const query = new URLSearchParams({
		template: wrapTemplate(props.html),
		data: JSON.stringify({ ...props.templateData })
	});
	return `https://api.browserku.com/banner?${query.toString()}`;
});

const jsCode = computed(() => {
	return `
const data = ${stringifyObject(
		{ ...props.templateData },
		{
			singleQuotes: false
		}
	)}
const template = ${JSON.stringify(wrapTemplate(props.html))}

const query = new URLSearchParams({
    template: wrapTemplate(props.html),
    data: JSON.stringify(props.data)
});
const url = \`https://api.browserku.com/banner?\${query.toString()}\`
    `.trim();
});

onMounted(() => {
	const iframeEl = el.value;
	if (iframeEl) {
		iframe.value = createWorker<Actions>(() => iframeEl);
	}
});

watchEffect(() => {
	const target = iframe.value;
	if (!target) return;

	target.run('render', {
		data: { ...props.templateData },
		template: props.html,
		css: props.css,
		config: { ...props.config }
	});
});

const buttons = [
	{
		text: 'Download',
		async onClick() {
			await iframe.value?.run('download', undefined);
		}
	},
	{
		text: 'Get URL',
		onClick() {
			isUrlDialogOpen.value = true;
		}
	}
];
</script>

<template>
	<div class="flex flex-col space-y-8 justify-center items-center h-full">
		<iframe
			ref="el"
			class="bg-white border-0"
			src="/iframe.html"
			:style="{
				height: `${props.config.height || 320}px`,
				width: `${props.config.height || 640}px`
			}"
		/>
		<div class="flex space-x-3">
			<button
				v-for="button in buttons"
				:key="button.text"
				type="button"
				@click="button.onClick"
				class="from-indigo-600 to-purple-600 bg-gradient-to-br text-white rounded-xl px-4 h-10 transition-transform active:translate-y-[2px]"
			>
				{{ button.text }}
			</button>
		</div>
	</div>
	<UrlDialog
		:isOpen="isUrlDialogOpen"
		:setIsOpen="(open) => (isUrlDialogOpen = open)"
		:url="imageUrl"
		:jsCode="jsCode"
	/>
</template>
