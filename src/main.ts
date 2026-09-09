import "./styles/site.css";
import { mountAllAudioPlayers, redrawAllPlayers } from "./scripts/audio-player";
import {
  capabilities,
  familyChips,
  resourceLinks,
  type CapabilityFamily,
  type DemoGroup,
  type DemoSample,
  type InstructionMode,
  type Placeholder,
} from "./data/capabilities";

const isPlaceholder = (audio: DemoSample["audio"]): audio is Placeholder =>
  typeof audio === "object" && "missing" in audio;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );

const modeOf = (g: DemoGroup): InstructionMode => g.instructionMode ?? "always";

/** An input track is the unedited source, so it carries no instruction. */
const isInputLabel = (label: string) => label.toLowerCase() === "input";

function buildResourceLinks(): void {
  const container = document.getElementById("resource-links");
  if (!container) return;
  container.innerHTML = resourceLinks
    .map((l) => {
      const icon = renderIcon(l.icon);
      const flash = l.flashHref ?? l.href ?? "";
      // Both model-variant URLs ride on the element so the tab switch can
      // re-point the button without re-rendering.
      if (l.href) {
        return `<span class="link-block"><a href="${escapeHtml(l.href)}" data-href-auk="${escapeHtml(l.href)}" data-href-flash="${escapeHtml(flash)}" class="external-link button is-normal is-rounded is-dark" target="_blank" rel="noopener">${icon}<span>${escapeHtml(l.label)}</span></a></span>`;
      }
      return `<span class="link-block"><span class="external-link button is-normal is-rounded is-dark is-disabled" aria-disabled="true" title="Coming soon">${icon}<span>${escapeHtml(l.label)}</span></span></span>`;
    })
    .join("");
}

function renderIcon(kind: string): string {
  const common = 'class="icon" aria-hidden="true"';
  switch (kind) {
    case "arxiv":
      // Official arXiv logomark (red/grey, from arxiv.org).
      return `<span ${common}><svg viewBox="0 0 135.611 201" width="14" height="21" aria-hidden="true"><g><path d="M456.756,249.1l-42.324,49.375c-1.885,2.01-3.054,5.535-2,8.066a6.9,6.9,0,0,0,6.443,4.27c1.6,0,2.911-.56,4.631-2.289l52.364-54.278a8.927,8.927,0,0,0,.061-12.584Z" transform="translate(-391.029 -166.577)" fill="#aa142d"/><path d="M455.876,248.071l39.168-49.545c2.186-2.914,3.219-4.44,2.186-6.921a7.536,7.536,0,0,0-6.566-4.633h0a5.9,5.9,0,0,0-4.408,1.624l-50.072,53.061c-3.816,3.816-3.808,8.753.023,12.584l70.031,73.438a5.738,5.738,0,0,0,4.6,1.748c2.833,0,4.67-1.667,5.9-4.131,1.054-2.531-.112-5.038-2.056-7.664l-58.8-69.561" transform="translate(-391.029 -166.577)" fill="#bdb9b4"/><path d="M475.931,241.657l-68.388-71.966s-2.511-3.048-5.165-3.112a6.75,6.75,0,0,0-6.357,4.084c-1.033,2.481-.291,4.223,1.977,7.47L456.756,249.1Z" transform="translate(-391.029 -166.577)" fill="#aa142d"/><path d="M472.39,367.577a2.2,2.2,0,0,1-1.895-1.1l-8.528-14.161-8.576,14.161a2.152,2.152,0,0,1-1.9,1.1,2.33,2.33,0,0,1-2.343-2.3,2.269,2.269,0,0,1,.348-1.246l9.925-15.907L451.3,335.114a2.722,2.722,0,0,1-.351-1.247,2.331,2.331,0,0,1,2.347-2.292,2.093,2.093,0,0,1,1.894,1.046l6.779,11.42,6.734-11.42a2.011,2.011,0,0,1,1.843-1.046,2.268,2.268,0,0,1,2.346,2.292,2.7,2.7,0,0,1-.3,1.247l-8.079,13.015,9.825,15.907a1.956,1.956,0,0,1,.4,1.246A2.363,2.363,0,0,1,472.39,367.577Z" transform="translate(-391.029 -166.577)"/><path d="M429.138,342.132c1.021,0,1.7.681,2.188,1.9a2.817,2.817,0,0,1,2.578-1.9h8.169a2.231,2.231,0,0,1,2.237,2.237v4.3a1.983,1.983,0,0,1-2.237,2.237,2,2,0,0,1-2.237-2.237v-2.061h-5.787a1.324,1.324,0,0,0-1.458,1.507v14.929h5.494a2.237,2.237,0,1,1,0,4.473H423.6a2.237,2.237,0,0,1,0-4.473h4.522V346.606H424.13a2.238,2.238,0,0,1,0-4.474Z" transform="translate(-391.029 -166.577)"/><path d="M490.449,342.132a2,2,0,0,1,2.237,2.237v18.673h5.543a2.237,2.237,0,1,1,0,4.473H482.523a2.237,2.237,0,1,1,0-4.473h5.69V346.606h-4.686a2.237,2.237,0,0,1,0-4.474Zm2.317-9.672a3.217,3.217,0,1,1-3.194-3.195A3.241,3.241,0,0,1,492.766,332.46Z" transform="translate(-391.029 -166.577)"/><path d="M526.64,344.369a2.527,2.527,0,0,1-.147.875l-8.169,20.91a2.042,2.042,0,0,1-2.043,1.361h-3.258a2.027,2.027,0,0,1-2.091-1.361l-8.266-20.91a1.78,1.78,0,0,1-.195-.875,2.242,2.242,0,0,1,2.286-2.237,2.086,2.086,0,0,1,2.042,1.459l7.878,19.84,7.634-19.84a2.087,2.087,0,0,1,2.043-1.459A2.242,2.242,0,0,1,526.64,344.369Z" transform="translate(-391.029 -166.577)"/><path d="M408.844,342.132a4.268,4.268,0,0,1,4.506,4.611v20.772h-19.5a2.643,2.643,0,0,1-2.824-2.706v-7.153a4.533,4.533,0,0,1,3.842-4.474l14-1.961v-4.615H393.3a2.2,2.2,0,0,1-2.274-2.237,2.173,2.173,0,0,1,2.391-2.237Zm.032,20.91v-7.3L395.5,357.607v5.435Z" transform="translate(-391.029 -166.577)"/></g></svg></span>`;
    case "github":
      return `<span ${common}><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.4-1.27.74-1.56-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z"/></svg></span>`;
    case "hf":
      return `<img ${common} src="assets/brand/hf-logo.svg" width="20" height="20" alt="" style="display:inline-block;object-fit:contain;border-radius:4px" />`;
    case "modelscope":
      return `<img ${common} src="assets/brand/modelscope-icon.png" width="20" height="20" alt="" style="display:inline-block;object-fit:contain;border-radius:4px" />`;
    default:
      return `<span ${common}></span>`;
  }
}

