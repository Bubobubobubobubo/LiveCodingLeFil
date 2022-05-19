<script>
    import { createEventDispatcher } from 'svelte';
    export let track;
    const dispatch = createEventDispatcher();
</script>

<main>
    <button class="controls" on:click={() => {
        track.updateMultiplier(2, 'decrease'); track = track;}}>Decrease</button>
    <button class="controls" on:click={() => {
        track.updateMultiplier(2, 'increase'); track = track;}}>Increase</button>
    <button class="controls" on:click={() => {
        let chooseOne = ['normal', 'reverse', 'random'];
        chooseOne = chooseOne[Math.floor(Math.random() * chooseOne.length)];
        track.mode = chooseOne;
        track = track;
    }}>Roll a dice!</button>
    <button class="controls" on:click={() => {
        track.cells.forEach((cell) => {
            cell.active = Math.random() > 0.6 ? true: false;
        });
        track = track;
    }}>Randomize</button>
</main>

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
        font-size: 2vh;
	}

    .controls {
        background: white; color: black;
        border: 0.25vw dashed black;
        width: fit-content; 
        margin: 1vw 1vh;
        font-size: 2vh;
    }
</style>