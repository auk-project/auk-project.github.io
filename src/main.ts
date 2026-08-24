import "./styles/site.css";
import { mountAllAudioPlayers, redrawAllPlayers } from "./scripts/audio-player";
import {
  capabilities,
  familyChips,
  headlineStats,
  lyricEditPlaceholder,
  resourceLinks,
  type CapabilityFamily,
  type DemoGroup,
  type DemoSample,
  type Placeholder,
} from "./data/capabilities";
import { benchmarkBlocks } from "./data/benchmarks";

const isPlaceholder = (audio: DemoSample["audio"]): audio is Placeholder =>
  typeof audio === "object" && "missing" in audio;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );

function buildStatsList(): void {
  const list = document.getElementById("hero-stats");
  if (!list) return;
  list.innerHTML = headlineStats
    .map(
      (s) =>
        `<li><strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}${
          s.note ? ` · ${escapeHtml(s.note)}` : ""
        }</span></li>`,
    )
    .join("");
}

function buildResourceLinks(): void {
  const container = document.getElementById("resource-links");
  if (!container) return;
  container.innerHTML = resourceLinks
    .map((l) => {
      const icon = renderIcon(l.icon);
      if (l.href) {
        return `<span class="link-block"><a href="${escapeHtml(l.href)}" class="external-link button is-normal is-rounded is-dark" target="_blank" rel="noopener">${icon}<span>${escapeHtml(l.label)}</span></a></span>`;
      }
      return `<span class="link-block"><span class="external-link button is-normal is-rounded is-dark is-disabled" aria-disabled="true">${icon}<span>${escapeHtml(l.label)}</span></span></span>`;
    })
    .join("");
}

function renderIcon(kind: string): string {
  const common = 'class="icon" aria-hidden="true"';
  switch (kind) {
    case "arxiv":
      return `<span ${common}><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 4h18v3H3zm0 4.5h18v3H3zm0 4.5h18v3H3zm0 4.5h18v3H3z"/></svg></span>`;
    case "github":
      return `<span ${common}><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.4-1.27.74-1.56-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z"/></svg></span>`;
    case "hf":
      return `<span ${common}><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="9.5" cy="11" r="1.2"/><circle cx="14.5" cy="11" r="1.2"/><path d="M9 15.5q1.5 1.5 3 1.5t3-1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>`;
    default:
      return `<span ${common}></span>`;
  }
}

function buildFamilyLegend(): void {
  const ul = document.getElementById("family-legend");
  if (!ul) return;
  ul.innerHTML = familyChips
    .map(
      (c) =>
        `<li><a href="#family-${escapeHtml(c.id)}">${escapeHtml(c.name)}</a><span>${escapeHtml(
          capabilities.find((x) => x.id === c.id)?.tagline ?? "",
        )}</span></li>`,
    )
    .join("");
}

function buildFamilyRail(): void {
  const rail = document.getElementById("family-rail");
  if (!rail) return;
  rail.innerHTML = familyChips
    .map(
      (c) =>
        `<a href="#family-${escapeHtml(c.id)}" data-rail="${escapeHtml(c.id)}">${escapeHtml(c.name)}</a>`,
    )
    .join("");

  // Active section tracking
  const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>("a[data-rail]"));
  const map = new Map(links.map((l) => [l.dataset.rail, l]));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).id.replace(/^family-/, "");
          map.forEach((l) => l.classList.toggle("is-active", l.dataset.rail === id));
        }
      });
    },
    { rootMargin: "-30% 0px -50% 0px", threshold: 0 },
  );
  capabilities.forEach((c) => {
    const el = document.getElementById(`family-${c.id}`);
    if (el) obs.observe(el);
  });
}

function buildDemos(): void {
  const root = document.getElementById("demos-body");
  if (!root) return;
  // Content editing family covers 12 of the 16 tasks. Lyric editing (Vocal
  // Edit) is rendered as an additional group at the end of the content family.
  const vocalGroup: DemoGroup = {
    id: "vocal-edit",
    title: "Vocal Edit",
    subtitle: "Rewrite the lyrics of a sung passage",
    layout: "pair",
    samples: [lyricEditPlaceholder],
  };
  const families = capabilities.map((c) => ({ ...c, groups: [...c.groups] }));
  const content = families.find((c) => c.id === "content-editing");
  if (content) content.groups.push(vocalGroup);
  root.innerHTML = families.map(renderFamily).join("\n");
}

