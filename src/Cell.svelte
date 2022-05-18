<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let on;
    export let active;
    export let number;
</script>

<main>
    <button on:click={(number)=> dispatch('click')} class={
        active ? on ? "active" : "unactive" : "disabled"}></button>
</main>

<style>


    main{
        display: inline;
    }

    button {
        background: white;
        color: black;
        border: 5px dashed black;
        width: 3em; height: 3em;
        margin: 0px 5px;
        transition-duration: 0.4s;
    }

    .active{
        background: yellow;
        width: 50px; height: 50px;
        transition-duration: 0.4s;
    }

    .inactive{
        background: yellow;
        width: 40px; height: 40px;
        transition-duration: 0.4s;
    }

    .disabled{
        background: darkgrey; 
        transform: rotate(45deg);
        width: 40px; height: 40px;
        transition-duration: 0.4s;
    }

</style>