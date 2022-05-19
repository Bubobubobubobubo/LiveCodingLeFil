<script>
    import Cell from './Cell.svelte';
    import CellControl from './CellControl.svelte';
    import * as Tone from 'tone';
    let maxStep = 8;
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
            // Tone.Transport.bpm.value = 450;
            transportRunning = !transportRunning;
            console.log("Démarrage du séquenceur")
            Tone.Transport.scheduleRepeat(
                handleSequenceInTime, "8n");
        } else {
            Tone.Transport.cancel();
            Tone.Transport.pause();
            transportRunning = !transportRunning;
        }

    }

    class SequencerCell {

        constructor(step_number) {
            this.on = false;
            this.active = Math.random() > 0.9? true : false;
            this.number = step_number;
            this.instrument = new Tone.Sampler({
            	urls: { 
                    C1:"bd1.wav",
                    D1:"bd2.wav",
                    E1:"bd3.wav",
                    F1:"bd4.wav",
                    G1:"ch1.wav",
                    A1:"ch2.wav",
                    B1:"clap.wav", 
                    C2:"crash.wav",
                    D2:"oh.wav",
                    E2:"ride.wav",
                    F2:"ride2.wav", 
                    G2:"rim.wav",
                    A2:"sd1.wav",
                    B2:"sd2.wav",
                    C3:"tom1.wav",
                    D3:"tom2.wav"},
            	baseUrl: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/samples/"}).toDestination();
        }
        
        trigger() {
            let scale = ["C1", "D1", "E1", "F1",
            "G1", "B1", "C2", "D2", "E2", "F2", "G2",
            "A2", "B2", "C3", "D3"];
            let randomNote = scale[Math.floor(Math.random() * scale.length)];
            this.instrument.triggerAttackRelease(Tone.Frequency(randomNote)
                    .transpose(12 * Math.floor(Math.random() / 2)), '16n');
        }

    }

    class SequencerTrack {

        constructor(nb_steps) {
            [this.step, this.maxStep] = [0, nb_steps];
            [this.mode, this.multiplier] = ['normal', 1];
            this.cells = [];
            for (let i=0; i <= nb_steps; i++) {
                this.cells.push(new SequencerCell(i))
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
    let track = new SequencerTrack(maxStep);
    let track2 = new SequencerTrack(maxStep);
    let track3 = new SequencerTrack(maxStep);
    let track4 = new SequencerTrack(maxStep);
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
