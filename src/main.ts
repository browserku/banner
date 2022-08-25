import 'floating-vue/dist/style.css';
import './css/tailwind.css';
import './css/md.css';
import './css/prism.css';
import 'splitpanes/dist/splitpanes.css';
import { createApp } from 'vue';
import FloatingVue from 'floating-vue';
import App from './components/App.vue';

const app = createApp(App);

app.use(FloatingVue, {
	themes: {
		'info-tooltip': {
			$extend: 'tooltip'
			// Other options (see the 'Global options' section)
		}
	}
});

app.mount('#app');
