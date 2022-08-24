import { ref } from 'vue';
import { clipboardCopy } from './copy';

export const useCopy = (getText: () => string) => {
	const copied = ref(false);
	const timeoutId = ref<number | null>(null);

	const copy = () => {
		if (timeoutId.value !== null) {
			window.clearTimeout(timeoutId.value);
		}
		clipboardCopy(getText());
		copied.value = true;
		timeoutId.value = window.setTimeout(() => {
			copied.value = false;
			timeoutId.value = null;
		}, 2000);
	};

	return { copied, copy };
};
