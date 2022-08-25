import { createWorker } from 'typed-worker';
import type { Actions } from './worker';

export const useWorker = () => {
	return createWorker<Actions>(
		() =>
			new Worker(new URL('./worker.ts', import.meta.url), {
				type: 'module'
			})
	);
};
