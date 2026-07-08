import { useRef, useCallback, useEffect } from 'react';
import type { SoundType } from '../data/animals';

interface SoundTrack {
  sources: AudioBufferSourceNode[];
  gainNode: GainNode;
  breathingIntervalId?: ReturnType<typeof setInterval>;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private tracks = new Map<string, SoundTrack>();

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private makeNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
    const ctx = this.getCtx();
    const len = ctx.sampleRate * 8;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      if (type === 'white') {
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      } else if (type === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + w * 0.0555179;
          b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.96900 * b2 + w * 0.1538520;
          b3 = 0.86650 * b3 + w * 0.3104856;
          b4 = 0.55000 * b4 + w * 0.5329522;
          b5 = -0.7616 * b5 - w * 0.0168980;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) / 6;
          b6 = w * 0.115926;
        }
      } else {
        let last = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          d[i] = (last + 0.02 * w) / 1.02;
          last = d[i];
          d[i] *= 3.5;
        }
      }
    }
    return buf;
  }

  private makeSource(buf: AudioBuffer): AudioBufferSourceNode {
    const ctx = this.getCtx();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    return src;
  }

  private makeFilter(type: BiquadFilterType, freq: number, q = 1): BiquadFilterNode {
    const ctx = this.getCtx();
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  private scheduleBreathing(gainNode: GainNode, ctx: AudioContext) {
    const cycle = 4.5;
    const now = ctx.currentTime + 0.05;
    for (let i = 0; i < 200; i++) {
      const t = now + i * cycle;
      gainNode.gain.setValueAtTime(0.01, t);
      gainNode.gain.linearRampToValueAtTime(0.55, t + cycle * 0.38);
      gainNode.gain.linearRampToValueAtTime(0.18, t + cycle * 0.52);
      gainNode.gain.linearRampToValueAtTime(0.48, t + cycle * 0.82);
      gainNode.gain.linearRampToValueAtTime(0.01, t + cycle);
    }
  }

  play(id: string, type: SoundType): void {
    this.stop(id);
    const ctx = this.getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const gainNode = ctx.createGain();
    gainNode.connect(this.masterGain!);
    const sources: AudioBufferSourceNode[] = [];

    if (type === 'breathing') {
      const src = this.makeSource(this.makeNoiseBuffer('pink'));
      const lp = this.makeFilter('lowpass', 280, 0.6);
      const hp = this.makeFilter('highpass', 80, 0.5);
      gainNode.gain.value = 0.01;
      src.connect(lp); lp.connect(hp); hp.connect(gainNode);
      src.start();
      sources.push(src);
      this.scheduleBreathing(gainNode, ctx);
    } else if (type === 'rain') {
      // Breathing layer
      const breathSrc = this.makeSource(this.makeNoiseBuffer('pink'));
      const breathLp = this.makeFilter('lowpass', 260, 0.5);
      const breathGain = ctx.createGain();
      breathGain.gain.value = 0.01;
      breathSrc.connect(breathLp); breathLp.connect(breathGain); breathGain.connect(gainNode);
      breathSrc.start();
      sources.push(breathSrc);
      this.scheduleBreathing(breathGain, ctx);

      // Rain layer - white noise bandpass
      const rainSrc = this.makeSource(this.makeNoiseBuffer('white'));
      const lp = this.makeFilter('lowpass', 2400, 0.8);
      const hp = this.makeFilter('highpass', 350, 0.6);
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.28;
      rainSrc.connect(lp); lp.connect(hp); hp.connect(rainGain); rainGain.connect(gainNode);
      rainSrc.start();
      sources.push(rainSrc);

      // Heavy rain drops - lower freq rumble
      const rumbleSrc = this.makeSource(this.makeNoiseBuffer('brown'));
      const rumbleLp = this.makeFilter('lowpass', 180, 0.4);
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.18;
      rumbleSrc.connect(rumbleLp); rumbleLp.connect(rumbleGain); rumbleGain.connect(gainNode);
      rumbleSrc.start();
      sources.push(rumbleSrc);

      gainNode.gain.value = 1;
    } else {
      // Nature: breathing + forest ambience
      const breathSrc = this.makeSource(this.makeNoiseBuffer('pink'));
      const breathLp = this.makeFilter('lowpass', 260, 0.5);
      const breathGain = ctx.createGain();
      breathGain.gain.value = 0.01;
      breathSrc.connect(breathLp); breathLp.connect(breathGain); breathGain.connect(gainNode);
      breathSrc.start();
      sources.push(breathSrc);
      this.scheduleBreathing(breathGain, ctx);

      // Wind - brown noise lowpass
      const windSrc = this.makeSource(this.makeNoiseBuffer('brown'));
      const windLp = this.makeFilter('lowpass', 420, 0.5);
      const windGain = ctx.createGain();
      windGain.gain.value = 0.16;
      windSrc.connect(windLp); windLp.connect(windGain); windGain.connect(gainNode);
      windSrc.start();
      sources.push(windSrc);

      // Foliage rustle - pink noise bandpass
      const rustleSrc = this.makeSource(this.makeNoiseBuffer('pink'));
      const rustleBp = this.makeFilter('bandpass', 1200, 1.2);
      const rustleGain = ctx.createGain();
      rustleGain.gain.value = 0.1;
      rustleSrc.connect(rustleBp); rustleBp.connect(rustleGain); rustleGain.connect(gainNode);
      rustleSrc.start();
      sources.push(rustleSrc);

      gainNode.gain.value = 1;
    }

    this.tracks.set(id, { sources, gainNode });
  }

  stop(id: string): void {
    const track = this.tracks.get(id);
    if (!track) return;
    const { sources, gainNode, breathingIntervalId } = track;
    if (breathingIntervalId) clearInterval(breathingIntervalId);
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    setTimeout(() => {
      sources.forEach(s => { try { s.stop(); } catch {} });
      gainNode.disconnect();
    }, 350);
    this.tracks.delete(id);
  }

  stopAll(): void {
    for (const id of [...this.tracks.keys()]) this.stop(id);
  }

  setMasterVolume(vol: number): void {
    if (this.masterGain) {
      const ctx = this.getCtx();
      this.masterGain.gain.setTargetAtTime(vol, ctx.currentTime, 0.05);
    }
  }

  isPlaying(id: string): boolean {
    return this.tracks.has(id);
  }

  resume(): void {
    this.ctx?.resume();
  }
}

const engine = new AudioEngine();

export function useAudioEngine() {
  const engineRef = useRef(engine);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        engineRef.current.resume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const play = useCallback((id: string, type: SoundType) => {
    engineRef.current.play(id, type);
  }, []);

  const stop = useCallback((id: string) => {
    engineRef.current.stop(id);
  }, []);

  const stopAll = useCallback(() => {
    engineRef.current.stopAll();
  }, []);

  const setVolume = useCallback((vol: number) => {
    engineRef.current.setMasterVolume(vol);
  }, []);

  const isPlaying = useCallback((id: string) => {
    return engineRef.current.isPlaying(id);
  }, []);

  return { play, stop, stopAll, setVolume, isPlaying };
}
