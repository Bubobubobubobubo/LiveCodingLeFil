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

    :root {
        --cell-width: 4vh;
        --cell-height: 4vh;
        --inactive-cell-width: 2.5vw;
        --inactive-cell-height: 2.5vw;
        --cell-border-size: 0.5vh;
    }

    main{
        display: inline;
    }

    button {
        background: white;
        color: black;
        border: var(--cell-border-size) dashed black;
        width: var(--cell-width); height: var(--cell-height);
        margin: 0px 5px;
        transition-duration: 0.4s;
    }

    .active{
        background: yellow;
        width: var(--cell-width); height: var(--cell-height);
        transition-duration: 0.4s;
    }

    .inactive{
        background: yellow;
        width: var(--inactive-cell-width); height: var(--inactive-cell-height);
        transition-duration: 0.4s;
    }

    .disabled{
        background:  #F50E02;
        transform: rotate(10deg);
        width: var(--cell-width); height: var(--cell-height);
        transition-duration: 0.4s;
    }

</style>