function buildFamilyRail(): void {
  const rail = document.getElementById("family-rail");
  if (!rail) return;
  rail.innerHTML = familyChips
    .map(
      (c, i) =>
        `<a href="#family-${escapeHtml(c.id)}" data-rail="${escapeHtml(c.id)}" data-rail-active="${
          i === 0 ? "1" : "0"
        }">${escapeHtml(c.name)}</a>`,
    )
    .join("");

  // Tab-style switch: exactly one family is shown at a time, starting with the
  // first chip, so the page never opens with all five families stacked.
  const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>("a[data-rail]"));
  const firstId = familyChips[0]?.id ?? null;
  let currentId: string | null = firstId;

  const apply = (id: string) => {
    currentId = id;
    links.forEach((l) => {
      l.dataset.railActive = l.dataset.rail === id ? "1" : "0";
    });
    capabilities.forEach((c) => {
      const s = document.getElementById(`family-${c.id}`);
      if (s) s.hidden = c.id !== id;
    });
  };

  links.forEach((l) => {
    l.addEventListener("click", (e) => {
      e.preventDefault();
      const id = l.dataset.rail!;
      if (id === currentId) return;
      apply(id);
      history.replaceState(null, "", `#family-${id}`);
    });
  });

  // Honor a deep link, else fall back to the first family.
  const initial = window.location.hash.match(/family-([\w-]+)/)?.[1];
  const valid = initial && capabilities.some((c) => c.id === initial) ? initial : firstId;
  if (valid) apply(valid);
}

function buildDemos(): void {
  const root = document.getElementById("demos-body");
  if (!root) return;
  root.innerHTML = capabilities.map(renderFamily).join("\n");
}

function renderFamily(c: CapabilityFamily): string {
  return `
    <section class="family-section" id="family-${c.id}">
      <div class="family-section__intro">
        <h2 class="family-section__name">${escapeHtml(c.name)}</h2>
        <p class="family-section__lede">${escapeHtml(c.intro)}</p>
      </div>
      ${c.groups.map(renderGroup).join("\n")}
    </section>
  `;
}

