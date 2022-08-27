<script lang="ts" setup>
import { computed, onMounted, PropType, Ref, ref, watchEffect } from 'vue';
import { Config, defaultConfig } from '../lib/config';
import type { Actions as IframeActions } from '../iframe';
import { createWorker } from 'typed-worker';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import UrlDialog from './UrlDialog.vue';
import { examples } from '../lib/examples';

const props = defineProps({
	css: {
		type: String,
		required: true
	},
	html: {
		type: String,
		required: true
	},
	data: {
		type: String,
		required: true
	},
	generatingCSS: {
		type: Boolean
	},
	config: {
		type: Object as PropType<Config>,
		default: {}
	},
	selectedExampleName: {
		type: String,
		required: true
	},
	updateSelectedExampleName: {
		type: Function as PropType<(name: string) => void>,
		required: true
	}
});

const isUrlDialogOpen = ref(false);
const el = ref<HTMLIFrameElement | null>(null);

const iframe = ref<ReturnType<typeof createWorker<IframeActions>> | null>(null);

const wrapTemplate = (html: string) =>
	`<div style="height:${props.config.height || defaultConfig.height}px;width:${
		props.config.width || defaultConfig.width
	}px">${html}</div>`;

const imageUrl = computed(() => {
	const query = new URLSearchParams({
		template: wrapTemplate(props.html),
		data: props.data,
		response: 'banner.url'
	});
	return `https://api.browserku.com/banner?${query.toString()}`;
});

const jsCode = computed(() => {
	return `
const data = ${props.data}
const template = ${JSON.stringify(wrapTemplate(props.html))}

const query = new URLSearchParams({
    template,
    data: JSON.stringify(data),
	response: 'banner.url'
});
const url = \`https://api.browserku.com/banner?\${query.toString()}\`
    `.trim();
});

onMounted(() => {
	const iframeEl = el.value;
	if (iframeEl) {
		iframe.value = createWorker<IframeActions>(() => iframeEl);
	}
});

const parse = (value: string) => {
	const fn = new Function(`return ${value.trim()}`);
	return fn();
};

watchEffect(() => {
	const target = iframe.value;
	if (!target) return;

	target.run('render', {
		data: parse(props.data),
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
	<div class="flex flex-col justify-center items-center h-full">
		<iframe
			ref="el"
			class="bg-white border-0"
			src="/iframe.html"
			:style="{
				height: `${props.config.height || defaultConfig.height}px`,
				width: `${props.config.width || defaultConfig.width}px`
			}"
		/>
		<div class="mt-8">
			<div class="relative">
				<Listbox
					:model-value="selectedExampleName"
					@update:model-value="(value) => props.updateSelectedExampleName(value)"
				>
					<ListboxButton
						class="inline-flex items-center space-x-3 bg-zinc-200 text-zinc-800 rounded-xl px-4 h-10"
						><span>{{ selectedExampleName }}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5 text-zinc-400"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
							/>
						</svg>
					</ListboxButton>
					<ListboxOptions class="absolute min-w-full pt-1">
						<div class="bg-white rounded-lg shadow-lg whitespace-nowrap">
							<div class="text-zinc-400 px-3 text-xs font-medium border-b py-2">
								Choose a template:
							</div>
							<div class="py-1">
								<ListboxOption
									v-for="example in examples"
									:key="example.name"
									:value="example.name"
								>
									<div class="cursor-pointer px-3 py-1 hover:bg-zinc-100">
										{{ example.name }}
									</div>
								</ListboxOption>
							</div>
						</div>
					</ListboxOptions>
				</Listbox>
			</div>
		</div>
		<div class="flex space-x-3 mt-3">
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
