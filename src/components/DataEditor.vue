<script setup lang="ts">
import { javascript } from '@codemirror/lang-javascript';
import { minimalSetup } from 'codemirror';
import { computed } from 'vue';
import { useWorker } from '../lib/use-worker';
import { useCodeMirror } from '../lib/useCodeMirror';
import { debounce } from '../lib/utils';
import BoxHeader from './BoxHeader.vue';

const props = defineProps({
	value: {
		type: String,
		required: true
	}
});

const emit = defineEmits<{
	(event: 'update:value', value: string): void;
}>();

const editorValue = computed(() => props.value);

const { el } = useCodeMirror({
	value: editorValue,
	onChange: debounce((value: string) => {
		emit('update:value', value || '{}');
	}, 250),
	extensions: [minimalSetup, javascript()]
});

const worker = useWorker();
const format = async () => {
	const result = await worker.run('format', { code: editorValue.value, type: 'json' });
	emit('update:value', result);
};
</script>

<template>
	<div class="h-full">
		<BoxHeader title="Data" :format="format" />
		<div ref="el" class="h-box-body"></div>
	</div>
</template>
