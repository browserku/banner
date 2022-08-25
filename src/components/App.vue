<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { generate } from '@browserku/uno';
import AppHeader from './AppHeader.vue';
import TemplateEditor from './TemplateEditor.vue';
import Preview from './Preview.vue';
import { example } from '../lib/examples';
import DataEditor from './DataEditor.vue';
import type { Config } from '../lib/config';
import { atou, utoa } from '../lib/utils';
import HelpDialog from './HelpDialog.vue';

const template = ref(example.template);
const generatedCSS = ref('');
const generatingCSS = ref(false);
const stringifiedData = ref<string>(JSON.stringify(example.data, null, 2));
const config = ref<Config>({});

const isHelpDialogOpen = ref(false);
const setIsHelpDialogOpen = (open: boolean) => (isHelpDialogOpen.value = open);

onMounted(() => {
	const str = location.hash.slice(1);
	if (str) {
		const data = JSON.parse(atou(str));
		template.value = data.template;
		stringifiedData.value = data.stringifiedData;
		config.value = data.config;
	}
});

watchEffect(() => {
	generatingCSS.value = true;
	generate(template.value).then((css) => {
		generatedCSS.value = css;
		generatingCSS.value = false;
	});
});

watch([template, config, stringifiedData], () => {
	location.hash = `#${utoa(
		JSON.stringify({
			template: template.value,
			config: { ...config.value },
			stringifiedData: stringifiedData.value
		})
	)}`;
});
</script>

<template>
	<div class="h-screen flex flex-col">
		<AppHeader :setIsHelpDialogOpen="setIsHelpDialogOpen" />
		<main class="h-app-body">
			<Splitpanes class="default-theme">
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
		</main>
	</div>
	<HelpDialog :isOpen="isHelpDialogOpen" :setIsOpen="setIsHelpDialogOpen" />
</template>

<style>
.splitpanes__pane {
	transition: none !important;
}
</style>
