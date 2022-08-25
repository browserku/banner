<script lang="ts" setup>
import { computed, onMounted, PropType, Ref, ref, watchEffect } from 'vue';
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
    template,
    data: JSON.stringify(data)
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

const isDownloading = ref(false);

const buttons: { text: string; onClick: () => void; isLoading?: Ref<boolean> }[] = [
	{
		text: 'Download',
		async onClick() {
			isDownloading.value = true;
			await iframe.value?.run('download', undefined);
			isDownloading.value = false;
		},
		isLoading: isDownloading
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
				class="inline-flex items-center space-x-1 from-indigo-600 to-purple-600 bg-gradient-to-br text-white rounded-xl px-4 h-10 transition-transform active:translate-y-[2px]"
				:class="[button.isLoading?.value && `opacity-50 cursor-not-allowed`]"
			>
				<span v-if="button.isLoading?.value"
					><svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path></svg></span
				><span>{{ button.text }}</span>
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
