import { Ref, ref, watchEffect } from 'vue';
import { EditorView, minimalSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

const lightTheme = EditorView.theme(
	{
		'&.cm-editor': {
			height: '100%'
		},
		'&.cm-editor.cm-focused ': {
			outline: 'none'
		}
	},
	{}
);

export const useCodeMirror = (options: {
	value: string | Ref<string>;
	onChange: (value: string) => void;
	extensions: any[];
}) => {
	const el = ref<HTMLDivElement | null>(null);
	const view = ref<EditorView | null>(null);

	const value = ref(options.value);

	const handleUpdate = EditorView.updateListener.of((update) => {
		const newValue = update.state.doc.toString();
		options.onChange(newValue);
	});

	watchEffect(() => {
		if (!el.value || view.value) return;

		view.value = new EditorView({
			doc: value.value,
			extensions: [
				minimalSetup,
				keymap.of([indentWithTab]),
				handleUpdate,
				lightTheme,
				EditorView.lineWrapping,
				...(options.extensions || [])
			],
			parent: el.value
		});
	});

	watchEffect(() => {
		if (!view.value) return;

		const currentValue = view.value.state.doc.toString();
		if (options.value === currentValue) return;

		view.value.state.update({
			changes: {
				from: 0,
				to: view.value.state.doc.length,
				insert: value.value
			}
		});
	});

	return {
		el
	};
};
