<script setup lang="ts">
import { javascript } from '@codemirror/lang-javascript';
import { minimalSetup } from 'codemirror';
import { PropType, ref, watchEffect } from 'vue';
import stringifyObject from 'stringify-object';
import { useCodeMirror } from '../lib/useCodeMirror';

const props = defineProps({
	data: {
		type: Object as PropType<Record<string, any>>,
		required: true
	}
});

const emit = defineEmits<{
	(event: 'update:data', data: Record<string, any>): void;
}>();

const value = ref('');

const parse = (objectLike: string) => {
	const fn = new Function(`return ${objectLike.trim()}`);
	return fn();
};

watchEffect(() => {
	value.value = stringifyObject(props.data, {
		filter(input, prop) {
			if (typeof prop === 'string' && prop.startsWith('$')) {
				return false;
			}
			return true;
		}
	});
});

const { el } = useCodeMirror({
	value: value,
	onChange(value) {
		emit('update:data', parse(value));
	},
	extensions: [minimalSetup, javascript()]
});
</script>

<template>
	<div ref="el" class="h-full"></div>
</template>
