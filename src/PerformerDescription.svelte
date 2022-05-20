<script>
    export let name;
    export let pseudo;
    export let description;
    export let url_portrait;
    export let link;
    export let video;

</script>

<main>

    <div class="box_header">
        <h1 class="artistname">{name}</h1>
        <a href={link} class="name_with_link">{pseudo}</a>
    </div>

    <img src={url_portrait} alt="performer_picture">

    <div class="text_item">
        <p class="artistdescription">{description}</p>
    </div>

    <div class="yt">
        <iframe width="512" height="315" src={video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    <div class="link_item">
        <p class="link_description"><a href={link}>Site internet</a></p>
    </div>

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
        src: url('./fonts/terminal-grotesque_open.otf');font-weight: normal;
        font-style: normal;
	}

    .content {
        display: flex;
    }

    .text_item {
        text-justify: inter-word;
        justify-content: center;
        padding: 10px;
    }

    a {
        font-size: 5vw;
        text-decoration: none;
        color: black;
    }

    main:hover {
        border: 20px dashed white;
    }

    main {
        transition-duration: 0.4s;
        box-sizing: border-box;
        border: 10px dashed white;
        padding: 20px 20px;
        font-family: 'terminal_grotesque';
        font-weight: normal;
		background: #F4F24C;
        width: 100%;
    }

    .artistdescription {
        font-size: 5vh;
        padding: 2vw;
        margin-left: 3.5vh;
        margin-top: -2.45vw;
        text-align: justify;
        text-justify: inter-word;
    }

    .artistdescription:first-letter {
        font-size: 9.5vh;
        font-weight: normal;
        font-family: 'terminal_grotesque_open';
    }


    .link_item {
        font-size: 4vw;
        margin: 28px;
        border: 1vh dashed black;
        transition-duration: 0.4s;
        cursor: pointer;
    }

    .link_description:first-letter {
        font-size: 7vw;
        font-family: 'terminal_grotesque_open';
        padding-left: 30px;
    }

    .link_item:hover {
        background: white;
        color: black;
        transition-duration: 0.4s;
    }

    .box_header {
        display: flex; padding: 10px 10px; justify-content: space-between;
    }

    .artistname, .name_with_link {
        font-weight: normal; color: black; 
        padding-top: 1vh; justify-content: space-between;
        float: left; font-size: 5.2vh;
    }

    .name_with_link {
        font-family: 'terminal_grotesque';
        display:inline-block; vertical-align:top;
        padding-top: 4.6vh;
    }

    .artistname {
        font-family: 'terminal_grotesque';
        display: inline-block;
        vertical-align: top;
    }

    img {
        border: 5px dashed black;
        margin: 5px;
        float: left;
        display: inline;
        justify-content: center;
        margin-left: 30px;
        margin-right: 20px;
        max-width: 20vw;
        max-height: 20vh;
    }

    .yt {
        overflow: hidden;
        position: relative;
        width:100%;
    }

    .yt::after {
        padding-top: 56.25%;
        display: block;
        content: '';
    }

    .yt iframe {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
    }
</style>