function renderGroup(g: DemoGroup): string {
  return `
    <div class="demo-group" id="group-${g.id}">
      <div class="demo-group__head">
        <h3 class="demo-group__title">${escapeHtml(g.title)}</h3>
        <p class="demo-group__subtitle">${escapeHtml(g.subtitle)}</p>
      </div>
      <div class="demo-list">${g.samples.map((s) => renderSample(s, g)).join("\n")}</div>
    </div>
  `;
}

function renderSample(s: DemoSample, g: DemoGroup): string {
  if (isPlaceholder(s.audio)) {
    return `
      <article class="demo-card placeholder-card" data-sample-id="${escapeHtml(s.id)}">
        ${renderInstructionRow(s, g, escapeHtml(s.instruction))}
        <p class="placeholder-text">${escapeHtml(s.audio.text)}</p>
      </article>
    `;
  }
  return renderReal(s, g);
}

function renderReal(s: DemoSample, g: DemoGroup): string {
  const audio = s.audio as { src?: string; out?: string; outs?: { label: string; url: string }[] };
  if (audio.outs && audio.outs.length > 0 && audio.src) {
    // nv comes first: its emoji labels can overlap the emotion set (e.g. 😐).
    if (s.nvInstructions) {
      return renderNv(s, g, audio.src, audio.outs);
    }
    if (audio.outs.some((o) => /^[😄😡😭😱😐]/u.test(o.label))) {
      return renderEmotion(s, g, audio.src, audio.outs);
    }
    if (s.separateInstructions) {
      return renderSeparate(s, g, audio.src, audio.outs);
    }
    return renderSlider(s, g, audio.src, audio.outs);
  }
  return renderPair(s, g, audio.src, audio.out);
}

// The instruction row, or nothing at all when the group opts out. Every card
// now shows its input alongside its output, so the instruction always describes
// a real edit and never needs hiding.
function renderInstructionRow(
  s: DemoSample,
  g: DemoGroup,
  innerHtml: string,
  innerClass?: string,
): string {
  if (modeOf(g) === "none") return "";
  const body = innerClass ? `<span class="${innerClass}">${innerHtml}</span>` : innerHtml;
  return `<p class="demo-card__instruction"><span class="demo-card__instruction-label">Instruction:</span> ${body}</p>`;
}

