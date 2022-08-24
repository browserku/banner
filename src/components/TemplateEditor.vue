<script setup lang="ts">
import { html } from '@codemirror/lang-html';
import { minimalSetup } from 'codemirror';
import { useCodeMirror } from '../lib/useCodeMirror';

const props = defineProps({
	value: {
		type: String,
		required: true
	}
});

const emit = defineEmits<{
	(event: 'update:value', value: string): void;
}>();

const { el } = useCodeMirror({
	value: props.value,
	onChange(value) {
		emit('update:value', value);
	},
	extensions: [minimalSetup, html()]
});
</script>

<template>
	<div class="h-full" ref="el"></div>
</template>
