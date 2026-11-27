// Tiny WebAudio sound effects (no audio files needed). Everything is soft and short.
let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.08, slideTo?: number) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  const t = c.currentTime + start;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  pop() {
    tone(520, 0, 0.12, "sine", 0.09, 880);
  },
  tap() {
    tone(660, 0, 0.06, "triangle", 0.05);
  },
  chime() {
    tone(784, 0, 0.5, "sine", 0.07);
    tone(988, 0.12, 0.5, "sine", 0.07);
    tone(1319, 0.26, 0.7, "sine", 0.06);
  },
  mwah() {
    tone(300, 0, 0.14, "sine", 0.09, 700);
    tone(700, 0.1, 0.1, "sine", 0.05, 400);
  },
  wrong() {
    tone(220, 0, 0.15, "triangle", 0.06);
    tone(185, 0.14, 0.2, "triangle", 0.06);
  },
  page() {
    tone(180, 0, 0.12, "sawtooth", 0.015, 90);
  },
};
