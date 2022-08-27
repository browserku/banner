<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { generate } from '@browserku/uno';
import AppHeader from './AppHeader.vue';
import TemplateEditor from './TemplateEditor.vue';
import Preview from './Preview.vue';
import { examples } from '../lib/examples';
import DataEditor from './DataEditor.vue';
import type { Config } from '../lib/config';
import { atou, utoa } from '../lib/utils';
import HelpDialog from './HelpDialog.vue';

const selectedExampleName = ref(examples[0].name);

const selectedExample = computed(() => examples.find((e) => e.name === selectedExampleName.value));

const project = reactive<{ template: string; stringifedData: any; config: Config }>({
	template: '',
	stringifedData: '{}',
	config: {}
});

const generatedCSS = ref('');
const generatingCSS = ref(false);

const isHelpDialogOpen = ref(false);
const setIsHelpDialogOpen = (open: boolean) => (isHelpDialogOpen.value = open);

const applySelectedExample = () => {
	if (selectedExample.value) {
		project.template = selectedExample.value.template;
		project.stringifedData = JSON.stringify(selectedExample.value.data, null, 2);
		project.config = selectedExample.value.config || {};
	}
};

onMounted(() => {
	applySelectedExample();
	const str = location.hash.slice(1);
	if (str) {
		const urlData = JSON.parse(atou(str));
		project.template = urlData.template;
		project.stringifedData = urlData.stringifiedData;
		project.config = urlData.config;
	}
	watch([project], () => {
		location.hash = `#${utoa(
			JSON.stringify({
				template: project.template,
				config: { ...project.config },
				stringifiedData: project.stringifedData
			})
		)}`;
	});

	watch([selectedExample], () => {
		applySelectedExample();
	});
});

watchEffect(() => {
	generatingCSS.value = true;
	generate(project.template).then((css) => {
		generatedCSS.value = css;
		generatingCSS.value = false;
	});
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
						:html="project.template"
						:data="project.stringifedData"
						:generatingCSS="generatingCSS"
						:config="project.config"
						:selectedExampleName="selectedExampleName"
						:updateSelectedExampleName="(name) => (selectedExampleName = name)"
					/>
				</Pane>
				<Pane :minSize="20" :size="30">
					<Splitpanes horizontal>
						<Pane :minSize="15">
							<TemplateEditor
								:value="project.template"
								@update:value="(value) => (project.template = value)"
						/></Pane>
						<Pane :minSize="15"
							><DataEditor
								:value="project.stringifedData"
								@update:value="(value) => (project.stringifedData = value)"
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
