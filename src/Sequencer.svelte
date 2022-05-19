<script>
    import Cell from './Cell.svelte';
    import CellControl from './CellControl.svelte';
    import * as Tone from 'tone';
import { Time } from 'tone';
    let maxStep = 11;
    let [toneRunning, transportRunning] = [false, false]

    const handleTransport = () => {


        if (!toneRunning) { 
            // First thing first: turn audio engine on!
            Tone.start(); toneRunning = true;
        }

        // Transport management: cancel because 
        // scheduleRepeat can overlap!

        if (!transportRunning) {
            Tone.Transport.start();
            Tone.Master.volume.value = -12;
            transportRunning = !transportRunning;
            const now = Tone.now();
            Tone.Transport.scheduleRepeat(
                handleSequenceInTime, "16n");
        } else {
            Tone.Transport.cancel();
            Tone.Transport.pause();
            transportRunning = !transportRunning;
        }

    }

    class SequencerCell {

        constructor(step_number, type, parent) {
            [this.number, this.type] = [step_number, type];
            [this.on, this.active] = [false, Math.random() > 0.9? true : false];
            this.sampleURL = "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/samples/";
            this.samples = {
                'bassdrum': {C1:"bd1.wav", D1:"bd2.wav", E1:"bd3.wav", F1:"bd4.wav"},
                'hat': {C1:"ch1.wav", D1:"ch2.wav", E1:"oh.wav", F1:"clap.wav"},
                'snare': { C1:"sd1.wav", D1:"sd2.wav"},
                'other': {C1:"crash.wav", D1:"ride.wav", E1:"ride2.wav", F1:"rim.wav",
                G1:"tom1.wav", A1:"tom2.wav" }};
            switch (this.type) {
                case 'bassdrum': 
                    this.instrument = new Tone.Sampler({
                        urls: this.samples.bassdrum, baseUrl: this.sampleURL}); break;
                case 'hat': 
                    this.instrument = new Tone.Sampler({
                        urls: this.samples.hat, baseUrl: this.sampleURL}); break;
                case 'snare': 
                    this.instrument = new Tone.Sampler({
                        urls: this.samples.snare, baseUrl: this.sampleURL }); break;
                case 'other': 
                    this.instrument = new Tone.Sampler({
                        urls: this.samples.other, baseUrl: this.sampleURL}); break;
            }
            // this.filter = new Tone.AutoFilter("2n", 500, 4).start();
            // this.distortion = new Tone.Distortion(0.5);
            // this.instrument.chain(parent.filter, parent.distortion, Tone.Destination);
            this.instrument.chain(parent.filter, parent.distortion);
        }

        randomUrl(sampler) {return sampler.urls.keys()[Math.floor(Math.random() * sampler.keys().length)]}
        
        trigger() {
                // this.instrument.triggerAttackRelease(randomUrl(this.instrument), '16n');
                let notes = ["C1", "D1", "E1", "F1", "G1", "A1", "B1"];
                this.instrument.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], '1');
            }
        }

    class SequencerTrack {

        constructor(nb_steps, type) {
            [this.step, this.maxStep, this.type] = [0, nb_steps, type];
            [this.mode, this.multiplier] = ['normal', 1];
            [this.filter, this.distortion] = [
                new Tone.AutoFilter("2n", 500, 4).start(),
                new Tone.Distortion(0.2).toDestination()];

            // Generating new cells
            this.cells = [];
            for (let i=0; i <= nb_steps; i++) {
                this.cells.push(new SequencerCell(i, type, this))
            }
        }

        updateMultiplier(amount, operation) {
            switch(operation) {
                case 'increase': this.multiplier * amount; break;
                case 'decrease': this.multiplier / amount; break;
            }
        }

        // updateStep(newStep) {
        updateStep() {
            // Determine new step to take!
            switch (this.mode) {
                case 'normal':
                    this.step >= this.maxStep? this.step = 0 : this.step++; break;
                case 'reverse':
                    this.step <= 0? this.step = this.maxStep : this.step--; break;
                case 'random':
                    this.step = Math.floor(Math.random() * this.maxStep); break;
            }

            // Update each cell state accordingly
            switch (this.mode) {

                case 'normal': 
                    if (this.step % this.multiplier == 0) {
                        this.cells.forEach((cell) => cell.on = false);
                        this.cells[this.step].on = true;
                    }
                    break;

                case 'reverse':
                    if (this.step % this.multiplier == 0) {
                        this.cells.forEach((cell) => cell.on = false);
                        this.cells[this.step].on = true;
                    }
                    break;

                case 'random':
                    if (this.step % this.multiplier == 0) {
                        this.cells.forEach((cell) => cell.on = false);
                        this.cells[this.step].on = true;
                    }
                }
            }

            triggerCurrentCell() {
                if (this.cells[this.step].active) {
                    this.cells[this.step].trigger();
                }
            }

        }

    // Declaring new tracks to be shown on the screen
    let track = new SequencerTrack(maxStep, 'bassdrum');
    let track2 = new SequencerTrack(maxStep, 'hat');
    let track3 = new SequencerTrack(maxStep, 'snare');
    let track4 = new SequencerTrack(maxStep, 'other');
    let activeTracks = [track, track2, track3, track4];

    // This function is handling the update and redraw of sequencers
    // on the screen.

    const handleSequenceInTime = (time) => {
        activeTracks.forEach((track) => {
            track.updateStep();
            track.triggerCurrentCell();
        })
        track = track;  
        track2= track2; 
        track3 = track3;
        track4 = track4;
    }


    const disableCell = (track, cell) => {
        track.cells[cell].active = !track.cells[cell].active;
        track = track // force render by assignment (Svelte)
    }

    const bpmUp = (amount, operation) => {
        switch (operation) {
            case 'up': 
                Tone.Transport.bpm.value += amount; break;
            case 'down':
                Tone.Transport.bpm.value -= amount; break;
            case 'divide':
                Tone.Transport.bpm.value = Tone.Transport.bpm.value / 2; break;
            case 'multiply':
                Tone.Transport.bpm.value = Tone.Transport.bpm.value * 2; break;
        }

    }


