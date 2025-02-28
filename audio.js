let synth = null;
let specialSynth = null;
let lastScheduledTime = 0;
let lastGlobalTrigger = 0;

function mapSidesToFrequency(sides) {
    const baseFrequency = 220;
    return baseFrequency * (sides / 3);
}

function initAudio() {
    if (!synth) {
        Tone.start().then(() => {
            synth = new Tone.Synth({
                oscillator: { type: "triangle" },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.1 }
            }).toDestination();

            specialSynth = new Tone.Synth({
                oscillator: { type: "square" },
                envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.2 }
            }).toDestination();

            console.log("Tone.js ha sido inicializado correctamente.");
            document.removeEventListener("click", initAudio);
            document.removeEventListener("touchstart", initAudio);
        }).catch(err => console.error("Error al iniciar Tone.js:", err));
    }
}

function playSound(sides) {
    if (!synth) {
        console.warn("Synth aún no está inicializado. Esperando clic...");
        return;
    }

    const frequency = mapSidesToFrequency(sides);
    let currentTime = Tone.now();

    if (currentTime <= lastScheduledTime) {
        currentTime = lastScheduledTime + 0.02;
    }

    lastScheduledTime = currentTime;
    synth.triggerAttackRelease(frequency, "8n", currentTime + 0.01);
    console.log(`Sonando: ${frequency} Hz para ${sides} lados`);
}

function playGlobalSound() {
    if (!specialSynth) return;

    let currentTime = Tone.now();

    if (currentTime - lastGlobalTrigger < 0.1) return;

    lastGlobalTrigger = currentTime;
    specialSynth.triggerAttackRelease(440, "2n", currentTime + 0.02);
    console.log("TODAS LAS BOLAS COINCIDEN ARRIBA. SONIDO ESPECIAL");
}

document.addEventListener("click", initAudio);
document.addEventListener("touchstart", initAudio);