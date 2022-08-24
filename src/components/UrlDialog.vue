<script setup lang="ts">
import {
	TabGroup,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Dialog,
	DialogPanel,
	DialogTitle
} from '@headlessui/vue';
import { PropType, ref } from 'vue';
import { useCopy } from '../lib/use-copy';

const props = defineProps({
	isOpen: {
		type: Boolean,
		required: true
	},
	setIsOpen: {
		type: Function as PropType<(open: boolean) => void>,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	jsCode: {
		type: String,
		required: true
	}
});

const closeDialog = () => {
	props.setIsOpen(false);
};

const tabIndex = ref(0);

const tabs = ['URL', 'JS Code'];

const { copied, copy } = useCopy(() => props.url);

const copyUrl = () => {
	copy();
};
</script>

<template>
	<Dialog :open="props.isOpen" @close="closeDialog" class="relative z-50">
		<!-- The backdrop, rendered as a fixed sibling to the panel container -->
		<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

		<!-- Full-screen scrollable container -->
		<div class="fixed inset-0 overflow-y-auto p-4">
			<!-- Container to center the panel -->
			<div class="flex min-h-full items-center justify-center -mt-32">
				<!-- The actual dialog panel -->
				<DialogPanel class="w-full max-w-xl rounded bg-white">
					<DialogTitle class="flex h-14 items-center px-5 border-b font-medium text-xl"
						>Get URL</DialogTitle
					>

					<TabGroup :selectedIndex="tabIndex" @change="(index) => (tabIndex = index)">
						<TabList class="space-x-2 mb-5 bg-zinc-100 px-5 py-2 text-sm font-medium">
							<Tab
								v-for="(tab, index) in tabs"
								:key="tab"
								class="rounded-lg px-2 py-1"
								:class="[
									index === tabIndex ? `bg-white shadow-sm` : `text-zinc-400 hover:bg-zinc-50`
								]"
								>{{ tab }}</Tab
							>
						</TabList>
						<div class="px-5">
							<div class="mb-3 text-sm text-zinc-500">
								Learn more about
								<a
									href="https://docs.browserku.com/banner"
									class="text-indigo-500 font-medium underline"
									>Browserku's Banner API</a
								>.
							</div>
							<TabPanels>
								<TabPanel>
									<div class="flex items-center space-x-2 text-sm">
										<input
											:value="props.url"
											class="border rounded-lg w-full h-10 flex items-center px-2 focus:outline-none text-zinc-400"
											readonly
										/>
										<button
											type="button"
											class="borde rounded-lg h-10 px-3 flex items-center border text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
											@click="copyUrl"
										>
											{{ copied ? 'Copied' : 'Copy' }}
										</button>
									</div>
								</TabPanel>
								<TabPanel>
									<pre
										class="overflow-auto bg-zinc-100 text-purple-600 rounded-lg p-5 text-sm font-mono"
										>{{ props.jsCode }}</pre
									>
								</TabPanel>
							</TabPanels>
						</div>
					</TabGroup>

					<div class="border-t h-14 flex items-center px-5 mt-5">
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
