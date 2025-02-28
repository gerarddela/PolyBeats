// utils.js
function getFrequencyFromSides(sides) {
    const baseFrequency = 220; // La4 en MIDI
    return baseFrequency * (sides / 3);
}
