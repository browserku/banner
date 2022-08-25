<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	format: {
		type: Function as PropType<() => void>,
		required: true
	}
});
</script>

<template>
	<div
		class="h-box-header border-b flex items-center px-2 text-xs text-zinc-500 font-medium shrink-0 justify-between"
	>
		<div>
			<span>{{ props.title }}</span>
		</div>
		<button type="button" @click="props.format" class="tiny-button">Format</button>
	</div>
</template>
