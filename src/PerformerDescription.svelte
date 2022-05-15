<script>
    import VideoPlayer from 'svelte-video-player';

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

    <div class="content">

        <span class="video_item">
            <VideoPlayer width=800 height=400 poster={url_portrait} source={video} />
        </span>

        <div class="text_item">
            <p class="artistdescription">{description}</p>
        </div>

        <div class="link_item">
            <p class="artistdescription"><a href={link}>Site internet</a></p>
        </div>
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
    	src: url('./fonts/terminal-grotesque_open.otf');
    	font-weight: normal;
    	font-style: normal;
	}

    .video {
        max-width: 100%;
        height: auto;
    }

    .content {
        display: flex;
    }

    .video_item {
        width: 30%;
    }

    .text_item {
        width: 60%;
    }

    .link_item {
        width: 10%;
    }

    a {
        font-size: 20px;
        text-decoration: none;
        color: black;
    }

    main {
        box-sizing: border-box;
        border: 2px solid black;
        padding: 20px 20px;
        font-family: 'terminal_grotesque';
        font-weight: normal;
		background: #F4F24C;
        width: 100%;
    }

    .artistdescription:first-letter {
        font-size: 80px;
        font-family: 'terminal_grotesque_open';
    }

    .artistdescription {
        margin: 0px; padding-left: 20px; padding-right: 20px;
        float: none; text-align: justify; text-justify: inter-word;
        font-size: 30px;
        /* max-height: 100px; */
    }

    .box_header {
        display: flex; padding: 10px 10px; justify-content: space-between;
    }

    .artistname, .name_with_link {
        font-weight: normal; color: black; 
        padding-top: 0px; justify-content: space-between;
        float: left; font-size: 40px;
    }

    .name_with_link {
        font-family: 'terminal_grotesque';
        display:inline-block; vertical-align:top;
        padding-top: 30px;
    }

    .artistname {
        font-family: 'terminal_grotesque';
        display: inline-block;
        vertical-align: top;
    }

</style>