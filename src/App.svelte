<script>
	import { Tabs, TabList, TabPanel, Tab } from './tabs/tabs.js';
	import PerformerDescription from './PerformerDescription.svelte';
	import MoreInformation from './MoreInformation.svelte';
	import {performers, posters} from './information';
	import Sequencer from './Sequencer.svelte';

	let shuffled = performers
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

	let all_titles = [
        "RELOAD THE PAGE",
        "EVAROGLA",
		"ALGORAVE",
        "CIVE-LODING",
		"LIVE-CODING",
		"GNIDOC-EVIL",
        "ON THE FLY",
        "YLF EHT NO"]
</script>

<main>
	<header>
		<h1 class="bigtitle">{all_titles[Math.floor(Math.random() * 3)]}</h1>
		<h2 class="subtitle">Programmation improvisée à la volée Improvisation musicale cybernétique</h2>
		<h2 class="subtitle">Computer Music, Synthèse de systèmes, Musique DIY </h2>
		<div class="information">
			<h2 class="venuedate">11 juin, Le Fil, Saint-Étienne.</h2>
			<h2 class="precision">22h00 -- 00h00, Entrée gratuite.</h2>
		</div>
	</header>


	<div class="posters">
		<img src={posters.jaune} alt="poster1">
		<img src={posters.orange} alt="poster2">
		<img src={posters.bleu} alt="poster3">
	</div>


	<Tabs>
		<TabList>
			{#each shuffled as p}
				<Tab>{p.pseudo}</Tab>
			{/each}
		</TabList>

		{#each shuffled as p}
			<TabPanel>
				<PerformerDescription 
					name={p.pseudo} 
					url_portrait={p.url_portrait}
					pseudo={p.fullname}
					link={p.link}
					description={p.description} 
					video={p.video}/>
			</TabPanel>
		{/each}
	</Tabs>

	<Sequencer />

	<MoreInformation />
</main>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	@font-face {
    	font-family: 'terminal_grotesque';
    	src: url('./fonts/terminal-grotesque-webfont.eot');
    	src: url('./fonts/terminal-grotesque-webfont.eot?#iefix') format('embedded-opentype'),
        	url('./fonts/terminal-grotesque-webfont.woff2') format('woff2'),
        	url('./fonts/terminal-grotesque-webfont.woff') format('woff'),
        	url('./fonts/terminal-grotesque-webfont.ttf') format('truetype'),
        	url('./fonts/terminal-grotesque-webfont.svg#terminal_grotesqueregular') format('svg');
    	font-weight: normal;
    	font-style: normal;
	}
	@font-face {
    	font-family: 'terminal_grotesque_open';
    	src: url('./fonts/terminal-grotesque_open.otf');
    	font-weight: normal;
    	font-style: normal;
	}
	:root {
		--subtitle-font-size: 3vmin;
		--title-font-size: 16vmin
	}

	main {
		background-color: #f4af4c;
	}

	header {
		box-sizing: border-box;
		background: #f4af4c;
		padding: 20px;
		color: white;
		border: 5px dashed white;
		transition-duration: 0.4s;
		animation-name: example;
		animation-duration: 5s;
		animation-iteration-count: infinite;
	}

	header:hover, .posters:hover {
		border: 10px dashed white;
	}

	@keyframes example {
		0%   {background-color: red}
		25%  {background-color: yellow}
		50%  {background-color: blue;}
		100% {background-color: green;}
	}


	h1 {
		padding-bottom: 20px;
		font-family: 'terminal_grotesque_open';
		font-size: 100px;
		justify-content: center;
		text-align: center;
		font-weight: normal;
	}

	h2 {
		font-family: 'terminal_grotesque_open';
		justify-content: center;
		text-align: center;
		text-justify: inter-word;
		font-weight: normal;
	}

	ul {
		color: white;
		background: darkgrey;
		font-family: 'grotesque';
		justify-content: center;
		text-align: center;
	}

	.venuedate {
		padding-top: 40px;
		justify-content: right;
		text-align: right;
		font-size: 40px;
	}

	.precision {
		padding-top: 40px;
		font-size: 40px;
		justify-content: left;
		text-align: left;
	}

	.information {
		justify-content: space-between;
	}

	.subtitle {
		font-size: var(--subtitle-font-size);
	}

	.posters {
		display: flex;
		justify-content: center;
		transition-duration: 0.4s;
		box-sizing: border-box;
		border: 5px dashed white;
		border-top: none;
	}

	img {
		display: inline;
		width: 33.34%;
		height: 50%;
		object-fit: cover;
	}

	.bigtitle {
		/* font-size: 180px; */
		font-size: var(--title-font-size);
	}

</style>