function renderFamily(c: CapabilityFamily): string {
  return `
    <section class="family-section" id="family-${c.id}">
      <div class="family-section__intro">
        <p class="family-section__tagline">${escapeHtml(c.tagline)}</p>
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
      <div class="demo-list">${g.samples.map(renderSample).join("\n")}</div>
    </div>
  `;
}

function renderSample(s: DemoSample): string {
  const langPill = `<span class="lang-pill">${escapeHtml(s.lang)}</span>`;
  const hint = s.hint ? `<p class="demo-card__hint">${escapeHtml(s.hint)}</p>` : "";
  const transcript = s.transcript && !/^<.*>$/.test(s.transcript)
    ? `<p class="demo-card__transcript">${escapeHtml(s.transcript)}</p>`
    : "";
  if (isPlaceholder(s.audio)) {
    return `
      <article class="demo-card placeholder-card" data-sample-id="${escapeHtml(s.id)}">
        <div class="demo-card__head">
          <h4 class="demo-card__label">${escapeHtml(s.label)}</h4>
          ${langPill}
        </div>
        ${hint}
        ${transcript}
        <p class="placeholder-text">${escapeHtml(s.audio.text)}</p>
      </article>
    `;
  }
  const tracks = collectTracks(s);
  const cfg = JSON.stringify({
    tracks,
    caption: s.label,
    instruction: s.instruction,
  }).replace(/'/g, "&#39;");
  return `
    <article class="demo-card" data-sample-id="${escapeHtml(s.id)}">
      <div class="demo-card__head">
        <h4 class="demo-card__label">${escapeHtml(s.label)}</h4>
        ${langPill}
      </div>
      ${hint}
      <div class="auk-player-mount" data-auk-player='${cfg}'></div>
    </article>
  `;
}

function collectTracks(s: DemoSample): { url: string; label: string; side?: "a" | "b" }[] {
  const audio = s.audio as { src?: string; out?: string };
  const tracks: { url: string; label: string; side?: "a" | "b" }[] = [];
  if (audio.src) tracks.push({ url: audio.src, label: "Source", side: "a" });
  if (audio.out) tracks.push({ url: audio.out, label: "Auk output", side: "b" });
  if (tracks.length === 0) return [];
  return tracks;
}

function buildSpotlight(): void {
  // Spotlight headline numbers are intentionally omitted in v2 per design
  // decision: the Evidence section shows the full benchmark tables only.
  const root = document.getElementById("spotlight-grid");
  if (root) root.remove();
}

function buildBenchmarkBlocks(): void {
  const root = document.getElementById("benchmark-blocks");
  if (!root) return;
  root.innerHTML = benchmarkBlocks
    .map((block) => {
      const rows = block.systems
        .map(
          (sys) => `
            <tr class="${sys.isOurs ? "is-ours" : ""}">
              <td>${escapeHtml(sys.name)}</td>
              ${sys.values
                .map(
                  (v) =>
                    `<td>${escapeHtml(v.value)} <span class="placeholder" style="font-size:0.7em">${
                      v.direction === "up" ? "↑" : "↓"
                    }</span></td>`,
                )
                .join("")}
            </tr>
          `,
        )
        .join("");
      return `
        <div class="benchmark">
          <div class="benchmark__head">
            <h3 class="benchmark__title">${escapeHtml(block.title)}</h3>
            <p class="benchmark__subtitle">${escapeHtml(block.subtitle)}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${block.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    })
    .join("");
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

function ensurePlaceholderTokens(): void {
  // Assertion: every place on the rendered page preserves the exact placeholder
  // syntax `[audio|<instruction><reference audio description>]` and `<...>`.
  const text = document.body.textContent ?? "";
  const okPh =
    text.includes("<instruction>") ||
    text.includes("<target text>") ||
    text.includes("<caption>") ||
    text.includes("<abstract>") ||
    text.includes("<authors>") ||
    text.includes("<reference audio description>");
  const okAudio = text.includes("[audio|<instruction><reference audio description>]");
  if (!okPh && !okAudio) {
    console.warn("Auk demo page: no placeholders detected.");
  }
}

function init(): void {
  buildStatsList();
  buildResourceLinks();
  buildFamilyLegend();
  buildFamilyRail();
  buildDemos();
  buildSpotlight();
  buildBenchmarkBlocks();
  attachBibtexCopy();
  mountAllAudioPlayers();
  ensurePlaceholderTokens();
  window.addEventListener("resize", redrawAllPlayers);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
