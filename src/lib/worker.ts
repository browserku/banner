import { format } from 'prettier';
import parserHtml from 'prettier/parser-html';
import parserBabel from 'prettier/parser-babel';
import parserPostcss from 'prettier/parser-postcss';
import { handleActions } from 'typed-worker';

const prettierFormat = (code: string, type: 'html' | 'vue' | 'babel' | 'json' | 'css') => {
	return format(code, {
		parser: type,
		plugins: [parserHtml, parserBabel, parserPostcss],
		embeddedLanguageFormatting: 'auto'
	});
};

const actions = {
	format(payload: { code: string; type: 'vue' | 'babel' | 'json' | 'css' }) {
		if (payload.type === 'vue') {
			const result = prettierFormat(`<template>${payload.code}</template>`, 'vue');
			return prettierFormat(result.replace('<template>', '').replace('</template>', ''), 'html');
		}
		return prettierFormat(payload.code, payload.type);
	}
};

handleActions(actions);

export type Actions = typeof actions;
