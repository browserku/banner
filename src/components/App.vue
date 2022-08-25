<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import { ref, watchEffect } from 'vue';
import { generate } from '@browserku/uno';
import TemplateEditor from './TemplateEditor.vue';
import Preview from './Preview.vue';
import { example } from '../lib/examples';
import DataEditor from './DataEditor.vue';
import type { Config } from '../lib/config';

const template = ref(example.template);
const generatedCSS = ref('');
const generatingCSS = ref(false);
const stringifiedData = ref<string>(JSON.stringify(example.data, null, 2));
const config = ref<Config>({});

watchEffect(() => {
	generatingCSS.value = true;
	generate(template.value).then((css) => {
		generatedCSS.value = css;
		generatingCSS.value = false;
	});
});
</script>

<template>
	<div class="h-screen flex flex-col">
		<header class="h-10 flex-shrink-0 border-b border-zinc-200">
			<div class="px-5 flex items-center h-full text-xs justify-between">
				<div class="flex items-center font-bold">
					<span
						>Banner desginer by
						<a href="https://browserku.com" class="text-indigo-600" target="_blank"
							>Browserku</a
						></span
					>
				</div>
				<div class="flex items-center">
					<a href="https://github.com/browserku/banner" target="_blank" rel="nofollow noopener"
						><svg
							id="i-github"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 64 64"
							width="32"
							height="32"
							class="w-5 h-5"
						>
							<path
								stroke-width="0"
								fill="currentColor"
								d="M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z"
							/></svg
					></a>
				</div>
			</div>
		</header>
		<Splitpanes class="default-theme h-full">
			<Pane :minSize="20" :size="70" class="preview-pane">
				<Preview
					:css="generatedCSS"
					:html="template"
					:data="stringifiedData"
					:generatingCSS="generatingCSS"
					:config="config"
				/>
			</Pane>
			<Pane :minSize="20" :size="30">
				<Splitpanes horizontal>
					<Pane :minSize="15">
						<TemplateEditor :value="template" @update:value="(value) => (template = value)"
					/></Pane>
					<Pane :minSize="15"
						><DataEditor
							:value="stringifiedData"
							@update:value="(value) => (stringifiedData = value)"
					/></Pane>
				</Splitpanes>
			</Pane>
		</Splitpanes>
	</div>
</template>

<style>
.splitpanes__pane {
	transition: none !important;
}
</style>
