/**
 * ============================================================================
 * 🎵 DIWALI FESTIVE SOUND ENGINE (Web Audio API)
 * 100% Procedural Audio Synthesizer - Works Offline with Zero External Assets!
 * ============================================================================
 */

class DiwaliSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isAmbientPlaying = false;
    this.ambientInterval = null;
    this.droneGain = null;
    this.ambientOscillators = [];
  }

  // Initialize or resume AudioContext on first user interaction
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isAmbientPlaying) {
      this.stopAmbientMusic();
    }
    return this.isMuted;
  }

  /**
   * 🔔 Auspicious Temple Bell / Diya Chime
   * Rich harmonic bell tone with exponential decay
   */
  playBell(freq = 660) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const harmonics = [1, 1.5, 2.0, 2.75, 4.0];
    const gains = [0.4, 0.25, 0.18, 0.1, 0.05];

    harmonics.forEach((ratio, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, now);

      gain.gain.setValueAtTime(gains[i] * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + i * 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  }

  /**
   * 🚀 Rocket Launch Whoosh
   */
  playRocketLaunch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.6);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  /**
   * 💥 Firecracker Burst & Crackle
   * Synthesized white noise burst with low-pass filter decay + deep bass thump
   */
  playFireworkBurst(intensity = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Noise Burst for crackle
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.45);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35 * intensity, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.55);

    // 2. Sub-bass boom
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(120, now);
    sub.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    subGain.gain.setValueAtTime(0.4 * intensity, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    sub.connect(subGain);
    subGain.connect(this.ctx.destination);

    sub.start(now);
    sub.stop(now + 0.45);
  }

  /**
   * ✨ Hand Sparkler (Phuljhadi) Sizzle
   */
  playSparkler() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500 + Math.random() * 1500, now);
    filter.Q.value = 4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  /**
   * 🎶 Peaceful Ambient Festive Raga / Meditative Drone
   * Gentle Indian Tanpura + Flute arpeggiated resonance
   */
  toggleAmbientMusic() {
    this.init();
    if (this.isAmbientPlaying) {
      this.stopAmbientMusic();
      return false;
    } else {
      this.startAmbientMusic();
      return true;
    }
  }

  startAmbientMusic() {
    if (this.isMuted || !this.ctx) return;
    this.stopAmbientMusic();
    this.isAmbientPlaying = true;

    const rootFreq = 146.83; // D3 (Raag Yaman / Bhupali mood)
    const notes = [
      rootFreq, // D
      rootFreq * 9/8, // E
      rootFreq * 5/4, // F#
      rootFreq * 3/2, // A
      rootFreq * 15/8, // C#
      rootFreq * 2 // D4
    ];

    // Master drone gain
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 3);
    this.droneGain.connect(this.ctx.destination);

    // Continuous Tanpura root & fifth drone
    [rootFreq, rootFreq * 1.5, rootFreq * 0.5].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(this.droneGain);
      osc.start();
      this.ambientOscillators.push(osc);
    });

    // Flute melodic chimes every few seconds
    let step = 0;
    this.ambientInterval = setInterval(() => {
      if (!this.isAmbientPlaying || this.isMuted || !this.ctx) return;
      const noteFreq = notes[step % notes.length];
      step = (step + Math.floor(Math.random() * 3) + 1) % notes.length;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq * 2, now);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.06, now + 0.8);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(g);
      g.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.5);
    }, 2400);
  }

  stopAmbientMusic() {
    this.isAmbientPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.droneGain && this.ctx) {
      try {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      } catch (e) {}
    }
    this.ambientOscillators.forEach((osc) => {
      try { osc.stop(); } catch (e) {}
    });
    this.ambientOscillators = [];
  }
}

window.soundEngine = new DiwaliSoundEngine();
