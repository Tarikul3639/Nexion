// utils/sound.ts
export function playBeep(duration = 100, frequency = 440) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';            // ‘sine’, ‘square’, ‘sawtooth’, ‘triangle’
    osc.frequency.value = frequency; 
    gain.gain.value = 0.1;        

    osc.connect(gain).connect(ctx.destination);
    osc.start();

    // Stop the sound after the specified duration
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) {
    console.error('AudioContext not supported or user gesture blocked:', e);
  }
}
