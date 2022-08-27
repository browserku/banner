// a template tag that simply returns the html

import { Config } from './config';
import { html } from './html-tag';

export const examples: {
	name: string;
	config?: Config;
	template: string;
	data: any;
}[] = [
	{
		name: 'Default Template',
		config: {
			width: 640,
			height: 320
		},
		template: html`
			<div
				class="relative bg-gradient-to-br from-indigo-300 to-red-300 h-full font-open-sans bg-cover bg-center"
				:style="{backgroundImage: \`url(\${bg})\`}"
			>
				<div
					class="absolute w-full h-full left-0 bottom-0 bg-gradient-to-b from-black/10 via-black/80 to-black"
				></div>
				<div class="absolute bottom-0 p-8">
					<h1 class="text-2xl text-white font-bold">{{title}}</h1>
					<div class="text-white mt-3">{{description}}</div>
					<div class="text-zinc-400 mt-3 flex items-center space-x-2">
						<div class="flex items-center space-x-1">
							<img class="w-5 h-5 rounded-full" :src="avatar" />
							<span>{{author}}</span>
						</div>
						<span>-</span>
						<span>April 4</span>
					</div>
				</div>
			</div>
		`,
		data: {
			title: 'Teachers Reveal Why They Are Quitting Their Jobs',
			description:
				'Amid budget cuts, restrictive curricula, and increasing threats to their safety, more and more teachers are opting to switch careers. The Onion asked teachers to explain why they are quitting their jobs, and this is what they said.',
			author: 'The Onion',
			avatar: 'https://cdn.jsdelivr.net/gh/egoist-bot/images@main/upic/nIib90.png',
			bg: 'https://cdn.jsdelivr.net/gh/egoist-bot/images@main/upic/Fsohqo.jpg'
		}
	},
	{
		name: 'Zenn Blog Post',
		template: html`
			<div
				class="relative bg-gradient-to-r from-blue-400 to-purple-300 h-full font-open-sans bg-cover bg-center p-5"
			>
				<div class="bg-white rounded-xl shadow-lg h-full p-7 flex flex-col justify-between">
					<h1 class="text-4xl font-bold line-clamp-3 pb-1">{{ title }}</h1>
					<div class="mt-3 flex items-center justify-between">
						<div class="flex items-center space-x-2 text-lg">
							<img class="w-10 h-10 rounded-full" crossorigin="anonymous" :src="avatar" />
							<span class="font-semibold">{{ author }}</span>
						</div>
						<div>
							<img :src="logo" alt="logo" class="h-8" />
						</div>
					</div>
				</div>
			</div>
		`,
		data: {
			title:
				'Google Analytics is removing Universal Analytics and deleting all of your historical data',
			author: 'John Doe',
			logo: 'https://cdn.jsdelivr.net/gh/egoist-bot/images@main/upic/AMePnP.png',
			avatar:
				'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=280&q=80'
		}
	}
];
