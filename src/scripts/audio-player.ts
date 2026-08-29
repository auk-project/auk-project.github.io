// A custom A/B audio player + global "only one at a time" coordinator.
// The player draws a clickable waveform on a <canvas>, controls a single
// <audio> element per channel, and supports a normalized-position switch
// between two tracks of different lengths.

export interface PlayerTrack {
  /** Absolute or site-relative URL of the audio. */
  url: string;
  /** Display label, e.g. "Source" or "Auk output". */
  label: string;
  /** Optional side index for A/B switching. */
  side?: "a" | "b";
  /** CSS color hint (hex). */
  color?: string;
}

interface PlayerOptions {
  root: HTMLElement;
  tracks: PlayerTrack[];
  /** When true, use a single column layout; otherwise A/B. */
  single?: boolean;
  /** Optional caption shown above the player. */
  caption?: string;
  /** Optional instruction shown below the player. */
  instruction?: string;
}

interface ChannelState {
  audio: HTMLAudioElement;
  track: PlayerTrack;
  canvas: HTMLCanvasElement;
  peaks: number[] | null;
  duration: number;
  loading: boolean;
  failed: boolean;
}

// Waveform colors track the Hunyuan ramp: pale blue is too light to read as a
// track at bar width, so the unplayed side is a mid tint of the brand blue and
// the played-through side is the brand blue itself.
const WAVE_COLOR_TRACK = "rgba(0, 85, 233, 0.28)";
const WAVE_COLOR_PROGRESS = "#0055e9";

const players: Set<AudioPlayer> = new Set();
let activePlayer: AudioPlayer | null = null;

export class AudioPlayer {
  private opts: PlayerOptions;
  private root: HTMLElement;
  private channels: ChannelState[] = [];
  private activeIndex = 0;
  private playBtn!: HTMLButtonElement;
  private timeEl!: HTMLElement;
  private durationEl!: HTMLElement;
  private statusEl: HTMLElement | null = null;
  private abSwitch: HTMLElement | null = null;
  private rafId: number | null = null;
  private destroyed = false;

  constructor(opts: PlayerOptions) {
    this.opts = opts;
    this.root = opts.root;
    this.root.classList.add("auk-player");
    if (opts.tracks.length === 1) this.root.classList.add("auk-player--single");
    else this.root.classList.add("auk-player--ab");
    this.build();
    this.attach();
    players.add(this);
  }