/** The input row: a labelled, single-track player above the output row. */
function renderInputRow(url: string): string {
  const cfg = JSON.stringify({ tracks: [{ url, label: "Input" }] }).replace(/'/g, "&#39;");
  return `
      <div class="auk-stack__row">
        <span class="auk-stack__label">Input</span>
        <div class="auk-player-mount" data-auk-player='${cfg}'></div>
      </div>`;
}

/** The output row, carrying whatever switch the card needs in its own header. */
function renderOutputRow(tracks: { url: string; label: string }[], dataAttrs = ""): string {
  const cfg = JSON.stringify({
    tracks: tracks.map((o, i) => ({
      ...o,
      side: (i === 0 ? "a" : i === 1 ? "b" : undefined) as "a" | "b" | undefined,
    })),
  }).replace(/'/g, "&#39;");
  return `
      <div class="auk-stack__row">
        <span class="auk-stack__label">Output</span>
        <div class="auk-player-mount" data-auk-player='${cfg}'${dataAttrs}></div>
      </div>`;
}

// Content-editing and nonverbal-edit cards stack the input above the output and
// put one button per edit operation in the output row's switch, so the edit can
// be heard against the source without switching away from it.
function renderNv(s: DemoSample, g: DemoGroup, src: string, outs: { label: string; url: string }[]): string {
  // The input has its own row now, so it is dropped from the output switch.
  const outputs = outs.filter((o) => !isInputLabel(o.label));
  let map: Record<string, string> = {};
  try {
    map = JSON.parse(s.nvInstructions ?? "{}") as Record<string, string>;
  } catch {
    map = {};
  }
  const firstLabel = outputs[0]?.label ?? "";
  const firstInstr = map[firstLabel] ?? s.instruction;
  const attrs = ` data-nv-instr='${escapeHtml(s.nvInstructions ?? "{}")}' data-nv-marks='${escapeHtml(s.transcriptMarks ?? "{}")}'`;
  return `
    <article class="demo-card demo-card--stack" data-sample-id="${escapeHtml(s.id)}" data-nv>
      ${renderInstructionRow(s, g, escapeHtml(firstInstr), "auk-nv__instr")}
      ${renderTranscriptBlock(s, firstLabel)}
      ${renderInputRow(src)}
      ${renderOutputRow(outputs, attrs)}
    </article>
  `;
}

// Separate-speech cards stack the input waveform above the output waveform, so
// the separation can be judged by comparing the two shapes side by side rather
// than by switching one player back and forth. The output player carries the
// two extraction modes (by content / by speaking order) in its own switch.
function renderSeparate(s: DemoSample, g: DemoGroup, src: string, outs: { label: string; url: string }[]): string {
  const outputs = outs
    .filter((o) => !isInputLabel(o.label))
    .map((o) => ({
      url: o.url,
      label: o.label.startsWith("Output1") ? "Output1" : o.label.startsWith("Output2") ? "Output2" : o.label,
    }));
  const ins = s.separateInstructions!;
  const attrs = ` data-separate-instr='${escapeHtml(JSON.stringify(ins))}'`;
  return `
    <article class="demo-card demo-card--stack" data-sample-id="${escapeHtml(s.id)}" data-separate>
      ${renderInstructionRow(s, g, escapeHtml(ins.content), "auk-separate__instr")}
      ${renderTranscriptBlock(s, "Input")}
      ${renderInputRow(src)}
      ${renderOutputRow(outputs, attrs)}
    </article>
  `;
}

// Emotion labels carry the emoji and the emotion key, e.g. "😄 happy".
// The instruction template uses "<emotion>" as a placeholder that resolves to
// the selected emotion's name at render time.
const EMOTION_EN: Record<string, string> = { happy: "happy", angry: "angry", sad: "sad", afraid: "afraid", calm: "calm" };

function renderEmotion(s: DemoSample, g: DemoGroup, src: string, outs: { label: string; url: string }[]): string {
  const stops = outs.map((o, i) => ({ idx: i, label: o.label, url: o.url }));
  const keyOf = (label: string) => label.split(/\s+/)[1] ?? "";
  // `defaultEmotion` names the emotion the source clip already carries, so that
  // stop replays the input. The card now shows the input on its own row, so the
  // slider opens on a real edit instead — the stop furthest from the source, to
  // make the contrast between the two waveforms as audible as possible.
  const sourceIdx = s.defaultEmotion
    ? stops.findIndex((o) => keyOf(o.label) === s.defaultEmotion)
    : stops.findIndex((o) => o.url === src);
  const resolvedIdx =
    sourceIdx >= 0
      ? stops.reduce((best, o) => {
          if (o.url === src) return best;
          return Math.abs(o.idx - sourceIdx) > Math.abs(best - sourceIdx) ? o.idx : best;
        }, stops.find((o) => o.url !== src)?.idx ?? 0)
      : 0;
  const cfgJson = JSON.stringify({ emotion: { lang: s.lang, src, stops, defaultIdx: resolvedIdx } }).replace(/'/g, "&#39;");

  const pct = (i: number) => (stops.length > 1 ? (i / (stops.length - 1)) * 100 : 0);

  const emojiOf = (label: string) => label.split(/\s+/)[0] ?? "😐";
  const nameOf = (label: string) => {
    const key = label.split(/\s+/)[1] ?? "";
    return EMOTION_EN[key] ?? key;
  };

  const stopsHtml = stops
    .map(
      (o, i) =>
        `<button type="button" class="auk-slider__stop auk-emotion__stop" data-idx="${i}" style="left:${pct(i)}%" aria-pressed="${
          i === resolvedIdx ? "true" : "false"
        }" title="${escapeHtml(o.label)}"><span class="auk-emotion__emoji">${escapeHtml(emojiOf(o.label))}</span></button>`,
    )
    .join("");

  const firstUrl = stops[resolvedIdx]?.url ?? src;

  // One stop points back at the source clip — the input already carries that
  // emotion — so it is labelled as the source rather than as an edit.
  const instructionFor = (idx: number) =>
    stops[idx]?.url === src
      ? "The input already has this emotion — no edit applied"
      : s.instruction.replace(/<emotion>/g, nameOf(stops[idx]?.label ?? ""));

  return `
    <article class="demo-card demo-card--stack" data-sample-id="${escapeHtml(s.id)}" data-emotion>
      ${renderInstructionRow(s, g, escapeHtml(instructionFor(resolvedIdx)), "auk-emotion__instr")}
      <div class="auk-slider auk-emotion" data-auk-emotion='${cfgJson}' data-emo-src='${escapeHtml(src)}' data-instr-template='${escapeHtml(s.instruction)}'>
        <div class="auk-slider__labels">${stopsHtml}</div>
        <div class="auk-slider__rail" role="slider" tabindex="0" aria-label="Emotion edit — drag to change the emotion" aria-valuemin="0" aria-valuemax="${stops.length - 1}" aria-valuenow="${resolvedIdx}">
          <div class="auk-slider__fill"></div>
          <div class="auk-slider__thumb" style="left: ${pct(resolvedIdx)}%"></div>
        </div>
      </div>
      ${renderInputRow(src)}
      ${renderOutputRow([{ url: firstUrl, label: "Output" }])}
    </article>
  `;
}

function renderPair(s: DemoSample, g: DemoGroup, src?: string, out?: string): string {
  // A group whose text is folded into the instruction needs no separate quoted
  // block; otherwise the transcript is shown when it is real (not a `<...>`).
  const hasTr = !g.inlineTranscript && s.transcript?.trim() && !s.transcript!.trim().startsWith("<");
  const instrRow = renderInstructionRow(s, g, renderInstruction(s, g));
  const trBlock = hasTr ? renderTranscriptBlock(s, "Output") : "";

  // A generated-only card (text-to-speech) has no source to compare against, so
  // it stays a single player rather than an empty Input row.
  if (!src) {
    const cfg = JSON.stringify({ tracks: [{ url: out ?? "", label: "Output" }] }).replace(/'/g, "&#39;");
    return `
    <article class="demo-card" data-sample-id="${escapeHtml(s.id)}">
      ${instrRow}
      ${trBlock}
      <div class="auk-player-mount" data-auk-player='${cfg}'></div>
    </article>
  `;
  }
  // Input and output are both on screen, so the pair needs no A/B switch: the
  // output row simply carries the single generated track (or the source again
  // when no output exists yet).
  return `
    <article class="demo-card demo-card--stack" data-sample-id="${escapeHtml(s.id)}">
      ${instrRow}
      ${trBlock}
      ${renderInputRow(src)}
      ${renderOutputRow([{ url: out ?? src, label: "Output" }])}
    </article>
  `;
}

// For a text-to-speech group the spoken text *is* the request, so it is folded
// into the instruction as a quoted clause instead of standing alone in its own
// block. A `<...>` value is still an unfilled placeholder, so it is dropped.
function renderInstruction(s: DemoSample, g: DemoGroup): string {
  const t = s.transcript?.trim();
  const shown = t && !t.startsWith("<") ? t : "";
  if (g.inlineTranscript && shown) {
    const joiner = g.transcriptConnector ?? ": ";
    return `${escapeHtml(s.instruction)}${escapeHtml(joiner)}“${escapeHtml(shown)}”`;
  }
  return escapeHtml(s.instruction);
}

// Build the transcript with the active operation's annotations:
// deleted spans get a red strike, added spans a green background, replaced
// spans show the old words struck in blue followed by the new words in blue.
function renderTranscriptMarked(transcript: string, marks?: { add?: string[] | { text: string; after?: string; before?: string }[]; delete?: string[]; change?: { from: string; to: string }[] }): string {
  let html = escapeHtml(transcript);
  if (!marks) return html;
  const del = (text: string) => `<mark class="tr-del">${escapeHtml(text)}</mark>`;
  const add = (text: string) => `<mark class="tr-add">${escapeHtml(text)}</mark>`;
  const chg = (from: string, to: string) => `<mark class="tr-chg"><s>${escapeHtml(from)}</s> → ${escapeHtml(to)}</mark>`;
  const sortByLen = (arr: string[]) => arr.slice().sort((a, b) => b.length - a.length);
  // Match against the escaped text, so apostrophes etc. in the transcript line
  // up with the escaped marks (`'` → `&#39;`).
  const esc = escapeHtml;
  for (const c of (marks.change ?? []).slice().sort((a, b) => b.from.length - a.from.length)) {
    html = html.split(esc(c.from)).join(chg(c.from, c.to));
  }
  for (const d of sortByLen(marks.delete ?? [])) {
    html = html.split(esc(d)).join(del(d));
  }
  // Adds may be anchored: { text, after } inserts the green span right after
  // `after`; { text, before } right before `before`; a bare string is appended.
  for (const a of marks.add ?? []) {
    const ins = typeof a === "string" ? { text: a } : a;
    if (ins.before && html.includes(esc(ins.before))) {
      html = html.split(esc(ins.before)).join(add(ins.text) + esc(ins.before));
    } else if (ins.after && html.includes(esc(ins.after))) {
      html = html.split(esc(ins.after)).join(esc(ins.after) + add(ins.text));
    } else {
      html += add(ins.text);
    }
  }
  return html;
}

// The transcript block under a card, annotated for the currently selected
// output label. Returns "" for samples without a real transcript.
function renderTranscriptBlock(s: DemoSample, label: string): string {
  const t = s.transcript?.trim();
  if (!t || t.startsWith("<")) return "";
  let marks: { add?: string[] | { text: string; after?: string; before?: string }[]; delete?: string[]; change?: { from: string; to: string }[] } | undefined;
  try {
    const all = JSON.parse(s.transcriptMarks ?? "{}") as Record<string, { add?: string[] | { text: string; after?: string; before?: string }[]; delete?: string[]; change?: { from: string; to: string }[] }>;
    marks = all[label];
  } catch {
    marks = undefined;
  }
  return `<p class="demo-card__transcript" data-tr-label="${escapeHtml(label)}" data-raw="${escapeHtml(t)}">${renderTranscriptMarked(t, marks)}</p>`;
}

const SOURCE_STOP = /\(\s*source\s*\)/i;

function renderSlider(s: DemoSample, g: DemoGroup, src: string, outs: { label: string; url: string }[]): string {
  const stops = outs.map((o, i) => ({ idx: i, label: o.label, url: o.url }));
  const resolvedIdx = resolvedDefault(stops);
  const cfgJson = JSON.stringify({ slider: { stops, defaultIdx: resolvedIdx } }).replace(/'/g, "&#39;");

  const pct = (i: number) => (stops.length > 1 ? (i / (stops.length - 1)) * 100 : 0);
  // The "(source)" suffix is dropped from the visible tick label — it would
  // crowd its neighbours — and re-surfaced as a marker under the rail instead.
  const shortLabel = (l: string) => l.replace(SOURCE_STOP, "").trim();

  const stopsHtml = stops
    .map(
      (o, i) =>
        `<button type="button" class="auk-slider__stop" data-idx="${i}" style="left:${pct(i)}%" aria-pressed="${
          i === resolvedIdx ? "true" : "false"
        }" title="${escapeHtml(o.label)}"><span class="auk-slider__label">${escapeHtml(shortLabel(o.label))}</span></button>`,
    )
    .join("");
  const ticksHtml = stops
    .map(
      (o, i) =>
        `<span class="auk-slider__tick${SOURCE_STOP.test(o.label) ? " is-source" : ""}" style="left:${pct(i)}%"></span>`,
    )
    .join("");
  const sourceIdx = stops.findIndex((o) => SOURCE_STOP.test(o.label));
  const sourceTag =
    sourceIdx >= 0 ? `<span class="auk-slider__source" style="left:${pct(sourceIdx)}%">source</span>` : "";

  const firstUrl = stops[resolvedIdx]?.url ?? src;
  return `
    <article class="demo-card demo-card--stack" data-sample-id="${escapeHtml(s.id)}" data-slider>
      ${renderInstructionRow(s, g, escapeHtml(s.instruction))}
      <div class="auk-slider" data-auk-slider='${cfgJson}'>
        <div class="auk-slider__labels">${stopsHtml}</div>
        <div class="auk-slider__rail" role="slider" tabindex="0" aria-label="${escapeHtml(s.instruction || s.label)} — drag to change the output" aria-valuemin="0" aria-valuemax="${stops.length - 1}" aria-valuenow="${resolvedIdx}">
          <div class="auk-slider__ticks">${ticksHtml}</div>
          <div class="auk-slider__fill"></div>
          <div class="auk-slider__thumb" style="left: ${pct(resolvedIdx)}%"></div>
        </div>
        <div class="auk-slider__foot">${sourceTag}</div>
      </div>
      ${renderInputRow(src)}
      ${renderOutputRow([{ url: firstUrl, label: "Output" }])}
    </article>
  `;
}

function attachBibtexCopy(): void {
  const btn = document.getElementById("copy-bibtex");
  const code = document.getElementById("bibtex-code");
  const status = document.getElementById("bibtex-status");
  if (!btn || !code || !status) return;
  btn.addEventListener("click", async () => {
    const text = code.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "BibTeX copied to clipboard.";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        status.textContent = "BibTeX copied to clipboard.";
      } catch {
        status.textContent = "Copy failed — please select the text manually.";
      }
      ta.remove();
    }
    setTimeout(() => (status.textContent = ""), 4000);
  });
}

function attachSliderLogic(): void {
  document.querySelectorAll<HTMLElement>(".auk-slider").forEach((slider) => {
    let stops: { idx: number; label: string; url: string }[] = [];
    let isEmotion = false;
    let emoDefault = 0;
    let emoSrc = "";
    try {
      const raw = slider.dataset.aukSlider ?? slider.dataset.aukEmotion ?? "{}";
      isEmotion = "aukEmotion" in slider.dataset;
      const parsed = JSON.parse(raw) as {
        slider?: { stops?: { idx: number; label: string; url: string }[] };
        emotion?: { lang?: string; src?: string; stops?: { idx: number; label: string; url: string }[]; defaultIdx?: number };
      };
      stops = (isEmotion ? parsed.emotion?.stops : parsed.slider?.stops) ?? [];
      emoDefault = parsed.emotion?.defaultIdx ?? 0;
      emoSrc = parsed.emotion?.src ?? "";
    } catch {
      return;
    }
    if (stops.length === 0) return;
    const rail = slider.querySelector<HTMLElement>(".auk-slider__rail");
    const fill = slider.querySelector<HTMLElement>(".auk-slider__fill");
    const thumb = slider.querySelector<HTMLElement>(".auk-slider__thumb");
    const card = slider.closest<HTMLElement>(".demo-card[data-slider], .demo-card[data-emotion]");
    const instrEl = card?.querySelector<HTMLElement>(".auk-emotion__instr");
    const template = slider.dataset.instrTemplate ?? "";
    let currentIdx = 0;

    const rebuildPlayer = (idx: number) => {
      const stop = stops[idx];
      if (!stop || !card) return;
      // Re-query every time: the previous rebuild replaced the node, so a
      // reference captured earlier would be detached from the document. The
      // input row is fixed, so only the output row's player is rebuilt.
      const rows = card.querySelectorAll<HTMLElement>(".auk-stack__row");
      const outRow = rows[rows.length - 1];
      const current = outRow?.querySelector<HTMLElement>(".auk-player-mount");
      if (!current) return;
      const cfg = JSON.stringify({
        tracks: [{ url: stop.url, label: "Output" }],
      }).replace(/'/g, "&#39;");
      const fresh = document.createElement("div");
      fresh.className = "auk-player-mount";
      fresh.dataset.aukPlayer = cfg;
      current.replaceWith(fresh);
      import("./scripts/audio-player").then((m) => {
        (m as { mountAllAudioPlayers: () => void }).mountAllAudioPlayers();
      });
    };

    const render = (idx: number) => {
      currentIdx = idx;
      const ratio = stops.length > 1 ? idx / (stops.length - 1) : 0;
      if (fill) fill.style.width = `${ratio * 100}%`;
      if (thumb) thumb.style.left = `${ratio * 100}%`;
      if (rail) rail.setAttribute("aria-valuenow", String(idx));
      slider.querySelectorAll<HTMLButtonElement>(".auk-slider__stop").forEach((b, i) => {
        b.setAttribute("aria-pressed", i === idx ? "true" : "false");
      });
      if (isEmotion && instrEl) {
        const stop = stops[idx];
        const key = (stop?.label ?? "").split(/\s+/)[1] ?? "";
        const isSource = !!stop && !!emoSrc && stop.url === emoSrc;
        instrEl.textContent = isSource
          ? "The input already has this emotion — no edit applied"
          : template.replace(/<emotion>/g, EMOTION_EN[key] ?? key);
      }
    };

    const idxFromEvent = (clientX: number): number => {
      const rect = rail?.getBoundingClientRect();
      if (!rect || rect.width === 0) return 0;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (stops.length - 1));
    };

    const apply = (clientX: number, commit: boolean) => {
      const idx = idxFromEvent(clientX);
      render(idx);
      if (commit) rebuildPlayer(idx);
    };

    let dragging = false;
    rail?.addEventListener("pointerdown", (e) => {
      dragging = true;
      rail.setPointerCapture(e.pointerId);
      apply(e.clientX, false);
    });
    rail?.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      apply(e.clientX, false);
    });
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (rail) rail.releasePointerCapture(e.pointerId);
      apply(e.clientX, true);
    };
    rail?.addEventListener("pointerup", endDrag);
    rail?.addEventListener("pointercancel", endDrag);
    rail?.addEventListener("keydown", (e) => {
      let next = currentIdx;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(stops.length - 1, currentIdx + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, currentIdx - 1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = stops.length - 1;
      else return;
      e.preventDefault();
      render(next);
      rebuildPlayer(next);
    });

    slider.querySelectorAll<HTMLButtonElement>(".auk-slider__stop").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        if (i === currentIdx) return;
        render(i);
        rebuildPlayer(i);
      });
    });

    render(isEmotion ? emoDefault : resolvedDefault(stops));
  });
}

