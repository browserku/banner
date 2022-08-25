<script setup lang="ts">
import { html } from '@codemirror/lang-html';
import { minimalSetup } from 'codemirror';
import { computed } from 'vue';
import { hoverExtension } from '../codemirror/hover-extension';
import { useWorker } from '../lib/use-worker';
import { useCodeMirror } from '../lib/useCodeMirror';
import { debounce } from '../lib/utils';
import BoxHeader from './BoxHeader.vue';
import { generate } from '@browserku/uno';
import stripComment from 'strip-css-comments';
import { highlightCSS } from '../lib/highlight';

const props = defineProps({
	value: {
		type: String,
		required: true
	}
});

const emit = defineEmits<{
	(event: 'update:value', value: string): void;
}>();

const worker = useWorker();

const getTooltip = async (word: string) => {
	const css = await generate(`<div class="${word}"></div>`, {
		generate: {
			preflights: false
		}
	});
	if (!css) return '';
	const result = highlightCSS(await worker.run('format', { code: stripComment(css), type: 'css' }));
	console.log(result);
	return `<pre class="p-1 whitespace-pre max-h-[500px] overflow-auto text-sm language-css">${result}</pre>`;
};

const { el } = useCodeMirror({
	value: computed(() => props.value),
	onChange: debounce((value: any) => {
		emit('update:value', value);
	}, 250),
	extensions: [minimalSetup, html(), hoverExtension(getTooltip)]
});

const format = async () => {
	const formatted = await worker.run('format', { code: props.value, type: 'vue' });
	emit('update:value', formatted);
};
</script>

<template>
	<div class="h-full flex flex-col">
		<BoxHeader title="Vue template" titleTip="Supports Tailwind/UnoCSS syntax" :format="format" />
		<div class="h-box-body" ref="el"></div>
	</div>
</template>
