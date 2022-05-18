<script>
    import Cell from './Cell.svelte'
    import * as Tone from 'tone';
    let maxStep = 15;
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
            	baseUrl: "/raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/gh-pages/samples/"}).toDestination();
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
            <Cell 
                on={c.on}
                on:click={() => {disableCell(track, c.number)}}
                active={c.active}
                number={c.number} />
            {/each}
            <button class="divider" on:click={() => {
                track.updateMultiplier(2, 'decrease'); track = track;}}>Decrease</button>
            <button class="divider" on:click={() => {
                track.updateMultiplier(2, 'increase'); track = track;}}>Increase</button>
            <button class="divider" on:click={() => {
                let chooseOne = ['normal', 'reverse', 'random'];
                chooseOne = chooseOne[Math.floor(Math.random() * chooseOne.length)];
                track.mode = chooseOne;
                track = track;
            }}>Roll a dice!</button>
            <button class="divider" on:click={() => {
                track.cells.forEach((cell) => {
                    cell.active = Math.random() > 0.6 ? true: false;
                });
                track = track;
            }}>Randomize</button>
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
            <button class="divider" on:click={
            () => {track2.updateMultiplier(2, 'decrease'); track2 = track2;}}>Decrease</button>
            <button class="divider" on:click={() => {
                track2.updateMultiplier(2, 'increase'); track2 = track2;}}>Increase</button>
            <button class="divider" on:click={() => {
                let chooseOne = ['normal', 'reverse', 'random'];
                chooseOne = chooseOne[Math.floor(Math.random() * chooseOne.length)];
                track2.mode = chooseOne;
                track2 = track2;
            }}>Roll a dice!</button>
            <button class="divider" on:click={() => {
                track2.cells.forEach((cell) => {
                    cell.active = Math.random() > 0.6 ? true: false;
                });
                track2 = track2;
            }}>Randomize</button>
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
            <button class="divider" on:click={() => {
                track3.updateMultiplier(2, 'decrease'); track3 = track3;}}>Decrease</button>
            <button class="divider" on:click={() => {
                track3.updateMultiplier(2, 'increase'); track3 = track3;}}>Increase</button>
            <button class="divider" on:click={() => {
                let chooseOne = ['normal', 'reverse', 'random'];
                chooseOne = chooseOne[Math.floor(Math.random() * chooseOne.length)];
                track3.mode = chooseOne;
                track3 = track3;
            }}>Roll a dice!</button>
            <button class="divider" on:click={() => {
                track3.cells.forEach((cell) => {
                    cell.active = Math.random() > 0.6 ? true: false;
                });
                track3 = track3;
            }}>Randomize</button>
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
            <button class="divider" on:click={() => {
                track4.updateMultiplier(2, 'decrease'); track4 = track4;}}>Decrease</button>
            <button class="divider" on:click={() => {
                track4.updateMultiplier(2, 'increase'); track4 = track4;}}>Increase</button>
            <button class="divider" on:click={() => {
                let chooseOne = ['normal', 'reverse', 'random'];
                chooseOne = chooseOne[Math.floor(Math.random() * chooseOne.length)];
                track4.mode = chooseOne;
                track4 = track4;
            }}>Roll a dice!</button>
            <button class="divider" on:click={() => {
                track4.cells.forEach((cell) => {
                    cell.active = Math.random() > 0.6 ? true: false;
                });
                track4 = track4;
            }}>Randomize</button>

        </div>

    </div>

    <div class="ui">
        <button class="play" on:click={handleTransport}>{transportRunning? "Pause" : "Play"}</button>
        <button class="play" on:click={() => {bpmUp(1, 'up')}}>+1</button>
        <button class="play" on:click={() => {bpmUp(5, 'up')}}>+5</button>
        <button class="play" on:click={() => {bpmUp(1, 'down')}}>-1</button>
        <button class="play" on:click={() => {bpmUp(5, 'down')}}>-5</button>
        <button class="play" on:click={() => {bpmUp(1, 'divide')}}>/2</button>
        <button class="play" on:click={() => {bpmUp(5, 'multiply')}}>*2</button>
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
	}
    .ui {
        display: flex;
    }

    .play {
        margin: 10px 10px;
        display: inline;
        width: 60%;
        background: white;
        color: black;
        border: 5px dashed black;
    }

    .divider {
        margin: 10px 10px;
        display: inline;
        width: 100px;
        height: 40px;
        background: white;
        color: black;
        border: 5px dashed black;
    }


    .track {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    p {display: inline}

    .sequencer {
        text-align: center;
    }

    main {
        font-family: 'terminal_grotesque_open';
        font-weight: normal;
    }


</style>