// The card shows the source on its own Input row, so the slider opens one stop
// past the source rather than on it — otherwise both rows would play the same
// clip and the edit would look like a no-op.
function resolvedDefault(stops: { idx: number; label: string; url: string }[]): number {
  const source = stops.findIndex((x) => SOURCE_STOP.test(x.label));
  if (source < 0) return Math.floor((stops.length - 1) / 2);
  return source + 1 < stops.length ? source + 1 : Math.max(0, source - 1);
}

function attachModelTabs(): void {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".model-tab"));
  const panes = Array.from(document.querySelectorAll<HTMLElement>(".model-pane"));
  if (tabs.length === 0 || panes.length === 0) return;

  const show = (model: string) => {
    tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.model === model ? "true" : "false"));
    panes.forEach((p) => (p.hidden = p.dataset.model !== model));
    // Resource buttons follow the selected model variant (AuK vs AuK-Flash).
    document
      .querySelectorAll<HTMLAnchorElement>('#resource-links a[data-href-auk][data-href-flash]')
      .forEach((a) => {
        a.href = model === "flash" ? a.dataset.hrefFlash! : a.dataset.hrefAuk!;
      });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => show(tab.dataset.model!));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      show(next.dataset.model!);
    });
  });
}

function attachTrackSwitches(): void {
  // Generic rule for every card: re-annotate the transcript for the newly
  // selected output. The instruction row is never hidden — the input has its
  // own row, so the switch only ever moves between real outputs.
  document.querySelectorAll<HTMLElement>(".demo-card").forEach((card) => {
    card.addEventListener("auk-track-change", (e) => {
      const ev = e as CustomEvent<{ label: string }>;
      const label = ev.detail.label;
      const trEl = card.querySelector<HTMLElement>(".demo-card__transcript");
      const mount = card.querySelector<HTMLElement>(".auk-player-mount[data-nv-marks]");
      if (trEl && mount) {
        let marks: Record<string, { add?: string[] | { text: string; after?: string; before?: string }[]; delete?: string[]; change?: { from: string; to: string }[] }> = {};
        try {
          marks = JSON.parse(mount.dataset.nvMarks || "{}") as typeof marks;
        } catch {
          marks = {};
        }
        trEl.dataset.trLabel = label;
        // Always re-mark from the raw text, so successive switches don't stack
        // highlight tags onto already-tagged markup.
        trEl.innerHTML = renderTranscriptMarked(trEl.dataset.raw ?? "", marks[label]);
      }
    });
  });

  // Separate-speech: the output player's switch picks the extraction mode, so
  // the instruction follows it. The input waveform above it never changes.
  document.querySelectorAll<HTMLElement>(".demo-card[data-separate]").forEach((card) => {
    card.addEventListener("auk-track-change", (e) => {
      const ev = e as CustomEvent<{ label: string }>;
      const instrEl = card.querySelector<HTMLElement>(".auk-separate__instr");
      const mount = card.querySelector<HTMLElement>(".auk-player-mount[data-separate-instr]");
      if (!instrEl || !mount) return;
      let ins: { content: string; number: string } | null = null;
      try {
        ins = JSON.parse(mount.dataset.separateInstr || "null");
      } catch {
        return;
      }
      if (!ins) return;
      const label = ev.detail.label;
      instrEl.textContent = label === "Output2" ? ins.number : ins.content;
    });
  });

  document.querySelectorAll<HTMLElement>(".demo-card[data-nv]").forEach((card) => {
    card.addEventListener("auk-track-change", (e) => {
      const ev = e as CustomEvent<{ label: string }>;
      const label = ev.detail.label;
      const instrEl = card.querySelector<HTMLElement>(".auk-nv__instr");
      const mount = card.querySelector<HTMLElement>(".auk-player-mount[data-nv-instr]");
      if (!instrEl || !mount) return;
      let map: Record<string, string> = {};
      try {
        map = JSON.parse(mount.dataset.nvInstr || "{}") as Record<string, string>;
      } catch {
        return;
      }
      instrEl.textContent = map[label] ?? "";
    });
  });
}

function attachVideoLangSwitch(): void {
  // Toggle the demo video between the English and Mandarin cuts without
  // changing the rest of the page.
  const video = document.getElementById("demo-video") as HTMLVideoElement | null;
  if (!video) return;
  const btns = document.querySelectorAll<HTMLButtonElement>(".video-lang-btn");
  const sources: Record<string, string> = {
    en: "assets/video/auk-overview.mp4",
    zh: "assets/video/auk-overview-zh.mp4",
  };
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.videoLang;
      if (!lang || !sources[lang]) return;
      const wasPlaying = !video.paused && !video.ended;
      const t = video.currentTime;
      video.src = sources[lang];
      video.load();
      video.currentTime = t;
      if (wasPlaying) video.play().catch(() => undefined);
      btns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
    });
  });
}

function init(): void {
  buildResourceLinks();
  // Demos must exist before the rail runs: the rail hides every family but the
  // selected one, and it looks those sections up by id.
  buildDemos();
  buildFamilyRail();
  attachModelTabs();
  attachBibtexCopy();
  attachSliderLogic();
  mountAllAudioPlayers();
  attachTrackSwitches();
  attachVideoLangSwitch();
  window.addEventListener("resize", redrawAllPlayers);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
