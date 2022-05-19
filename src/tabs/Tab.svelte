<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);

	registerTab(tab);
</script>

<style>
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

	button {
		font-family: 'terminal_grotesque';
		font-size: 5.2vh;
		background: none;
		border: none;
		border-bottom: 2px solid #f4af4c;
		border-radius: 0;
		margin: 0;
		color: black;
		justify-content: center;
		transition: 0.4s;
		font-weight: normal;
	}

	button:hover {
		animation-duration: 0.2s;
		font-size: 4.5vh;
		font-family: 'terminal_grotesque_open';
		font-weight: normal;
	}
	
	.selected {
		border-bottom: 2px solid #f4af4c;
		color: #333;
	}
</style>

<button class:selected="{$selectedTab === tab}" on:click="{() => selectTab(tab)}">
	<slot></slot>
</button>