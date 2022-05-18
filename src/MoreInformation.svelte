<script>
</script>

<main>
    <h1 class="title">Live-Coding SMC 2022 || Entrée gratuite, le 11 juin 2022, au Fil (Saint-Étienne).</h1>
    <div class="split">
        <div class="left">
            <p class="words">Ce concert est proposé dans le cadre des <a href="https://smc22.grame.fr/">SMC 2022</a> (<em>Sound and Music Computing Conference</em>) organisées par le laboratoire ECLLA de l'université Jean Monnet de Saint-Étienne, par le GRAME - Centre de Création Musicale, l'INRIA et autres partenaires institutionnels. Conçu en collaboration avec les parisiens du <a href="https://cookie.paris/">Cookie Collective</a>, ce concert met en valeur le travail de la scène <em>live-coding</em> stéphanoise, lyonnaise et plus largement francophone.</p>

       </div>
        <div class="right">
            <img src="https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/keyboard_detourage.png" alt="keyboard">

        </div>
    </div>
                    <p class="words">Quatre performances musicales et visuelles d'une demi-heure chacune seront proposées par Ralt144Mi (Rémi Georges), azertype (Baya), Jules Cipher (Elie Gavoty), Léon Denise (<em>idem.</em>) et Raphaël Forment (Bubobubo). Chacune présentera une approche singulière du <em>live-coding</em>; pratique que chacun s'approprie selon son intérêt. Machines, visuels génératifs, DIY, patterns algorithmiques, etc...</p>


</main>

<style>
    @font-face {
        font-family: 'terminal_grotesque';
        src: url('terminal-grotesque-webfont.eot');
        src: url('terminal-grotesque-webfont.eot?#iefix') format('embedded-opentype'),
            url('terminal-grotesque-webfont.svg#terminal_grotesqueregular') format('svg');
        font-weight: normal;
        font-style: normal;
    }

	@font-face {
     	font-family: 'terminal_grotesque_open';
    	src: url('./fonts/terminal-grotesque_open.otf');
    	font-weight: normal;
    	font-style: normal;
	}

    .left {
        width: 60%;
    }

    .right {
        width: 40%;
    }

    .split {
        display: flex;
    }

    .split:after {
        content: "";
        display: table;
        clear: both;
    }

    img {
        margin-top: 50px;
        margin-left: 50px;
        display: inline;
        max-width: 400px;
        max-height: 300px;
        padding-left: 20px;
        opacity: 0.9;
    }

    .title {
        padding-top: 30px; padding-bottom: 20px;
        padding-left: 10px; padding-right: 10px;
        border: 20px dashed white;
        font-family: 'terminal_grotesque_open';
        font-size: 50px;
        color: #4F21E6;
        text-align: center;
        box-sizing: border-box;
        width: 100%; 
        transition-duration: 0.4s;
    }

    .title:hover {
        border: 30px dashed white;
    }

    a {
        text-decoration: none;
        color: #A35BF3;
    }

    main {
        background: #4CD2F4;
        padding-bottom: 20px;
    }

    .words {
        font-family: 'terminal_grotesque';
        font-size: 30px;
        text-align: justify;
        text-justify: inter-word;
        padding-left: 20px; padding-right: 20px;
    }

    .words:first-letter {
        font-family: 'terminal_grotesque_open';
        font-size: 60px;
        transform: scale(1.0);
        transition: all 0.3s easie-in-out 0.5s;
    }
</style>
