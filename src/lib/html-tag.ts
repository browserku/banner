import redent from 'redent';

// we use this so pretty can format the html inside
export const html = (strings: TemplateStringsArray, ...values: any[]) => {
	return redent(
		strings.reduce((acc, str, i) => {
			return acc + str + (values[i] || '');
		}, '')
	).trim();
};