</script>

<main>
    <div class="sequencer">

        <!-- Sequencer n°1  -->
        <div class="track">
            {#each track.cells as c}
            <Cell on={c.on} on:click={() => {disableCell(track, c.number)}}
                active={c.active} number={c.number} />
            {/each}
            <CellControl track={track}/>
        </div>

        <!-- Sequencer n°2  -->
        <div class="track">
            {#each track2.cells as c}
            <Cell 
                on={c.on}
                on:click={() => {disableCell(track2, c.number)}}
                active={c.active}
                number={c.number} />
            {/each}
            <CellControl track={track2}/>
        </div>

        <!-- Sequencer n°3  -->
        <div class="track">
            {#each track3.cells as c}
            <Cell 
                on={c.on}
                on:click={() => {disableCell(track3, c.number)}}
                active={c.active}
                number={c.number} />
            {/each}
            <CellControl track={track3}/>
        </div>

        <!-- Sequencer n°4  -->
        <div class="track">
            {#each track4.cells as c}
            <Cell 
                on={c.on}
                on:click={() => {disableCell(track4, c.number)}}
                active={c.active}
                number={c.number} />
            {/each}
            <CellControl track={track4}/>
        </div>
    </div>

    <div class="ui">
        <button class="boxed_things" on:click={handleTransport}>{transportRunning? "Pause" : "Play"}</button>
        <button class="boxed_things" on:click={() => {bpmUp(1, 'up')}}>+1</button>
        <button class="boxed_things" on:click={() => {bpmUp(5, 'up')}}>+5</button>
        <button class="boxed_things" on:click={() => {bpmUp(1, 'down')}}>-1</button>
        <button class="boxed_things" on:click={() => {bpmUp(5, 'down')}}>-5</button>
        <button class="boxed_things" on:click={() => {bpmUp(1, 'divide')}}>/2</button>
        <button class="boxed_things" on:click={() => {bpmUp(5, 'multiply')}}>*2</button>
    </div>

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
        font-size: 1vw;
	}

    :root {
        --cell-border-size: 0.5vh;
        --boxes-font-size: 1.8vh;
    }

    .ui {
        display: flex;
        justify-content: center;
    }

    .play {
        margin: 10px 10px;
        display: inline;
        width: 60%;
        background: white;
        color: black;
        border: var(--cell-border-size) dashed black;
        font-size: var(--boxes-font-size);
    }

    .boxed_things {
        background: white; color: black;
        border: 5px dashed black;
        width: fit-content; height: fit-content;
        margin: 1vw 1vh;
        font-size: 2.5vh;
    }

    .controls {
        background: white; color: black;
        border: var(--cell-border-size) dashed black;
        width: fit-content; 
        margin: 1vw 1vh;
        font-size: var(--boxes-font-size);
    }
    
    .controls_container {
        display: inline;
    }


    .track {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    p {display: inline}

    .sequencer {
        text-align: center;
    }

    main {
        font-family: 'terminal_grotesque_open';
        font-weight: normal;
        font-size: 2vmin;
    }

</style>
