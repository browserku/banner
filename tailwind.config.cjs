/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.vue'],
	theme: {
		extend: {
			height: {
				'box-header': '30px',
				'box-body': 'calc(100% - 30px)'
			}
		}
	},
	plugins: []
};
