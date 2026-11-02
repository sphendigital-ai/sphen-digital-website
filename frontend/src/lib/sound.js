class SoundEngine {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.enabled = false;
        this.ambientNodes = [];
        this.lastPlay = {};
    }

    init() {
        if (this.ctx) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.16;
        this.master.connect(this.ctx.destination);
        const len = this.ctx.sampleRate;
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }

    setEnabled(on) {
        this.enabled = on;
        localStorage.setItem("sphen_sound", on ? "on" : "off");
        window.dispatchEvent(new Event("sphen-sound-change"));
        if (on) {
            this.init();
            if (this.ctx) this.ctx.resume();
            this.startAmbient();
        } else {
            this.stopAmbient();
        }
    }

    throttled(name, ms) {
        const now = performance.now();
        if (now - (this.lastPlay[name] || 0) < ms) return false;
        this.lastPlay[name] = now;
        return true;
    }

    tone({ freq = 440, end = null, type = "sine", dur = 0.15, vol = 0.5, delay = 0 }) {
        if (!this.enabled || !this.ctx) return;
        const t = this.ctx.currentTime + delay;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t);
        if (end) o.frequency.exponentialRampToValueAtTime(end, t + dur);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g);
        g.connect(this.master);
        o.start(t);
        o.stop(t + dur + 0.05);
    }

    noise({ dur = 0.3, vol = 0.3, from = 400, to = 1200, delay = 0, q = 1.2 }) {
        if (!this.enabled || !this.ctx) return;
        const t = this.ctx.currentTime + delay;
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuf;
        src.loop = true;
        const f = this.ctx.createBiquadFilter();
        f.type = "bandpass";
        f.Q.value = q;
        f.frequency.setValueAtTime(from, t);
        f.frequency.exponentialRampToValueAtTime(to, t + dur);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + dur * 0.3);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(f);
        f.connect(g);
        g.connect(this.master);
        src.start(t);
        src.stop(t + dur + 0.05);
    }

    startup() {
        this.noise({ dur: 0.9, vol: 0.22, from: 200, to: 2400 });
        this.tone({ freq: 220, end: 660, type: "sine", dur: 0.9, vol: 0.16 });
        [1318, 1760, 2217].forEach((f, i) => this.tone({ freq: f, dur: 0.5, vol: 0.1, delay: 0.5 + i * 0.09 }));
        this.tone({ freq: 880, dur: 0.7, vol: 0.12, delay: 0.85 });
    }
    epicOpening() {
        this.tone({ freq: 120, end: 38, type: "sine", dur: 1.4, vol: 0.5 });
        this.noise({ dur: 1.8, vol: 0.28, from: 300, to: 5000, q: 0.8 });
        this.noise({ dur: 1.2, vol: 0.22, from: 150, to: 900, delay: 0.15 });
        this.tone({ freq: 160, end: 1280, type: "sawtooth", dur: 1.6, vol: 0.1, delay: 0.2 });
        this.tone({ freq: 320, end: 2560, type: "triangle", dur: 1.5, vol: 0.09, delay: 0.25 });
        this.tone({ freq: 90, end: 45, dur: 0.8, vol: 0.45, delay: 1.15 });
        this.noise({ dur: 0.4, vol: 0.28, from: 3000, to: 500, delay: 1.15 });
        [1046, 1318, 1568, 2093, 2637, 3136].forEach((f, i) => this.tone({ freq: f, dur: 0.5, vol: 0.13, delay: 1.2 + i * 0.08 }));
        this.tone({ freq: 1760, dur: 1.2, vol: 0.15, delay: 1.75 });
        this.tone({ freq: 880, dur: 1.4, vol: 0.11, delay: 1.75 });
    }
    whoosh(pitch = 1) { this.noise({ dur: 0.45, vol: 0.12, from: 300 * pitch, to: 1400 * pitch }); }
    tick() { this.tone({ freq: 2100, dur: 0.04, vol: 0.1 }); }
    click() { this.tone({ freq: 950, dur: 0.05, vol: 0.16 }); this.tone({ freq: 1400, dur: 0.06, vol: 0.1, delay: 0.03 }); }
    pop() { this.tone({ freq: 520, end: 180, dur: 0.09, vol: 0.2 }); }
    sparkle() { [1760, 2349, 3136].forEach((f, i) => this.tone({ freq: f, dur: 0.25, vol: 0.07, delay: i * 0.05 })); }
    chime() { this.tone({ freq: 1174, dur: 0.6, vol: 0.12 }); this.tone({ freq: 1760, dur: 0.5, vol: 0.06, delay: 0.02 }); }
    ding() { this.tone({ freq: 1568, dur: 0.7, vol: 0.16 }); this.tone({ freq: 2093, dur: 0.5, vol: 0.07, delay: 0.04 }); }
    riser() {
        this.noise({ dur: 1.1, vol: 0.09, from: 250, to: 2000 });
        this.tone({ freq: 180, end: 720, type: "triangle", dur: 1.1, vol: 0.09 });
        this.sparkle();
    }
    key() { this.tone({ freq: 1400 + Math.random() * 600, dur: 0.03, vol: 0.05 }); }
    countTick() { this.tone({ freq: 1200, dur: 0.025, vol: 0.06 }); }
    pulse() { this.tone({ freq: 320, end: 180, dur: 0.18, vol: 0.14 }); this.tone({ freq: 2400, dur: 0.2, vol: 0.04, delay: 0.05 }); }
    success() {
        this.noise({ dur: 0.6, vol: 0.12, from: 600, to: 2600 });
        [1046, 1318, 1568, 2093].forEach((f, i) => this.tone({ freq: f, dur: 0.4, vol: 0.1, delay: 0.1 + i * 0.08 }));
    }
    party() {
        this.pop();
        this.noise({ dur: 0.5, vol: 0.18, from: 1000, to: 4000, delay: 0.05 });
        [523, 659, 784, 1046, 1318].forEach((f, i) => this.tone({ freq: f, dur: 0.35, vol: 0.11, delay: 0.1 + i * 0.07 }));
        this.tone({ freq: 300, end: 900, type: "triangle", dur: 0.5, vol: 0.09, delay: 0.2 });
    }
    penguin() {
        const variants = [
            () => this.tone({ freq: 900, end: 1600, dur: 0.12, vol: 0.18 }),
            () => { this.tone({ freq: 1200, dur: 0.07, vol: 0.16 }); this.tone({ freq: 1200, dur: 0.07, vol: 0.16, delay: 0.1 }); },
            () => this.tone({ freq: 600, end: 1400, dur: 0.16, vol: 0.18 }),
            () => { this.tone({ freq: 800, end: 1200, dur: 0.1, vol: 0.16 }); this.tone({ freq: 1000, end: 1800, dur: 0.14, vol: 0.14, delay: 0.1 }); },
            () => this.tone({ freq: 1400, end: 700, dur: 0.12, vol: 0.14 }),
            () => { this.pop(); this.sparkle(); },
        ];
        variants[Math.floor(Math.random() * variants.length)]();
    }

    startAmbient() {
        if (!this.ctx || this.ambientNodes.length) return;
        const t = this.ctx.currentTime;
        const padGain = this.ctx.createGain();
        padGain.gain.setValueAtTime(0, t);
        padGain.gain.linearRampToValueAtTime(0.06, t + 3);
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 420;
        filter.Q.value = 0.6;
        filter.connect(padGain);
        padGain.connect(this.master);
        const oscs = [55, 82.5, 110, 165].map((f, i) => {
            const o = this.ctx.createOscillator();
            o.type = i < 2 ? "sine" : "triangle";
            o.frequency.value = f;
            o.detune.value = (i - 1.5) * 6;
            const g = this.ctx.createGain();
            g.gain.value = i < 2 ? 0.5 : 0.2;
            o.connect(g);
            g.connect(filter);
            o.start(t);
            return o;
        });
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.05;
        const lfoG = this.ctx.createGain();
        lfoG.gain.value = 120;
        lfo.connect(lfoG);
        lfoG.connect(filter.frequency);
        lfo.start(t);
        const wind = this.ctx.createBufferSource();
        wind.buffer = this.noiseBuf;
        wind.loop = true;
        const wf = this.ctx.createBiquadFilter();
        wf.type = "lowpass";
        wf.frequency.value = 240;
        const wg = this.ctx.createGain();
        wg.gain.setValueAtTime(0, t);
        wg.gain.linearRampToValueAtTime(0.045, t + 4);
        wind.connect(wf);
        wf.connect(wg);
        wg.connect(this.master);
        wind.start(t);
        this.ambientNodes = [padGain, wg, lfoG, filter, wf, lfo, wind, ...oscs];
    }

    stopAmbient() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        this.ambientNodes.forEach((n) => {
            try {
                if (n.gain) {
                    n.gain.cancelScheduledValues(t);
                    n.gain.setValueAtTime(n.gain.value, t);
                    n.gain.linearRampToValueAtTime(0.0001, t + 0.4);
                }
                if (n.stop) n.stop(t + 0.5);
            } catch { /* node already stopped */ }
        });
        this.ambientNodes = [];
    }
}

export const sound = new SoundEngine();
