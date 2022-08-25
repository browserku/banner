<script setup lang="ts">
import { PropType } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

const props = defineProps({
	isOpen: {
		type: Boolean,
		required: true
	},
	setIsOpen: {
		type: Function as PropType<(open: boolean) => void>,
		required: true
	},
	title: {
		type: String,
		required: true
	}
});

const closeDialog = () => {
	props.setIsOpen(false);
};
</script>

<template>
	<Dialog :open="props.isOpen" class="relative z-50" max>
		<!-- The backdrop, rendered as a fixed sibling to the panel container -->
		<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

		<!-- Full-screen scrollable container -->
		<div class="fixed inset-0 overflow-y-auto p-4">
			<!-- Container to center the panel -->
			<div class="flex min-h-full items-center justify-center">
				<!-- The actual dialog panel -->
				<DialogPanel class="w-full max-w-xl rounded bg-white">
					<DialogTitle class="flex h-14 items-center px-5 border-b font-medium text-xl">{{
						props.title
					}}</DialogTitle>

					<div class="max-h-screen overflow-auto">
						<slot />
					</div>

					<div class="border-t h-14 flex items-center px-5">
						<button
							type="button"
							@click="closeDialog"
							class="rounded-lg h-8 text-sm inline-flex items-center px-3 border hover:bg-zinc-100"
						>
							Close
						</button>
					</div>
				</DialogPanel>
			</div>
		</div>
	</Dialog>
</template>
