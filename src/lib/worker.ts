import { format } from 'prettier';
import parserHtml from 'prettier/parser-html';
import parserBabel from 'prettier/parser-babel';
import { handleActions } from 'typed-worker';

const prettierFormat = (code: string, type: 'html' | 'vue' | 'babel' | 'json') => {
	return format(code, {
		parser: type,
		plugins: [parserHtml, parserBabel],
		embeddedLanguageFormatting: 'auto'
	});
};

const actions = {
	format(payload: { code: string; type: 'vue' | 'babel' | 'json' }) {
		if (payload.type === 'vue') {
			const result = prettierFormat(`<template>${payload.code}</template>`, 'vue');
			return prettierFormat(result.replace('<template>', '').replace('</template>', ''), 'html');
		}
		return prettierFormat(payload.code, payload.type);
	}
};

handleActions(actions);

export type Actions = typeof actions;