  private build(): void {
    this.root.innerHTML = "";
    if (this.opts.caption && !/^<.*>$/.test(this.opts.caption)) {
      const cap = document.createElement("div");
      cap.className = "auk-player__caption";
      cap.textContent = this.opts.caption;
      this.root.appendChild(cap);
    }

    const tracksEl = document.createElement("div");
    tracksEl.className = "auk-player__tracks";
    this.opts.tracks.forEach((track, idx) => {
      const channel = this.createChannel(track, idx === this.activeIndex);
      this.channels.push(channel);
      tracksEl.appendChild(channel.audio);
    });
    this.root.appendChild(tracksEl);

    const control = document.createElement("div");
    control.className = "auk-player__control";
    control.innerHTML = `
      <button type="button" class="auk-player__play" aria-label="Play or pause">
        <svg class="auk-player__play-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
        <svg class="auk-player__pause-icon" viewBox="0 0 24 24" aria-hidden="true" style="display:none">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/>
        </svg>
      </button>
      <div class="auk-player__scrubber" role="slider" tabindex="0" aria-label="Seek">
        <canvas class="auk-player__wave" aria-hidden="true"></canvas>
        <div class="auk-player__progress"></div>
      </div>
      <div class="auk-player__time">
        <span class="auk-player__elapsed">0:00</span>
        <span class="auk-player__sep">/</span>
        <span class="auk-player__duration">0:00</span>
      </div>
      <button type="button" class="auk-player__download" title="Download this audio" aria-label="Download this audio">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M11 2a1 1 0 1 1 2 0v9.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 11.586V2zM4 15a1 1 0 0 1 1 1v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a1 1 0 1 1 2 0v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 0 1 1-1z"/></svg>
      </button>
    `;
    this.root.appendChild(control);
    this.playBtn = control.querySelector(".auk-player__play") as HTMLButtonElement;
    this.timeEl = control.querySelector(".auk-player__elapsed") as HTMLElement;
    this.durationEl = control.querySelector(".auk-player__duration") as HTMLElement;
    const dlBtn = control.querySelector(".auk-player__download") as HTMLButtonElement;
    dlBtn.addEventListener("click", () => {
      const ch = this.current();
      if (ch?.track.url) {
        const a = document.createElement("a");
        a.href = ch.track.url;
        a.download = ch.track.url.split("/").pop() ?? "audio.wav";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    });
    const statusEl = document.createElement("div");
    statusEl.className = "auk-player__status";
    statusEl.setAttribute("aria-live", "polite");
    this.root.appendChild(statusEl);
    this.statusEl = statusEl;

    if (!this.opts.single && this.channels.length > 1) {
      this.abSwitch = document.createElement("div");
      this.abSwitch.className = "auk-player__ab";
      this.abSwitch.setAttribute("role", "tablist");
      this.opts.tracks.forEach((track, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "auk-player__ab-btn";
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", idx === this.activeIndex ? "true" : "false");
        btn.textContent = track.label;
        btn.addEventListener("click", () => this.setActive(idx, true));
        this.abSwitch!.appendChild(btn);
      });
      // The A/B switch belongs at the card's top-right, above the instruction,
      // so it reads as a header control rather than a footer afterthought.
      this.root.insertBefore(this.abSwitch, this.root.firstChild);
    }
  }

  private createChannel(track: PlayerTrack, autoload: boolean): ChannelState {
    const audio = new Audio();
    audio.src = track.url;
    audio.preload = autoload ? "metadata" : "none";
    audio.crossOrigin = "anonymous";
    audio.style.display = "none";

    const canvas = document.createElement("canvas");
    canvas.className = "auk-player__wave";
    canvas.width = 800;
    canvas.height = 80;

    return {
      audio,
      track,
      canvas,
      peaks: null,
      duration: 0,
      loading: autoload,
      failed: false,
    };
  }

  private attach(): void {
    this.playBtn.addEventListener("click", () => this.toggle());

    const scrubber = this.root.querySelector(".auk-player__scrubber") as HTMLElement;
    const onSeek = (e: PointerEvent) => {
      const ch = this.current();
      if (!ch || !ch.duration) return;
      const rect = scrubber.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      ch.audio.currentTime = ratio * ch.duration;
      this.updateTime();
      this.drawWave();
    };
    scrubber.addEventListener("pointerdown", (e) => {
      scrubber.setPointerCapture(e.pointerId);
      onSeek(e);
      const move = (ev: PointerEvent) => onSeek(ev);
      const up = (ev: PointerEvent) => {
        scrubber.removeEventListener("pointermove", move);
        scrubber.removeEventListener("pointerup", up);
        scrubber.removeEventListener("pointercancel", up);
        scrubber.releasePointerCapture(ev.pointerId);
      };
      scrubber.addEventListener("pointermove", move);
      scrubber.addEventListener("pointerup", up);
      scrubber.addEventListener("pointercancel", up);
    });
    scrubber.addEventListener("keydown", (e) => {
      const ch = this.current();
      if (!ch || !ch.duration) return;
      if (e.key === "ArrowRight") {
        ch.audio.currentTime = Math.min(ch.duration, ch.audio.currentTime + 1);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        ch.audio.currentTime = Math.max(0, ch.audio.currentTime - 1);
        e.preventDefault();
      } else if (e.key === "Home") {
        ch.audio.currentTime = 0;
        e.preventDefault();
      } else if (e.key === "End") {
        ch.audio.currentTime = ch.duration;
        e.preventDefault();
      } else if (e.key === " " || e.key === "Enter") {
        this.toggle();
        e.preventDefault();
      }
      this.updateTime();
      this.drawWave();
    });

    this.channels.forEach((ch) => {
      ch.audio.addEventListener("loadedmetadata", () => {
        ch.duration = ch.audio.duration || 0;
        this.durationEl.textContent = this.fmt(ch.duration);
        ch.loading = false;
        this.updateTime();
        this.drawWave();
        this.loadPeaks(ch);
      });
      ch.audio.addEventListener("timeupdate", () => {
        this.updateTime();
        this.drawWave();
      });
      ch.audio.addEventListener("ended", () => {
        this.setPlaying(false);
        this.updateTime();
        this.drawWave();
      });
      ch.audio.addEventListener("error", () => {
        ch.failed = true;
        ch.loading = false;
        this.setStatus(`Failed to load ${ch.track.label}.`);
        this.drawWave();
      });
    });

    // Eagerly load the first track and any adjacent channel.
    this.loadPeaks(this.current());
  }

  private current(): ChannelState {
    return this.channels[this.activeIndex];
  }

  private setActive(idx: number, announce = false): void {
    if (idx === this.activeIndex) return;
    const prev = this.current();
    const wasPlaying = !prev.audio.paused;
    const prevTime = prev.audio.currentTime;
    const prevRatio = prev.duration ? prevTime / prev.duration : 0;
    if (!prev.audio.paused) prev.audio.pause();

    this.activeIndex = idx;
    const next = this.current();
    if (!next.audio.src) next.audio.src = next.track.url;
    next.audio.preload = "metadata";
    if (next.loading) {
      // Will be applied on loadedmetadata.
      this.setStatus(`Loading ${next.track.label}…`);
    }
    next.audio.addEventListener(
      "loadedmetadata",
      () => {
        if (prevRatio > 0 && Number.isFinite(prevRatio)) {
          next.audio.currentTime = prevRatio * next.duration;
        }
        if (wasPlaying) next.audio.play().catch(() => undefined);
      },
      { once: true },
    );
    if (next.duration > 0 && prevRatio > 0) {
      next.audio.currentTime = prevRatio * next.duration;
    }
    if (wasPlaying && next.duration > 0) {
      next.audio.play().catch(() => undefined);
    }
    if (this.abSwitch) {
      this.abSwitch.querySelectorAll(".auk-player__ab-btn").forEach((btn, i) => {
        btn.setAttribute("aria-selected", i === idx ? "true" : "false");
      });
    }
    // Let the surrounding card react to a track change (e.g. update the demo
    // instruction text for multi-output edits).
    this.root.dispatchEvent(
      new CustomEvent("auk-track-change", {
        detail: { index: idx, label: next.track.label, url: next.track.url },
        bubbles: true,
      }),
    );
    // The selected pill already shows which track is live, so a switch needs no
    // status line; `announce` only reaches assistive tech.
    if (announce && this.statusEl) this.statusEl.setAttribute("aria-label", `Playing ${next.track.label}`);
    this.updateTime();
    this.drawWave();
  }

  private toggle(): void {
    const ch = this.current();
    if (ch.failed) return;
    if (ch.audio.paused) this.play();
    else this.pause();
  }

  private play(): void {
    if (activePlayer && activePlayer !== this) activePlayer.pause();
    activePlayer = this;
    this.channels.forEach((c, i) => {
      if (i !== this.activeIndex) c.audio.pause();
    });
    const ch = this.current();
    ch.audio.play().catch((err) => {
      this.setStatus(`Playback blocked: ${err.message}`);
    });
    this.setPlaying(true);
    this.loop();
  }

  private pause(): void {
    this.channels.forEach((c) => c.audio.pause());
    this.setPlaying(false);
  }

  private setPlaying(playing: boolean): void {
    this.playBtn.classList.toggle("is-playing", playing);
    this.playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    const playIcon = this.playBtn.querySelector(".auk-player__play-icon") as HTMLElement;
    const pauseIcon = this.playBtn.querySelector(".auk-player__pause-icon") as HTMLElement;
    if (playIcon && pauseIcon) {
      playIcon.style.display = playing ? "none" : "";
      pauseIcon.style.display = playing ? "" : "none";
    }
    if (!playing && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (): void => {
    if (this.destroyed) return;
    this.updateTime();
    this.drawWave();
    const ch = this.current();
    if (!ch.audio.paused) this.rafId = requestAnimationFrame(this.loop);
  };

  private updateTime(): void {
    const ch = this.current();
    this.timeEl.textContent = this.fmt(ch.audio.currentTime);
    this.durationEl.textContent = this.fmt(ch.duration);
  }

  private fmt(s: number): string {
    if (!s || !Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  private setStatus(msg: string): void {
    if (this.statusEl) this.statusEl.textContent = msg;
  }

  private async loadPeaks(ch: ChannelState): Promise<void> {
    if (ch.peaks || ch.failed) return;
    try {
      const resp = await fetch(ch.track.url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const buf = await resp.arrayBuffer();
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const audio = await ctx.decodeAudioData(buf.slice(0));
      const data = audio.getChannelData(0);
      const target = 360;
      const blockSize = Math.max(1, Math.floor(data.length / target));
      const peaks: number[] = new Array(target);
      for (let i = 0; i < target; i++) {
        let max = 0;
        const start = i * blockSize;
        const end = Math.min(data.length, start + blockSize);
        for (let j = start; j < end; j++) {
          const v = Math.abs(data[j]);
          if (v > max) max = v;
        }
        peaks[i] = max;
      }
      ch.peaks = peaks;
      ch.duration = audio.duration;
      this.durationEl.textContent = this.fmt(audio.duration);
      ctx.close();
      this.drawWave();
    } catch (e) {
      ch.failed = true;
      this.setStatus(`Could not decode ${ch.track.label}.`);
      this.drawWave();
    }
  }

  private drawWave(): void {
    const ch = this.current();
    const canvas = this.root.querySelector(".auk-player__wave") as HTMLCanvasElement;
    if (!canvas) return;
    const progressEl = this.root.querySelector(".auk-player__progress") as HTMLElement;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 80;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const peaks = ch.peaks;
    if (!peaks) {
      ctx.fillStyle = "rgba(13, 27, 62, 0.5)";
      ctx.font = "12px 'Google Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(ch.loading ? "Decoding waveform…" : "Click play to load", w / 2, h / 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      return;
    }
    const barCount = peaks.length;
    const barWidth = w / barCount;
    const ratio = ch.duration > 0 ? ch.audio.currentTime / ch.duration : 0;
    if (progressEl) progressEl.style.width = `${ratio * 100}%`;
    for (let i = 0; i < barCount; i++) {
      const v = peaks[i];
      const bh = Math.max(2, v * (h - 4));
      const x = i * barWidth;
      const y = (h - bh) / 2;
      const passed = i / barCount < ratio;
      ctx.fillStyle = passed ? WAVE_COLOR_PROGRESS : WAVE_COLOR_TRACK;
      ctx.fillRect(x + barWidth * 0.15, y, barWidth * 0.7, bh);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  destroy(): void {
    this.destroyed = true;
    this.channels.forEach((c) => {
      c.audio.pause();
      c.audio.src = "";
    });
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    players.delete(this);
    if (activePlayer === this) activePlayer = null;
  }
}

export function mountAllAudioPlayers(): void {
  document.querySelectorAll<HTMLElement>("[data-auk-player]").forEach((root) => {
    if (root.dataset.aukPlayerMounted === "1") return;
    root.dataset.aukPlayerMounted = "1";
    try {
      const cfg = JSON.parse(root.dataset.aukPlayer || "{}") as {
        tracks?: { url: string; label: string; side?: "a" | "b"; color?: string }[];
        caption?: string;
        instruction?: string;
        single?: boolean;
      };
      if (!cfg.tracks || cfg.tracks.length === 0) return;
      new AudioPlayer({
        root,
        caption: cfg.caption,
        instruction: cfg.instruction,
        single: cfg.single,
        tracks: cfg.tracks,
      });
    } catch (err) {
      console.warn("Failed to mount audio player", err);
    }
  });
}

export function redrawAllPlayers(): void {
  // Trigger a redraw when window resizes (wave canvases are CSS sized).
  players.forEach((p) => (p as unknown as { drawWave: () => void }).drawWave());
}
