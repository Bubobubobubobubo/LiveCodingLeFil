<script>
	import { Tabs, TabList, TabPanel, Tab } from './tabs/tabs.js';
	import PerformerDescription from './PerformerDescription.svelte';
	import MoreInformation from './MoreInformation.svelte';
	import {performers, posters} from './information';

    const isMobileUser = () => {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };


	let shuffled = performers
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);


	let all_titles = [
		"LIVE-CODING",
		"ALGORAVE",
		"ON THE FLY"]
</script>

<main>
	<header>
        {#if isMobileUser}
            <h1 class="bigtitle">:'((((</h1>
        {:else}
		    <h1 class="bigtitle">{all_titles[Math.floor(Math.random() * 3)]}</h1>
        {/if}
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

	a {
		color: inherit;
		justify-content: center;
		text-align: center;
	}

	li {
		font-family: 'terminal_grotesque';
		list-style-type: none;
		text-decoration: none;
	}

	html {
		font-family: sans-serif;
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
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
		font-size: 40px;
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
		font-size: 180px;
	}

</style>
