<script setup lang="ts">
import { PropType } from 'vue';
import { VTooltip as vTooltip } from 'floating-vue';

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	titleTip: {
		type: String
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
		<div class="flex space-x-1 items-center">
			<span>{{ props.title }}</span>
			<span v-if="props.titleTip" v-tooltip="{ content: props.titleTip, theme: 'info-tooltip' }"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-4 h-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
					/>
				</svg>
			</span>
		</div>
		<button type="button" @click="props.format" class="tiny-button">Format</button>
	</div>
</template>
