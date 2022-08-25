<script setup lang="ts">
import { PropType } from 'vue';
import BaseDialog from './BaseDialog.vue';

const props = defineProps({
	isOpen: {
		type: Boolean,
		required: true
	},
	setIsOpen: {
		type: Function as PropType<(open: boolean) => void>,
		required: true
	}
});
</script>

<template>
	<BaseDialog title="Help" :isOpen="props.isOpen" :setIsOpen="props.setIsOpen">
		<div class="p-5 space-y-3">
			<section>
				<h3 class="mb-3 font-bold text-lg">Template</h3>
				<div class="md">
					<p>
						The template section supports Vue template syntax and TailwindCSS/UnoCSS class names,
						you can reference the data in the data section.
					</p>
				</div>
			</section>
			<section>
				<h3 class="mb-3 font-bold text-lg">Fonts</h3>
				<div class="md">
					<p>Some built-in font class names are available for you to use:</p>
					<ul>
						<li>font-sans</li>
						<li>font-mono</li>
						<li>font-roboto</li>
						<li>font-open-sans</li>
						<li>font-lobster</li>
						<li>font-lato</li>
					</ul>
					<p>We are going to support using custom Google fonts soon.</p>
				</div>
			</section>
		</div>
	</BaseDialog>
</template>
