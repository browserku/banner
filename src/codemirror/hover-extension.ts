import { hoverTooltip } from '@codemirror/view';

const RE = /[a-z0-9\-\[\]\/\:]/;

export const hoverExtension = (getTooltip: (word: string) => string | Promise<string>) =>
	hoverTooltip(async (view, pos, side) => {
		let { from, to, text } = view.state.doc.lineAt(pos);
		let start = pos,
			end = pos;
		while (start > from && RE.test(text[start - from - 1])) start--;
		while (end < to && RE.test(text[end - from])) end++;
		if ((start == pos && side < 0) || (end == pos && side > 0)) return null;
		const word = text.slice(start - from, end - from);
		const tooltip = await getTooltip(word);
		if (!tooltip) return null;
		return {
			pos: start,
			end,
			above: true,
			create(_view) {
				const dom = document.createElement('div');
				dom.innerHTML = tooltip;
				return { dom };
			}
		};
	});
