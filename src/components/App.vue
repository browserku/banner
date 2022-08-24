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
const templateData = ref<Record<string, any>>(example.data);
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
	<div class="h-screen">
		<Splitpanes class="default-theme h-screen">
			<Pane :minSize="20" :size="70" class="preview-pane">
				<Preview
					:css="generatedCSS"
					:html="template"
					:templateData="templateData"
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
							:templateData="templateData"
							@update:data="(newData) => (templateData = newData)"
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
