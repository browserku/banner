// a template tag that simply returns the html

import { Config } from './config';
import { html } from './html-tag';

export const examples: {
	name: string;
	config: Config;
	template: string;
	data: any;
}[] = [
	{
		name: 'Basic',
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
	}
];

export const example = examples[0];
