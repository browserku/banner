import Prism from 'prismjs';

export const highlightCSS = (css: string) => {
	return Prism.highlight(css, Prism.languages.css, 'css');
};
